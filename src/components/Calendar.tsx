import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/../database";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Schedule() {
    const { data, error } = await supabase
        .from("fred_appointment")
        .select("*")
        .order("start_time");

    if (error || !data) {
        console.error(`Error fetching data ${error ?? ""}`);
        return;
    }

    // group appointments
    const appointments = Object.groupBy(data, ({ date }) => {
        return new Date(date).toDateString().substring(0, 3);
    });

    appointments["Mon"] ??= [];
    appointments["Tue"] ??= [];
    appointments["Wed"] ??= [];
    appointments["Thu"] ??= [];
    appointments["Fri"] ??= [];

    return (
        <ol className="grid grid-cols-5 bg-blue-100">
            {Object.entries(appointments).map(([ day, events ], index) =>
                <li className="flex flex-col gap-4 p-4" key={index}>
                    <h3 className="text-lg font-bold">{day}</h3>
                    <ol className="contents">
                        {events?.map(appointment =>
                            <li className="w-full p-6 mx-auto bg-white rounded-lg shadow-md" key={appointment.id}>
                                <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                                <p className="mb-2 text-sm text-gray-600">
                                    <span className="font-semibold">Time: </span>
                                    <time>{appointment.start_time} - {appointment.end_time}</time>
                                </p>
                                <p className="text-sm text-gray-600 break-words">
                                    <span className="font-semibold">Description: </span>{appointment.description}
                                </p>
                            </li>
                        )}
                    </ol>
                </li>
            )}
        </ol>
    )
}