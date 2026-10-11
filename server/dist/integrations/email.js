import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
    },
});
/**
 * Send an email
 */
export async function sendEmail(options) {
    try {
        const info = await transporter.sendMail({
            from: env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        logger.info('Email sent', {
            messageId: info.messageId,
            to: options.to,
            subject: options.subject,
        });
    }
    catch (error) {
        logger.error('Failed to send email', {
            to: options.to,
            subject: options.subject,
            error,
        });
        // Don't throw - email failure shouldn't block the main flow
    }
}
/**
 * Send OTP verification email
 */
export async function sendOtpEmail(email, otp, name) {
    await sendEmail({
        to: email,
        subject: 'Your Verification Code',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes. Do not share it with anyone.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
        text: `Hello ${name}, your verification code is: ${otp}. This code expires in 10 minutes.`,
    });
}
/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(email, name, orderId, amount) {
    await sendEmail({
        to: email,
        subject: `Order Confirmed - #${orderId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Order Confirmed!</h2>
        <p>Hello ${name},</p>
        <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
        <p>Amount paid: <strong>₹${(amount / 100).toFixed(2)}</strong></p>
        <p>Thank you for your purchase!</p>
      </div>
    `,
        text: `Hello ${name}, your order #${orderId} has been confirmed. Amount paid: ₹${(amount / 100).toFixed(2)}.`,
    });
}
/**
 * Send ticket email
 */
export async function sendTicketEmail(email, name, ticketNumber, eventTitle) {
    await sendEmail({
        to: email,
        subject: `Your Ticket - ${eventTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Your Ticket is Ready!</h2>
        <p>Hello ${name},</p>
        <p>Here is your ticket for <strong>${eventTitle}</strong>:</p>
        <div style="text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
          <p style="font-size: 18px; font-weight: bold;">${ticketNumber}</p>
        </div>
        <p>Please present the QR code at the venue for check-in.</p>
      </div>
    `,
        text: `Hello ${name}, your ticket ${ticketNumber} for ${eventTitle} is ready. Present the QR code at the venue.`,
    });
}
export { transporter };
//# sourceMappingURL=email.js.map