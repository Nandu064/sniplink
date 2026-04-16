import { z } from "zod";
import { MIN_SLUG_LENGTH, MAX_SLUG_LENGTH } from "./constants";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL").refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must start with http:// or https://" }
  ),
  slug: z
    .string()
    .min(MIN_SLUG_LENGTH, `Slug must be at least ${MIN_SLUG_LENGTH} characters`)
    .max(MAX_SLUG_LENGTH, `Slug must be at most ${MAX_SLUG_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  title: z.string().max(200, "Title must be at most 200 characters").optional(),
  expiresAt: z.string().datetime().optional(),
  password: z.string().min(4, "Password must be at least 4 characters").max(100).optional(),
});

export const updateLinkSchema = z.object({
  title: z.string().max(200).optional(),
  slug: z
    .string()
    .min(MIN_SLUG_LENGTH)
    .max(MAX_SLUG_LENGTH)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  originalUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
