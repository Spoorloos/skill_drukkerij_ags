"use client";

import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function Inloggen() {
    const router = useRouter();
    const [isPending, setPending] = useState(false);

    async function loginAction(formData: FormData) {
        setPending(true);

        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        setPending(false);

        if (result?.ok) {
            router.push("/");
            toast({
                variant: "default",
                title: "Success!",
                description: "Je bent ingelogd!",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Er is iets mis gegaan.",
                description: "We konden je niet inloggen. Check of je je gegevens goed hebt geschreven!",
            });
        }
    }

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <form className="w-full max-w-sm space-y-4" action={loginAction}>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" minLength={5} maxLength={75} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" minLength={8} maxLength={50} required/>
                </div>
                <Link className="block underline text-blue-600 dark:text-blue-400 hover:opacity-75" href="/aanmelden">Heb je nog geen account?</Link>
                <SubmitButton className="w-full" isPending={isPending}>Log in</SubmitButton>
            </form>
        </main>
    );
}