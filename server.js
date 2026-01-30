import express from "express";
import dotenv from "dotenv";
import { loginAngel } from "./angel/smartApi.js";
import { getCandleData } from "./angel/historical.js";
import { scanStock } from "./angel/scanner.js";

dotenv.config();
const app = express();

function renderTable(rows) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Angel – Daily Stock Scanner</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #0f172a;
      color: #e5e7eb;
      font-family: Arial, Helvetica, sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 20px;
      color: #38bdf8;
    }

    .table-wrap {
      overflow-x: auto;
      background: #020617;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(56,189,248,0.15);
    }

    table {
      border-collapse: collapse;
      width: 100%;
      min-width: 1400px;
    }

    thead {
      position: sticky;
      top: 0;
      background: #020617;
      z-index: 2;
    }

    th, td {
      border: 1px solid #1e293b;
      padding: 10px 12px;
      text-align: center;
      white-space: nowrap;
      font-size: 13px;
    }

    th {
      color: #7dd3fc;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: #020617;
    }

    tr:nth-child(odd) {
      background: #020617;
    }

    tr:hover {
      background: #020617;
    }

    .bullish {
      color: #22c55e;
      font-weight: bold;
    }

    .bearish {
      color: #ef4444;
      font-weight: bold;
    }

    .triggered {
      color: #22c55e;
      font-weight: bold;
    }

    .waiting {
      color: #facc15;
      font-weight: bold;
    }

    footer {
      margin-top: 15px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>

<body>

  <h1>📊 Angel – Daily Stock Scanner</h1>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Setup DateTime</th>
          <th>Setup Type</th>
          <th>DAY1</th>
          <th>DAY2</th>
          <th>DAY3</th>
          <th>DAY4</th>
          <th>DAY5</th>
          <th>Trigger</th>
          <th>Trigger DateTime</th>
          <th>Signal Price</th>
          <th>Target</th>
          <th>Target Hit DateTime</th>
          <th>Target Hit Days</th>
        </tr>
      </thead>

      <tbody>
        ${rows.length === 0
            ? `<tr><td colspan="14">No setups found</td></tr>`
            : rows.map(r => `
              <tr>
                <td>${r.ticker}</td>
                <td>${r.setupDateTime}</td>
                <td class="${r.setupType.includes("Bullish") ? "bullish" : "bearish"}">
                  ${r.setupType}
                </td>
                ${r.days.map(d => `<td>${d}</td>`).join("")}
                <td class="${r.trigger.includes("Triggered") ? "triggered" : "waiting"}">
                  ${r.trigger}
                </td>
                <td>${r.triggerDateTime}</td>
                <td>${Number(r.signalPrice).toFixed(2)}</td>
                <td>${Number(r.target).toFixed(2)}</td>
                <td>${r.targetHitDateTime}</td>
                <td>${r.targetHitDays}</td>
              </tr>
            `).join("")
        }
      </tbody>
    </table>
  </div>

  <footer>
    Data Source: Angel Smart API • Strategy Engine: Angel Node App
  </footer>

</body>
</html>
`;
}

const TICKERS = [
  "WIPRO.NS","BAJFINANCE.NS","TATASTEEL.NS","INDHOTEL.NS",
  "HCLTECH.NS","INDUSINDBK.NS","JSWSTEEL.NS","INDIGO.NS",
  "NESTLEIND.NS","ONGC.NS","COALINDIA.NS","ICICIBANK.NS",
  "INFY.NS","RELIANCE.NS","TCS.NS","SBIN.NS",
  "HDFCBANK.NS","AXISBANK.NS"
  // your full list here
];


app.get("/", async (req, res) => {
    await loginAngel();
    console.log("LOGIN DONE");

    let rows = [];

    for (const t of TICKERS) {
        const data = await getCandleData(t.token);

        if (data.length < 3) {
            console.warn(`⚠️ No data for ${t.name}`);
            continue;
        }

        rows.push(...scanStock(t.name, data));
    }


    res.send(renderTable(rows));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Angel running on port ${PORT}`);
});