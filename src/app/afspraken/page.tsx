"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { appointmentSubmit, getAppointmentTimes } from "@/lib/actions";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function Appointment() {
    const session = useSession();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [times, setTimes] = useState<string[]>();
    const [result, formAction, isPending] = useActionState(appointmentSubmit, null);

    if (result?.status === 1) {
        setTimeout(() => redirect("/"), 2000);
    }

    useEffect(() => {
        if (date) {
            getAppointmentTimes(date).then(setTimes);
        }
    }, [date]);

    useEffect(() => {
        if (session.status !== "loading" && !session.data) {
            redirect("/inloggen");
        }
    }, []);

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Maak een afspraak</h1>
            <form className="space-y-4 w-[clamp(10rem,70vw,30rem)]" action={formAction}>
                <div className="space-y-1">
                    <label htmlFor="subject">Onderwerp</label>
                    <Input id="subject" name="subject" placeholder="Bijvoorbeeld: Poster 50x70cm" maxLength={50} required/>
                </div>
                <div className="space-y-1">
                    <label htmlFor="description">Beschrijving</label>
                    <Textarea id="description" name="description" placeholder="Leg uitgebreid uit wat je wilt afdrukken" maxLength={1000} required/>
                </div>
                <div className="space-y-1">
                    <label className="block">Dag en tijd</label>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1">
                            <DatePicker date={date} setDate={setDate} fromDate={new Date()}/>
                            <input name="date" type="date" value={date?.toLocaleDateString("en-CA")} readOnly hidden/>
                        </div>
                        <div className="flex-1">
                            <Select name="time" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer een tijd"/>
                                </SelectTrigger>
                                {times && <SelectContent>
                                    {times.map((time, index) =>
                                        <SelectItem value={time} key={index}>{time.slice(0,5)}</SelectItem>
                                    )}
                                </SelectContent>}
                            </Select>
                        </div>
                    </div>
                </div>
                {result &&
                    <p className={result.status === 0 ? "text-red-500" : ""}>{result.message}</p>
                }
                <div className="text-end">
                    <Button type="submit" className="font-semibold" disabled={isPending}>
                        {isPending && <Loader2 className="animate-spin"/>}
                        Maak een afspraak
                    </Button>
                </div>
            </form>
        </main>
    );
}