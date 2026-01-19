async function callLtp(api, payload) {
  if (typeof api.ltpData === "function") {
    return api.ltpData(payload);
  }

  if (typeof api.getLtpData === "function") {
    return api.getLtpData(payload);
  }

  if (typeof api.getLtpDataV2 === "function") {
    return api.getLtpDataV2(payload);
  }

  throw new Error("LTP method not available in SmartAPI SDK");
}

module.exports = { callLtp };