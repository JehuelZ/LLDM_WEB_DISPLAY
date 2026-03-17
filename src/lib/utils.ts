
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

import { Announcement } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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

    // If the file is already small, don't bother
    if (file.size < 200 * 1024) return file;

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
                        // Maintain the original file extension if possible, or use the appropriate one
                        let newName = file.name;
                        const targetType = file.type || 'image/jpeg';
                        
                        // If we are forcing a conversion technically, but here we want to preserve type
                        // Only change extension if it's not a common image extension
                        const hasExt = /\.(jpg|jpeg|png|webp|svg)$/i.test(newName);
                        if (!hasExt) {
                            const ext = targetType.split('/')[1] || 'jpg';
                            newName = `${newName}.${ext}`;
                        }

                        const newFile = new File([blob], newName, {
                            type: targetType,
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    } else {
                        resolve(file); // Fallback to original
                    }
                }, file.type || 'image/jpeg', quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}
