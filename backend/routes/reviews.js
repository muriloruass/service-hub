const express = require('express');
const Review = require('../models/Review');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.type !== 'client') {
            return res.status(403).json({ error: 'Only clients can create reviews' });
        }
        
        const { serviceId, score, comment } = req.body;
        
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        if (service.status !== 'completed') {
            return res.status(400).json({ error: 'Cannot review a service that is not completed' });
        }
        
        if (service.clientId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You can only review your own services' });
        }
        
        const existingReview = await Review.findOne({ serviceId, clientId: req.user.id });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this service' });
        }
        
        const review = new Review({
            score,
            comment,
            serviceId,
            clientId: req.user.id,
            providerId: service.providerId
        });
        
        await review.save();
        
        const io = req.app.get('io');
        io.emit('new_review', {
            reviewId: review._id,
            score: review.score,
            serviceId: review.serviceId
        });
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('serviceId', 'title')
            .populate('clientId', 'name email')
            .populate('providerId', 'name email');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('serviceId', 'title')
            .populate('clientId', 'name email')
            .populate('providerId', 'name email');
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        if (review.clientId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the author can update this review' });
        }
        
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { score: req.body.score, comment: req.body.comment },
            { new: true, runValidators: true }
        );
        
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        if (review.clientId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the author can delete this review' });
        }
        
        await review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;