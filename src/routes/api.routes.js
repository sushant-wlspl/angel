const express = require("express");
const router = express.Router();

const {
  getMarketStatus,
  getCandleData,
  getIndexPrice
} = require("../controllers/market.controller");

const auth = require("../middleware/auth");

router.get("/status", getMarketStatus);
router.get("/index-price", getIndexPrice);
router.get("/candles", auth, getCandleData);

module.exports = router;