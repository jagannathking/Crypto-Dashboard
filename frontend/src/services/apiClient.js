import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});




//  Fetches the top gainer coin.

export const fetchTopGainer = async () => {
    try {
        const response = await apiClient.get('/crypto/markets/top-gainer');
        return response.data;
    } catch (error) {
        console.error('Error fetching top gainer:', error.response?.data || error.message);
        throw error; 
    }
};


//  Fetches the top loser coin.

export const fetchTopLoser = async () => {
    try {
        const response = await apiClient.get('/crypto/markets/top-loser');
        return response.data; 
    } catch (error) {
        console.error('Error fetching top loser:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches the list of available coins for the selector.
 */
export const fetchCoinList = async () => {
    try {
        const response = await apiClient.get('/crypto/coins/list');
        return response.data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching coin list:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches market chart data for a specific coin and timeframe.
 * The ID of the coin (e.g., 'bitcoin').
 * The number of days (7, 14, or 30).
 */
export const fetchMarketChart = async (coinId, days) => {
    if (!coinId) throw new Error('Coin ID is required');
    try {
        const response = await apiClient.get(`/crypto/coins/${coinId}/market-chart`, {
            params: { days },
        });
        return response.data; 
    } catch (error) {
        console.error(`Error fetching market chart for ${coinId}:`, error.response?.data || error.message);
        throw error;
    }
};

export default apiClient; 