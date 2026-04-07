import {mailGenerator} from "../config/mailgen.config.js";
import {transporter} from "../config/nodemailer.config.js";
import 'dotenv/config';

export const sendEmail = async (subject, emailTemplate, to) => {
    const emailBody = mailGenerator.generate(emailTemplate);
    const fromName = process.env.MAIL_FROM_NAME || "AssignIt";
    const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.SMTP_USERNAME;
    
    const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: to,
        subject: subject,
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", to);
        console.log("   Message ID:", info.messageId);
        return { success: true, info };
    } catch (error) {
        console.error("❌ Error sending email to:", to);
        console.error("   Error:", error.message);
        
        // Provide specific error guidance
        if (error.code === 'ETIMEDOUT') {
            console.error("   → Check: SMTP host and port are correct");
            console.error("   → Check: Firewall allows outbound connection to SMTP server");
            console.error("   → Try: Different SMTP port (587, 465, or 2525)");
        } else if (error.code === 'EAUTH') {
            console.error("   → Check: SMTP username and password are correct");
            console.error("   → Check: 2FA or App Password is required (for Gmail)");
        } else if (error.code === 'ECONNREFUSED') {
            console.error("   → Check: SMTP server is running and accessible");
            console.error("   → Check: Port is correct");
        }
        
        return { success: false, error };
    }
};