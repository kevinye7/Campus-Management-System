/*==================================================
/routes/students.js

It defines all the students-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus, UserGroup } = require('../database/models');

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

/* GET ALL STUDENTS - Filtered by user's user group */
router.get('/', authenticateToken, ash(async(req, res) => {
  let students;
  
  // All users (including admins) only see students from campuses in their user group
  if (!req.user.userGroupId) {
    return res.status(200).json([]);  // No user group, no students
  }
  
  const userGroup = await UserGroup.findByPk(req.user.userGroupId, {
    include: [{ model: Campus }]
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
  
  // All users (including admins) can only access students from campuses in their user group
  if (!req.user.userGroupId || !student.campusId) {
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
  let createdStudent = await Student.create(req.body);
  res.status(200).json(createdStudent);
}));

/* DELETE STUDENT */
router.delete('/:id', authenticateToken, ash(async(req, res) => {
  await Student.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json("Deleted a student!");
}));

/* EDIT STUDENT */
router.put('/:id', authenticateToken, ash(async(req, res) => {
  await Student.update(req.body,
        { where: {id: req.params.id} }
  );
  // Find student by Primary Key
  let student = await Student.findByPk(req.params.id);
  res.status(201).json(student);  // Status code 201 Created - successful creation of a resource
}));

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;