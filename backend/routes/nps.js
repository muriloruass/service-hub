const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { start, end } = req.query;
        const query = { providerId: req.user.id };
        
        if (start && end) {
            query.createdAt = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }
        
        const reviews = await Review.find(query);
        
        const total = reviews.length;
        const promoters = reviews.filter(r => r.score >= 9).length;
        const passives = reviews.filter(r => r.score >= 7 && r.score <= 8).length;
        const detractors = reviews.filter(r => r.score <= 6).length;
        
        const nps = total === 0 ? 0 : ((promoters - detractors) / total) * 100;
        
        res.json({
            total,
            promoters,
            passives,
            detractors,
            nps: Math.round(nps),
            reviews
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;