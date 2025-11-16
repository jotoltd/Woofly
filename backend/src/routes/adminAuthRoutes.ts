import express from 'express';
import { adminLogin, createFirstAdmin } from '../controllers/adminAuthController';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/setup', createFirstAdmin); // One-time setup endpoint

export default router;
