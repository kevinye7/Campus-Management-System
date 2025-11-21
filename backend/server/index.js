const express = require('express');
const app = express();
const db = require('../database');
const seedDB = require('../database/utils/seedDB');

// Middleware
app.use(express.json());

// API routes
app.use('/api', require('./api'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;

const init = async () => {
  try {
    await db.sync({ force: true });
    await seedDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

init();