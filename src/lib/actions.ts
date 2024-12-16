"use server";

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { type Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { type Database } from "@/../database";
import { CaptchaResponse, appointmentSchema, signupSchema, userDataSchema } from "@/lib/schemas";
import { z } from "zod";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type ActionResult<T = unknown> = {
    message?: string | undefined;
    status: 0 | 1;
    data?: T;
}

export async function appointmentSubmit(
    formData: FormData
): Promise<ActionResult<z.infer<typeof appointmentSchema>>> {
    // Validate captcha
    const token = formData.get("g-recaptcha-response")?.toString();
    if (!token || !(await validateCaptcha(token))) {
        return {
            message: "Failed captcha",
            status: 0
        };
    }

    // Get user
    const user = await getUser();
    if (!user) {
        return {
            message: "Je bent niet ingelogt",
            status: 0
        };
    }

    // Validate form data with zod
    const { data: input, success } = appointmentSchema.safeParse({
        description: formData.get("description"),
        date: formData.get("date"),
        time: formData.get("time"),
        user: user.id
    });

    if (!success) {
        return {
            message: "Er is een probleem met de ingevulde data, zijn alle velden ingevuld?",
            status: 0
        };
    }

    // Insert appointment into database with supabase
    const { error } = await supabase
        .from("appointment")
        .insert(input);


    return error
        ? {
            message: "Er is een fout opgetreden en we hebben je afspraak niet kunnen registreren.",
            status: 0
        }
        : {
            message: "We hebben je afspraak geregistreerd!",
            status: 1,
            data: input
        }
}

export async function signupAction(
    _: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {






    const { data: input, success } = signupSchema.safeParse({
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
            ...input,
            password: await hash(input.password, 12),
        });

    if (error) {
        return {
            message: "We konden je account niet aanmaken. Misschien is de email al in gebruik.",
            status: 0,
        }
    }

    redirect("/inloggen");
}

export async function getAppointmentTimes(date: Date, now: Date) {
    const result = await supabase.rpc("get_available_times", {
        input_date: date.toLocaleDateString("en-US"),
        now: now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }),
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

export async function getUsers(filter?: string, page?: number, pageLength: number = 5) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    let query = supabase
        .from("user")
        .select("id, name, email, role", { count: "exact" });

    if (filter) query = query.or(`name.ilike.%${filter}%, email.ilike.%${filter}%`);
    if (page) query = query.range((page - 1) * pageLength, page * pageLength - 1);

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

    const { data: input, success } = userDataSchema.safeParse(data);
    if (!success) {
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

export async function getAppointments(filter?: string, page?: number, pageLength: number = 5) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    let query = supabase
        .from("appointment")
        .select("id, user!inner(id, name), date, time, description", { count: "exact" })
        .order("date")
        .order("time");

    if (filter) query = query.ilike("user.name", `%${filter}%`);
    if (page) query = query.range((page - 1) * pageLength, page * pageLength - 1);

    return await query;
}

export async function deleteAppointment(id: number) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    return await supabase
        .from("appointment")
        .delete()
        .eq("id", id);
}

export async function updateAppointment(id: number, data: Record<string, unknown>) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        return;
    }

    const { data: input, success, error } = appointmentSchema.safeParse(data);
    if (!success) {
        console.log(error);
        return;
    }

    return await supabase
        .from("appointment")
        .update({
            user: input.user,
            date: input.date,
            time: input.time,
            description: input.description,
        })
        .eq("id", id);
}

export async function validateCaptcha(
    token: string,
) {

    const recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
    const recaptcha_secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`${recaptcha_url}?secret=${recaptcha_secret}&response=${token}`);
    const { data, success: isCorrectType } = CaptchaResponse.safeParse(await response.json());

    return isCorrectType && data.success && data.score > 0.5;
}
