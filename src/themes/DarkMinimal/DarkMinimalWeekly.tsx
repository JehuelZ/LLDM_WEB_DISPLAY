'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

// ─────────────────────────────────────────────
// THEME: Dark Minimal — Weekly View
// Names BIG + Avatars — ~70% of column space
// ─────────────────────────────────────────────

// Helper: abbreviate only if really long (>22 chars)
const displayName = (full: string) => full.length > 22 ? full.split(' ').slice(0, 2).join(' ') : full;

// Avatar component — square rounded, shows photo or fallback icon
const SlotAvatar = ({ detail, size = 'md' }: { detail: { name: string; avatar: string | null }; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const dim = size === 'xl' ? 'w-16 h-16'
        : size === 'lg' ? 'w-12 h-12'
            : size === 'md' ? 'w-10 h-10'
                : 'w-8 h-8';   // sm
    return (
        <div className={`${dim} rounded-xl overflow-hidden border border-[#3B82F6]/30 flex-shrink-0 bg-[#0F1117] flex items-center justify-center`}>
            {detail.avatar
                ? <img src={detail.avatar} alt="" className="w-full h-full object-cover" />
                : <User className="w-5 h-5 text-[#3B5577]" />
            }
        </div>
    );
};

export function DarkMinimalWeekly() {
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);

    const [mounted, setMounted] = useState(false);
    const [today] = useState(() => new Date());

    useEffect(() => { setMounted(true); }, []);

    const daysProgram = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(today, i);
            const dateKey = format(date, 'yyyy-MM-dd');
            return {
                dateKey,
                dayName: format(date, 'eee', { locale: es }).toUpperCase(),
                dayNum: format(date, 'd'),
                sched: monthlySchedule[dateKey],
                date,
                isToday: isSameDay(date, today),
            };
        });
    }, [today, monthlySchedule]);

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || null,
        };
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

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
            'evening': { start: '18:30', end: '20:30' },
        };

        const parseTimeStr = (t?: string) => {
            if (!t) return null;
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (!match) {
                const simpleMatch = t.match(/(\d+)\s*(AM|PM)?/i);
                if (!simpleMatch) return null;
                let h = parseInt(simpleMatch[1], 10);
                const period = simpleMatch[2];
                if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
                if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
                return h * 60;
            }
            let [_, hStr, mStr, period] = match;
            let h = parseInt(hStr, 10);
            let m = parseInt(mStr, 10);
            if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
            if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        const slot = (sched?.slots as any)?.[slotId];
        const start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        const end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;
        return curMin >= start && curMin <= end;
    };

    if (!mounted) return null;

    return (
        <div
            className="h-full w-full flex flex-col overflow-hidden relative"
            style={{ background: '#0F1117' }}
        >
            {/* ── HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center pt-5 pb-4 shrink-0 text-center"
            >
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563] mb-1">
                    Vista Semanal
                </p>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Programa <span className="text-[#3B82F6]">Semanal</span>
                </h1>
                <div className="flex items-center gap-2 border border-[#23242F] bg-[#16171F] rounded-full px-3 py-0.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                        {format(today, "d 'de' MMM", { locale: es })} — {format(addDays(today, 6), "d 'de' MMM yyyy", { locale: es })}
                    </span>
                </div>
            </motion.div>

            {/* ── 7 COLUMNS ── */}
            <div className="z-10 flex-1 flex gap-2 px-5 pb-5 min-h-0 w-full">
                {daysProgram.map(({ dateKey, dayName, dayNum, sched, isToday }, colIdx) => {
                    const isSunday = dayName === 'DOM' || dayName === 'DOMINGO';

                    const slot5am = sched?.slots?.['5am'];
                    const slot9am = sched?.slots?.['9am'];
                    const slotEv = sched?.slots?.evening;

                    const leader5am = getMemberDetail(slot5am?.leaderId || null);
                    const leader9amCons = getMemberDetail(slot9am?.consecrationLeaderId || null);
                    const leader9amDoc = getMemberDetail(slot9am?.doctrineLeaderId || null);
                    const leaderEv1 = getMemberDetail(slotEv?.leaderIds?.[0] || null);
                    const leaderEv2 = getMemberDetail(slotEv?.doctrineLeaderId || (slotEv?.leaderIds?.[0] !== slotEv?.leaderIds?.[1] ? slotEv?.leaderIds?.[1] : null) || null);

                    const sundayType = slot9am?.sundayType;
                    const sundayLabel = sundayType === 'exchange' ? 'Intercambio'
                        : sundayType === 'broadcast' ? 'Transm.'
                            : sundayType === 'visitors' ? 'Visitas'
                                : 'Dominical';

                    const hasAnyData = leader5am.name || leader9amCons.name || leader9amDoc.name || leaderEv1.name;

                    // Big name + role text block
                    const BigName = ({ name, color, role }: { name: string; color: string; role?: string }) => (
                        <div className="flex flex-col leading-tight min-w-0">
                            <span
                                className={`font-black leading-none break-words ${color}`}
                                style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}
                            >
                                {displayName(name)}
                            </span>
                            {role && (
                                <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-[#4B5563] mt-[2px]">
                                    {role}
                                </span>
                            )}
                        </div>
                    );

                    return (
                        <motion.div
                            key={dateKey}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * colIdx, type: 'spring', stiffness: 100 }}
                            className={`flex-1 flex flex-col rounded-2xl border overflow-hidden transition-all duration-300
                                ${isToday
                                    ? 'border-[#3B82F6] bg-[#1C1E2C]'
                                    : 'border-[#1E1F28] bg-[#16171F]'
                                }
                            `}
                        >
                            {/* Top accent today */}
                            {isToday && (
                                <div className="h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] shrink-0" />
                            )}

                            {/* Day header */}
                            <div className={`px-3 py-2.5 shrink-0 ${isToday ? 'bg-[#3B82F6]/10 border-b border-[#3B82F6]/20' : 'border-b border-[#1E1F28]'}`}>
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isToday ? 'text-[#3B82F6]' : 'text-[#4B5563]'}`}>
                                        {dayName}
                                    </span>
                                    {isToday && (
                                        <span className="text-[7px] font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/15 px-1.5 py-0.5 rounded-full">
                                            Hoy
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`font-bold leading-none tabular-nums ${isToday ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}
                                    style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
                                >
                                    {dayNum}
                                </span>
                            </div>

                            {/* ── SERVICE ROWS — avatar + big name ── */}
                            <div className="flex flex-col flex-1 min-h-0 divide-y divide-[#1E1F28] overflow-hidden">

                                {/* 5 AM */}
                                <div className="px-3 py-1.5 flex flex-col gap-2 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[7px] font-bold uppercase tracking-widest text-[#4B5563]">05 AM</span>
                                        {isSlotActive(dateKey, '5am') && (
                                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[6px] font-black uppercase tracking-widest text-red-500">En curso</span>
                                            </div>
                                        )}
                                    </div>
                                    {leader5am.name ? (
                                        <div className="flex flex-col items-center text-center gap-3 py-2">
                                            <SlotAvatar detail={leader5am} size="xl" />
                                            <BigName
                                                name={leader5am.name}
                                                color={isToday ? 'text-white' : 'text-[#D1D5DB]'}
                                                role={slot5am?.customLabel || 'Oración'}
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-[#2A2B35] italic">— vacante</span>
                                    )}
                                </div>

                                {/* 9 AM / Sunday */}
                                <div className="px-3 py-1.5 flex flex-col gap-2 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[7px] font-bold uppercase tracking-widest text-[#4B5563]">
                                            {isSunday ? '10 AM' : '09 AM'}
                                        </span>
                                        {isSlotActive(dateKey, '9am') && (
                                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[6px] font-black uppercase tracking-widest text-red-500">En curso</span>
                                            </div>
                                        )}
                                    </div>
                                    {isSunday ? (
                                        <div className="flex items-center gap-1.5">
                                            <Crown className="w-4 h-4 text-[#F59E0B] shrink-0" />
                                            <span
                                                className="font-bold text-[#F59E0B] break-words leading-tight"
                                                style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
                                            >
                                                {sundayLabel}
                                            </span>
                                        </div>
                                    ) : (leader9amCons.name || leader9amDoc.name) ? (
                                        <div className="flex flex-col gap-3">
                                            {(leader9amCons.name && leader9amDoc.name && leader9amCons.name === leader9amDoc.name) || (leader9amCons.name && !leader9amDoc.name) || (!leader9amCons.name && leader9amDoc.name) ? (
                                                <div className="flex flex-col items-center text-center gap-3 py-2">
                                                    <SlotAvatar detail={leader9amCons.name ? leader9amCons : leader9amDoc} size="xl" />
                                                    <BigName
                                                        name={leader9amCons.name || leader9amDoc.name}
                                                        color={isToday ? 'text-[#3B82F6]' : 'text-[#D1D5DB]'}
                                                        role={leader9amCons.name && leader9amDoc.name ? "Oración y Doctrina" : (leader9amCons.name ? "Oración" : "Doctrina")}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    {leader9amCons.name && (
                                                        <div className="flex items-center gap-2.5">
                                                            <SlotAvatar detail={leader9amCons} size="lg" />
                                                            <BigName
                                                                name={leader9amCons.name}
                                                                color={isToday ? 'text-white' : 'text-[#D1D5DB]'}
                                                                role="Oración"
                                                            />
                                                        </div>
                                                    )}
                                                    {leader9amDoc.name && (
                                                        <div className="flex items-center gap-2.5">
                                                            <SlotAvatar detail={leader9amDoc} size="md" />
                                                            <BigName
                                                                name={leader9amDoc.name}
                                                                color={isToday ? 'text-white/70' : 'text-[#9CA3AF]'}
                                                                role="Doctrina"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-[#2A2B35] italic">— vacante</span>
                                    )}
                                </div>

                                {/* Evening — flex-1, avatar más grande */}
                                <div className="px-3 py-1.5 flex flex-col gap-2 flex-1 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[7px] font-bold uppercase tracking-widest ${isToday ? 'text-[#3B82F6]' : 'text-[#4B5563]'}`}>
                                                Vespertino
                                            </span>
                                            {sched?.slots?.evening?.language === 'en' && (
                                                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-[6px] font-black uppercase tracking-widest">
                                                    EN
                                                </span>
                                            )}
                                        </div>
                                        {isSlotActive(dateKey, 'evening') && (
                                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[6px] font-black uppercase tracking-widest text-red-500">En curso</span>
                                            </div>
                                        )}
                                    </div>
                                    {leaderEv1.name ? (
                                        <div className="flex flex-col gap-4">
                                            {!leaderEv2.name ? (
                                                <div className="flex flex-col items-center text-center gap-3 py-2">
                                                    <div className="relative">
                                                        <div className="absolute inset-x-[-10px] inset-y-[-10px] rounded-2xl bg-[#3B82F6]/10 blur-xl -z-10" />
                                                        <SlotAvatar detail={leaderEv1} size="xl" />
                                                    </div>
                                                    <BigName
                                                        name={leaderEv1.name}
                                                        color={isToday ? 'text-[#3B82F6]' : 'text-[#D1D5DB]'}
                                                        role={slotEv?.customLabel || (isSunday ? 'Director' : 'Oración y Doctrina')}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2.5">
                                                        <SlotAvatar detail={leaderEv1} size="xl" />
                                                        <BigName
                                                            name={leaderEv1.name}
                                                            color={isToday ? 'text-[#3B82F6]' : 'text-[#D1D5DB]'}
                                                            role={slotEv?.customLabel || 'Oración'}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <SlotAvatar detail={leaderEv2} size="lg" />
                                                        <BigName
                                                            name={leaderEv2.name}
                                                            color={isToday ? 'text-[#60A5FA]' : 'text-[#9CA3AF]'}
                                                            role="Doctrina"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-[#2A2B35] italic">— vacante</span>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    );
                })}
            </div>

            {/* Footer branding */}
            <div className="absolute bottom-1.5 right-8 text-[8px] tracking-widest text-[#1A1B23] font-mono uppercase select-none">
                LLDM · DM-WKLY
            </div>
        </div>
    );
}
