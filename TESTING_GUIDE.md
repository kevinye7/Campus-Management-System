# Local Testing Guide for Campus Management System

This guide will help you set up and test the Campus Management System locally on your machine.

## Prerequisites

1. **Node.js and npm** - Install from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **PostgreSQL Database** - Install from [postgresql.org](https://www.postgresql.org/download/)
   - Make sure PostgreSQL service is running
   - Note your PostgreSQL password (default is usually `postgres`)

3. **Git** (if not already installed)

---

## Step-by-Step Setup

### Step 1: Configure Database Connection

1. Open `backend/database/utils/configDB.js`
2. Update the database credentials to match your PostgreSQL setup:

```javascript
const dbName = 'starter-server';
const dbUser = 'postgres';
const dbPwd = 'postgres';  // Change this to your PostgreSQL password
```

**Note:** If you get a password authentication error, update the `dbPwd` value to match your PostgreSQL password.

---

### Step 2: Install Backend Dependencies

1. Open a terminal window
2. Navigate to the backend directory:

```bash
cd /Users/admin/Documents/Campus-Management-System/backend
```

3. Install dependencies:

```bash
npm install
```

This will install all required packages (Express, Sequelize, pg, etc.)

---

### Step 3: Start the Backend Server

1. Make sure you're still in the `backend` directory
2. Start the server:

```bash
npm start
```

**OR** for development with auto-reload:

```bash
npm run dev
```

You should see output like:
```
------Synced to db--------
--------Successfully seeded db--------
Server started on 5001
```

**Note:** The server will:
- Create the database if it doesn't exist
- Drop and recreate tables (force: true)
- Seed the database with initial data
- Start on port 5001

**Leave this terminal window open** - the server needs to keep running.

---

### Step 4: Install Frontend Dependencies

1. Open a **NEW** terminal window (keep the backend server running)
2. Navigate to the frontend directory:

```bash
cd /Users/admin/Documents/Campus-Management-System/frontend
```

3. Install dependencies:

```bash
npm install
```

This will install React, Redux, Material-UI, and other frontend packages.

---

### Step 5: Start the Frontend Application

1. Make sure you're still in the `frontend` directory
2. Start the React development server:

```bash
npm start
```

The browser should automatically open to `http://localhost:3000`

If it doesn't open automatically, manually navigate to: **http://localhost:3000**

---

## Testing the Application

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api

### Test Each Feature

#### 1. **Home Page**
- Navigate to http://localhost:3000
- Should see the home page with navigation links

#### 2. **View All Campuses**
- Click "All Campuses" in the header
- Should display a list of campuses with images
- Should show campus name, address, and description
- Click on a campus name to view details

#### 3. **View Single Campus**
- Click on any campus from the list
- Should show campus details: name, image, address, description
- Should list all enrolled students (or message if none)
- Click on student names to view their details

#### 4. **View All Students**
- Click "All Students" in the header
- Should display a list of all students with images
- Should show student names
- Click on student names to view details
- Test delete functionality (if available)

#### 5. **View Single Student**
- Click on any student from the list
- Should show student details: name, image, email, GPA
- Should show campus name (clickable link if enrolled)
- Should show "Not enrolled at any campus" if no campus

#### 6. **Add New Student**
- Click "Add New Student" button
- Fill in the form:
  - First Name (required)
  - Last Name (required)
  - Campus Id (optional)
- Submit the form
- Should redirect to the new student's detail page

#### 7. **Navigation**
- Test navigation links in the header
- Test clicking on campus names to view campus details
- Test clicking on student names to view student details
- Test clicking on campus name from student view to go to campus

---

## API Testing with cURL or Postman

You can also test the backend API directly:

### Get All Campuses
```bash
curl http://localhost:5001/api/campuses
```

### Get Single Campus
```bash
curl http://localhost:5001/api/campuses/1
```

### Get All Students
```bash
curl http://localhost:5001/api/students
```

### Get Single Student
```bash
curl http://localhost:5001/api/students/1
```

### Add New Student (POST)
```bash
curl -X POST http://localhost:5001/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","campusId":1}'
```

### Add New Campus (POST)
```bash
curl -X POST http://localhost:5001/api/campuses \
  -H "Content-Type: application/json" \
  -d '{"name":"New Campus","address":"123 Main St","description":"A new campus"}'
```

---

## Troubleshooting

### Issue: "password authentication failed for user postgres"

**Solution:** 
1. Update `backend/database/utils/configDB.js`
2. Change `dbPwd` to match your PostgreSQL password

### Issue: "Cannot find module" errors

**Solution:**
1. Make sure you ran `npm install` in both backend and frontend directories
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again

### Issue: Port already in use (EADDRINUSE)

**Solution:**
- **Port 5001 (Backend):** Check if another process is using it:
  ```bash
  lsof -i :5001
  ```
  Kill the process or change the port in `backend/app.js`

- **Port 3000 (Frontend):** React will usually ask if you want to use a different port (Y/n)

### Issue: Database connection errors

**Solution:**
1. Make sure PostgreSQL is running:
   - **macOS:** `brew services start postgresql` or check System Preferences
   - **Linux:** `sudo systemctl start postgresql`
   - **Windows:** Check Services panel

2. Verify your PostgreSQL password in `configDB.js`

3. Check if PostgreSQL is accepting connections on the default port (5432)

### Issue: "ERR_OSSL_EVP_UNSUPPORTED" (Frontend)

**Solution (macOS/Linux):**
Add to `~/.bash_profile` or `~/.bashrc`:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```
Then restart your terminal.

### Issue: Frontend can't connect to backend

**Solution:**
1. Make sure backend is running on port 5001
2. Check the proxy setting in `frontend/package.json` (should be `"proxy": "http://localhost:5001"`)
3. Check browser console for CORS errors

---

## Development Workflow

1. **Keep two terminal windows open:**
   - Terminal 1: Backend server (`npm start` or `npm run dev` in backend folder)
   - Terminal 2: Frontend server (`npm start` in frontend folder)

2. **Making Changes:**
   - Backend changes: Restart the backend server (Ctrl+C, then `npm start` again)
   - Frontend changes: React will auto-reload (hot reload enabled)

3. **Database Reset:**
   - The database is set to `force: true`, so it will reset every time you restart the backend
   - All data will be re-seeded from `backend/database/utils/seedDB.js`

---

## Quick Start Commands Summary

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend (in a new terminal)
cd frontend
npm install
npm start
```

Then open http://localhost:3000 in your browser!

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts and opens in browser
- [ ] Home page loads correctly
- [ ] All Campuses view shows campuses with images
- [ ] Single Campus view shows details and students
- [ ] All Students view shows students with images
- [ ] Single Student view shows all student information
- [ ] Add Student form works and redirects
- [ ] Navigation links work correctly
- [ ] Images display properly
- [ ] Empty states show helpful messages
- [ ] No console errors in browser

---

## Need Help?

If you encounter issues:
1. Check the console/terminal for error messages
2. Check browser developer tools (F12) for frontend errors
3. Verify all prerequisites are installed
4. Make sure PostgreSQL is running
5. Check that ports 3000 and 5001 are not in use by other applications

