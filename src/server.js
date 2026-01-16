const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// API routes
const apiRoutes = require("./routes/api.routes");
app.use("/api", apiRoutes);

// 🔑 CREATE HTTP SERVER FROM EXPRESS (THIS WAS MISSING)
const server = http.createServer(app);

// 🔌 WebSocket server attaches to HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("🔌 WebSocket client connected");
    ws.send(JSON.stringify({ message: "Connected to WebSocket" }));
});

// PORT
const PORT = process.env.PORT || 3000;

// ❌ DO NOT USE app.listen anymore
// ✅ USE server.listen
server.listen(PORT, () => {
    console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});