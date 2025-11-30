/*==================================================
/routes/admin.js

It defines all the admin-related routes for user management.
==================================================*/
const express = require('express');
const router = express.Router();
const { User, UserGroup, Campus } = require('../database/models');
const ash = require('express-async-handler');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/* GET ALL USERS - Admin only */
router.get('/users', authenticateToken, requireAdmin, ash(async (req, res) => {
  const users = await User.findAll({
    include: [{ model: UserGroup }],
    attributes: { exclude: ['password'] }
  });
  res.json(users);
}));

/* GET ALL USER GROUPS - Admin only */
router.get('/user-groups', authenticateToken, requireAdmin, ash(async (req, res) => {
  const userGroups = await UserGroup.findAll({
    include: [{ model: Campus }]
  });
  res.json(userGroups);
}));

/* CREATE USER GROUP - Admin only */
router.post('/user-groups', authenticateToken, requireAdmin, ash(async (req, res) => {
  const { name, description, campusIds } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const userGroup = await UserGroup.create({
    name,
    description: description || null
  });
  
  // Assign campuses if provided
  if (campusIds && Array.isArray(campusIds) && campusIds.length > 0) {
    await userGroup.setCampuses(campusIds);
  }
  
  const userGroupWithCampuses = await UserGroup.findByPk(userGroup.id, {
    include: [{ model: Campus }]
  });
  
  res.status(201).json(userGroupWithCampuses);
}));

/* UPDATE USER GROUP - Admin only */
router.put('/user-groups/:id', authenticateToken, requireAdmin, ash(async (req, res) => {
  const { name, description, campusIds } = req.body;
  const userGroup = await UserGroup.findByPk(req.params.id);
  
  if (!userGroup) {
    return res.status(404).json({ error: 'User group not found' });
  }
  
  if (name) userGroup.name = name;
  if (description !== undefined) userGroup.description = description;
  await userGroup.save();
  
  // Update campus assignments if provided
  if (campusIds && Array.isArray(campusIds)) {
    await userGroup.setCampuses(campusIds);
  }
  
  const userGroupWithCampuses = await UserGroup.findByPk(userGroup.id, {
    include: [{ model: Campus }]
  });
  
  res.json(userGroupWithCampuses);
}));

/* DELETE USER GROUP - Admin only */
router.delete('/user-groups/:id', authenticateToken, requireAdmin, ash(async (req, res) => {
  const userGroup = await UserGroup.findByPk(req.params.id);
  
  if (!userGroup) {
    return res.status(404).json({ error: 'User group not found' });
  }
  
  await userGroup.destroy();
  res.json({ message: 'User group deleted successfully' });
}));

/* UPDATE USER - Admin only */
router.put('/users/:id', authenticateToken, requireAdmin, ash(async (req, res) => {
  const { username, email, firstName, lastName, userGroupId, isAdmin } = req.body;
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (username) user.username = username;
  if (email) user.email = email;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (userGroupId !== undefined) user.userGroupId = userGroupId;
  if (isAdmin !== undefined) user.isAdmin = isAdmin;
  
  await user.save();
  
  const userWithGroup = await User.findByPk(user.id, {
    include: [{ model: UserGroup }],
    attributes: { exclude: ['password'] }
  });
  
  res.json(userWithGroup);
}));

/* DELETE USER - Admin only */
router.delete('/users/:id', authenticateToken, requireAdmin, ash(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Prevent deleting yourself
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  await user.destroy();
  res.json({ message: 'User deleted successfully' });
}));

module.exports = router;

