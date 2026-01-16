const {
    fetchMarketStatus,
    fetchIndexPrice,
    fetchCandleData
} = require("../services/market.service");

/**
 * Market status
 */
exports.getMarketStatus = async (req, res) => {
    try {
        const data = await fetchMarketStatus();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Live index price
 */
exports.getIndexPrice = async (req, res) => {
    try {
        const data = await fetchIndexPrice();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Candle data
 */
exports.getCandleData = async (req, res) => {
    try {
        const symboltoken = req.query.symboltoken || "99926000";
        const interval = req.query.interval || "FIVE_MINUTE";

        const candles = await fetchCandleData({ symboltoken, interval });
        res.json({ success: true, candles });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
