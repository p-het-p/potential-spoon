import nodemailer from 'nodemailer';
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
/**
 * Send an email
 */
export declare function sendEmail(options: EmailOptions): Promise<void>;
/**
 * Send OTP verification email
 */
export declare function sendOtpEmail(email: string, otp: string, name: string): Promise<void>;
/**
 * Send order confirmation email
 */
export declare function sendOrderConfirmationEmail(email: string, name: string, orderId: number, amount: number): Promise<void>;
/**
 * Send ticket email
 */
export declare function sendTicketEmail(email: string, name: string, ticketNumber: string, eventTitle: string): Promise<void>;
/**
 * Send guest digital pass confirmation email
 */
export declare function sendGuestPassEmail(email: string, name: string, attendeeId: number, qrToken: string): Promise<void>;
export { transporter };
//# sourceMappingURL=email.d.ts.map