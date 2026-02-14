import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';

dotenv.config();

const testUsers = [
  // Admin User
  {
    name: 'Admin User',
    email: 'admin@aiims.edu',
    password: 'Admin@123',
    phone: '9876543210',
    department: 'Administration',
    designation: 'Consultant',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 0,
    totalObservations: 0,
    complianceRate: 0,
  },
  
  // Auditor Users
  {
    name: 'Dr. Rajesh Kumar',
    email: 'auditor@aiims.edu',
    password: 'Auditor@123',
    phone: '9876543211',
    department: 'Administration',
    designation: 'Consultant',
    role: 'auditor',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 0,
    totalObservations: 0,
    complianceRate: 0,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'auditor2@aiims.edu',
    password: 'Auditor@123',
    phone: '9876543212',
    department: 'Administration',
    designation: 'Consultant',
    role: 'auditor',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 0,
    totalObservations: 0,
    complianceRate: 0,
  },
  
  // Staff Users
  {
    name: 'Sarah Johnson',
    email: 'sarah@aiims.edu',
    password: 'Staff@123',
    phone: '9876543213',
    department: 'Medicine',
    designation: 'Staff Nurse',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 100,
    totalObservations: 25,
    complianceRate: 85.5,
  },
  {
    name: 'Priya Patel',
    email: 'priya@aiims.edu',
    password: 'Staff@123',
    phone: '9876543214',
    department: 'Surgery',
    designation: 'Staff Nurse',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 80,
    totalObservations: 20,
    complianceRate: 90.0,
  },
  {
    name: 'Dr. Amit Singh',
    email: 'amit@aiims.edu',
    password: 'Staff@123',
    phone: '9876543215',
    department: 'Emergency',
    designation: 'Junior Resident',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 150,
    totalObservations: 35,
    complianceRate: 92.5,
  },
  {
    name: 'Nurse Kavita Reddy',
    email: 'kavita@aiims.edu',
    password: 'Staff@123',
    phone: '9876543216',
    department: 'Pediatrics',
    designation: 'Nursing Supervisor',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 200,
    totalObservations: 45,
    complianceRate: 88.0,
  },
  {
    name: 'Dr. Rahul Verma',
    email: 'rahul@aiims.edu',
    password: 'Staff@123',
    phone: '9876543217',
    department: 'Emergency',
    designation: 'Consultant',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 250,
    totalObservations: 50,
    complianceRate: 95.0,
  },
  {
    name: 'Nurse Anjali Gupta',
    email: 'anjali@aiims.edu',
    password: 'Staff@123',
    phone: '9876543218',
    department: 'Surgery',
    designation: 'Staff Nurse',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 120,
    totalObservations: 30,
    complianceRate: 87.0,
  },
  {
    name: 'Dr. Suresh Nair',
    email: 'suresh@aiims.edu',
    password: 'Staff@123',
    phone: '9876543219',
    department: 'Medicine',
    designation: 'Senior Resident',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 180,
    totalObservations: 40,
    complianceRate: 91.0,
  },
  {
    name: 'Nurse Meera Iyer',
    email: 'meera@aiims.edu',
    password: 'Staff@123',
    phone: '9876543220',
    department: 'Pediatrics',
    designation: 'Staff Nurse',
    role: 'staff',
    isActive: true,
    isEmailVerified: true,
    totalPoints: 90,
    totalObservations: 22,
    complianceRate: 86.0,
  },
];

const seedTestUsers = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing existing users...');
    await User.deleteMany();

    console.log('📝 Creating test users...');
    const createdUsers = await User.create(testUsers);
    
    console.log(`✅ ${createdUsers.length} test users created successfully!\n`);

    // Display credentials
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    🔐 TEST CREDENTIALS                     ');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('👨‍💼 ADMIN LOGIN:');
    console.log('   Email:    admin@aiims.edu');
    console.log('   Password: Admin@123');
    console.log('   Role:     Administrator\n');

    console.log('🕵️  AUDITOR LOGINS:');
    console.log('   1. Email:    auditor@aiims.edu');
    console.log('      Password: Auditor@123');
    console.log('      Name:     Dr. Rajesh Kumar\n');
    console.log('   2. Email:    auditor2@aiims.edu');
    console.log('      Password: Auditor@123');
    console.log('      Name:     Dr. Priya Sharma\n');

    console.log('👨‍⚕️  STAFF LOGINS:');
    console.log('   1. Email:    sarah@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Sarah Johnson (100 points)\n');
    console.log('   2. Email:    priya@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Priya Patel (80 points)\n');
    console.log('   3. Email:    amit@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Dr. Amit Singh (150 points)\n');
    console.log('   4. Email:    kavita@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Nurse Kavita Reddy (200 points)\n');
    console.log('   5. Email:    rahul@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Dr. Rahul Verma (250 points)\n');
    console.log('   6. Email:    anjali@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Nurse Anjali Gupta (120 points)\n');
    console.log('   7. Email:    suresh@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Dr. Suresh Nair (180 points)\n');
    console.log('   8. Email:    meera@aiims.edu');
    console.log('      Password: Staff@123');
    console.log('      Name:     Nurse Meera Iyer (90 points)\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                  ✨ SEEDING COMPLETE!                      ');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📌 QUICK START:');
    console.log('   1. Start backend:  cd backend && npm start');
    console.log('   2. Start frontend: cd frontend && npm run dev');
    console.log('   3. Login with any credentials above\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    process.exit(1);
  }
};

seedTestUsers();
