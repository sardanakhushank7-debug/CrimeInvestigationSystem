const mongoose = require('mongoose');

const suspectSchema = new mongoose.Schema({
  suspectId: { type: String, unique: true },
  name: String,
  alias: String,
  age: String,
  gender: String,
  crimeType: String,
  address: String,
  riskLevel: String,
  status: String,
  caseId: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suspect', suspectSchema);
