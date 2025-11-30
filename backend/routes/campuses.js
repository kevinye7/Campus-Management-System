/*==================================================
/routes/campuses.js

It defines all the campuses-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus, UserGroup } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/* GET ALL CAMPUSES - Filtered by user's user group */
router.get('/', authenticateToken, ash(async(req, res) => {
  let campuses;
  
  // Admins can see all campuses
  if (req.user.isAdmin) {
    campuses = await Campus.findAll({include: [Student]});
  } else {
    // Regular users only see campuses assigned to their user group
    if (!req.user.userGroupId) {
      return res.status(200).json([]);  // No user group, no campuses
    }
    
    const userGroup = await UserGroup.findByPk(req.user.userGroupId, {
      include: [{ model: Campus, include: [Student] }]
    });
    
    if (!userGroup) {
      return res.status(200).json([]);
    }
    
    campuses = userGroup.campuses || [];
  }
  
  res.status(200).json(campuses);  // Status code 200 OK - request succeeded
}));

/* GET CAMPUS BY ID - Check if user has access */
router.get('/:id', authenticateToken, ash(async(req, res) => {
  const campusId = parseInt(req.params.id);
  
  // Find campus
  let campus = await Campus.findByPk(campusId, {include: [Student]});
  
  if (!campus) {
    return res.status(404).json({ error: 'Campus not found' });
  }
  
  // Admins can access any campus
  if (req.user.isAdmin) {
    return res.status(200).json(campus);
  }
  
  // Regular users can only access campuses in their user group
  if (!req.user.userGroupId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const userGroup = await UserGroup.findByPk(req.user.userGroupId, {
    include: [{ model: Campus }]
  });
  
  const hasAccess = userGroup && userGroup.campuses.some(c => c.id === campusId);
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.status(200).json(campus);
}));

/* DELETE CAMPUS - Admin only */
router.delete('/:id', authenticateToken, requireAdmin, ash(async(req, res) => {
  await Campus.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json("Deleted a campus!");
}));

/* ADD NEW CAMPUS - Admin only */
router.post('/', authenticateToken, requireAdmin, ash(async(req, res) => {
  let newCampus = await Campus.create(req.body);
  res.status(200).json(newCampus);  // Status code 200 OK - request succeeded
}));

/* EDIT CAMPUS - Admin only */
router.put('/:id', authenticateToken, requireAdmin, ash(async(req, res) => {
  await Campus.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  // Find campus by Primary Key
  let campus = await Campus.findByPk(req.params.id, {include: [Student]});  // Get the campus and its associated students
  res.status(201).json(campus);  // Status code 201 Created - successful creation of a resource
}))

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;