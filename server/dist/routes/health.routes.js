import { Router } from 'express';
import { testConnection } from '../config/database.js';
const router = Router();
router.get('/', async (_req, res) => {
    const dbConnected = await testConnection();
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbConnected ? 'connected' : 'disconnected',
            environment: process.env.NODE_ENV,
        },
    });
});
export default router;
//# sourceMappingURL=health.routes.js.map