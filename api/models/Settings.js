const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  instagram: {
    postLeft: { type: String, default: '' },
    postRight: { type: String, default: '' },
  },
  drinksPdfUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
