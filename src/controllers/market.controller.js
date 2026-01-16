const { fetchMarketStatus } = require("../services/market.service");

exports.getMarketStatus = async (req, res) => {
  try {
    const data = await fetchMarketStatus();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};