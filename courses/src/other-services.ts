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
  const result = await response.json();
  if (!result.result) {
    return false;
  }

  return result.result as apiResult[];
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

  let response = null;
  if (method === "GET") {
    response = await fetch(
      `http://${apiData[apiData.length - 1].ip}:${
        apiData[apiData.length - 1].port
      }/${route}`,
      {
        headers: {
          ...header,
        },
      }
    );
    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result;
  }

  response = await fetch(
    `http://${apiData[apiData.length - 1].ip}:${
      apiData[apiData.length - 1].port
    }/${route}`,
    {
      method,
      headers: {
        "content-type": "application/json",
        ...header,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return result;
}

export default callService;
