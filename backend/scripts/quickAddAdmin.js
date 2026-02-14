import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();


// 🔧 EDIT THESE VALUES TO ADD/UPDATE ADMIN


const ADMIN_CONFIG = {
  name: 'Admin User',
  email: 'admin@aiims.edu',
  password: 'Admin@123',
  phone: '9876543210',
  department: 'Administration',
  designation: 'Consultant',
};


// 🔧 EDIT THESE VALUES TO ADD/UPDATE AUDITOR


const AUDITOR_CONFIG = {
  name: 'Dr. Auditor',
  email: 'auditor@aiims.edu',
  password: 'Auditor@123',
  phone: '9876543211',
  department: 'Administration',
  designation: 'Consultant',
};

// ============================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const createOrUpdateUser = async (config, role) => {
  try {
    const roleTitle = role === 'admin' ? 'Admin' : 'Auditor';
    
    // Check if user exists
    const existingUser = await User.findOne({ email: config.email });
    
    const userData = {
      name: config.name,
      email: config.email.toLowerCase(),
      password: config.password,
      phone: config.phone,
      department: config.department,
      designation: config.designation,
      role: role,
      isActive: true,
      isEmailVerified: true,
    };

    if (existingUser) {
      // Update existing user
      existingUser.name = userData.name;
      existingUser.password = userData.password;
      existingUser.phone = userData.phone;
      existingUser.department = userData.department;
      existingUser.designation = userData.designation;
      existingUser.role = userData.role;
      existingUser.isActive = userData.isActive;
      existingUser.isEmailVerified = userData.isEmailVerified;
      
      await existingUser.save();
      
      console.log(colors.green + `✅ ${roleTitle} user UPDATED successfully!` + colors.reset);
    } else {
      // Create new user
      await User.create(userData);
      console.log(colors.green + `✅ ${roleTitle} user CREATED successfully!` + colors.reset);
    }

    // Display credentials
    console.log('\n' + colors.cyan + '📋 Login Credentials:' + colors.reset);
    console.log('─────────────────────────────────');
    console.log(`  Email:    ${config.email}`);
    console.log(`  Password: ${config.password}`);
    console.log(`  Role:     ${roleTitle}`);
    console.log(`  Name:     ${config.name}`);
    console.log('─────────────────────────────────\n');
    
  } catch (error) {
    console.error(colors.yellow + `❌ Error with ${role}: ${error.message}` + colors.reset);
  }
};

const main = async () => {
  try {
    console.log('\n' + colors.blue + '🔄 Connecting to database...' + colors.reset);
    await connectDB();
    
    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '          🔐 Quick Admin & Auditor Setup 🔐           ' + colors.reset);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    // Create/Update Admin
    await createOrUpdateUser(ADMIN_CONFIG, 'admin');
    
    // Create/Update Auditor
    await createOrUpdateUser(AUDITOR_CONFIG, 'auditor');
    
    console.log(colors.green + '✨ All done! You can now login with the credentials above.' + colors.reset);
    console.log(colors.yellow + '\n💡 TIP: To change credentials, edit the values at the top of this file and run again.\n' + colors.reset);
    
    process.exit(0);
  } catch (error) {
    console.error(colors.yellow + '❌ Error: ' + error.message + colors.reset);
    process.exit(1);
  }
};

main();
