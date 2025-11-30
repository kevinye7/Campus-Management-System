/*==================================================
/database/models/User.js

It defines the user model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const db = require('../db');  // Import Sequelize database instance called "db"
const bcrypt = require('bcryptjs');

// Define the user model
const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating user (if password changed)
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Export the user model
module.exports = User;

