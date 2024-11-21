import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between p-3 border-b border-border/40 bg-background/95 backdrop-blur">
            <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
            <nav className="space-x-2">
                <Link className={buttonVariants({ variant: "ghost" })} href="/appointment">Afspraak</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 1</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 2</Link>
                <Link className={buttonVariants({ variant: "ghost" })} href="#">Test 3</Link>
                <Link className={buttonVariants({ variant: "outline" })} href="#">Registreren</Link>
                <Link className={buttonVariants({ variant: "default" }) + " font-semibold"} href="#">Inloggen</Link>
            </nav>
        </header>
    );
}