import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPages(current: number, count: number) {
    const length = Math.min(3, count);
    const start = Math.max(1, Math.min(current - 1, count - length));
    return Array.from({ length }, (_, i) => start + i);
}

export function dateWithoutTime(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}