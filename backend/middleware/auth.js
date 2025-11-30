/*==================================================
/middleware/auth.js

JWT authentication middleware
==================================================*/
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const { UserGroup, Association } = require('../database/models');
    const user = await User.findByPk(decoded.userId, {
      include: [
        { model: UserGroup },
        { model: Association }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check if user is association admin
const requireAssociationAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAssociationAdmin) {
    return res.status(403).json({ error: 'Association admin access required' });
  }
  next();
};

// Middleware to check if user is group admin or association admin
const requireGroupAdmin = (req, res, next) => {
  if (!req.user || (!req.user.isGroupAdmin && !req.user.isAssociationAdmin)) {
    return res.status(403).json({ error: 'Group admin or association admin access required' });
  }
  next();
};

// Legacy support - keep requireAdmin for backward compatibility
const requireAdmin = requireAssociationAdmin;

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAssociationAdmin,
  requireGroupAdmin,
  generateToken,
  JWT_SECRET
};

