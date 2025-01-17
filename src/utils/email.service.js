import {mailGenerator} from "../config/mailgen.config.js";
import {transporter} from "../config/nodemailer.config.js";
import 'dotenv/config';

export const sendEmail=(subject,emailTemplate,to)=>{

    const emailBody=mailGenerator.generate(emailTemplate);
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: emailBody,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}