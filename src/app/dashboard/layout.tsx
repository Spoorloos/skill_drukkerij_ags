import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import { User, Calendar } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Sidebar from "@/components/Sidebar";

type DashboardLayout = Readonly<{
    children: React.ReactNode;
}>;

export default async function DashboardLayout({ children }: DashboardLayout) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        redirect("/");
    }

    return (
        <SidebarProvider>
            <Sidebar items={[
                {
                    title: "Afspraken",
                    href: "/dashboard/afspraken",
                    icon: <Calendar/>,
                },
                {
                    title: "Gebruikers",
                    href: "/dashboard/gebruikers",
                    icon: <User/>,
                },
            ]}/>
            <main className="w-full p-8 space-y-4">
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    );
}