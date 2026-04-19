import Background from './Background';
import Clock from './Clock';
import Progress from './Progress';
import LunaPremiumSchedule from './LunaPremiumSchedule';
import LunaPremiumWeekly from './LunaPremiumWeekly';
import LunaPremiumCalendar from './LunaPremiumCalendar';
import { LunaAnnouncements } from './LunaAnnouncements';
import { Theme } from '../index';

export const LunaPremiumTheme: Theme = {
    name: 'Luna Premium',
    id: 'luna',
    fonts: {
        primary: 'Manrope, sans-serif',
        secondary: 'Inter, sans-serif',
        accent: 'IBM Plex Mono, monospace'
    },
    components: {
        Background,
        Clock,
        Progress
    },
    slides: {
        Schedule: LunaPremiumSchedule,
        Calendar: LunaPremiumCalendar,
        Weekly: LunaPremiumWeekly,
        Announcements: LunaAnnouncements
    }
};
