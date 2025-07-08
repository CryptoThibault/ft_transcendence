// backend/auth-service/src/utils/email.ts
/*import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
    console.log(`[DEBUG] Sending OTP to ${to}: ${otp}`);
    try {
        const info = await transporter.sendMail({
            from: `"Auth Service" <${SMTP_USER || 'no-reply@auth.local'}>`,
            to,
            subject: 'Your OTP Code',
            html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        });
        console.log('[DEBUG] Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('[ERROR] Failed to send OTP email:', error);
        return false;
    }
}
*/
/*export async function sendOtpEmail(to: string, otp: string) {
  console.log(`[DEBUG] Sending OTP to ${to}: ${otp}`);
  const info = await transporter.sendMail({
    from: `"Auth Service" <${SMTP_USER || 'no-reply@auth.local'}>`,
    to,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  });
  console.log('[DEBUG] Email sent:', info.messageId);
}*/
