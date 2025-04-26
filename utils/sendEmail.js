const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    });
    console.log(`Email sent to ${to} with subject "${subject}" and text "${text}"`);
};

module.exports = sendEmail;
