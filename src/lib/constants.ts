
import { DailySchedule, WeeklyTheme, Announcement } from './types';

export const MOCK_THEME: WeeklyTheme = {
    id: 'theme-1',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
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
        // Using local format to avoid TZ issues that toISOString().split('T')[0] might have
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayOfWeek = date.getDay(); // 0 = Sunday

        // Vary the schedule slightly based on day
        let eveningType = 'regular';
        let eveningTime = '7:00 PM';

        if (dayOfWeek === 0) { eveningType = 'praise'; eveningTime = '6:00 PM'; } // Sunday Alabanza
        if (dayOfWeek === 4) { eveningType = 'youth'; eveningTime = '6:30 PM'; } // Thursday
        if (dayOfWeek === 6) { eveningType = 'praise'; eveningTime = '7:00 PM'; } // Saturday Alabanza

        // Double leaders for praise/sunday/special sessions
        const hasDoubleLeaders = dayOfWeek === 0 || dayOfWeek === 4 || dayOfWeek === 6;
        let leaderIds = hasDoubleLeaders ? ['Bro. Samuel', 'Bro. David'] : [i % 2 === 0 ? 'Bro. Samuel' : 'Bro. David'];

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
                    language: dayOfWeek === 4 ? 'en' : 'es',
                    leaderIds: leaderIds,
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

export const MOCK_MEMBERS: any[] = [
    {
        id: 'Bro. Samuel',
        name: 'Samuel Hernández',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        category: 'Varon',
        role: 'Responsable',
        privileges: ['choir', 'leader'],
        member_group: 'Casados',
        phone: '555-0101',
        email: 'samuel@lldm.org',
        stats: { attendance: { attended: 10, total: 10 }, participation: { led: 5, total: 5 }, punctuality: 100 }
    },
    {
        id: 'Bro. David',
        name: 'David Rojas',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        category: 'Varon',
        role: 'Responsable',
        member_group: 'Jóvenes',
        phone: '555-0202',
        email: 'david@lldm.org',
        stats: { attendance: { attended: 10, total: 10 }, participation: { led: 5, total: 5 }, punctuality: 100 }
    },
    {
        id: 'Sis. María G.',
        name: 'María García',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        category: 'Hermana',
        role: 'Responsable',
        member_group: 'Niños',
        privileges: ['kids_leader'],
        phone: '555-0303',
        email: 'maria@lldm.org',
        stats: { attendance: { attended: 10, total: 10 }, participation: { led: 5, total: 5 }, punctuality: 100 }
    },
    {
        id: 'Bro. Pedro',
        name: 'Pedro Morales',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
        category: 'Varon',
        role: 'Administrador',
        phone: '555-0404',
        email: 'pedro@lldm.org',
        stats: { attendance: { attended: 10, total: 10 }, participation: { led: 5, total: 5 }, punctuality: 100 }
    },
    {
        id: 'test-miembro',
        name: 'Test Miembro',
        email: 'miembro_test@lldmrodeo.org',
        role: 'Miembro',
        category: 'Varon',
        gender: 'Varon',
        privileges: [],
        avatar: 'https://ui-avatars.com/api/?name=Test+Miembro&background=random'
    },
    {
        id: 'test-asistencia',
        name: 'Test Asistencia',
        email: 'asistencia_test@lldmrodeo.org',
        role: 'Responsable de Asistencia',
        category: 'Hermana',
        gender: 'Hermana',
        privileges: ['monitor'],
        avatar: 'https://ui-avatars.com/api/?name=Test+Asistencia&background=random'
    },
    {
        id: 'test-coro',
        name: 'Test Coro',
        email: 'coro_test@lldmrodeo.org',
        role: 'Dirigente Coro Adultos',
        category: 'Varon',
        gender: 'Varon',
        privileges: ['choir'],
        avatar: 'https://ui-avatars.com/api/?name=Test+Coro&background=random'
    },
    {
        id: 'test-jovenes',
        name: 'Test Jóvenes',
        email: 'jovenes_test@lldmrodeo.org',
        role: 'Encargado de Jóvenes',
        category: 'Varon',
        gender: 'Varon',
        privileges: ['youth_leader'],
        avatar: 'https://ui-avatars.com/api/?name=Test+Jovenes&background=random'
    }
];
