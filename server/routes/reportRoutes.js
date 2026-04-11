const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const upload = require('../middleware/multer'); // The middleware we created in Step 2

/**
 * @route   POST /api/reports/add
 * @desc    Submit a new civic issue with an image proof
 * @access  Public
 */
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    // text data comes in req.body
    const { title, description, category, latitude, longitude, address } = req.body;
    
    const newReport = new Report({
      title,
      description,
      category,
      location: { 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude), 
        address 
      },
      // If a file was uploaded, Multer provides the Cloudinary URL in req.file.path
      imageUrl: req.file ? req.file.path : null 
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error("Backend Post Error:", err);
    res.status(400).json({ 
      message: "Error saving report with image", 
      error: err.message 
    });
  }
});

/**
 * @route   GET /api/reports/all
 * @desc    Fetch all issues for the Dashboard feed
 * @access  Public
 */
router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching reports", 
      error: err.message 
    });
  }
});

module.exports = router;