/*==================================================
/database/models/Association.js

It defines the association model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const db = require('../db');  // Import Sequelize database instance called "db"

// Define the association model
const Association = db.define("association", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.TEXT,
  }
});

// Export the association model
module.exports = Association;

