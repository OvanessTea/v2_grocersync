import { Link } from "react-router-dom";
import { useDemo } from "../../app/demo-context";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";

export function InvitePreviewScreen() {
  const { room, session } = useDemo();

  const ctaText =
    session === "verified"
      ? "Join room"
      : session === "pending_verification"
        ? "Verify email to join"
        : "Sign up or log in";

  return (
    <div className="screen">
      <Card className="hero-card">
        <SectionHeading
          eyebrow="Invite preview"
          title={`You were invited to ${room.name}`}
          description="Invite flow stays auth-first: preview the room, authenticate, verify if needed, then join with a stable token path."
        />

        <div className="invite-grid">
          <div className="invite-grid__primary">
            <div className="stack-sm">
              <Badge tone="accent">Owner: {room.ownerName}</Badge>
              <Badge tone="neutral">Members: {room.memberCount}</Badge>
            </div>

            <p className="muted-copy">
              Room members share one reliable grocery list. Owners manage ownership and deletion, while
              members can update list items and leave the room.
            </p>

            <div className="stack-sm">
              <Button fullWidth type="button">
                {ctaText}
              </Button>
              {session !== "verified" ? (
                <Button fullWidth type="button" variant="secondary">
                  View blocked state
                </Button>
              ) : null}
            </div>
          </div>

          <div className="invite-grid__secondary">
            <p className="info-title">What happens next</p>
            <ul className="feature-list">
              <li>`GET /invites/:token` loads this preview safely.</li>
              <li>`POST /invites/:token/join` is the canonical join step.</li>
              <li>Expired or invalid tokens need a full-page error state.</li>
            </ul>
            <Link className="text-link" to="/auth/verify">
              Open verification guidance
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
