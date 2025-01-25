import {mailGenerator} from "../config/mailgen.config.js";
import {transporter} from "../config/nodemailer.config.js";
import 'dotenv/config';

export const sendEmail = (subject, emailTemplate, to) => {
    const emailBody = mailGenerator.generate(emailTemplate);
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: emailBody,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error while sending email:", error);
                reject({ success: false, error });
            } else {
                console.log("Email sent successfully:", info.response);
                resolve({ success: true, info });
            }
        });
    });
};