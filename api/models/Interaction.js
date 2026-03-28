const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  buttonType: {
    type: String,
    required: true,
    enum: ['link', 'mehr_infos', 'alle_events', 'category_filter']
  },
  sessionId: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient aggregation queries
interactionSchema.index({ buttonType: 1, timestamp: 1 });
interactionSchema.index({ eventId: 1, timestamp: 1 });

module.exports = mongoose.model('Interaction', interactionSchema);
