"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function appointmentSubmit(state: string | null, formData: FormData) {
    "use server";

    const { error } = await supabase
        .from("appointment")
        .insert({
            "people_to_add": formData.get("people_to_add"),
            "subject": formData.get("subject"),
            "start": formData.get("start_time"),
            "end": formData.get("end_time"),
            "date": formData.get("date"),
            "user": "2"
        });

    return error
        ? "Failed to registered appointment."
        : "Successfully registered appointment!";
}