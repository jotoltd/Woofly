import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import {
  generateTags,
  getAllTags,
  getTagStats,
  getProgrammingData,
  getUsersWithAssets,
  adminUnlinkTagFromPet,
  adminUpdateUser,
  adminDeleteUser,
  adminGetAllPets,
  adminUpdatePet,
  adminTransferPet,
  adminDeletePet,
  adminUpdateTag,
  adminDeleteTag,
} from '../controllers/factoryController';

const router = express.Router();

// All factory routes require admin authentication
router.post('/generate', adminAuth, generateTags);
router.get('/tags', adminAuth, getAllTags);
router.get('/stats', adminAuth, getTagStats);
router.get('/program/:tagId', adminAuth, getProgrammingData);

// User management
router.get('/users', adminAuth, getUsersWithAssets);
router.patch('/users/:userId', adminAuth, adminUpdateUser);
router.delete('/users/:userId', adminAuth, adminDeleteUser);

// Pet management
router.get('/pets', adminAuth, adminGetAllPets);
router.patch('/pets/:petId', adminAuth, adminUpdatePet);
router.patch('/pets/:petId/transfer', adminAuth, adminTransferPet);
router.delete('/pets/:petId', adminAuth, adminDeletePet);

// Tag management
router.post('/tags/:tagId/unlink', adminAuth, adminUnlinkTagFromPet);
router.patch('/tags/:tagId', adminAuth, adminUpdateTag);
router.delete('/tags/:tagId', adminAuth, adminDeleteTag);

export default router;
