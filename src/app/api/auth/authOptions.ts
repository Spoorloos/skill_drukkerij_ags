import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { compare } from "bcrypt";
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
                    return null; // Malformed input
                }

                // Get user from database
                const { data: user, error } = await supabase
                    .from("user")
                    .select()
                    .eq("email", input.email)
                    .limit(1)
                    .single();

                if (error || !user) {
                    return null; // Account doesn't exist
                }

                // Check password and return user
                const matches = await compare(input.password, user.password);
                if (!matches) {
                    return null; // Password is incorrect
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                }
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