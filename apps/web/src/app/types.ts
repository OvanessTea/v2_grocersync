export type SessionState = "anonymous" | "pending_verification" | "verified";
export type MemberRole = "owner" | "member";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "active" | "invited";
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  isChecked: boolean;
  updatedBy: string;
}

export interface Room {
  id: string;
  name: string;
  ownerName: string;
  memberCount: number;
  inviteToken: string;
}
