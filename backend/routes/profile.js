const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        
        if (currentPassword && newPassword) {
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }
        
        await user.save();
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            type: user.type
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete account
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;