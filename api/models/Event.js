const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ein Event-Titel ist erforderlich'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Eine Kategorie ist erforderlich']
    },
    eventImageUrl: {
        type: String,
        required: false // Event-Bild, welches das Standard-Kategorie-Bild überschreibt
    },
    description: {
        type: String,
        required: false
    },
    room: [{
        type: String,
        required: [true, 'Ein Raum ist erforderlich']
    }],
    startTime: {
        type: Date,
        required: [true, 'Eine Startzeit ist erforderlich'],
        index: true
    },
    endTime: {
        type: Date,
        required: false
    },
    price: {
        type: Number,
        default: 0
    },
    extra_label: {
        type: String,
        required: false
    },
    link_url: {
        type: String,
        required: false
    },
    link_text: {
        type: String,
        required: false
    },
    date_created: {
        type: Date,
        default: Date.now
    }
}, {
    // Wichtig für das virtuelle Bild-Feld
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Das virtuelle Feld für die Bild-Logik (wie besprochen)
EventSchema.virtual('finalImageUrl').get(function() {
    if (this.eventImageUrl) {
        return this.eventImageUrl;
    }
    if (this.category && this.category.defaultImageUrl) {
        return this.category.defaultImageUrl;
    }
    return '/images/event_default.webp'; 
});

module.exports = mongoose.model('Event', EventSchema);