# Campus Management System

A full-stack web application for managing campuses, students, and user associations. Built with React, Node.js, Express, and PostgreSQL, featuring role-based access control and multi-tenant architecture.

## Features

- **Campus Management**: Create, view, edit, and delete campuses with images and descriptions
- **Student Management**: Manage student records with GPA tracking and campus enrollment
- **User Authentication**: Secure JWT-based authentication system
- **Role-Based Access Control**: 
  - Association Administrators (full system access)
  - Group Administrators (manage specific user groups)
  - Regular Users (access based on assigned groups)
- **Multi-Tenant Architecture**: Support for multiple associations with isolated data
- **User Groups**: Organize users and control campus access by groups
- **Responsive UI**: Modern Material-UI interface with intuitive navigation
- **Docker Support**: Easy deployment with Docker Compose

## Tech Stack

### Frontend
- **React 18.2** - UI library
- **Redux** - State management
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Web server (production frontend)
- **PostgreSQL** - Database server

## Prerequisites

### For Docker Deployment (Recommended)
- [Docker Desktop](https://www.docker.com/get-started) (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Docker Compose v2.0+ (included with Docker Desktop)

### For Manual Installation
- **Node.js** 14.x - 20.x (recommended: 18.x)
- **PostgreSQL** 12+ 
- **npm** or **yarn**

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Campus-Management-System
   ```

2. **Start Docker Desktop** (if on Windows/Mac)

3. **Run the startup script**
   
   **Windows:**
   ```batch
   start-windows.bat
   ```
   
   **Linux/Mac:**
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

### Option 2: Manual Installation

1. **Install PostgreSQL**
   - Create a database user (default: `postgres` with password `postgres`)
   - Or update `backend/database/utils/configDB.js` with your credentials

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:5001

5. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Application opens at http://localhost:3000

## Default Seeded Data

The application comes pre-seeded with the following data for testing:

### Association
- **CUNY System**
  - Description: "City University of New York system"

### Campuses (3)
1. **Hunter College**
   - Address: 695 Park Ave, New York, NY 10065
   - Description: "This is a school in New York, New York."

2. **Queens College**
   - Address: 65-30 Kissena Blvd, Queens, NY 11367
   - Description: "This is a school in Queens, New York."

3. **Brooklyn College**
   - Address: 2900 Bedford Ave, Brooklyn, NY 11210
   - Description: "This is a school in Brooklyn, New York."

### User Groups (3)
1. **Administrators**
   - Description: "Full system access"
   - Access: All campuses (Hunter, Queens, Brooklyn)

2. **NYC Campuses**
   - Description: "Access to NYC area campuses"
   - Access: Hunter College, Queens College, Brooklyn College

3. **Queens Campus**
   - Description: "Access to Queens College only"
   - Access: Queens College only

### Users (3)

1. **Admin User**
   - Username: `admin`
   - Email: `admin@campus.edu`
   - Password: `admin123`
   - Role: Association Administrator
   - Group: Administrators
   - Access: Full system access

2. **Regular User**
   - Username: `user1`
   - Email: `user1@campus.edu`
   - Password: `user123`
   - Role: Regular User
   - Group: NYC Campuses
   - Access: Hunter, Queens, and Brooklyn Colleges

3. **Queens User**
   - Username: `queens_user`
   - Email: `queens@campus.edu`
   - Password: `queens123`
   - Role: Group Administrator
   - Group: Queens Campus
   - Access: Queens College only

### Students (2)

1. **Joe Smith**
   - Email: `joe.smith@myhunter.cuny.edu`
   - GPA: 3.5
   - Campus: Hunter College

2. **Mary Johnson**
   - Email: `mary.johnson@Qmail.cuny.edu`
   - GPA: 3.8
   - Campus: Queens College

## Project Structure

```
Campus-Management-System/
├── backend/
│   ├── database/
│   │   ├── models/          # Sequelize models (Campus, Student, User, etc.)
│   │   ├── utils/            # Database utilities (createDB, seedDB, configDB)
│   │   └── db.js             # Database connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── campuses.js       # Campus CRUD operations
│   │   ├── students.js       # Student CRUD operations
│   │   ├── admin.js          # Admin management routes
│   │   └── associations.js   # Association routes
│   ├── utils/
│   │   └── email.js          # Email utilities
│   ├── app.js                # Express app setup
│   ├── Dockerfile            # Backend Docker configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── containers/   # Container components (logic)
│   │   │   └── views/        # View components (presentation)
│   │   ├── store/            # Redux store
│   │   │   ├── actions/      # Action creators and types
│   │   │   ├── reducers/     # Redux reducers
│   │   │   └── thunks.js     # Async action creators
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── public/               # Static files
│   ├── Dockerfile            # Frontend Docker configuration
│   ├── nginx.conf            # Nginx configuration
│   └── package.json
├── docker-compose.yml        # Docker Compose configuration
├── start.sh                  # Linux/Mac startup script
├── start-windows.bat         # Windows startup script
└── README.md                 # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/register-association` - Register new association
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/assign-user-to-group` - Assign user to group (admin)
- `POST /api/auth/assign-association` - Assign user to association (admin)

### Campuses
- `GET /api/campuses` - Get all campuses (filtered by user's group)
- `GET /api/campuses/:id` - Get campus by ID
- `POST /api/campuses` - Create new campus (admin)
- `PUT /api/campuses/:id` - Update campus (admin)
- `DELETE /api/campuses/:id` - Delete campus (admin)

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/user-groups` - Get all user groups (admin only)
- `POST /api/admin/user-groups` - Create user group (admin only)

### Associations
- `GET /api/associations` - Get all associations
- `GET /api/associations/:id` - Get association by ID

**Note:** Most endpoints require JWT authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer <your-token>
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. After logging in, the token is stored in localStorage and automatically included in API requests.

### Login Credentials

Use any of the default seeded users:
- **Admin**: `admin` / `admin123`
- **Regular User**: `user1` / `user123`
- **Queens User**: `queens_user` / `queens123`

## Docker Commands

### Start Services
```bash
docker-compose up --build
```

### Start in Detached Mode
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Reset Database)
```bash
docker-compose down -v
```

