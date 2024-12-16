"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { ActionResult, signupAction } from "@/lib/actions";
import Link from "next/link";
import Script from "next/script";


import { useEffect, useRef } from "react";
declare global {
    interface Window {
        RecaptchaOnSubmit: (token: string) => void;
    }
}
export default function Inloggen() {
    const formRef = useRef<HTMLFormElement>(null);
    const [result, setResult] = useState<ActionResult<unknown>>();

    useEffect(() => {
        window.RecaptchaOnSubmit = async (token) => {
            if (!formRef.current) return;
            setResult(await signupAction(new FormData(formRef.current), token))
        };
    }, []);
    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <Script src="https://www.google.com/recaptcha/api.js" async defer />

            <h1 className="text-3xl font-bold">Aanmelden</h1>
            <form className="w-full max-w-sm space-y-4" ref={formRef} method="POST">
                <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
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
                {result && result.status === 0 &&
                    <strong className="block font-normal text-red-500">{result.message}</strong>
                }
                <SubmitButton
                    className="w-full  g-recaptcha"
                    // isPending={isPending}
                    data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    data-callback="RecaptchaOnSubmit"
                    data-action="submit"
                >Meld je aan
                </SubmitButton>
                <strong className="block font-normal text-center opacity-70 hover:opacity-100 transition-opacity duration-100">
                    {/* DO NOT REMOVE THIS! or else legal trouble */}
                    This site is protected by reCAPTCHA and the Google <Link className="link" href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link className="link" href="https://policies.google.com/terms">Terms of Service</Link> apply.
                </strong>
            </form>
        </main>
    );
}