
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Announcement } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getActiveAnnouncements(announcements: Announcement[]) {
    const now = new Date();
    return announcements.filter(a => {
        if (!a.active) return false;
        if (a.expiresAt) {
            const expiry = new Date(a.expiresAt);
            // Include the whole day for simple YYYY-MM-DD strings
            if (a.expiresAt.length <= 10) {
                expiry.setHours(23, 59, 59, 999);
            }
            return now <= expiry;
        }
        return true;
    });
}
