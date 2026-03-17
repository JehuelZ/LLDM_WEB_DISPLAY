
export type UserRole = 'admin' | 'member';
export type MemberType = 'brother' | 'sister' | 'youth' | 'married' | 'child';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    photoUrl?: string; // URL to profile image
    type: MemberType;
    isActive: boolean;
}

export type SlotTime = '5:00 AM' | '9:00 AM' | '6:30 PM' | '7:00 PM';
export type ServiceType =
    | 'consecration'
    | 'doctrine'
    | 'regular'
    | 'youth'
    | 'married'
    | 'children'
    | 'solos'
    | 'praise'
    | 'youth_english'
    | 'special';

export interface ScheduleValues {
    leaderId?: string; // For single leader slots
    leaderIds?: string[]; // For slots with multiple leaders (e.g. 9am)
}

export interface DailySchedule {
    id: string;
    date: string; // ISO Date YYYY-MM-DD
    dayName?: string; // Lunes, Martes...
    slots: {
        '5am': {
            leaderId: string;
            time?: string;
            endTime?: string;
            customLabel?: string;
            language?: 'es' | 'en';
        };
        '9am': {
            consecrationLeaderId: string;
            doctrineLeaderId: string;
            time?: string;
            endTime?: string;
            customLabel?: string;
            language?: 'es' | 'en';
            // Custom properties for Sunday School
            sundayType?: 'local' | 'exchange' | 'broadcast' | 'visitors';
            exchangeMinisterName?: string;
            churchOrigin?: string;
            visitorsLanguage?: 'es' | 'en';
            topic?: string;
        };
        '12pm'?: {
            leaderId: string;
            time?: string;
            endTime?: string;
            customLabel?: string;
            language?: 'es' | 'en';
        };
        'evening': {
            time: string;
            endTime?: string;
            type: ServiceType;
            leaderIds: string[]; // Can be 1 or multiple (e.g. 2 brothers, 2 sisters)
            doctrineLeaderId?: string; // New: Doctrine leader for youth/regular services
            topic?: string; // Specific topic if overridden
            language?: 'es' | 'en'; // Service language (Spanish/English)
            customLabel?: string;
        };
    };
}

export type ThemeType = 'orthodoxy' | 'apostolic_letter' | 'free' | 'history';

export interface WeeklyTheme {
    id: string;
    startDate: string;
    endDate: string;
    title: string;
    type: ThemeType;
    description?: string;
    fileUrl?: string; // PDF link
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    category?: 'general' | 'choir' | 'kids' | 'important';
    imageUrl?: string;
    active: boolean;
    priority: number;
    expiresAt?: string; // ISO Date string
}
