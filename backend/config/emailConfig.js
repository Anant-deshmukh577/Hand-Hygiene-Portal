import nodemailer from 'nodemailer';

// Create transporter lazily to ensure env vars are loaded
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Email server connection failed:', error.message);
        console.log('   Please check SMTP configuration in .env file');
      } else {
        console.log('✅ Email server is ready to send messages');
      }
    });
  }
  return transporter;
};

// Initialize transporter on module load to verify connection early
export const initializeEmailService = () => {
  try {
    getTransporter();
  } catch (error) {
    console.log('⚠️  Email service initialization failed:', error.message);
  }
};

// Base email template
const getEmailTemplate = (content, title = 'AIIMS Hand Hygiene Portal') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background-color: #007bff; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; text-align: center;">
                🏥 AIIMS Hand Hygiene Portal
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center;">
                This is an automated message from AIIMS Hand Hygiene Portal.<br>
                All India Institute of Medical Sciences, Ansari Nagar, New Delhi - 110029<br>
                <a href="mailto:infection.control@aiims.edu" style="color: #007bff;">Contact Infection Control Team</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Send email function
export const sendEmail = async (options) => {
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await getTransporter().sendMail(message);
  console.log(`📧 Email sent to ${options.email}: ${info.messageId}`);
  return info;
};

// Send welcome email to new users
export const sendWelcomeEmail = async (user) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Welcome email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Welcome to AIIMS Hand Hygiene Portal! 👋</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      Your account has been successfully created. You are now part of our mission to improve hand hygiene compliance at AIIMS.
    </p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Your Account Details:</h3>
      <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${user.email}</p>
      ${user.department ? `<p style="margin: 5px 0; color: #555;"><strong>Department:</strong> ${user.department}</p>` : ''}
      ${user.designation ? `<p style="margin: 5px 0; color: #555;"><strong>Designation:</strong> ${user.designation}</p>` : ''}
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      <strong>What you can do:</strong>
    </p>
    <ul style="color: #555; line-height: 1.8;">
      <li>Record hand hygiene observations</li>
      <li>Track your compliance rate</li>
      <li>Earn points and badges</li>
      <li>View your ranking on the leaderboard</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Go to Dashboard
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      If you have any questions, please contact the Infection Control Team.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Infection Control Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to AIIMS Hand Hygiene Portal! 🏥',
    html: getEmailTemplate(content, 'Welcome'),
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetUrl) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Password reset email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Password Reset Request 🔐</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      We received a request to reset your password for your AIIMS Hand Hygiene Portal account.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #dc3545; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; color: #007bff;">
      ${resetUrl}
    </p>
    
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; color: #856404;">
        <strong>⚠️ Important:</strong> This link will expire in <strong>10 minutes</strong>.
      </p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      If you did not request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - AIIMS Hand Hygiene Portal',
    html: getEmailTemplate(content, 'Password Reset'),
  });
};

// Send password changed confirmation email
export const sendPasswordChangedEmail = async (user) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Password changed email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Password Changed Successfully ✅</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      Your password has been successfully changed for your AIIMS Hand Hygiene Portal account.
    </p>
    
    <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <p style="margin: 0; color: #155724;">
        <strong>✅ Password Updated:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      If you did not make this change, please contact the administrator immediately.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Changed - AIIMS Hand Hygiene Portal',
    html: getEmailTemplate(content, 'Password Changed'),
  });
};

// Send badge earned notification
export const sendBadgeEarnedEmail = async (user, badge) => {
  // Check if user has badge alerts enabled
  if (!user.notificationPreferences?.badgeAlerts) {
    console.log(`Badge alert email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Congratulations! You've Earned a Badge! 🏆</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      Great news! You've earned a new badge for your dedication to hand hygiene compliance.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #ffc107, #ff8c00); padding: 30px; border-radius: 50%; margin-bottom: 15px;">
        <span style="font-size: 48px;">${badge.icon || '🏅'}</span>
      </div>
      <h3 style="color: #333; margin: 10px 0;">${badge.name}</h3>
      <p style="color: #6c757d;">${badge.description}</p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Keep up the excellent work! Your commitment to patient safety makes a difference.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/profile" style="background-color: #28a745; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Your Badges
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Infection Control Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: `🏆 You've Earned the ${badge.name} Badge!`,
    html: getEmailTemplate(content, 'Badge Earned'),
  });
};

