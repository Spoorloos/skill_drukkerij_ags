"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { dateToString } from "@/lib/utils";
import { redirect } from "next/navigation";
import { hash } from "argon2";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const appointmentSchema = z.object({
    subject: z.string().max(50),
    description: z.string().max(1000),
    date: z.string().date(),
    time: z.string().time(),
});

type ActionResult = {
    message?: string | undefined;
    status: number;
}

export async function appointmentSubmit(
    _: ActionResult | null,
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

export async function getAppointmentTimes(date: Date, now: Date): Promise<string[]> {
    "use server";

    const result = await supabase.rpc("get_available_times", {
        input_date: dateToString(date),
        now: dateToString(now),
    });

    console.log(result);

    if (result.error || !result.data) {
        return [];
    }

    return result.data.map((x: any) => x.available_time);
}

const signupSchema = z.object({
    name: z.string().max(50),
    email: z.string().email().max(75),
    password: z.string().max(50),
});

export async function signupAction(
    _: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    "use server";

    const { data, success } = signupSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!success) {
        return {
            message: "Er is iets mis met de ontvangen data!",
            status: 0,
        }
    }

    const { error } = await supabase
        .from("user")
        .insert({
            ...data,
            password: await hash(data.password),
        });

    if (error) {
        return {
            message: "We konden je account niet aanmaken.",
            status: 0,
        }
    }

    redirect("/inloggen");
}