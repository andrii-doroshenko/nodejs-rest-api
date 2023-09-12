"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

const { GMAIL_PASS, GMAIL_USER, BASE_URL } = process.env;

const config = {
  service: 'gmail',
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const createEmail = (recipient, verificationToken) => {
  return {
    to: recipient,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify Email</a>`,
  };
};

const sendEmail = async (data) => {
  const email = { ...data, from: GMAIL_USER };
  
  try {
    const info = await transporter.sendMail(email);
    console.log("Verification Email has been sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createEmail, sendEmail };
