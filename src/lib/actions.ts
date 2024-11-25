"use server";

import { createClient } from "@supabase/supabase-js";
import { dateToString } from "@/lib/utils";
import { getServerSession, type Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import { hash } from "argon2";
import { type Database } from "@/../database";
import { appointmentSchema, signupSchema } from "@/lib/schemas";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type ActionResult = {
    message?: string | undefined;
    status: number;
}

export async function appointmentSubmit(
    _: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    // Get user
    const session: Session | null = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
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
        user: user.id,
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
        .insert(data);

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

export async function signupAction(
    _: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
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

export async function getAppointmentTimes(date: Date, now: Date) {
    const result = await supabase.rpc("get_available_times", {
        input_date: dateToString(date),
        now: dateToString(now),
    });

    if (result.error || !result.data) {
        return [];
    }

    return result.data.map(x => x.available_time);
}