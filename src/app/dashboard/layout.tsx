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
    if (!user?.admin) {
        redirect("/");
    }

    return (
        <SidebarProvider>
            <Sidebar items={[
                {
                    title: "Gebruikers",
                    href: "/dashboard/gebruikers",
                    icon: <User/>,
                },
                {
                    title: "Afspraken",
                    href: "/dashboard/afspraken",
                    icon: <Calendar/>,
                }
            ]}/>
            <main className="p-8 pb-0 space-y-8">
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    );
}