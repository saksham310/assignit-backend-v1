import nodemailer from "nodemailer";
import 'dotenv/config';

// Validate SMTP configuration
const validateSMTPConfig = () => {
    const required = ['SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('⚠️  Missing SMTP configuration:', missing.join(', '));
        return false;
    }
    return true;
};

// Create transporter with environment-based configuration
// Supports both secure (TLS/SSL) and non-secure connections
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    // Add connection timeout and other options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Enable debug for troubleshooting
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production'
});

// Log SMTP configuration on startup (without sensitive data)
if (validateSMTPConfig()) {
    console.log('✅ SMTP Configuration loaded:');
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   Port: ${process.env.SMTP_PORT || 587}`);
    console.log(`   Secure: ${process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465'}`);
    console.log(`   Username: ${process.env.SMTP_USERNAME}`);
    
    // Verify SMTP connection on startup
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ SMTP Connection Error:', error.message);
            console.error('   Please check your SMTP credentials and firewall settings');
        } else {
            console.log('✅ SMTP Server is ready to send emails');
        }
    });
} else {
    console.error('❌ SMTP not configured properly. Emails will not be sent.');
}