import axios from "axios";
import speakeasy from "speakeasy";

let jwtToken = "";

export async function loginAngel() {
  try {
    const totp = speakeasy.totp({
      secret: process.env.ANGEL_TOTP_SECRET,
      encoding: "base32"
    });

    const response = await axios.post(
      "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        clientcode: process.env.ANGEL_CLIENT_CODE,
        password: process.env.ANGEL_PASSWORD,
        totp
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "127.0.0.1",
          "X-ClientPublicIP": "127.0.0.1",
          "X-MACAddress": "00:00:00:00:00:00",
          "X-PrivateKey": process.env.ANGEL_API_KEY
        },
        timeout: 15000
      }
    );

    if (response.data?.status !== true) {
      throw new Error(response.data?.message || "Angel login failed");
    }

    jwtToken = response.data.data.jwtToken;
    console.log("✅ Angel Login Successful");

  } catch (err) {
    console.error("❌ Angel Login Error:", err.message);
    throw err;
  }
}

export function angelHeaders() {
  if (!jwtToken) {
    throw new Error("JWT not initialized");
  }

  return {
    "Authorization": `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-PrivateKey": process.env.ANGEL_API_KEY
  };
}
