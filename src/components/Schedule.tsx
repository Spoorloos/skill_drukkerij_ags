import { dateToString } from "@/lib/utils";
import { type Database } from "@/../database";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Schedule() {
    const days = Array.from({ length: 5 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + i);
        return day;
    });

    const { data: appointments, error } = await supabase
        .from("appointment")
        .select("*")
        .gte("date", dateToString(days[0]))
        .lte("date", dateToString(days[4]));

    if (error || !appointments) {
        console.error(`Error fetching data ${error ?? ""}`);
        return;
    }

    return (
        <ol className="grid border rounded-lg border-border" style={{
            gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`
        }}>
            {days.map((day, index) =>
                <li className="flex flex-col gap-4 p-4" key={index}>
                    <h3 className="text-lg font-bold">
                        <time dateTime={dateToString(day)}>{day.toDateString().slice(0, 3)}</time>
                    </h3>
                    <ol className="contents">
                        {appointments
                            .filter(x => x.date === dateToString(day))
                            .map(appointment =>
                                <li className="w-full p-6 mx-auto rounded-lg shadow-md bg-muted text-muted-foreground" key={appointment.id}>
                                    <p className="mb-2 text-sm">
                                        <span className="font-semibold">Time: </span>
                                        <time dateTime={`${appointment.date}T${appointment.time}:00`}>{appointment.time}</time>
                                    </p>
                                    <p className="text-sm break-words">
                                        <span className="font-semibold">Description: </span>
                                        <span>{appointment.description}</span>
                                    </p>
                                </li>
                            )
                        }
                    </ol>
                </li>
            )}
        </ol>
    )
}