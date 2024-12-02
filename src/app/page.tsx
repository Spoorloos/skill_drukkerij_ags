"use client";

import { appointmentSubmit, getAppointmentTimes } from "@/lib/actions";
import { useActionState, useTransition } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import { DatePicker } from "@/components/ui/datepicker";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Appointment() {
    const router = useRouter();
    const session = useSession();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [times, setTimes] = useState<string[]>();
    const [result, formAction, isLoading] = useActionState(appointmentSubmit, null);
    const [timesLoading, startTransition] = useTransition();

    if (result?.status === 1) {
        setTimeout(() => router.push("/"), 2000);
    }

    useEffect(() => {
        if (date) startTransition(async () => {
            setTimes(await getAppointmentTimes(date, new Date()));
        });
    }, [date]);

    useEffect(() => {
        if (session.status !== "loading" && !session.data) {
            router.push("/inloggen");
        }
    }, [session]);

    return session.data && (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            {result && result.status === 1 ? <>
                <h1 className="text-3xl font-bold text-center">Je afspraak is aangemaakt</h1>
                <p className="text-center">
                    Je wordt op <strong>{new Date(`${result.data?.date} ${result.data?.time}`).toLocaleString()}</strong> bij (onze locatie) verwacht.
                    <br/>
                    Je krijgt binnen enkele minuten een bevestigings email. Je kunt deze pagina nu sluiten.
                </p>
            </> : <>
                <h1 className="text-3xl font-bold text-center">Maak een afspraak</h1>
                <form className="space-y-4 w-[clamp(10rem,70vw,30rem)]" action={formAction}>
                    <div className="space-y-2">
                        <Label htmlFor="description">Beschrijving</Label>
                        <Textarea className="min-h-48" id="description" name="description" placeholder="Leg uitgebreid uit wat je wilt afdrukken" maxLength={1000} required/>
                    </div>
                    <div className="space-y-2">
                        <Label className="block">Dag en tijd</Label>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <DatePicker date={date} setDate={setDate} fromDate={new Date()} required/>
                                <input name="date" type="date" value={date?.toLocaleDateString("en-CA")} readOnly hidden/>
                            </div>
                            <div className="flex-1">
                                {(timesLoading || !times) ? (
                                    <Skeleton className="size-full"/>
                                ) : (
                                    <Select name="time" disabled={times.length < 1} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder={times.length < 1
                                                ? "Geen tijden op deze dag"
                                                : "Selecteer een tijd"
                                            }/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {times.map((time, index) =>
                                                <SelectItem value={time} key={index}>{time.slice(0,5)}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </div>
                    {result && result.status === 0 &&
                        <p className="text-red-500">{result.message}</p>
                    }
                    <div className="text-end">
                        <SubmitButton className="w-full sm:w-auto" isPending={isLoading}>Maak een afspraak</SubmitButton>
                    </div>
                </form>
            </>}
        </main>
    );
}