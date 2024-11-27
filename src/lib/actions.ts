"use server";

import { createClient } from "@supabase/supabase-js";
import { dateToString } from "@/lib/utils";
import { getServerSession, User, type Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { type Database } from "@/../database";
import { appointmentSchema, signupSchema, userDataSchema } from "@/lib/schemas";

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
    const user = await getUser();
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
            password: await hash(data.password, 12),
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

export async function getUser() {
    const session: Session | null = await getServerSession(authOptions);
    return session?.user;
}

export async function getUsers(filter?: string) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    let query = supabase
        .from("user")
        .select("id, name, email, role");

    if (filter) query = query.or(`name.ilike.%${filter}%, email.ilike.%${filter}%`);
    // insert pagination...

    return await query;
}

export async function deleteUser(id: number) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    return await supabase
        .from("user")
        .delete()
        .eq("id", id);
}

export async function updateUser(id: number, data: Record<string, unknown>) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    const { data: input, success, error } = userDataSchema.safeParse(data);
    if (!success) {
        console.log(error);
        return;
    }

    return await supabase
        .from("user")
        .update({
            name: input.name,
            email: input.email,
            password: input.password && await hash(input.password, 12),
            role: input.role,
        })
        .eq("id", id);
}