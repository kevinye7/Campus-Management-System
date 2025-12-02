/*==================================================
/database/utils/configDB.js

It declares and exports the variables for database name, username, and password.
Supports environment variables for Docker/containerized deployments.
==================================================*/
// Declare the variables for database name, username, and password.
// Use environment variables if available (for Docker), otherwise use defaults
const dbName = process.env.DB_NAME || 'starter-server';
const dbUser = process.env.DB_USER || 'postgres';
const dbPwd = process.env.DB_PASSWORD || 'postgres';  // Note: If needed, change this password to match the password created for PostgreSQL database on the local machine.
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Export the variables 
module.exports = {
  dbName,
  dbUser,
  dbPwd,
  dbHost,
  dbPort
};
