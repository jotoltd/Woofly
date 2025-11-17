import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { sendTagActivationEmail } from '../services/emailService';

const prisma = new PrismaClient();

export const validateActivationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activationCode } = req.body;

    if (!activationCode) {
      res.status(400).json({ error: 'Activation code is required' });
      return;
    }

    // Find the tag by activation code
    const tag = await prisma.tag.findUnique({
      where: { activationCode },
    });

    if (!tag) {
      res.status(404).json({ error: 'Invalid activation code. Please check and try again.' });
      return;
    }

    if (tag.isActivated) {
      res.status(400).json({ error: 'This tag has already been activated by another user.' });
      return;
    }

    // Code is valid and available
    res.status(200).json({
      valid: true,
      message: 'Activation code verified successfully',
    });
  } catch (error) {
    console.error('Validate activation code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const activateTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { activationCode } = req.body;

    if (!activationCode) {
      res.status(400).json({ error: 'Activation code is required' });
      return;
    }

    // Find the tag by activation code
    const tag = await prisma.tag.findUnique({
      where: { activationCode },
    });

    if (!tag) {
      res.status(404).json({ error: 'Invalid activation code' });
      return;
    }

    if (tag.isActivated) {
      res.status(400).json({ error: 'This tag has already been activated' });
      return;
    }

    // Activate the tag and link it to the user
    const activatedTag = await prisma.tag.update({
      where: { id: tag.id },
      data: {
        isActivated: true,
        activatedAt: new Date(),
        userId: req.userId!,
      },
      include: {
        user: true,
      },
    });

    // Send activation success email (non-blocking)
    if (activatedTag.user) {
      sendTagActivationEmail({
        to: activatedTag.user.email,
        name: activatedTag.user.name,
        tagCode: activatedTag.tagCode,
        activationCode: activatedTag.activationCode,
      }).catch(err => console.error('Failed to send tag activation email:', err));
    }

    res.status(200).json({
      message: 'Tag activated successfully',
      tag: {
        id: activatedTag.id,
        tagCode: activatedTag.tagCode,
        activatedAt: activatedTag.activatedAt,
      }
    });
  } catch (error) {
    console.error('Activate tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserTags = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.userId! },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { activatedAt: 'desc' },
    });

    res.json(tags);
  } catch (error) {
    console.error('Get user tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const linkTagToPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tagId, petId } = req.body;

    if (!tagId || !petId) {
      res.status(400).json({ error: 'Tag ID and Pet ID are required' });
      return;
    }

    // Verify the tag belongs to the user
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    if (tag.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Verify the pet belongs to the user
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Link the tag to the pet
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: { petId },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            imageUrl: true,
          },
        },
      },
    });

    res.json(updatedTag);
  } catch (error) {
    console.error('Link tag to pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unlinkTagFromPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;

    // Verify the tag belongs to the user
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    if (tag.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Unlink the tag from the pet
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: { petId: null },
    });

    res.json(updatedTag);
  } catch (error) {
    console.error('Unlink tag from pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Public endpoint to get pet information by tag code (QR/NFC scan)
export const getPetByTagCode = async (req: any, res: Response): Promise<void> => {
  try {
    const { tagCode } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { tagCode },
      include: {
        pet: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            contacts: {
              orderBy: { priority: 'desc' },
            },
          },
        },
      },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    if (!tag.isActivated) {
      res.status(400).json({ error: 'This tag has not been activated yet' });
      return;
    }

    if (!tag.pet) {
      res.status(400).json({ error: 'This tag is not linked to a pet yet' });
      return;
    }

    const pet = tag.pet;

    // Return public information based on privacy settings
    res.json({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.showBreed ? pet.breed : null,
      age: pet.showAge ? pet.age : null,
      sex: pet.sex,
      color: pet.color,
      description: pet.description,
      imageUrl: pet.imageUrl,
      ownerName: pet.user.name,
      ownerPhone: pet.showOwnerPhone ? pet.ownerPhone : null,
      ownerEmail: pet.showOwnerEmail ? pet.ownerEmail : null,
      vetName: pet.showVetInfo ? pet.vetName : null,
      vetPhone: pet.showVetInfo ? pet.vetPhone : null,
      medicalInfo: pet.showMedicalInfo ? pet.medicalInfo : null,
      isLost: pet.isLost,
      lostDate: pet.lostDate,
      lastSeenLocation: pet.lastSeenLocation,
      contacts: pet.contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
        email: contact.email,
      })),
    });
  } catch (error) {
    console.error('Get pet by tag code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
