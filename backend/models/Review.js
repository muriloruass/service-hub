const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    comment: {
        type: String,
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ serviceId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);