import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const authSchema = z.object({
    email: z.string().email().max(75),
    password: z.string().max(50),
});

export const authOptions = {
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
                const { data, error } = await supabase
                    .from("user")
                    .select()
                    .eq("email", input.email)
                    .eq("password", input.password);

                return error ? null : data[0];
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }: any) => {
            if (session?.user && token) {
                session.user = token.user;
            }
            return session;
        },
        jwt: async ({ token, user }: any)  => {
            if (token && user) {
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                }
            }
            return token;
        },
    },
    pages: {
        signIn: "/inloggen"
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };