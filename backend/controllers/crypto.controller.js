import * as cryptoService from '../services/coinGecko.service.js';

// Get Top Gainer / Loser
export const getTopMover = async (req, res) => {
    const orderQuery = req.query.order?.toLowerCase(); 
    const orderParam = orderQuery === 'asc'
        ? 'price_change_percentage_24h_asc' 
        : 'price_change_percentage_24h_desc'; 
    const moverType = orderQuery === 'asc' ? 'loser' : 'gainer';

    try {
        const data = await cryptoService.getMarkets(orderParam, 1); 

        if (!data || data.length === 0) {
             return res.status(200).json(null); 
        }

        res.status(200).json(data[0]);

    } catch (error) {
        console.error(`Error fetching top ${moverType}:`, error);
        res.status(error.message.includes("Status: 4") ? 400 : 500).json({ 
             success: false,
             message: `Server error fetching top ${moverType}.`,
             error: error.message
         });
    }
};


// Get Historical Chart Data for a Coin
export const getCoinMarketChart = async (req, res) => {
    const { coinId } = req.params;
    const daysQuery = req.query.days;
    // Validate days, default to 7
    const validDays = ['7', '14', '30'];
    const days = validDays.includes(daysQuery) ? parseInt(daysQuery, 10) : 7;

    if (!coinId) {
        return res.status(400).json({ success: false, message: 'Coin ID parameter is required.' });
    }

    try {
        const data = await cryptoService.getMarketChart(coinId, days);
         if (!data) {

            return res.status(404).json({ success: false, message: `Market chart data not found for ${coinId}.` });
        }
        res.status(200).json(data); 

    } catch (error) {
        console.error(`Error fetching market chart for ${coinId}:`, error);
         let statusCode = 500;
        if (error.message.includes('not found')) statusCode = 404;
        else if (error.message.includes("Status: 4")) statusCode = 400; 

        res.status(statusCode).json({
             success: false,
             message: `Failed to fetch market chart for ${coinId}.`,
             error: error.message
         });
    }
};

// Get List of Available Coins
export const getAvailableCoins = async (req, res) => {
     try {
        const data = await cryptoService.getCoinList();
        res.status(200).json(data); ``
    } catch (error) {
        console.error(`Error fetching available coins list:`, error);
        res.status(500).json({
             success: false,
             message: 'Server error fetching available coins list.',
             error: error.message
         });
    }
};