// Send weekly compliance report
export const sendWeeklyReportEmail = async (user, stats) => {
  // Check if user has weekly reports enabled
  if (!user.notificationPreferences?.weeklyReports) {
    console.log(`Weekly report email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const complianceColor = stats.complianceRate >= 80 ? '#28a745' : stats.complianceRate >= 60 ? '#ffc107' : '#dc3545';
  
  const content = `
    <h2 style="color: #333; margin-top: 0;">Your Weekly Compliance Report 📊</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      Here's your hand hygiene compliance summary for this week:
    </p>
    
    <div style="display: flex; gap: 15px; margin: 25px 0; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 120px; background-color: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 28px; font-weight: bold; color: #1976d2;">${stats.totalObservations}</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Observations</p>
      </div>
      <div style="flex: 1; min-width: 120px; background-color: #f3e5f5; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 28px; font-weight: bold; color: ${complianceColor};">${stats.complianceRate}%</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Compliance</p>
      </div>
      <div style="flex: 1; min-width: 120px; background-color: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 28px; font-weight: bold; color: #f57c00;">${stats.points}</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Points Earned</p>
      </div>
    </div>
    
    ${stats.complianceRate >= 80 ? `
      <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <p style="margin: 0; color: #155724;">
          <strong>🌟 Excellent Work!</strong> Your compliance rate is above 80%. Keep it up!
        </p>
      </div>
    ` : stats.complianceRate < 60 ? `
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
        <p style="margin: 0; color: #721c24;">
          <strong>📈 Room for Improvement:</strong> Let's work on improving your compliance rate. Remember, every hand hygiene moment counts!
        </p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/reports" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Full Report
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Infection Control Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: '📊 Your Weekly Hand Hygiene Report - AIIMS',
    html: getEmailTemplate(content, 'Weekly Report'),
  });
};

// Send reward claimed notification (to user and admin)
export const sendRewardClaimedEmail = async (user, reward, userReward) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Reward claimed email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Reward Claimed Successfully! 🎁</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      You have successfully claimed a reward. Your request is now pending approval from the admin team.
    </p>
    
    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <h3 style="margin-top: 0; color: #856404;">Reward Details:</h3>
      <p style="margin: 5px 0; color: #856404;"><strong>Reward:</strong> ${reward.icon || '🎁'} ${reward.title}</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Description:</strong> ${reward.description}</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Points Spent:</strong> ${userReward.pointsSpent} points</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Status:</strong> <span style="background-color: #ffc107; color: #fff; padding: 2px 8px; border-radius: 4px;">Pending Approval</span></p>
      <p style="margin: 5px 0; color: #856404;"><strong>Claimed On:</strong> ${new Date(userReward.claimedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
    
    <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
      <p style="margin: 0; color: #0d47a1;">
        <strong>ℹ️ What's Next?</strong><br>
        Your reward claim will be reviewed by the admin team. You will receive an email notification once your reward is approved or if any additional information is needed.
      </p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Thank you for your dedication to hand hygiene compliance!
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/rewards" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View My Rewards
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: '🎁 Reward Claimed - Pending Approval',
    html: getEmailTemplate(content, 'Reward Claimed'),
  });
};

// Send reward claimed notification to admin
export const sendRewardClaimedAdminEmail = async (adminEmail, user, reward, userReward) => {
  const content = `
    <h2 style="color: #333; margin-top: 0;">New Reward Claim Pending Approval 🔔</h2>
    <p style="color: #555; line-height: 1.6;">
      A staff member has claimed a reward and is awaiting your approval.
    </p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Staff Member Details:</h3>
      <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${user.name}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${user.email}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Department:</strong> ${user.department || 'N/A'}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Designation:</strong> ${user.designation || 'N/A'}</p>
    </div>
    
    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <h3 style="margin-top: 0; color: #856404;">Reward Details:</h3>
      <p style="margin: 5px 0; color: #856404;"><strong>Reward:</strong> ${reward.icon || '🎁'} ${reward.title}</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Description:</strong> ${reward.description}</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Points Spent:</strong> ${userReward.pointsSpent} points</p>
      <p style="margin: 5px 0; color: #856404;"><strong>Claimed On:</strong> ${new Date(userReward.claimedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/admin/rewards" style="background-color: #28a745; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
        Approve Reward
      </a>
      <a href="${process.env.FRONTEND_URL}/admin/rewards" style="background-color: #dc3545; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reject Reward
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Please review and process this reward claim at your earliest convenience.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal System</strong>
    </p>
  `;

  await sendEmail({
    email: adminEmail,
    subject: '🔔 New Reward Claim Pending Approval',
    html: getEmailTemplate(content, 'Reward Claim - Admin Notification'),
  });
};

// Send reward approved notification
export const sendRewardApprovedEmail = async (user, reward, userReward) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Reward approved email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Reward Approved! 🎉</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      Great news! Your reward claim has been approved by the admin team.
    </p>
    
    <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h3 style="margin-top: 0; color: #155724;">Approved Reward Details:</h3>
      <p style="margin: 5px 0; color: #155724;"><strong>Reward:</strong> ${reward.icon || '🎁'} ${reward.title}</p>
      <p style="margin: 5px 0; color: #155724;"><strong>Description:</strong> ${reward.description}</p>
      <p style="margin: 5px 0; color: #155724;"><strong>Points Spent:</strong> ${userReward.pointsSpent} points</p>
      <p style="margin: 5px 0; color: #155724;"><strong>Status:</strong> <span style="background-color: #28a745; color: #fff; padding: 2px 8px; border-radius: 4px;">Approved</span></p>
      ${userReward.rewardCode ? `<p style="margin: 5px 0; color: #155724;"><strong>Reward Code:</strong> <span style="background-color: #fff; padding: 4px 12px; border-radius: 4px; font-family: monospace; font-size: 16px; border: 2px dashed #28a745;">${userReward.rewardCode}</span></p>` : ''}
      <p style="margin: 5px 0; color: #155724;"><strong>Approved On:</strong> ${new Date(userReward.approvedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
    
    ${userReward.notes ? `
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <p style="margin: 0; color: #0d47a1;">
          <strong>📝 Admin Notes:</strong><br>
          ${userReward.notes}
        </p>
      </div>
    ` : ''}
    
    <p style="color: #555; line-height: 1.6;">
      Congratulations! You can now redeem your reward. Please contact the admin team if you have any questions about redemption.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/rewards" style="background-color: #28a745; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View My Rewards
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Keep up the excellent work with hand hygiene compliance!
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: '🎉 Your Reward Has Been Approved!',
    html: getEmailTemplate(content, 'Reward Approved'),
  });
};

// Send reward rejected notification
export const sendRewardRejectedEmail = async (user, reward, userReward) => {
  // Check if user has email notifications enabled
  if (!user.notificationPreferences?.emailNotifications) {
    console.log(`Reward rejected email skipped for ${user.email} - notifications disabled`);
    return;
  }

  const content = `
    <h2 style="color: #333; margin-top: 0;">Reward Claim Update ℹ️</h2>
    <p style="color: #555; line-height: 1.6;">
      Dear <strong>${user.name}</strong>,
    </p>
    <p style="color: #555; line-height: 1.6;">
      We regret to inform you that your reward claim could not be approved at this time.
    </p>
    
    <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
      <h3 style="margin-top: 0; color: #721c24;">Reward Details:</h3>
      <p style="margin: 5px 0; color: #721c24;"><strong>Reward:</strong> ${reward.icon || '🎁'} ${reward.title}</p>
      <p style="margin: 5px 0; color: #721c24;"><strong>Points Spent:</strong> ${userReward.pointsSpent} points</p>
      <p style="margin: 5px 0; color: #721c24;"><strong>Status:</strong> <span style="background-color: #dc3545; color: #fff; padding: 2px 8px; border-radius: 4px;">Rejected</span></p>
    </div>
    
    ${userReward.notes ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;">
          <strong>📝 Reason:</strong><br>
          ${userReward.notes}
        </p>
      </div>
    ` : ''}
    
    <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <p style="margin: 0; color: #155724;">
        <strong>✅ Points Refunded:</strong> ${userReward.pointsSpent} points have been refunded to your account.
      </p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Don't worry! Your points have been fully refunded and you can use them to claim other rewards. If you have any questions, please contact the admin team.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/rewards" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Browse Other Rewards
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Thank you for your understanding and continued dedication to hand hygiene compliance.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal Team</strong>
    </p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Reward Claim Update - Points Refunded',
    html: getEmailTemplate(content, 'Reward Rejected'),
  });
};

// Send observation recorded notification (to admin/auditor supervisor)
export const sendObservationRecordedEmail = async (adminEmail, observation, auditor, ward) => {
  const adherenceColor = observation.adherence === 'adherence' ? '#28a745' : observation.adherence === 'partial' ? '#ffc107' : '#dc3545';
  const adherenceText = observation.adherence === 'adherence' ? 'Adherence' : observation.adherence === 'partial' ? 'Partial Adherence' : 'Missed';
  
  const content = `
    <h2 style="color: #333; margin-top: 0;">New Hand Hygiene Observation Recorded 📋</h2>
    <p style="color: #555; line-height: 1.6;">
      A new hand hygiene observation has been recorded in the system.
    </p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Auditor Details:</h3>
      <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${auditor.name}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${auditor.email}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Department:</strong> ${auditor.department || 'N/A'}</p>
    </div>
    
    <div style="background-color: ${adherenceColor}15; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${adherenceColor};">
      <h3 style="margin-top: 0; color: #333;">Observation Details:</h3>
      <p style="margin: 5px 0; color: #555;"><strong>Ward:</strong> ${ward?.name || 'N/A'}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Department:</strong> ${observation.department || 'N/A'}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Designation:</strong> ${observation.designation || 'N/A'}</p>
      <p style="margin: 5px 0; color: #555;"><strong>WHO Moment:</strong> ${observation.whoMoment || 'N/A'}</p>
      <p style="margin: 5px 0; color: #555;"><strong>Adherence:</strong> <span style="background-color: ${adherenceColor}; color: #fff; padding: 2px 8px; border-radius: 4px;">${adherenceText}</span></p>
      <p style="margin: 5px 0; color: #555;"><strong>Action:</strong> ${observation.action || 'N/A'}</p>
      ${observation.glove ? `<p style="margin: 5px 0; color: #555;"><strong>Glove Used:</strong> ${observation.glove}</p>` : ''}
      ${observation.remarks ? `<p style="margin: 5px 0; color: #555;"><strong>Remarks:</strong> ${observation.remarks}</p>` : ''}
      <p style="margin: 5px 0; color: #555;"><strong>Recorded On:</strong> ${new Date(observation.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
    
    ${observation.points > 0 ? `
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
        <p style="margin: 0; color: #e65100;">
          <strong>⭐ Points Awarded:</strong> ${observation.points} points
        </p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/admin/observations" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View All Observations
      </a>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      This is an automated notification from the Hand Hygiene Monitoring System.
    </p>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>AIIMS Hand Hygiene Portal System</strong>
    </p>
  `;

  await sendEmail({
    email: adminEmail,
    subject: '📋 New Hand Hygiene Observation Recorded',
    html: getEmailTemplate(content, 'Observation Recorded'),
  });
};

export default getTransporter;
