import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../utils/supabase';
import fs from 'fs';
import { sendPetAddedEmail, sendLostModeEmail } from '../services/emailService';

const prisma = new PrismaClient();

export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tagId, name, species, breed, age, sex, color, description, ownerPhone, ownerEmail, vetName, vetPhone, medicalInfo } = req.body;

    if (!tagId) {
      res.status(400).json({ error: 'Tag ID is required. Please activate a tag first.' });
      return;
    }

    if (!name || !species) {
      res.status(400).json({ error: 'Name and species are required' });
      return;
    }

    // Verify the tag exists, is activated, belongs to the user, and is not already linked
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    if (!tag.isActivated) {
      res.status(400).json({ error: 'This tag has not been activated yet' });
      return;
    }

    if (tag.userId !== req.userId) {
      res.status(403).json({ error: 'This tag does not belong to you' });
      return;
    }

    if (tag.petId) {
      res.status(400).json({ error: 'This tag is already linked to a pet' });
      return;
    }

    // Create the pet with tag codes for backwards compatibility
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        sex,
        color,
        description,
        userId: req.userId!,
        ownerPhone,
        ownerEmail,
        vetName,
        vetPhone,
        medicalInfo,
        qrCode: tag.tagCode, // Set legacy qrCode field
        nfcId: tag.tagCode,  // Set legacy nfcId field (both use tagCode)
      },
    });

    // Link the tag to the pet
    await prisma.tag.update({
      where: { id: tagId },
      data: { petId: pet.id },
    });

    // Return pet with tag info
    const petWithTag = await prisma.pet.findUnique({
      where: { id: pet.id },
      include: {
        tag: true,
        user: true,
      },
    });

    // Send pet added confirmation email (non-blocking)
    if (petWithTag && petWithTag.user && petWithTag.tag) {
      sendPetAddedEmail({
        to: petWithTag.user.email,
        name: petWithTag.user.name,
        petName: petWithTag.name,
        petSpecies: petWithTag.species,
        tagCode: petWithTag.tag.tagCode,
      }).catch(err => console.error('Failed to send pet added email:', err));
    }

    res.status(201).json(petWithTag);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pets = await prisma.pet.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        tag: true, // Include tag relation
      },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Public endpoint to get pet by QR code
export const getPetByQRCode = async (req: any, res: Response): Promise<void> => {
  try {
    const { qrCode } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { qrCode },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Return public information only
    res.json({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      imageUrl: pet.imageUrl,
      ownerName: pet.user.name,
      ownerPhone: pet.ownerPhone,
      ownerEmail: pet.ownerEmail,
      vetName: pet.vetName,
      vetPhone: pet.vetPhone,
      medicalInfo: pet.medicalInfo,
      isLost: pet.isLost,
      lostDate: pet.lostDate,
      lastSeenLocation: pet.lastSeenLocation,
    });
  } catch (error) {
    console.error('Get pet by QR error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Public endpoint to get pet by NFC ID
export const getPetByNFCId = async (req: any, res: Response): Promise<void> => {
  try {
    const { nfcId } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { nfcId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Return public information only
    res.json({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      imageUrl: pet.imageUrl,
      ownerName: pet.user.name,
      ownerPhone: pet.ownerPhone,
      ownerEmail: pet.ownerEmail,
      vetName: pet.vetName,
      vetPhone: pet.vetPhone,
      medicalInfo: pet.medicalInfo,
      isLost: pet.isLost,
      lostDate: pet.lostDate,
      lastSeenLocation: pet.lastSeenLocation,
    });
  } catch (error) {
    console.error('Get pet by NFC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Generate QR code as data URL
    const qrCodeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pet/${pet.qrCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

    res.json({ qrCodeImage, qrCode: pet.qrCode });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, species, breed, age, description, ownerPhone, ownerEmail, vetName, vetPhone, medicalInfo } = req.body;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        description,
        ownerPhone,
        ownerEmail,
        vetName,
        vetPhone,
        medicalInfo,
      },
    });

    res.json(updatedPet);
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadPetImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Upload to Supabase Storage
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `${uuidv4()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from('pet-images')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    if (error) {
      console.error('Supabase upload error:', error);
      res.status(500).json({ error: 'Failed to upload image to storage' });
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pet-images')
      .getPublicUrl(fileName);

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: { imageUrl: publicUrl },
    });

    res.json({ imageUrl: publicUrl, pet: updatedPet });
  } catch (error) {
    console.error('Upload pet image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleLostStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isLost, lostDate, lastSeenLocation } = req.body;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        isLost,
        lostDate: isLost ? (lostDate ? new Date(lostDate) : new Date()) : null,
        lastSeenLocation: isLost ? lastSeenLocation : null,
      },
      include: {
        user: true,
      },
    });

    // Send lost mode notification email (non-blocking)
    if (updatedPet.user) {
      sendLostModeEmail({
        to: updatedPet.user.email,
        name: updatedPet.user.name,
        petName: updatedPet.name,
        isLost,
      }).catch(err => console.error('Failed to send lost mode email:', err));
    }

    res.json(updatedPet);
  } catch (error) {
    console.error('Toggle lost status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.pet.delete({
      where: { id },
    });

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePrivacySettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { showBreed, showAge, showMedicalInfo, showVetInfo, showOwnerPhone, showOwnerEmail } = req.body;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        showBreed: showBreed !== undefined ? showBreed : pet.showBreed,
        showAge: showAge !== undefined ? showAge : pet.showAge,
        showMedicalInfo: showMedicalInfo !== undefined ? showMedicalInfo : pet.showMedicalInfo,
        showVetInfo: showVetInfo !== undefined ? showVetInfo : pet.showVetInfo,
        showOwnerPhone: showOwnerPhone !== undefined ? showOwnerPhone : pet.showOwnerPhone,
        showOwnerEmail: showOwnerEmail !== undefined ? showOwnerEmail : pet.showOwnerEmail,
      },
    });

    res.json(updatedPet);
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
