const { fetchLTP } = require("../services/ltp.service");

exports.getLTP = async (req, res) => {
  try {
    const symbols = req.query.symbols
      ? req.query.symbols.split(",").map(s => s.trim())
      : [];

    const data = await fetchLTP(symbols);

    res.json({
      success: true,
      count: Object.keys(data).length,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};