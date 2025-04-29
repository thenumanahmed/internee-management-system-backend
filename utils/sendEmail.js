const nodemailer = require('nodemailer');
const { inviteEmailTemplate , otpEmailTemplate} = require('./emailTemplates');

const sendInviteEmail = async ({ to, subject, name, email, plainPassword, role }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const inviteTemplate = inviteEmailTemplate({ name, email, plainPassword, role });

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html:inviteTemplate
    });

    // console.log(`Email sent to ${to} with subject "${subject} ${inviteTemplate}"`);
};

const sendOTPEmail = async ({ to, subject, name, otp }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const otpTemplate = otpEmailTemplate({ name, otp });

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: otpTemplate
    });

    // console.log(`OTP email sent to ${to} with subject "${subject}"`);
};

module.exports = { sendOTPEmail, sendInviteEmail };
