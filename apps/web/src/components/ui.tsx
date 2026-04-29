import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "primary", fullWidth = false, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`button button--${variant}${fullWidth ? " button--full" : ""} ${className}`.trim()}
      {...props}
    />
  );
});

export function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function Badge({
  children,
  tone = "neutral",
}: React.PropsWithChildren<{ tone?: "neutral" | "accent" | "success" | "warning" }>) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Field({
  label,
  hint,
  children,
}: React.PropsWithChildren<{ label: string; hint?: string }>) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return <input ref={ref} className={`input ${className}`.trim()} {...props} />;
  },
);

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading">
      {eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
