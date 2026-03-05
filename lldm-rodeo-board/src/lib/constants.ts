
import { DailySchedule, WeeklyTheme, Announcement } from './types';

export const MOCK_THEME: WeeklyTheme = {
    id: 'theme-1',
    startDate: '2023-10-23',
    endDate: '2023-10-29',
    title: 'La Importancia de la Oración',
    type: 'orthodoxy',
    description: 'Estudio sobre la necesidad de la oración constante.',
};

export const MOCK_SCHEDULE: DailySchedule = {
    id: 'sched-1',
    date: new Date().toISOString().split('T')[0],
    slots: {
        '5am': {
            leaderId: 'Bro. Juan Pérez',
        },
        '9am': {
            consecrationLeaderId: 'Sis. María G.',
            doctrineLeaderId: 'Sis. Ana R.',
        },
        'evening': {
            time: '6:30 PM',
            type: 'youth',
            leaderIds: ['Bro. Pedro', 'Bro. Lucas'],
            topic: 'La Juventud y su Compromiso',
        },
    },
};

// Generate a month of data
export const GENERATE_MONTH_SCHEDULE = (): Record<string, DailySchedule> => {
    const schedule: Record<string, DailySchedule> = {};
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay(); // 0 = Sunday

        // Vary the schedule slightly based on day
        let eveningType = 'regular';
        let eveningTime = '7:00 PM';

        if (dayOfWeek === 0) { eveningType = 'married'; eveningTime = '6:00 PM'; } // Sunday
        if (dayOfWeek === 4) { eveningType = 'youth'; eveningTime = '6:30 PM'; } // Thursday

        schedule[dateString] = {
            ...MOCK_SCHEDULE,
            id: `sched-${i}`,
            date: dateString,
            slots: {
                ...MOCK_SCHEDULE.slots,
                'evening': {
                    ...MOCK_SCHEDULE.slots['evening'],
                    time: eveningTime as any,
                    type: eveningType as any,
                    // Simple rotation of names for variety
                    leaderIds: i % 2 === 0 ? ['Bro. Samuel'] : ['Bro. David'],
                }
            }
        };
    }
    return schedule;
};

export const MOCK_MONTH_SCHEDULE = GENERATE_MONTH_SCHEDULE();

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ann-1',
        title: 'Ensayo de Coro',
        content: 'Todos los coros están convocados hoy a las 5:00 PM.',
        timestamp: new Date().toISOString(),
        category: 'choir',
        active: true,
        priority: 1,
    },
    {
        id: 'ann-2',
        title: 'Limpieza del Templo',
        content: 'Grupo #3 encargado de la limpieza este sábado.',
        timestamp: new Date().toISOString(),
        category: 'important',
        active: true,
        priority: 2,
    },
];
