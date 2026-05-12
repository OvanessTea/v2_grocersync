import { Response } from "express";
import config from "../config/config";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";
import {
  createInviteToken,
  getInviteExpiryDate,
  hashInviteToken,
} from "../utils/inviteToken";

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

function getSingleRouteParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

export async function createRoomInvite(
  req: AuthenticatedRequest,
  res: Response,
) {
  const roomId = getSingleRouteParam(req.params.roomId);
  const userId = req.user?.id ?? null;

  if (!roomId) {
    return sendError(res, 404, "NOT_FOUND", "Room not found");
  }

  if (!userId) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication is required");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      ownerId: true,
    },
  });

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

  const activeInvite = await prisma.roomInvite.findFirst({
    where: {
      roomId: room.id,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (activeInvite) {
    await prisma.roomInvite.update({
      where: {
        id: activeInvite.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  const token = createInviteToken();
  const expiresAt = getInviteExpiryDate();

  await prisma.roomInvite.create({
    data: {
      roomId: room.id,
      tokenHash: hashInviteToken(token),
      createdByUserId: userId,
      expiresAt,
    },
  });

  return res.status(201).json({
    roomId: room.id,
    token,
    inviteUrl: `${config.appBaseUrl}/invites/${token}`,
    expiresAt: expiresAt.toISOString(),
  });
}
