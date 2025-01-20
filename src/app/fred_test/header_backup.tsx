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

    if (toggled == false) {
        return (
            <header className="sticky top-0 z-50 flex items-center justify-between p-3 border-b border-sidebar-border bg-background/95 backdrop-blur">
                <div className="w-[100%] flex items-center justify-between">
                    <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
                    <button className="w-10 h-8 relative z-50 md:hidden" onClick={() => setToggled(x => !x)} aria-label="Menu button" aria-expanded={toggled}>
                        <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
                        <span className={cn("hamburger-line top-1/2 -translate-y-1/2", toggled && "opacity-0")} />
                        <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full")} />
                    </button>
                </div>

                <nav className="hidden md:space-x-2 md:block">
                    <Link className={buttonVariants({ variant: "ghost" })} href="/afspraak">Afspraak maken</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 1</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 2</Link>
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
    } else {
        return (
            <header className="inset-0 absolute z-50 bg-background/95 backdrop-blur">
                <div className="flex justify-between p-3 border-b border-sidebar-border ">
                    <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>

                    <button className="w-10 h-8 relative z-50 md:hidden" onClick={() => setToggled(x => !x)} aria-label="Menu button" aria-expanded={toggled}>
                        <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
                        <span className={cn("hamburger-line top-1/2 -translate-y-1/2", toggled && "opacity-0")} />
                        <span className={cn("hamburger-line", toggled ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full")} />
                    </button>
                </div>
                <nav className="flex flex-col [&>*]:p-6 md:space-x-2 md:block">
                    <Link className={buttonVariants({ variant: "ghost" })} href="/afspraak">Afspraak maken</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 1</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 2</Link>
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



}