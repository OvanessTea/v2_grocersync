import crypto from "node:crypto";

export function createInviteToken() {
  return crypto.randomBytes(24).toString("base64url");
}

export function hashInviteToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getInviteExpiryDate(days = 7) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
