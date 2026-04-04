
/**
 * Global/System titles for the display slides.
 * This ensures consistency across different themes.
 */
export const DISPLAY_SLIDE_LABELS: Record<string, { es: string, en: string }> = {
    schedule: {
        es: 'Agenda del Día',
        en: 'Daily Agenda'
    },
    schedule_tomorrow: {
        es: 'Agenda de Mañana',
        en: 'Tomorrow\'s Agenda'
    },
    calendar: {
        es: 'Calendario Mensual',
        en: 'Monthly Calendar'
    },
    weekly_program: {
        es: 'Programa Semanal',
        en: 'Weekly Program'
    },
    announcements: {
        es: 'Comunicados Oficiales',
        en: 'Official Announcements'
    },
    countdown: {
        es: 'Cuenta Regresiva',
        en: 'Countdown'
    },
    weekly_theme_label: {
        es: 'Tema de la Semana',
        en: 'Weekly Theme'
    }
};

export const DEFAULT_SLOT_LABELS: Record<string, { es: string, en: string }> = {
    '5am': {
        es: 'Oración de Cinco',
        en: '5 AM Prayer'
    },
    '9am_regular': {
        es: 'Oración de Nueve',
        en: '9 AM Prayer'
    },
    '9am_sunday': {
        es: 'Escuela Dominical',
        en: 'Sunday School'
    },
    'evening_regular': {
        es: 'Culto de Adoración',
        en: 'Evening Service'
    }
};

export function getSlotLabel(slotId: string, lang: 'es' | 'en' = 'es'): string {
    return DEFAULT_SLOT_LABELS[slotId]?.[lang] || '';
}

export function getSlideSystemTitle(slideId: string, lang: 'es' | 'en' = 'es'): string {
    return DISPLAY_SLIDE_LABELS[slideId]?.[lang] || 'Tema de la Semana';
}

export function getServiceTypeLabel(type: string, lang: 'es' | 'en' = 'es', is14th: boolean = false): string {
    if (is14th) {
        // Special rule for the 14th: History is the priority reminder
        if (type === 'doctrine' || type === 'regular' || type === 'special') {
            return lang === 'es' ? 'Recordación: Historia de la Iglesia' : 'Remembrance: Church History';
        }
    }

    const labels: Record<string, { es: string, en: string }> = {
        regular: { es: 'Culto de Adoración', en: 'Worship Service' },
        youth: { es: 'Servicio de Jóvenes', en: 'Youth Service' },
        married: { es: 'Servicio de Casados', en: 'Married Couples Service' },
        children: { es: 'Servicio de la Niñez', en: 'Children\'s Service' },
        solos: { es: 'Servicio de Solos y Solas', en: 'Singles Service' },
        praise: { es: 'Servicio de Alabanzas', en: 'Praise Service' },
        special: { es: 'Servicio Especial', en: 'Special Service' },
        youth_english: { es: 'Servicio de Jóvenes (En)', en: 'Youth Service (En)' },
        consecration: { es: 'Servicio de Consagración', en: 'Consecration Service' },
        doctrine: { es: 'Estudio de Doctrina', en: 'Doctrine Study' }
    };
    return labels[type]?.[lang] || labels.regular[lang];
}

export function getThemeLabel(type: string, lang: 'es' | 'en' = 'es'): string {
    const labels: Record<string, { es: string, en: string }> = {
        apostolic_presentation: { es: 'Presentación Apostólica', en: 'Apostolic Presentation' },
        apostolic_letter: { es: 'Carta Apostólica', en: 'Apostolic Letter' },
        orthodoxy: { es: 'Sana Doctrina', en: 'Sound Doctrine' },
        exchange: { es: 'Intercambio de Ministro', en: 'Minister Exchange' },
        free: { es: 'Tema Ministerial / Libre', en: 'Special Theme' }
    };
    return labels[type]?.[lang] || labels.orthodoxy[lang];
}
