'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getIglesiaTokens, neuShadow } from './tokens';
import { getSlideSystemTitle } from '@/lib/display_labels';
import { ChurchHeaderBadge } from './BigAcademicTitle';

export function IntegratedClock({ T, isDark }: { T: any; isDark: boolean }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            gap: 2, position: 'relative'
        }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: T.fontMono }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {format(time, 'HH:mm')}
                </span>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.accent, marginLeft: 2 }}>
                    {format(time, 'ss')}
                </span>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: T.fontMontserrat, marginTop: 4 }}>
                {format(time, "EEEE d 'de' MMMM", { locale: es })}
            </div>

            {/* Progress indicator removed as requested */}
        </div>
    );
}

// Keeping this for potential legacy exports but IntegratedClock is used in Progress
export function IglesiaClockInline() { return null; }

import { useWeather } from '@/hooks/useWeather';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, Sunrise } from 'lucide-react';

const WeatherIcon = ({ code, className, size = 20 }: { code: string, className?: string, size?: number }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} size={size} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} size={size} />;
    if (c >= 45 && c <= 48) return <CloudFog className={className} size={size} />;
    if (c >= 51 && c <= 55) return <CloudDrizzle className={className} size={size} />;
    if (c >= 61 && c <= 65) return <CloudRain className={className} size={size} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} size={size} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} size={size} />;
    if (c === 95) return <CloudLightning className={className} size={size} />;
    return <Sun className={className} size={size} />;
};

