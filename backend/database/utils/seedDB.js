/*==================================================
/database/utils/seedDB.js

It seeds the database with several initial students and campuses.
==================================================*/
const { Campus, Student, User, UserGroup } = require('../models');  // Import database models

// Seed database
const seedDB = async () => {
	// Create user groups
	const adminGroup = await UserGroup.create({
		name: "Administrators",
		description: "Full system access"
	});
	const nycGroup = await UserGroup.create({
		name: "NYC Campuses",
		description: "Access to NYC area campuses"
	});
	const queensGroup = await UserGroup.create({
		name: "Queens Campus",
		description: "Access to Queens College only"
	});

	// Create campuses
	const dummy_campus = await Campus.create({
		name: "Hunter College",
		address: "695 Park Ave, New York, NY 10065",
		description: "This is a school in New York, New York.",
		imageUrl: "https://s29068.pcdn.co/wp-content/uploads/hunter-campus-768x432.jpg.optimal.jpg"
	});
	const dummy_campus2 = await Campus.create({
		name: "Queens College",
		address: "65-30 Kissena Blvd, Queens, NY 11367",
		description: "This is a school in Queens, New York.",
		imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Facade_of_The_Queen%27s_College%2C_Oxford%2C_2020.jpg"
	});
	const dummy_campus3 = await Campus.create({
		name: "Brooklyn College",
		address: "2900 Bedford Ave, Brooklyn, NY 11210",
		description: "This is a school in Brooklyn, New York.",
		imageUrl: "https://www.cuny.edu/wp-content/uploads/sites/4/2015/01/09_20_2006_brc_quad_06.jpg"
	});

	// Assign campuses to user groups
	await nycGroup.addCampus(dummy_campus);  // Hunter College
	await nycGroup.addCampus(dummy_campus2);  // Queens College
	await nycGroup.addCampus(dummy_campus3);  // Brooklyn College
	await queensGroup.addCampus(dummy_campus2);  // Queens College only
	// Admin group gets all campuses
	await adminGroup.addCampus(dummy_campus);
	await adminGroup.addCampus(dummy_campus2);
	await adminGroup.addCampus(dummy_campus3);
	
	// Create users
	const adminUser = await User.create({
		username: "admin",
		email: "admin@campus.edu",
		password: "admin123",  // Will be hashed by beforeCreate hook
		firstName: "Admin",
		lastName: "User",
		isAdmin: true,
		userGroupId: adminGroup.id
	});
	const regularUser = await User.create({
		username: "user1",
		email: "user1@campus.edu",
		password: "user123",  // Will be hashed by beforeCreate hook
		firstName: "John",
		lastName: "Doe",
		isAdmin: false,
		userGroupId: nycGroup.id
	});
	const queensUser = await User.create({
		username: "queens_user",
		email: "queens@campus.edu",
		password: "queens123",  // Will be hashed by beforeCreate hook
		firstName: "Jane",
		lastName: "Smith",
		isAdmin: false,
		userGroupId: queensGroup.id
	});
	
	// Create students
	const dummy_student = await Student.create({
		firstname: "Joe",
      	lastname: "Smith",
		email: "joe.smith@myhunter.cuny.edu",
    	gpa: 3.5
	});
	const dummy_student2 = await Student.create({
		firstname: "Mary",
      	lastname: "Johnson",
		email: "mary.johnson@Qmail.cuny.edu",
    	gpa: 3.8
	});

	// Add students to campuses
	await dummy_student.setCampus(dummy_campus);
	await dummy_student2.setCampus(dummy_campus2);
}

// Export the database seeding function
module.exports = seedDB;