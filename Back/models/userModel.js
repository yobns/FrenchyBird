const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Array, required: false, default:[] }
});

module.exports = mongoose.model('User', userModel);