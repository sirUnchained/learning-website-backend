async function getTrackId(amount: number) {
  const res = await fetch("https://gateway.zibal.ir/v1/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
