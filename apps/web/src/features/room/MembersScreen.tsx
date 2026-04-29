import { useDemo } from "../../app/demo-context";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";

export function MembersScreen() {
  const { members, role, transferOwnership } = useDemo();

  return (
    <div className="screen">
      <Card className="hero-card">
        <SectionHeading
          eyebrow="Membership"
          title="People in this room"
          description="Owner and member permissions stay explicit so the UI matches the future HTTP contract."
        />

        <div className="stack-md">
          {members.map((member) => (
            <article key={member.id} className="member-row">
              <div className="member-row__identity">
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>

              <div className="member-row__meta">
                <Badge tone={member.role === "owner" ? "accent" : "neutral"}>{member.role}</Badge>
                <Badge tone={member.status === "active" ? "success" : "warning"}>{member.status}</Badge>
                {role === "owner" && member.role !== "owner" ? (
                  <Button onClick={() => transferOwnership(member.id)} type="button" variant="secondary">
                    Transfer ownership
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Card>

      <div className="room-grid">
        <Card>
          <SectionHeading
            eyebrow="Leave restrictions"
            title="Owners cannot leave by accident"
            description="The product should block owner leave until ownership is transferred or the room is deleted."
          />
          <div className="stack-sm">
            <Button fullWidth type="button" variant={role === "owner" ? "ghost" : "secondary"}>
              {role === "owner" ? "Leave disabled for owners" : "Leave room"}
            </Button>
            <Button fullWidth type="button" variant={role === "owner" ? "danger" : "ghost"}>
              {role === "owner" ? "Delete room" : "Delete blocked for members"}
            </Button>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Why this matters"
            title="Permission states are part of v1 UX"
            description="These screens are intentionally functional before we add transport, persistence, or realtime."
          />
        </Card>
      </div>
    </div>
  );
}
