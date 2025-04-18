import express from 'express';
import {
    getTopMover,
    getCoinMarketChart,
    getAvailableCoins
} from '../controllers/crypto.controller.js';

const router = express.Router();

// GET /api/crypto/markets/top-gainer
// GET /api/crypto/markets/top-loser
router.get('/markets/top-gainer', getTopMover); 
router.get('/markets/top-loser', (req, res, next) => { 
    req.query.order = 'asc';
    getTopMover(req, res, next);
});

// GET /api/crypto/coins/list
router.get('/coins/list', getAvailableCoins);

// GET /api/crypto/coins/:coinId/market-chart?days=7 (or 14, 30)
router.get('/coins/:coinId/market-chart', getCoinMarketChart);

export default router;