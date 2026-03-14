
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Announcement, DailySchedule, WeeklyTheme } from './types';
import { MOCK_ANNOUNCEMENTS, MOCK_MONTH_SCHEDULE, MOCK_THEME, MOCK_MEMBERS } from './constants';
import { supabase } from './supabaseClient';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    format,
    parseISO,
    addWeeks,
    isSameDay,
    subDays
} from 'date-fns';

export interface AppSettings {
    themeMode: 'light' | 'dark' | 'system';
    churchIcon: 'church' | 'cross' | 'star' | 'heart' | 'custom';
    customIconUrl?: string;
    primaryColor: string;
    showMinisterOnDisplay: boolean;
    language: 'es' | 'en';
    displayBgMode: 'official' | 'custom' | 'none';
    displayBgStyle: 'static' | 'dynamic'; // New: background pattern style
    displayBgUrl?: string; // New: Specific path from gallery
    displayCustomBgUrl?: string;
    churchLogoUrl?: string; // New: Application logo from gallery
    ministerName?: string;
    ministerPhone?: string;
    ministerEmail?: string;
    ministerAvatar?: string;
    countdownTitle?: string;
    countdownDate?: string;
    showCountdown?: boolean;
    countdownLogoUrl?: string; // New: Logo specific to the event
    countdownLogoFileId?: string; // For cloud cleanup
    countdownBgColor?: string;
    countdownAccentColor?: string;
    countdownBgImageUrl?: string;
    // NeonForge theme settings
    neonForgeVariant?: 'lime' | 'cyan' | 'amber';
    neonForgeCity?: string;  // legacy key (kept for backwards compat)
    neonForgeCityData?: { lat: number; lon: number; name: string; country: string };
    // Aqua theme settings
    aquaVariant?: 'teal' | 'violet' | 'emerald';
    iglesiaVariant?: 'light' | 'dark';
    iglesiaAnimation?: 'metro' | 'breathing' | 'fade';
    iglesiaAnimationSpeed?: number; // In seconds
    iglesiaSlideDuration?: number; // In seconds

    // Social Media
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    customSocialUrl?: string;
    customSocialLabel?: string;
    adminTheme?: 'classic' | 'tactile';
    displayPin?: string; // New: Access code for TV/Display mode
    displayTemplate?: 'iglesia' | 'cristal' | 'minimal' | 'nocturno' | 'neon';
    displayScale?: number; // New: Scale factor for TV displays (0.5 to 1.5)
    displayOffsetX?: number; // New: Manual horizontal adjustment
    displayOffsetY?: number; // New: Manual vertical adjustment
    displayAuthorizedEmails?: string[]; // New: List of emails allowed to use display mode
    lowPerformanceMode?: boolean; // New: Disable expensive visual effects for TVs
    customLogo1?: string;
    customLogo2?: string;
    customLogo3?: string;
    customLogo4?: string;
    customLogo1FileId?: string;
    customLogo2FileId?: string;
    customLogo3FileId?: string;
    customLogo4FileId?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    category: 'Varon' | 'Hermana' | 'Niño';
    member_group?: 'Casados' | 'Casadas' | 'Solos y Solas' | 'Jovenes' | 'Niños' | 'Niñas' | 'Administración';
    role: 'Miembro' | 'Administrador' | 'Ministro a Cargo' | 'Dirigente Coro Adultos' | 'Dirigente Coro Niños' | 'Responsable de Asistencia' | 'Encargado de Jóvenes' | 'Encargada de Jóvenes' | 'Responsable de Niños' | 'Dirigente del Coro';
    gender: 'Varon' | 'Hermana';
    status: 'Activo' | 'Inactivo' | 'Pendiente';
    lastActive: string;
    stats?: {
        attendance: { attended: number; total: number };
        participation: { led: number; total: number };
        punctuality: number;
    };
    medals?: number;
    nextPrivilege?: string;
    parentName?: string;
    privileges: ('admin' | 'monitor' | 'choir' | 'leader' | 'kids_leader' | 'kids_helper' | 'youth_leader')[];
    responsibilities?: { date: string; type: string; status: 'pending' | 'completed'; label: string }[];
    is_pre_registered?: boolean;
    bio?: string;
    createdAt?: string;
}

export interface CalendarStyles {
    template: 'iglesia' | 'cristal' | 'minimal' | 'nocturno' | 'neon';



    sundayColor: string;
    thursdayColor: string;
    special14thColor: string;
    showGlassEffect: boolean;
    fontFamily: 'outfit' | 'sora' | 'inter';
    fontSetIndex?: number;
}

export interface Uniform {
    id: string;
    name: string;
    description?: string;
    category: 'Adulto' | 'Niño';
    // Detalles específicos por género
    varones?: {
        traje?: string;
        pantalon?: string;
        camisa?: string;
        corbata?: string;
    };
    hermanas?: {
        toga?: string;
        chalina?: string;
        falda?: string;
        blusa?: string;
    };
    ninas?: {
        blusa?: string;
        falda?: string;
        chalina?: string;
    };
}

export interface KidsAssignment {
    serviceChild?: string;
    doctrineChild?: string;
    uniformId?: string;
    monitorId?: string;
    reconciliationLeaderId?: string;
    choirParticipation?: string;
}

export interface ChoirRehearsal {
    id: string;
    dayOfWeek: number; // 0-6
    time: string;
    location: string;
    notes?: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId?: string;
    targetRole?: string;
    subject?: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    senderName?: string;
}

export type AttendanceSession = '5am' | '9am' | 'evening';

export interface AttendanceRecord {
    id?: string;
    member_id: string;
    date: string;
    session_type: AttendanceSession;
    present: boolean;
    time?: string | null;
    created_at?: string;
    delivered_by?: string;
    collected_by?: string;
}

interface AppState {
    currentDate: string;
    monthlySchedule: Record<string, DailySchedule>;
    theme: WeeklyTheme;
    announcements: Announcement[];
    specialEventTitle: string;
    calendarStyles: CalendarStyles;
    settings: AppSettings;
    currentUser: UserProfile;
    minister: UserProfile;

    // Uniforms & Assignments
    uniforms: Uniform[];
    uniformSchedule: Record<string, string>; // date (YYYY-MM-DD) -> uniformId
    kidsAssignments: Record<string, KidsAssignment>; // date (YYYY-MM-DD) -> assignments
    rehearsals: ChoirRehearsal[];
    members: UserProfile[];
    messages: Message[];
    attendanceRecords: Record<string, AttendanceRecord[]>; // date -> records
    isLoading: boolean;
    authSession: any;

    // Actions
    setCurrentUser: (user: UserProfile) => void;
    setScheduleForDay: (date: string, schedule: DailySchedule) => void;
    setTheme: (theme: WeeklyTheme) => void;
    setAnnouncements: (announcements: Announcement[]) => void;
    addAnnouncement: (announcement: Announcement) => void;
    removeAnnouncement: (id: string) => void;
    setSpecialEventTitle: (title: string) => void;
    setCalendarStyles: (styles: Partial<CalendarStyles>) => void;
    setCurrentDate: (date: string) => void;
    setSettings: (settings: Partial<AppSettings>) => void;
    setMinister: (minister: Partial<UserProfile>) => void;

    // Uniform/Assignment Actions
    addUniform: (uniform: Uniform) => void;
    removeUniform: (id: string) => void;
    setUniformForDate: (date: string, uniformId: string) => void;
    setKidsAssignment: (date: string, assignment: KidsAssignment) => void;

    // Rehearsal Actions
    setRehearsals: (rehearsals: ChoirRehearsal[]) => void;
    addRehearsal: (rehearsal: ChoirRehearsal) => void;
    removeRehearsal: (id: string) => void;

    // Supabase Loaders
    loadAnnouncementsFromCloud: () => Promise<void>;
    loadDayScheduleFromCloud: (date: string) => Promise<void>;
    loadAllSchedulesFromCloud: () => Promise<void>;
    loadThemeFromCloud: () => Promise<void>;
    loadMembersFromCloud: () => Promise<void>;
    updateProfileInCloud: (userId: string, updates: Partial<UserProfile>) => Promise<boolean>;
    deleteMemberFromCloud: (userId: string) => Promise<boolean>;
    addMemberToCloud: (member: { name: string; email: string; phone?: string; role: string; gender: string; category: string; member_group?: string; avatar?: string; avatarUrl?: string; privileges?: string[]; bio?: string }) => Promise<boolean>;
    uploadAvatar: (userId: string, file: File) => Promise<string | null>;
    syncUserWithCloud: (authUserId: string) => Promise<void>;

