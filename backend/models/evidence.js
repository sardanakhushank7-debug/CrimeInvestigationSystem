const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  evidenceId: { type: String, unique: true },
  caseId: String,
  type: String,
  name: String,
  location: String,
  foundDate: String,
  collectedBy: String,
  status: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
