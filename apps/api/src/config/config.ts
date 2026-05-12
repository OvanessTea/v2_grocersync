
import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  appBaseUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5173",
};

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export default config;
