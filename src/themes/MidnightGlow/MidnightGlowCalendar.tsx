'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Star } from 'lucide-react';

// THEME: Tech Corporate — Calendar View
// Paleta: navy #040D21 · card #0D1B3E · neon-green #A3FF57 · blue-bright #4F7FFF

const DAYS_OF_WEEK = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export function MidnightGlowCalendar() {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });
    // Sunday=0 in JS, which perfectly matches our new Sunday-first layout
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'HERMANO ASIGNADO' : (id || 'NO ASIGNADO')),
            avatar: member?.avatar || null,
        };
    };

    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | 'evening') => {
        const sched = monthlySchedule[dateKey];
        if (!sched) return false;

        const now = new Date();
        const curMin = now.getHours() * 60 + now.getMinutes();
        const todayKey = format(now, 'yyyy-MM-dd');

        // Si no es hoy, no puede estar "en curso"
        if (dateKey !== todayKey) return false;

        const dateObj = new Date(dateKey + 'T12:00:00');
        const isSunday = dateObj.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
            'evening': { start: '18:00', end: '20:30' },
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

    const formatAbbrTime = (timeStr?: string, defaultFallback: string = "") => {
        if (!timeStr) return defaultFallback;
        let t = (timeStr || '').toUpperCase().replace(/\s/g, '');
        if (t.startsWith('0')) t = t.substring(1);
        t = t.replace(':00', '');
        return t;
    };

    return (
        <div
            className="h-full w-full flex flex-col overflow-hidden relative"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 20%, #071428 0%, #040D21 55%, #02080F 100%)' }}
        >
            {/* ── Background texture: dot grid ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #4F7FFF 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />
            {/* Diagonal stripe overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #4F7FFF 0, #4F7FFF 1px, transparent 0, transparent 50%)',
                    backgroundSize: '22px 22px',
                }}
            />
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[#4F7FFF]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[#A3FF57]/5 blur-[80px] rounded-full pointer-events-none" />

            {/* ── MAIN CONTENT WRAPPER: Centered vertically ── */}
            <div className="z-10 flex-1 flex flex-col justify-center gap-2">

                {/* ── DAYS OF WEEK HEADER ── */}
                <div className="grid grid-cols-7 gap-10 w-[94%] mx-auto mb-2 shrink-0">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="text-center py-1.5">
                            <span className="text-[12px] font-black tracking-[0.3em] text-[#4F7FFF] uppercase">{day}</span>
                        </div>
                    ))}
                </div>

                {/* ── CALENDAR GRID ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-7 gap-4 w-[85%] mx-auto pb-2 min-h-0 place-content-center"
                    style={{ gridAutoRows: 'min-content' }}
                >
                    {/* Blank cells for day offset */}
                    {blanks.map((b) => (
                        <div key={`blank-${b}`} className="rounded-xl bg-[#040D21]/50" />
                    ))}

                    {/* Day cells */}
                    {days.map((day, idx) => {
                        const isToday = isSameDay(day, today);
                        const is14th = day.getDate() === 14;
                        const key = format(day, 'yyyy-MM-dd');
                        const sched = monthlySchedule[key];
                        const isSunday = getDay(day) === 0;
                        const isThursday = getDay(day) === 4;
                        const isServiceDay = isSunday || isThursday;
                        const isSaturday = getDay(day) === 6;
                        const isWeekend = isSunday || isSaturday;

                        const leader5amId = sched?.slots?.['5am']?.leaderId;
                        const leader5am = getMemberDetail(leader5amId);

                        const leader9amConsId = sched?.slots?.['9am']?.consecrationLeaderId;
                        const leader9amCons = getMemberDetail(leader9amConsId);

                        const leader9amDocId = sched?.slots?.['9am']?.doctrineLeaderId;
                        const leader9amDoc = getMemberDetail(leader9amDocId);

                        const sundayType = sched?.slots?.['9am']?.sundayType;
                        const isSundayTypeActive = isSunday && sundayType;

                        const leaderEveningId1 = sched?.slots?.evening?.leaderIds?.[0];
                        const leaderEvening1 = getMemberDetail(leaderEveningId1);
                        const leaderEveningId2 = sched?.slots?.evening?.leaderIds?.[1];
                        const leaderEvening2 = getMemberDetail(leaderEveningId2);

                        const time5am = formatAbbrTime(sched?.slots?.['5am']?.time, '5AM');
                        const time9am = formatAbbrTime(sched?.slots?.['9am']?.time, isSunday ? '10AM' : '9AM');
                        const timeEvening = formatAbbrTime(sched?.slots?.evening?.time, isSunday ? '5PM' : '6PM');

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.02 * idx, duration: 0.3 }}
                                className={`
                                    relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300
                                    aspect-[1.4/1]
                                    ${isToday
                                        ? 'border-2 border-[#A3FF57]/70 bg-[#0D1B3E] shadow-[0_0_40px_rgba(163,255,87,0.3),inset_0_0_20px_rgba(163,255,87,0.05)]'
                                        : is14th
                                            ? 'border-2 border-orange-500/50 bg-orange-500/5 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                            : isWeekend
                                                ? 'border-2 border-[#1E3A6E]/40 bg-[#071020]/80 shadow-[0_30px_90px_rgba(0,0,0,0.5)]'
                                                : 'border-2 border-[#1E3A6E] bg-[#0D1B3E] shadow-[0_30px_90px_rgba(0,0,0,0.8)]'
                                    }
                                `}
                            >
                                {/* 14th Marker */}
                                {is14th && !isToday && <div className="absolute top-1 right-3"><Star size={10} className="text-orange-500/40" fill="currentColor" /></div>}
                                {/* Top accent line for today */}
                                {isToday && (
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A3FF57] to-transparent" />
                                )}

                                {/* Day number */}
                                <div className="flex items-center justify-between px-3 pt-2">
                                    <span className={`text-[14px] font-black leading-none ${isToday ? 'text-[#A3FF57] drop-shadow-[0_0_8px_rgba(163,255,87,0.6)]' :
                                        isWeekend ? 'text-[#4F7FFF]/50' : 'text-white/60'
                                        }`}>
                                        {format(day, 'd')}
                                    </span>
                                    {isToday && (
                                        <div className="w-2 h-2 rounded-full bg-[#A3FF57] shadow-[0_0_8px_#A3FF57] animate-pulse" />
                                    )}
                                </div>

                                {/* Text Schedule inside cell */}
                                <div className="flex-1 flex flex-col px-2 pb-0 gap-1 min-h-0 overflow-hidden justify-center mt-0.5">
                                    {/* 5 AM - Matutina */}
                                    {leader5am.name && (
                                        <div className="relative flex flex-col items-center justify-center w-full mt-1">
                                            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-r bg-[#4F7FFF]/20 border-y border-r ${isSlotActive(key, '5am') ? 'border-red-500 bg-red-500/30' : (isToday ? 'border-[#4F7FFF]/80' : 'border-[#4F7FFF]/40')} shadow-sm px-1 py-0.5 z-10 backdrop-blur-sm flex items-center gap-1`}>
                                                {isSlotActive(key, '5am') && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />}
                                                <span className={`text-[6.5px] font-black tracking-tighter block pt-[1px] ${isSlotActive(key, '5am') ? 'text-white' : (isToday ? 'text-white' : 'text-[#4F7FFF]/90')}`}>{time5am}</span>
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase leading-tight truncate w-full text-center pl-3 ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                {leader5am.name}
                                            </span>
                                            <div className={`mt-0.5 px-2 py-[2px] rounded-full border ml-2 ${isToday ? 'border-[#4F7FFF]/50 bg-[#4F7FFF]/20 backdrop-blur-md' : 'border-[#4F7FFF]/30 bg-[#040D21]/40'} shadow-sm`}>
                                                <span className={`text-[8px] tracking-[0.2em] font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#4F7FFF]' : 'text-[#4F7FFF]/70'}`}>
                                                    ORACIÓN
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 9 AM / 10 AM (Domingo) - Intermedia */}
                                    {(leader9amCons.name || leader9amDoc.name) && leader5am.name && (
                                        <div className="flex justify-center w-full my-1.5 opacity-80">
                                            <div className="w-[85%] h-px bg-gradient-to-r from-transparent via-[#1E3A6E] to-transparent" />
                                        </div>
                                    )}
                                    {isSunday ? (
                                        leader9amCons.name && (
                                            <div className="relative flex flex-col items-center justify-center w-full mt-1">
                                                <div className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-r bg-[#A3FF57]/20 border-y border-r ${isSlotActive(key, '9am') ? 'border-red-500 bg-red-500/30' : (isToday ? 'border-[#A3FF57]/80' : 'border-[#A3FF57]/40')} shadow-sm px-1 py-0.5 z-10 backdrop-blur-sm flex items-center gap-1`}>
                                                    {isSlotActive(key, '9am') && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />}
                                                    <span className={`text-[6.5px] font-black tracking-tighter block pt-[1px] ${isSlotActive(key, '9am') ? 'text-white' : (isToday ? 'text-white' : 'text-[#A3FF57]/90')}`}>{time9am}</span>
                                                </div>
                                                <span className={`text-[8px] font-bold uppercase leading-tight truncate w-full text-center pl-3 ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                    {leader9amCons.name}
                                                </span>
                                                <div className={`mt-0.5 px-2 py-[2px] rounded-full border ml-2 ${isToday ? 'border-[#A3FF57]/50 bg-[#A3FF57]/20 backdrop-blur-md' : 'border-[#A3FF57]/30 bg-[#040D21]/40'} shadow-sm`}>
                                                    <span className={`text-[8px] tracking-[0.2em] font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#A3FF57]' : 'text-[#A3FF57]/70'}`}>
                                                        {sundayType === 'exchange' ? 'INTERCAMBIO' : sundayType === 'visitors' ? 'VISITAS' : 'DOMINICAL'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="relative flex flex-row items-start justify-center w-full mt-1 gap-1">
                                            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-r bg-[#A3FF57]/20 border-y border-r ${isSlotActive(key, '9am') ? 'border-red-500 bg-red-500/30' : (isToday ? 'border-[#A3FF57]/80' : 'border-[#A3FF57]/40')} shadow-sm px-1 py-0.5 z-10 backdrop-blur-sm flex items-center gap-1`}>
                                                {isSlotActive(key, '9am') && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />}
                                                <span className={`text-[6.5px] font-black tracking-tighter block pt-[1px] ${isSlotActive(key, '9am') ? 'text-white' : (isToday ? 'text-white' : 'text-[#A3FF57]/90')}`}>{time9am}</span>
                                            </div>
                                            <div className="flex flex-1 flex-row pl-5 gap-1 w-full">
                                                {leader9amCons.name && (
                                                    <div className="flex flex-1 flex-col items-center justify-center min-w-0">
                                                        <span className={`text-[7px] font-bold uppercase leading-tight truncate w-full text-center ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                            {leader9amCons.name}
                                                        </span>
                                                        <div className={`mt-0.5 px-1.5 py-[2px] rounded-full border ${isToday ? 'border-[#A3FF57]/50 bg-[#A3FF57]/20 backdrop-blur-md' : 'border-[#A3FF57]/30 bg-[#040D21]/40'} shadow-sm max-w-full overflow-hidden`}>
                                                            <span className={`text-[6px] tracking-[0.1em] truncate font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#A3FF57]' : 'text-[#A3FF57]/70'}`}>CONS.</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {leader9amDoc.name && (
                                                    <div className="flex flex-1 flex-col items-center justify-center min-w-0">
                                                        <span className={`text-[7px] font-bold uppercase leading-tight truncate w-full text-center ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                            {leader9amDoc.name}
                                                        </span>
                                                        <div className={`mt-0.5 px-1.5 py-[2px] rounded-full border ${isToday ? 'border-[#A3FF57]/50 bg-[#A3FF57]/20 backdrop-blur-md' : 'border-[#A3FF57]/30 bg-[#040D21]/40'} shadow-sm max-w-full overflow-hidden`}>
                                                            <span className={`text-[6px] tracking-[0.1em] truncate font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#A3FF57]' : 'text-[#A3FF57]/70'}`}>DOC.</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Evening / PM */}
                                    {(leaderEvening1.name || leaderEvening2.name) && (leader5am.name || leader9amCons.name || leader9amDoc.name) && (
                                        <div className="flex justify-center w-full my-1.5 opacity-80">
                                            <div className="w-[85%] h-px bg-gradient-to-r from-transparent via-[#1E3A6E] to-transparent" />
                                        </div>
                                    )}

                                    {/* Si solo hay 1 responsable en la noche, usar el tamaño completo */}
                                    {leaderEvening1.name && !leaderEvening2.name && (
                                        <div className="relative flex flex-col items-center justify-center w-full mt-1">
                                            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-r bg-[#FF6B00]/20 border-y border-r ${isSlotActive(key, 'evening') ? 'border-red-500 bg-red-500/30' : (isToday ? 'border-[#FF6B00]/80' : 'border-[#FF6B00]/40')} shadow-sm px-1 py-0.5 z-10 backdrop-blur-sm flex items-center gap-1`}>
                                                {isSlotActive(key, 'evening') && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />}
                                                <span className={`text-[6.5px] font-black tracking-tighter block pt-[1px] ${isSlotActive(key, 'evening') ? 'text-white' : (isToday ? 'text-white' : 'text-[#FF6B00]/90')}`}>{timeEvening}</span>
                                            </div>

                                            <span className={`text-[8px] font-bold uppercase leading-tight truncate w-full text-center pl-3 ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                {leaderEvening1.name}
                                            </span>
                                            <div className={`mt-0.5 px-2 py-[2px] rounded-full border ml-2 ${isToday ? 'border-[#FF6B00]/50 bg-[#FF6B00]/20 backdrop-blur-md' : 'border-[#FF6B00]/30 bg-[#040D21]/40'} shadow-sm relative`}>
                                                <span className={`text-[8px] tracking-[0.2em] font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#FF6B00]' : 'text-[#FF6B00]/70'}`}>
                                                    {isServiceDay ? 'SERVICIO' : 'ORACIÓN'}
                                                </span>
                                                {sched?.slots?.evening?.language === 'en' && (
                                                    <div className="absolute -right-3 top-0 px-1 py-[1px] bg-[#FF6B00] rounded-sm shadow-sm ring-1 ring-white/20">
                                                        <span className="text-[5px] font-black text-white leading-none">EN</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Si hay 2 responsables (Jueves, Domingo, etc), dividirlos lado a lado */}
                                    {leaderEvening1.name && leaderEvening2.name && (
                                        <div className="relative flex flex-row items-start justify-center w-full mt-1 gap-1">
                                            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-r bg-[#FF6B00]/20 border-y border-r ${isSlotActive(key, 'evening') ? 'border-red-500 bg-red-500/30' : (isToday ? 'border-[#FF6B00]/80' : 'border-[#FF6B00]/40')} shadow-sm px-1 py-0.5 z-10 backdrop-blur-sm flex items-center gap-1`}>
                                                {isSlotActive(key, 'evening') && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />}
                                                <span className={`text-[6.5px] font-black tracking-tighter block pt-[1px] ${isSlotActive(key, 'evening') ? 'text-white' : (isToday ? 'text-white' : 'text-[#FF6B00]/90')}`}>{timeEvening}</span>
                                            </div>
                                            <div className="flex flex-1 flex-row pl-5 gap-1 w-full">
                                                <div className="flex flex-1 flex-col items-center justify-center min-w-0">
                                                    <span className={`text-[7px] font-bold uppercase leading-tight truncate w-full text-center ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                        {leaderEvening1.name}
                                                    </span>
                                                    <div className={`mt-0.5 px-1.5 py-[2px] rounded-full border ${isToday ? 'border-[#FF6B00]/50 bg-[#FF6B00]/20 backdrop-blur-md' : 'border-[#FF6B00]/30 bg-[#040D21]/40'} shadow-sm max-w-full overflow-hidden relative`}>
                                                        <span className={`text-[6px] tracking-[0.1em] truncate font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#FF6B00]' : 'text-[#FF6B00]/70'}`}>
                                                            {isServiceDay ? 'SERV.' : 'ORACIÓN'}
                                                        </span>
                                                        {sched?.slots?.evening?.language === 'en' && (
                                                            <div className="absolute -right-1 top-0 px-0.5 py-[0.5px] bg-[#FF6B00] rounded-[1px] shadow-sm ring-1 ring-white/10">
                                                                <span className="text-[4px] font-black text-white leading-none">EN</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-col items-center justify-center min-w-0">
                                                    <span className={`text-[7px] font-bold uppercase leading-tight truncate w-full text-center ${isToday ? 'text-white' : 'text-white/80'}`}>
                                                        {leaderEvening2.name}
                                                    </span>
                                                    <div className={`mt-0.5 px-1.5 py-[2px] rounded-full border ${isToday ? 'border-[#FF6B00]/50 bg-[#FF6B00]/20 backdrop-blur-md' : 'border-[#FF6B00]/30 bg-[#040D21]/40'} shadow-sm max-w-full overflow-hidden relative`}>
                                                        <span className={`text-[6px] tracking-[0.1em] truncate font-black uppercase leading-none block pt-[1px] ${isToday ? 'text-[#FF6B00]' : 'text-[#FF6B00]/70'}`}>
                                                            {isSunday ? 'VESP.' : 'SERV.'}
                                                        </span>
                                                        {sched?.slots?.evening?.language === 'en' && (
                                                            <div className="absolute -right-1 top-0 px-0.5 py-[0.5px] bg-[#FF6B00] rounded-[1px] shadow-sm ring-1 ring-white/10">
                                                                <span className="text-[4px] font-black text-white leading-none">EN</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ── BOTTOM HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 flex flex-col items-center justify-center shrink-0 text-center pb-8"
                >
                    <p className="text-[10px] tracking-[0.5em] text-[#4F7FFF] uppercase font-bold mb-2">Vista General Organizacional</p>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-4">
                        CALENDARIO <span className="text-[#A3FF57]">MENSUAL</span>
                    </h1>

                    {/* Month + Year pill */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-3 border border-[#4F7FFF]/40 bg-[#0D1B3E]/80 rounded-full px-6 py-2 shadow-[0_0_20px_rgba(79,127,255,0.15)] backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF57] animate-pulse shadow-[0_0_10px_#A3FF57]" />
                            <span className="text-[13px] font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                                {format(today, 'MMMM', { locale: es })} <span className="text-[#4F7FFF]/70 ml-1">{format(today, 'yyyy')}</span>
                            </span>
                        </div>
                    </div>
                </motion.div>

            </div>

            <div className="absolute bottom-4 right-10 text-[8px] tracking-[0.5em] text-white/10 font-mono uppercase select-none">
                LLDM · TC-OVERDRIVE V3
            </div>

        </div >
    );
}
