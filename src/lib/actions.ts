"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { dateToString } from "@/lib/utils";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const appointmentSchema = z.object({
    subject: z.string().max(50),
    description: z.string().max(1000),
    date: z.string().date(),
    time: z.string().time(),
});

type ActionResult = {
    message: string | undefined;
    status: number;
}

export async function appointmentSubmit(
    _: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    "use server";

    // Get session
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user) {
        return {
            message: "Je bent niet ingelogt",
            status: 0,
        }
    }

    // Validate form data with zod
    const { data, success } = appointmentSchema.safeParse({
        subject: formData.get("subject"),
        description: formData.get("description"),
        date: formData.get("date"),
        time: formData.get("time"),
    });

    if (!success) {
        return {
            message: "Er is een probleem met de ingevulde data",
            status: 0,
        }
    }

    // Insert appointment into database with supabase
    const { error } = await supabase
        .from("appointment")
        .insert({
            ...data,
            user: session.user.id,
        });

    return error ?
        {
            message: "Er is een fout opgetreden en we hebben je afspraak niet kunnen registreren.",
            status: 0,
        } :
        {
            message: "We hebben je afspraak geregistreerd!",
            status: 1
        };
}

export async function getAppointmentTimes(date: Date): Promise<string[]> {
    "use server";

    const result = await supabase.rpc("get_available_times", {
        input_date: dateToString(date),
        now: dateToString(new Date()),
    });

    if (result.error || !result.data) {
        return [];
    }

    return result.data.map((x: any) => x.available_time);
}