import { z } from "zod";

export const inviteTokenSchema = z.string().min(20).max(200);

export const inviteParamsSchema = z.object({
  token: inviteTokenSchema,
});

export type InviteParams = z.infer<typeof inviteParamsSchema>;

export const inviteStateSchema = z.enum(["active", "expired", "revoked"]);

export const invitePreviewDtoSchema = z.object({
  roomId: z.string().min(1),
  roomName: z.string().min(1),
  ownerName: z.string().min(1),
  memberCount: z.number().int().nonnegative(),
  inviteState: inviteStateSchema,
  expiresAt: z.string().datetime().nullable(),
});

export type InvitePreviewDto = z.infer<typeof invitePreviewDtoSchema>;

export const createInviteResponseDtoSchema = z.object({
  roomId: z.string().min(1),
  token: inviteTokenSchema,
  inviteUrl: z.string().url(),
  expiresAt: z.string().datetime().nullable(),
});

export type CreateInviteResponseDto = z.infer<
  typeof createInviteResponseDtoSchema
>;

export const joinInviteResultSchema = z.enum(["joined", "already_member"]);

export const joinInviteResponseDtoSchema = z.object({
  roomId: z.string().min(1),
  result: joinInviteResultSchema,
});

export type JoinInviteResponseDto = z.infer<
  typeof joinInviteResponseDtoSchema
>;
