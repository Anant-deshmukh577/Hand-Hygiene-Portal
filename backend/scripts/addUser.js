#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

const addUser = async () => {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        AIIMS Hand Hygiene - Add User Tool             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    await connectDB();
    console.log('✅ Connected to database\n');

    // Select user type
    console.log('Select User Type:');
    console.log('1. Admin');
    console.log('2. Auditor');
    console.log('3. Staff');
    const typeChoice = await question('\nEnter choice (1-3): ');

    let role;
    switch (typeChoice.trim()) {
      case '1':
        role = 'admin';
        break;
      case '2':
        role = 'auditor';
        break;
      case '3':
        role = 'staff';
        break;
      default:
        console.log('❌ Invalid choice. Exiting.');
        process.exit(1);
    }

    console.log(`\n📝 Creating ${role.toUpperCase()} user...\n`);

    // Get user details
    const name = await question('Full Name: ');
    if (!name.trim()) {
      console.log('❌ Name is required');
      process.exit(1);
    }

    let email;
    while (true) {
      email = await question('Email: ');
      if (!validateEmail(email)) {
        console.log('❌ Invalid email format. Try again.');
        continue;
      }
      
      // Check if email exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ Email already exists. Try another.');
        continue;
      }
      break;
    }

    let password;
    while (true) {
      password = await question('Password (min 8 chars): ');
      if (password.length < 8) {
        console.log('❌ Password must be at least 8 characters');
        continue;
      }
      break;
    }

    let phone;
    while (true) {
      phone = await question('Phone (10 digits): ');
      if (!validatePhone(phone)) {
        console.log('❌ Invalid phone number. Must be 10 digits.');
        continue;
      }
      break;
    }

    const department = await question('Department: ');
    if (!department.trim()) {
      console.log('❌ Department is required');
      process.exit(1);
    }

    const designation = await question('Designation: ');
    if (!designation.trim()) {
      console.log('❌ Designation is required');
      process.exit(1);
    }

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone.trim(),
      department: department.trim(),
      designation: designation.trim(),
      role: role,
      isActive: true,
      isEmailVerified: true,
      totalPoints: 0,
      totalObservations: 0,
      complianceRate: 0,
    });

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              ✅ USER CREATED SUCCESSFULLY!              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📋 User Details:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`   Name:        ${newUser.name}`);
    console.log(`   Email:       ${newUser.email}`);
    console.log(`   Password:    ${password}`);
    console.log(`   Phone:       ${newUser.phone}`);
    console.log(`   Department:  ${newUser.department}`);
    console.log(`   Designation: ${newUser.designation}`);
    console.log(`   Role:        ${newUser.role.toUpperCase()}`);
    console.log('─────────────────────────────────────────────────────────\n');

    console.log('🔗 Login URL:');
    if (role === 'admin') {
      console.log('   http://localhost:5173/admin-login\n');
    } else if (role === 'auditor') {
      console.log('   http://localhost:5173/auditor-login\n');
    } else {
      console.log('   http://localhost:5173/login\n');
    }

    console.log('💡 TIP: Save these credentials securely!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    process.exit(1);
  }
};

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  process.exit(0);
});

addUser();
