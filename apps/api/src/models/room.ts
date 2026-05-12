export interface Room {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  inviteToken: string;
}

export const rooms: Room[] = [];
