const express = require('express');
const AvailableService = require('../models/AvailableService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all available services (public - for marketplace)
router.get('/', async (req, res) => {
    try {
        const services = await AvailableService.find().populate('providerId', 'name email');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get provider's own available services
router.get('/my-services', authMiddleware, async (req, res) => {
    try {
        const services = await AvailableService.find({ providerId: req.user.id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create available service (provider only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.type !== 'provider') {
            return res.status(403).json({ error: 'Only providers can create services' });
        }
        
        const service = new AvailableService({
            ...req.body,
            providerId: req.user.id
        });
        
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update available service (owner only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const service = await AvailableService.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        if (service.providerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the owner can update this service' });
        }
        
        const updated = await AvailableService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete available service (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const service = await AvailableService.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        if (service.providerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the owner can delete this service' });
        }
        
        await service.deleteOne();
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;