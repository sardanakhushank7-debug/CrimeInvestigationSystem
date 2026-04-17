const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true },
  caseId: String,
  officer: String,
  type: String,
  reportDate: String,
  status: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
