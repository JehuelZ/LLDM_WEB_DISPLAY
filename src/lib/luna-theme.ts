/**
 * 🌑 LUNA PREMIUM DESIGN TOKENS (V11.0)
 * Sistema de constantes para la arquitectura industrial LLDM Rodeo.
 */

export const LUNA_TOKENS = {
    // 🌌 Fondos y Gradientes
    bg: {
        tactical: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)',
        glass: 'bg-white/[0.03] backdrop-blur-3xl',
        glassDark: 'bg-black/40 backdrop-blur-2xl',
        item: 'bg-white/[0.02] border border-white/5',
    },

    // 🌑 Profundidad y Sombras
    shadows: {
        heavy: 'shadow-[0_32px_64px_rgba(0,0,0,0.95)]',
        glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        inner: 'shadow-inner',
    },

    // 🧱 Geometría y Bordes
    borders: {
        none: 'rounded-none',
        pill: 'rounded-full',
        divider: 'border-white/5',
        interactive: 'border-white/10 hover:border-white/40',
    },

    // 🎨 Tipografía (lowercase absoluto)
    text: {
        main: 'font-[300] text-white tracking-widest lowercase',
        muted: 'font-[300] text-white/30 tracking-[0.4em] lowercase',
        accent: 'font-[300] text-emerald-500 tracking-tighter lowercase',
        header: 'text-3xl font-[300] text-white tracking-tighter lowercase',
    },

    // ⚡ Animaciones Tácticas
    fx: {
        hover: 'transition-all duration-500 group-hover:bg-white/5',
        pulse: 'animate-pulse',
        float: 'transition-transform duration-700 group-hover:-translate-y-2',
    }
};

/**
 * 🛠️ Utility Classes Combinations
 */
export const LUNA_CLASSES = {
    console: `relative overflow-hidden ${LUNA_TOKENS.borders.none} ${LUNA_TOKENS.shadows.heavy} border-none`,
    header: `p-12 border-b ${LUNA_TOKENS.borders.divider} flex justify-between items-center relative z-10`,
    body: `p-12 relative z-10`,
    button: `${LUNA_TOKENS.borders.pill} h-12 px-8 flex items-center gap-4 transition-all group`,
    input: `w-full h-12 bg-white/[0.03] border ${LUNA_TOKENS.borders.divider} p-6 ${LUNA_TOKENS.text.main} focus:outline-none focus:border-white/20`,
};