export function IglesiaProgress({ slides, currentSlide, isPaused }: { slides?: any[], currentSlide: number, isPaused?: boolean }) {
    const { settings, theme } = useAppStore();
    const iglesiaVariant = useAppStore((s: any) => s.settings?.iglesiaVariant || 'light');
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    // Weather Fetching
    const { weather } = useWeather(
        settings.neonForgeCityData?.lat || 24.341,
        settings.neonForgeCityData?.lon || -104.28
    );

    const total = slides?.length || 0;
    const hideExtra = slides?.[currentSlide]?.id === 'calendar';
    const currentTime = new Date();

    const themeLabel = getSlideSystemTitle('weekly_theme_label', settings?.language || 'es');

    if (total === 0) return null;

    return (
        <>
            {/* Top Fixed Header (Global Static Dashboard) */}
            <div style={{
                position: 'absolute', top: 30, left: 40, right: 40,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                zIndex: 30, pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <ChurchHeaderBadge name={(settings as any).churchName || 'LLDM'} T={T} isDark={isDark} settings={settings} />
                    <p style={{ fontSize: 11, fontWeight: 400, color: T.textMuted, fontFamily: T.fontInter, marginTop: 12, marginLeft: 20 }}>
                        {(settings as any).churchAddress || 'Sistema de Información Digital'}
                    </p>
                </div>
                <div style={{ pointerEvents: 'auto' }}>
                    {/* Unified Header Intelligence Box (Weather + Clock) */}
                    {!hideExtra && (
                        <div style={{
                            display: 'flex', gap: 0, alignItems: 'stretch',
                            padding: '0 24px', borderRadius: 28, background: T.surface,
                            boxShadow: isDark ? '8px 8px 20px rgba(0,0,0,0.5), -5px -5px 15px rgba(255,255,255,0.02)' : neuShadow(T, false, 'md', isDark),
                            border: `1px solid ${T.border}`,
                            height: 110, // Tall enough for the big clock
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Weather Lead Segment */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: 24, borderRight: `1px solid ${T.borderAccent}` }}>
                                <div style={{
                                    width: 50, height: 50, borderRadius: 16,
                                    background: isDark ? 'rgba(51,154,240,0.1)' : 'rgba(51,154,240,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {weather ? (
                                        <WeatherIcon code={weather.icon} className="text-[#339AF0]" size={28} />
                                    ) : (
                                        <Sunrise style={{ color: '#339AF0' }} size={28} />
                                    )}
                                </div>
                                <div>
                                    <p style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontMontserrat, margin: 0 }}>
                                        {settings.neonForgeCityData?.name || (settings as any).city || 'Rodeo'}
                                    </p>
                                    <p style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontInter, margin: 0 }}>
                                        {weather ? `${weather.temp}°C` : '--°C'}
                                    </p>
                                </div>
                            </div>

                            {/* Forecast Strip */}
                            <div style={{ display: 'flex', gap: 4, padding: '0 20px', alignItems: 'center', borderRight: `1px solid ${T.borderAccent}` }}>
                                {(weather?.forecast || [0, 1, 2, 3]).map((item: any, offset: number) => {
                                    const dayDate = addDays(currentTime, offset);
                                    const dayName = offset === 0 ? 'Hoy' : format(dayDate, 'EEE', { locale: es });
                                    const dIsToday = offset === 0;

                                    const temp = weather ? item.temp : (22 + offset);
                                    const iconCode = weather ? item.icon : (offset % 2 === 0 ? '0' : '1');

                                    return (
                                        <div key={offset} style={{
                                            padding: '10px 16px', borderRadius: 18,
                                            background: dIsToday ? T.surfaceDeep : 'transparent',
                                            boxShadow: dIsToday ? (isDark ? 'inset 3px 3px 6px rgba(0,0,0,0.4)' : 'inset 3px 3px 6px rgba(0,0,0,0.05)') : 'none',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                                        }}>
                                            <span style={{ fontSize: 8, fontWeight: 800, color: dIsToday ? T.accent : T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat, opacity: 0.8 }}>{dayName}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <WeatherIcon code={iconCode} className={offset % 2 === 0 ? "text-amber-400" : "text-blue-300"} size={14} />
                                                <span style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, fontFamily: T.fontInter }}>{temp}°</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Clock Integrated Segment */}
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 32 }}>
                                <IntegratedClock T={T} isDark={isDark} />
                            </div>

                            {/* Global Slide Progress Bar — Now integrated at the bottom of the header box */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                                background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)',
                                pointerEvents: 'none', overflow: 'hidden'
                            }}>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 10, ease: 'linear' }}
                                    style={{
                                        height: '100%',
                                        background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
                                        boxShadow: `0 0 10px ${T.accent}44`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Existing badge code continues... */}

            {/* Bottom Static Weekly Theme Banner (Moved from top to avoid collision with weather) */}
            {!hideExtra && theme?.title && (
                <div style={{
                    position: 'absolute', bottom: 82, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 20, textAlign: 'center', pointerEvents: 'none'
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 14,
                        padding: '12px 32px', borderRadius: 28,
                        background: isDark ? 'rgba(30,35,45,0.8)' : `${T.surface}CC`,
                        backdropFilter: 'blur(10px)',
                        boxShadow: `${neuShadow(T, true, 'sm', isDark)}, 0 0 20px ${T.accent}20`,
                        border: `1.5px solid ${T.accent}33`
                    }}>
                        <BookOpen style={{ color: T.accent }} size={18} />
                        <span style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: T.accent,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontFamily: T.fontMontserrat
                        }}>
                            {themeLabel}: <span style={{ color: T.textPrimary, fontSize: 16, fontWeight: 700, marginLeft: 6 }}>{theme.title}</span>
                        </span>
                    </div>
                </div>
            )}

            <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {[...Array(total)].map((_, i) => (
                        <div key={i} style={{
                            width: i === currentSlide ? 32 : 12, height: 6, borderRadius: 999,
                            background: i === currentSlide
                                ? `linear-gradient(90deg, ${T.accent}, ${T.accent}aa)`
                                : T.textMuted,
                            opacity: i === currentSlide ? 1 : 0.2, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: i === currentSlide ? `0 4px 12px ${T.accent}33` : 'none'
                        }} />
                    ))}
                </div>
            </div>
        </>
    );
}
