/*==================================================
/database/utils/seedDB.js

It seeds the database with several initial students and campuses.
==================================================*/
const { Campus, Student, User, UserGroup, Association } = require('../models');  // Import database models

// Seed database
const seedDB = async () => {
	// Create association
	const mainAssociation = await Association.create({
		name: "CUNY System",
		description: "City University of New York system"
	});

	// Create campuses (belong to association)
	const dummy_campus = await Campus.create({
		name: "Hunter College",
		address: "695 Park Ave, New York, NY 10065",
		description: "This is a school in New York, New York.",
		imageUrl: "https://s29068.pcdn.co/wp-content/uploads/hunter-campus-768x432.jpg.optimal.jpg",
		associationId: mainAssociation.id
	});
	const dummy_campus2 = await Campus.create({
		name: "Queens College",
		address: "65-30 Kissena Blvd, Queens, NY 11367",
		description: "This is a school in Queens, New York.",
		imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Facade_of_The_Queen%27s_College%2C_Oxford%2C_2020.jpg",
		associationId: mainAssociation.id
	});
	const dummy_campus3 = await Campus.create({
		name: "Brooklyn College",
		address: "2900 Bedford Ave, Brooklyn, NY 11210",
		description: "This is a school in Brooklyn, New York.",
		imageUrl: "https://www.cuny.edu/wp-content/uploads/sites/4/2015/01/09_20_2006_brc_quad_06.jpg",
		associationId: mainAssociation.id
	});

	// Create user groups (belong to association)
	const adminGroup = await UserGroup.create({
		name: "Administrators",
		description: "Full system access",
		associationId: mainAssociation.id
	});
	const nycGroup = await UserGroup.create({
		name: "NYC Campuses",
		description: "Access to NYC area campuses",
		associationId: mainAssociation.id
	});
	const queensGroup = await UserGroup.create({
		name: "Queens Campus",
		description: "Access to Queens College only",
		associationId: mainAssociation.id
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
	
	// Create users (belong to association and group)
	const adminUser = await User.create({
		username: "admin",
		email: "admin@campus.edu",
		password: "admin123",  // Will be hashed by beforeCreate hook
		firstName: "Admin",
		lastName: "User",
		isAssociationAdmin: true,
		isGroupAdmin: false,
		associationId: mainAssociation.id,
		userGroupId: adminGroup.id
	});
	const regularUser = await User.create({
		username: "user1",
		email: "user1@campus.edu",
		password: "user123",  // Will be hashed by beforeCreate hook
		firstName: "John",
		lastName: "Doe",
		isAssociationAdmin: false,
		isGroupAdmin: false,
		associationId: mainAssociation.id,
		userGroupId: nycGroup.id
	});
	const queensUser = await User.create({
		username: "queens_user",
		email: "queens@campus.edu",
		password: "queens123",  // Will be hashed by beforeCreate hook
		firstName: "Jane",
		lastName: "Smith",
		isAssociationAdmin: false,
		isGroupAdmin: true,
		associationId: mainAssociation.id,
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