export function scanStock(ticker, data) {
  const results = [];

  for (let i = 0; i < data.length - 2; i++) {
    const day1 = data[i];
    const day2 = data[i + 1];

    // Bullish Setup
    if (
      day2.open > day1.high &&
      day2.close < day1.close &&
      day2.close > day1.low &&
      day2.close < day1.high
    ) {
      results.push(
        handleSetup(ticker, data, i, "Bullish Setup", d => d.close > day1.close, (d, t) => d.high >= t, day1)
      );
    }

    // Bearish Setup
    if (
      day2.open < day1.low &&
      day2.close > day1.close &&
      day2.close > day1.low &&
      day2.close < day1.high
    ) {
      results.push(
        handleSetup(ticker, data, i, "Bearish Setup", d => d.close < day1.close, (d, t) => d.low <= t, day1)
      );
    }
  }

  return results.filter(Boolean);
}

function handleSetup(ticker, data, i, setupType, triggerCond, targetCond, day1) {
  let trigger = "☒ Waiting";
  let triggerDateTime = "-";
  let signalPrice = data[i + 1].close;
  let triggerIndex = -1;

  const days = ["-","-","-","-","-"];

  for (let j = i + 2; j < Math.min(i + 7, data.length); j++) {
    if (triggerCond(data[j])) {
      trigger = "☑ Triggered";
      triggerDateTime = data[j].datetime;
      signalPrice = data[j].close;
      days[j - (i + 2)] = data[j].datetime;
      triggerIndex = j;
      break;
    }
  }

  const range = (day1.high - day1.low) * 2;
  const target = setupType === "Bullish Setup"
    ? day1.high + range
    : day1.low - range;

  let targetHitDateTime = "-";
  let targetHitDays = "-";

  if (triggerIndex !== -1) {
    for (let j = triggerIndex + 1; j < data.length; j++) {
      if (targetCond(data[j], target)) {
        targetHitDateTime = data[j].datetime;
        targetHitDays = j - triggerIndex;
        break;
      }
    }
  }

  return {
    ticker,
    setupDateTime: data[i + 1].datetime,
    setupType,
    days,
    trigger,
    triggerDateTime,
    signalPrice,
    target,
    targetHitDateTime,
    targetHitDays
  };
}