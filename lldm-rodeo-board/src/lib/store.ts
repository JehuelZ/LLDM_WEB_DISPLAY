
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Announcement, DailySchedule, WeeklyTheme } from './types';
import { MOCK_ANNOUNCEMENTS, MOCK_MONTH_SCHEDULE, MOCK_THEME } from './constants';
import { supabase } from './supabaseClient';

export interface AppSettings {
    themeMode: 'light' | 'dark' | 'system';
    churchIcon: 'shield' | 'church' | 'cross' | 'star' | 'heart' | 'custom';
    customIconUrl?: string;
    primaryColor: string;
    showMinisterOnDisplay: boolean;
    language: 'es' | 'en';
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    category: 'Varon' | 'Hermana' | 'Niño';
    member_group?: 'Casados' | 'Casadas' | 'Solteros' | 'Solteras' | 'Jovenes' | 'Niños' | 'Niñas';
    role: 'Miembro' | 'Responsable' | 'Administrador';
    gender: 'Varon' | 'Hermana';
    status: 'Activo' | 'Inactivo';
    lastActive: string;
    stats: {
        attendance: { attended: number; total: number };
        participation: { led: number; total: number };
        punctuality: number;
    };
    medals?: number;
    nextPrivilege?: string;
    parentName?: string;
    privileges: ('monitor' | 'choir' | 'leader' | 'kids_leader' | 'kids_helper')[];
    is_pre_registered?: boolean;
}

export interface CalendarStyles {
    sundayColor: string;
    thursdayColor: string;
    special14thColor: string;
    showGlassEffect: boolean;
    fontFamily: 'outfit' | 'sora' | 'inter';
}

export interface Uniform {
    id: string;
    name: string;
    description?: string;
    category: 'Adulto' | 'Niño';
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
    addMemberToCloud: (member: { name: string; email: string; phone?: string; role: string; gender: string; category: string; member_group?: string; avatarUrl?: string; privileges?: string[] }) => Promise<boolean>;
    uploadAvatar: (userId: string, file: File) => Promise<string | null>;
    syncUserWithCloud: (authUserId: string) => Promise<void>;

    // New Cloud Actions
    saveAnnouncementToCloud: (ann: Partial<Announcement>) => Promise<void>;
    deleteAnnouncementFromCloud: (id: string) => Promise<void>;
    saveScheduleDayToCloud: (date: string, schedule: DailySchedule['slots']) => Promise<void>;
    saveThemeToCloud: (theme: WeeklyTheme) => Promise<void>;
    loadUniformsFromCloud: () => Promise<void>;
    saveUniformToCloud: (name: string, category: 'Adulto' | 'Niño') => Promise<void>;
    deleteUniformFromCloud: (id: string) => Promise<void>;
    saveUniformForDateToCloud: (date: string, uniformId: string | null) => Promise<void>;
    loadKidsAssignmentsFromCloud: (date: string) => Promise<void>;
    saveKidsAssignmentToCloud: (date: string, assignment: Partial<KidsAssignment>) => Promise<void>;
    loadSettingsFromCloud: () => Promise<void>;
    saveSettingsToCloud: (newSettings: Partial<AppSettings>) => Promise<void>;

    // Messaging & Auth Actions
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    sendCloudMessage: (msg: Partial<Message>) => Promise<void>;
    loadCloudMessages: () => Promise<void>;
    markMessageAsRead: (id: string) => Promise<void>;
    subscribeToMessages: () => () => void;
    setAuthSession: (session: any) => void;
}

