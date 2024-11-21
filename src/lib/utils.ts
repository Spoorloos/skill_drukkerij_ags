import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getAppointmentTimes(date: Date, start: number, end: number, increment: number) {
    const appointmentTimes = [];
    const dateCloned = new Date(date);
    const now = new Date();

    dateCloned.setHours(start, 0, 0, 0);

    while (dateCloned.getHours() < end) {
        if (dateCloned > now) {
            appointmentTimes.push(new Date(dateCloned));
        }
        dateCloned.setMinutes(dateCloned.getMinutes() + increment);
    }

    return appointmentTimes;
}