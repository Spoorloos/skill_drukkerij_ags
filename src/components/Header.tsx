"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
    const [ toggled, setToggled ] = useState(false);
    const { status, data: session } = useSession();
    const user = session?.user;

    return (
        <header className={cn("w-full top-0 z-50 flex gap-4 items-center justify-between p-3 border-b border-sidebar-border bg-white backdrop-blur", toggled && "flex-col justify-start items-stretch fixed inset-0")}>
            <div className="flex items-center justify-between w-full">
                <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
                <button className="relative z-50 block w-10 h-8 md:hidden" onClick={() => setToggled(x => !x)} aria-label="Menu button" aria-expanded={toggled}>
                    <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
                    <span className={cn("hamburger-line top-1/2 -translate-y-1/2", toggled && "opacity-0")} />
                    <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full")} />
                </button>
            </div>
            <nav className={cn("hidden md:flex flex-col sm:flex-row gap-2 items-stretch sm:items-center h-full", toggled && "flex")}>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 1</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 2</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="/afspraak">Afspraak maken</Link>
                <div className={cn("flex flex-col sm:flex-row items-stretch gap-[inherit]", toggled && "mt-auto")}>
                    {status !== "loading" ? (
                        user ? <>
                            {user.role === "Admin" &&
                                <Link className={buttonVariants({ variant: "outline" })} href="/dashboard">Dashboard</Link>
                            }
                            <Button className="font-semibold" onClick={() => signOut()}>Uitloggen</Button>
                        </> : <>
                            <Link className={buttonVariants({ variant: "outline" })} href="/aanmelden">Aanmelden</Link>
                            <Link className={buttonVariants({ variant: "default" }) + " font-semibold"} href="/inloggen">Inloggen</Link>
                        </>
                    ) : <>
                        <Skeleton className="w-[9ch] h-9 px-4 py-2"/>
                        <Skeleton className="w-[9ch] h-9 px-4 py-2"/>
                    </>}
                </div>
            </nav>
        </header>
    );
}