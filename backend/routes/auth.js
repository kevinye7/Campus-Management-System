/*==================================================
/routes/auth.js

It defines all the authentication-related routes.
==================================================*/
const express = require('express');
const router = express.Router();
const { User, UserGroup, Association } = require('../database/models');
const { Op } = require('sequelize');
const ash = require('express-async-handler');
const { authenticateToken, requireAssociationAdmin, generateToken } = require('../middleware/auth');

/* POST /api/auth/register-association - Public registration for new association */
router.post('/register-association', ash(async (req, res) => {
  const { associationName, associationDescription, username, email, password, firstName, lastName } = req.body;

  // Validate required fields
  if (!associationName || !username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  // Check if association name already exists
  const existingAssociation = await Association.findOne({
    where: { name: associationName }
  });

  if (existingAssociation) {
    return res.status(400).json({ error: 'Association name already exists' });
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

  // Create association
  const association = await Association.create({
    name: associationName,
    description: associationDescription || null
  });

  // Create user as association admin
  const newUser = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    isAssociationAdmin: true,
    isGroupAdmin: false,
    associationId: association.id
  });

  // Get user with associations
  const userWithData = await User.findByPk(newUser.id, {
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });

  // Generate token
  const token = generateToken(newUser.id);

  res.status(201).json({
    message: 'Association and admin user created successfully',
    token,
    user: userWithData
  });
}));

/* POST /api/auth/register - Register a new user (association admin or group admin only) */
router.post('/register', authenticateToken, ash(async (req, res) => {
  // Check if user is association admin or group admin
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }
  const { username, email, password, firstName, lastName, userGroupId, isAssociationAdmin, isGroupAdmin } = req.body;

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
    // Ensure user group belongs to same association
    if (userGroup.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Cannot assign user to group from different association' });
    }
  }

  // Create new user in same association
  const newUser = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    associationId: req.user.associationId,
    userGroupId: userGroupId || null,
    // Only association admins can create association admins
    isAssociationAdmin: req.user.isAssociationAdmin ? (isAssociationAdmin || false) : false,
    isGroupAdmin: isGroupAdmin || false
  });

  // Get user with user group and association
  const userWithGroup = await User.findByPk(newUser.id, {
    include: [{ model: UserGroup }, { model: Association }],
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
    include: [{ model: UserGroup }, { model: Association }]
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
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });

  res.json({ user });
}));

/* POST /api/auth/assign-user-to-group - Assign user to group by username/email */
router.post('/assign-user-to-group', authenticateToken, ash(async (req, res) => {
  const { usernameOrEmail, groupId } = req.body;

  if (!usernameOrEmail || !groupId) {
    return res.status(400).json({ error: 'Username/email and group ID are required' });
  }

  // Check if user is association admin or group admin
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }

  // Find user by username or email
  const targetUser = await User.findOne({
    where: {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  });

  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Find group
  const group = await UserGroup.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Association admins can assign to any group in their association
  // Group admins can only assign to groups in their association
  if (req.user.isAssociationAdmin) {
    if (group.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Cannot assign to group from different association' });
    }
  } else if (req.user.isGroupAdmin) {
    if (group.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Cannot assign to group from different association' });
    }
  }

  // Update user's group
  targetUser.userGroupId = groupId;
  await targetUser.save();

  const updatedUser = await User.findByPk(targetUser.id, {
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });

  res.json({ message: 'User assigned to group successfully', user: updatedUser });
}));

/* POST /api/auth/assign-association - Assign user to association by username/email */
router.post('/assign-association', authenticateToken, ash(async (req, res) => {
  const { usernameOrEmail, associationId } = req.body;

  if (!usernameOrEmail || !associationId) {
    return res.status(400).json({ error: 'Username/email and association ID are required' });
  }

  // Only association admins can assign users to associations
  if (!req.user.isAssociationAdmin) {
    return res.status(403).json({ error: 'Association admin access required' });
  }

  // Find user by username or email
  const targetUser = await User.findOne({
    where: {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  });

  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Find association
  const association = await Association.findByPk(associationId);
  if (!association) {
    return res.status(404).json({ error: 'Association not found' });
  }

  // Update user's association
  targetUser.associationId = associationId;
  // Remove group assignment when changing association
  targetUser.userGroupId = null;
  await targetUser.save();

  const updatedUser = await User.findByPk(targetUser.id, {
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });

  res.json({ message: 'User assigned to association successfully', user: updatedUser });
}));

module.exports = router;

