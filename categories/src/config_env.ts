import * as dotenv from "dotenv";

dotenv.config();

const configs = {
  mongoUri: process.env.MONGO_URI as string,
};

export default configs;