    // New Cloud Actions
    saveAnnouncementToCloud: (ann: Partial<Announcement>) => Promise<void>;
    deleteAnnouncementFromCloud: (id: string) => Promise<void>;
    saveScheduleDayToCloud: (date: string, slots: DailySchedule['slots']) => Promise<void>;
    saveThemeToCloud: (theme: WeeklyTheme) => Promise<void>;
    loadUniformsFromCloud: () => Promise<void>;
    saveUniformToCloud: (name: string, category: 'Adulto' | 'Niño', varones?: any, hermanas?: any, ninas?: any) => Promise<void>;
    deleteUniformFromCloud: (id: string) => Promise<void>;
    saveUniformForDateToCloud: (date: string, uniformId: string | null) => Promise<void>;
    loadKidsAssignmentsFromCloud: (date: string) => Promise<void>;
    saveKidsAssignmentToCloud: (date: string, assignment: Partial<KidsAssignment>) => Promise<void>;
    loadSettingsFromCloud: () => Promise<void>;
    saveSettingsToCloud: (newSettings: Partial<AppSettings>) => Promise<void>;
    saveRecurringScheduleToCloud: (date: string, slot: '5am' | '9am_consecration' | '9am_doctrine' | 'evening' | 'evening_0' | 'evening_1', leaderId: string, recurrence: 'month' | 'next') => Promise<void>;
    seedMonthSchedule: () => Promise<void>;

    // Choir Rehearsal Cloud Actions
    loadRehearsalsFromCloud: () => Promise<void>;
    saveRehearsalToCloud: (reh: Partial<ChoirRehearsal>) => Promise<void>;
    deleteRehearsalFromCloud: (id: string) => Promise<void>;

    // Messaging & Auth Actions
    // Attendance Actions
    loadAttendanceFromCloud: (date: string) => Promise<void>;
    saveAttendanceToCloud: (records: AttendanceRecord[]) => Promise<void>;
    loadWeeklyAttendanceStats: () => Promise<any[]>;
    loadMonthlyGlobalAttendanceStats: () => Promise<any[]>;
    loadDetailedWeeklyStats: (days: string[]) => Promise<any[]>;

    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
    signOut: () => Promise<void>;
    sendCloudMessage: (msg: Partial<Message>) => Promise<void>;
    loadCloudMessages: () => Promise<void>;
    markMessageAsRead: (id: string) => Promise<void>;
    subscribeToMessages: () => () => void;
    subscribeToSettings: () => () => void;
    setAuthSession: (session: any) => void;
    createTestAccounts: () => Promise<void>;

    notification: { message: string, type: 'success' | 'error' | 'warning' | 'info' } | null;
    showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
    hideNotification: () => void;
    simulateUser: (email: string) => Promise<boolean>;
}

