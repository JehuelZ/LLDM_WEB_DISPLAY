import { MidnightGlowTheme } from './MidnightGlow';
import { GlassmorphismTheme } from './Glassmorphism';
import { DarkMinimalTheme } from './DarkMinimal';
import { NeonForgeTheme } from './NeonForge';
import { IglesiaTheme } from './Iglesia';
import { LunaPremiumTheme } from './LunaPremium';

export interface ThemeFonts {
    primary: string;
    secondary: string;
    accent: string;
}

export interface Theme {
    name: string;
    id: string;
    fonts: ThemeFonts;
    fontOptions?: ThemeFonts[]; // Added to allow choosing between font sets for this theme
    components: {
        Background: any;
        Clock: any;
        Progress: any;
        Sidebar: any;
    };
    slides: {
        Schedule: any;
        ScheduleTomorrow?: any;
        Calendar: any;
        Weekly?: any;
        Announcements?: any;
    };
}

export const ALL_THEMES: Record<string, Theme> = {
    'iglesia': IglesiaTheme,     // Cátedra
    'cristal': GlassmorphismTheme,
    'minimal': DarkMinimalTheme,
    'nocturno': MidnightGlowTheme,
    'midnightglow': MidnightGlowTheme, // Alias
    'neon': NeonForgeTheme,
    'neonforge': NeonForgeTheme,      // Alias
    'luna': LunaPremiumTheme,
    'primitivo': IglesiaTheme,
};


export const getTheme = (id: string = ''): Theme => {
    const normalizedId = String(id || '').toLowerCase().trim();
    return ALL_THEMES[normalizedId] || ALL_THEMES['nocturno'];
};

