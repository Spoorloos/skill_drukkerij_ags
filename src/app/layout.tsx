import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Drukkerij AGS",
    description: "De drukkerij van Mediacollege Amsterdam",
};

type RootLayout = Readonly<{
    children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayout) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Header/>
                {children}
            </body>
        </html>
    );
}
