import { Link } from "react-router-dom";
import { Button, Card, Field, Input, SectionHeading } from "../../components/ui";
import { useDemo } from "../../app/demo-context";

export function AuthScreen({ mode }: { mode: "signup" | "login" }) {
  const { session } = useDemo();
  const isSignup = mode === "signup";
 // TODO: Add option to check password toggler
  return (
    <div className="screen screen--auth">
      <Card className="hero-card">
        <SectionHeading
          eyebrow="Family-first auth"
          title={isSignup ? "Create your shared grocery room" : "Welcome back to your household list"}
          description={
            isSignup
              ? "Warm, calm onboarding with strong validation, clear verification, and no extra noise."
              : "Low-friction login for rooms, invites, and shopping flows that need to feel dependable."
          }
        />

        <form className="stack-lg">
          <Field label="Email">
            <Input placeholder="family@example.com" type="email" />
          </Field>

          <Field label="Password" hint="Use at least 8 characters when real auth is wired in.">
            <Input placeholder="Enter your password" type="password" />
          </Field>

          {isSignup ? (
            <Field label="Confirm password">
              <Input placeholder="Repeat your password" type="password" />
            </Field>
          ) : null}

          <div className="status-row">
            <span className="status-row__pill">Validation states</span>
            <span className="status-row__text">
              {session === "anonymous"
                ? "Ready for signup and login CTA states."
                : "Try switching the session state from the left panel."}
            </span>
          </div>

          <Button fullWidth type="button">
            {isSignup ? "Create account" : "Log in"}
          </Button>

          <Button fullWidth type="button" variant="secondary">
            {isSignup ? "Loading state preview" : "Restore session preview"}
          </Button>
        </form>

        <div className="inline-links">
          <span>{isSignup ? "Already have an account?" : "Need an account?"}</span>
          <Link to={isSignup ? "/auth/login" : "/auth/signup"}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </div>
      </Card>

      <Card>
        <SectionHeading
          eyebrow="Entry states"
          title="Session UX stays explicit"
          description="Anonymous, pending verification, verified, and expired experiences should feel like one product system."
        />

        <ul className="feature-list">
          <li>HTTP-only session restore gets a dedicated pending state.</li>
          <li>Email verification is visible in both auth and invite journeys.</li>
          <li>Errors are inline-first, with room for toast feedback later.</li>
        </ul>
      </Card>
    </div>
  );
}
