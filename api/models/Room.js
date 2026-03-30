const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  sketch: {
    type: String,
    required: true, // 'sketch1' oder 'sketch2'
    index: true
  },
  id: {
    type: Number,
    required: true
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  label: { type: String, required: true, trim: true },
  imageFolder: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  features: { type: [String], default: [] },
  capacity: { type: String, default: '' },
  area: { type: String, default: '' },
  extraText: { type: String, default: null },
  images: { type: [String], default: [] }
}, { timestamps: true });

// Eindeutig pro Sketch + numerischer ID
RoomSchema.index({ sketch: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
