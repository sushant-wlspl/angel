const { SmartAPI } = require("smartapi-javascript");
const speakeasy = require("speakeasy");

let smartApi;
let sessionActive = false;
let authTokens = {};

async function initAngelSession() {
  if (sessionActive) return authTokens;

  smartApi = new SmartAPI({
    api_key: process.env.ANGEL_API_KEY
  });

  const otp = speakeasy.totp({
    secret: process.env.ANGEL_TOTP_SECRET,
    encoding: "base32"
  });

  const session = await smartApi.generateSession(
    process.env.ANGEL_CLIENT_CODE,
    process.env.ANGEL_MPIN,
    otp
  );

  if (!session || session.status !== true) {
    throw new Error(session?.message || "Angel login failed");
  }

  authTokens = {
    jwtToken: session.data.jwtToken,
    feedToken: session.data.feedToken
  };

  sessionActive = true;
  return authTokens;
}

module.exports = { initAngelSession };