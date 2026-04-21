import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Mail Service:
 * Handles sending transactional emails using SMTP.
 */
let transporter;

const createTransporter = async () => {
    if (transporter) return transporter;

    let auth;
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'placeholder') {
        auth = {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        };
    } else {
        // Create ethereal account automatically for dev
        const testAccount = await nodemailer.createTestAccount();
        auth = {
            user: testAccount.user,
            pass: testAccount.pass
        };
        console.log('--- Dev Email Service Initialized (Ethereal) ---');
        console.log(`User: ${auth.user}`);
        console.log('-------------------------------------------------');
    }

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth
    });

    return transporter;
};

export const sendInvitationEmail = async (email, workspaceName, inviterName, inviteLink) => {
    const currentTransporter = await createTransporter();
    const mailOptions = {
        from: `"SaaSify Team" <${process.env.FROM_EMAIL || 'no-reply@saasify.com'}>`,
        to: email,
        subject: `You've been invited to join ${workspaceName} on SaaSify`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb;">Join your team on SaaSify</h2>
                <p>Hello,</p>
                <p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace on SaaSify.</p>
                <div style="margin: 30px 0;">
                    <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
                </div>
                <p style="color: #666; font-size: 14px;">If you don't have an account, you'll be asked to create one. This invitation link will expire in 7 days.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">If you didn't expect this invite, you can safely ignore this email.</p>
            </div>
        `
    };

    try {
        const info = await currentTransporter.sendMail(mailOptions);
        console.log('--- Email Sent Successfully ---');
        console.log('ID:', info.messageId);
        
        if (process.env.SMTP_HOST === 'smtp.ethereal.email' || !process.env.SMTP_HOST) {
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        return true;
    } catch (error) {
        console.error('--- Email Delivery Failed ---');
        console.error(error);
        throw new Error(`Email delivery failed: ${error.message}`);
    }
};
