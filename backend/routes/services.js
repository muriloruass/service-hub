const express = require('express');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create service (provider only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.type !== 'provider') {
            return res.status(403).json({ error: 'Only providers can create services' });
        }
        
        const service = new Service({
            ...req.body,
            providerId: req.user.id
        });
        
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find()
            .populate('providerId', 'name email')
            .populate('clientId', 'name email');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single service
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('providerId', 'name email')
            .populate('clientId', 'name email');
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update service (owner provider only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        if (service.providerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the owner can update this service' });
        }
        
        const updated = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete service (owner provider only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
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

// Update status with validation
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        const validTransitions = {
            'scheduled': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        };
        
        if (!validTransitions[service.status].includes(status)) {
            return res.status(400).json({ error: 'Invalid status transition' });
        }
        
        service.status = status;
        await service.save();
        
        // Emit WebSocket event
        if (status === 'completed') {
            const io = req.app.get('io');
            io.emit('service_completed', {
                serviceId: service._id,
                title: service.title,
                executionDate: service.executionDate
            });
        }
        
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;