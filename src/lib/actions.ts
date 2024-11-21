"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

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
            user: "2"
        });

    console.log(error);

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