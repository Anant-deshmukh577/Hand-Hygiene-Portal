# Admin & Auditor Management Scripts

Easy ways to add, update, or manage admin and auditor users for the AIIMS Hand Hygiene Portal.

## 🚀 Quick Setup (Easiest Way)

### Method 1: Quick Add Script (Recommended for Beginners)

This is the **EASIEST** way to add admin and auditor users!

1. Open `backend/scripts/quickAddAdmin.js`
2. Edit the credentials at the top of the file:

```javascript
const ADMIN_CONFIG = {
  name: 'Admin User',
  email: 'admin@aiims.edu',      // ← Change this
  password: 'Admin@123',          // ← Change this
  phone: '9876543210',
  department: 'Administration',
  designation: 'Consultant',
};

const AUDITOR_CONFIG = {
  name: 'Dr. Auditor',
  email: 'auditor@aiims.edu',    // ← Change this
  password: 'Auditor@123',        // ← Change this
  phone: '9876543211',
  department: 'Administration',
  designation: 'Consultant',
};
```

3. Run the script:

```bash
cd backend
npm run quick:setup
```

That's it! Your admin and auditor users are created/updated.

**To change credentials later:**
- Just edit the file again and run `npm run quick:setup`
- It will automatically update existing users

---

## 🎯 Interactive Menu (More Options)

### Method 2: Interactive Management Tool

For more control (create, update, list, delete users), use the interactive menu:

```bash
cd backend
npm run manage:users
```

This will show you a menu:

```
1. Create/Update Admin User
2. Create/Update Auditor User
3. List All Admin Users
4. List All Auditor Users
5. Delete Admin User
6. Delete Auditor User
7. Exit
```

Just follow the prompts to:
- ✅ Create new admin/auditor users
- ✅ Update existing users
- ✅ View all admin/auditor users
- ✅ Delete users

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run quick:setup` | Quick add/update admin & auditor (edit file first) |
| `npm run manage:users` | Interactive menu for full user management |

---

## 💡 Examples

### Example 1: Add Your Own Admin

1. Edit `backend/scripts/quickAddAdmin.js`:
```javascript
const ADMIN_CONFIG = {
  name: 'John Doe',
  email: 'john@hospital.com',
  password: 'MySecurePass123',
  phone: '9999999999',
  department: 'Administration',
  designation: 'Consultant',
};
```

2. Run:
```bash
npm run quick:setup
```

### Example 2: Add Multiple Auditors

Use the interactive tool:
```bash
npm run manage:users
```

Select option `2` (Create/Update Auditor User) and follow the prompts for each auditor.

---

## 🔒 Password Requirements

- Minimum 8 characters
- Can include letters, numbers, and special characters
- Examples: `Admin@123`, `SecurePass2024`, `MyPassword!`

---

## 📧 Email Format

- Must be a valid email format
- Examples: `admin@aiims.edu`, `auditor@hospital.com`

---

## 🏥 Available Departments

- Medicine
- Surgery
- Pediatrics
- Obstetrics & Gynecology
- Orthopedics
- ENT
- Ophthalmology
- Psychiatry
- Anesthesia
- Radiology
- Pathology
- Emergency
- Housekeeping
- Administration

---

## 👔 Available Designations

- Senior Resident
- Junior Resident
- Staff Nurse
- Nursing Supervisor
- Consultant
- Professor
- Associate Professor
- Assistant Professor
- Technician
- Paramedic
- Housekeeping Staff

---

## ❓ FAQ

**Q: Can I run these scripts while the server is running?**
A: Yes! These scripts connect directly to the database.

**Q: What happens if I try to create a user with an existing email?**
A: The script will ask if you want to update the existing user.

**Q: Can I create multiple admins?**
A: Yes! You can create as many admin and auditor users as you need.

**Q: How do I change an admin password?**
A: Edit `quickAddAdmin.js` with the new password and run `npm run quick:setup`, or use the interactive menu.

**Q: I made a mistake. How do I delete a user?**
A: Use `npm run manage:users` and select option 5 or 6 to delete users.

---

## 🆘 Troubleshooting

**Error: "MongoDB connection failed"**
- Make sure MongoDB is running
- Check your `.env` file has the correct `MONGODB_URI`

**Error: "Invalid email format"**
- Email must be in format: `user@domain.com`

**Error: "Password too short"**
- Password must be at least 8 characters

**Error: "Invalid enum value"**
- Make sure department and designation match the available options listed above

---

## 🎉 Quick Start Guide

**First Time Setup:**

1. **Quick way** (edit file once, run anytime):
   ```bash
   # Edit backend/scripts/quickAddAdmin.js first
   cd backend
   npm run quick:setup
   ```

2. **Interactive way** (guided prompts):
   ```bash
   cd backend
   npm run manage:users
   ```

**That's it!** Your admin and auditor accounts are ready to use.

---

## 📝 Notes

- All scripts automatically hash passwords before storing
- Users are set as active and email verified by default
- You can run these scripts as many times as needed
- Existing users will be updated, not duplicated
