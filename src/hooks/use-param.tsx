"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function useParam(name: string) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const state = useState(searchParams.get(name)?.toString());
    const [ param ] = state;

    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (param) {
            newSearchParams.set(name, param);
        } else {
            newSearchParams.delete(name);
        }
        router.replace(`${pathName}?${newSearchParams.toString()}`, { scroll: false });
    }, [ param ]);

    return state;
}