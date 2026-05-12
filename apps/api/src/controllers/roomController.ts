import { Response } from "express";
import crypto from "node:crypto";
import config from "../config/config";
import { invites } from "../models/invite";
import { rooms } from "../models/room";
import { AuthenticatedRequest } from "../types/auth";

function sendError(
  res: Response,
  status: number,
  code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND",
  message: string,
) {
  return res.status(status).json({
    error: {
      code,
      message,
      requestId: "mock-request-id",
    },
  });
}

export function createRoomInvite(req: AuthenticatedRequest, res: Response) {
  const roomId = req.params.roomId;
  const userId = req.user?.id ?? null;

  if (!userId) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication is required");
  }

  const room = rooms.find((entry) => entry.id === roomId);

  if (!room) {
    return sendError(res, 404, "NOT_FOUND", "Room not found");
  }

  if (room.ownerId !== userId) {
    return sendError(
      res,
      403,
      "FORBIDDEN",
      "Only the room owner can create invite links",
    );
  }

  const activeInvite = invites.find(
    (entry) =>
      entry.roomId === room.id &&
      !entry.revokedAt &&
      (!entry.expiresAt || new Date(entry.expiresAt).getTime() > Date.now()),
  );

  if (activeInvite) {
    room.inviteToken = activeInvite.token;

    return res.json({
      roomId: room.id,
      token: activeInvite.token,
      inviteUrl: `${config.appBaseUrl}/invites/${activeInvite.token}`,
      expiresAt: activeInvite.expiresAt,
    });
  }

  const token = crypto.randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  invites.push({
    id: crypto.randomUUID(),
    roomId: room.id,
    token,
    createdByUserId: userId,
    createdAt: new Date().toISOString(),
    expiresAt,
    revokedAt: null,
  });

  room.inviteToken = token;

  return res.status(201).json({
    roomId: room.id,
    token,
    inviteUrl: `${config.appBaseUrl}/invites/${token}`,
    expiresAt,
  });
}