const INITIAL_USER: UserProfile = {
    id: '1',
    name: 'Abraham Samuel',
    email: 'abraham@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    category: 'Varon',
    member_group: 'Casados',
    role: 'Administrador',
    gender: 'Varon',
    status: 'Activo',
    lastActive: 'Hoy',
    stats: { attendance: { attended: 85, total: 90 }, participation: { led: 12, total: 15 }, punctuality: 98 },
    privileges: ['choir', 'leader']
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
                sundayColor: '#3b82f6', // blue-500
                thursdayColor: '#10b981', // emerald-500
                special14thColor: '#ef4444', // red-500
                showGlassEffect: true,
                fontFamily: 'outfit',
            },
            settings: {
                themeMode: 'dark',
                churchIcon: 'shield',
                primaryColor: '#3b82f6',
                showMinisterOnDisplay: true,
                language: 'es',
            },
            currentUser: INITIAL_USER,
            minister: {
                id: 'minister-1',
                name: 'P.E. Benjamin Rojas',
                email: 'contacto@lldmrodeo.org',
                phone: '+1 (555) 000-0000',
                avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
                category: 'Varon',
                role: 'Responsable',
                gender: 'Varon',
                status: 'Activo',
                lastActive: 'Hoy',
                stats: { attendance: { attended: 100, total: 100 }, participation: { led: 50, total: 50 }, punctuality: 100 },
                privileges: ['leader']
            },

            uniforms: [
                { id: 'u1', name: 'Gala Blanco', description: 'Traje completo blanco impecable.', category: 'Adulto' },
                { id: 'u2', name: 'Gala Negro', description: 'Traje negro con corbata roja.', category: 'Adulto' },
                { id: 'u3', name: 'Casual Azul', description: 'Camisa azul cielo y pantalón beige.', category: 'Adulto' },
                { id: 'k1', name: 'Túnicas Blancas', description: 'Túnicas reglamentarias para cantos.', category: 'Niño' },
                { id: 'k2', name: 'Gala Infantil', description: 'Varoncitos traje azul, Niñas vestido blanco.', category: 'Niño' },
            ],
            uniformSchedule: {
                '2026-02-22': 'u1', // Domingo
                '2026-02-26': 'u2', // Jueves
            },
            kidsAssignments: {
                '2026-02-28': {
                    serviceChild: 'Samuelito Hernandez',
                    doctrineChild: 'Mateo Rojas',
                    uniformId: 'k1'
                }
            },
            rehearsals: [
                { id: 'r1', dayOfWeek: 2, time: '07:00 PM', location: 'Salón de Actos', notes: 'Repaso general' },
                { id: 'r2', dayOfWeek: 5, time: '06:00 PM', location: 'Templo', notes: 'Consagración y repaso' }
            ],
            members: [],
            messages: [],
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
                        imageUrl: ann.image_url
                    }));
                    set({ announcements: mapped });
                }
            },

            loadDayScheduleFromCloud: async (date) => {
                const { data, error } = await supabase
                    .from('schedule')
                    .select('*')
                    .eq('date', date)
                    .single();

                if (data) {
                    set((state) => ({
                        monthlySchedule: {
                            ...state.monthlySchedule,
                            [date]: {
                                id: data.id,
                                date: data.date,
                                slots: {
                                    '5am': { leaderId: data.five_am_leader_id || '' },
                                    '9am': {
                                        consecrationLeaderId: data.nine_am_consecration_leader_id || '',
                                        doctrineLeaderId: data.nine_am_doctrine_leader_id || ''
                                    },
                                    'evening': {
                                        time: data.evening_service_time || '7:00 PM',
                                        type: data.evening_service_type || 'regular',
                                        leaderIds: data.evening_leader_ids || []
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
                    const newSchedule: Record<string, DailySchedule> = {};
                    data.forEach((entry: any) => {
                        newSchedule[entry.date] = {
                            id: entry.id,
                            date: entry.date,
                            slots: {
                                '5am': { leaderId: entry.five_am_leader_id || '' },
                                '9am': {
                                    consecrationLeaderId: entry.nine_am_consecration_leader_id || '',
                                    doctrineLeaderId: entry.nine_am_doctrine_leader_id || ''
                                },
                                'evening': {
                                    time: entry.evening_service_time || '7:00 PM',
                                    type: entry.evening_service_type || 'regular',
                                    leaderIds: entry.evening_leader_ids || [],
                                    topic: entry.topic
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
                    .single();

                if (data) {
                    set({
                        theme: {
                            id: data.id,
                            title: data.title,
                            description: data.description || '',
                            startDate: data.start_date,
                            endDate: data.end_date,
                            type: data.type as any,
                            fileUrl: data.file_url
                        }
                    });
                }
            },

            loadMembersFromCloud: async () => {
                set({ isLoading: true });
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*');

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
                        stats: p.stats || { attendance: { attended: 0, total: 1 }, participation: { led: 0, total: 1 }, punctuality: 0 },
                        privileges: p.roles || [],
                        is_pre_registered: p.is_pre_registered || false
                    }));
                    set({ members: mapped, isLoading: false });
                } else {
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

                const { error } = await supabase
                    .from('profiles')
                    .update(dbUpdates)
                    .eq('id', userId);

                if (error) {
                    console.error('Error updating profile:', error.message, error.details, error.hint);
                    return false;
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

            uploadAvatar: async (userId, file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                console.log('Uploading avatar to:', filePath);

                const { error: uploadError } = await supabase.storage
                    .from('app_assets')
                    .upload(filePath, file, { upsert: true });

                if (uploadError) {
                    console.error('Error uploading avatar:', uploadError.message, (uploadError as any).statusCode);
                    alert(`Error al subir imagen: ${uploadError.message}`);
                    return null;
                }

                const { data } = supabase.storage
                    .from('app_assets')
                    .getPublicUrl(filePath);

                console.log('Avatar uploaded successfully:', data.publicUrl);
                return data.publicUrl;
            },

            syncUserWithCloud: async (authUserId) => {
                // First try to get user email from auth session
                const { data: { user: authUser } } = await supabase.auth.getUser();
                const userEmail = authUser?.email;

                let data = null;
                let error = null;

                if (userEmail) {
                    // Search by email
                    const result = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', userEmail)
                        .single();
                    data = result.data;
                    error = result.error;
                }

                if (!data) {
                    // Fallback: search by id (old profiles where id = auth user id)
                    const result = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authUserId)
                        .single();
                    data = result.data;
                    error = result.error;
                }

                if (data) {
                    set({
                        currentUser: {
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            avatar: data.avatar_url,
                            category: data.category,
                            member_group: data.member_group,
                            role: data.role || 'Miembro',
                            gender: data.gender || 'Varon',
                            status: data.status || 'Activo',
                            lastActive: data.last_active || 'Hoy',
                            stats: data.stats || { attendance: { attended: 0, total: 1 }, participation: { led: 0, total: 1 }, punctuality: 0 },
                            privileges: data.roles || []
                        }
                    });
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
                if (member.avatarUrl) insertData.avatar_url = member.avatarUrl;
                if (member.privileges) insertData.roles = member.privileges;

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
                    is_active: ann.active ?? true
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
                const dbSchedule = {
                    date,
                    five_am_leader_id: slots['5am'].leaderId,
                    nine_am_consecration_leader_id: slots['9am'].consecrationLeaderId,
                    nine_am_doctrine_leader_id: slots['9am'].doctrineLeaderId,
                    evening_service_time: slots.evening.time,
                    evening_service_type: slots.evening.type,
                    evening_leader_ids: slots.evening.leaderIds,
                    topic: slots.evening.topic
                };

                const { error } = await supabase.from('schedule').upsert(dbSchedule, { onConflict: 'date' });
                if (error) console.error("Error saving schedule:", error);
                get().loadDayScheduleFromCloud(date);
            },

            saveThemeToCloud: async (theme) => {
                const dbTheme = {
                    start_date: theme.startDate,
                    end_date: theme.endDate,
                    title: theme.title,
                    description: theme.description,
                    type: theme.type,
                    file_url: theme.fileUrl
                };

                if (theme.id) {
                    await supabase.from('weekly_themes').update(dbTheme).eq('id', theme.id);
                } else {
                    await supabase.from('weekly_themes').insert(dbTheme);
                }
                get().loadThemeFromCloud();
            },

            loadUniformsFromCloud: async () => {
                const { data } = await supabase.from('uniforms').select('*');
                if (data) {
                    const mapped = data.map(u => ({ id: u.id, name: u.name, category: u.category }));
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

            saveUniformToCloud: async (name, category) => {
                await supabase.from('uniforms').insert({ name, category });
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
                    set({
                        settings: {
                            themeMode: data.theme_mode,
                            language: data.language,
                            churchIcon: data.church_icon,
                            customIconUrl: data.custom_icon_url,
                            primaryColor: data.primary_color,
                            showMinisterOnDisplay: data.show_minister_on_display
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
                    show_minister_on_display: updated.showMinisterOnDisplay
                };
                await supabase.from('app_settings').update(dbSettings).eq('id', 1);
                set({ settings: updated });
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

                const { data, error } = await supabase
                    .from('messages')
                    .select('*, sender:profiles!sender_id(name)')
                    .or(`receiver_id.eq.${session.user.id},target_role.eq.'${get().currentUser.role}'`)
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

            setAuthSession: (session: any) => set({ authSession: session }),
        }),
        {
            name: 'lldm-rodeo-storage-v7',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
