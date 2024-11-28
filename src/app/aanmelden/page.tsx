"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                    <Label htmlFor="name">Naam</Label>
                    <Input id="name" name="name" placeholder="Je volledige naam" minLength={5} maxLength={50} required/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" minLength={5} maxLength={75} required/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" minLength={8} maxLength={50} required/>
                </div>
                <Link className="block text-blue-600 underline hover:text-blue-800" href="/inloggen">Heb je al een account?</Link>
                {result && result.status === 0 &&
                    <strong className="block font-normal text-red-500">{result.message}</strong>
                }
                <SubmitButton className="w-full" isPending={isPending}>Meld je aan</SubmitButton>
            </form>
        </main>
    );
}