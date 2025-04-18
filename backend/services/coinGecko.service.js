import axios from 'axios';
import ApiCache from '../models/ApiCache.model.js';
import CoinList from '../models/CoinList.model.js';
import dotenv from 'dotenv';

dotenv.config();

const coinGeckoApiBaseUrl = process.env.COINGECKO_API_BASE_URL;
const cacheTTL = (parseInt(process.env.CACHE_TTL_SECONDS, 10) || 60) * 1000;
const apiKey = process.env.API_KEYS;

// --- Helper Function for Caching ---
async function getCachedData(key) {
    if (!key) return null;
    try {
        const cached = await ApiCache.findOne({ key });
        if (cached) {
            const isExpired = (Date.now() - cached.createdAt.getTime()) > cacheTTL;
            if (!isExpired) {
                console.log(`Cache HIT for key: ${key}`);
                return cached.data;
            } else {
                console.log(`Cache EXPIRED for key: ${key}`);
            }
        } else {
            console.log(`Cache MISS for key: ${key}`);
        }
    } catch (error) {
        console.error(`Error reading cache for key ${key}:`, error.message);
    }
    return null;
}

async function cacheData(key, data) {
    if (!key || !data) return;
    try {
        // Upsert: update if exists, insert if not
        await ApiCache.findOneAndUpdate(
            { key },
            { data, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Cache UPDATED for key: ${key}`);
    } catch (error) {
        console.error(`Error writing cache for key ${key}:`, error.message);
    }
}


// --- Service Functions ---

export const getMarkets = async (order = 'price_change_percentage_24h_desc', perPage = 1) => {
    const cacheKey = `markets_${order}_${perPage}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`Fetching /coins/markets from CoinGecko (order: ${order}, perPage: ${perPage})`);
    try {
        const response = await axios.get(`${coinGeckoApiBaseUrl}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: order,
                per_page: perPage,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            },
            headers: {
                'Accept': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });

        if (response.data) {
            await cacheData(cacheKey, response.data);
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching markets from CoinGecko:', error.response?.data || error.message);
        throw new Error(`Failed to fetch market data from CoinGecko. Status: ${error.response?.status}`);
    }
}



export const getMarketChart = async (coinId, days = 7) => {
    if (!coinId) throw new Error('Coin ID is required for market chart');
    const cacheKey = `market_chart_${coinId}_${days}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`Fetching /coins/${coinId}/market_chart from CoinGecko (days: ${days})`);
    try {
        // *** CORRECTION: Removed the 'interval' parameter ***
        const response = await axios.get(`${coinGeckoApiBaseUrl}/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days
                // interval: days > 90 ? 'daily' : (days > 1 ? 'hourly' : 'hourly') // <-- REMOVED THIS LINE
            },
            headers: {
                'Accept': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });

        if (response.data) {
            await cacheData(cacheKey, response.data);
            return response.data;
        }
        return null;

    } catch (error) {
        // Log the detailed error structure if available
        console.error(`Error fetching market chart for ${coinId} from CoinGecko:`, error.response?.data || error.message);

        // Extract status and potential CoinGecko specific error
        const errorStatus = error.response?.status;
        const geckoError = error.response?.data?.status;

        if (errorStatus === 404) {
            throw new Error(`Coin with ID '${coinId}' not found on CoinGecko.`);
        } else if (geckoError?.error_code === 10005) { 
            // This shouldn't happen now interval is removed, but good to keep check
            throw new Error(`CoinGecko Plan Error (${geckoError.error_code}): ${geckoError.error_message}.`);
        } else if (errorStatus === 401) { // Could be a real API key issue now
            throw new Error(`Authentication failed with CoinGecko (Status 401). Check API Key validity.`);
        } else if (errorStatus === 429) { // Rate limit error
            throw new Error(`CoinGecko API rate limit exceeded (Status 429). Please wait.`);
        } else { // General fetch error
            throw new Error(`Failed to fetch market chart data for ${coinId}. Status: ${errorStatus || 'Unknown'}`);
        }
    }
}


export const getCoinList = async () => {
    // Strategy: Try DB first, then cache, then API, then update DB/Cache
    try {
        const dbCoins = await CoinList.find().select('coinId symbol name -_id').lean();
        if (dbCoins && dbCoins.length > 0) {
            console.log("Coin list fetched from DB");
            return dbCoins;
        }

        // 2. Try fetching from Cache (if DB is empty)
        const cacheKey = 'coin_list_full';
        const cached = await getCachedData(cacheKey);
        if (cached) return cached;

        // 3. Fetch from CoinGecko API
        console.log('Fetching full coin list from CoinGecko API...');
        const response = await axios.get(`${coinGeckoApiBaseUrl}/coins/list`, {
            params: { include_platform: false },
            headers: {
                'Accept': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });

        if (response.data && Array.isArray(response.data)) {
            const formattedData = response.data.map(c => ({ coinId: c.id, symbol: c.symbol, name: c.name }));

            // 4. Cache the result
            await cacheData(cacheKey, formattedData);

            // 5. Asynchronously update the DB (don't wait for this)
            updateCoinListInDB(formattedData).catch(err => console.error("Error updating coin list in DB:", err));

            return formattedData;
        }
        return [];
    } catch (error) {
        console.error('Error fetching coin list:', error.response?.data || error.message);
        throw new Error(`Failed to fetch coin list. Status: ${error.response?.status}`);
    }
}

// Helper to update DB in the background
async function updateCoinListInDB(coins) {
    if (!coins || coins.length === 0) return;
    console.log("Attempting to update CoinList collection in DB...");
    try {
        const bulkOps = coins.map(coin => ({
            updateOne: {
                filter: { coinId: coin.coinId },
                update: { $set: coin },
                upsert: true,
            }
        }));
        const result = await CoinList.bulkWrite(bulkOps);
        console.log("CoinList DB update result:", {
            inserted: result.insertedCount,
            updated: result.modifiedCount,
            upserted: result.upsertedCount
        });
    } catch (dbError) {
        console.error("Error during CoinList bulkWrite:", dbError);
    }
}