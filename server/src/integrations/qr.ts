import QRCode from 'qrcode';
import logger from '../utils/logger.js';

/**
 * Generate a QR code as a data URL (base64 PNG)
 */
export async function generateQrDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    });
  } catch (error) {
    logger.error('Failed to generate QR code', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate a QR code as a buffer (PNG)
 */
export async function generateQrBuffer(data: string): Promise<Buffer> {
  try {
    return await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    });
  } catch (error) {
    logger.error('Failed to generate QR code buffer', error);
    throw new Error('Failed to generate QR code');
  }
}
