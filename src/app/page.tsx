"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Home() {
    const { data, error } = await supabase
        .from("test")
        .select();

    return (
        <main>
            {error ? (
                <strong className="text-red-600">Failed to get data from database</strong>
            ) : data.map(row => {
                return <p>{row.title!}</p>
            })}
        </main>
    );
}
