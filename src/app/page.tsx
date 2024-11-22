import EventCard from "@/components/EventCard";

export default function Home() {
    return (
        <main className="p-8 pb-0 space-y-8">
            <section>
                <h2 className="mb-4 text-xl font-bold">Schedule</h2>
                <ul className="grid grid-cols-5">
                    <li className="flex flex-col gap-4 p-4 bg-blue-100">
                        <h4 className="text-lg font-bold">Monday</h4>
                        <ul className="contents">
                            <li><EventCard name="Pizza Party" time="10:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                            <li><EventCard name="Pizza Party" time="12:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                        </ul>
                    </li>
                    <li className="flex flex-col gap-4 p-4 bg-blue-200">
                        <h4 className="text-lg font-bold">Tuesday</h4>
                        <ul className="contents">
                            <li><EventCard name="Pizza Party" time="10:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                        </ul>
                    </li>
                    <li className="flex flex-col gap-4 p-4 bg-blue-300">
                        <h4 className="text-lg font-bold">Wednesday</h4>
                        <ul className="contents">
                            <li><EventCard name="Pizza Party" time="10:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                        </ul>
                    </li>
                    <li className="flex flex-col gap-4 p-4 bg-blue-400">
                        <h4 className="text-lg font-bold">Thursday</h4>
                        <ul className="contents">
                            <li><EventCard name="Pizza Party" time="10:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                        </ul>
                    </li>
                    <li className="flex flex-col gap-4 p-4 bg-blue-500">
                        <h4 className="text-lg font-bold">Friday</h4>
                        <ul className="contents">
                            <li><EventCard name="Pizza Party" time="10:00" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/></li>
                        </ul>
                    </li>
                </ul>
            </section>
        </main>
    );
}
