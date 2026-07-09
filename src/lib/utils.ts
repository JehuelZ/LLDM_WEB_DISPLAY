
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

import { Announcement } from "./types";

import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function safeFormatDate(dateStr: any, fmt: string = 'dd MMM') {
    if (!dateStr || dateStr === 'Hoy' || dateStr === 'Ahora') return 'HOY';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'OFFLINE';
        return format(d, fmt, { locale: es }).toUpperCase();
    } catch {
        return 'OFFLINE';
    }
}

export function getLocalDateString(date: Date = new Date()) {
    // Uses date-fns format which respects local time by default
    return format(date, 'yyyy-MM-dd');
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

export async function compressImage(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8): Promise<File> {
    // Skip compression for SVG files (preserve vector nature and transparency)
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        return file;
    }

    // If the file is already a small WebP, don't bother compressing again
    if (file.type === 'image/webp' && file.size < 100 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        let newName = file.name;
                        const dotIndex = newName.lastIndexOf('.');
                        if (dotIndex !== -1) {
                            newName = newName.substring(0, dotIndex) + '.webp';
                        } else {
                            newName = newName + '.webp';
                        }

                        const newFile = new File([blob], newName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    } else {
                        resolve(file); // Fallback to original
                    }
                }, 'image/webp', quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}
