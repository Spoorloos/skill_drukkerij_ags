import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/../database";
import { dateWithoutTime } from "@/lib/utils";

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
        .gte("date", dateWithoutTime(days[0]))
        .lte("date", dateWithoutTime(days[4]));

    if (error || !appointments) {
        console.error(`Error fetching data ${error ?? ""}`);
        return;
    }

    return (
        <ol className="grid bg-blue-100" style={{
            gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`
        }}>
            {days.map((day, index) =>
                <li className="flex flex-col gap-4 p-4" key={index}>
                    <h3 className="text-lg font-bold">
                        <time dateTime={dateWithoutTime(day)}>{day.toDateString().slice(0, 3)}</time>
                    </h3>
                    <ol className="contents">
                        {appointments
                            .filter(x => x.date === dateWithoutTime(day))
                            .map(appointment =>
                                <li className="w-full p-6 mx-auto bg-white rounded-lg shadow-md" key={appointment.id}>
                                    <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                                    <p className="mb-2 text-sm text-gray-600">
                                        <span className="font-semibold">Time: </span>
                                        <time dateTime={`${appointment.date}T${appointment.time}:00`}>{appointment.time}</time>
                                    </p>
                                    <p className="text-sm text-gray-600 break-words">
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