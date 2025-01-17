import nodemailer from "nodemailer";
import 'dotenv/config';

export const transporter =nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "5a6191c30050de",
        pass: "e732612b178626"
    }
});

