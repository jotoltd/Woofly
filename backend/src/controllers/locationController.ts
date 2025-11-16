import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Record a location scan when someone finds a pet
export const recordLocationScan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;
    const { latitude, longitude, accuracy } = req.body;

    // Get pet with owner email
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        user: { select: { email: true, name: true } },
        contacts: {
          where: { email: { not: null } },
          select: { email: true, name: true, relation: true },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Get user agent and IP address
    const userAgent = req.get('user-agent') || undefined;
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;

    // Create location scan record
    const locationScan = await prisma.locationScan.create({
      data: {
        petId,
        latitude,
        longitude,
        accuracy,
        userAgent,
        ipAddress,
        emailSent: false, // Will be updated by email service
      },
    });

    // TODO: Send email notification (will implement email service)
    // For now, we'll just log the scan
    console.log('Location scan recorded:', {
      pet: pet.name,
      owner: pet.user.name,
      email: pet.user.email,
      location: { latitude, longitude },
      scanId: locationScan.id,
    });

    res.status(201).json({
      message: 'Location recorded successfully',
      scanId: locationScan.id,
    });
  } catch (error) {
    console.error('Record location scan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get location scans for a pet (owner only)
export const getLocationScans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;
    const userId = (req as any).userId;

    // Verify pet ownership
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { userId: true },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const scans = await prisma.locationScan.findMany({
      where: { petId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 scans
    });

    res.json(scans);
  } catch (error) {
    console.error('Get location scans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
