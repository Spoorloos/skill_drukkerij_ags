"use client";

import { appointmentSubmit, getAppointmentTimes, ActionResult } from "@/lib/actions";
import { useTransition, useEffect, useState, useId, useCallback } from "react";
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
import { z } from "zod";
import { appointmentSchema } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

declare global {
    interface Window {
        RecaptchaOnSubmit: (token: string) => void;
    }
}

export default function Appointment() {
    const router = useRouter();
    const session = useSession();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [times, setTimes] = useState<string[]>();
    const [timesLoading, startTransition] = useTransition();

    const [result, setResult] = useState<ActionResult<z.infer<typeof appointmentSchema>>>();
    const [isLoading, setLoading] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        if (date) {
            startTransition(async () => {
                setTimes(await getAppointmentTimes(date, new Date()));
            });
        }
    }, [date]);

    useEffect(() => {
        if (session.status !== "loading" && !session.data) {
            router.push("/inloggen");
        }
    }, [session]);

    useEffect(() => {
        if (result && result.status === 0) {
            toast({
                variant: "destructive",
                title: "Uh oh! Er is iets mis gegaan.",
                description: result.message ?? "Er is een fout opgetreden",
            });
        }
    }, [result]);

    const createAppointment = useCallback(async (formData: FormData) => {
        if (!executeRecaptcha) return;
        if (date) formData.set("date", date.toLocaleDateString("en-CA"));

        const token = await executeRecaptcha();

        setLoading(true);
        setResult(await appointmentSubmit(token, formData));
        setLoading(false);
    }, [executeRecaptcha]);

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
                <form className="space-y-4 w-[clamp(10rem,70vw,30rem)]" action={createAppointment}>
                    <div className="space-y-2">
                        <Label htmlFor="description">Beschrijving</Label>
                        <Textarea className="min-h-48" id="description" name="description" placeholder="Leg uitgebreid uit wat je wilt afdrukken" maxLength={1000} required/>
                    </div>
                    <div className="space-y-2">
                        <Label className="block">Dag en tijd</Label>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <DatePicker
                                    selected={date}
                                    onSelect={setDate}
                                    mode="single"
                                    hidden={{ before: new Date() }}
                                    required/>
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
                                                <SelectItem value={time} key={index}>{time.slice(0, 5)}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <SubmitButton className="w-full sm:w-auto g-recaptcha" isPending={isLoading}>Maak een afspraak</SubmitButton>
                    </div>
                </form>
            </>}
        </main>
    );
}