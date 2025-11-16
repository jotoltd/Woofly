import express from 'express';
import { adminLogin, createFirstAdmin } from '../controllers/adminAuthController';

const router = express.Router();

// Admin login
router.post('/login', adminLogin);
// One-time setup endpoint – only available outside production
if (process.env.NODE_ENV !== 'production') {
  router.post('/setup', createFirstAdmin);
}

export default router;
