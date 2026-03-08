
import { DailySchedule, WeeklyTheme, Announcement } from './types';

export const MOCK_THEME: WeeklyTheme = {
    id: 'initial-theme',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    title: '',
    type: 'orthodoxy',
    description: '',
};

export const MOCK_SCHEDULE: DailySchedule = {
    id: 'empty-sched',
    date: new Date().toISOString().split('T')[0],
    slots: {
        '5am': {
            leaderId: '',
        },
        '9am': {
            consecrationLeaderId: '',
            doctrineLeaderId: '',
        },
        'evening': {
            time: '07:00 PM',
            type: 'regular',
            leaderIds: [],
            topic: '',
        },
    },
};

// Generate a month of empty data
export const GENERATE_MONTH_SCHEDULE = (): Record<string, DailySchedule> => {
    return {};
};

export const MOCK_MONTH_SCHEDULE = GENERATE_MONTH_SCHEDULE();

export const MOCK_ANNOUNCEMENTS: Announcement[] = [];

export const MOCK_MEMBERS: any[] = [];
