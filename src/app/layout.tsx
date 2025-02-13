import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import AuthProvider from "@/components/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider";
import CaptchaProvider from "@/components/CaptchaProvider";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: "Drukkerij AGS",
    description: "De drukkerij van Mediacollege Amsterdam",
};

type RootLayout = Readonly<{
    children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayout) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${GeistSans.className} antialiased flex flex-col min-h-screen`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <AuthProvider>
                        <CaptchaProvider>
                            <Header/>
                            <Toaster/>
                            {children}
                        </CaptchaProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
