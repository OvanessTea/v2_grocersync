import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { AuthScreen } from "../features/auth/AuthScreen";
import { VerificationPendingScreen } from "../features/auth/VerificationPendingScreen";
import { InvitePreviewScreen } from "../features/invite/InvitePreviewScreen";
import { MembersScreen } from "../features/room/MembersScreen";
import { RoomScreen } from "../features/room/RoomScreen";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route element={<Navigate replace to="/auth/signup" />} path="/" />
        <Route element={<AuthScreen mode="signup" />} path="/auth/signup" />
        <Route element={<AuthScreen mode="login" />} path="/auth/login" />
        <Route element={<VerificationPendingScreen />} path="/auth/verify" />
        <Route element={<InvitePreviewScreen />} path="/invite/:token" />
        <Route element={<RoomScreen />} path="/room/:roomId" />
        <Route element={<MembersScreen />} path="/room/:roomId/members" />
      </Routes>
    </AppShell>
  );
}
