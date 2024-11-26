import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Calendar } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from "@/components/ui/sidebar";

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
            <Sidebar className="z-50">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/gebruikers">
                                            <User/>
                                            <span>Gebruikers</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/afspraken">
                                            <Calendar/>
                                            <span>Afspraken</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="p-8 pb-0 space-y-8">
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    );
}