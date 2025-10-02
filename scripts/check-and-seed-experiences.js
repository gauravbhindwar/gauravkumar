#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import Experience model
import Experience from '../src/models/Experience.js';

async function checkAndSeedExperiences() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if experiences exist
    const count = await Experience.countDocuments();
    console.log(`📊 Found ${count} experiences in database`);

    if (count === 0) {
      console.log('📦 No experiences found. Seeding from JSON file...');
      
      // Read experiences from JSON file
      const experiencesPath = join(__dirname, '../src/data/experiences.json');
      const experiencesData = JSON.parse(readFileSync(experiencesPath, 'utf-8'));
      
      // Convert date strings to Date objects
      const experiences = experiencesData.map(exp => ({
        ...exp,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null
      }));

      // Insert experiences
      const result = await Experience.insertMany(experiences);
      console.log(`✅ Successfully seeded ${result.length} experiences`);
      
      // Display seeded experiences
      result.forEach((exp, index) => {
        console.log(`   ${index + 1}. ${exp.position} at ${exp.company}`);
      });
    } else {
      console.log('📋 Existing experiences:');
      const experiences = await Experience.find({ isActive: true }).sort({ order: 1, startDate: -1 });
      experiences.forEach((exp, index) => {
        console.log(`   ${index + 1}. ${exp.position} at ${exp.company} (${exp.isActive ? 'Active' : 'Inactive'})`);
      });
    }

    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkAndSeedExperiences();
