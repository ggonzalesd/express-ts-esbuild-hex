import { UserRoles } from '@@core/entities';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8)
  .max(255)
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character',
  );

const usernameSchema = z
  .string()
  .min(4)
  .max(255)
  .regex(
    /^[a-z0-9_-]+$/,
    'Username must contain only lowercase letters, numbers, underscores and dashes',
  );

const emailSchema = z.string().email().min(4).max(255).trim().toLowerCase();

export const authLoginPayloadSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(UserRoles),
});

export const authLoginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const authRegisterRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    display: z.string().min(4).max(255).optional(),
  })
  .transform((data) => ({
    ...data,
    display: data.display || data.username,
  }));

export const bearerTokenSchema = z.object({
  authorization: z
    .string()
    .regex(/^Bearer [a-zA-Z0-9-_.]+$/, 'Bearer token required'),
});
