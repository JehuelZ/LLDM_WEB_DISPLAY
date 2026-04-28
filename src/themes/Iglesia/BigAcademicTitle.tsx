'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { neuShadow } from './tokens';

export function BigAcademicTitle({ label, icon: Icon, T, isDark, small = false, micro = false }: { label: string; icon: any; T: any; isDark: boolean; small?: boolean; micro?: boolean }) {
    const shadow = isDark
        ? `12px 12px 25px rgba(0, 0, 0, 0.4), -10px -10px 25px rgba(255, 255, 255, 0.03)`
        : `10px 10px 20px rgba(0, 0, 0, 0.04), -10px -10px 25px #FFFFFF`;

    return (
        <div style={{
            width: '100%', height: micro ? 50 : (small ? 60 : 80), borderRadius: micro ? 16 : (small ? 20 : 28),
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: micro ? 10 : (small ? 14 : 20),
            background: T.surface,
            boxShadow: shadow,
            border: 'none',
            padding: micro ? '0 20px' : (small ? '0 24px' : '0 40px'),
            position: 'relative',
            zIndex: 10
        }}>
            {Icon && <Icon style={{ width: micro ? 20 : (small ? 24 : 32), height: micro ? 20 : (small ? 24 : 32), color: isDark ? '#FFFFFF' : T.secondary }} />}
            <span style={{
                fontSize: micro ? 18 : (small ? 24 : 32),
                fontWeight: 700,
                color: isDark ? '#FFFFFF' : T.textPrimary,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: T.fontMontserrat,
                fontStyle: 'italic',
                lineHeight: 1
            }}>
                {label}
            </span>
        </div>
    );
}

import { Flame, Church, BookOpen, Star, Heart } from 'lucide-react';

export function ChurchHeaderBadge({ name, T, isDark, settings }: { name: string; T: any; isDark: boolean; settings: any }) {
    const shadow = isDark
        ? `6px 6px 15px rgba(0, 0, 0, 0.45), -6px -6px 15px rgba(255, 255, 255, 0.02)`
        : `5px 5px 12px rgba(0, 0, 0, 0.04), -5px -5px 12px #FFFFFF`;

    const officialLogo = "/flama-oficial.svg";
    const currentLogo = settings?.churchLogoUrl;
    // Explicit check for 'No Logo' (empty string)
    const showLogo = currentLogo !== '';
    const finalLogoUrl = (currentLogo === '' || !currentLogo) ? officialLogo : currentLogo;

    const icons: Record<string, any> = { flame: Flame, church: Church, book: BookOpen, star: Star, heart: Heart };
    const SelectedIcon = icons[settings?.churchIcon || 'flame'] || Flame;

    return (
        <div style={{
            padding: '18px 40px', borderRadius: 28,
            background: T.surface,
            boxShadow: shadow,
            display: 'flex', alignItems: 'center', gap: 20,
            border: 'none',
            width: 'fit-content'
        }}>
            {showLogo && (
                <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent}dd)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 6px 16px ${T.accent}45`,
                    overflow: 'hidden'
                }}>
                    <img 
                        src={finalLogoUrl} 
                        alt="" 
                        style={{ 
                            width: '80%', 
                            height: '80%', 
                            objectFit: 'contain', 
                            filter: (isDark && currentLogo !== '' && currentLogo !== '/flama-oficial.svg') ? 'brightness(1.2)' : (isDark ? 'brightness(0) invert(1)' : 'none') 
                        }} 
                    />
                </div>
            )}
            <h2 style={{
                fontSize: 24, fontWeight: 700, color: isDark ? '#FFFFFF' : T.textPrimary,
                letterSpacing: '-0.02em', fontFamily: T.fontMontserrat,
                margin: 0, display: 'flex', gap: 8, alignItems: 'center'
            }}>
                {(name || '').toUpperCase() || 'LLDM'} <span style={{ color: T.accent, fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', opacity: 0.9 }}>RODEO</span>
            </h2>
        </div>
    );
}
