import { RoomMembershipRole } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";
import { hashInviteToken } from "../utils/inviteToken";

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

function getSingleRouteParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

function getInviteState(invite: {
  revokedAt: Date | null;
  expiresAt: Date | null;
}): "active" | "expired" | "revoked" {
  if (invite.revokedAt) {
    return "revoked";
  }

  if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) {
    return "expired";
  }

  return "active";
}

export async function getInvitePreview(req: Request, res: Response) {
  const token = getSingleRouteParam(req.params.token);

  if (!token) {
    return sendError(res, 404, "INVITE_INVALID", "Invite token is invalid");
  }

  const invite = await prisma.roomInvite.findUnique({
    where: {
      tokenHash: hashInviteToken(token),
    },
    include: {
      room: {
        include: {
          owner: {
            select: {
              displayName: true,
            },
          },
          _count: {
            select: {
              memberships: true,
            },
          },
        },
      },
    },
  });

  if (!invite) {
    return sendError(res, 404, "INVITE_INVALID", "Invite token is invalid");
  }

  return res.json({
    roomId: invite.room.id,
    roomName: invite.room.name,
    ownerName: invite.room.owner.displayName,
    memberCount: invite.room._count.memberships,
    inviteState: getInviteState(invite),
    expiresAt: invite.expiresAt?.toISOString() ?? null,
  });
}

export async function joinInvite(req: AuthenticatedRequest, res: Response) {
  const token = getSingleRouteParam(req.params.token);

  if (!token) {
    return sendError(res, 404, "INVITE_INVALID", "Invite token is invalid");
  }

  const invite = await prisma.roomInvite.findUnique({
    where: {
      tokenHash: hashInviteToken(token),
    },
    include: {
      room: {
        select: {
          id: true,
        },
      },
    },
  });

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

  const userId = req.user?.id ?? null;

  if (!userId) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    return sendError(res, 401, "UNAUTHORIZED", "Authenticated user was not found");
  }

  if (!user.isEmailVerified) {
    return sendError(
      res,
      403,
      "EMAIL_NOT_VERIFIED",
      "Email verification is required before joining a room",
    );
  }

  const existingMembership = await prisma.roomMembership.findUnique({
    where: {
      roomId_userId: {
        roomId: invite.room.id,
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingMembership) {
    return res.json({
      roomId: invite.room.id,
      result: "already_member",
    });
  }

  await prisma.roomMembership.create({
    data: {
      roomId: invite.room.id,
      userId,
      role: RoomMembershipRole.MEMBER,
    },
  });

  return res.json({
    roomId: invite.room.id,
    result: "joined",
  });
}
