#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');
const mongoose = require('mongoose');

// List of free proxy servers to try
const FREE_PROXIES = [
  'proxy.example.com:8080',
  'free-proxy.com:8080',
  'public-proxy.com:3128',
  // Add more free proxies here
];

// Alternative: Use system proxy settings
function getSystemProxy() {
  return process.env.https_proxy || 
         process.env.HTTPS_PROXY || 
         process.env.http_proxy || 
         process.env.HTTP_PROXY;
}

async function testProxyConnection(proxyUrl, mongoUri) {
  try {
    console.log(`Testing proxy: ${proxyUrl}`);
    
    const agent = new HttpsProxyAgent(proxyUrl);
    const options = {
      proxyAgent: agent,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };
    
    await mongoose.connect(mongoUri, options);
    await mongoose.disconnect();
    
    console.log(`✅ Proxy ${proxyUrl} works!`);
    return true;
  } catch (error) {
    console.log(`❌ Proxy ${proxyUrl} failed: ${error.message}`);
    return false;
  }
}

async function findWorkingProxy() {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not found in .env.local');
    return;
  }
  
  console.log('🔍 Searching for working proxy...');
  
  // First try system proxy
  const systemProxy = getSystemProxy();
  if (systemProxy) {
    console.log(`Found system proxy: ${systemProxy}`);
    if (await testProxyConnection(systemProxy, mongoUri)) {
      await updateEnvWithProxy(systemProxy);
      return;
    }
  }
  
  // Try free proxies
  for (const proxy of FREE_PROXIES) {
    if (await testProxyConnection(`http://${proxy}`, mongoUri)) {
      await updateEnvWithProxy(`http://${proxy}`);
      return;
    }
  }
  
  console.log('❌ No working proxy found. You may need to:');
  console.log('1. Connect to a different network (like phone hotspot)');
  console.log('2. Configure a specific proxy in .env.local');
  console.log('3. Contact your network administrator');
}

async function updateEnvWithProxy(proxyUrl) {
  const envPath = path.join(__dirname, '..', '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const url = new URL(proxyUrl);
  
  // Update proxy settings
  envContent = envContent.replace(/MONGODB_USE_PROXY=.*/g, 'MONGODB_USE_PROXY=true');
  envContent = envContent.replace(/MONGODB_PROXY_HOST=.*/g, `MONGODB_PROXY_HOST=${url.hostname}`);
  envContent = envContent.replace(/MONGODB_PROXY_PORT=.*/g, `MONGODB_PROXY_PORT=${url.port || 8080}`);
  
  if (url.username) {
    envContent = envContent.replace(/MONGODB_PROXY_USERNAME=.*/g, `MONGODB_PROXY_USERNAME=${url.username}`);
  }
  if (url.password) {
    envContent = envContent.replace(/MONGODB_PROXY_PASSWORD=.*/g, `MONGODB_PROXY_PASSWORD=${url.password}`);
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Proxy configuration updated in .env.local');
  console.log('🔄 Restart your application to use the new proxy settings');
}

if (require.main === module) {
  findWorkingProxy().catch(console.error);
}

module.exports = { findWorkingProxy, testProxyConnection };