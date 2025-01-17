import nodemailer from "nodemailer";
import 'dotenv/config';

export const transporter =nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "8782c179d4e908",
        pass: "5219ccc4bc0079"
    }
});
