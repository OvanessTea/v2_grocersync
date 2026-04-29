import type { GroceryItem, Member, Room } from "./types";

export const demoRoom: Room = {
  id: "room-family-1",
  name: "Sunday Supper",
  ownerName: "Nina Solovyova",
  memberCount: 4,
  inviteToken: "family-supper-v1",
};

export const demoMembers: Member[] = [
  {
    id: "member-1",
    name: "Nina Solovyova",
    email: "nina@grocersync.dev",
    role: "owner",
    status: "active",
  },
  {
    id: "member-2",
    name: "Maks Solovyov",
    email: "maks@grocersync.dev",
    role: "member",
    status: "active",
  },
  {
    id: "member-3",
    name: "Lena Solovyova",
    email: "lena@grocersync.dev",
    role: "member",
    status: "active",
  },
  {
    id: "member-4",
    name: "Aunt Vera",
    email: "vera@grocersync.dev",
    role: "member",
    status: "invited",
  },
];

export const demoItems: GroceryItem[] = [
  {
    id: "item-1",
    name: "Tomatoes",
    quantity: "4 pcs",
    isChecked: false,
    updatedBy: "Nina",
  },
  {
    id: "item-2",
    name: "Milk",
    quantity: "2 bottles",
    isChecked: false,
    updatedBy: "Maks",
  },
  {
    id: "item-3",
    name: "Olive oil",
    quantity: "1 bottle",
    isChecked: true,
    updatedBy: "Lena",
  },
];
