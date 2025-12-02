# Pull Request: Association-Based Authentication and Authorization System

## Overview
This PR implements a comprehensive authentication and authorization system with an association-based hierarchy, allowing multiple organizations to manage their campuses and students independently.

## Key Features

### 1. Association-Based Hierarchy
- **Associations** are the top-level entity controlling groups, users, and campuses
- Each association operates in complete isolation
- Associations can have multiple user groups with different permissions
- User groups can be nested (parent-child relationships)

### 2. User Roles and Permissions
- **Association Admin**: Full control over their association (users, groups, campuses)
- **Group Admin**: Can create groups with different permissions and campus access
- **Regular Users**: Only see campuses and students from their assigned group

### 3. Public Association Registration
- Anyone can create a new association via `/register`
- Creator automatically becomes the association admin
- Includes association name, description, and admin account creation

### 4. User Management
- Admins can create users with default passwords (automatically emailed)
- Admins can reset user passwords (new password emailed)
- Users can be assigned to groups and associations by username/email
- Full CRUD operations for users within an association

### 5. Admin Management Screen
- Comprehensive admin interface at `/admin` (association/group admins only)
- Manage users, user groups, and campus assignments
- Assignment dialogs for assigning users to groups/associations
- Password reset functionality with email notifications

### 6. Email Functionality
- Welcome emails sent when users are created with default passwords
- Password reset emails sent when admins reset passwords
- Configurable SMTP settings via environment variables
- Email templates with security warnings

## Technical Changes

### Backend

#### New Models
- `Association` model - Top-level organization entity
- Updated `User` model:
  - Replaced `isAdmin` with `isAssociationAdmin` and `isGroupAdmin`
  - Added `associationId` foreign key
- Updated `UserGroup` model:
  - Added `associationId` foreign key
  - Added `parentGroupId` for nested groups
- Updated `Campus` model:
  - Added `associationId` foreign key

#### New Routes
- `POST /api/auth/register-association` - Public association registration
- `POST /api/auth/assign-user-to-group` - Assign user to group
- `POST /api/auth/assign-association` - Assign user to association
- `POST /api/auth/reset-password` - Reset user password (admin only)
- `GET /api/associations` - Get all associations
- `GET /api/associations/me/association` - Get current user's association

#### Updated Routes
- All `/api/campuses` routes now filter by association
- All `/api/students` routes now filter by association
- `/api/admin/*` routes restricted to association admins
- All routes enforce association-based access control

#### New Utilities
- `backend/utils/email.js` - Email service with nodemailer
  - Welcome email generation
  - Password reset email generation
  - Default password generation

#### Middleware Updates
- `requireAssociationAdmin` - Check for association admin privileges
- `requireGroupAdmin` - Check for group admin or association admin
- Updated `authenticateToken` to include association data

### Frontend

#### New Components
- `RegisterAssociationView` - Public association registration form
- `RegisterAssociationContainer` - Container for association registration
- `AdminRoute` - Route protection for admin-only pages
- `AdminManagementView` - Comprehensive admin management interface
- `AdminManagementContainer` - Container for admin management

#### Updated Components
- `LoginView` - Added signup link to registration page
- `Header` - Shows association name and admin role
- `ProtectedRoute` - Updated for new authentication system

#### New Thunks
- `registerAssociationThunk` - Register new association
- `assignUserToGroupThunk` - Assign user to group
- `assignUserToAssociationThunk` - Assign user to association
- `resetPasswordThunk` - Reset user password
- `fetchAllAssociationsThunk` - Fetch all associations

#### Redux Updates
- Updated auth reducer to handle new user structure
- Added association data to user state

## Database Schema Changes

### New Tables
- `associations` - Stores association information

### Updated Tables
- `users` - Added `associationId`, `isAssociationAdmin`, `isGroupAdmin` (removed `isAdmin`)
- `userGroups` - Added `associationId`, `parentGroupId`
- `campuses` - Added `associationId`

### New Associations
- Association hasMany User
- Association hasMany UserGroup
- Association hasMany Campus
- UserGroup belongsTo Association
- UserGroup can have parent UserGroup (nested groups)
- Campus belongsTo Association

## Security Features

1. **JWT Authentication**: All routes require valid JWT tokens
2. **Association Isolation**: Users can only access data from their association
3. **Group-Based Access**: Users only see campuses/students from their assigned group
4. **Role-Based Access Control**: Different permissions for association admins, group admins, and regular users
5. **Password Security**: 
   - Passwords hashed with bcrypt
   - Default passwords automatically generated
   - Password reset requires admin privileges

## Configuration

### Environment Variables Required

#### Email Configuration (Optional - for production)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@campus-management.com
FRONTEND_URL=http://localhost:3000
```

#### JWT Secret (Required)
```env
JWT_SECRET=your-secret-key-change-in-production
```

## Migration Notes

### Breaking Changes
1. **User Model**: `isAdmin` field replaced with `isAssociationAdmin` and `isGroupAdmin`
2. **Data Isolation**: All existing data will need to be assigned to an association
3. **Access Control**: Users must belong to an association and group to access data

### Migration Steps
1. Run database migrations to add new tables and columns
2. Create a default association for existing data
3. Assign existing users to the default association
4. Assign existing campuses to the default association
5. Create user groups and assign users appropriately

## Testing Checklist

- [ ] Public association registration works
- [ ] Users can only see their association's data
- [ ] Association admins can manage all users/groups in their association
- [ ] Group admins can create groups with different permissions
- [ ] Regular users only see campuses/students from their group
- [ ] Password reset emails are sent correctly
- [ ] Default password emails are sent when creating users
- [ ] User assignment to groups/associations works
- [ ] Admin management screen is accessible only to admins
- [ ] All routes properly filter by association

## Dependencies Added

### Backend
- `nodemailer` - For sending emails

### Frontend
- No new dependencies (uses existing Material-UI)

## Files Changed

### Backend
- `backend/database/models/Association.js` (new)
- `backend/database/models/User.js` (updated)
- `backend/database/models/UserGroup.js` (updated)
- `backend/database/models/Campus.js` (updated)
- `backend/database/models/index.js` (updated)
- `backend/database/utils/seedDB.js` (updated)
- `backend/middleware/auth.js` (updated)
- `backend/routes/auth.js` (updated)
- `backend/routes/campuses.js` (updated)
- `backend/routes/students.js` (updated)
- `backend/routes/admin.js` (updated)
- `backend/routes/associations.js` (new)
- `backend/routes/index.js` (updated)
- `backend/utils/email.js` (new)

### Frontend
- `frontend/src/components/views/RegisterAssociationView.js` (new)
- `frontend/src/components/containers/RegisterAssociationContainer.js` (new)
- `frontend/src/components/views/AdminManagementView.js` (new)
- `frontend/src/components/containers/AdminManagementContainer.js` (new)
- `frontend/src/components/AdminRoute.js` (new)
- `frontend/src/components/views/LoginView.js` (updated)
- `frontend/src/components/containers/Header.js` (updated)
- `frontend/src/App.js` (updated)
- `frontend/src/store/thunks.js` (updated)
- `frontend/src/store/thunks/admin.js` (updated)

## Future Enhancements

1. User self-service password reset (via email link)
2. Email verification for new accounts
3. Two-factor authentication
4. Audit logging for admin actions
5. Bulk user import/export
6. Advanced group permissions (read-only, edit, delete)
7. Campus-level permissions

## Notes

- Email functionality requires proper SMTP configuration in production
- Default passwords are shown in email but should be changed immediately
- Association admins have full control - use with caution
- All password resets are logged (consider adding audit trail)

