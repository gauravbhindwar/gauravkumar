#!/usr/bin/env node

// Simple test script to check if the API is working
async function testAPI() {
  try {
    console.log('🧪 Testing /api/experiences endpoint...\n');
    
    const url = 'http://localhost:3000/api/experiences';
    console.log(`📡 Fetching from: ${url}`);
    
    const response = await fetch(url);
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response headers:`, Object.fromEntries(response.headers));
    
    if (!response.ok) {
      console.error('❌ Response not OK');
      const text = await response.text();
      console.error('Error body:', text);
      return;
    }
    
    const data = await response.json();
    console.log(`\n✅ Success! Received ${data.length} experiences`);
    console.log('\n📄 Data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.length > 0) {
      console.log('\n📋 Summary:');
      data.forEach((exp, index) => {
        console.log(`   ${index + 1}. ${exp.position} at ${exp.company}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testAPI();
