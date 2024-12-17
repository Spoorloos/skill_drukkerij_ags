import { type Database } from "@/../database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

function dateWithoutTime(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

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
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4 p-4">
            {days.map((day, index) =>
                <li className="flex flex-col gap-[inherit]" key={index}>
                    <h2 className="text-2xl font-bold">
                        <time dateTime={dateWithoutTime(day)}>
                            {day.toLocaleDateString(undefined, { weekday: "short" })}
                        </time>
                    </h2>
                    <ul className="contents">
                        {appointments
                            .filter(x => x.date === dateWithoutTime(day))
                            .map(appointment =>
                                <li className="contents" key={appointment.id}>
                                    <Card className="group cursor-pointer">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-center">
                                                <time dateTime={new Date(`${appointment.date} ${appointment.time}`).toISOString()}>
                                                    {appointment.time}
                                                </time>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="opacity-50 group-hover:opacity-100 transition-opacity duration-100">
                                            <dl>
                                                <div>
                                                    <dt className="font-semibold inline">Aantal: </dt>
                                                    <dd className="font-light inline">{appointment.quantity}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-semibold inline">Dubbelzijdig: </dt>
                                                    <dd className="font-light inline">{appointment.double_sided ? "Ja" : "Nee"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-semibold inline">Grootte: </dt>
                                                    <dd className="font-light inline">{appointment.size}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-semibold inline">Beschrijving: </dt>
                                                    <dd className="font-light inline break-words">{appointment.description}</dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>
                                </li>
                            )
                        }
                    </ul>
                </li>
            )}
        </ul>
    )
}