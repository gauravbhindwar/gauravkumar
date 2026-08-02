import mongoose from 'mongoose';
import { HttpsProxyAgent } from 'https-proxy-agent';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env.local file');
}

// Global connection object
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If the connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, wait for it
  if (!cached.promise) {
    // Proxy configuration
    let proxyAgent = null;
    if (process.env.MONGODB_USE_PROXY === 'true' && process.env.MONGODB_PROXY_HOST) {
      const proxyUrl = process.env.MONGODB_PROXY_USERNAME && process.env.MONGODB_PROXY_PASSWORD
        ? `http://${process.env.MONGODB_PROXY_USERNAME}:${process.env.MONGODB_PROXY_PASSWORD}@${process.env.MONGODB_PROXY_HOST}:${process.env.MONGODB_PROXY_PORT || 8080}`
        : `http://${process.env.MONGODB_PROXY_HOST}:${process.env.MONGODB_PROXY_PORT || 8080}`;
      
      proxyAgent = new HttpsProxyAgent(proxyUrl);
      console.log('🔄 Using proxy for MongoDB connection:', process.env.MONGODB_PROXY_HOST);
    }

    const opts = {
      bufferCommands: false,
      // Network timeout settings for better connectivity
      connectTimeoutMS: 30000,     // 30 seconds for initial connection
      socketTimeoutMS: 45000,      // 45 seconds for socket operations
      serverSelectionTimeoutMS: 30000, // 30 seconds for server selection
      heartbeatFrequencyMS: 10000, // 10 seconds heartbeat
      
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 30000,
      
      // Retry and reliability settings
      retryWrites: true,
      retryReads: true,
      
      // Read preference for better availability
      readPreference: 'primaryPreferred',
      
      // Write concern for reliability
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 10000
      },
      
      // Network and performance optimizations
      compressors: ['zlib'],
      zlibCompressionLevel: 6,

      // Additional network resilience
      family: 4, // Use IPv4
      
      // Add proxy agent if configured
      ...(proxyAgent && { proxyAgent }),
    };

    // Connect to MongoDB with retry mechanism
    cached.promise = connectWithRetry(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Retry connection function for better network resilience
async function connectWithRetry(uri, options, maxRetries = 3, delay = 2000) {
  const uris = [uri];
  
  // Add alternative URI if available
  if (process.env.MONGODB_URI_ALT && uri !== process.env.MONGODB_URI_ALT) {
    uris.push(process.env.MONGODB_URI_ALT);
  }
  
  for (const currentUri of uris) {
    console.log(`🔄 Trying URI: ${currentUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`MongoDB connection attempt ${attempt}/${maxRetries}`);
        const connection = await mongoose.connect(currentUri, options);
        console.log('✅ MongoDB connected successfully with optimized settings');
        return connection;
      } catch (error) {
        console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          console.error(`🚫 All attempts failed for this URI`);
          if (currentUri === uris[uris.length - 1]) {
            throw error; // This was the last URI and last attempt
          }
          break; // Try next URI
        }
        
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.2; // Gradual backoff
      }
    }
    
    // Reset delay for next URI
    delay = 2000;
  }
}

// Add additional utility for optimized queries
connectToDatabase.model = (name, schema) => {
  // Connect first to ensure schemas are registered properly
  connectToDatabase();
  return mongoose.models[name] || mongoose.model(name, schema);
};

export default connectToDatabase;
