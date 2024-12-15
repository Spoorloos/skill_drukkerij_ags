import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButton = ButtonProps & Readonly<{
    isPending?: boolean;
}>;

export default function SubmitButton({ isPending, children, ...props }: SubmitButton) {
    return (
        <Button type="submit" disabled={isPending} {...props}>
            {isPending && <Loader2 className="animate-spin"/>}
            {children}
        </Button>
    );
}