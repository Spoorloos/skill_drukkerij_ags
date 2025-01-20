export default function Settings() {
    return (
        <main className="flex flex-col items-center pt-10">
            <p className="mb-6 text-sm">Welkom USERNAME</p>
            <h1 className="text-2xl">jouw gebruiker Settings</h1>
            <section>
                <div className="whitespace-pre-wrap bg-slate-300 p-4">
                    {`
                        Make a settings tab where you can set these things:

                        2 weken van te voren vertellen waneer je wel en niet kan en tot hoe laat je kan.
                        Dates working:
                        Hours in the day worked:
                        Break time:

                        Dark mode:
                        Email address:

                        Moet je ook de uren zeggen dat je gaat werken of alleen de dag?
                    `}
                </div>
            </section>
        </main>
    )
}
