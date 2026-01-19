const axios = require("axios");
const { initAngelSession } = require("./angel.service");
const INSTRUMENTS = require("../constants/instruments");

async function fetchLTP(symbols = []) {
  const { jwtToken } = await initAngelSession();

  if (symbols.length === 0) {
    symbols = ["NIFTY", "BANKNIFTY"];
  }

  const exchangeTokens = {
    NSE: []
  };

  const tokenToSymbol = {};

  for (const sym of symbols) {
    const key = sym.toUpperCase();
    const inst = INSTRUMENTS[key];
    if (!inst) continue;

    exchangeTokens.NSE.push(inst.symboltoken);
    tokenToSymbol[inst.symboltoken] = key;
  }

  if (exchangeTokens.NSE.length === 0) {
    throw new Error("No valid symbols provided");
  }

  // ✅ OFFICIAL ANGEL ONE MARKET DATA API
  const response = await axios.post(
    "https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/quote/",
    {
      mode: "LTP",
      exchangeTokens
    },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-ClientLocalIP": "127.0.0.1",
        "X-ClientPublicIP": "127.0.0.1",
        "X-MACAddress": "00:00:00:00:00:00",
        "X-PrivateKey": process.env.ANGEL_API_KEY
      }
    }
  );

  if (!response.data || response.data.status !== true) {
    throw new Error("Failed to fetch LTP data");
  }

  const result = {};

  for (const item of response.data.data.fetched) {
    const key = tokenToSymbol[item.symbolToken];
    result[key] = {
      price: item.ltp,
      exchange: "NSE",
      time: new Date()
    };
  }

  return result;
}

module.exports = { fetchLTP };