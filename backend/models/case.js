const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true },
  title: String,
  crimeType: String,
  status: String,
  priority: String,
  assignedAgent: String,
  location: String,
  reportedDate: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);
