import mongoose from 'mongoose';

const ApiCacheSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true, 
    },
});


const ApiCache = mongoose.model('ApiCache', ApiCacheSchema)

export default ApiCache;