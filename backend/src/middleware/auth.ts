import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

// Extend Request type to include the authenticated user
export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'Access denied: No token provided' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'replace-with-a-secure-random-secret-key';
    const decoded = jwt.verify(token, secret) as UserPayload;
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Access denied: Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: Admin privileges required' });
      return;
    }
    next();
  });
};
