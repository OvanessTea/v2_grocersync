import { NavLink } from "react-router-dom";
import { useDemo } from "./demo-context";
import { Badge } from "../components/ui";

const links = [
  { to: "/auth/signup", label: "Sign up" },
  { to: "/auth/login", label: "Log in" },
  { to: "/auth/verify", label: "Verify" },
  { to: "/invite/family-supper-v1", label: "Invite" },
  { to: "/room/room-family-1", label: "Room" },
  { to: "/room/room-family-1/members", label: "Members" },
];

export function AppShell({ children }: React.PropsWithChildren) {
  const { session, role, theme, setRole, setSession, setTheme } = useDemo();

  return (
    <div className="shell">
      <aside className="shell__panel">
        <div className="brand">
          <div className="brand__mark">GS</div>
          <div>
            <p>GrocerSync v1</p>
            <span>cozy scaffold from Figma Make</span>
          </div>
        </div>

        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="control-group">
          <p className="control-group__title">Session state</p>
          <div className="segmented">
            {(["anonymous", "pending_verification", "verified"] as const).map((option) => (
              <button
                key={option}
                className={session === option ? "segmented__item segmented__item--active" : "segmented__item"}
                onClick={() => setSession(option)}
                type="button"
              >
                {option.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <p className="control-group__title">Room role</p>
          <div className="segmented">
            {(["owner", "member"] as const).map((option) => (
              <button
                key={option}
                className={role === option ? "segmented__item segmented__item--active" : "segmented__item"}
                onClick={() => setRole(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <p className="control-group__title">Theme</p>
          <div className="segmented">
            {(["light", "dark"] as const).map((option) => (
              <button
                key={option}
                className={theme === option ? "segmented__item segmented__item--active" : "segmented__item"}
                onClick={() => setTheme(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-note">
          <Badge tone="accent">v1</Badge>
          <p>UI-only scaffold. Backend contracts can plug into these screens later.</p>
        </div>
      </aside>

      <main className="shell__content">{children}</main>
    </div>
  );
}
