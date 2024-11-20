"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Home() {
    const { data, error } = await supabase
        .from("calendar")
        .select()
        .lt("start_time", "19:00:00");


    if (error) console.error(error);

    return (
        <main className="p-8 pb-0 space-y-8">
            <section>
                <table className="border-collapse border border-black table-fixed">
                    <thead>
                        <tr className="border border-black">
                            <th className="p-4 border border-black">Monday</th>
                            <th className="p-4 border border-black">Tuesday</th>
                            <th className="p-4 border border-black">Wednesday</th>
                            <th className="p-4 border border-black">Thursday</th>
                            <th className="p-4 border border-black">Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border border-black">
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                        </tr>
                        <tr className="border border-black">
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>
                            <td className="p-4 border border-black"></td>

                        </tr>
                    </tbody>
                </table>
            </section>



            <section>
                <h2 className="font-bold">Database:</h2>
                {error ? (
                    <strong className="text-red-600">Failed to get data from database</strong>
                ) : (
                    <ul className="list-inside list-disc">
                        {data.map(row =>
                            <li key={row.id!}>{row.title!}</li>
                        )}
                    </ul>
                )}
            </section>
        </main>
    );
}
