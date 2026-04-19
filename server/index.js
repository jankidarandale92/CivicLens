const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- Import Routes ---
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes'); // This is the line failing currently

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); 

// --- API Routes ---
app.use('/api/auth', authRoutes); 
app.use('/api/reports', reportRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send("CivicLens API is live and running! 🚀");
});

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to CivicLens Database in MongoDB Atlas!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Connection Error: ", err.message);
  });