"use client";

import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Inloggen() {
    const router = useRouter();
    const [error, formAction, isPending] = useActionState(loginAction, null);

    async function loginAction(_: string | null, formData: FormData) {
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.ok) {
            router.push("/");
            return "Je bent ingelogd!";
        }

        return "We konden je niet inloggen. Check of je je gegevens goed hebt geschreven!";
    }

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <form className="w-full max-w-sm space-y-4" action={formAction}>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="email@voorbeeld.nl" minLength={5} maxLength={75} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" name="password" type="password" placeholder="wachtwoord123" minLength={8} maxLength={50} required/>
                </div>
                <Link className="block underline text-blue-600 dark:text-blue-400 hover:opacity-75" href="/aanmelden">Heb je nog geen account?</Link>
                {error &&
                    <strong className="block font-normal text-red-500">{error}</strong>
                }
                <SubmitButton className="w-full" isPending={isPending}>Log in</SubmitButton>
            </form>
        </main>
    );
}