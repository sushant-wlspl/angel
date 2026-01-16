const { initAngelSession } = require("./angel.service");

/**
 * Market open / close status
 */
async function fetchMarketStatus() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

    const marketOpen =
        isWeekday &&
        (hour > 9 || (hour === 9 && minute >= 15)) &&
        (hour < 15 || (hour === 15 && minute <= 30));

    return {
        exchange: "NSE",
        status: marketOpen ? "OPEN" : "CLOSED",
        serverTime: now
    };
}

/**
 * Live index price
 */
async function fetchIndexPrice() {
    const smartApi = await initAngelSession();

    const nifty = await smartApi.ltpData({
        exchange: "NSE",
        tradingsymbol: "NIFTY 50",
        symboltoken: "99926000"
    });

    const banknifty = await smartApi.ltpData({
        exchange: "NSE",
        tradingsymbol: "BANKNIFTY",
        symboltoken: "99926009"
    });

    return {
        nifty: nifty.data.ltp,
        banknifty: banknifty.data.ltp,
        time: new Date()
    };
}

/**
 * Candle data
 */
async function fetchCandleData({ symboltoken, interval }) {
    const smartApi = await initAngelSession();

    const now = new Date();
    const fromDate = new Date(now.getTime() - 60 * 60 * 1000);

    const format = d => d.toISOString().slice(0, 19).replace("T", " ");

    const response = await smartApi.getCandleData({
        exchange: "NSE",
        symboltoken,
        interval,
        fromdate: format(fromDate),
        todate: format(now)
    });

    return response.data.map(c => ({
        time: c[0],
        open: c[1],
        high: c[2],
        low: c[3],
        close: c[4],
        volume: c[5]
    }));
}

module.exports = {
    fetchMarketStatus,
    fetchIndexPrice,
    fetchCandleData
};
