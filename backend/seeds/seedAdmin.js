import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const adminUser = {
  name: process.env.ADMIN_NAME || 'Admin User',
  email: process.env.ADMIN_EMAIL || 'admin@aiims.edu',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  phone: process.env.ADMIN_PHONE || '9876543210',
  department: process.env.ADMIN_DEPARTMENT || 'Administration',
  designation: process.env.ADMIN_DESIGNATION || 'Consultant',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    await User.create(adminUser);
    console.log('✅ Admin user created');
    console.log('\n📧 Admin Login:');
    console.log('-------------------');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${adminUser.password}`);
    console.log('-------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
