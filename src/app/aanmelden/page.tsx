"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import { signupAction } from "@/lib/actions";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Aanmelden() {
    const [isPending, setPending] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const submitSignup = useCallback(async (formData: FormData) => {
        if (!executeRecaptcha) return;

        try {
            setPending(true);
            await signupAction(await executeRecaptcha("login"), formData);
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Er is iets mis gegaan.",
                    description: error.message,
                });
            }
        } finally {
            setPending(false);
        }
    }, [executeRecaptcha]);

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Aanmelden</h1>
            <form className="w-full max-w-sm space-y-4" action={submitSignup}>
                <div className="space-y-2">
                    <Label htmlFor="name">Volledige Naam</Label>
                    <Input id="name" name="name" placeholder="Je volledige naam" minLength={5} maxLength={50} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" minLength={5} maxLength={75} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" minLength={8} maxLength={50} required />
                </div>
                <Link className="inline-block link" href="/inloggen">Heb je al een account?</Link>
                <SubmitButton className="w-full g-recaptcha" isPending={isPending}>Meld je aan</SubmitButton>
            </form>
        </main>
    );
}