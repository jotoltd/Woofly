import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getPublicContacts,
} from '../controllers/contactController';

const router = express.Router();

// Protected routes (require authentication)
router.get('/pet/:petId', authenticateToken, getContacts);
router.post('/pet/:petId', authenticateToken, createContact);
router.put('/:contactId', authenticateToken, updateContact);
router.delete('/:contactId', authenticateToken, deleteContact);

// Public routes
router.get('/public/pet/:petId', getPublicContacts);

export default router;
