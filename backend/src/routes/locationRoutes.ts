import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  recordLocationScan,
  getLocationScans,
} from '../controllers/locationController';

const router = express.Router();

// Public route - anyone can report location when they find a pet
router.post('/scan/:petId', recordLocationScan);

// Protected route - only owner can view scans
router.get('/scans/:petId', authenticateToken, getLocationScans);

export default router;
