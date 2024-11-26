import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SubmitButton = Readonly<{
    className?: string;
    isPending?: boolean;
    children?: React.ReactNode;
}>;

export default function SubmitButton({ className, isPending, children }: SubmitButton) {
    return (
        <Button type="submit" className={cn("font-semibold", className)} disabled={isPending}>
            {isPending && <Loader2 className="animate-spin"/>}
            {children}
        </Button>
    );
}