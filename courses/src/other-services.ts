interface apiResult {
  name: string;
  version: string;
  port: string;
  ip: string;
  createdAt: number;
}

async function checkService(name: string, version: string) {
  const response = await fetch(
    `http://localhost:5000/register/${name}/${version}`,
    {
      method: "GET",
    }
  );
  const result = response.ok && (await response.json());

  return result as apiResult[];
}

async function callService(
  name: string,
  version: string,
  method: string,
  route: string,
  body: any,
  header?: any
) {
  const apiData = await checkService(name, version);
  if (!apiData || !apiData.length) {
    return false;
  }

  const lastestApiVersoin = apiData[apiData.length - 1];
  const response = await fetch(
    `http://${lastestApiVersoin.ip}:${lastestApiVersoin.port}/${route}`,
    {
      method,
      headers: {
        "content-type": "application/json",
        ...header,
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    }
  );
  console.log(apiData, response);

  const result = response.ok && (await response.json());
  return result;
}

export default callService;
