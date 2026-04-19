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
    // Sorting by createdAt -1 (descending) to show newest reports first
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
});

/**
 * @route   PATCH /api/reports/verify/:id
 * @desc    Community Verification (Add user to verifiedBy array)
 */
router.patch('/verify/:id', async (req, res) => {
  try {
    const { userId } = req.body; // Sent from frontend (stored in localStorage after login)
    
    if (!userId) {
      return res.status(401).json({ message: "You must be logged in to verify issues." });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    // Check if user ID is already in the verifiedBy array
    if (report.verifiedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already verified this issue." });
    }

    // Add User ID to the array
    report.verifiedBy.push(userId);
    
    // Auto-update status to 'Verified' if verifications reach a threshold (e.g., 5)
    if (report.verifiedBy.length >= 5 && report.status === 'Pending') {
      report.status = 'Verified';
    }

    await report.save();
    res.json(report);
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/reports/update-status/:id
 * @desc    Admin Update Status (Resolve issue)
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

/**
 * @route   DELETE /api/reports/delete/:id
 * @desc    Delete a report permanently
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report successfully removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error during deletion" });
  }
});

module.exports = router;