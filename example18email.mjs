//

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function sendEmail(subject, email) {
  const message = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    email,
  };

  const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.APP_PASS,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.sendMail(message, function (err, response) {
    console.log(err || response);
  });
}

export { sendEmail };
