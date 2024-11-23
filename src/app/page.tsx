import Schedule from "@/components/Calendar";

export default function Home() {
    return (
        <main className="p-8 pb-0 space-y-8">
            <section>
                <h2 className="pb-4 text-xl font-bold">Schedule</h2>
                <Schedule></Schedule>
            </section>
        </main>
    );
}
