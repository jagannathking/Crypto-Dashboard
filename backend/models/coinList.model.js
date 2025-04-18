import mongoose from 'mongoose';

const CoinListSchema = new mongoose.Schema({
    coinId: { 
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    symbol: { 
        type: String,
        required: true,
    },
    name: { 
        type: String,
        required: true,
    },
});

const CoinList = mongoose.model('CoinList', CoinListSchema);
export default CoinList;