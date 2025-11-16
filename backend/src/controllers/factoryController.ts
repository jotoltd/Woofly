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
