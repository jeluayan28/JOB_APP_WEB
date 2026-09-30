import { z } from "zod";

export const PASSWORD_RULES = [
  { label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "A symbol (e.g. ! ? # $)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254);

export const passwordSchema = z
  .string()
  .max(128, "Password must be 128 characters or fewer.")
  .refine(
    (p) => PASSWORD_RULES.every((r) => r.test(p)),
    "Password must be at least 10 characters and include upper and lower case letters, a number and a symbol."
  );

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const jobSchema = z.object({
  position: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  stage: z.enum(["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]).default("APPLIED"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  interviewDate: z.string().trim().max(50).optional(),
  jobLink: z.string().trim().max(2000).optional(),
  location: z.string().trim().max(200).optional(),
  salary: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(5000).optional(),
});
