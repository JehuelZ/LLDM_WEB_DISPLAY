import React from 'react';
import { IglesiaBackground } from './Background';
import { IglesiaClockInline } from './Clock';
import { IglesiaProgress } from './Clock';
import { IglesiaSchedule } from './IglesiaSchedule';
import { IglesiaCalendar } from './IglesiaCalendar';
import { IglesiaWeekly } from './IglesiaWeekly';
import { IglesiaAnnouncements } from './IglesiaAnnouncements';
import type { Theme } from '../index';

const ScheduleToday = (props: any) => <IglesiaSchedule isTomorrow={false} {...props} />;
const ScheduleTomorrow = (props: any) => <IglesiaSchedule isTomorrow={true} {...props} />;

export const IglesiaTheme: Theme = {
    name: 'Cátedra',
    id: 'iglesia',
    fonts: {
        primary: 'font-inter',
        secondary: 'font-outfit',
        accent: 'font-inter',
    },
    fontOptions: [
        { primary: 'font-inter', secondary: 'font-outfit', accent: 'font-inter' },
        { primary: 'font-outfit', secondary: 'font-sora', accent: 'font-outfit' },
        { primary: 'font-sora', secondary: 'font-inter', accent: 'font-sora' },
    ],
    components: {
        Background: IglesiaBackground,
        Clock: () => null, // Clock is integrated inline in slide headers
        Progress: IglesiaProgress,
    },
    slides: {
        Schedule: ScheduleToday,
        ScheduleTomorrow: ScheduleTomorrow,
        Calendar: IglesiaCalendar,
        Weekly: IglesiaWeekly,
        Announcements: IglesiaAnnouncements,
    },
};
