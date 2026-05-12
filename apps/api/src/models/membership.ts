export type MembershipRole = "owner" | "member";

export interface RoomMembership {
  id: string;
  roomId: string;
  userId: string;
  role: MembershipRole;
  createdAt: string;
}

export const memberships: RoomMembership[] = [];
