/*==================================================
/routes/associations.js

It defines all the association-related routes.
==================================================*/
const express = require('express');
const router = express.Router();
const { Association, User, UserGroup, Campus } = require('../database/models');
const ash = require('express-async-handler');
const { authenticateToken, requireAssociationAdmin } = require('../middleware/auth');

/* GET ALL ASSOCIATIONS - Public (for assignment purposes) */
router.get('/', ash(async (req, res) => {
  const associations = await Association.findAll({
    include: [
      { model: User, attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'isAssociationAdmin'] },
      { model: UserGroup },
      { model: Campus }
    ]
  });
  res.json(associations);
}));

/* GET ASSOCIATION BY ID */
router.get('/:id', ash(async (req, res) => {
  const association = await Association.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'isAssociationAdmin'] },
      { model: UserGroup },
      { model: Campus }
    ]
  });
  
  if (!association) {
    return res.status(404).json({ error: 'Association not found' });
  }
  
  res.json(association);
}));

/* GET CURRENT USER'S ASSOCIATION */
router.get('/me/association', authenticateToken, ash(async (req, res) => {
  if (!req.user.associationId) {
    return res.status(404).json({ error: 'User not associated with any association' });
  }
  
  const association = await Association.findByPk(req.user.associationId, {
    include: [
      { model: User, attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'isAssociationAdmin', 'isGroupAdmin'] },
      { model: UserGroup, include: [{ model: Campus }] },
      { model: Campus }
    ]
  });
  
  res.json(association);
}));

module.exports = router;

