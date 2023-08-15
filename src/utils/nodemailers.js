import nodemailer from 'nodemailer';
import { EMAIL, PASSWORD } from './config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
});

export default transporter