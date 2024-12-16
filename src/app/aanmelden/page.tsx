"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef, useId } from "react";
import { ActionResult, signupAction } from "@/lib/actions";
import Link from "next/link";
import Script from "next/script";
import { toast } from "@/hooks/use-toast";

export default function Aanmelden() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, setPending] = useState(false);
    const submitID = useId();

    useEffect(() => {
        (window as any)[submitID] = async (token: string) => {
            if (!formRef.current) return;

            setPending(true);
            const result = await signupAction(token, new FormData(formRef.current));
            setPending(false);

            if (result && result.status === 0) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Er is iets mis gegaan.",
                    description: result.message,
                });
            }
        }
    }, []);

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <Script src="https://www.google.com/recaptcha/api.js"/>
            <h1 className="text-3xl font-bold">Aanmelden</h1>
            <form className="w-full max-w-sm space-y-4" ref={formRef} method="POST">
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
                <Link className="block underline text-blue-600 dark:text-blue-400 hover:opacity-75" href="/inloggen">Heb je al een account?</Link>
                <div> {/* This div is necessary because recaptcha makes an invisible div that messes with the spacing */}
                    <SubmitButton
                        className="w-full g-recaptcha"
                        isPending={isPending}
                        data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        data-callback={submitID}
                        data-action="submit"
                    >Meld je aan</SubmitButton>
                </div>
            </form>
        </main>
    );
}