"use client";

import { appointmentSubmit, getAppointmentTimes } from "@/lib/actions";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

export default function Appointment() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [times, setTimes] = useState<string[]>();
    const [result, formAction, isPending] = useActionState(appointmentSubmit, null);

    if (result?.status === 1) {
        setTimeout(() => router.push("/"), 2000);
    }

    useEffect(() => {
        if (date) {
            getAppointmentTimes(date, new Date()).then(setTimes);
        }
    }, [date]);

    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-3xl font-bold">Maak een afspraak</h1>
            <form className="space-y-4 w-[clamp(10rem,70vw,30rem)]" action={formAction}>
                <div className="space-y-1">
                    <Label htmlFor="subject">Onderwerp</Label>
                    <Input id="subject" name="subject" placeholder="Bijvoorbeeld: Poster 50x70cm" maxLength={50} required/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="description">Beschrijving</Label>
                    <Textarea id="description" name="description" placeholder="Leg uitgebreid uit wat je wilt afdrukken" maxLength={1000} required/>
                </div>
                <div className="space-y-1">
                    <Label className="block">Dag en tijd</Label>
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
                    <SubmitButton isPending={isPending}>Maak een afspraak</SubmitButton>
                </div>
            </form>
        </main>
    );
}