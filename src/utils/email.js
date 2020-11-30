/* eslint-disable import/prefer-default-export */
import nodemailer from 'nodemailer';

// build transporter to allow server to send emails from the no-reply address
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.NO_REPLY_EMAIL_ADDRESS,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
  },
});

export const sendPasswordResetEmail = async (email, newPassword) => {
  try {
    const result = await transporter.sendMail({
      from: `Pine Beetle Prediction <${process.env.NO_REPLY_EMAIL_ADDRESS}>`, // sender address
      to: email, // list of receivers
      subject: 'Pine Beetle Prediction Temporary Password', // subject line
      html: `<html>
        <p>Your Pine Beetle Prediction temporary password is <strong>${newPassword}</strong>.</p>
        <p>Use it to log into the <a href="https://pine-beetle-prediction.netlify.app">website</a>, then change your password.</p>
      </html>`,
    });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
