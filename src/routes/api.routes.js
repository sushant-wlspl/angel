const express = require("express");
const router = express.Router();

const { getMarketStatus } = require("../controllers/market.controller");

router.get("/status", getMarketStatus);

module.exports = router;