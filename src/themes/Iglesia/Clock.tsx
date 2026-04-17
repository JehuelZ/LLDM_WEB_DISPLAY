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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: T.fontMono, lineHeight: 1.1 }}>
                <span style={{ fontSize: 58, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {format(time, 'HH:mm')}
                </span>
                <span style={{ fontSize: 28, fontWeight: 700, color: T.accent, marginLeft: 2 }}>
                    {format(time, 'ss')}
                </span>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.16em', fontFamily: T.fontMontserrat, marginTop: 4, whiteSpace: 'nowrap' }}>
                {format(time, "EEE d 'de' MMMM", { locale: es })}
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
    const settings = useAppStore((s: any) => s.settings);
    const theme = useAppStore((s: any) => s.theme);
    const monthlySchedule = useAppStore((s: any) => s.monthlySchedule);
    const iglesiaVariant = settings?.iglesiaVariant || 'light';
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    const unit = settings?.weatherUnit || 'fahrenheit';
    const isCelsius = unit === 'celsius';

    // Weather Fetching — Using unified settings from Admin
    const { weather } = useWeather(
        settings?.weatherLat || 38.033, // Default to Vallejo/Rodeo CA if not set
        settings?.weatherLng || -122.267,
        unit
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
                position: 'absolute', top: 30, left: 24, right: 24,
                zIndex: 30, pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    {/* Unified Header Mega-Box (Logo + Theme + Weather + Clock) — ALWAYS VISIBLE */}
                    {(() => {
                        const curMin = currentTime.getHours() * 60 + currentTime.getMinutes();
                        const isSunToday = currentTime.getDay() === 0;
                        const dateKey = format(currentTime, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[dateKey];

                        const defaults = {
                            '5am': { start: '05:00', end: '06:15' },
                            '9am': { start: isSunToday ? '10:00' : '09:00', end: isSunToday ? '12:00' : '10:15' },
                            'evening': { start: '18:30', end: '20:30' },
                        };

                        const parseTimeStr = (t?: string) => {
                            if (!t) return null;
                            const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                            if (!match) return null;
                            let [_, hStr, mStr, period] = match;
                            let h = parseInt(hStr, 10);
                            let m = parseInt(mStr, 10);
                            if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
                            if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
                            return h * 60 + m;
                        };

                        const checkActive = (slotId: '5am' | '9am' | 'evening') => {
                            const slot = (sched?.slots as any)?.[slotId];
                            let start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
                            let end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;

                            if (slotId === '9am' && isSunToday) {
                                if (slot?.time === '09:00 AM' || !slot?.time) start = 600; // 10:00 AM
                                if (slot?.endTime === '10:00 AM' || !slot?.endTime) end = 720; // 12:00 PM
                            }

                            return curMin >= start && curMin <= end;
                        };

                        const activeSlot = checkActive('9am') ? '9am' : (checkActive('evening') ? 'evening' : (checkActive('5am') ? '5am' : null));
                        const isLive = !!activeSlot;

                        let liveLabel = '';
                        if (activeSlot === '9am') liveLabel = isSunToday ? 'Escuela Dominical' : 'Oración de 9 AM';
                        else if (activeSlot === '5am') liveLabel = 'Oración de las 5';
                        else if (activeSlot === 'evening') {
                            const type = (sched?.slots as any)?.evening?.type || 'regular';
                            const labels: any = { youth: 'Servicio Jóvenes', married: 'Servicio Casados', children: 'Escuela Niños', praise: 'Servicio Alabanza' };
                            liveLabel = labels[type] || 'Servicio de Adoración';
                        }

                        return (
                            <div style={{
                                display: 'flex', gap: 0, alignItems: 'stretch', justifyContent: 'space-between',
                                padding: '0 40px', borderRadius: 40, background: isLive ? `${T.accent}08` : (isDark ? 'rgba(30,35,45,0.7)' : `${T.surface}CC`),
                                backdropFilter: 'blur(15px)',
                                boxShadow: isLive
                                    ? `0 0 60px ${T.accent}25, ${neuShadow(T, false, 'md', isDark)}`
                                    : (isDark ? '12px 12px 40px rgba(0,0,0,0.6), -5px -5px 25px rgba(255,255,255,0.02)' : neuShadow(T, false, 'xl', isDark)),
                                border: isLive ? `3.5px solid ${T.accent}` : `1.5px solid ${T.accent}25`,
                                height: 160,
                                width: '100%',
                                position: 'relative', overflow: 'hidden',
                                transition: 'all 0.5s ease'
                            }}>
                                {/* LEFT SEGMENT: Logo + Church Metadata */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingRight: 32, borderRight: `1px solid ${T.borderAccent}`, flexShrink: 0 }}>
                                    <ChurchHeaderBadge name={(settings as any)?.churchName || 'LLDM'} T={T} isDark={isDark} settings={settings} />
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 'fit-content' }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontInter, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                                            {(settings as any)?.churchName || 'Iglesia del Dios Vivo'}
                                        </p>
                                        <p style={{ fontSize: 11, fontWeight: 400, color: T.textMuted, fontFamily: T.fontInter, marginTop: 4, margin: 0 }}>
                                            {(settings as any)?.churchAddress || 'Sistema de Información Digital'}
                                        </p>
                                    </div>
                                </div>

                                {/* CENTER SEGMENT: Weekly Theme */}
                                {theme?.title && (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 16,
                                            padding: '16px 36px',
                                            borderRadius: 24,
                                            background: T.surface,
                                            boxShadow: isDark ? `inset 8px 8px 16px rgba(0,0,0,0.7), inset -5px -5px 12px rgba(255,255,255,0.04)` : `inset 5px 5px 12px rgba(0,0,0,0.06), inset -5px -5px 12px #FFFFFF`,
                                            border: 'none',
                                            transition: 'all 0.5s ease',
                                            overflow: 'hidden'
                                        }}>
                                            <BookOpen style={{ color: T.accent }} size={18} />
                                            <span style={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color: T.accent,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.2em',
                                                fontFamily: T.fontMontserrat,
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {themeLabel}: <span style={{ color: T.textPrimary, fontSize: 22, fontWeight: 700, marginLeft: 12 }}>{theme.title}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* RIGHT SEGMENT: Live Info or Weather + Clock */}
                                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                    {/* Live Indicator Segment */}
                                    {isLive && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
                                            background: `${T.accent}15`, borderLeft: `1px solid ${T.accent}30`
                                        }}>
                                            <motion.div
                                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                style={{ width: 12, height: 12, borderRadius: '50%', background: T.accent, boxShadow: `0 0 15px ${T.accent}` }}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 9, fontWeight: 900, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: T.fontMontserrat }}>En Curso</span>
                                                <span style={{ fontSize: 16, fontWeight: 800, color: T.textPrimary, fontFamily: T.fontInter, whiteSpace: 'nowrap' }}>{liveLabel}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Weather Lite Segment (Stay in Header) — RE-VERIFIED: NO FORECAST STRIP */}
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: 20, padding: '0 40px', 
                                        borderLeft: `1px solid ${T.borderAccent}`, flexShrink: 0, 
                                        background: isDark ? 'rgba(0,0,0,0.1)' : 'transparent' 
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{
                                                width: 54, height: 54, borderRadius: 18,
                                                background: isDark ? 'rgba(51,154,240,0.18)' : 'rgba(30,135,240,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {weather ? (
                                                    <WeatherIcon code={weather.icon} className="text-[#339AF0]" size={30} />
                                                ) : (
                                                    <Sunrise style={{ color: '#339AF0' }} size={30} />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontMontserrat, margin: 0 }}>
                                                    {settings?.weatherCity || (settings as any)?.city || 'Rodeo'}
                                                </p>
                                                <p style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontInter, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                                                    {weather ? `${weather.temp}°` : `--°`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

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

            {/* FLOATING CLOCK: Bottom Right Corner */}
            <div style={{
                position: 'absolute', bottom: 40, right: 50,
                zIndex: 40, pointerEvents: 'auto'
            }}>
                <div style={{
                    padding: '16px 32px',
                    borderRadius: 32,
                    background: isDark ? 'rgba(30,35,45,0.7)' : `${T.surface}EE`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: isDark ? '12px 12px 40px rgba(0,0,0,0.6), -5px -5px 25px rgba(255,255,255,0.02)' : neuShadow(T, false, 'lg', isDark),
                    border: `1.5px solid ${T.accent}20`,
                    transition: 'all 0.5s ease'
                }}>
                    <IntegratedClock T={T} isDark={isDark} />
                </div>
            </div>
        </>
    );
}
