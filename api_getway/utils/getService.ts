import axios from "axios";

interface apiResult {
  name: string;
  version: string;
  port: string;
  ip: string;
  createdAt: number;
}

async function getService(name: string) {
  const result = await axios.get(`http://localhost:5000/register/${name}`);
  return result.data as apiResult;
}

export default getService;
