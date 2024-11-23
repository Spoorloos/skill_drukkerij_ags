"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { signupAction } from "@/lib/actions";
import Link from "next/link";

export default function Inloggen() {
    const [result, formAction, isPending] = useActionState(signupAction, null);

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Aanmelden</h1>
            <form className="w-full max-w-sm space-y-4" action={formAction}>
                <div className="space-y-1">
                    <label htmlFor="name">Naam</label>
                    <Input id="name" name="name" placeholder="Je volledige naam" maxLength={50} required/>
                </div>
                <div className="space-y-1">
                    <label htmlFor="email">E-mail</label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" maxLength={75} required/>
                </div>
                <div className="space-y-1">
                    <label htmlFor="password">Wachtwoord</label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" maxLength={50} required/>
                </div>
                <Link className="block text-blue-600 underline hover:text-blue-800" href="/inloggen">Heb je al een account?</Link>
                {result && result.status === 0 &&
                    <strong className="block font-normal text-red-500">{result.message}</strong>
                }
                <Button className="w-full font-semibold" type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="animate-spin"/>}
                    Meld je aan
                </Button>
            </form>
        </main>
    );
}