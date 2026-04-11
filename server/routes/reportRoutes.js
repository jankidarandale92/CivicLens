const express = require('express');
const router = express.Router();
const Report = require('../models/Report'); // Import the blueprint we made earlier

// 1. POST: Submit a new civic issue
router.post('/add', async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address, imageUrl } = req.body;
    
    const newReport = new Report({
      title,
      description,
      category,
      location: { latitude, longitude, address },
      imageUrl
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: "Error saving report", error: err.message });
  }
});

// 2. GET: Fetch all issues for the Map/List
router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
});

module.exports = router;