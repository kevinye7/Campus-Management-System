/*==================================================
/routes/admin.js

It defines all the admin-related routes for user management.
==================================================*/
const express = require('express');
const router = express.Router();
const { User, UserGroup, Campus, Association } = require('../database/models');
const ash = require('express-async-handler');
const { authenticateToken, requireAssociationAdmin, requireGroupAdmin } = require('../middleware/auth');

/* GET ALL USERS - Association admin only (filtered by association) */
router.get('/users', authenticateToken, requireAssociationAdmin, ash(async (req, res) => {
  const users = await User.findAll({
    where: { associationId: req.user.associationId },
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });
  res.json(users);
}));

/* GET ALL CAMPUSES - Association admin only (filtered by association) */
router.get('/campuses', authenticateToken, requireAssociationAdmin, ash(async (req, res) => {
  const { Student } = require('../database/models');
  const campuses = await Campus.findAll({
    where: { associationId: req.user.associationId },
    include: [{ model: Student }]
  });
  res.json(campuses);
}));

/* GET ALL USER GROUPS - Association admin or group admin (filtered by association) */
router.get('/user-groups', authenticateToken, ash(async (req, res) => {
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }
  const userGroups = await UserGroup.findAll({
    where: { associationId: req.user.associationId },
    include: [{ model: Campus }]
  });
  res.json(userGroups);
}));

/* CREATE USER GROUP - Association admin or group admin */
router.post('/user-groups', authenticateToken, ash(async (req, res) => {
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }
  
  const { name, description, campusIds, parentGroupId } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  // Verify parent group belongs to same association if provided
  if (parentGroupId) {
    const parentGroup = await UserGroup.findByPk(parentGroupId);
    if (!parentGroup || parentGroup.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Parent group must belong to your association' });
    }
  }
  
  const userGroup = await UserGroup.create({
    name,
    description: description || null,
    associationId: req.user.associationId,
    parentGroupId: parentGroupId || null
  });
  
  // Assign campuses if provided (verify they belong to association)
  if (campusIds && Array.isArray(campusIds) && campusIds.length > 0) {
    const campuses = await Campus.findAll({
      where: { 
        id: campusIds,
        associationId: req.user.associationId
      }
    });
    await userGroup.setCampuses(campuses.map(c => c.id));
  }
  
  const userGroupWithCampuses = await UserGroup.findByPk(userGroup.id, {
    include: [{ model: Campus }]
  });
  
  res.status(201).json(userGroupWithCampuses);
}));

/* UPDATE USER GROUP - Association admin or group admin */
router.put('/user-groups/:id', authenticateToken, ash(async (req, res) => {
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }
  
  const { name, description, campusIds, parentGroupId } = req.body;
  const userGroup = await UserGroup.findByPk(req.params.id);
  
  if (!userGroup) {
    return res.status(404).json({ error: 'User group not found' });
  }
  
  // Verify user group belongs to user's association
  if (userGroup.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (name) userGroup.name = name;
  if (description !== undefined) userGroup.description = description;
  
  // Update parent group if provided
  if (parentGroupId !== undefined) {
    if (parentGroupId) {
      const parentGroup = await UserGroup.findByPk(parentGroupId);
      if (!parentGroup || parentGroup.associationId !== req.user.associationId) {
        return res.status(403).json({ error: 'Parent group must belong to your association' });
      }
    }
    userGroup.parentGroupId = parentGroupId;
  }
  
  await userGroup.save();
  
  // Update campus assignments if provided (verify they belong to association)
  if (campusIds && Array.isArray(campusIds)) {
    const campuses = await Campus.findAll({
      where: { 
        id: campusIds,
        associationId: req.user.associationId
      }
    });
    await userGroup.setCampuses(campuses.map(c => c.id));
  }
  
  const userGroupWithCampuses = await UserGroup.findByPk(userGroup.id, {
    include: [{ model: Campus }]
  });
  
  res.json(userGroupWithCampuses);
}));

/* DELETE USER GROUP - Association admin or group admin */
router.delete('/user-groups/:id', authenticateToken, ash(async (req, res) => {
  if (!req.user.isAssociationAdmin && !req.user.isGroupAdmin) {
    return res.status(403).json({ error: 'Association admin or group admin access required' });
  }
  
  const userGroup = await UserGroup.findByPk(req.params.id);
  
  if (!userGroup) {
    return res.status(404).json({ error: 'User group not found' });
  }
  
  // Verify user group belongs to user's association
  if (userGroup.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  await userGroup.destroy();
  res.json({ message: 'User group deleted successfully' });
}));

/* UPDATE USER - Association admin only */
router.put('/users/:id', authenticateToken, requireAssociationAdmin, ash(async (req, res) => {
  const { username, email, firstName, lastName, userGroupId, isAssociationAdmin, isGroupAdmin } = req.body;
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Verify user belongs to same association
  if (user.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (username) user.username = username;
  if (email) user.email = email;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  
  // Update user group if provided
  if (userGroupId !== undefined) {
    if (userGroupId) {
      const group = await UserGroup.findByPk(userGroupId);
      if (!group || group.associationId !== req.user.associationId) {
        return res.status(403).json({ error: 'User group must belong to your association' });
      }
    }
    user.userGroupId = userGroupId;
  }
  
  // Only association admins can set association admin flag
  if (isAssociationAdmin !== undefined) {
    user.isAssociationAdmin = isAssociationAdmin;
  }
  if (isGroupAdmin !== undefined) {
    user.isGroupAdmin = isGroupAdmin;
  }
  
  await user.save();
  
  const userWithGroup = await User.findByPk(user.id, {
    include: [{ model: UserGroup }, { model: Association }],
    attributes: { exclude: ['password'] }
  });
  
  res.json(userWithGroup);
}));

/* DELETE USER - Association admin only */
router.delete('/users/:id', authenticateToken, requireAssociationAdmin, ash(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Verify user belongs to same association
  if (user.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Prevent deleting yourself
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  await user.destroy();
  res.json({ message: 'User deleted successfully' });
}));

module.exports = router;

