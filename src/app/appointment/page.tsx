"use client";

import { appointmentSubmit } from "@/lib/actions";
import { useActionState } from "react";
import { useState } from "react";
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
import { getAppointmentTimes } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Appointment() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [formState, formAction, isPending] = useActionState(appointmentSubmit, {
        message: undefined,
        status: -1,
    });

    if (formState.status === 1) {
        setTimeout(() => redirect("/"), 2000);
    }

    return (
        <main className="flex flex-col items-center gap-8 p-8">
            <h1 className="text-3xl font-bold">Maak een afspraak</h1>
            <form className="flex gap-4 flex-col w-[clamp(10rem,70vw,30rem)]" action={formAction}>
                <label htmlFor="subject">Onderwerp</label>
                <Input id="subject" name="subject" placeholder="Bijvoorbeeld: Poster 50x70cm" maxLength={50} required/>

                <label htmlFor="description">Beschrijving</label>
                <Textarea id="description" name="description" placeholder="Leg uitgebreid uit wat je wilt afdrukken" maxLength={1000} required/>

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
                            <SelectContent>
                                {getAppointmentTimes(date!, 9, 16, 15).map((time, index) =>
                                    <SelectItem value={time.toLocaleTimeString("nl-NL")} key={index}>
                                        {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {formState.status !== -1 &&
                    <p className={formState.status === 0 ? "text-red-500" : ""}>{formState.message}</p>
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