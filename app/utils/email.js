import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// _________________________________________ send email ____________________________________________
export const sendEmail = async ({to, subject, html}) => {
  const info = await transporter.sendMail({
    from: process.env.USER,
    to,
    subject,
    html,
  });
};