const INITIAL_USER: UserProfile = {
    id: 'admin-temp-id',
    name: 'Administrador',
    email: 'jairojehuel@gmail.com',
    phone: '',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
    category: 'Varon',
    member_group: 'Administración',
    role: 'Administrador',
    gender: 'Varon',
    status: 'Activo',
    lastActive: 'Hoy',
    stats: { attendance: { attended: 0, total: 0 }, participation: { led: 0, total: 0 }, punctuality: 100 },
    privileges: ['admin', 'choir', 'leader']
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentDate: new Date().toISOString().split('T')[0],
            monthlySchedule: MOCK_MONTH_SCHEDULE,
            theme: MOCK_THEME,
            announcements: MOCK_ANNOUNCEMENTS,
            specialEventTitle: 'Historia Recordación',
            calendarStyles: {
                template: 'cristal',
                sundayColor: '#3b82f6', // blue-500
                thursdayColor: '#10b981', // emerald-500
                special14thColor: '#ef4444', // red-500
                showGlassEffect: true,
                fontFamily: 'outfit',
            },
            settings: {
                themeMode: 'dark',
                churchIcon: 'custom',
                primaryColor: '#3b82f6',
                showMinisterOnDisplay: true,
                language: 'es',
                displayBgMode: 'official',
                displayBgStyle: 'static',
                showCountdown: false,
                countdownTitle: '',
                countdownDate: '',
                iglesiaVariant: 'light',
                facebookUrl: '',
                instagramUrl: '',
                youtubeUrl: '',
                customSocialUrl: '',
                customSocialLabel: '',
                displayPin: '0000',
                displayTemplate: 'cristal',
                displayScale: 1.0,
                displayAuthorizedEmails: ['jairojehuel@gmail.com'],
                adminTheme: 'classic',
                customLogo1: '',
                customLogo2: '',
                customLogo3: '',
                customLogo4: ''
            },
            currentUser: INITIAL_USER,
            minister: {
                id: 'minister-placeholder',
                name: 'Ministro Local',
                email: '',
                phone: '',
                avatar: 'https://ui-avatars.com/api/?name=Ministro+Local&background=random',
                category: 'Varon',
                role: 'Ministro a Cargo',
                gender: 'Varon',
                status: 'Activo',
                lastActive: 'Hoy',
                stats: { attendance: { attended: 0, total: 0 }, participation: { led: 0, total: 0 }, punctuality: 100 },
                privileges: ['leader']
            },

            uniforms: [],
            uniformSchedule: {},
            kidsAssignments: {},
            rehearsals: [],
            members: MOCK_MEMBERS,
            messages: [],
            attendanceRecords: {},
            isLoading: false,
            authSession: null,

            setCurrentUser: (user) => set({ currentUser: user }),

            setScheduleForDay: (date, schedule) =>
                set((state) => ({
                    monthlySchedule: {
                        ...state.monthlySchedule,
                        [date]: schedule
                    }
                })),

            setTheme: (theme) => set({ theme }),
            setAnnouncements: (announcements) => set({ announcements }),
            addAnnouncement: (announcement) => set((state) => ({
                announcements: [announcement, ...state.announcements]
            })),
            removeAnnouncement: (id) => set((state) => ({
                announcements: state.announcements.filter(a => a.id !== id)
            })),
            setSpecialEventTitle: (title) => set({ specialEventTitle: title }),
            setCalendarStyles: (styles) => set((state) => ({
                calendarStyles: { ...state.calendarStyles, ...styles }
            })),
            setCurrentDate: (date) => set({ currentDate: date }),
            setSettings: (settings) => set((state) => ({
                settings: { ...state.settings, ...settings }
            })),
            setMinister: (minister) => set((state) => ({
                minister: { ...state.minister, ...minister }
            })),

            addUniform: (uniform) => set((state) => ({ uniforms: [...state.uniforms, uniform] })),
            removeUniform: (id) => set((state) => ({ uniforms: state.uniforms.filter(u => u.id !== id) })),
            setUniformForDate: (date, uniformId) => set((state) => ({
                uniformSchedule: { ...state.uniformSchedule, [date]: uniformId }
            })),
            setKidsAssignment: (date, assignment) => set((state) => ({
                kidsAssignments: { ...state.kidsAssignments, [date]: assignment }
            })),

            setRehearsals: (rehearsals) => set({ rehearsals }),
            addRehearsal: (rehearsal) => set((state) => ({ rehearsals: [...state.rehearsals, rehearsal] })),
            removeRehearsal: (id) => set((state) => ({ rehearsals: state.rehearsals.filter(r => r.id !== id) })),

            loadAnnouncementsFromCloud: async () => {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('is_active', true)
                    .order('priority', { ascending: false });

                if (data) {
                    // Map Supabase fields to local store fields if necessary
                    const mapped = data.map((ann: any) => ({
                        id: ann.id,
                        title: ann.title,
                        content: ann.content,
                        timestamp: ann.created_at,
                        category: ann.category,
                        active: ann.is_active,
                        priority: ann.priority,
                        imageUrl: ann.image_url,
                        expiresAt: ann.expires_at
                    }));
                    set({ announcements: mapped });
                }
            },

            loadDayScheduleFromCloud: async (date) => {
                const { data: data, error } = await supabase
                    .from('schedule')
                    .select('*')
                    .eq('date', date)
                    .single();

                if (data) {
                    // Parse sundayType from topic field (format: "dominical:TYPE")
                    const parseSundayType = (topic: string | null) => {
                        if (topic && topic.startsWith('dominical:')) {
                            return topic.replace('dominical:', '') as 'local' | 'exchange' | 'broadcast' | 'visitors';
                        }
                        return undefined;
                    };
                    set((state) => ({
                        monthlySchedule: {
                            ...state.monthlySchedule,
                            [date]: {
                                id: data.id,
                                date: data.date,
                                slots: {
                                    '5am': {
                                        leaderId: data.five_am_leader_id || '',
                                        time: data.five_am_time || '05:00 AM',
                                        endTime: data.five_am_end_time || '05:30 AM',
                                        customLabel: data.five_am_custom_label,
                                        language: data.five_am_language || 'es'
                                    },
                                    '9am': {
                                        consecrationLeaderId: data.nine_am_consecration_leader_id || '',
                                        doctrineLeaderId: data.nine_am_doctrine_leader_id || '',
                                        time: data.nine_am_time || '09:00 AM',
                                        endTime: data.nine_am_end_time || '10:00 AM',
                                        customLabel: data.nine_am_custom_label,
                                        language: data.nine_am_language || 'es',
                                        sundayType: parseSundayType(data.topic)
                                    },
                                    '12pm': data.noon_leader_id ? {
                                        leaderId: data.noon_leader_id || '',
                                        time: data.noon_time || '12:00 PM',
                                        endTime: data.noon_end_time || '01:00 PM',
                                        customLabel: data.noon_custom_label
                                    } : undefined,
                                    'evening': {
                                        time: data.evening_service_time || '07:00 PM',
                                        endTime: data.evening_service_end_time || '08:30 PM',
                                        type: data.evening_service_type || 'regular',
                                        language: data.evening_service_language || 'es',
                                        leaderIds: data.evening_leader_ids || [],
                                        doctrineLeaderId: data.evening_doctrine_leader_id || '',
                                        topic: parseSundayType(data.topic) ? undefined : data.topic,
                                        customLabel: data.evening_custom_label
                                    }
                                }
                            }
                        }
                    }));
                }
            },

            loadAllSchedulesFromCloud: async () => {
                const { data, error } = await supabase
                    .from('schedule')
                    .select('*');

                if (data) {
                    // Parse sundayType from topic field (format: "dominical:TYPE")
                    const parseSundayType = (topic: string | null) => {
                        if (topic && topic.startsWith('dominical:')) {
                            return topic.replace('dominical:', '') as 'local' | 'exchange' | 'broadcast' | 'visitors';
                        }
                        return undefined;
                    };
                    const newSchedule: Record<string, DailySchedule> = {};
                    data.forEach((entry: any) => {
                        const sundayType = parseSundayType(entry.topic);
                        const isSunday = new Date(entry.date + 'T12:00:00').getDay() === 0;

                        newSchedule[entry.date] = {
                            id: entry.id,
                            date: entry.date,
                            slots: {
                                '5am': {
                                    leaderId: entry.five_am_leader_id || '',
                                    time: entry.five_am_time || '05:00 AM',
                                    endTime: entry.five_am_end_time || '05:30 AM',
                                    customLabel: entry.five_am_custom_label,
                                    language: entry.five_am_language || 'es'
                                },
                                '9am': {
                                    consecrationLeaderId: entry.nine_am_consecration_leader_id || '',
                                    doctrineLeaderId: entry.nine_am_doctrine_leader_id || '',
                                    time: entry.nine_am_time || (isSunday ? '10:00 AM' : '09:00 AM'),
                                    endTime: entry.nine_am_end_time || (isSunday ? '12:00 PM' : '10:15 AM'),
                                    customLabel: entry.nine_am_custom_label,
                                    language: entry.nine_am_language || 'es',
                                    sundayType: sundayType
                                },
                                '12pm': entry.noon_leader_id ? {
                                    leaderId: entry.noon_leader_id || '',
                                    time: entry.noon_time || '12:00 PM',
                                    endTime: entry.noon_end_time || '01:00 PM',
                                    customLabel: entry.noon_custom_label
                                } : undefined,
                                'evening': {
                                    time: entry.evening_service_time || '07:00 PM',
                                    endTime: entry.evening_service_end_time || '08:30 PM',
                                    type: entry.evening_service_type || 'regular',
                                    language: entry.evening_service_language || 'es',
                                    leaderIds: entry.evening_leader_ids || [],
                                    doctrineLeaderId: entry.evening_doctrine_leader_id || '',
                                    topic: sundayType ? undefined : entry.topic,
                                    customLabel: entry.evening_custom_label
                                }
                            }
                        };
                    });
                    set({ monthlySchedule: newSchedule });
                }
            },

            loadThemeFromCloud: async () => {
                const today = new Date().toISOString().split('T')[0];
                const { data, error } = await supabase
                    .from('weekly_themes')
                    .select('*')
                    .lte('start_date', today)
                    .gte('end_date', today)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (data && data.length > 0) {
                    const latest = data[0];
                    set({
                        theme: {
                            id: latest.id,
                            title: latest.title,
                            description: latest.description || '',
                            startDate: latest.start_date,
                            endDate: latest.end_date,
                            type: latest.type as any,
                            fileUrl: latest.file_url
                        }
                    });
                }
            },

            loadMembersFromCloud: async () => {
                set({ isLoading: true });
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*');

                    if (error) {
                        set({ isLoading: false });
                        return;
                    }

                    if (data) {
                        const mapped = data.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            email: p.email,
                            phone: p.phone,
                            avatar: p.avatar_url,
                            avatarUrl: p.avatar_url,
                            category: p.category,
                            member_group: p.member_group,
                            role: p.role || 'Miembro',
                            gender: p.gender || 'Varon',
                            status: p.status || 'Activo',
                            lastActive: p.last_active || 'Hoy',
                            createdAt: p.created_at,
                            stats: p.stats || { attendance: { attended: 0, total: 1 }, participation: { led: 0, total: 1 }, punctuality: 0 },
                            privileges: p.roles || [],
                            is_pre_registered: p.is_pre_registered || false,
                            bio: p.bio || ''
                        }));

                        // Sincronizar estado del Ministro si se encuentra en la lista oficial
                        const foundMinister = mapped.find(m => m.role === 'Ministro a Cargo');
                        if (foundMinister) {
                            set({
                                minister: {
                                    ...get().minister,
                                    id: foundMinister.id,
                                    name: foundMinister.name,
                                    avatar: foundMinister.avatar || get().minister.avatar,
                                    email: foundMinister.email,
                                    phone: foundMinister.phone
                                }
                            });
                        }

                        set({ members: mapped, isLoading: false });
                    }
                } catch (err) {
                    set({ isLoading: false });
                }
            },

            updateProfileInCloud: async (userId, updates) => {
                const dbUpdates: any = {};
                if (updates.name) dbUpdates.name = updates.name;
                if (updates.email) dbUpdates.email = updates.email;
                if (updates.phone) dbUpdates.phone = updates.phone;
                if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
                if ((updates as any).avatarUrl) dbUpdates.avatar_url = (updates as any).avatarUrl;
                if (updates.category) dbUpdates.category = updates.category;
                if (updates.member_group) dbUpdates.member_group = updates.member_group;
                if (updates.role) dbUpdates.role = updates.role;
                if (updates.gender) dbUpdates.gender = updates.gender;
                if (updates.status) dbUpdates.status = updates.status;
                if (updates.stats) dbUpdates.stats = updates.stats;
                if (updates.privileges) dbUpdates.roles = updates.privileges;
                if (updates.bio) dbUpdates.bio = updates.bio;

                const { error } = await supabase
                    .from('profiles')
                    .update(dbUpdates)
                    .eq('id', userId)
                    .select(); // Re-select to confirm success under RLS

                if (error) {
                    console.error('CRITICAL: Profile Update Failed:', error.message, error.details);
                    
                    // Specific handling for RLS violation - usually means session sync issue
                    if (error.message.includes('row-level security') || error.code === '42501') {
                        alert("🔴 Error de Seguridad: No tienes permisos persistentes para editar este perfil. Por favor, CIERRA SESIÓN y vuelve a entrar para sincronizar tus credenciales de Administrador.");
                    } else {
                        alert(`Error al guardar: ${error.message}`);
                    }
                    return false;
                }

                // NOTIFICAR AL USUARIO SI HA SIDO ACTIVADO
                if (updates.status === 'Activo') {
                    await supabase.from('messages').insert({
                        receiver_id: userId,
                        subject: '¡Tu cuenta ha sido activada!',
                        content: 'Ya puedes acceder a todas las funciones del Tablero Digital LLDM Rodeo.'
                    });
                }

                return true;
            },

            deleteMemberFromCloud: async (userId) => {
                const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', userId);

                if (error) {
                    console.error('Error deleting member:', error);
                    return false;
                }
                return true;
            },

            createMemberInCloud: async (memberData: Partial<UserProfile>) => {
                const { error } = await supabase
                    .from('profiles')
                    .insert({
                        name: memberData.name,
                        email: memberData.email,
                        phone: memberData.phone,
                        gender: memberData.gender,
                        member_group: memberData.member_group,
                        role: memberData.role,
                        category: memberData.category || 'Varon',
                        status: memberData.status || 'Activo',
                        avatar_url: memberData.avatar || 'https://via.placeholder.com/150',
                        bio: memberData.bio || ''
                    });

                if (error) {
                    console.error('Error creating member:', error);
                    return false;
                }

                // Refresh local members list
                get().loadMembersFromCloud();
                return true;
            },

            uploadAvatar: async (userId, file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}-${Date.now()}.${fileExt}`;
                const filePath = fileName;

                console.log('Attempting upload to bucket "avatars" at path:', filePath);

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file, {
                        upsert: true,
                        contentType: file.type,
                        cacheControl: '3600'
                    });

                if (uploadError) {
                    console.error('CRITICAL: Avatar Upload Failed:', uploadError);
                    alert(`Error al subir imagen: ${uploadError.message}. Verifique si el bucket "avatars" existe en Supabase y tiene permisos públicos.`);
                    return null;
                }

                const { data } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                console.log('Avatar uploaded successfully:', data.publicUrl);
                return data.publicUrl;
            },

            syncUserWithCloud: async (authUserId) => {
                // BYPASS for Test Accounts - Keep the currentUser as assigned during login
                if (get().currentUser?.email?.includes('_test@lldmrodeo.org')) {
                    console.log("Sync bypass for test account:", get().currentUser.email);
                    return;
                }

                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const userEmail = authUser.email?.toLowerCase();
                const userName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Usuario Nuevo';
                const userAvatar = authUser.user_metadata?.avatar_url || '';
                const MASTER_ADMIN_EMAIL = 'jairojehuel@gmail.com';

                // 1. Intentar buscar perfil existente por email (insensible a mayúsculas)
                let { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .ilike('email', userEmail || '')
                    .maybeSingle();

                if (existingProfile) {
                    // Si el perfil existe pero no tiene el ID de autenticación vinculado, lo vinculamos
                    // Usamos auth_user_id para el vínculo, NO el id primario para evitar colisiones y errores de FK
                    if (existingProfile.auth_user_id !== authUser.id) {
                        const { error: linkError } = await supabase
                            .from('profiles')
                            .update({ 
                                auth_user_id: authUser.id,
                                is_pre_registered: false // Ya no es un pre-registro una vez vinculado
                            })
                            .eq('id', existingProfile.id);
                        
                        if (linkError) {
                            console.error("Error linking profile to auth account:", linkError.message);
                        }
                    }

                    // Si es el correo del Administrador Maestro, aseguramos privilegios
                    if (userEmail === MASTER_ADMIN_EMAIL) {
                        const JAIRO_NAME = 'Jairo Zelaya';
                        const needsUpdate = existingProfile.role !== 'Administrador' || existingProfile.name !== JAIRO_NAME;

                        if (needsUpdate) {
                            await supabase
                                .from('profiles')
                                .update({
                                    role: 'Administrador',
                                    name: JAIRO_NAME,
                                    roles: ['admin', 'leader'],
                                    avatar_url: '' // Force empty to avoid Google photo fallback
                                })
                                .eq('id', authUser.id);

                            existingProfile.role = 'Administrador';
                            existingProfile.name = JAIRO_NAME;
                            existingProfile.roles = ['admin', 'leader'];
                            existingProfile.avatar_url = '';
                        }
                    }

                    // Asegurar que Keren Hernandez tenga su rol de Responsable de Asistencia
                    if (userEmail === 'keren@lldmrodeo.org' && (existingProfile.role !== 'Responsable de Asistencia' || !existingProfile.roles?.includes('monitor'))) {
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                role: 'Responsable de Asistencia',
                                roles: Array.from(new Set([...(existingProfile.roles || []), 'monitor']))
                            })
                            .eq('id', existingProfile.id);

                        if (!updateError) {
                            existingProfile.role = 'Responsable de Asistencia';
                            existingProfile.roles = Array.from(new Set([...(existingProfile.roles || []), 'monitor']));
                        }
                    }

                    // Asegurar roles de Encargados de Jóvenes
                    const YOUTH_LEADERS = ['abraham@example.com', 'rebeca@example.com'];
                    if (YOUTH_LEADERS.includes(userEmail || '') && (existingProfile.role !== 'Encargado de Jóvenes' || !existingProfile.roles?.includes('youth_leader'))) {
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                role: 'Encargado de Jóvenes',
                                roles: Array.from(new Set([...(existingProfile.roles || []), 'youth_leader']))
                            })
                            .eq('id', existingProfile.id);

                        if (!updateError) {
                            existingProfile.role = 'Encargado de Jóvenes';
                            existingProfile.roles = Array.from(new Set([...(existingProfile.roles || []), 'youth_leader']));
                        }
                    }

                    set({
                        currentUser: {
                            id: existingProfile.id,
                            name: existingProfile.name,
                            email: existingProfile.email,
                            phone: existingProfile.phone || '',
                            avatar: (existingProfile.avatar_url === null) ? userAvatar : existingProfile.avatar_url,
                            category: existingProfile.category || 'Varon',
                            member_group: existingProfile.member_group,
                            role: existingProfile.role || 'Miembro',
                            gender: existingProfile.gender || 'Varon',
                            status: existingProfile.status || 'Activo',
                            lastActive: new Date().toISOString(),
                            stats: existingProfile.stats || { attendance: { attended: 0, total: 1 }, participation: { led: 0, total: 1 }, punctuality: 0 },
                            privileges: existingProfile.roles || [],
                            bio: existingProfile.bio || ''
                        }
                    });
                } else {
                    // 2. Si NO existe el perfil, lo creamos automáticamente
                    const isMasterAdmin = userEmail === MASTER_ADMIN_EMAIL;

                    const newProfile = {
                        id: authUserId,
                        email: userEmail,
                        name: userName,
                        avatar_url: userAvatar,
                        role: isMasterAdmin ? 'Administrador' : 'Miembro',
                        status: isMasterAdmin ? 'Activo' : 'Pendiente', // Nuevos usuarios quedan pendientes
                        category: 'Varon',
                        stats: { attendance: { attended: 0, total: 0 }, participation: { led: 0, total: 0 }, punctuality: 100 },
                        roles: isMasterAdmin ? ['admin', 'leader'] : []
                    };

                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert(newProfile);

                    if (!insertError) {
                        set({
                            currentUser: {
                                ...INITIAL_USER,
                                ...newProfile,
                                id: authUserId,
                                avatar: userAvatar,
                                privileges: newProfile.roles
                            } as UserProfile
                        });

                        // NOTIFICAR A ADMINISTRADORES
                        if (!isMasterAdmin) {
                            await supabase.from('messages').insert({
                                sender_id: authUserId,
                                target_role: 'Administrador',
                                subject: 'Nuevo Registro de Miembro',
                                content: `El hermano(a) ${userName} (${userEmail}) se ha registrado y está esperando aprobación.`
                            });
                        }
                    }
                }
            },

            addMemberToCloud: async (member) => {
                const insertData: any = {
                    name: member.name,
                    is_pre_registered: true // Por defecto, si el admin lo crea, está pre-registrado
                };
                if (member.email) insertData.email = member.email;
                if (member.phone) insertData.phone = member.phone;
                if (member.role) insertData.role = member.role;
                if (member.gender) insertData.gender = member.gender;
                if (member.category) insertData.category = member.category;
                if (member.member_group) insertData.member_group = member.member_group;
                if (member.avatar) insertData.avatar_url = member.avatar;
                if (member.avatarUrl) insertData.avatar_url = member.avatarUrl;
                if (member.privileges) insertData.roles = member.privileges;
                if (member.bio) insertData.bio = member.bio;

                console.log('Adding member:', insertData);

                const { error } = await supabase.from('profiles').insert(insertData);

                if (error) {
                    console.error('Error adding member:', error.message, error.details, error.hint, error.code);
                    alert(`Error al registrar miembro: ${error.message}`);
                    return false;
                }

                console.log('Member added successfully!');
                await get().loadMembersFromCloud();
                return true;
            },

            saveAnnouncementToCloud: async (ann) => {
                const dbAnn = {
                    title: ann.title,
                    content: ann.content,
                    category: ann.category,
                    priority: ann.priority,
                    image_url: ann.imageUrl,
                    is_active: ann.active ?? true,
                    expires_at: ann.expiresAt
                };

                if (ann.id) {
                    await supabase.from('announcements').update(dbAnn).eq('id', ann.id);
                } else {
                    await supabase.from('announcements').insert(dbAnn);
                }
                get().loadAnnouncementsFromCloud();
            },

            deleteAnnouncementFromCloud: async (id) => {
                await supabase.from('announcements').delete().eq('id', id);
                get().loadAnnouncementsFromCloud();
            },

            saveScheduleDayToCloud: async (date, slots) => {
                // 1. Fetch existing record to preserve other fields (topic, uniform_id, etc.)
                const { data: existing } = await supabase
                    .from('schedule')
                    .select('*')
                    .eq('date', date)
                    .single();

                const cleanUuid = (id: string | null) => (id && id.length > 5) ? id : null;
                const generateId = () => {
                    try { return crypto.randomUUID(); }
                    catch (e) { return Math.random().toString(36).substring(2) + Date.now().toString(36); }
                };

                const dbSchedule = {
                    date,
                    five_am_leader_id: cleanUuid(slots['5am'].leaderId),
                    five_am_time: slots['5am'].time,
                    five_am_end_time: slots['5am'].endTime,
                    five_am_custom_label: slots['5am'].customLabel,
                    five_am_language: (slots['5am'] as any).language || 'es',

                    nine_am_consecration_leader_id: cleanUuid(slots['9am'].consecrationLeaderId),
                    nine_am_doctrine_leader_id: cleanUuid(slots['9am'].doctrineLeaderId),
                    nine_am_time: slots['9am'].time,
                    nine_am_end_time: slots['9am'].endTime,
                    nine_am_custom_label: slots['9am'].customLabel,
                    nine_am_language: (slots['9am'] as any).language || 'es',

                    noon_leader_id: slots['12pm'] ? cleanUuid(slots['12pm'].leaderId) : null,
                    noon_time: slots['12pm']?.time,
                    noon_end_time: slots['12pm']?.endTime,
                    noon_custom_label: slots['12pm']?.customLabel,

                    evening_service_time: slots.evening.time,
                    evening_service_end_time: slots.evening.endTime,
                    evening_service_type: slots.evening.type,
                    evening_service_language: (slots.evening as any).language || 'es',
                    evening_leader_ids: slots.evening.leaderIds.map(cleanUuid).filter(Boolean),
                    evening_doctrine_leader_id: cleanUuid(slots.evening.doctrineLeaderId || null),
                    evening_custom_label: slots.evening.customLabel,

                    topic: slots['9am'].sundayType
                        ? `dominical:${slots['9am'].sundayType}`
                        : (slots.evening.topic && !slots.evening.topic.startsWith('dominical:')
                            ? slots.evening.topic
                            : (existing?.topic && !existing.topic.startsWith('dominical:') ? existing.topic : ''))
                } as any;

                // Always provide an ID to satisfy the NOT NULL constraint
                dbSchedule.id = existing?.id || generateId();

                const { error } = await supabase.from('schedule').upsert(dbSchedule, { onConflict: 'date' });

                if (error) {
                    console.error("Error saving schedule:", error.message, error.details, error.hint);
                    throw new Error(error.message);
                } else {
                    get().loadDayScheduleFromCloud(date);
                }
            },

            saveThemeToCloud: async (theme) => {
                // Ensure dates are simple YYYY-MM-DD
                const sd = theme.startDate.includes('T') ? theme.startDate.split('T')[0] : theme.startDate;
                const ed = theme.endDate.includes('T') ? theme.endDate.split('T')[0] : theme.endDate;

                const dbTheme = {
                    start_date: sd,
                    end_date: ed,
                    title: theme.title,
                    description: theme.description,
                    type: theme.type,
                    file_url: theme.fileUrl
                };

                try {
                    if (theme.id && theme.id !== 'initial-theme') {
                        const { error } = await supabase.from('weekly_themes').update(dbTheme).eq('id', theme.id);
                        if (error) throw error;
                    } else {
                        const { error } = await supabase.from('weekly_themes').insert(dbTheme);
                        if (error) throw error;
                    }
                    // Immediate refresh to get the UUID in the state
                    await get().loadThemeFromCloud();
                } catch (error: any) {
                    console.error('Error saving theme:', error.message);
                    throw error;
                }
            },

            loadUniformsFromCloud: async () => {
                const { data } = await supabase.from('uniforms').select('*');
                if (data) {
                    const mapped = data.map(u => ({
                        id: u.id,
                        name: u.name,
                        category: u.category,
                        varones: u.varones,
                        hermanas: u.hermanas,
                        ninas: u.ninas
                    }));
                    set({ uniforms: mapped });

                    // Load schedule too
                    const { data: scheduleData } = await supabase.from('uniform_schedule').select('*');
                    if (scheduleData) {
                        const sMap: Record<string, string> = {};
                        scheduleData.forEach(s => { sMap[s.date] = s.uniform_id; });
                        set({ uniformSchedule: sMap });
                    }
                }
            },

            saveUniformToCloud: async (name, category, varones, hermanas, ninas) => {
                await supabase.from('uniforms').insert({ name, category, varones, hermanas, ninas });
                get().loadUniformsFromCloud();
            },

            deleteUniformFromCloud: async (id) => {
                await supabase.from('uniforms').delete().eq('id', id);
                get().loadUniformsFromCloud();
            },

            saveUniformForDateToCloud: async (date, uniformId) => {
                if (uniformId) {
                    await supabase.from('uniform_schedule').upsert({ date, uniform_id: uniformId });
                } else {
                    await supabase.from('uniform_schedule').delete().eq('date', date);
                }
                get().loadUniformsFromCloud();
            },

            loadKidsAssignmentsFromCloud: async (date) => {
                const { data } = await supabase.from('kids_assignments').select('*').eq('date', date).single();
                if (data) {
                    const updated = { ...get().kidsAssignments };
                    updated[date] = {
                        monitorId: data.monitor_id,
                        reconciliationLeaderId: data.reconciliation_leader_id,
                        serviceChild: data.service_child_id,
                        doctrineChild: data.doctrine_child_id,
                        uniformId: data.uniform_id,
                        choirParticipation: data.choir_participation
                    };
                    set({ kidsAssignments: updated });
                }
            },

            saveKidsAssignmentToCloud: async (date, assignment) => {
                const dbAss = {
                    date,
                    monitor_id: assignment.monitorId,
                    reconciliation_leader_id: assignment.reconciliationLeaderId,
                    service_child_id: assignment.serviceChild,
                    doctrine_child_id: assignment.doctrineChild,
                    uniform_id: assignment.uniformId,
                    choir_participation: assignment.choirParticipation
                };
                await supabase.from('kids_assignments').upsert(dbAss);
                get().loadKidsAssignmentsFromCloud(date);
            },

            loadSettingsFromCloud: async () => {
                const { data } = await supabase.from('app_settings').select('*').eq('id', 1).single();
                if (data) {
                    const current = get().settings;
                    set({
                        settings: {
                            ...current,
                            themeMode: data.theme_mode,
                            language: data.language,
                            churchIcon: data.church_icon,
                            customIconUrl: data.custom_icon_url,
                            primaryColor: data.primary_color,
                            showMinisterOnDisplay: data.show_minister_on_display,
                            displayBgMode: data.display_bg_mode || 'official',
                            displayBgStyle: data.display_bg_style || 'static',
                            displayBgUrl: data.display_bg_url || '/flama-oficial.svg',
                            displayCustomBgUrl: data.display_custom_bg_url,
                            churchLogoUrl: data.church_logo_url || '/flama-oficial.svg',
                            ministerName: data.minister_name,
                            ministerPhone: data.minister_phone,
                            ministerEmail: data.minister_email,
                            ministerAvatar: data.minister_avatar,
                            countdownTitle: data.countdown_title,
                            countdownDate: data.countdown_date,
                            showCountdown: data.show_countdown,
                            countdownLogoUrl: data.countdown_logo_url || '/flama-oficial.svg',
                            countdownBgColor: data.countdown_bg_color || '#ffffff',
                            countdownAccentColor: data.countdown_accent_color || '#d4af37',
                            countdownBgImageUrl: data.countdown_bg_image_url,
                            displayAuthorizedEmails: data.display_authorized_emails || ['jairojehuel@gmail.com'],
                            displayPin: data.display_pin || '1922',
                            iglesiaVariant: data.iglesia_variant || 'light',
                            iglesiaAnimation: data.iglesia_animation || 'metro',
                            iglesiaAnimationSpeed: data.iglesia_animation_speed || 2.4,
                            iglesiaSlideDuration: data.iglesia_slide_duration || 12,
                            displayTemplate: data.display_template || 'cristal',
                            displayScale: data.display_scale || 1.0,
                            displayOffsetX: data.display_offset_x || 0,
                            displayOffsetY: data.display_offset_y || 0,
                            adminTheme: data.admin_theme || 'classic',
                            lowPerformanceMode: data.low_performance_mode || false,
                            customLogo1: data.custom_logo_1,
                            customLogo2: data.custom_logo_2,
                            customLogo3: data.custom_logo_3,
                            customLogo4: data.custom_logo_4
                        },



                        minister: {
                            ...get().minister,
                            name: data.minister_name || get().minister.name,
                            phone: data.minister_phone || get().minister.phone,
                            email: data.minister_email || get().minister.email,
                            avatar: data.minister_avatar || get().minister.avatar
                        },

                        // Sync calendarStyles.template from cloud displayTemplate
                        calendarStyles: {
                            ...get().calendarStyles,
                            template: (data.display_template || get().calendarStyles.template) as any
                        }
                    });
                }
            },

            saveSettingsToCloud: async (newSettings: Partial<AppSettings>) => {
                const current = get().settings;
                const updated = { ...current, ...newSettings };
                const dbSettings = {
                    theme_mode: updated.themeMode,
                    language: updated.language,
                    church_icon: updated.churchIcon,
                    custom_icon_url: updated.customIconUrl,
                    primary_color: updated.primaryColor,
                    show_minister_on_display: updated.showMinisterOnDisplay,
                    display_bg_mode: updated.displayBgMode,
                    display_bg_style: updated.displayBgStyle,
                    display_bg_url: updated.displayBgUrl,
                    display_custom_bg_url: updated.displayCustomBgUrl,
                    church_logo_url: updated.churchLogoUrl,
                    minister_name: updated.ministerName,
                    minister_phone: updated.ministerPhone,
                    minister_email: updated.ministerEmail,
                    minister_avatar: updated.ministerAvatar,
                    countdown_title: updated.countdownTitle,
                    countdown_date: updated.countdownDate,
                    show_countdown: updated.showCountdown,
                    countdown_logo_url: updated.countdownLogoUrl,
                    countdown_bg_color: updated.countdownBgColor,
                    countdown_accent_color: updated.countdownAccentColor,
                    countdown_bg_image_url: updated.countdownBgImageUrl,
                    display_authorized_emails: updated.displayAuthorizedEmails,
                    display_pin: updated.displayPin,
                    iglesia_variant: updated.iglesiaVariant,
                    iglesia_animation: updated.iglesiaAnimation,
                    iglesia_animation_speed: updated.iglesiaAnimationSpeed,
                    iglesia_slide_duration: updated.iglesiaSlideDuration,
                    display_template: updated.displayTemplate,
                    display_scale: updated.displayScale,
                    display_offset_x: updated.displayOffsetX,
                    display_offset_y: updated.displayOffsetY,
                    admin_theme: updated.adminTheme,
                    low_performance_mode: updated.lowPerformanceMode,
                    custom_logo_1: updated.customLogo1,
                    custom_logo_2: updated.customLogo2,
                    custom_logo_3: updated.customLogo3,
                    custom_logo_4: updated.customLogo4
                };



                set({ settings: updated });
                await supabase.from('app_settings').update(dbSettings).eq('id', 1);
            },

            signInWithGoogle: async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
                    }
                });
                if (error) console.error("Error signing in with Google:", error);
            },

            signInWithEmail: async (email, password) => {
                // TEST ACCOUNTS BYPASS - For rapid testing of dashboards
                if (password === 'Lldm2026!' && email.includes('_test@lldmrodeo.org')) {
                    const cleanEmail = email.toLowerCase().trim();
                    const mock = MOCK_MEMBERS.find(m => m.email?.toLowerCase().trim() === cleanEmail);
                    if (mock) {
                        const testUser = { ...mock, id: mock.id || `test-${Date.now()}` };
                        set({
                            currentUser: testUser,
                            authSession: {
                                user: {
                                    email: testUser.email,
                                    id: testUser.id,
                                    user_metadata: { name: testUser.name }
                                }
                            },
                        });
                        return { success: true, error: null };
                    }
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    console.error("Error signing in with email:", error);
                    return { success: false, error: error.message };
                }

                // State will be updated by handleAuthStateChange in app layout
                return { success: true, error: null };
            },

            signOut: async () => {
                await supabase.auth.signOut();
                set({ authSession: null, currentUser: INITIAL_USER });
            },

            sendCloudMessage: async (msg: Partial<Message>) => {
                const { error } = await supabase.from('messages').insert({
                    sender_id: msg.senderId,
                    receiver_id: msg.receiverId,
                    target_role: msg.targetRole,
                    subject: msg.subject,
                    content: msg.content
                });
                if (error) console.error("Error sending message:", error);
            },

            loadCloudMessages: async () => {
                const session = get().authSession;
                if (!session?.user) return;

                const isChoirMember = get().currentUser.privileges?.includes('choir') || get().currentUser.role.includes('Coro');
                const choirQuery = isChoirMember ? `,target_role.eq.'Coro'` : '';

                const { data, error } = await supabase
                    .from('messages')
                    .select('*, sender:profiles!sender_id(name)')
                    .or(`receiver_id.eq.${session.user.id},target_role.eq.'${get().currentUser.role}'${choirQuery}`)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error loading messages:", error);
                    return;
                }

                if (data) {
                    const mapped = data.map((m: any) => ({
                        id: m.id,
                        senderId: m.sender_id,
                        receiverId: m.receiver_id,
                        targetRole: m.target_role,
                        subject: m.subject,
                        content: m.content,
                        isRead: m.is_read,
                        createdAt: m.created_at,
                        senderName: m.sender?.name || 'Sistema'
                    }));
                    set({ messages: mapped });
                }
            },

            markMessageAsRead: async (id) => {
                await supabase.from('messages').update({ is_read: true }).eq('id', id);
                set(state => ({
                    messages: state.messages.map(m => m.id === id ? { ...m, isRead: true } : m)
                }));
            },

            subscribeToMessages: () => {
                const channel = supabase
                    .channel('messages_realtime')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                        const newMsg = payload.new as any;
                        const currentUser = get().currentUser;
                        const session = get().authSession;

                        // Solo procesar si el mensaje es para nosotros (por ID o por Rol)
                        const isForUs = (newMsg.receiver_id === session?.user?.id) ||
                            (newMsg.target_role === currentUser.role);

                        if (isForUs) {
                            get().loadCloudMessages(); // Recargar para obtener nombres de remitentes
                        }
                    })
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                };
            },

            subscribeToSettings: () => {
                const channel = supabase
                    .channel('settings_realtime')
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings' }, () => {
                        console.log("Settings updated in cloud, reloading...");
                        get().loadSettingsFromCloud();
                    })
                    .subscribe();
                return () => {
                    supabase.removeChannel(channel);
                };
            },

            setAuthSession: (session) => set({ authSession: session }),
            
            notification: null,
            showNotification: (message, type = 'success') => {
                set({ notification: { message, type } });
                setTimeout(() => get().hideNotification(), 4000);
            },
            hideNotification: () => set({ notification: null }),

            saveRecurringScheduleToCloud: async (baseDate, slot, leaderId, recurrence) => {
                const date = parseISO(baseDate);
                const dayOfWeek = getDay(date);
                const targetDates: string[] = [];

                if (recurrence === 'month') {
                    const start = startOfMonth(date);
                    const end = endOfMonth(date);
                    const days = eachDayOfInterval({ start, end });

                    days.forEach(d => {
                        if (getDay(d) === dayOfWeek) {
                            targetDates.push(format(d, 'yyyy-MM-dd'));
                        }
                    });
                } else if (recurrence === 'next') {
                    targetDates.push(format(addWeeks(date, 1), 'yyyy-MM-dd'));
                }

                if (targetDates.length === 0) return;

                // 1. Fetch existing data for these dates to avoid overwriting other slots
                const { data: existingSchedules, error: fetchError } = await supabase
                    .from('schedule')
                    .select('*')
                    .in('date', targetDates);

                if (fetchError) {
                    console.error("Error fetching existing schedules:", fetchError.message);
                }

                const existingMap = new Map();
                existingSchedules?.forEach(s => existingMap.set(s.date, s));

                const column = ({
                    '5am': 'five_am_leader_id',
                    '9am_consecration': 'nine_am_consecration_leader_id',
                    '9am_doctrine': 'nine_am_doctrine_leader_id',
                    'evening': 'evening_leader_ids',
                    'evening_0': 'evening_leader_ids',
                    'evening_1': 'evening_leader_ids',
                    '12pm': 'noon_leader_id'
                } as any)[slot];

                const generateId = () => {
                    try { return crypto.randomUUID(); }
                    catch (e) { return Math.random().toString(36).substring(2) + Date.now().toString(36); }
                };

                const updates = targetDates.map(d => {
                    const existing = existingMap.get(d) || {};
                    const data: any = {
                        id: existing.id || generateId(),
                        date: d,
                        five_am_leader_id: existing.five_am_leader_id || null,
                        five_am_time: existing.five_am_time || null,
                        five_am_end_time: existing.five_am_end_time || null,
                        five_am_custom_label: existing.five_am_custom_label || null,
                        five_am_language: existing.five_am_language || 'es',
                        nine_am_consecration_leader_id: existing.nine_am_consecration_leader_id || null,
                        nine_am_doctrine_leader_id: existing.nine_am_doctrine_leader_id || null,
                        nine_am_time: existing.nine_am_time || null,
                        nine_am_end_time: existing.nine_am_end_time || null,
                        nine_am_custom_label: existing.nine_am_custom_label || null,
                        nine_am_language: existing.nine_am_language || 'es',
                        noon_leader_id: existing.noon_leader_id || null,
                        noon_time: existing.noon_time || null,
                        noon_end_time: existing.noon_end_time || null,
                        noon_custom_label: existing.noon_custom_label || null,
                        evening_service_time: existing.evening_service_time || '07:00 PM',
                        evening_service_end_time: existing.evening_service_end_time || '08:30 PM',
                        evening_service_type: existing.evening_service_type || 'regular',
                        evening_service_language: existing.evening_service_language || 'es',
                        evening_leader_ids: existing.evening_leader_ids || [],
                        evening_custom_label: existing.evening_custom_label || null,
                        topic: existing.topic || ''
                    };

                    if (slot === 'evening' || slot === 'evening_0') {
                        const newIds = [...data.evening_leader_ids];
                        newIds[0] = leaderId;
                        data.evening_leader_ids = newIds.filter(Boolean);
                    } else if (slot === 'evening_1') {
                        const newIds = [...data.evening_leader_ids];
                        newIds[1] = leaderId;
                        data.evening_leader_ids = newIds.filter(Boolean);
                    } else if (slot === '5am') {
                        data.five_am_leader_id = leaderId;
                    } else if (slot === '9am_consecration') {
                        data.nine_am_consecration_leader_id = leaderId;
                    } else if (slot === '9am_doctrine') {
                        data.nine_am_doctrine_leader_id = leaderId;
                    }

                    return data;
                });

                console.log('Upserting recurring shifts:', updates);

                const { error } = await supabase.from('schedule').upsert(updates, { onConflict: 'date' });

                if (error) {
                    console.error("Error saving recurring schedule:", error.message, error.details, error.hint);
                    alert(`Error al guardar programación recurrente: ${error.message}`);
                } else {
                    console.log('Recurring schedule saved successfully');
                    // Refresh all to see changes across calendar
                    await get().loadAllSchedulesFromCloud();
                }
            },

            loadAttendanceFromCloud: async (date) => {
                const { data, error } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('date', date)
                    .order('id', { ascending: false });

                if (error) {
                    console.error("Error loading attendance:", error);
                    // Proporcionamos un mensaje más detallado para diagnóstico
                    alert(`Error de sincronización: ${error.message}. Por favor, verifica que la tabla 'attendance' existe en Supabase y que has ejecutado el script de reparación.`);
                    return;
                }

                if (data) {
                    set(state => ({
                        attendanceRecords: {
                            ...state.attendanceRecords,
                            [date]: data.map(r => ({
                                id: r.id,
                                member_id: r.member_id,
                                date: r.date,
                                session_type: r.session_type,
                                present: r.present,
                                time: r.time,
                                delivered_by: r.delivered_by,
                                collected_by: r.collected_by
                            }))
                        }
                    }));
                }
            },

            saveAttendanceToCloud: async (records) => {
                if (records.length === 0) return;

                // Dividimos los registros en los que se marcan (UPSERT) y los que se quitan (DELETE)
                // Para mantener la base de datos limpia, si quitamos una marca simple (sin datos de entrega/entrega), borramos.
                for (const r of records) {
                    if (!r.present && !r.delivered_by && !r.collected_by) {
                        const { error } = await supabase
                            .from('attendance')
                            .delete()
                            .match({
                                member_id: r.member_id,
                                date: r.date,
                                session_type: r.session_type
                            });
                        if (error) throw error;
                    } else {
                        // Construimos el objeto de guardado solo con campos que tengan valor
                        const payload: any = {
                            member_id: r.member_id,
                            date: r.date,
                            session_type: r.session_type,
                            present: r.present,
                            time: r.time
                        };

                        if (r.delivered_by) payload.delivered_by = r.delivered_by;
                        if (r.collected_by) payload.collected_by = r.collected_by;

                        const { error } = await supabase
                            .from('attendance')
                            .upsert(payload, { onConflict: 'member_id,date,session_type' });

                        if (error) throw error;
                    }
                }

                const date = records[0].date;
                await get().loadAttendanceFromCloud(date);
            },

            loadMonthlyAttendanceStats: async (memberId: string) => {
                const start = startOfMonth(new Date());
                const end = endOfMonth(new Date());

                const { data, error } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('member_id', memberId)
                    .gte('date', format(start, 'yyyy-MM-dd'))
                    .lte('date', format(end, 'yyyy-MM-dd'));

                if (error) return null;

                const stats = {
                    attended: data.filter(r => r.present).length,
                    total: data.length,
                    bySession: {
                        '5am': data.filter(r => r.session_type === '5am' && r.present).length,
                        '9am': data.filter(r => r.session_type === '9am' && r.present).length,
                        'evening': data.filter(r => r.session_type === 'evening' && r.present).length,
                    }
                };
                return stats;
            },

            loadWeeklyAttendanceStats: async () => {
                const now = new Date();
                const days = Array.from({ length: 7 }, (_, i) => format(subDays(now, 6 - i), 'yyyy-MM-dd'));

                const { data, error } = await supabase
                    .from('attendance')
                    .select('date, member_id')
                    .gte('date', days[0])
                    .lte('date', days[6]);

                if (error) return [];

                const totalMembers = get().members.length;

                return days.map(d => {
                    const dailyRecords = data?.filter(r => r.date === d) || [];
                    const uniqueAttended = new Set(dailyRecords.map(r => r.member_id)).size;
                    return {
                        date: d,
                        attended: uniqueAttended,
                        total: totalMembers,
                        percentage: totalMembers > 0 ? (uniqueAttended / totalMembers) * 100 : 0
                    };
                });
            },

            loadMonthlyGlobalAttendanceStats: async () => {
                const now = new Date();
                const days = Array.from({ length: 30 }, (_, i) => format(subDays(now, 29 - i), 'yyyy-MM-dd'));

                const { data, error } = await supabase
                    .from('attendance')
                    .select('date, member_id')
                    .gte('date', days[0])
                    .lte('date', days[29]);

                if (error) return [];

                const totalMembers = get().members.length;

                return days.map(d => {
                    const dailyRecords = data?.filter(r => r.date === d) || [];
                    const uniqueAttended = new Set(dailyRecords.map(r => r.member_id)).size;
                    return {
                        date: d,
                        attended: uniqueAttended,
                        total: totalMembers,
                        percentage: totalMembers > 0 ? (uniqueAttended / totalMembers) * 100 : 0
                    };
                });
            },
            loadDetailedWeeklyStats: async (days) => {
                if (days.length === 0) return [];
                
                const { data, error } = await supabase
                    .from('attendance')
                    .select('date, session_type, member_id')
                    .gte('date', days[0])
                    .lte('date', days[days.length - 1]);

                if (error) {
                    console.error("Error loading detailed stats:", error);
                    return [];
                }

                const totalMembers = get().members.filter(m => m.status === 'Activo').length;

                return days.map(d => {
                    const dailyRecords = data?.filter(r => r.date === d) || [];
                    
                    const getCount = (session: string) => {
                        return new Set(
                            dailyRecords
                                .filter(r => r.session_type === session)
                                .map(r => r.member_id)
                        ).size;
                    };

                    return {
                        date: d,
                        totalMembers,
                        sessions: {
                            '5am': getCount('5am'),
                            '9am': getCount('9am'),
                            'evening': getCount('evening')
                        }
                    };
                });
            },
            seedMonthSchedule: async () => {
                const now = new Date();
                const start = startOfMonth(now);
                const end = endOfMonth(now);
                const days = eachDayOfInterval({ start, end });

                const members = get().members;
                const getMember = (category?: string, group?: string, privilege?: string) => {
                    // Try to find someone matching ALL criteria
                    let filtered = members.filter(m =>
                        (!category || m.category === category) &&
                        (!group || m.member_group === group) &&
                        (!privilege || m.privileges.includes(privilege as any))
                    );

                    // Fallback 1: Match category and group
                    if (filtered.length === 0) {
                        filtered = members.filter(m =>
                            (!category || m.category === category) &&
                            (!group || m.member_group === group)
                        );
                    }

                    // Fallback 2: Match just category
                    if (filtered.length === 0) {
                        filtered = members.filter(m => !category || m.category === category);
                    }

                    if (filtered.length === 0) return null;
                    return filtered[Math.floor(Math.random() * filtered.length)].id;
                };

                const generateId = () => {
                    try { return crypto.randomUUID(); }
                    catch (e) { return undefined; } // Let Supabase generate it
                };

                const updates = days.map(d => {
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const dayOfWeek = getDay(d); // 0 = Sunday, 1 = Mon...

                    let eveningType: any = 'regular';
                    let eveningTime: any = '7:00 PM';
                    let leaderIds: string[] = [];

                    if (dayOfWeek === 0) { // Sunday
                        eveningType = 'married';
                        eveningTime = '6:00 PM';
                        leaderIds = [getMember('Varon', 'Casados'), getMember('Hermana', 'Casadas')].filter(Boolean) as string[];
                    } else if (dayOfWeek === 4) { // Thursday
                        eveningType = 'youth';
                        eveningTime = '6:30 PM';
                        leaderIds = [getMember('Varon', 'Jovenes')].filter(Boolean) as string[];
                    } else if (dayOfWeek === 6) { // Saturday
                        eveningType = 'children';
                        leaderIds = [getMember('Varon', undefined, 'kids_leader')].filter(Boolean) as string[];
                    } else {
                        leaderIds = [getMember('Varon')].filter(Boolean) as string[];
                    }

                    return {
                        id: generateId(),
                        date: dateStr,
                        five_am_leader_id: getMember('Varon'),
                        nine_am_consecration_leader_id: getMember('Hermana'),
                        nine_am_doctrine_leader_id: getMember('Hermana'),
                        evening_service_time: eveningTime,
                        evening_service_type: eveningType,
                        evening_leader_ids: leaderIds,
                        topic: ''
                    };
                });

                console.log(`Seeding ${updates.length} days for the month...`);
                const { error } = await supabase.from('schedule').upsert(updates, { onConflict: 'date' });

                if (error) {
                    console.error("Error seeding schedule:", error);
                    alert("Error al poblar el mes: " + error.message);
                } else {
                    await get().loadAllSchedulesFromCloud();
                    alert("Mes poblado exitosamente con datos realistas.");
                }
            },

            loadRehearsalsFromCloud: async () => {
                const { data, error } = await supabase
                    .from('choir_rehearsals')
                    .select('*')
                    .order('day_of_week', { ascending: true });

                if (data) {
                    const mapped = data.map((r: any) => ({
                        id: r.id,
                        dayOfWeek: r.day_of_week,
                        time: r.time,
                        location: r.location,
                        notes: r.notes
                    }));
                    set({ rehearsals: mapped });
                }
            },

            saveRehearsalToCloud: async (reh) => {
                const dbReh = {
                    day_of_week: reh.dayOfWeek,
                    time: reh.time,
                    location: reh.location,
                    notes: reh.notes
                };

                if (reh.id && reh.id.length > 10) { // Simple check for real UUID vs mock ID
                    await supabase.from('choir_rehearsals').update(dbReh).eq('id', reh.id);
                } else {
                    await supabase.from('choir_rehearsals').insert(dbReh);
                }
                await get().loadRehearsalsFromCloud();
            },

            deleteRehearsalFromCloud: async (id) => {
                await supabase.from('choir_rehearsals').delete().eq('id', id);
                await get().loadRehearsalsFromCloud();
            },

            createTestAccounts: async () => {
                const testAccounts = [
                    {
                        name: 'Test Asistencia',
                        email: 'asistencia_test@lldmrodeo.org',
                        role: 'Responsable de Asistencia',
                        category: 'Hermana',
                        gender: 'Hermana',
                        privileges: ['monitor'],
                        stats: { attendance: { attended: 48, total: 50 }, participation: { led: 20, total: 20 }, punctuality: 100 }
                    },
                    {
                        name: 'Test Coro',
                        email: 'coro_test@lldmrodeo.org',
                        role: 'Dirigente Coro Adultos',
                        category: 'Varon',
                        gender: 'Varon',
                        privileges: ['choir'],
                        stats: { attendance: { attended: 40, total: 50 }, participation: { led: 15, total: 15 }, punctuality: 95 }
                    },
                    {
                        name: 'Test Jóvenes',
                        email: 'jovenes_test@lldmrodeo.org',
                        role: 'Encargado de Jóvenes',
                        category: 'Varon',
                        gender: 'Varon',
                        privileges: ['youth_leader'],
                        stats: { attendance: { attended: 42, total: 50 }, participation: { led: 25, total: 25 }, punctuality: 99 }
                    },
                    {
                        name: 'Test Miembro',
                        email: 'miembro_test@lldmrodeo.org',
                        role: 'Miembro',
                        category: 'Varon',
                        gender: 'Varon',
                        privileges: [],
                        stats: { attendance: { attended: 35, total: 50 }, participation: { led: 5, total: 5 }, punctuality: 90 }
                    }
                ];

                let createdCount = 0;
                for (const account of testAccounts) {
                    const { data, error: fetchError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('email', account.email)
                        .maybeSingle();

                    if (!data) {
                        const { error: insertError } = await supabase
                            .from('profiles')
                            .insert({
                                ...account,
                                id: crypto.randomUUID(),
                                status: 'Activo',
                                last_active: new Date().toISOString(),
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=random`
                            });

                        if (!insertError) createdCount++;
                        else console.error(`Error creating ${account.name}:`, insertError);
                    }
                }

                alert(`Se crearon ${createdCount} cuentas de prueba. Las que ya existían no se duplicaron.`);
                await get().loadMembersFromCloud();
            },

            simulateUser: async (email: string) => {
                const member = get().members.find(m => m.email === email);
                if (member) {
                    set({ currentUser: member });
                    return true;
                }
                return false;
            },
        }),
        {
            name: 'lldm-rodeo-storage-v10',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
