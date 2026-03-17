import { GlassmorphismBackground } from './Background';
import { GlassmorphismClock } from './Clock';
import { GlassmorphismProgress } from './Progress';
import { GlassmorphismSchedule } from './ScheduleSlide';
import { GlassmorphismCalendar } from './CalendarSlide';
import { GlassmorphismWeekly } from './WeeklySlide';
import { GlassmorphismAnnouncements } from './AnnouncementsSlide';

export const GlassmorphismTheme = {
    name: 'Cristal',
    id: 'cristal', // Updated from 'minimalist'
    fonts: {
        primary: 'font-sora',
        secondary: 'font-inter',
        accent: 'font-outfit',
    },
    // Collection of font sets for this theme (The "own identity" request)
    fontOptions: [
        { primary: 'font-sora', secondary: 'font-inter', accent: 'font-outfit' },
        { primary: 'font-outfit', secondary: 'font-sora', accent: 'font-inter' },
        { primary: 'font-inter', secondary: 'font-outfit', accent: 'font-sora' }
    ],
    components: {
        Background: GlassmorphismBackground,
        Clock: GlassmorphismClock,
        Progress: GlassmorphismProgress,
    },
    slides: {
        Schedule: GlassmorphismSchedule,
        Calendar: GlassmorphismCalendar,
        Weekly: GlassmorphismWeekly,
        Announcements: GlassmorphismAnnouncements,
    }
};
