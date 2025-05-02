const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Please Verify Your Email Address",
    text: `Welcome! Please verify your email by clicking this link: ${verificationUrl}`,
    html: `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #1a1a1a;">Welcome to Our Platform!</h2>
        <p style="font-size: 16px;">Thank you for registering. Please verify your email address to complete your account setup:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email Address
        </a>
        <p style="font-size: 14px; color: #666;">
          If you didn't create this account, you can safely ignore this email.
        </p>
        <hr style="border: 1px solid #ddd;">
        <p style="font-size: 12px; color: #888;">
          Trouble clicking? Copy and paste this URL into your browser:<br>
          ${verificationUrl}
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
