'use client';

// ─────────────────────────────────────────────
// NeonForge — Color Variant System
// 3 presets selectable from Admin
// ─────────────────────────────────────────────

export type NeonForgeVariant = 'lime' | 'cyan' | 'emerald';

export interface NeonForgeTokens {
    bg: string;
    card: string;
    cardFeatured: string;
    border: string;
    accent: string;
    accentDim: string;
    accentGlow: string;
    accentText: string;
    secondary: string;
    secondaryDim: string;
    white: string;
    textSecondary: string;
    textMuted: string;
    live: string;
}

export const VARIANTS: Record<NeonForgeVariant, NeonForgeTokens> = {
    lime: {
        bg: '#0C0C0C',
        card: '#181818',
        cardFeatured: '#1A1F10',
        border: '#252525',
        accent: '#BBFF00',
        accentDim: '#BBFF0025',
        accentGlow: '#BBFF0018',
        accentText: '#CCFF33',
        secondary: '#7C3AED',
        secondaryDim: '#7C3AED25',
        white: '#FFFFFF',
        textSecondary: '#A0A0A0',
        textMuted: '#505050',
        live: '#EF4444',
    },
    cyan: {
        bg: '#090C0E',
        card: '#111618',
        cardFeatured: '#0E1A1F',
        border: '#1E2A2E',
        accent: '#00E5FF',
        accentDim: '#00E5FF22',
        accentGlow: '#00E5FF15',
        accentText: '#33EEFF',
        secondary: '#4F46E5',
        secondaryDim: '#4F46E522',
        white: '#FFFFFF',
        textSecondary: '#9AAFB5',
        textMuted: '#465A60',
        live: '#FF5757',
    },
    emerald: {
        bg: '#0D0A06',
        card: '#1A1408',
        cardFeatured: '#1F1900',
        border: '#2A2010',
        accent: '#FFB800',
        accentDim: '#FFB80025',
        accentGlow: '#FFB80018',
        accentText: '#FFC933',
        secondary: '#EF4444',
        secondaryDim: '#EF444422',
        white: '#FFFFFF',
        textSecondary: '#B0A080',
        textMuted: '#605040',
        live: '#FF3B3B',
    },
};

export const VARIANT_LABELS: Record<NeonForgeVariant, string> = {
    lime: '⚡ Lima · Verde Eléctrico',
    cyan: '💠 Cian · Azul Neón',
    emerald: '🔥 Ámbar · Naranja Encendido',
};

export function getVariantTokens(settings: any): NeonForgeTokens {
    const key = (settings?.neonForgeVariant || 'lime') as NeonForgeVariant;
    return VARIANTS[key] || VARIANTS.lime;
}
