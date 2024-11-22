import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { verify } from "argon2";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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
                const { data, error } = await supabase
                    .from("user")
                    .select()
                    .eq("email", input.email);

                if (error) {
                    return null;
                }

                // Check password and return user
                const user = data[0];
                try {
                    if (await verify(user.password, input.password)) {
                        return user;
                    }
                    return null;
                } catch {
                    return null;
                }
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
    },
}
