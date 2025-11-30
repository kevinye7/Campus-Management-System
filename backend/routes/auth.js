/*==================================================
/routes/auth.js

It defines all the authentication-related routes.
==================================================*/
const express = require('express');
const router = express.Router();
const { User, UserGroup } = require('../database/models');
const { Op } = require('sequelize');
const ash = require('express-async-handler');
const { authenticateToken, requireAdmin, generateToken } = require('../middleware/auth');

/* POST /api/auth/register - Register a new user (admin only) */
router.post('/register', authenticateToken, requireAdmin, ash(async (req, res) => {
  const { username, email, password, firstName, lastName, userGroupId, isAdmin } = req.body;

  // Validate required fields
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }]
    }
  });

  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }

  // Validate userGroupId if provided
  if (userGroupId) {
    const userGroup = await UserGroup.findByPk(userGroupId);
    if (!userGroup) {
      return res.status(400).json({ error: 'Invalid user group ID' });
    }
  }

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    userGroupId: userGroupId || null,
    isAdmin: isAdmin || false
  });

  // Get user with user group
  const userWithGroup = await User.findByPk(newUser.id, {
    include: [{ model: UserGroup }],
    attributes: { exclude: ['password'] }
  });

  res.status(201).json({
    message: 'User created successfully',
    user: userWithGroup
  });
}));

/* POST /api/auth/login - Login user */
router.post('/login', ash(async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Find user by username or email
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email: username }]
    },
    include: [{ model: UserGroup }]
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isValidPassword = await user.checkPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken(user.id);

  // Return user data (without password) and token
  const userData = user.toJSON();
  delete userData.password;

  res.json({
    message: 'Login successful',
    token,
    user: userData
  });
}));

/* GET /api/auth/me - Get current user */
router.get('/me', authenticateToken, ash(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{ model: UserGroup }],
    attributes: { exclude: ['password'] }
  });

  res.json({ user });
}));

module.exports = router;

