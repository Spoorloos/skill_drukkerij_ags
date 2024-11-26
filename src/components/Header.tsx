"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between p-3 border-b border-sidebar-border bg-background/95 backdrop-blur">
            <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
            <nav className="space-x-2">
                <Link className={buttonVariants({ variant: "ghost" })} href="/afspraak">Afspraak maken</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 1</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 2</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 3</Link>
                {user ? <>
                    {user.admin &&
                        <Link className={buttonVariants({ variant: "outline" })} href="/dashboard">Dashboard</Link>
                    }
                    <Button className="font-semibold" onClick={() => signOut()}>Uitloggen</Button>
                </> : <>
                    <Link className={buttonVariants({ variant: "outline" })} href="/aanmelden">Aanmelden</Link>
                    <Link className={buttonVariants({ variant: "default" }) + " font-semibold"} href="/inloggen">Inloggen</Link>
                </>}
            </nav>
        </header>
    );
}