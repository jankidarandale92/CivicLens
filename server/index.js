const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes (Make sure reportRoutes.js exists in server/routes/)
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Essential to read JSON data from the frontend

// --- API Routes ---
// This tells the app that any URL starting with /api/reports 
// should be handled by reportRoutes.js
app.use('/api/reports', reportRoutes);

// Test Route to verify server is alive in the browser
app.get('/', (req, res) => {
  res.send("CivicLens API is live and running! 🚀");
});

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to CivicLens Database in MongoDB Atlas!");
    // Only start the server if the Database connection is successful
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Connection Error: ", err.message);
  });