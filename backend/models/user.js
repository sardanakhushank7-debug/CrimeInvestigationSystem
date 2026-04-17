const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  agentId: { type: String, unique: true, required: true },
  codeName: { type: String, required: true },
  fullName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'Investigator' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
