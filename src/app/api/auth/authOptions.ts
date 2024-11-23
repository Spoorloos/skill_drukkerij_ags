import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { verify } from "argon2";
import { type Database } from "@/../database";
import { type NextAuthOptions } from "next-auth";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const authSchema = z.object({
    email: z.string().email().max(75),
    password: z.string().max(50),
});

export default {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Validate user input with zod
                const { data: input, success } = authSchema.safeParse({
                    email: credentials?.email,
                    password: credentials?.password
                });

                if (!success) {
                    return null;
                }

                // Get user from database
                const { data: users, error } = await supabase
                    .from("user")
                    .select()
                    .eq("email", input.email);

                if (error) {
                    return null;
                }

                // Check password and return user
                const user = users.find(async (user) => {
                    return await verify(user.password, input.password);
                });

                if (user) {
                    const { password: _, ...ret } = user;
                    return ret;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }: any) => {
            if (session && token) {
                session.user = token.user;
            }
            return session;
        },
        jwt: async ({ token, user })  => {
            if (token && user) {
                token.user = user;
            }
            return token;
        },
    },
    pages: {
        signIn: "/inloggen"
    },
} satisfies NextAuthOptions;