import { getServerSession, type Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session: Session | null = await getServerSession(authOptions);
    const user = session?.user;
    if (!user?.admin) {
        redirect("/");
    }

    return (
        <main className="p-8 pb-0 space-y-8">
            <h1>Admin Dashboard</h1>
        </main>
    );
}