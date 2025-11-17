import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminRequest } from '../middleware/adminAuth';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate random activation code (8 characters alphanumeric)
function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate random NFC ID (hex string)
function generateNFCId(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

export const generateTags = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { quantity, batchNumber } = req.body;

    if (!quantity || quantity < 1 || quantity > 1000) {
      res.status(400).json({ error: 'Quantity must be between 1 and 1000' });
      return;
    }

    const tags = [];
    const createdTags = [];

    // Generate tags
    for (let i = 0; i < quantity; i++) {
      let activationCode = generateActivationCode();

      // Ensure unique activation code
      let exists = await prisma.tag.findUnique({
        where: { activationCode },
      });

      while (exists) {
        activationCode = generateActivationCode();
        exists = await prisma.tag.findUnique({
          where: { activationCode },
        });
      }

      tags.push({
        activationCode,
        batchNumber: batchNumber || `BATCH-${Date.now()}`,
        isActivated: false,
      });
    }

    // Batch create all tags
    for (const tagData of tags) {
      const tag = await prisma.tag.create({
        data: tagData,
      });
      createdTags.push({
        id: tag.id,
        tagCode: tag.tagCode,
        activationCode: tag.activationCode,
        batchNumber: tag.batchNumber,
      });
    }

    res.status(201).json({
      message: `Successfully generated ${quantity} tags`,
      quantity: createdTags.length,
      batchNumber: tags[0].batchNumber,
      tags: createdTags,
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTags = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { batch, activated, page = 1, limit = 50 } = req.query;

    const where: any = {};

    if (batch) {
      where.batchNumber = batch;
    }

    if (activated !== undefined) {
      where.isActivated = activated === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          pet: {
            select: {
              name: true,
              species: true,
            },
          },
        },
      }),
      prisma.tag.count({ where }),
    ]);

    res.json({
      tags,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTagStats = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const [total, activated, linked, batches] = await Promise.all([
      prisma.tag.count(),
      prisma.tag.count({ where: { isActivated: true } }),
      prisma.tag.count({ where: { petId: { not: null } } }),
      prisma.tag.groupBy({
        by: ['batchNumber'],
        _count: true,
      }),
    ]);

    res.json({
      total,
      activated,
      linked,
      available: total - activated,
      batches: batches.map(b => ({
        batchNumber: b.batchNumber,
        count: b._count,
      })),
    });
  } catch (error) {
    console.error('Get tag stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgrammingData = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    // Return data needed for NFC programming
    res.json({
      tagCode: tag.tagCode,
      activationCode: tag.activationCode,
      batchNumber: tag.batchNumber,
      qrData: `https://wooftrace.com/pet/qr/${tag.tagCode}`,
      nfcData: {
        url: `https://wooftrace.com/pet/nfc/${tag.tagCode}`,
        tagCode: tag.tagCode,
      },
    });
  } catch (error) {
    console.error('Get programming data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsersWithAssets = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        pets: {
          select: {
            id: true,
            name: true,
            species: true,
            tag: {
              select: {
                tagCode: true,
                activationCode: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
            tagCode: true,
            activationCode: true,
            isActivated: true,
            pet: {
              select: {
                id: true,
                name: true,
                species: true,
              },
            },
          },
        },
      },
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users with assets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminUnlinkTagFromPet = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { id: true, petId: true },
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    if (!tag.petId) {
      res.status(400).json({ error: 'Tag is not linked to a pet' });
      return;
    }

    await prisma.tag.update({
      where: { id: tagId },
      data: { petId: null },
    });

    res.json({
      message: 'Tag unlinked from pet',
      tagId: tag.id,
      previousPetId: tag.petId,
    });
  } catch (error) {
    console.error('Admin unlink tag from pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== USER MANAGEMENT ====================

export const adminUpdateUser = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({ message: 'User updated', user: { id: updated.id, name: updated.name, email: updated.email } });
  } catch (error: any) {
    console.error('Admin update user error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const adminDeleteUser = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pets: true,
        tags: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Safety check: only allow deletion if user has no pets or tags
    if (user.pets.length > 0 || user.tags.length > 0) {
      res.status(400).json({
        error: `Cannot delete user: still has ${user.pets.length} pet(s) and ${user.tags.length} tag(s). Remove these first.`,
      });
      return;
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== PET MANAGEMENT ====================

export const adminGetAllPets = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        tag: {
          select: { id: true, tagCode: true, activationCode: true },
        },
      },
    });

    res.json({ pets });
  } catch (error) {
    console.error('Admin get all pets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminUpdatePet = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;
    const { name, species, breed, age, sex, color, description } = req.body;

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (species !== undefined) updateData.species = species;
    if (breed !== undefined) updateData.breed = breed;
    if (age !== undefined) updateData.age = age;
    if (sex !== undefined) updateData.sex = sex;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.pet.update({
      where: { id: petId },
      data: updateData,
    });

    res.json({ message: 'Pet updated', pet: updated });
  } catch (error) {
    console.error('Admin update pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminTransferPet = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;
    const { newOwnerId } = req.body;

    if (!newOwnerId) {
      res.status(400).json({ error: 'newOwnerId is required' });
      return;
    }

    const [pet, newOwner] = await Promise.all([
      prisma.pet.findUnique({ where: { id: petId }, include: { tag: true } }),
      prisma.user.findUnique({ where: { id: newOwnerId } }),
    ]);

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    if (!newOwner) {
      res.status(404).json({ error: 'New owner not found' });
      return;
    }

    // Update pet owner
    await prisma.pet.update({
      where: { id: petId },
      data: { userId: newOwnerId },
    });

    // If pet has a linked tag, transfer tag ownership too
    if (pet.tag) {
      await prisma.tag.update({
        where: { id: pet.tag.id },
        data: { userId: newOwnerId },
      });
    }

    res.json({ message: 'Pet and associated tag transferred to new owner' });
  } catch (error) {
    console.error('Admin transfer pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminDeletePet = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { tag: true },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Unlink tag if present
    if (pet.tag) {
      await prisma.tag.update({
        where: { id: pet.tag.id },
        data: { petId: null },
      });
    }

    // Delete pet (cascades to contacts and location scans)
    await prisma.pet.delete({ where: { id: petId } });

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Admin delete pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== TAG MANAGEMENT ====================

export const adminUpdateTag = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const { userId, batchNumber } = req.body;

    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    const updateData: any = {};
    if (userId !== undefined) {
      if (userId === null) {
        updateData.userId = null;
      } else {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        updateData.userId = userId;
      }
    }
    if (batchNumber !== undefined) updateData.batchNumber = batchNumber;

    const updated = await prisma.tag.update({
      where: { id: tagId },
      data: updateData,
    });

    res.json({ message: 'Tag updated', tag: updated });
  } catch (error) {
    console.error('Admin update tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminDeleteTag = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;

    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    // Safety: only allow deletion of unused tags
    if (tag.isActivated || tag.petId) {
      res.status(400).json({
        error: 'Cannot delete activated or linked tag. Unlink from pet and deactivate first.',
      });
      return;
    }

    await prisma.tag.delete({ where: { id: tagId } });
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Admin delete tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
