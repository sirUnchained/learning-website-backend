import configs from "../config_env";

type trackIdResult = {
  message: String;
  result: Number;
  trackId: Number;
};

async function getTrackId(amount: number): Promise<trackIdResult> {
  const data = {
    merchant: configs.zibal.merchant,
    amount,
    callbackUrl: configs.zibal.cb,
  };

  const response = await fetch("https://gateway.zibal.ir/v1/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as trackIdResult;
  return result;
}
