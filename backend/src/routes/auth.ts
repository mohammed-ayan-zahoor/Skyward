import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-random-secret-key';

// POST /api/auth/login
// Public route to authenticate admin users
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const formattedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: formattedEmail });

    // Fallback: If DB hasn't been seeded yet, auto-create default admin user on first login attempt
    if (!user && formattedEmail === 'admin@skywardcanopies.com') {
      const passwordHash = await bcrypt.hash('Sky@563119', 10);
      user = await User.create({
        email: 'admin@skywardcanopies.com',
        passwordHash,
        role: 'admin',
      });
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const userId = user._id.toString();

    // Create JWT
    const token = jwt.sign(
      { userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript XSS access
      secure: isSecure, // Only set Secure flag when request is actually HTTPS
      sameSite: 'lax', // standard CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: 'Login successful',
      user: {
        id: userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/logout
// Public route to clear the auth session cookie
router.post('/logout', (req: Request, res: Response) => {
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
// Protected route to check the current session state
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
