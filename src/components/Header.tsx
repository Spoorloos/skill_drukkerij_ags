import Link from "next/link";

export default function Header() {
    return (
        <header className="p-3 px-8 flex justify-between items-center bg-black text-white">
            <Link href="/"><h1 className="font-bold">Drukkerij AGS</h1></Link>
            <nav className="space-x-3">
                <Link className="nav-item" href="appointment">add appointment</Link>
                <Link className="nav-item" href="#">Test 1</Link>
                <Link className="nav-item" href="#">Test 2</Link>
                <Link className="nav-item" href="#">Test 3</Link>
            </nav>
        </header>
    );
}