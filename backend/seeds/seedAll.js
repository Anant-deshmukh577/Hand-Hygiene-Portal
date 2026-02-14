import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Observation from '../models/Observation.js';

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

const seedAll = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Session.deleteMany();
    await Observation.deleteMany();

    console.log('✅ Database cleared');

    console.log('\n📝 Seeding data...');
    await User.create(adminUser);
    console.log('✅ Admin user created');

    console.log('\n✨ All data seeded successfully!\n');

    console.log('📧 Admin Login:');
    console.log('═══════════════════════════════════════');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
