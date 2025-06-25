import nodemailer from "nodemailer";
import 'dotenv/config';

// export const transporter =nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 587,
//     auth: {
//         user: "8782c179d4e908",
//         pass: "5219ccc4bc0079"
//     }
// });

export const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.ZOHO_APP_PASSWORD,
    }
})