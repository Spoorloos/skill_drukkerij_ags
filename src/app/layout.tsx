import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Provider from "@/components/Provider";
import { GeistSans } from "geist/font/sans";

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
            <body className={`${GeistSans.className} antialiased`}>
                <Provider>
                    <Header/>
                    {children}
                </Provider>
            </body>
        </html>
    );
}
