const nodemailer = require('nodemailer');
const { emailTemplate } = require('../utils/emailTemplate');

const sendEmail = async ({ to, subject, name, email, plainPassword, role }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const html = emailTemplate({ name, email, plainPassword , role});

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

    // console.log(`Email sent to ${to} with subject "${subject}"`);
};

module.exports = sendEmail;
