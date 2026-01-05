const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ein Name für die Kategorie ist erforderlich'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    defaultImageUrl: {
        type: String,
        required: [true, 'Ein Standardbild für die Kategorie ist erforderlich']
    },
    description: {
        type: String,
        maxlength: 200
    },
    color: {
        type: String,
        default: '#333333'
    }
});

module.exports = mongoose.model('Category', CategorySchema);