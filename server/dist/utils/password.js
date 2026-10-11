import bcrypt from 'bcrypt';
import logger from './logger.js';
const SALT_ROUNDS = 12;
export async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    }
    catch (error) {
        logger.error('Password hashing failed', error);
        throw new Error('Failed to hash password');
    }
}
export async function verifyPassword(password, hash) {
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    }
    catch (error) {
        logger.error('Password verification failed', error);
        return false;
    }
}
//# sourceMappingURL=password.js.map