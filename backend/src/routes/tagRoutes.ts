import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  activateTag,
  getUserTags,
  linkTagToPet,
  unlinkTagFromPet,
  getPetByTagCode,
  validateActivationCode,
} from '../controllers/tagController';

const router = express.Router();

// Public routes (tag scanning and validation)
router.get('/scan/:tagCode', getPetByTagCode);
router.post('/validate-code', validateActivationCode);

// Protected routes (require authentication)
router.post('/activate', authenticateToken, activateTag);
router.get('/', authenticateToken, getUserTags);
router.post('/link', authenticateToken, linkTagToPet);
router.delete('/:tagId/unlink', authenticateToken, unlinkTagFromPet);

export default router;
