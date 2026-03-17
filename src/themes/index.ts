import { MidnightGlowTheme } from './MidnightGlow';
import { GlassmorphismTheme } from './Glassmorphism';
import { DarkMinimalTheme } from './DarkMinimal';
import { NeonForgeTheme } from './NeonForge';
import { IglesiaTheme } from './Iglesia';

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
    'neon': NeonForgeTheme,
};


export const getTheme = (id: string): Theme => {
    return ALL_THEMES[id] || ALL_THEMES['nocturno'];
};
