// auth.js — Authentication routes
// Add to server.js via: const authRoutes = require('./auth'); app.use('/api/auth', authRoutes);

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory user store (replace with MongoDB/PostgreSQL in production)
const USERS = new Map();

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password + 'maxret_salt_2024').digest('hex');

const generateToken = () => crypto.randomBytes(32).toString('hex');

// ── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', (req, res) => {
  const { name, email, password, phone, dob } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (USERS.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = {
    id: `USR_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone || '',
    dob: dob || '',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    avatar: name.trim().slice(0, 2).toUpperCase(),
  };

  USERS.set(user.email, user);
  const token = generateToken();

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt },
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = USERS.get(email.toLowerCase().trim());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken();
  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt },
  });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const email = req.headers['x-user-email'];
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const user = USERS.get(email.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
});

module.exports = router;