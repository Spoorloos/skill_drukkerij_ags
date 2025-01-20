import { z } from "zod";

export const appointmentSchema = z.object({
    description: z.string().min(1).max(1000),
    date: z.string().date(),
    time: z.string().time(),
    user: z.number().nonnegative(),
    quantity: z.coerce.number().nonnegative().max(10000),
    doublesided: z.coerce.boolean(),
    size: z.enum(["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]),
});

export const loginSchema = z.object({
    email: z.string().email().min(5).max(75),
    password: z.string().min(8).max(50),
});

export const signupSchema = loginSchema.extend({
    name: z.string().min(5).max(50),
});

export const userDataSchema = z.object({
    name: z.string().min(5).max(50),
    email: z.string().email().min(5).max(75),
    password: z.string().min(8).max(50).optional(),
    role: z.enum([ "Admin", "Gebruiker" ]),
})
export const CaptchaResponse = z.object({
    success: z.boolean(),
    challenge_ts: z.string(),
    hostname: z.string(),
    score: z.number(),
    action: z.string().optional()
});
