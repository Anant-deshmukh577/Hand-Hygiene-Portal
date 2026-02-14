import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ward from '../models/Ward.js';
import connectDB from '../config/db.js';

dotenv.config();

const wards = [
  {
    name: 'ICU',
    code: 'ICU',
    capacity: 20,
    department: 'Critical Care',
    floor: 3,
    isActive: true,
  },
  {
    name: 'NICU',
    code: 'NICU',
    capacity: 15,
    department: 'Pediatrics',
    floor: 2,
    isActive: true,
  },
  {
    name: 'PICU',
    code: 'PICU',
    capacity: 12,
    department: 'Pediatrics',
    floor: 2,
    isActive: true,
  },
  {
    name: 'OT',
    code: 'OT',
    capacity: 10,
    department: 'Surgery',
    floor: 4,
    isActive: true,
  },
  {
    name: 'General Ward',
    code: 'GW',
    capacity: 50,
    department: 'General',
    floor: 1,
    isActive: true,
  },
  {
    name: 'Private Ward',
    code: 'PW',
    capacity: 30,
    department: 'General',
    floor: 5,
    isActive: true,
  },
  {
    name: 'Emergency',
    code: 'ER',
    capacity: 25,
    department: 'Emergency',
    floor: 1,
    isActive: true,
  },
  {
    name: 'Dialysis',
    code: 'DIA',
    capacity: 8,
    department: 'Nephrology',
    floor: 2,
    isActive: true,
  },
  {
    name: 'OPD',
    code: 'OPD',
    capacity: 0,
    department: 'Outpatient',
    floor: 1,
    isActive: true,
  },
];

const seedWards = async () => {
  try {
    await connectDB();

    // Clear existing wards
    await Ward.deleteMany();

    // Insert wards
    await Ward.insertMany(wards);

    console.log('✅ Wards seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding wards:', error);
    process.exit(1);
  }
};

seedWards();