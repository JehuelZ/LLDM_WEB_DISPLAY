
import { supabase } from './supabaseClient';
import { Announcement, DailySchedule, WeeklyTheme } from './types';
import { UserProfile } from './store';
import { getLocalDateString } from './utils';

/**
 * SERVICIOS PARA SUPABASE
 * Estas funciones se encargan de subir y bajar los datos reales de la nube.
 */

// --- ANUNCIOS ---
export const getAnnouncements = async () => {
    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

    if (error) {
        console.error('Error cargando anuncios:', error);
        return [];
    }
    return data;
};

export const saveAnnouncement = async (announcement: any) => {
    const { data, error } = await supabase
        .from('announcements')
        .upsert(announcement);

    if (error) throw error;
    return data;
};

// --- HORARIOS ---
export const getScheduleForDate = async (date: string) => {
    const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('date', date)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found"
        console.error('Error cargando horario:', error);
        return null;
    }
    return data;
};

export const saveSchedule = async (schedule: any) => {
    const { data, error } = await supabase
        .from('schedule')
        .upsert(schedule);

    if (error) throw error;
    return data;
};

// --- TEMAS SEMANALES ---
export const getActiveTheme = async () => {
    const today = getLocalDateString();
    const { data, error } = await supabase
        .from('weekly_themes')
        .select('*')
        .lte('start_date', today)
        .gte('end_date', today)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error cargando tema:', error);
        return null;
    }
    return data;
};

export const saveWeeklyTheme = async (theme: any) => {
    const { data, error } = await supabase
        .from('weekly_themes')
        .upsert(theme);

    if (error) throw error;
    return data;
};

// --- PERFILES ---
export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export const updateProfile = async (profile: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(profile);

    if (error) throw error;
    return data;
};
