import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';
import connectDB from '../config/db.js';

dotenv.config();

const departments = [
  {
    name: 'Medicine',
    code: 'MED',
    isActive: true,
  },
  {
    name: 'Surgery',
    code: 'SUR',
    isActive: true,
  },
  {
    name: 'Pediatrics',
    code: 'PED',
    isActive: true,
  },
  {
    name: 'Obstetrics & Gynecology',
    code: 'OBG',
    isActive: true,
  },
  {
    name: 'Orthopedics',
    code: 'ORT',
    isActive: true,
  },
  {
    name: 'ENT',
    code: 'ENT',
    isActive: true,
  },
  {
    name: 'Ophthalmology',
    code: 'OPH',
    isActive: true,
  },
  {
    name: 'Psychiatry',
    code: 'PSY',
    isActive: true,
  },
  {
    name: 'Anesthesia',
    code: 'ANE',
    isActive: true,
  },
  {
    name: 'Radiology',
    code: 'RAD',
    isActive: true,
  },
  {
    name: 'Pathology',
    code: 'PAT',
    isActive: true,
  },
  {
    name: 'Emergency',
    code: 'EMR',
    isActive: true,
  },
  {
    name: 'Housekeeping',
    code: 'HSK',
    isActive: true,
  },
  {
    name: 'Administration',
    code: 'ADM',
    isActive: true,
  },
];

const seedDepartments = async () => {
  try {
    await connectDB();

    // Clear existing departments
    await Department.deleteMany();

    // Insert departments
    await Department.insertMany(departments);

    console.log('✅ Departments seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
};

seedDepartments();