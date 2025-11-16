import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import {
  generateTags,
  getAllTags,
  getTagStats,
  getProgrammingData,
  getUsersWithAssets,
} from '../controllers/factoryController';

const router = express.Router();

// All factory routes require admin authentication
router.post('/generate', adminAuth, generateTags);
router.get('/tags', adminAuth, getAllTags);
router.get('/stats', adminAuth, getTagStats);
router.get('/program/:tagId', adminAuth, getProgrammingData);
router.get('/users', adminAuth, getUsersWithAssets);

export default router;
