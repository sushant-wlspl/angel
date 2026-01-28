const { login, getDailyCandles } = require("./angel");
const analyze = require("./logic");
const symbols = require("./symbols");

(async () => {
  await login();

  for (const [name, token] of Object.entries(symbols)) {
    const data = await getDailyCandles(token);
    const results = analyze(name, data);

    results.forEach(r => console.log(r));
  }
})();