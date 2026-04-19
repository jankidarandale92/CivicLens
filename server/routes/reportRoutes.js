const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const upload = require('../middleware/multer');

/**
 * @route   POST /api/reports/add
 * @desc    Submit a new civic issue with image proof
 */
router.post('/add', upload.single('image'), async (req, res) => {
  try {
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
      imageUrl: req.file ? req.file.path : null 
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error("Post Error:", err);
    res.status(400).json({ message: "Error saving report", error: err.message });
  }
});

/**
 * @route   GET /api/reports/all
 * @desc    Fetch all issues for the feed
 */
router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
});

/**
 * @route   PUT /api/reports/update-status/:id
 * @desc    Update report status (Resolve issue)
 */
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report ID not found" });
    }

    res.json(updatedReport);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;