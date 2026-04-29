import { Button, Card, SectionHeading } from "../../components/ui";

export function VerificationPendingScreen() {
  return (
    <div className="screen screen--single">
      <Card className="hero-card">
        <SectionHeading
          eyebrow="Verification required"
          title="Check your inbox before joining the room"
          description="Unverified users can exist, but they are not treated as fully active in the product."
        />

        <div className="verification-box">
          <p>
            We sent a verification link to <strong>family@example.com</strong>. Once confirmed, session
            state can move from <code>pending_verification</code> to <code>verified</code>.
          </p>

          <div className="stack-sm">
            <Button fullWidth type="button">
              I verified my email
            </Button>
            <Button fullWidth type="button" variant="secondary">
              Resend verification
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
