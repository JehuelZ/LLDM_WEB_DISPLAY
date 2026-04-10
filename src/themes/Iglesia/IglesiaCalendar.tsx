'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Star, Info } from 'lucide-react';
import { BigAcademicTitle } from './BigAcademicTitle';
import { getIglesiaTokens, neuShadow } from './tokens';
import { getSlideSystemTitle } from '@/lib/display_labels';

const DAY_HEADERS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

// ──────────────────────────────────────────────────────────────────────────────
// Iglesia — Calendar Slide (Academic Grid)
// ──────────────────────────────────────────────────────────────────────────────

export function IglesiaCalendar() {
    const { monthlySchedule, members, settings } = useAppStore((s: any) => s);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const iglesiaVariant = settings?.iglesiaVariant || 'light';
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | '12pm' | 'evening') => {
        const todayKey = format(currentTime, 'yyyy-MM-dd');
        if (dateKey !== todayKey) return false;

        const curMin = currentTime.getHours() * 60 + currentTime.getMinutes();
        const isSunday = currentTime.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
            '12pm': { start: '12:00', end: '13:00' },
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

        const sched = monthlySchedule[dateKey];
        const slot = (sched?.slots as any)?.[slotId];
        let start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        let end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;

        // Special handling for Sunday Dominical (the 9am slot is used for the morning service)
        if (slotId === '9am' && isSunday) {
            // If the DB record exists but has default weekday times (9-10 AM)
            // we override it to Dominical times (10-12 PM) unless explicitly changed
            if (slot?.time === '09:00 AM' || !slot?.time) start = 600; // 10:00 AM
            if (slot?.endTime === '10:00 AM' || !slot?.endTime) end = 720; // 12:00 PM
        }

        return curMin >= start && curMin <= end;
    };

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startOffset = monthStart.getDay();

    const getMember = (id?: string) => {
        if (!id) return null;
        const m = (members || []).find((x: any) => x.id?.toString().toLowerCase() === id.trim().toLowerCase());
        return m ? { name: m.name } : { name: id.length > 20 ? 'Asignado' : id };
    };

    const monthLabel = format(today, 'MMMM yyyy', { locale: es });

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            padding: '160px 48px 120px 48px',
            gap: 24, background: T.bg,
            fontFamily: T.fontFamily,
            overflow: 'hidden'
        }}>

            {/* Header Section — Aligned Left */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: 'fit-content', minWidth: 600 }}>
                    <BigAcademicTitle
                        label={getSlideSystemTitle('calendar', settings?.language)}
                        icon={CalendarIcon}
                        T={T}
                        isDark={isDark}
                        small={true}
                    />
                </div>
            </div>

            {/* Calendar Container */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                gap: 20, width: '100%',
                position: 'relative'
            }}>

                {/* Legend - Floating Neumorphic Badge */}
                <div style={{
                    position: 'absolute', top: -50, right: 0,
                    padding: '8px 24px', borderRadius: 20, background: T.surface,
                    boxShadow: neuShadow(T, false, 'sm', isDark),
                    display: 'flex', gap: 16, alignItems: 'center',
                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.tertiary }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>5am</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.secondary }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>9am C</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.emerald }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>9am D</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9C27B0' }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>12pm</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>Tarde</span>
                    </div>
                    <div style={{ width: 1, height: 12, background: T.textMuted, opacity: 0.2, margin: '0 4px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Star size={10} style={{ color: '#F59E0B' }} fill="#F59E0B" />
                        <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', fontFamily: T.fontMontserrat }}>Día 14 Historia</span>
                    </div>
                </div>

                {/* Grid Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
                    {DAY_HEADERS.map(d => (
                        <div key={d} style={{
                            textAlign: 'center', padding: '16px 0',
                            fontSize: 14, fontWeight: 800, color: T.textMuted,
                            textTransform: 'uppercase', letterSpacing: '0.15em',
                            background: T.surface, borderRadius: 16,
                            boxShadow: neuShadow(T, true, 'xs', isDark),
                            fontFamily: T.fontMontserrat,
                            border: isDark ? '1px solid rgba(255,255,255,0.03)' : 'none'
                        }}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{
                    flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                    gridTemplateRows: 'repeat(5, 1fr)', gap: 12, minHeight: 0
                }}>
                    {[...Array(startOffset)].map((_, i) => <div key={`e${i}`} />)}

                    {days.map((day, idx) => {
                        const key = format(day, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[key];
                        const isToday = key === format(currentTime, 'yyyy-MM-dd');
                        const isSun = day.getDay() === 0;
                        const is14th = day.getDate() === 14;

                        const active5 = isSlotActive(key, '5am');
                        const active9 = isSlotActive(key, '9am');
                        const active12 = isSlotActive(key, '12pm');
                        const activeEv = isSlotActive(key, 'evening');
                        const hasActive = active5 || active9 || active12 || activeEv;

                        const l5am = getMember(sched?.slots?.['5am']?.leaderId);
                        const l9amCons = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                        const l9amDoc = getMember(sched?.slots?.['9am']?.doctrineLeaderId);
                        const l12pm = getMember(sched?.slots?.['12pm']?.leaderId);
                        const eveningSlot = sched?.slots?.['evening'];

                        // Combining names with pipe as requested
                        const nineAmLabel = [l9amCons?.name, l9amDoc?.name].filter(Boolean).join(' | ');
                        const eveningLabel = (eveningSlot?.leaderIds || [])
                            .map((id: string) => getMember(id)?.name)
                            .filter(Boolean)
                            .join(' | ') || (eveningSlot?.leaderId ? getMember(eveningSlot.leaderId)?.name : null);

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={hasActive ? { scale: [1, 1.01, 1], opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                                transition={hasActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : { delay: idx * 0.02, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: 24,
                                    background: isToday ? T.accent : (is14th ? (isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)') : T.surface),
                                    boxShadow: isToday
                                        ? `0 10px 30px ${T.accent}40, ${neuShadow(T, false, 'md', isDark)}`
                                        : (is14th ? `0 0 25px rgba(245, 158, 11, 0.15), ${neuShadow(T, false, 'sm', isDark)}` : (hasActive ? `0 0 40px ${T.accent}20, ${neuShadow(T, false, 'sm', isDark)}` : neuShadow(T, false, 'sm', isDark))),
                                    display: 'flex', flexDirection: 'column', gap: 6,
                                    overflow: 'hidden',
                                    border: isToday
                                        ? `2px solid ${T.accent}`
                                        : (is14th ? `1.5px dashed #F59E0B` : (hasActive ? `2px solid ${T.accent}` : (isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${T.border}`))),
                                    position: 'relative'
                                }}
                            >
                                {/* Date Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                    <span style={{
                                        fontSize: 24, fontWeight: 800,
                                        color: isToday ? '#FFF' : (isSun ? T.secondary : T.textPrimary),
                                        fontFamily: T.fontMontserrat,
                                        lineHeight: 1
                                    }}>
                                        {format(day, 'd')}
                                    </span>
                                    {isToday && (
                                        <div style={{
                                            padding: '4px 8px', borderRadius: 8,
                                            background: '#FFF', color: T.accent,
                                            fontSize: 10, fontWeight: 900,
                                            fontFamily: T.fontMontserrat,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}>
                                            {hasActive ? 'EN CURSO' : 'HOY'}
                                        </div>
                                    )}
                                </div>

                                {/* Leaders - Stacked and Prestigious */}
                                <div style={{
                                    flex: 1, display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center', gap: 5,
                                    opacity: isToday ? 1 : 0.9
                                }}>
                                    {[
                                        { active: active5, label: l5am?.name, color: T.tertiary },
                                        { active: active9, label: nineAmLabel, color: (isSun ? T.secondary : T.emerald) },
                                        { active: active12, label: l12pm?.name, color: '#9C27B0' },
                                        { active: activeEv, label: eveningLabel, color: T.accent, language: eveningSlot?.language }
                                    ].map((slot, i) => {
                                        if (!slot.label) return null;

                                        const dotColor = slot.active
                                            ? (isToday ? '#FFF' : T.accent)
                                            : (isToday ? 'rgba(255,255,255,0.7)' : slot.color);

                                        const textColor = slot.active
                                            ? (isToday ? '#FFF' : T.accent)
                                            : (isToday ? 'rgba(255,255,255,0.9)' : T.textPrimary);

                                        return (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                                <motion.div
                                                    animate={slot.active ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{
                                                        width: 8, height: 8, borderRadius: '50%',
                                                        background: dotColor,
                                                        flexShrink: 0,
                                                        boxShadow: slot.active ? `0 0 10px ${dotColor}` : 'none'
                                                    }}
                                                />
                                                <p style={{
                                                    fontSize: 13,
                                                    fontWeight: slot.active ? 900 : 700,
                                                    color: textColor,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    margin: 0,
                                                    textShadow: (slot.active && isToday) ? '0 0 8px rgba(255,255,255,0.3)' : 'none'
                                                }}>
                                                    {slot.label}
                                                </p>
                                                {(slot as any).language === 'en' && (
                                                    <div style={{
                                                        padding: '1px 3px',
                                                        background: T.accent,
                                                        color: '#FFF',
                                                        fontSize: 7,
                                                        fontWeight: 900,
                                                        borderRadius: 3,
                                                        fontFamily: T.fontMontserrat,
                                                        flexShrink: 0
                                                    }}>
                                                        EN
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Subtle Sun Indicator */}
                                {isSun && !isToday && !hasActive && (
                                    <div style={{
                                        position: 'absolute', bottom: 12, right: 12,
                                        opacity: 0.15, transform: 'rotate(-15deg)'
                                    }}>
                                        <Star size={32} style={{ color: T.secondary }} fill={T.secondary} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

