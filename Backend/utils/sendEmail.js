const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,

      port: process.env.SMTP_PORT,

      secure: false,

      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,

      to: email,

      subject,

      html: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.messageId);
  } catch (error) {
    console.log("Email Error:", error);

    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
