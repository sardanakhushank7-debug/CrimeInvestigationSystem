const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  officerId: { type: String, unique: true },
  name: String,
  rank: String,
  department: String,
  contact: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Officer', officerSchema);
