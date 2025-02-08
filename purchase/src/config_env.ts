import * as dotenv from "dotenv";

dotenv.config();

const configs = {
  mongoUri: process.env.MONGO_URI as string,
  zibal: {
    merchant: process.env.MERCHANT as string,
    cb: process.env.CALLBACK_URL as string,
  },
};

export default configs;
