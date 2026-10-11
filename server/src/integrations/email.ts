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

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
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
  } catch (error) {
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
export async function sendOtpEmail(email: string, otp: string, name: string): Promise<void> {
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
export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: number,
  amount: number
): Promise<void> {
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
export async function sendTicketEmail(
  email: string,
  name: string,
  ticketNumber: string,
  eventTitle: string
): Promise<void> {
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

/**
 * Send guest digital pass confirmation email
 */
export async function sendGuestPassEmail(
  email: string,
  name: string,
  attendeeId: number,
  qrToken: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Your Digital Guest Pass - Attendee #${attendeeId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden;">
        <div style="background: #18181b; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Campus Events Digital Pass</h2>
          <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px;">Official Non-Member Pass</p>
        </div>
        <div style="padding: 24px;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your attendee pass has been verified and registered for campus events.</p>
          <div style="background: #f4f4f5; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #71717a;">Attendee ID</div>
            <div style="font-size: 18px; font-weight: bold; color: #18181b; font-family: monospace;">#${attendeeId}</div>
            <div style="margin-top: 8px; font-size: 12px; color: #71717a;">Pass Token</div>
            <div style="font-size: 13px; font-weight: bold; color: #047857; font-family: monospace;">${qrToken}</div>
          </div>
          <p style="font-size: 13px; color: #52525b;">Present your digital pass QR code at the event gate or when purchasing reserved tickets.</p>
        </div>
      </div>
    `,
    text: `Hello ${name}, your digital pass for Attendee #${attendeeId} is confirmed. Pass token: ${qrToken}.`,
  });
}

export { transporter };
