
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
            language?: string;
        };
        '9am': {
            consecrationLeaderId: string;
            doctrineLeaderId: string;
            time?: string;
            endTime?: string;
            customLabel?: string;
            language?: string;
            sundayType?: 'local' | 'exchange' | 'broadcast' | 'visitors';
        };
        '12pm'?: {
            leaderId: string;
            time?: string;
            endTime?: string;
            customLabel?: string;
        };
        'evening': {
            time: string;
            type: ServiceType;
            leaderIds: string[];
            doctrineLeaderId?: string;
            topic?: string;
            customLabel?: string;
            language?: string;
            endTime?: string;
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
    expiresAt?: string;
}
