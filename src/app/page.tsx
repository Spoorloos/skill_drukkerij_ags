"use server";

import PageList from "@/components/PageList";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Home() {
    return (
        <main className="p-8 pb-0 space-y-8">
            {/* <PageList pages={{
                "Inloggen": <section>
                    <p>Test</p>
                </section>,
                "Maak je afspraak": <section>
                    <p>Test 2</p>
                </section>,
                "Afgerond": <section>
                    <p>We hebben je afspraak ingeplant en we verwachten je ... om ... uur bij ...!</p>
                </section>
            }} /> */}

            <section>
                <h2 className="pb-4 text-xl font-bold">Schedule</h2>

                <ol className="flex">
                <li>
                        <article className="bg-blue-100 p-4">
                            <h4 className="font-bold text-lg">monday</h4>
                            <ol className="space-y-5">
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>12:00 - 14:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="bg-blue-200 p-4">
                            <h4 className="font-bold text-lg">Tuesday</h4>
                            <ol>
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="bg-blue-300 p-4">
                            <h4 className="font-bold text-lg">Wednesday</h4>
                            <ol>
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="bg-blue-400 p-4">
                            <h4 className="font-bold text-lg">Thursday</h4>
                            <ol>
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="bg-blue-500 p-4">
                            <h4 className="font-bold text-lg">Friday</h4>
                            <ol>
                                <li>
                                    <article className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
                                        <h4 className="text-center text-xl font-bold text-gray-800 mb-4">Pizza Party</h4>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                </ol>
            </section>
        </main>
    );
}

