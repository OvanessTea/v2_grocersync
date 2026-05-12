export type InviteState = "active" | "expired" | "revoked";

export interface RoomInvite {
  id: string;
  roomId: string;
  token: string;
  createdByUserId: string;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

export const invites: RoomInvite[] = [];
