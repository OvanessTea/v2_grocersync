import express from "express";
import config from "./config/config";
import { getInvitePreview, joinInvite } from "./controllers/inviteController";
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

app.listen(config.port, () => {
  console.log(
    `GrocerSync API listening on port ${config.port} in ${config.nodeEnv} mode`,
  );
});
