"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [ toggled, setToggled ] = useState(false);
    const { status, data: session } = useSession();
    const user = session?.user;

    return (
        <header className="sticky top-0 flex flex-col items-stretch justify-start gap-4 p-3 border-b sm:flex-row sm:items-center sm:justify-between border-sidebar-border bg-background">
            <div className="flex items-center justify-between w-full">
                <Link href="/">
                    <h1 className="font-bold">Drukkerij AGS</h1>
                </Link>
                <button className="size-8 sm:hidden" onClick={() => setToggled(x => !x)}>
                    {toggled ? (
                        <X className="size-full"/>
                    ) : (
                        <Menu className="size-full"/>
                    )}
                </button>
            </div>
            <nav className={(toggled ? "flex" : "hidden") + " sm:flex flex-col sm:flex-row gap-2 items-stretch sm:items-center h-full"}>
                <ThemeSelector/>
                {status !== "loading" ? (
                    user ? <>
                        {user.role === "Admin" &&
                            <Link className={buttonVariants({ variant: "outline" })} href="/dashboard">Dashboard</Link>
                        }
                        <Button onClick={() => signOut()}>Uitloggen</Button>
                    </> : <>
                        <Link className={buttonVariants({ variant: "outline" })} href="/aanmelden">Aanmelden</Link>
                        <Link className={buttonVariants({ variant: "default" })} href="/inloggen">Inloggen</Link>
                    </>
                ) : <>
                    <Skeleton className="sm:w-[10ch] h-9 px-4 py-2"/>
                    <Skeleton className="sm:w-[9ch] h-9 px-4 py-2"/>
                </>}
            </nav>
        </header>
    );
}

function ThemeSelector() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="inline-block size-full dark:hidden"/>
                    <Moon className="hidden size-full dark:inline-block"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Licht</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Donker</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>Systeem</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}