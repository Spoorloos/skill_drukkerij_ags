"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Home() {
    const { data, error } = await supabase
        .from("test")
        .select();

    return (
        <main>
            <table className="w-1/2 border-collapse border border-black table-fixed">
                <tr className="border border-black">
                    <th className="border border-black">Monday</th>
                    <th className="border border-black">Tuesday</th>
                    <th className="border border-black">Wednesday</th>
                    <th className="border border-black">Thursday</th>
                    <th className="border border-black">Friday</th>
                </tr>
                <tr className="border border-black">
                    <td className="border border-black">Alfreds Futterkiste</td>
                    <td className="border border-black">Maria Anders</td>
                    <td className="border border-black">Germany</td>
                </tr>
                <tr className="border border-black">
                    <td className="border border-black">Centro comercial Moctezuma</td>
                    <td className="border border-black">Francisco Chang</td>
                    <td className="border border-black">Mexico</td>
                </tr>
            </table>

            {error ? (
                <strong className="text-red-600">Failed to get data from database</strong>
            ) : data.map(row => {
                return <p key={row.id!}>{row.title!}</p>
            })}
        </main>
    );
}
