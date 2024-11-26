import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";

type AfspraakLayout = Readonly<{
    children: React.ReactNode;
}>;

export default async function AfspraakLayout({ children }: AfspraakLayout) {
    const user = await getUser();
    if (!user) {
        redirect("/inloggen");
    }
    return children;
}