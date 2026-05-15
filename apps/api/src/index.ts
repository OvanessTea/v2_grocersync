import express from "express";
import config from "./config/config";
import { getInvitePreview, joinInvite } from "./controllers/inviteController";
import { disconnectPrisma } from "./lib/prisma";
import { createRoomInvite } from "./controllers/roomController";
import auth from "./middleware/auth";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
  });
});

app.get("/", (_req, res) => {
  res.json({
    name: "GrocerSync API",
    env: config.nodeEnv,
  });
});

app.get("/invites/:token", getInvitePreview);
app.post("/invites/:token/join", auth, joinInvite);
app.post("/rooms/:roomId/invites", auth, createRoomInvite);

const server = app.listen(config.port, () => {
  console.log(
    `GrocerSync API listening on port ${config.port} in ${config.nodeEnv} mode`,
  );
});

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down GrocerSync API...`);

  server.close(async (serverError) => {
    try {
      await disconnectPrisma();

      if (serverError) {
        console.error("HTTP server closed with error during shutdown", serverError);
        process.exit(1);
      }

      console.log("GrocerSync API shutdown complete");
      process.exit(0);
    } catch (shutdownError) {
      console.error("Failed to close resources during shutdown", shutdownError);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
