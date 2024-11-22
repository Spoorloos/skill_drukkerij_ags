"use client";

import { SessionProvider } from "next-auth/react";

type Provider = Readonly<{
    children: React.ReactNode;
}>;

export default function Provider({ children }: Provider) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}