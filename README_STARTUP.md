# Quick Start Guide

## 🚀 Easy Startup

### macOS / Linux

Simply run:
```bash
./start.sh
```

This will:
- ✅ Check dependencies
- ✅ Install packages if needed
- ✅ Start backend server (port 5001)
- ✅ Start frontend server (port 3000)
- ✅ Open http://localhost:3000 in your browser
- ✅ Show logs in the terminal

**To stop:** Press `Ctrl+C` in the terminal

---

### Windows

Double-click on:
```
start-windows.bat
```

OR run in Command Prompt:
```cmd
start-windows.bat
```

This will:
- ✅ Check dependencies
- ✅ Install packages if needed
- ✅ Open two command windows (backend and frontend)
- ✅ Open http://localhost:3000 in your browser

**To stop:** Close the command windows or press `Ctrl+C` in each

---

## 📋 Manual Startup (Alternative)

If you prefer to start servers manually:

### Terminal 1 - Backend:
```bash
cd backend
npm install  # First time only
npm start
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install  # First time only
npm start
```

Then open http://localhost:3000 in your browser.

---

## ⚙️ Prerequisites

Before running the startup script, make sure:

1. **Node.js** is installed (check with `node --version`)
2. **PostgreSQL** is installed and running
3. **Database password** is configured in `backend/database/utils/configDB.js`

---

## 🔧 Troubleshooting

### Script won't run on macOS/Linux

Make it executable:
```bash
chmod +x start.sh
```

### Backend fails to start

- Check PostgreSQL is running
- Verify password in `backend/database/utils/configDB.js`
- Check if port 5001 is available

### Frontend fails to start

- Check if port 3000 is available
- Try running `npm install` manually in the frontend directory

### Browser doesn't open

Just manually open: http://localhost:3000

---

## 📝 Logs

When using the startup script:

- **Backend logs:** Check `backend.log` file or the terminal output
- **Frontend logs:** Check `frontend.log` file or the terminal output

To view logs in real-time:
```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log
```

---

## 🛑 Stopping the Servers

### Using the startup script (macOS/Linux):
- Press `Ctrl+C` in the terminal
- The script will automatically stop both servers

### Using the Windows batch file:
- Close the two command windows
- Or press `Ctrl+C` in each window

### Manual stop:
- Find the process: `lsof -i :5001` (backend) or `lsof -i :3000` (frontend)
- Kill it: `kill <PID>`

---

## 📚 Full Documentation

See `TESTING_GUIDE.md` for detailed testing instructions and troubleshooting.

