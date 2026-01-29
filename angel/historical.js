import axios from "axios";
import { angelHeaders } from "./smartApi.js";

export async function getCandleData(symbolToken) {
  const payload = {
    exchange: "NSE",
    symboltoken: symbolToken,
    interval: "ONE_DAY",
    fromdate: getFromDate(30),
    todate: getToDate()
  };

  let response;

  try {
    response = await axios.post(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/historical/v1/getCandleData",
      payload,
      {
        headers: {
          ...angelHeaders(),
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://trade.angelone.in/",
          "Origin": "https://trade.angelone.in"
        },
        validateStatus: () => true
      }
    );
  } catch (e) {
    console.error(`❌ Historical request failed for ${symbolToken}`);
    return [];
  }

  console.log(`📦 Historical raw (${symbolToken}):`, response.data);

  // 🚫 Angel frequently blocks historical on localhost
  if (response.status !== 200) {
    console.warn(
      `⚠️ Historical blocked (${symbolToken}) HTTP ${response.status}`
    );
    return [];
  }

  if (!Array.isArray(response.data?.data)) {
    return [];
  }

  return response.data.data.map(c => ({
    datetime: c[0],
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4]
  }));
}

/* ---------- Date helpers ---------- */

function getFromDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return formatAngelDate(d, "09:15");
}

function getToDate() {
  const d = new Date();
  return formatAngelDate(d, "15:30");
}

function formatAngelDate(date, time) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${time}`;
}