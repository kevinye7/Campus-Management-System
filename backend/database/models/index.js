/*==================================================
/database/models/index.js

It registers models, sets up associations between tables, and generates barrel file for exporting the models.
==================================================*/
const Student  = require('./Student');  // Import Student model
const Campus  = require('./Campus');  // Import Campus model
const User  = require('./User');  // Import User model
const UserGroup  = require('./UserGroup');  // Import UserGroup model

// Student-Campus associations
Student.belongsTo(Campus);  // Student belongs to only one Campus 
Campus.hasMany(Student);  // Campus can have many Student

// User-UserGroup associations
User.belongsTo(UserGroup);  // User belongs to one UserGroup
UserGroup.hasMany(User);  // UserGroup can have many Users

// UserGroup-Campus associations (many-to-many)
UserGroup.belongsToMany(Campus, { through: 'UserGroupCampus' });  // UserGroup belongs to many Campuses
Campus.belongsToMany(UserGroup, { through: 'UserGroupCampus' });  // Campus belongs to many UserGroups

// Export models and associations
module.exports = {
  Student,
  Campus,
  User,
  UserGroup
};