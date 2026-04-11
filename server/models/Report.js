const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Pothole', 'Garbage', 'Streetlight', 'Water Leakage', 'Other'] 
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String
  },
  imageUrl: { type: String }, // Link to the photo
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Verified', 'Resolved'] 
  },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);