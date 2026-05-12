import { Request, Response } from "express";
import { invites, RoomInvite } from "../models/invite";
import { memberships } from "../models/membership";
import { rooms } from "../models/room";
import { AuthenticatedRequest } from "../types/auth";

function sendError(
  res: Response,
  status: number,
  code:
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "INVITE_INVALID"
    | "INVITE_EXPIRED"
    | "INVITE_REVOKED"
    | "EMAIL_NOT_VERIFIED",
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

function getInviteState(invite: RoomInvite): "active" | "expired" | "revoked" {
  if (invite.revokedAt) {
    return "revoked";
  }

  if (invite.expiresAt && new Date(invite.expiresAt).getTime() <= Date.now()) {
    return "expired";
  }

  return "active";
}

export function getInvitePreview(req: Request, res: Response) {
  const invite = invites.find((entry) => entry.token === req.params.token);

  if (!invite) {
    return sendError(res, 404, "INVITE_INVALID", "Invite token is invalid");
  }

  const room = rooms.find((entry) => entry.id === invite.roomId);

  if (!room) {
    return sendError(res, 404, "NOT_FOUND", "Room not found for invite");
  }

  return res.json({
    roomId: room.id,
    roomName: room.name,
    ownerName: room.ownerName,
    memberCount: room.memberCount,
    inviteState: getInviteState(invite),
    expiresAt: invite.expiresAt,
  });
}

export function joinInvite(req: AuthenticatedRequest, res: Response) {
  const invite = invites.find((entry) => entry.token === req.params.token);

  if (!invite) {
    return sendError(res, 404, "INVITE_INVALID", "Invite token is invalid");
  }

  const inviteState = getInviteState(invite);

  if (inviteState === "expired") {
    return sendError(res, 410, "INVITE_EXPIRED", "Invite has expired");
  }

  if (inviteState === "revoked") {
    return sendError(res, 410, "INVITE_REVOKED", "Invite has been revoked");
  }

  const room = rooms.find((entry) => entry.id === invite.roomId);

  if (!room) {
    return sendError(res, 404, "NOT_FOUND", "Room not found for invite");
  }

  const userId = req.user?.id ?? null;

  if (!userId) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication is required");
  }

  const existingMembership = memberships.find(
    (entry) => entry.roomId === room.id && entry.userId === userId,
  );

  if (existingMembership) {
    return res.json({
      roomId: room.id,
      result: "already_member",
    });
  }

  memberships.push({
    id: crypto.randomUUID(),
    roomId: room.id,
    userId,
    role: "member",
    createdAt: new Date().toISOString(),
  });

  room.memberCount += 1;

  return res.json({
    roomId: room.id,
    result: "joined",
  });
}
