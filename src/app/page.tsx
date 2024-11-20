"use server";

import PageList from "@/components/PageList";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Home() {
    return (
        <main className="p-8 pb-0 space-y-8">
            <PageList pages={{
                "Inloggen": <section>
                    <p>Test</p>
                </section>,
                "Maak je afspraak": <section>
                    <p>Test 2</p>
                </section>,
                "Afgerond": <section>
                    <p>We hebben je afspraak ingeplant en we verwachten je ... om ... uur bij ...!</p>
                </section>
            }}/>

            {/* <section>
                <table className="w-1/2 border-collapse border border-black table-fixed">
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
            </section> */}
        </main>
    );
}
