const { SmartAPI } = require("smartapi-javascript");
const totp = require("totp-generator");

let smartApi;
let sessionCreated = false;

async function initAngelSession() {
  if (sessionCreated) return smartApi;

  smartApi = new SmartAPI({
    api_key: process.env.ANGEL_API_KEY
  });

  const otp = totp(process.env.ANGEL_TOTP_SECRET);

  await smartApi.generateSession(
    process.env.ANGEL_CLIENT_CODE,
    process.env.ANGEL_SECRET_KEY,
    otp
  );

  sessionCreated = true;
  return smartApi;
}

module.exports = { initAngelSession };