"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Header() {
    const [toggled, setToggled] = useState(false);
    const { status, data: session } = useSession();
    const user = session?.user;

    if (status === "loading") return;

    return (
        <header className={`${toggled && 'flex-col absolute'} w-[100%] top-0 z-50 flex items-center justify-between p-3 border-b border-sidebar-border bg-white backdrop-blur`}>
            <div className="w-[100%] flex items-center justify-between">
                <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
                <button className="block sm:hidden w-10 h-8 relative z-50" onClick={() => setToggled(x => !x)} aria-label="Menu button" aria-expanded={toggled}>
                    <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
                    <span className={cn("hamburger-line top-1/2 -translate-y-1/2", toggled && "opacity-0")} />
                    <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full")} />
                </button>
            </div>

            <nav className={`${toggled ? 'flex flex-col' : 'hidden'} gap-4 sm:flex space-x-2 items-center justify-between`}>

                <Link className={buttonVariants({ variant: "ghost" })} href="/afspraak">Afspraak maken</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 3</Link>
                {user ? <>
                    {user.role === "Admin" &&
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