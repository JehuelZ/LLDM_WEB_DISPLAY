'use client';
// ──────────────────────────────────────────────────────────────────────────────
// Iglesia — Design Token System
// Aesthetic: Neumorphic · Academic · Clean
// Supports: Light & Dark variants
// ──────────────────────────────────────────────────────────────────────────────

export interface IglesiaTokens {
    bg: string;
    surface: string;
    surfaceDeep: string;
    shadowLight: string;
    shadowDark: string;
    accent: string;
    accentLight: string;
    accentDim: string;
    secondary: string;
    tertiary: string;
    emerald: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderAccent: string;
    today: string;
    fontFamily: string;
    fontMontserrat: string;
    fontInter: string;
    fontMono: string;
    avatarStyle: {
        background: string;
        boxShadow: string;
        padding: number;
        border: string;
    };
    bgGradient: string;
}

export const IGLESIA_LIGHT: IglesiaTokens = {
    bg: '#E5E0D3', // Warm Sand/Linen
    surface: '#E5E0D3',
    surfaceDeep: '#E5E0D3',
    shadowLight: 'rgba(255, 255, 255, 0.6)',
    shadowDark: 'rgba(120, 110, 90, 0.25)',
    accent: '#EA2A33',
    accentLight: '#FFF5F5',
    accentDim: 'rgba(234,42,51,0.08)',
    secondary: '#228BE6',
    tertiary: '#FD7E14',
    emerald: '#40C057',
    textPrimary: '#2C2A26',
    textSecondary: '#5D5A54',
    textMuted: '#8E8A82',
    border: 'rgba(140, 130, 110, 0.15)',
    borderAccent: 'rgba(234,42,51,0.20)',
    today: 'rgba(234,42,51,0.06)',
    fontFamily: 'var(--font-montserrat), sans-serif',
    fontMontserrat: 'var(--font-montserrat), sans-serif',
    fontInter: 'var(--font-inter), sans-serif',
    fontMono: 'var(--font-jetbrains-mono), monospace',
    avatarStyle: {
        background: '#E5E0D3',
        boxShadow: '6px 6px 12px rgba(120, 110, 90, 0.25), -6px -6px 12px rgba(255, 255, 255, 0.6)',
        padding: 0,
        border: '10px solid #E5E0D3',
    },
    bgGradient: 'none'
};

export const IGLESIA_DARK: IglesiaTokens = {
    bg: '#1a1f2c',
    surface: '#1a1f2c',
    surfaceDeep: '#1a1f2c',
    shadowLight: 'rgba(255, 255, 255, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    accent: '#EA2A33',
    accentLight: 'rgba(234, 42, 51, 0.15)',
    accentDim: 'rgba(234, 42, 51, 0.1)',
    secondary: '#3a86ff',
    tertiary: '#FCC419',
    emerald: '#51CF66',
    textPrimary: '#F8F9FA',
    textSecondary: '#CED4DA',
    textMuted: '#5C5F66',
    border: 'transparent',
    borderAccent: 'transparent',
    today: 'rgba(234, 42, 51, 0.15)',
    fontFamily: 'var(--font-montserrat), sans-serif',
    fontMontserrat: 'var(--font-montserrat), sans-serif',
    fontInter: 'var(--font-inter), sans-serif',
    fontMono: 'var(--font-jetbrains-mono), monospace',
    avatarStyle: {
        background: '#1a1f2c',
        boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.6), -8px -8px 20px rgba(255, 255, 255, 0.06)',
        padding: 0,
        border: '10px solid #1a1f2c',
    },
    bgGradient: 'none'
};


export function getIglesiaTokens(variant: 'light' | 'dark' = 'light'): IglesiaTokens {
    return variant === 'dark' ? IGLESIA_DARK : IGLESIA_LIGHT;
}

// Neumorphic box-shadow generator — REFINED FOR THE NEW REFERENCE
export function neuShadow(T: IglesiaTokens, inset = false, intensity: 'xs' | 'sm' | 'md' | 'lg' = 'md', isDark = false) {
    if (isDark) {
        const dark = 'rgba(0, 0, 0, 0.5)';
        const light = 'rgba(255, 255, 255, 0.04)';

        if (inset) {
            if (intensity === 'xs') return `inset 1px 1px 2px ${dark}, inset -1px -1px 2px ${light}`;
            if (intensity === 'sm') return `inset 2px 2px 5px ${dark}, inset -1px -1px 3px ${light}`;
            if (intensity === 'md') return `inset 5px 5px 12px ${dark}, inset -2px -2px 6px ${light}`;
            return `inset 10px 10px 20px ${dark}, inset -5px -5px 10px ${light}`;
        }

        if (intensity === 'xs') return `1px 1px 2px ${dark}, -1px -1px 2px ${light}`;

        if (intensity === 'sm') return `3px 3px 6px ${dark}, -2px -2px 4px ${light}`;
        if (intensity === 'md') return `5px 5px 12px ${dark}, -5px -5px 15px ${light}`;
        return `12px 12px 24px ${dark}, -8px -8px 20px ${light}`;
    }

    if (inset) {
        if (intensity === 'xs') return `inset 1px 1px 2px rgba(0,0,0,0.02), inset -1px -1px 2px #FFFFFF`;
        if (intensity === 'sm') return `inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px #FFFFFF`;
        return `inset 4px 4px 8px rgba(0,0,0,0.05), inset -4px -4px 8px #FFFFFF`;
    }

    if (intensity === 'xs') return `1px 1px 2px rgba(0,0,0,0.02), -1px -1px 2px #FFFFFF`;

    if (intensity === 'sm') return `2px 2px 5px rgba(0,0,0,0.03), -2px -2px 6px #FFFFFF`;
    if (intensity === 'md') return `4px 4px 10px rgba(0,0,0,0.04), -4px -4px 12px #FFFFFF`;
    return `8px 8px 18px rgba(0,0,0,0.06), -8px -8px 16px #FFFFFF`;
}
