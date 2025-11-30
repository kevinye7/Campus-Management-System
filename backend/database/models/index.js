/*==================================================
/database/models/index.js

It registers models, sets up associations between tables, and generates barrel file for exporting the models.
==================================================*/
const Student  = require('./Student');  // Import Student model
const Campus  = require('./Campus');  // Import Campus model
const User  = require('./User');  // Import User model
const UserGroup  = require('./UserGroup');  // Import UserGroup model
const Association  = require('./Association');  // Import Association model

// Student-Campus associations
Student.belongsTo(Campus);  // Student belongs to only one Campus 
Campus.hasMany(Student);  // Campus can have many Student

// Association associations
Association.hasMany(Campus);  // Association has many Campuses
Campus.belongsTo(Association);  // Campus belongs to one Association

Association.hasMany(UserGroup);  // Association has many UserGroups
UserGroup.belongsTo(Association);  // UserGroup belongs to one Association

Association.hasMany(User);  // Association has many Users
User.belongsTo(Association);  // User belongs to one Association

// User-UserGroup associations
User.belongsTo(UserGroup);  // User belongs to one UserGroup
UserGroup.hasMany(User);  // UserGroup can have many Users

// UserGroup nested structure (groups can have parent groups)
UserGroup.belongsTo(UserGroup, { as: 'parentGroup', foreignKey: 'parentGroupId' });  // UserGroup can have a parent group
UserGroup.hasMany(UserGroup, { as: 'childGroups', foreignKey: 'parentGroupId' });  // UserGroup can have many child groups

// UserGroup-Campus associations (many-to-many)
UserGroup.belongsToMany(Campus, { through: 'UserGroupCampus' });  // UserGroup belongs to many Campuses
Campus.belongsToMany(UserGroup, { through: 'UserGroupCampus' });  // Campus belongs to many UserGroups

// Export models and associations
module.exports = {
  Student,
  Campus,
  User,
  UserGroup,
  Association
};