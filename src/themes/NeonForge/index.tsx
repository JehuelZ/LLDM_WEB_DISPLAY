import React from 'react';
import { NeonForgeBackground } from './Background';
import { NeonForgeClock } from './Clock';
import { NeonForgeProgress } from './Progress';
import { NeonForgeSchedule } from './NeonForgeSchedule';
import { NeonForgeAnnouncements } from './NeonForgeAnnouncements';
import { NeonForgeCalendar } from './NeonForgeCalendar';
import type { Theme } from '../index';

// NeonForge slide rotation:
// Calendar  = Agenda del Día (hoy)
// Weekly    = Agenda de Mañana
// Schedule  = (reutilizado como fallback — se oculta en display)
// Announcements = Comunicados

// Weather now lives as a floating widget in the Background (not a slide)

const ScheduleToday = (props: any) => <NeonForgeSchedule isTomorrow={false} {...props} />;
const ScheduleTomorrow = (props: any) => <NeonForgeSchedule isTomorrow={true} {...props} />;

export const NeonForgeTheme: Theme = {
    name: 'Neon',
    id: 'neon',
    fonts: {
        primary: 'font-sora',
        secondary: 'font-outfit',
        accent: 'font-sora',
    },
    fontOptions: [
        { primary: 'font-sora', secondary: 'font-outfit', accent: 'font-sora' },
        { primary: 'font-outfit', secondary: 'font-inter', accent: 'font-outfit' },
        { primary: 'font-inter', secondary: 'font-sora', accent: 'font-inter' },
    ],
    components: {
        Background: NeonForgeBackground,
        Clock: NeonForgeClock,
        Progress: NeonForgeProgress,
    },
    slides: {
        Schedule: ScheduleToday,       // used by display's 'schedule' and 'schedule_tomorrow' slots
        Calendar: NeonForgeCalendar,       // 'calendar' slot → Agenda Mensual
        Weekly: ScheduleTomorrow,    // 'weekly_program' slot → agenda mañana
        Announcements: NeonForgeAnnouncements,
    },
};
