import nodemailer from "nodemailer";

const transport = {
  host: process.env.HOST,
  port: Number(process.env.TRANSPORT_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
};
export const transporter = nodemailer.createTransport(transport);