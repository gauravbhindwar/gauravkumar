#!/usr/bin/env node

import readline from 'readline';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function hiddenQuestion(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    let password = '';

    process.stdin.on('data', function(char) {
      char = char + '';

      switch(char) {
        case '\n':
        case '\r':
        case '':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    console.log('🛡️  Admin Account Setup');
    console.log('========================\n');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
      process.exit(1);
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    console.log('✅ Connected to Supabase\n');

    // Check if admin already exists
    const { data: existingAdmins, error: listError } = await supabase
      .from('admins')
      .select('username, email, created_at')
      .order('created_at', { ascending: true });

    if (listError) throw listError;

    if (existingAdmins.length > 0) {
      console.log('⚠️  Admin accounts already exist:');
      existingAdmins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.username} (${admin.email}) - Created: ${new Date(admin.created_at).toLocaleDateString()}`);
      });

      const proceed = await question('\n❓ Do you want to create another admin? (y/N): ');
      if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('🚫 Admin creation cancelled');
        process.exit(0);
      }
    }

    // Collect admin details
    const username = await question('👤 Enter username: ');
    if (!username || username.trim().length < 3) {
      console.log('❌ Username must be at least 3 characters long');
      process.exit(1);
    }

    const email = await question('📧 Enter email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address');
      process.exit(1);
    }

    const password = await hiddenQuestion('🔒 Enter password: ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    const confirmPassword = await hiddenQuestion('🔒 Confirm password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    // Check if admin with this username/email already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .or(`username.eq.${username.trim()},email.eq.${email.trim().toLowerCase()}`)
      .maybeSingle();

    if (existingAdmin) {
      console.log('❌ Admin with this username or email already exists');
      process.exit(1);
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: admin, error } = await supabase
      .from('admins')
      .insert({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'admin'
      })
      .select('*')
      .single();

    if (error) throw error;

    console.log('\n✅ Admin account created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}\n`);

    console.log('🌐 You can now log in at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();
