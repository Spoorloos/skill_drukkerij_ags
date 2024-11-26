import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";

type LoginLayout = Readonly<{
    children: React.ReactNode;
}>;

export default async function LoginLayout({ children }: LoginLayout) {
    const user = await getUser();
    if (user) {
        redirect("/");
    }
    return children;
}