const { SmartAPI } = require("smartapi-javascript");
require("dotenv").config();

const smartApi = new SmartAPI({
  api_key: process.env.ANGEL_API_KEY
});

async function login() {
  await smartApi.generateSession(
    process.env.ANGEL_CLIENT_CODE,
    process.env.ANGEL_PASSWORD,
    process.env.ANGEL_TOTP
  );
}

async function getDailyCandles(symbolToken) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 40);

  const res = await smartApi.getCandleData({
    exchange: "NSE",
    symboltoken: symbolToken,
    interval: "ONE_DAY",
    fromdate: from.toISOString(),
    todate: to.toISOString()
  });

  return res.data.map(c => ({
    datetime: c[0],
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4]
  }));
}

module.exports = { login, getDailyCandles };
