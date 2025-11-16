import express from 'express';
import { auth } from '../middleware/auth';
import {
  activateTag,
  getUserTags,
  linkTagToPet,
  unlinkTagFromPet,
  getPetByTagCode,
} from '../controllers/tagController';

const router = express.Router();

// Protected routes (require authentication)
router.post('/activate', auth, activateTag);
router.get('/', auth, getUserTags);
router.post('/link', auth, linkTagToPet);
router.delete('/:tagId/unlink', auth, unlinkTagFromPet);

// Public routes (tag scanning)
router.get('/scan/:tagCode', getPetByTagCode);

export default router;
