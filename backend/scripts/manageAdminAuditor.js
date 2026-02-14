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

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const printHeader = () => {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bright + colors.blue + '          🔐 Admin & Auditor Management Tool 🔐           ' + colors.reset);
  console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');
};

const printSuccess = (message) => {
  console.log(colors.green + '✅ ' + message + colors.reset);
};

const printError = (message) => {
  console.log(colors.red + '❌ ' + message + colors.reset);
};

const printInfo = (message) => {
  console.log(colors.yellow + '📌 ' + message + colors.reset);
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const createOrUpdateUser = async (role) => {
  try {
    const roleTitle = role === 'admin' ? 'Admin' : 'Auditor';
    console.log(colors.bright + `\n📝 ${roleTitle} User Details:` + colors.reset);
    
    // Get email
    let email;
    while (true) {
      email = await question(`Enter ${roleTitle} Email: `);
      if (validateEmail(email)) {
        break;
      }
      printError('Invalid email format. Please try again.');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(colors.yellow + `\n⚠️  User with email ${email} already exists!` + colors.reset);
      console.log(`Current Role: ${existingUser.role}`);
      console.log(`Name: ${existingUser.name}`);
      
      const update = await question('\nDo you want to update this user? (yes/no): ');
      if (update.toLowerCase() !== 'yes' && update.toLowerCase() !== 'y') {
        printInfo('Operation cancelled.');
        return;
      }
    }

    // Get name
    const name = await question(`Enter ${roleTitle} Name: `);
    if (!name.trim()) {
      printError('Name cannot be empty.');
      return;
    }

    // Get password
    let password;
    while (true) {
      password = await question(`Enter ${roleTitle} Password (min 8 characters): `);
      if (validatePassword(password)) {
        break;
      }
      printError('Password must be at least 8 characters long.');
    }

    // Get phone
    const phone = await question('Enter Phone Number (optional, press Enter to skip): ');

    // Get department
    console.log('\nAvailable Departments:');
    const departments = [
      'Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynecology',
      'Orthopedics', 'ENT', 'Ophthalmology', 'Psychiatry',
      'Anesthesia', 'Radiology', 'Pathology', 'Emergency',
      'Housekeeping', 'Administration'
    ];
    departments.forEach((dept, index) => {
      console.log(`${index + 1}. ${dept}`);
    });
    const deptChoice = await question('Select Department (1-14) or press Enter for Administration: ');
    const department = deptChoice ? departments[parseInt(deptChoice) - 1] || 'Administration' : 'Administration';

    // Get designation
    console.log('\nAvailable Designations:');
    const designations = [
      'Senior Resident', 'Junior Resident', 'Staff Nurse', 'Nursing Supervisor',
      'Consultant', 'Professor', 'Associate Professor', 'Assistant Professor',
      'Technician', 'Paramedic', 'Housekeeping Staff'
    ];
    designations.forEach((desig, index) => {
      console.log(`${index + 1}. ${desig}`);
    });
    const desigChoice = await question('Select Designation (1-11) or press Enter for Consultant: ');
    const designation = desigChoice ? designations[parseInt(desigChoice) - 1] || 'Consultant' : 'Consultant';

    // Create or update user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim() || '0000000000',
      department,
      designation,
      role,
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
      
      console.log('\n' + colors.green + '═══════════════════════════════════════════════════════════' + colors.reset);
      printSuccess(`${roleTitle} user updated successfully!`);
    } else {
      // Create new user
      await User.create(userData);
      
      console.log('\n' + colors.green + '═══════════════════════════════════════════════════════════' + colors.reset);
      printSuccess(`${roleTitle} user created successfully!`);
    }

    // Display credentials
    console.log('\n' + colors.bright + '📋 Login Credentials:' + colors.reset);
    console.log(colors.cyan + '───────────────────────────────────────────────────────────' + colors.reset);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${roleTitle}`);
    console.log(`  Name:     ${name}`);
    console.log(colors.cyan + '───────────────────────────────────────────────────────────' + colors.reset);
    
  } catch (error) {
    printError('Error creating/updating user: ' + error.message);
    throw error;
  }
};

const listUsers = async (role) => {
  try {
    const roleTitle = role === 'admin' ? 'Admin' : 'Auditor';
    const users = await User.find({ role }).select('name email department designation isActive');
    
    if (users.length === 0) {
      printInfo(`No ${roleTitle} users found.`);
      return;
    }

    console.log('\n' + colors.bright + `📋 ${roleTitle} Users:` + colors.reset);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Department: ${user.department}`);
      console.log(`   Designation: ${user.designation}`);
      console.log(`   Status: ${user.isActive ? colors.green + 'Active' + colors.reset : colors.red + 'Inactive' + colors.reset}`);
    });
    
    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
  } catch (error) {
    printError('Error listing users: ' + error.message);
  }
};

const deleteUser = async (role) => {
  try {
    const roleTitle = role === 'admin' ? 'Admin' : 'Auditor';
    const email = await question(`Enter ${roleTitle} Email to delete: `);
    
    const user = await User.findOne({ email, role });
    
    if (!user) {
      printError(`${roleTitle} user with email ${email} not found.`);
      return;
    }

    console.log(`\nUser found: ${user.name} (${user.email})`);
    const confirm = await question('Are you sure you want to delete this user? (yes/no): ');
    
    if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
      await User.deleteOne({ _id: user._id });
      printSuccess(`${roleTitle} user deleted successfully!`);
    } else {
      printInfo('Deletion cancelled.');
    }
  } catch (error) {
    printError('Error deleting user: ' + error.message);
  }
};

const mainMenu = async () => {
  try {
    await connectDB();
    
    while (true) {
      printHeader();
      
      console.log('1. Create/Update Admin User');
      console.log('2. Create/Update Auditor User');
      console.log('3. List All Admin Users');
      console.log('4. List All Auditor Users');
      console.log('5. Delete Admin User');
      console.log('6. Delete Auditor User');
      console.log('7. Exit');
      console.log('');
      
      const choice = await question('Select an option (1-7): ');
      
      switch (choice) {
        case '1':
          await createOrUpdateUser('admin');
          break;
        case '2':
          await createOrUpdateUser('auditor');
          break;
        case '3':
          await listUsers('admin');
          break;
        case '4':
          await listUsers('auditor');
          break;
        case '5':
          await deleteUser('admin');
          break;
        case '6':
          await deleteUser('auditor');
          break;
        case '7':
          console.log('\n' + colors.green + '👋 Goodbye!' + colors.reset + '\n');
          rl.close();
          process.exit(0);
        default:
          printError('Invalid option. Please try again.');
      }
      
      await question('\nPress Enter to continue...');
    }
  } catch (error) {
    printError('An error occurred: ' + error.message);
    rl.close();
    process.exit(1);
  }
};

// Start the application
mainMenu();
