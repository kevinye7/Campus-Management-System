/*==================================================
/utils/email.js

Email utility functions for sending emails.
==================================================*/
const nodemailer = require('nodemailer');

// Configure email transporter
// In production, use environment variables for email credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

// Generate a random password
const generateDefaultPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Send welcome email with default password
const sendWelcomeEmail = async (email, firstName, username, defaultPassword) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@campus-management.com',
    to: email,
    subject: 'Welcome to Campus Management System - Account Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Campus Management System!</h2>
        <p>Hello ${firstName},</p>
        <p>Your account has been created by an administrator.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Temporary Password:</strong> ${defaultPassword}</p>
        <p style="color: red; font-weight: bold;">Please change your password immediately after logging in.</p>
        <p>You can log in at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">Login Page</a></p>
        <p>If you did not request this account, please contact your administrator.</p>
        <br>
        <p>Best regards,<br>Campus Management System</p>
      </div>
    `,
    text: `
      Welcome to Campus Management System!
      
      Hello ${firstName},
      
      Your account has been created by an administrator.
      
      Username: ${username}
      Temporary Password: ${defaultPassword}
      
      Please change your password immediately after logging in.
      
      You can log in at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login
      
      If you did not request this account, please contact your administrator.
      
      Best regards,
      Campus Management System
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, firstName, newPassword) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@campus-management.com',
    to: email,
    subject: 'Password Reset - Campus Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${firstName},</p>
        <p>Your password has been reset by an administrator.</p>
        <p><strong>New Temporary Password:</strong> ${newPassword}</p>
        <p style="color: red; font-weight: bold;">Please change your password immediately after logging in.</p>
        <p>You can log in at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">Login Page</a></p>
        <p>If you did not request this password reset, please contact your administrator immediately.</p>
        <br>
        <p>Best regards,<br>Campus Management System</p>
      </div>
    `,
    text: `
      Password Reset
      
      Hello ${firstName},
      
      Your password has been reset by an administrator.
      
      New Temporary Password: ${newPassword}
      
      Please change your password immediately after logging in.
      
      You can log in at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login
      
      If you did not request this password reset, please contact your administrator immediately.
      
      Best regards,
      Campus Management System
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateDefaultPassword,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};

