"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PageList = Readonly<{
    pages: Record<string, React.ReactNode>;
}>;

export default function PageList({ pages }: PageList) {
    const pageEntries = Object.entries(pages);
    const [ selected, setSelected ] = useState(0);

    return (
        <div className="space-y-3 inline-block">
            <ul className="space-x-3">
                {pageEntries.map((page, index) =>
                    <li
                        className={`inline-block size-2 rounded-full ${index === selected ? "bg-black" : "bg-black/50"}`}
                        title={page[0]}
                        key={index}/>
                )}
            </ul>
            <h1 className="font-bold text-3xl">{pageEntries[selected][0]}</h1>
            {pageEntries[selected][1]}
            <div className="text-end">
                {selected < pageEntries.length - 1 &&
                    <Button variant="outline" onClick={() => setSelected(x => x + 1)}>Volgende</Button>
                }
            </div>
        </div>
    )
}