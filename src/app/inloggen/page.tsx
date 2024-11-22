"use client";

import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Inloggen() {
    const [error, formAction, isPending] = useActionState(loginAction, null);

    async function loginAction(_: string | null, formData: FormData) {
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.ok) {
            redirect("/");
        } else {
            return "We konden je niet inloggen. Check of je je gegevens goed hebt geschreven!";
        }
    }

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <form className="w-full max-w-sm space-y-4" action={formAction}>
                <div className="space-y-1">
                    <label htmlFor="email">E-mail</label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" maxLength={75} required/>
                </div>
                <div className="space-y-1">
                    <label htmlFor="password">Wachtwoord</label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" maxLength={50} required/>
                </div>
                <Link className="block text-blue-600 underline hover:text-blue-800" href="/aanmelden">Heb je nog geen account?</Link>
                {error &&
                    <strong className="block font-normal text-red-500">{error}</strong>
                }
                <Button className="w-full font-semibold" type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="animate-spin"/>}
                    Log in
                </Button>
            </form>
        </main>
    );
}