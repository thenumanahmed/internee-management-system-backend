const inviteEmailTemplate = ({ name, email, plainPassword, role }) => {
  // Set login link based on role
  const loginLink = role === 'teamLead'
    ? 'https://www.lms-iifa.com/teamlead/login'
    : 'https://www.lms-iifa.com/login';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>IIFA LMS Account Created</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333;">Welcome, ${name}!</h2>
      <p>Your account has been successfully created on <b>IIFA LMS</b> as ${role == 'internee' ? " an Internee" : "a TeamLead"} .</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please log in and change your password as soon as possible for security reasons.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Login Now
        </a>
      </div>

      <p style="color: #777;">If you didn’t request this, you can ignore this email.</p>
    </div>
  </body>
  </html>
  `;
};
const otpEmailTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP for IIFA LMS</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333;">Hello, ${name}!</h2>
      <p>We received a request to send you a One-Time Password (OTP) for authentication on IIFA LMS.</p>
      <p><strong>Your OTP:</strong> <span style="font-size: 24px; font-weight: bold;">${otp}</span></p>
      <p>This OTP is valid for the next 10 minutes.</p>
      
      <p style="color: #777;">If you didn’t request this, please ignore this email.</p>
    </div>
  </body>
  </html>
  `;
};

module.exports = { otpEmailTemplate, inviteEmailTemplate };
