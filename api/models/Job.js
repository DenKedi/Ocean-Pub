const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ein Job-Titel ist erforderlich'],
        trim: true
    },
    type: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    startTime: {
        type: Date,
        required: false,
        index: true
    },
    endTime: {
        type: Date,
        required: false
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
    },
    isActive : {
        type: Boolean,
        default: true
    }
}, {
});

module.exports = mongoose.model('Job', JobSchema);