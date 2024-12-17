"use client";

import { getAppointments } from "@/lib/actions";
import { useEffect, useMemo, useState, useTransition } from "react";
import { dateWithoutTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

type Appointments = Awaited<ReturnType<typeof getAppointments>>;

export default function Overzicht() {
    const [loading, startTransition] = useTransition();
    const [data, setData] = useState<Appointments>();
    const days = useMemo(() => {
        return Array.from({ length: 4 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() + i);
            return day;
        });
    }, []);

    useEffect(() => {
        startTransition(async () => {
            try {
                setData(await getAppointments());
            } catch {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Er is iets mis gegaan.",
                    description: "We konden de afspraken niet ophalen.",
                });
            }
        });
    }, []);

    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4">
            {days.map((day, index) =>
                <li className="flex flex-col gap-[inherit]" key={index}>
                    <h2 className="text-2xl font-bold">
                        <time dateTime={dateWithoutTime(day)}>
                            {day.toLocaleDateString(undefined, { weekday: "short" })}
                        </time>
                    </h2>
                    <ul className="contents">
                        {(loading || !data?.data) ?
                            Array.from({ length: 5 }, (_, i) =>
                                <Skeleton className="h-48" key={i}/>
                            )
                        : data.data
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
    );
}