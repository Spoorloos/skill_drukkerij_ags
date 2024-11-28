import Schedule from "@/components/Schedule";

export default function Home() {
    return (
        <main className="p-8 pb-0 space-y-8">
            <section>
                <h2 className="pb-4 text-3xl font-bold">Schedule</h2>
                <Schedule/>
            </section>
        </main>
    );
}