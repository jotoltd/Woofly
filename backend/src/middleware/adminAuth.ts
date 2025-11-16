import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminRequest extends Request {
  adminId?: string;
}

export const adminAuth = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Admin access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string; isAdmin: boolean };

    if (!decoded.isAdmin) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired admin token' });
  }
};
