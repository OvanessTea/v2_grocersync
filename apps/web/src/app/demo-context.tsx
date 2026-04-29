import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { demoItems, demoMembers, demoRoom } from "./mock-data";
import type { GroceryItem, Member, MemberRole, Room, SessionState } from "./types";

interface DemoContextValue {
  theme: "light" | "dark";
  session: SessionState;
  role: MemberRole;
  room: Room;
  items: GroceryItem[];
  members: Member[];
  setTheme: (theme: "light" | "dark") => void;
  setSession: (session: SessionState) => void;
  setRole: (role: MemberRole) => void;
  addItem: (payload: Pick<GroceryItem, "name" | "quantity">) => void;
  updateItem: (itemId: string, payload: Pick<GroceryItem, "name" | "quantity">) => void;
  toggleItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  transferOwnership: (memberId: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [session, setSession] = useState<SessionState>("verified");
  const [role, setRole] = useState<MemberRole>("owner");
  const [items, setItems] = useState<GroceryItem[]>(demoItems);
  const [members, setMembers] = useState<Member[]>(demoMembers);
  const [room, setRoom] = useState<Room>(demoRoom);

  const value = useMemo<DemoContextValue>(
    () => ({
      theme,
      session,
      role,
      room,
      items,
      members,
      setTheme,
      setSession,
      setRole,
      addItem: ({ name, quantity }) => {
        setItems((current) => [
          {
            id: crypto.randomUUID(),
            name,
            quantity,
            isChecked: false,
            updatedBy: "You",
          },
          ...current,
        ]);
      },
      updateItem: (itemId, payload) => {
        setItems((current) =>
          current.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  ...payload,
                  updatedBy: "You",
                }
              : item,
          ),
        );
      },
      toggleItem: (itemId) => {
        setItems((current) =>
          current.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  isChecked: !item.isChecked,
                }
              : item,
          ),
        );
      },
      deleteItem: (itemId) => {
        setItems((current) => current.filter((item) => item.id !== itemId));
      },
      transferOwnership: (memberId) => {
        setMembers((current) =>
          current.map((member) => {
            if (member.id === memberId) {
              return { ...member, role: "owner" };
            }

            return member.role === "owner" ? { ...member, role: "member" } : member;
          }),
        );

        const nextOwner = members.find((member) => member.id === memberId);
        if (nextOwner) {
          setRole(memberId === "member-1" ? "owner" : "member");
          setRoom((current) => ({ ...current, ownerName: nextOwner.name }));
        }
      },
    }),
    [items, members, role, room, session, theme],
  );

  return (
    <DemoContext.Provider value={value}>
      <div className="app-theme" data-theme={theme}>
        {children}
      </div>
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }

  return context;
}
