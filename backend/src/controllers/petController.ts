import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, species, breed, age, description, ownerPhone, ownerEmail, vetName, vetPhone, medicalInfo } = req.body;

    if (!name || !species) {
      res.status(400).json({ error: 'Name and species are required' });
      return;
    }

    // Generate unique IDs for QR and NFC
    const qrCode = uuidv4();
    const nfcId = uuidv4();

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        description,
        qrCode,
        nfcId,
        userId: req.userId!,
        ownerPhone,
        ownerEmail,
        vetName,
        vetPhone,
        medicalInfo,
      },
    });

    res.status(201).json(pet);
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

    const imageUrl = `/uploads/${req.file.filename}`;

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: { imageUrl },
    });

    res.json({ imageUrl, pet: updatedPet });
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
    });

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
