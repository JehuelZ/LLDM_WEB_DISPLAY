'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, Zap } from 'lucide-react';
import { getVariantTokens } from './tokens';

// ══════════════════════════════════════════════════════════════════════════════
// NeonForge — Calendario Mensual v2 (High-Fidelity)
//
// Full-month grid with time badges, service-type pills, color-coded slots,
// live "En Curso" indicator, and neon glassmorphic cells.
// ══════════════════════════════════════════════════════════════════════════════

const DAYS_OF_WEEK = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

// ── Colors per slot (constant across variants — these are slot-identity colors) ──
const SLOT_COLORS = {
    morning: '#60A5FA',   // Blue-400  — 5 AM Oración
    mid:     '#34D399',   // Emerald-400 — 9/10 AM
    evening: '#FB923C',   // Orange-400 — PM
};

export function NeonForgeCalendar() {
    const settings = useAppStore((state: any) => state.settings);
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);
    const T = getVariantTokens(settings);
    const A = T.accent;

    const today = new Date();
    const currentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const getMemberName = (id: string | null): string => {
        if (!id) return '';
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id?.toString().toLowerCase() === cleanId);
        if (member) return member.name;
        return id.length > 20 ? 'ASIGNADO' : id;
    };

    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | 'evening') => {
        const sched = monthlySchedule[dateKey];
        if (!sched) return false;
        const now = new Date();
        const curMin = now.getHours() * 60 + now.getMinutes();
        const todayKey = format(now, 'yyyy-MM-dd');
        if (dateKey !== todayKey) return false;
        const dateObj = new Date(dateKey + 'T12:00:00');
        const isSunday = dateObj.getDay() === 0;
        const ranges: Record<string, [number, number]> = {
            '5am': [5 * 60, 6 * 60 + 15],
            '9am': [(isSunday ? 10 : 9) * 60, (isSunday ? 12 : 10) * 60 + 15],
            'evening': [18 * 60, 20 * 60 + 30],
        };
        const [s, e] = ranges[slotId];
        return curMin >= s && curMin <= e;
    };

    const formatAbbrTime = (timeStr?: string, fallback: string = ''): string => {
        if (!timeStr) return fallback;
        let t = timeStr.toUpperCase().replace(/\s/g, '');
        if (t.startsWith('0')) t = t.substring(1);
        t = t.replace(':00', '');
        return t;
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative"
            style={{ fontFamily: 'var(--font-sora, ui-sans-serif)' }}>

            {/* ── HEADER ── */}
            <div className="shrink-0 pt-16 pl-72 pr-10 pb-3 z-10">
                <motion.div
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-end justify-between"
                >
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-1.5"
                            style={{ color: `${A}60` }}>
                            Vista General Organizacional
                        </p>
                        <h1 className="text-[44px] font-black tracking-tight leading-none"
                            style={{ color: '#FFF' }}>
                            Calendario{' '}
                            <span style={{ color: A, textShadow: `0 0 50px ${A}40` }}>
                                {format(today, 'MMMM', { locale: es })}
                            </span>
                        </h1>
                    </div>

                    {/* Year + Legend */}
                    <div className="flex items-center gap-4 mb-2">
                        {/* Legend */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: SLOT_COLORS.morning }} />
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Oración</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: SLOT_COLORS.mid }} />
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Medio Día</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: SLOT_COLORS.evening }} />
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Vespertina</span>
                            </div>
                        </div>

                        {/* Year pill */}
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                            style={{
                                background: `${A}08`,
                                border: `1px solid ${A}25`,
                                backdropFilter: 'blur(8px)',
                            }}>
                            <Zap className="w-3 h-3" style={{ color: A }} />
                            <span className="text-[11px] font-black uppercase tracking-widest"
                                style={{ color: `${A}90` }}>
                                {format(today, 'yyyy')}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── DAYS OF WEEK HEADER ── */}
            <div className="grid grid-cols-7 gap-[6px] pl-72 pr-10 mb-1 z-10">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center py-1">
                        <span className="text-[10px] font-black tracking-[0.35em] uppercase"
                            style={{ color: i === 0 ? `${A}70` : 'rgba(255,255,255,0.25)' }}>
                            {day}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── CALENDAR GRID ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex-1 grid grid-cols-7 gap-[6px] pl-72 pr-10 pb-14 z-10 min-h-0"
                style={{ gridAutoRows: '1fr' }}
            >
                {/* Blank cells */}
                {blanks.map((b) => (
                    <div key={`blank-${b}`} className="rounded-xl" style={{ background: 'rgba(255,255,255,0.01)' }} />
                ))}

                {/* Day cells */}
                {days.map((day, idx) => {
                    const isToday = isSameDay(day, today);
                    const is14th = day.getDate() === 14;
                    const key = format(day, 'yyyy-MM-dd');
                    const sched = monthlySchedule[key];
                    const isSunday = getDay(day) === 0;
                    const isSaturday = getDay(day) === 6;
                    const isWeekend = isSunday || isSaturday;

                    // Extract member data
                    const m5 = getMemberName(sched?.slots?.['5am']?.leaderId);
                    const m9c = getMemberName(sched?.slots?.['9am']?.consecrationLeaderId);
                    const m9d = getMemberName(sched?.slots?.['9am']?.doctrineLeaderId);
                    const mE1 = getMemberName(sched?.slots?.evening?.leaderIds?.[0]);
                    const mE2 = getMemberName(sched?.slots?.evening?.leaderIds?.[1]);
                    const sundayType = sched?.slots?.['9am']?.sundayType;
                    const eveningLang = sched?.slots?.evening?.language;

                    // Time labels
                    const time5 = formatAbbrTime(sched?.slots?.['5am']?.time, '5AM');
                    const time9 = formatAbbrTime(sched?.slots?.['9am']?.time, isSunday ? '10AM' : '9AM');
                    const timeEve = formatAbbrTime(sched?.slots?.evening?.time, '6PM');

                    // Live status
                    const live5 = isSlotActive(key, '5am');
                    const live9 = isSlotActive(key, '9am');
                    const liveEve = isSlotActive(key, 'evening');

                    const hasAnyData = m5 || m9c || m9d || mE1;

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.008 * idx, duration: 0.3 }}
                            className="relative rounded-xl overflow-hidden flex flex-col"
                            style={{
                                background: isToday
                                    ? `linear-gradient(160deg, ${A}18 0%, ${A}06 100%)`
                                    : is14th
                                        ? 'linear-gradient(160deg, rgba(251,146,60,0.08) 0%, rgba(251,146,60,0.02) 100%)'
                                        : isWeekend
                                            ? 'rgba(255,255,255,0.015)'
                                            : 'rgba(255,255,255,0.025)',
                                border: isToday
                                    ? `1.5px solid ${A}80`
                                    : is14th
                                        ? '1.5px solid rgba(251,146,60,0.35)'
                                        : `1px solid rgba(255,255,255,${isWeekend ? '0.04' : '0.06'})`,
                                boxShadow: isToday
                                    ? `0 0 24px ${A}15, inset 0 1px 0 ${A}15`
                                    : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                            }}
                        >
                            {/* Top accent line for today */}
                            {isToday && (
                                <div className="absolute top-0 left-0 right-0 h-[2px]"
                                    style={{ background: `linear-gradient(90deg, transparent, ${A}, transparent)` }} />
                            )}

                            {/* ── Day Number Row ── */}
                            <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5 shrink-0">
                                <span className="text-[13px] font-black leading-none"
                                    style={{
                                        color: isToday ? A : isWeekend ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)',
                                        textShadow: isToday ? `0 0 12px ${A}60` : 'none',
                                    }}>
                                    {format(day, 'd')}
                                </span>
                                <div className="flex items-center gap-1">
                                    {is14th && <Star size={8} className="text-orange-400" fill="currentColor" />}
                                    {isToday && (
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{ background: A, boxShadow: `0 0 6px ${A}` }} />
                                    )}
                                    {eveningLang === 'en' && (
                                        <div className="px-1 py-[1px] rounded-sm"
                                            style={{ background: SLOT_COLORS.evening, fontSize: '5px' }}>
                                            <span className="font-black text-black leading-none">EN</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Slot Rows ── */}
                            <div className="flex-1 flex flex-col px-1.5 pb-1 gap-[3px] min-h-0 overflow-hidden justify-center">

                                {/* 5 AM — Morning Prayer */}
                                {m5 && (
                                    <SlotRow
                                        time={time5}
                                        name={m5}
                                        label="ORACIÓN"
                                        color={SLOT_COLORS.morning}
                                        isLive={live5}
                                        isToday={isToday}
                                        accent={A}
                                    />
                                )}

                                {/* Separator */}
                                {m5 && (m9c || m9d) && (
                                    <div className="flex justify-center">
                                        <div className="w-[80%] h-px" style={{ background: `rgba(255,255,255,0.06)` }} />
                                    </div>
                                )}

                                {/* 9 AM / 10 AM */}
                                {isSunday && m9c ? (
                                    <SlotRow
                                        time={time9}
                                        name={m9c}
                                        label={sundayType === 'exchange' ? 'INTERC.' : sundayType === 'visitors' ? 'VISITAS' : 'DOMIN.'}
                                        color={SLOT_COLORS.mid}
                                        isLive={live9}
                                        isToday={isToday}
                                        accent={A}
                                    />
                                ) : (m9c || m9d) ? (
                                    <div className="flex gap-0.5">
                                        {m9c && (
                                            <MiniSlotRow
                                                name={m9c}
                                                label="CONS."
                                                color={SLOT_COLORS.mid}
                                                isLive={live9}
                                                isToday={isToday}
                                            />
                                        )}
                                        {m9d && (
                                            <MiniSlotRow
                                                name={m9d}
                                                label={is14th ? 'HIST.' : 'DOC.'}
                                                color={SLOT_COLORS.mid}
                                                isLive={live9}
                                                isToday={isToday}
                                            />
                                        )}
                                    </div>
                                ) : null}

                                {/* Separator */}
                                {(m5 || m9c || m9d) && mE1 && (
                                    <div className="flex justify-center">
                                        <div className="w-[80%] h-px" style={{ background: `rgba(255,255,255,0.06)` }} />
                                    </div>
                                )}

                                {/* Evening */}
                                {mE1 && !mE2 && (
                                    <SlotRow
                                        time={timeEve}
                                        name={mE1}
                                        label={isSunday || getDay(day) === 4 ? 'SERV.' : 'ORACIÓN'}
                                        color={SLOT_COLORS.evening}
                                        isLive={liveEve}
                                        isToday={isToday}
                                        accent={A}
                                    />
                                )}
                                {mE1 && mE2 && (
                                    <div className="flex gap-0.5">
                                        <MiniSlotRow
                                            name={mE1}
                                            label="SERV."
                                            color={SLOT_COLORS.evening}
                                            isLive={liveEve}
                                            isToday={isToday}
                                        />
                                        <MiniSlotRow
                                            name={mE2}
                                            label={is14th ? 'HIST.' : 'DOC.'}
                                            color={SLOT_COLORS.evening}
                                            isLive={liveEve}
                                            isToday={isToday}
                                        />
                                    </div>
                                )}

                                {/* Empty state */}
                                {!hasAnyData && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-4 h-[1px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* ── Bottom title bar ── */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-72 right-10 z-10 flex items-center justify-center gap-3"
            >
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${A}20, transparent)` }} />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]"
                    style={{ color: `${A}40` }}>
                    {format(today, "EEEE d 'de' MMMM yyyy", { locale: es })}
                </span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${A}20, transparent)` }} />
            </motion.div>
        </div>
    );
}


// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS — Slot Rows
// ══════════════════════════════════════════════════════════════════════════════

/** Full-width slot row with time badge + name + service label */
function SlotRow({ time, name, label, color, isLive, isToday, accent }: {
    time: string; name: string; label: string; color: string;
    isLive: boolean; isToday: boolean; accent: string;
}) {
    return (
        <div className="relative flex items-center gap-1 w-full min-h-0">
            {/* Time badge */}
            <div className="shrink-0 px-1 py-[2px] rounded-r-md -ml-1.5"
                style={{
                    background: isLive ? 'rgba(239,68,68,0.3)' : `${color}15`,
                    borderRight: `1.5px solid ${isLive ? '#EF4444' : color}`,
                    borderTop: `0.5px solid ${isLive ? '#EF444440' : `${color}30`}`,
                    borderBottom: `0.5px solid ${isLive ? '#EF444440' : `${color}30`}`,
                }}>
                <div className="flex items-center gap-0.5">
                    {isLive && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_4px_red]" />}
                    <span className="text-[6px] font-black tracking-tight leading-none"
                        style={{ color: isLive ? '#FFF' : color }}>
                        {time}
                    </span>
                </div>
            </div>

            {/* Name + Label */}
            <div className="flex-1 min-w-0 flex flex-col items-center">
                <span className="text-[7px] font-bold uppercase leading-tight truncate w-full text-center"
                    style={{ color: isToday ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)' }}>
                    {name}
                </span>
                <div className="mt-[1px] px-1.5 py-[1px] rounded-full"
                    style={{
                        background: `${color}12`,
                        border: `0.5px solid ${color}30`,
                    }}>
                    <span className="text-[5.5px] font-black uppercase tracking-[0.15em] leading-none"
                        style={{ color: `${color}90` }}>
                        {label}
                    </span>
                </div>
            </div>
        </div>
    );
}

/** Half-width mini slot row (for side-by-side cons/doc or dual evening) */
function MiniSlotRow({ name, label, color, isLive, isToday }: {
    name: string; label: string; color: string; isLive: boolean; isToday: boolean;
}) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 py-[1px]">
            <span className="text-[6px] font-bold uppercase leading-tight truncate w-full text-center"
                style={{ color: isToday ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)' }}>
                {name}
            </span>
            <div className="mt-[1px] px-1 py-[0.5px] rounded-full"
                style={{
                    background: `${color}10`,
                    border: `0.5px solid ${color}25`,
                }}>
                <span className="text-[5px] font-black uppercase tracking-[0.1em] leading-none truncate"
                    style={{ color: `${color}80` }}>
                    {label}
                </span>
            </div>
        </div>
    );
}
