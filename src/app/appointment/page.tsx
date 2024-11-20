"use client";

import { appointmentSubmit } from "@/lib/actions";
import { useActionState } from "react";

export default function Appointment() {
    const [formState, formAction, isPending] = useActionState(appointmentSubmit, null);

    return (
        <main className="flex p-8 items-center flex-col">
            <h1 className="font-bold text-xl">Appointment</h1>
            <form className="flex gap-4 flex-col w-[clamp(10rem,70vw,30rem)]" action={formAction}>
                <label htmlFor="subject">Subject</label>
                <input className="p-1 border-2 border-blue-300 rounded-lg" id="subject" name="subject" type="text" required />


                <label htmlFor="description">Description</label>
                <textarea className="p-1 rounded-lg h-40 border-2 border-blue-300" id="description" name="description" />

                <label htmlFor="people_to_add">People to add:</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="people_to_add" type="text" name="people_to_add" />

                <label htmlFor="add_everyone">add everyone:</label>
                <input id="add_everyone" className="w-5 h-5" type="checkbox" name="add_everyone" />

                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <label htmlFor="date">Date</label>
                        <input className="w-[clamp(0.1rem,20vw,8rem)] p-1 rounded-lg border-2 border-blue-300" id="date" type="date" name="date" required />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="start_time">start Time</label>
                        <input className="w-[clamp(0.1rem,20vw,8rem)] p-1 rounded-lg border-2 border-blue-300" id="start_time" name="start_time" type="time" required />

                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="end_time">end Time</label>
                        <input className="w-[clamp(0.1rem,20vw,8rem)] p-1 rounded-lg border-2 border-blue-300" id="end_time" name="end_time" type="time" required />
                    </div>

                </div>


                <label htmlFor="location">Location</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="location" name="location" type="text" />

                {formState !== null && <p className="font-bold">{formState}</p>}
                <button type="submit" className="p-3 rounded-lg bg-blue-300 disabled:opacity-50" disabled={isPending}>appoint</button>
            </form>
        </main>
    );
}