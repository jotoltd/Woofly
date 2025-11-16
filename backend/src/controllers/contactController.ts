import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
}

// Get all contacts for a pet
export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;

    // Verify pet ownership
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { userId: true },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const contacts = await prisma.contact.findMany({
      where: { petId },
      orderBy: { priority: 'asc' },
    });

    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new contact for a pet
export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;
    const { name, relation, phone, email, address, facebook, instagram, priority } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Verify pet ownership
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { userId: true },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    if (pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const contact = await prisma.contact.create({
      data: {
        petId,
        name,
        relation,
        phone,
        email,
        address,
        facebook,
        instagram,
        priority: priority || 0,
      },
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a contact
export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contactId } = req.params;
    const { name, relation, phone, email, address, facebook, instagram, priority } = req.body;

    // Verify contact ownership through pet
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { pet: { select: { userId: true } } },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    if (contact.pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name,
        relation,
        phone,
        email,
        address,
        facebook,
        instagram,
        priority,
      },
    });

    res.json(updatedContact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a contact
export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contactId } = req.params;

    // Verify contact ownership through pet
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { pet: { select: { userId: true } } },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    if (contact.pet.userId !== req.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contacts for public pet profile
export const getPublicContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { petId } = req.params;

    const contacts = await prisma.contact.findMany({
      where: { petId },
      orderBy: { priority: 'asc' },
      select: {
        id: true,
        name: true,
        relation: true,
        phone: true,
        email: true,
        address: true,
        facebook: true,
        instagram: true,
      },
    });

    res.json(contacts);
  } catch (error) {
    console.error('Get public contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
