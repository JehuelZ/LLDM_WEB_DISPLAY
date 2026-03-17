import { DarkMinimalBackground } from './Background';
import { DarkMinimalClock } from './Clock';
import { DarkMinimalProgress } from './Progress';
import { DarkMinimalSchedule } from './DarkMinimalSchedule';
import { DarkMinimalCalendar } from './DarkMinimalCalendar';
import { DarkMinimalWeekly } from './DarkMinimalWeekly';
import { DarkMinimalAnnouncements } from './DarkMinimalAnnouncements';

export const DarkMinimalTheme = {
    name: 'Minimal',
    id: 'minimal',
    fonts: {
        primary: 'font-inter',
        secondary: 'font-inter',
        accent: 'font-sora',
    },
    fontOptions: [
        { primary: 'font-inter', secondary: 'font-inter', accent: 'font-sora' },
        { primary: 'font-sora', secondary: 'font-inter', accent: 'font-outfit' },
        { primary: 'font-outfit', secondary: 'font-inter', accent: 'font-sora' },
    ],
    components: {
        Background: DarkMinimalBackground,
        Clock: DarkMinimalClock,
        Progress: DarkMinimalProgress,
    },
    slides: {
        Schedule: DarkMinimalSchedule,
        Calendar: DarkMinimalCalendar,
        Weekly: DarkMinimalWeekly,
        Announcements: DarkMinimalAnnouncements,
    },
};
