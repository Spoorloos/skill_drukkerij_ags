"use client";

import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Inloggen() {
    const [ok, setOk] = useState<boolean>(true);

    const loginAction = async (formData: FormData) => {
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.ok) {
            redirect("/");
        } else {
            setOk(false);
        }
    }

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <form className="w-full max-w-sm space-y-4" action={loginAction}>
                <div className="space-y-1">
                    <label htmlFor="email">E-mail</label>
                    <Input id="email" name="email" type="email" placeholder="email@example.com" maxLength={75} onChange={() => setOk(true)} required/>
                </div>
                <div className="space-y-1">
                    <label htmlFor="password">Wachtwoord</label>
                    <Input id="password" name="password" type="password" placeholder="password123" maxLength={50} onChange={() => setOk(true)} required/>
                </div>
                {!ok &&
                    <strong className="block font-normal text-red-500">We konden je niet inloggen. Check of je je gegevens goed hebt geschreven!</strong>
                }
                <Link className="block text-blue-600 underline hover:text-blue-800" href="/registeren">Heb je nog geen account?</Link>
                <Button className="w-full font-semibold" type="submit">Log in</Button>
            </form>
        </main>
    );
}