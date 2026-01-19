const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { initAngelSession } = require("./services/angel.service");
const { startAngelFeed } = require("./services/angelFeed.service");
const ALL_STOCKS = require("./constants/allStocks");

/* ================= TOKEN → SYMBOL MAP ================= */
const tokenToSymbol = {};
ALL_STOCKS.forEach(s => {
    tokenToSymbol[s.token] = s.symbol;
});

/* ================= EXPRESS APP ================= */
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

/* ================= HTTP SERVER ================= */
const server = http.createServer(app);

/* ================= WEBSOCKET SERVER ================= */
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("🌍 Browser connected");
    ws.send(JSON.stringify({ message: "Connected to live price feed" }));
});

/* ================= ANGEL ONE FEED ================= */
(async () => {
    try {
        const { feedToken } = await initAngelSession();

        startAngelFeed(feedToken, message => {

            // Send EVERYTHING to browser for now
            const payload = {
                raw: true,
                data: message,
                time: new Date().toLocaleTimeString()
            };

            // If it looks like a tick, normalize it
            if (message.token && message.ltp) {
                payload.raw = false;
                payload.symbol = tokenToSymbol[message.token] || message.token;
                payload.price = message.ltp;
            }

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(payload));
                }
            });
        });



        console.log("📡 Angel One live feed started");

    } catch (err) {
        console.error("❌ Angel Feed Error:", err.message);
    }
})();

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Live Price Server Running on http://localhost:${PORT}`);
});