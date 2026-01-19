const WebSocket = require("ws");
const ALL_STOCKS = require("../constants/allStocks");

function startAngelFeed(feedToken, onTick) {
    const ws = new WebSocket(
        "wss://smartapisocket.angelone.in/smart-stream",
        {
            headers: {
                Authorization: `Bearer ${feedToken}`,
                "x-api-key": process.env.ANGEL_API_KEY,
                "x-client-code": process.env.ANGEL_CLIENT_CODE,
                "x-feed-token": feedToken
            }
        }
    );

    ws.on("open", () => {
        console.log("📡 Angel Feed connected");

        const tokens = ALL_STOCKS.map(s => s.token);
        console.log("🧾 Subscribing:", tokens);

        ws.send(JSON.stringify({
            action: 1,
            params: {
                mode: 1,
                tokenList: [{
                    exchangeType: 1,
                    tokens
                }]
            }
        }));
    });

    ws.on("message", msg => {
        // Send raw buffer or JSON up
        if (Buffer.isBuffer(msg)) {
            onTick({ info: "BINARY_PACKET", size: msg.length });
        } else {
            try {
                const data = JSON.parse(msg.toString());
                onTick(data);
            } catch {
                onTick({ info: "UNKNOWN_TEXT", text: msg.toString() });
            }
        }
    });


    ws.on("error", err => {
        console.error("❌ Feed error:", err.message);
    });
}

module.exports = { startAngelFeed };