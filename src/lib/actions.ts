"use server";

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { type Session } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { type Database } from "@/../database";
import { CaptchaResponse, appointmentSchema, signupSchema, userDataSchema } from "@/lib/schemas";

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function appointmentSubmit(token: string, formData: FormData) {
    // Validate captcha
    await validateCaptcha(token);

    // Get user
    const user = await getUser();
    if (!user) {
        throw new Error("Je bent niet ingelogt");
    }

    // Validate form data with zod
    const { data: input, success } = appointmentSchema.safeParse({
        description: formData.get("description"),
        date: formData.get("date"),
        time: formData.get("time"),
        user: user.id
    });

    if (!success) {
        throw new Error("Er is een probleem met de ingevulde data, zijn alle velden ingevuld?")
    }

    // Insert appointment into database with supabase
    const { error } = await supabase
        .from("appointment")
        .insert(input);

    if (error) {
        throw new Error("Er is een fout opgetreden en we hebben je afspraak niet kunnen registreren.");
    }
}

export async function signupAction(token: string, formData: FormData) {
    // Validate captcha
    await validateCaptcha(token);

    // Validate form data with zod
    const { data: input, success } = signupSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!success) {
        throw new Error("Er is iets mis met de ontvangen gegevens, zijn alle velden ingevuld?");
    }

    // Insert user into database
    const { error } = await supabase
        .from("user")
        .insert({
            ...input,
            password: await hash(input.password, 12),
        });

    if (error) {
        throw new Error("We konden je account niet aanmaken. Misschien is de email al in gebruik.");
    }

    // Redirect to login page
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
        throw Error("Je bent geen admin!");
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
        throw Error("Je bent geen admin!");
    }

    return await supabase
        .from("user")
        .delete()
        .eq("id", id);
}

export async function updateUser(id: number, data: Record<string, unknown>) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        throw Error("Je bent geen admin!");
    }

    const { data: input, success } = userDataSchema.safeParse(data);
    if (!success) {
        throw Error("Er is een probleem met de data");
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

export async function getAppointments(filter?: string, page?: number, pageLength: number = 5, start?: string, end?: string) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        throw Error("Je bent geen admin!");
    }

    let query = supabase
        .from("appointment")
        .select("*, user!inner(id, name)", { count: "exact" })
        .order("date")
        .order("time");

    if (filter) query = query.ilike("user.name", `%${filter}%`);
    if (page) query = query.range((page - 1) * pageLength, page * pageLength - 1);
    if (start) query = query.gte("date", start);
    if (end) query = query.lte("date", end);

    return await query;
}

export async function deleteAppointment(id: number) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        throw Error("Je bent geen admin!");
    }

    return await supabase
        .from("appointment")
        .delete()
        .eq("id", id);
}

export async function updateAppointment(id: number, data: Record<string, unknown>) {
    const user = await getUser();
    if (!user || user.role !== "Admin") {
        throw Error("Je bent geen admin!");
    }

    const { data: input, success } = appointmentSchema.safeParse(data);
    if (!success) {
        throw Error("Er is een probleem met de data");
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

export async function validateCaptcha(token: string) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
    const { data, success: isCorrectType } = CaptchaResponse.safeParse(await response.json());
    const success = isCorrectType && data.success && data.score > 0.5;

    if (!success) {
        throw new Error("Je bent een robot");
    }

    return success;
}
