import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { verify } from "argon2";
import { type Database } from "@/../database";
import { type NextAuthOptions } from "next-auth";
import { loginSchema } from "@/lib/schemas";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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
                const { data: input, success } = loginSchema.safeParse({
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