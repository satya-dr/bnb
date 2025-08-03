const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS 
  },
});

function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Your OTP Code for Verification",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail;
