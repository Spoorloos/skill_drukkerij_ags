import Test from '../components/ui/fred_calendar';


export default function Home() {
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
            }}/> */}


            <section>
                <h2 className="pb-4 text-xl font-bold">Schedule</h2>
                <Test></Test>
                {/* <ol className="flex">
                    <li>
                        <article className="p-4 bg-blue-100">
                            <h4 className="text-lg font-bold">monday</h4>
                            <ol className="space-y-5">
                                <Test></Test>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="p-4 bg-blue-200">
                            <h4 className="text-lg font-bold">Tuesday</h4>
                            <ol>
                                <li>
                                    <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                        <h4 className="mb-4 text-xl font-bold text-center text-gray-800">Pizza Party</h4>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="p-4 bg-blue-300">
                            <h4 className="text-lg font-bold">Wednesday</h4>
                            <ol>
                                <li>
                                    <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                        <h4 className="mb-4 text-xl font-bold text-center text-gray-800">Pizza Party</h4>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="p-4 bg-blue-400">
                            <h4 className="text-lg font-bold">Thursday</h4>
                            <ol>
                                <li>
                                    <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                        <h4 className="mb-4 text-xl font-bold text-center text-gray-800">Pizza Party</h4>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                    <li>
                        <article className="p-4 bg-blue-500">
                            <h4 className="text-lg font-bold">Friday</h4>
                            <ol>
                                <li>
                                    <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                                        <h4 className="mb-4 text-xl font-bold text-center text-gray-800">Pizza Party</h4>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Time: </span><time>10:00 - 12:00</time>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </article>
                                </li>
                            </ol>
                        </article>
                    </li>
                </ol> */}
            </section>
        </main>
    );
}

