/*==================================================
/database/models/UserGroup.js

It defines the user group model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const db = require('../db');  // Import Sequelize database instance called "db"

// Define the user group model
const UserGroup = db.define("userGroup", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.TEXT,
  }
});

// Export the user group model
module.exports = UserGroup;

