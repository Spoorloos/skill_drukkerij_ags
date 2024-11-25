import { z } from "zod";

export const appointmentSchema = z.object({
    subject: z.string().max(50),
    description: z.string().max(1000),
    date: z.string().date(),
    time: z.string().time(),
    user: z.number().nonnegative(),
});

export const loginSchema = z.object({
    email: z.string().email().max(75),
    password: z.string().max(50),
});

export const signupSchema = loginSchema.extend({
    name: z.string().max(50).min(0),
});