import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";

type AanmeldLayout = Readonly<{
    children: React.ReactNode;
}>;

export default async function AanmeldLayout({ children }: AanmeldLayout) {
    const user = await getUser();
    if (user) {
        redirect("/");
    }
    return children;
}