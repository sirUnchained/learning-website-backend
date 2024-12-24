import axios from "axios";

interface apiResult {
  name: string;
  version: string;
  port: string;
  ip: string;
  createdAt: number;
}

async function getService(name: string) {
  const result = (await axios.get(`http://localhost:5000/register/${name}/*`))
    .data as apiResult[];
  if (!result.length) {
    throw new Error("server is not currently on.");
  }
  return result;
}

export default getService;
