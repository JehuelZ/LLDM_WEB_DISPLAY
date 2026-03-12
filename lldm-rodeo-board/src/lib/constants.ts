
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
            time: '05:00 AM',
            endTime: '05:30 AM',
            language: 'es'
        },
        '9am': {
            consecrationLeaderId: 'Sis. María G.',
            doctrineLeaderId: 'Sis. Ana R.',
            time: '09:00 AM',
            endTime: '10:00 AM',
            language: 'es'
        },
        'evening': {
            time: '07:00 PM',
            type: 'regular',
            leaderIds: ['Bro. Pedro', 'Bro. Lucas'],
            topic: 'La Juventud y su Compromiso',
            language: 'es',
            endTime: '08:30 PM'
        },
    },
};

export const MOCK_MEMBERS: any[] = [
    {
        id: '1',
        name: 'Samuel Rojas',
        email: 'samuel.rojas@example.com',
        phone: '555-1234',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        category: 'Varon',
        member_group: 'Casados',
        role: 'Responsable',
        gender: 'Varon',
        status: 'Activo',
        lastActive: 'Hoy',
        privileges: ['leader']
    },
    {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        phone: '555-5678',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        category: 'Hermana',
        member_group: 'Casadas',
        role: 'Miembro',
        gender: 'Hermana',
        status: 'Activo',
        lastActive: 'Hoy',
        privileges: []
    }
];

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
