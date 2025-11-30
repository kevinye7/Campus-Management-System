/*==================================================
/routes/students.js

It defines all the students-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus, UserGroup, Association } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');
const { authenticateToken } = require('../middleware/auth');

/* GET ALL STUDENTS: async/await using "try-catch" */
// router.get('/', async (req, res, next) => {
//   try {
//     let students = await Student.findAll({include: [Campus]});
//     res.status(200).json(students);
//   } 
//   catch(err) {
//     next(err);
//   }
// });

/* GET ALL STUDENTS - Filtered by user's association and user group */
router.get('/', authenticateToken, ash(async(req, res) => {
  let students;
  
  // All users only see students from campuses in their association and user group
  if (!req.user.associationId) {
    return res.status(200).json([]);  // No association, no students
  }
  
  if (!req.user.userGroupId) {
    return res.status(200).json([]);  // No user group, no students
  }
  
  const userGroup = await UserGroup.findByPk(req.user.userGroupId, {
    include: [{ 
      model: Campus,
      where: { associationId: req.user.associationId }
    }]
  });
  
  if (!userGroup || !userGroup.campuses || userGroup.campuses.length === 0) {
    return res.status(200).json([]);
  }
  
  // Get campus IDs from user group
  const campusIds = userGroup.campuses.map(c => c.id);
  
  // Find all students in those campuses
  students = await Student.findAll({
    where: {
      campusId: campusIds
    },
    include: [Campus]
  });
  
  res.status(200).json(students);  // Status code 200 OK - request succeeded
}));

/* GET STUDENT BY ID - Check if user has access */
router.get('/:id', authenticateToken, ash(async(req, res) => {
  const studentId = parseInt(req.params.id);
  
  // Find student
  let student = await Student.findByPk(studentId, {include: [Campus]});
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // All users can only access students from campuses in their association and user group
  if (!student.campusId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Check if student's campus belongs to user's association
  const studentCampus = await Campus.findByPk(student.campusId);
  if (!studentCampus || studentCampus.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!req.user.userGroupId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const userGroup = await UserGroup.findByPk(req.user.userGroupId, {
    include: [{ model: Campus }]
  });
  
  const hasAccess = userGroup && userGroup.campuses.some(c => c.id === student.campusId);
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.status(200).json(student);
}));

/* ADD NEW STUDENT */
router.post('/', authenticateToken, ash(async(req, res) => {
  // Verify campus belongs to user's association if campusId provided
  if (req.body.campusId) {
    const campus = await Campus.findByPk(req.body.campusId);
    if (!campus || campus.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Cannot add student to campus outside your association' });
    }
  }
  let createdStudent = await Student.create(req.body);
  res.status(200).json(createdStudent);
}));

/* DELETE STUDENT */
router.delete('/:id', authenticateToken, ash(async(req, res) => {
  // Verify student belongs to user's association
  const student = await Student.findByPk(req.params.id, { include: [Campus] });
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  if (!student.campus || student.campus.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  await Student.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json("Deleted a student!");
}));

/* EDIT STUDENT */
router.put('/:id', authenticateToken, ash(async(req, res) => {
  // Verify student exists and belongs to user's association
  const student = await Student.findByPk(req.params.id, { include: [Campus] });
  if (!student || !student.campus) {
    return res.status(404).json({ error: 'Student not found' });
  }
  if (student.campus.associationId !== req.user.associationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // If updating campusId, verify new campus belongs to user's association
  if (req.body.campusId && req.body.campusId !== student.campusId) {
    const newCampus = await Campus.findByPk(req.body.campusId);
    if (!newCampus || newCampus.associationId !== req.user.associationId) {
      return res.status(403).json({ error: 'Cannot assign student to campus outside your association' });
    }
  }
  
  await Student.update(req.body, { where: {id: req.params.id} });
  // Find student by Primary Key
  let updatedStudent = await Student.findByPk(req.params.id, { include: [Campus] });
  res.status(201).json(updatedStudent);  // Status code 201 Created - successful creation of a resource
}));

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;