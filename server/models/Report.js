const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Pothole', 'Garbage', 'Streetlight', 'Water Leakage', 'Other'] 
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  imageUrl: { 
    type: String 
  }, 
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Verified', 'Resolved'] 
  },
  // --- NEW: Community Verification Logic ---
  // This stores the IDs of users who clicked "Verify"
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // This links to your future User model
  }],
}, { 
  // This automatically handles 'createdAt' and 'updatedAt'
  // No need for a manual reportedAt field anymore
  timestamps: true 
});

module.exports = mongoose.model('Report', ReportSchema);