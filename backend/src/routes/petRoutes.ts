import express from 'express';
import {
  createPet,
  getUserPets,
  getPetById,
  getPetByQRCode,
  getPetByNFCId,
  generateQRCode,
  updatePet,
  uploadPetImage,
  toggleLostStatus,
  deletePet,
  updatePrivacySettings,
} from '../controllers/petController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Protected routes (require authentication)
// Note: More specific routes must come before generic /:id route
router.post('/', authenticateToken, createPet);
router.get('/', authenticateToken, getUserPets);
router.get('/:id/qrcode', authenticateToken, generateQRCode);
router.post('/:id/upload', authenticateToken, upload.single('image'), uploadPetImage);
router.patch('/:id/lost-status', authenticateToken, toggleLostStatus);
router.patch('/:id/privacy', authenticateToken, updatePrivacySettings);
router.get('/:id', authenticateToken, getPetById);
router.put('/:id', authenticateToken, updatePet);
router.delete('/:id', authenticateToken, deletePet);

// Public routes (no authentication required)
router.get('/public/qr/:qrCode', getPetByQRCode);
router.get('/public/nfc/:nfcId', getPetByNFCId);

export default router;
