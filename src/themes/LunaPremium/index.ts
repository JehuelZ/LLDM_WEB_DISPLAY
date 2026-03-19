import Background from './Background';
import Clock from './Clock';
import Progress from './Progress';
import LunaPremiumSchedule from './LunaPremiumSchedule';
// Using Glassmorphism components as temporary base for missing slides
import { GlassmorphismCalendar } from '../Glassmorphism/CalendarSlide';
import { GlassmorphismWeekly } from '../Glassmorphism/WeeklySlide';
import { GlassmorphismAnnouncements } from '../Glassmorphism/AnnouncementsSlide';
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
        Calendar: GlassmorphismCalendar,
        Weekly: GlassmorphismWeekly,
        Announcements: GlassmorphismAnnouncements
    }
};
