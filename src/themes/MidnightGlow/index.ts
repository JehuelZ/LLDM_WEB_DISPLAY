import { MidnightGlowBackground } from './Background';
import { MidnightGlowClock } from './Clock';
import { MidnightGlowProgress } from './Progress';
import { MidnightGlowSchedule } from './MidnightGlowSchedule';
import { MidnightGlowCalendar } from './MidnightGlowCalendar';
import { MidnightGlowWeekly } from './MidnightGlowWeekly';
import { MidnightGlowAnnouncements } from './AnnouncementsSlide';

export const MidnightGlowTheme = {
    name: 'Nocturno',
    id: 'nocturno',
    fonts: {
        primary: 'font-orbitron',
        secondary: 'font-inter',
        accent: 'font-black-ops',
    },
    // Collection of font sets for this theme (The "own identity" request)
    fontOptions: [
        { primary: 'font-orbitron', secondary: 'font-inter', accent: 'font-black-ops' },
        { primary: 'font-black-ops', secondary: 'font-inter', accent: 'font-orbitron' },
        { primary: 'font-inter', secondary: 'font-orbitron', accent: 'font-black-ops' }
    ],
    components: {
        Background: MidnightGlowBackground,
        Clock: MidnightGlowClock,
        Progress: MidnightGlowProgress,
    },
    slides: {
        Schedule: MidnightGlowSchedule,
        Calendar: MidnightGlowCalendar,
        Weekly: MidnightGlowWeekly,
        Announcements: MidnightGlowAnnouncements,
    }
};
