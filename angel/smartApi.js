import axios from "axios";

let jwtToken = "";

export async function loginAngel() {
  const response = await axios.post(
    "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByMPIN",
    {
      clientcode: process.env.ANGEL_CLIENT_CODE,
      mpin: process.env.ANGEL_MPIN
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",

        // 🔑 Mandatory Angel headers
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-PrivateKey": process.env.ANGEL_API_KEY,

        // 🔑 WAF-bypass headers (CRITICAL)
        "X-ClientLocalIP": "127.0.0.1",
        "X-ClientPublicIP": "127.0.0.1",
        "X-MACAddress": "00:00:00:00:00:00",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": "https://trade.angelone.in/",
        "Origin": "https://trade.angelone.in"
      },
      validateStatus: () => true
    }
  );

  console.log("🔐 Angel MPIN login raw:", response.status);
  console.log("🔐 Angel MPIN login body:", JSON.stringify(response.data, null, 2));

  jwtToken =
    response.data?.data?.jwtToken ||
    response.data?.data?.token ||
    response.data?.data?.jwt ||
    null;

  if (!jwtToken) {
    throw new Error("MPIN login failed: JWT not found (WAF likely)");
  }

  console.log("✅ Angel MPIN Login Successful");
}

export function angelHeaders() {
  return {
    "Authorization": `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-PrivateKey": process.env.ANGEL_API_KEY
  };
}
