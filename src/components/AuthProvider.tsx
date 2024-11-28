"use client";

import { SessionProvider } from "next-auth/react";

type AuthProvider = Readonly<{
    children: React.ReactNode;
}>;

export default function AuthProvider({ children }: AuthProvider) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}