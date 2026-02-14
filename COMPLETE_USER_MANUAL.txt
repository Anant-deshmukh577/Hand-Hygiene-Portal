# AIIMS Hand Hygiene Portal - User Manual

A complete guide for all users of the AIIMS Hand Hygiene Compliance System.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Login Instructions](#login-instructions)
3. [Staff User Guide](#staff-user-guide)
4. [Auditor User Guide](#auditor-user-guide)
5. [Admin User Guide](#admin-user-guide)
6. [Common Features](#common-features)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Getting Started

### System Requirements

You'll need:
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- Valid login credentials

### Accessing the Portal

1. Open your web browser
2. Navigate to `http://localhost:3000` (or your organization's portal URL)
3. You'll see the landing page with login options

### User Roles

The portal has three types of users, each with different capabilities:

**Staff (Healthcare Workers)**
- Record your own hand hygiene observations
- View your personal dashboard and statistics
- Earn points and achievement badges
- Redeem rewards
- Check your leaderboard ranking

**Auditor (Infection Control Auditors)**
- Create and manage observation sessions
- Record observations for multiple staff members
- View audit reports
- Monitor compliance rates across departments
- Access department-wide statistics

**Admin (System Administrators)**
- Manage all user accounts
- Approve or reject reward redemptions
- Generate comprehensive reports
- Manage wards and departments
- Configure rewards and achievement badges
- View system-wide analytics

---

## Login Instructions

### Staff Login

1. Go to `http://localhost:3000/login`
2. Enter your email address and password
3. Click "Login"
4. You'll be redirected to your dashboard

You can also use the Google Sign-In button for quick login.

### Auditor Login

1. Go to `http://localhost:3000/auditor-login`
2. Enter your auditor email and password
3. Click "Auditor Login"
4. You'll be redirected to the auditor dashboard

### Admin Login

1. Go to `http://localhost:3000/admin-login`
2. Enter your admin email and password
3. Click "Admin Login"
4. You'll be redirected to the admin dashboard

### Forgot Your Password?

1. Click "Forgot Password?" on the login page
2. Enter your registered email address
3. Click "Send Reset Link"
4. Check your email for instructions
5. Click the link in the email and set a new password

### Test Credentials

For testing purposes, you can use these credentials:

**Admin:**
- Email: admin@aiims.edu
- Password: Admin@123

**Auditor:**
- Email: auditor@aiims.edu
- Password: Auditor@123

**Staff:**
- Email: sarah@aiims.edu
- Password: Staff@123

---

## Staff User Guide

### Your Dashboard

After logging in, your dashboard shows:
- Total points you've earned
- Total observations you've recorded
- Your compliance rate percentage
- Recent activities
- Quick action buttons
- Weekly compliance chart

### Recording Hand Hygiene Observations

1. Click "New Observation" or "Record Observation"
2. Fill out the observation form:

**WHO Moment (Required)**

Select one of the WHO's 5 moments for hand hygiene:
- Before Patient Contact
- Before Aseptic/Clean Procedure
- After Body Fluid Exposure Risk
- After Patient Contact
- After Contact with Patient Surroundings

**Hand Hygiene Action (Required)**

Select what you did:
- Hand Rub (alcohol-based sanitizer)
- Hand Wash (soap and water)
- Not Performed (if you missed it)

**Glove Usage (Optional)**
- Gloves Used
- Gloves Not Used

**Additional Information**
- Ward/Location
- Risk factors (if any)
- Notes or comments

3. Click "Submit Observation"
4. You'll see a confirmation and any points earned

### Understanding the Points System

- Compliant observation: +10 points
- Non-compliant observation: 0 points
- Bonus points for consistency streaks
- Special milestone bonuses
- Badge unlocks come with bonus points

### Viewing Your Profile

1. Click on your name or profile icon
2. Your profile shows:
   - Personal information (name, email, department)
   - Total points and observations
   - Compliance rate
   - Badges you've earned
   - Activity history

### Updating Your Profile

1. Go to your Profile page
2. Click "Edit Profile"
3. Update any of these fields:
   - Name
   - Phone number
   - Department
   - Designation
4. Click "Save Changes"

### Changing Your Password

1. Go to your Profile page
2. Click the "Change Password" tab
3. Enter your current password
4. Enter your new password
5. Confirm your new password
6. Click "Update Password"

### Checking Your Observation History

1. Click "History" or "My Observations" in the menu
2. See all your past observations
3. Filter by:
   - Date range
   - WHO moment
   - Compliance status
   - Ward/Location
4. Export the data if you need it

### Viewing the Leaderboard

1. Click "Leaderboard" in the menu
2. View different rankings:
   - Individual rankings
   - Department rankings
   - Top performers
3. Filter by:
   - Time period (weekly, monthly, all-time)
   - Department
   - Ward

### Redeeming Rewards

1. Click "Rewards" in the menu
2. Browse available rewards
3. Check the points required for each reward
4. Click "Redeem" on your desired reward
5. Confirm the redemption
6. Wait for admin approval (usually 1-2 business days)
7. Check the "My Rewards" tab for status updates

### Viewing Your Badges

1. Go to your Profile page
2. Click the "Badges" or "Achievements" tab
3. See your earned badges:
   - Bronze, Silver, and Gold badges
   - Special achievement badges
   - Progress toward your next badge

---

## Auditor User Guide

### Auditor Dashboard

Your dashboard displays:
- Total observations you've conducted
- Overall compliance rate
- Active audit sessions
- Recent audit activities
- Department statistics
- Compliance trends over time

### Creating an Observation Session

1. Click "New Session" or "Start Audit Session"
2. Fill in the session details:
   - Ward/Location (required)
   - Department (required)
   - Session date and time
   - Notes about the session purpose
3. Click "Create Session"
4. The session is now active and ready for observations

### Recording Observations as an Auditor

1. Select an active session or create a new one
2. For each healthcare worker you observe:

**Step 1: Staff Details**
- Search for the staff member by name or email
- Or enter their details manually if they're not in the system
- Select their department
- Select their designation

**Step 2: Record the Observation**
- WHO moment you observed
- Hand hygiene action they took (or didn't take)
- Whether they used gloves
- Mark as compliant or non-compliant
- Note any risk factors present
- Add any additional notes

**Step 3: Submit**
- Click "Submit Observation"
- The observation is added to the staff member's profile
- Points are awarded automatically if compliant

3. Continue recording for multiple staff members
4. End the session when your audit is complete

### Managing Your Sessions

1. Click "Sessions" in the menu
2. View all your sessions:
   - Active sessions
   - Completed sessions
   - Session statistics
3. For each session, you can:
   - View details
   - Add more observations
   - End the session
   - Generate a session report
   - Export the data

### Viewing Audit Reports

1. Click "Reports" in the menu
2. Select the type of report you need:
   - Session reports
   - Department compliance
   - Ward compliance
   - Individual staff performance
   - Trend analysis
3. Set your filters:
   - Date range
   - Department
   - Ward
   - Specific staff member
4. View or export the report

### Monitoring Compliance

1. Go to your Dashboard
2. Check compliance metrics:
   - Overall compliance rate
   - Compliance by department
   - Compliance by ward
   - Compliance by WHO moment
   - Trends over time
3. Identify areas that need improvement
4. Generate reports for management review

### Checking Staff Performance

1. Click "Staff Performance" in the menu
2. Search for a specific staff member
3. View their complete profile:
   - Total observations
   - Compliance rate
   - Points earned
   - Recent observations
   - Performance trends

---

## Admin User Guide

### Admin Dashboard

Your dashboard provides an overview of:
- Total users in the system
- Total observations recorded
- Overall compliance rate
- Pending reward approvals
- System-wide statistics
- Recent activities
- Department performance metrics

### Managing Users

**Adding a New User**

1. Click "Users" or "User Management" in the menu
2. Click "Add New User"
3. Fill in the details:
   - Name (required)
   - Email (required)
   - Password (required)
   - Phone number
   - Department (required)
   - Designation (required)
   - Role (Staff/Auditor/Admin)
4. Click "Create User"
5. The user receives a welcome email with their credentials

**Editing a User**

1. Go to User Management
2. Find the user in the list
3. Click "Edit"
4. Update their information
5. Click "Save Changes"

**Deactivating a User**

1. Go to User Management
2. Find the user in the list
3. Click "Deactivate" or toggle their status
4. Confirm the deactivation
5. The user won't be able to log in until you reactivate them

**Deleting a User**

1. Go to User Management
2. Find the user in the list
3. Click "Delete"
4. Confirm the deletion (this is permanent!)

**Viewing User Details**

1. Go to User Management
2. Click on a user's name
3. See their complete profile:
   - Personal information
   - Observation history
   - Points and badges
   - Reward redemptions
   - Activity log

### Managing Rewards

**Approving Reward Redemptions**

1. Click "Rewards" or "Pending Approvals" in the menu
2. View the list of pending redemption requests
3. For each request:
   - Review the staff member's details
   - Check their points balance
   - Review the reward details
4. Click "Approve" or "Reject"
5. Add notes if needed
6. The staff member is notified of your decision

**Creating a New Reward**

1. Go to Reward Management
2. Click "Add New Reward"
3. Fill in the reward details:
   - Reward name
   - Description
   - Points required
   - Quantity available
   - Category
   - Image (optional)
4. Click "Create Reward"

**Editing a Reward**

1. Go to Reward Management
2. Find the reward in the list
3. Click "Edit"
4. Update the reward information
5. Click "Save Changes"

**Deleting a Reward**

1. Go to Reward Management
2. Find the reward in the list
3. Click "Delete"
4. Confirm the deletion

### Managing Wards

**Adding a New Ward**

1. Click "Wards" or "Ward Management" in the menu
2. Click "Add New Ward"
3. Fill in the ward details:
   - Ward name (required)
   - Ward code
   - Department
   - Floor/Building
   - Capacity
4. Click "Create Ward"

**Editing a Ward**

1. Go to Ward Management
2. Find the ward in the list
3. Click "Edit"
4. Update the ward information
5. Click "Save Changes"

**Deleting a Ward**

1. Go to Ward Management
2. Find the ward in the list
3. Click "Delete"
4. Confirm the deletion

### Generating Reports

**System-Wide Reports**

1. Click "Reports" in the menu
2. Select the type of report:
   - Overall compliance report
   - Department performance
   - Ward performance
   - User activity report
   - Reward redemption report
   - Trend analysis
   - Custom report
3. Set your parameters:
   - Date range
   - Department filter
   - Ward filter
   - User filter
   - Report format (PDF, Excel, CSV)
4. Click "Generate Report"
5. View or download the report

**Scheduled Reports**

1. Go to the Reports section
2. Click "Schedule Report"
3. Configure the schedule:
   - Report type
   - Frequency (daily, weekly, monthly)
   - Recipients (email addresses)
   - Format
4. Click "Save Schedule"
5. Reports will be sent automatically

### Viewing Analytics

1. Go to Dashboard or the Analytics section
2. View various metrics:
   - Compliance trends over time
   - Department comparisons
   - Ward comparisons
   - Peak observation times
   - WHO moment distribution
   - Top performers
   - Areas needing improvement
3. Use filters to drill down:
   - Time period
   - Department
   - Ward
   - User role

### System Configuration

**Managing Badges**

1. Go to Badge Management
2. View existing badges
3. Create a new badge:
   - Badge name
   - Description
   - Criteria (points or observations required)
   - Badge image
4. Edit or delete existing badges as needed

**Managing Departments**

1. Go to Department Management
2. Add, edit, or remove departments
3. Assign department heads
4. Set department goals

**System Settings**

1. Go to Settings
2. Configure various options:
   - Point values for observations
   - Compliance thresholds
   - Email notifications
   - System preferences
   - Backup settings

---

## Common Features

### Navigation Menu

All users have access to these common menu items:
- Dashboard - Your main overview page
- Profile - Your personal information
- Settings - Your preferences
- Help - User guide and support
- Logout - Sign out of the system

### Notifications

You'll receive notifications for:
- New badges you've earned
- Reward redemption status updates
- System announcements
- Milestone achievements
- Password expiry reminders

**Viewing Notifications**

1. Click the bell icon in the top menu
2. See your recent notifications
3. Click a notification to view details
4. Mark as read or dismiss

### Search Functionality

Use the search bar to find:
- Users (for admins and auditors)
- Observations
- Wards
- Departments
- Rewards

### Exporting Data

Most data tables have an export option:
1. Click the "Export" button
2. Select your preferred format (Excel, CSV, PDF)
3. The file downloads automatically

### Filtering Data

Use filters to narrow down what you're viewing:
- Date range picker
- Department dropdown
- Ward dropdown
- Status filters
- Custom filters based on the page

### Dark Mode

Switch between light and dark themes:
1. Click the theme icon in the menu
2. Select Light or Dark mode
3. Your preference is saved automatically

---

## Troubleshooting

### Login Issues

**"Invalid credentials" error**

Check these things:
- Make sure your email is typed correctly (no typos)
- Verify your password is correct (it's case-sensitive)
- Ensure you're using the right login page:
  - Staff: `/login`
  - Auditor: `/auditor-login`
  - Admin: `/admin-login`
- Try using "Forgot Password" to reset if needed

**"Account deactivated" message**

Contact your administrator. Your account may have been temporarily disabled.

**Can't receive password reset email**

- Check your spam or junk folder
- Verify you entered the correct email address
- Wait a few minutes and try again
- Contact your administrator if the problem continues

### Observation Recording Issues

**Can't submit an observation**

- Make sure all required fields are filled in
- Verify you've selected a WHO moment
- Verify you've selected a hand hygiene action
- Check your internet connection
- Try refreshing the page

**Points aren't updating**

- Refresh the page
- Points may take a few seconds to update
- Make sure your observation was submitted successfully
- Contact support if the problem persists

### Reward Redemption Issues

**Can't redeem a reward**

- Make sure you have enough points
- Check if the reward is still available
- See if you've already redeemed the maximum allowed
- Ensure you're logged in properly

**Reward status stuck on "Pending"**

Wait for admin approval (this usually takes 1-2 business days). Contact your administrator if it's been longer than that.

### Performance Issues

**Page loading slowly**

- Check your internet connection
- Clear your browser cache
- Try a different browser
- Close unnecessary browser tabs
- Contact IT support if the problem continues

**Features not working properly**

- Refresh the page (press F5 or Ctrl+R)
- Clear your browser cache and cookies
- Try using incognito or private browsing mode
- Update your browser to the latest version
- Try a different browser

### Data Not Showing

**Dashboard shows no data**

- Check your date range filters
- Make sure you've recorded some observations
- Refresh the page
- Check your internet connection

**Reports are empty**

- Verify your date range includes data
- Make sure your filters aren't too restrictive
- Ensure you have permission to view the data
- Try adjusting your report parameters

---

## FAQ

### General Questions

**How do I get login credentials?**

Contact your system administrator or infection control team. They'll create an account for you and provide your credentials.

**Can I use the portal on my phone or tablet?**

Yes! The portal is fully responsive and works on smartphones and tablets. Just use your mobile browser to access it.

**Is my data secure?**

Yes. All data is encrypted and stored securely. Only authorized users can access the system.

**Can I access the portal from home?**

This depends on your organization's policy. Contact your IT department for information about remote access.

### Staff Questions

**How many points do I get per observation?**

Compliant observations earn you 10 points. Non-compliant observations earn 0 points. You may also earn bonus points for maintaining consistent compliance.

**How long does it take to earn a badge?**

Badge requirements vary:
- Bronze: 50 compliant observations
- Silver: 100 compliant observations
- Gold: 200 compliant observations
- Special badges have their own unique criteria

**Can I record observations from past dates?**

No. Observations should be recorded in real-time or shortly after the hand hygiene moment occurs. You can record something later the same day, but not from previous days.

**What if I forget to record an observation?**

Record it as soon as you remember, but it needs to be within the same day. Observations from previous days can't be added.

**How do I know if my reward was approved?**

You'll receive a notification. Check the "My Rewards" section for status updates. Approved rewards will show an "Approved" status.

**Can I cancel a reward redemption?**

Only if it's still pending. Once a redemption is approved, it can't be cancelled. Contact your admin if you need help.

### Auditor Questions

**Can I edit an observation after submitting it?**

No. Observations can't be edited once submitted to maintain data integrity. Contact an admin if a correction is absolutely necessary.

**How many observations should I record per session?**

There's no limit. Record as many observations as you need during your audit. Most sessions typically have between 10 and 50 observations.

**Can I observe the same staff member multiple times?**

Yes. You can record multiple observations for the same person during a session or across different sessions.

**What if a staff member isn't in the system?**

You can enter their details manually during observation recording. We recommend they register or contact an admin to create their account.

**How do I end a session?**

Go to your active session and click the "End Session" button. You can still view the session data after ending it.

### Admin Questions

**How do I add multiple users at once?**

Currently, users need to be added individually. For bulk import, contact technical support for assistance.

**Can I change a user's role?**

Yes. Edit the user and change their role from Staff to Auditor or Admin (or vice versa). The user will need to log out and log back in for the change to take effect.

**How do I backup the system data?**

System backups are automated. For a manual backup, go to Settings > Backup & Restore. Contact IT support if you need assistance.

**Can I delete observations?**

Yes, but be careful. Deleting observations affects user points and statistics. Only delete if an observation was recorded by mistake.

**How do I generate monthly reports?**

Go to Reports > Generate Report. Select "Monthly Report" and choose the month you want. You can also schedule automatic monthly reports.

### Technical Questions

**Which browsers work with the portal?**

Chrome (recommended), Firefox, Safari, and Edge all work. Use the latest version of whichever browser you choose for the best experience.

**What should I do if I see an error message?**

Make a note of the error message and try these steps:
1. Refresh the page
2. Clear your browser cache
3. Try a different browser
4. Contact support with the error details

**Can I use the portal offline?**

No. The portal requires an internet connection to work.

**How do I report a bug or issue?**

Contact your system administrator or IT support team. Include:
- A description of the issue
- Steps to reproduce the problem
- Screenshots if possible
- Your browser and device information

---

## Contact Information

### Technical Support

For technical issues, login problems, or system errors:
- Email: support@aiims.edu
- Phone: [Your Support Number]

### Admin Support

For account creation, permissions, or general questions:
- Email: admin@aiims.edu
- Contact your system administrator

### Infection Control Team

For questions about hand hygiene protocols or audit procedures:
- Email: infectioncontrol@aiims.edu
- Contact your infection control department

---

## Quick Reference Guide

### Staff Quick Actions

- **Record Observation:** Dashboard > New Observation
- **View Points:** Dashboard (top of page)
- **Check Leaderboard:** Menu > Leaderboard
- **Redeem Reward:** Menu > Rewards > Redeem
- **View History:** Menu > History

### Auditor Quick Actions

- **Start Session:** Dashboard > New Session
- **Record Observation:** Active Session > Add Observation
- **View Reports:** Menu > Reports
- **End Session:** Active Session > End Session

### Admin Quick Actions

- **Add User:** Users > Add New User
- **Approve Reward:** Rewards > Pending Approvals > Approve
- **Generate Report:** Reports > Generate Report
- **Manage Wards:** Wards > Add/Edit Ward

---

## Best Practices

### For Staff

- Record observations right after hand hygiene
- Be honest in your recording (whether compliant or not)
- Check your dashboard regularly
- Aim for consistent compliance
- Review your statistics to see where you can improve

### For Auditors

- Create a session before starting your audit
- Record observations accurately and objectively
- Include detailed notes when helpful
- End your session after completing the audit
- Review session reports for insights

### For Admins

- Review pending approvals daily
- Monitor system statistics regularly
- Generate reports for management
- Keep user accounts up to date
- Respond to user queries promptly

---

## Keyboard Shortcuts

**General:**
- `Ctrl + /` or `Cmd + /` - Open search
- `Esc` - Close modal or dialog
- `F5` or `Ctrl + R` - Refresh page

**Navigation:**
- `Alt + D` - Go to Dashboard
- `Alt + P` - Go to Profile
- `Alt + H` - Go to History/Reports

**Forms:**
- `Tab` - Move to next field
- `Shift + Tab` - Move to previous field
- `Enter` - Submit form

---

**Thank you for using the AIIMS Hand Hygiene Portal!**

Together, we can improve patient safety through better hand hygiene compliance.

---

*Document Version: 1.0*  
*Last Updated: January 2025*  
*For the latest version, visit: [Your Portal URL]/help*