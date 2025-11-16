import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  activateTag,
  getUserTags,
  linkTagToPet,
  unlinkTagFromPet,
  getPetByTagCode,
} from '../controllers/tagController';

const router = express.Router();

// Protected routes (require authentication)
router.post('/activate', authenticateToken, activateTag);
router.get('/', authenticateToken, getUserTags);
router.post('/link', authenticateToken, linkTagToPet);
router.delete('/:tagId/unlink', authenticateToken, unlinkTagFromPet);

// Public routes (tag scanning)
router.get('/scan/:tagCode', getPetByTagCode);

export default router;
