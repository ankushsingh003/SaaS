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
        subject: `You've been invited to join ${workspaceName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
                <div style="margin-bottom: 30px;">
                    <span style="background-color: #2563eb; color: white; padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Workspace Invitation</span>
                </div>
                
                <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; letter-spacing: -1px;">
                    Join <span style="color: #2563eb;">${workspaceName}</span> on SaaSify
                </h1>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Hello! <strong>${inviterName}</strong> has invited you to join their elite team space on SaaSify. You'll get access to premium dashboards, real-time collaboration, and team-wide analytics.
                </p>
                
                <div style="margin: 40px 0;">
                    <!-- Bulletproof Button -->
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="border-radius: 16px;" bgcolor="#2563eb">
                                <a href="${inviteLink}" target="_blank" style="font-size: 18px; font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 16px; padding: 18px 36px; border: 1px solid #2563eb; display: inline-block; font-weight: 800; letter-spacing: 1px;">
                                    ACCEPT & JOIN TEAM
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
                    <strong>Note:</strong> Since your workspace is currently in development, this button targets <code>${process.env.FRONTEND_URL || 'http://localhost:5174'}</code>.
                </p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                
                <p style="color: #64748b; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${inviteLink}" style="color: #2563eb;">${inviteLink}</a>
                </p>
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
