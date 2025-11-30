/*==================================================
/routes/index.js

It defines all the routes used by Express application.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();

// Sub-Routers
const studentsRouter = require('./students');  // Import sub-router functions in students.js file
const campusesRouter = require('./campuses');  // Import sub-router functions in campuses.js file
const authRouter = require('./auth');  // Import authentication router
const adminRouter = require('./admin');  // Import admin router

// Set up sub-route's top-level route and attach all sub-routes to it
router.use('/auth', authRouter);  // Authentication routes: "/api/auth/login", "/api/auth/register", etc.
router.use('/admin', adminRouter);  // Admin routes: "/api/admin/users", "/api/admin/user-groups", etc.
router.use('/students', studentsRouter);  // Updated URL paths: "/students/" and "/students/:id"
router.use('/campuses', campusesRouter);  // Updated URL paths: "/campuses/" and "/campuses/:id"

// Export sub-routers, so that they can be used by the top-level (main) file app.js
module.exports = router;