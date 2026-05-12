import { PrismaClient } from "@prisma/client";

declare global {
  var __grocerSyncPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__grocerSyncPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__grocerSyncPrisma__ = prisma;
}
