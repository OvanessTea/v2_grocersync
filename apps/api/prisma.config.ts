import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config();

const defaultDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/grocersync?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || defaultDatabaseUrl,
  },
});