### Access Database
```bash
docker-compose exec db psql -U postgres -d starter-server
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Database Configuration
DB_NAME=starter-server
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=5001
NODE_ENV=production

# Frontend Configuration
FRONTEND_PORT=3000
```

**For Docker:** Set `DB_HOST=db` (the service name) instead of `localhost`.

### Database Configuration

Update `backend/database/utils/configDB.js` for manual installation:
```javascript
const dbName = process.env.DB_NAME || 'starter-server';
const dbUser = process.env.DB_USER || 'postgres';
const dbPwd = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
```

## Testing

1. **Login** with one of the default users
2. **View Campuses** - Navigate to "All Campuses" to see available campuses
3. **View Students** - Navigate to "All Students" to see enrolled students
4. **Create Campus** - As admin, create a new campus
5. **Create Student** - Add a new student and assign to a campus
6. **Edit/Delete** - Modify or remove campuses and students

## Troubleshooting

### Docker Issues

**Docker Desktop not running:**
- Start Docker Desktop and wait for it to fully initialize
- The startup script will detect if Docker is not running

**Port already in use:**
- Change ports in `.env` or `docker-compose.yml`
- Or stop the service using the port

**Database connection errors:**
- Ensure PostgreSQL is running (for manual installation)
- Check database credentials in `configDB.js`
- For Docker, ensure the `db` service is healthy: `docker-compose ps`

### Manual Installation Issues

**Backend won't start:**
- Ensure PostgreSQL is installed and running
- Check database credentials in `backend/database/utils/configDB.js`
- Verify port 5001 is not in use

**Frontend won't start:**
- Ensure backend is running on port 5001
- Check that port 3000 is available
- Verify `frontend/package.json` proxy setting points to correct backend URL

**Database sync errors:**
- Ensure PostgreSQL user has permission to create databases
- Check database connection settings

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for hot-reload
```

**Frontend:**
```bash
cd frontend
npm start  # React dev server with hot-reload
```

### Database Reset

To reset the database and re-seed:
```bash
# Docker
docker-compose down -v
docker-compose up --build

# Manual
# The database is automatically synced and seeded on backend startup
# Set `force: true` in backend/app.js (already set by default)
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Additional Documentation

- [DOCKER.md](DOCKER.md) - Detailed Docker setup and deployment guide
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Comprehensive testing instructions

## Support

For issues and questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the logs: `docker-compose logs` or check `backend.log` / `frontend.log`
3. Open an issue on GitHub


