'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Church, Sunrise, Sun, User, HeartHandshake, Radio, Users, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

// THEME: Tech Corporate — Weekly View
// Paleta: navy #040D21 · card #0D1B3E · neon-green #A3FF57 · blue-bright #4F7FFF

type ServiceSlot = {
    id: '5am' | '9am' | '12pm' | 'evening';
    hour: string;
    period: string;
    label: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    accent: 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'emerald';
    timeAccent: string;
    roles: string[];
    leaderIds: (string | null)[];
    sundayType?: string;
    churchOrigin?: string;
    language?: string;
};

export function MidnightGlowWeekly() {
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);

    const [mounted, setMounted] = useState(false);
    const [today] = useState(() => new Date());

    useEffect(() => { setMounted(true); }, []);

    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | '12pm' | 'evening') => {
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
            '9am': {
                start: isSunday ? '10:00' : '09:00',
                end: isSunday ? '12:00' : '10:15'
            },
            '12pm': { start: '12:00', end: '13:00' },
            'evening': { start: '18:30', end: '20:30' }
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

    const getSlots = (sched: any, dayName: string): ServiceSlot[] => {
        const isSunday = dayName.toUpperCase() === 'DOM' || dayName.toUpperCase() === 'DOMINGO';

        const slots: ServiceSlot[] = [
            {
                id: '5am',
                hour: '05:00', period: 'AM',
                label: 'Matutina',
                title: 'ORACIÓN DE CINCO',
                subtitle: 'CONSAGRACIÓN MATUTINA',
                icon: <Sunrise className="w-3.5 h-3.5" />,
                accent: 'blue',
                timeAccent: 'text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]',
                roles: ['CONSAGRACIÓN'],
                leaderIds: [sched?.slots?.['5am']?.leaderId || null],
            }
        ];

        // 9 AM Slot
        const slot9 = sched?.slots?.['9am'];
        const hour9 = isSunday ? '10:00' : '09:00';
        const title9 = isSunday ? (slot9?.sundayType === 'exchange' ? 'INTERCAMBIO' : slot9?.sundayType === 'broadcast' ? 'TRANSMISIÓN' : slot9?.sundayType === 'visitors' ? 'DOMINICAL DE VISITAS' : 'ESCUELA DOMINICAL') : 'ORACIÓN DE NUEVE';
        const subtitle9 = isSunday ? (slot9?.sundayType === 'exchange' ? (slot9?.churchOrigin || 'DE MINISTRO') : slot9?.sundayType === 'broadcast' ? 'INTERNACIONAL' : slot9?.sundayType === 'visitors' ? (slot9?.language === 'en' ? 'ENGLISH SERVICE' : 'PUERTAS ABIERTAS') : 'IGLESIA LOCAL') : 'CONSAGRACIÓN MATUTINA';
        const icons9 = {
            exchange: <HeartHandshake className="w-4 h-4" />,
            broadcast: <Radio className="w-4 h-4" />,
            visitors: <Users className="w-4 h-4" />,
            local: <Crown className="w-4 h-4" />
        };
        const icon9 = isSunday ? (icons9[slot9?.sundayType as keyof typeof icons9] || icons9.local) : <Sun className="w-3.5 h-3.5" />;
        const accent9 = isSunday ? (slot9?.sundayType === 'exchange' ? 'purple' : slot9?.sundayType === 'broadcast' ? 'red' : slot9?.sundayType === 'visitors' ? 'emerald' : 'orange') : 'blue';

        // Robust Sunday 9am Leader logic:
        // If it's Sunday and "local", and no specific leaders assigned, we might want to show the Minister? 
        // No, for Weekly View we usually show what's strictly in the slots.
        const leaderIds9 = (isSunday && (slot9?.sundayType === 'exchange' || slot9?.sundayType === 'broadcast'))
            ? [null] // No leaders shown for exchange/broadcast in weekly view usually
            : [slot9?.consecrationLeaderId || null, slot9?.doctrineLeaderId || null].filter((id, i, arr) => id !== null || (i === 0 && arr[1] !== null));

        slots.push({
            id: '9am',
            hour: hour9, period: 'AM',
            label: 'Intermedia',
            title: title9,
            subtitle: subtitle9,
            icon: icon9,
            accent: accent9 as any,
            timeAccent: 'text-white',
            roles: isSunday ? ['CONS.', 'DOC.'] : ['CONSAGRACIÓN', 'DOCTRINA'],
            sundayType: slot9?.sundayType,
            language: slot9?.language || 'es',
            churchOrigin: slot9?.churchOrigin,
            leaderIds: leaderIds9,
        });

        // 12 PM Slot (Optional)
        const slot12 = sched?.slots?.['12pm'];
        if (slot12?.leaderId) {
            slots.push({
                id: '12pm',
                hour: '12:00', period: 'PM',
                label: 'Mediodía',
                title: 'ORACIÓN DE DOCE',
                subtitle: 'CONSAGRACIÓN',
                icon: <Sun className="w-3.5 h-3.5" />,
                accent: 'emerald',
                timeAccent: 'text-white',
                roles: ['CONSAGRACIÓN'],
                leaderIds: [slot12.leaderId],
            });
        }

        // Evening Slot
        const slotEv = sched?.slots?.evening;
        slots.push({
            id: 'evening',
            hour: '06:00', period: 'PM',
            label: 'Principal',
            title: 'CULTO PRINCIPAL',
            subtitle: 'SERVICIO VESPERTINO',
            icon: <Church className="w-3.5 h-3.5" />,
            accent: 'green',
            timeAccent: 'text-[#A3FF57] drop-shadow-[0_0_15px_rgba(163,255,87,0.8)]',
            roles: ['SERVICIO', 'DOCTRINA'],
            language: slotEv?.language || 'es',
            leaderIds: [
                slotEv?.leaderIds?.[0] || null,
                slotEv?.doctrineLeaderId || slotEv?.leaderIds?.[1] || null
            ],
        });

        return slots;
    };

    if (!mounted) return null;

    return (
        <div
            className="h-full w-full flex flex-col overflow-hidden relative"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 30%, #071428 0%, #040D21 60%, #02080F 100%)' }}
        >
            {/* ── Background texture: dot grid ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #4F7FFF 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Diagonal lines texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #4F7FFF 0, #4F7FFF 1px, transparent 0, transparent 50%)',
                    backgroundSize: '24px 24px',
                }}
            />
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-[#4F7FFF]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#A3FF57]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* ── 7 COLUMNS ── */}
            <div className="z-10 flex-1 flex gap-5 px-5 pb-2 pt-10 min-h-0 w-full">
                {daysProgram.map(({ dateKey, dayName, dayNum, sched, isToday }, colIdx) => {
                    const slots = getSlots(sched, dayName);
                    const isActive = isToday;

                    const accentText = isActive ? 'text-[#A3FF57] border-[#A3FF57]/50' : 'text-[#4F7FFF] border-[#4F7FFF]/40';

                    return (
                        <motion.div
                            key={dateKey}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * colIdx, type: 'spring', stiffness: 100 }}
                            className="flex-1 flex flex-col items-center relative transition-all duration-500"
                        >
                            {/* Top ambient glow - Attached to the whole day area slightly */}
                            <div className="absolute top-0 left-0 right-0 h-40 opacity-30 mix-blend-screen pointer-events-none"
                                style={{ background: isActive ? 'radial-gradient(circle at 50% -20%, #A3FF57 0%, transparent 70%)' : 'radial-gradient(circle at 50% -20%, #4F7FFF 0%, transparent 70%)' }}
                            />

                            {/* Badge (Day Name) */}
                            <div className="flex justify-center mt-6 z-10 shrink-0">
                                <span className={`text-[9px] font-black tracking-[0.3em] uppercase border-2 px-4 py-1.5 rounded-full ${accentText} bg-[#0A1628]/90 backdrop-blur-md`}>
                                    {dayName}
                                </span>
                            </div>

                            {/* Huge Day Number */}
                            <div className="flex items-end justify-center gap-1 mt-2 px-2 z-10 shrink-0 mb-4">
                                <span className={`text-[3.5rem] font-black leading-none tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] ${isActive ? 'text-[#A3FF57]' : 'text-white'}`}>
                                    {dayNum}
                                </span>
                            </div>

                            {isActive ? (
                                <p className="text-center text-[10px] tracking-[0.4em] text-[#A3FF57] uppercase font-black mt-2 shrink-0">HOY</p>
                            ) : (
                                <p className="text-center text-[10px] tracking-[0.4em] text-transparent uppercase font-black mt-2 shrink-0 select-none">HOY</p>
                            )}

                            {/* Service slots perfectly matching mockup */}
                            <div className="flex flex-col gap-28 px-1 pb-6 flex-1 min-h-0 z-10 w-full mt-2">
                                {slots.map((slot, sIdx) => {
                                    const leaders = (slot.leaderIds || [])
                                        .map(id => getMemberDetail(id))
                                        .filter(l => l.name);

                                    const isAssigned = leaders.length > 0;

                                    // Colors configuration
                                    let bgClass, borderClass, topBorder, avatarRing, titleColor, subColor, customShadow;
                                    if (slot.accent === 'blue') {
                                        bgClass = 'bg-[#0D1B3E]'; borderClass = 'border-[#1E3A6E]'; topBorder = '#4F7FFF'; avatarRing = 'border-[#4F7FFF]'; titleColor = 'text-[#4F7FFF]'; subColor = 'text-[#4F7FFF]/70';
                                        customShadow = 'shadow-[0_30px_90px_rgba(0,0,0,0.7)]';
                                    } else if (slot.accent === 'orange') {
                                        bgClass = 'bg-[#1A0C00]'; borderClass = 'border-[#3A1D04]'; topBorder = '#F97316'; avatarRing = 'border-[#F97316]'; titleColor = 'text-[#F97316]'; subColor = 'text-[#F97316]/70';
                                        customShadow = 'shadow-[0_30px_90px_rgba(255,176,96,0.25)]';
                                    } else if (slot.accent === 'purple') {
                                        bgClass = 'bg-[#140b18]'; borderClass = 'border-[#9333EA]/40'; topBorder = '#9333EA'; avatarRing = 'border-[#9333EA]'; titleColor = 'text-[#d8b4fe]'; subColor = 'text-[#a855f7]';
                                        customShadow = 'shadow-[0_30px_90px_rgba(147,51,234,0.15)]';
                                    } else if (slot.accent === 'red') {
                                        bgClass = 'bg-[#1a0a0a]'; borderClass = 'border-[#EF4444]/40'; topBorder = '#EF4444'; avatarRing = 'border-[#EF4444]'; titleColor = 'text-white'; subColor = 'text-[#EF4444]';
                                        customShadow = 'shadow-[0_30px_90px_rgba(239,68,68,0.15)]';
                                    } else if (slot.accent === 'emerald') {
                                        bgClass = 'bg-[#061410]'; borderClass = 'border-[#10B981]/40'; topBorder = '#10B981'; avatarRing = 'border-[#10B981]'; titleColor = 'text-[#6ee7b7]'; subColor = 'text-[#34d399]';
                                        customShadow = 'shadow-[0_30px_90px_rgba(16,185,129,0.15)]';
                                    } else {
                                        bgClass = 'bg-[#030B06]'; borderClass = 'border-[#0A2615]'; topBorder = '#10B981'; avatarRing = 'border-[#10B981]'; titleColor = 'text-[#10B981]'; subColor = 'text-[#10B981]/70';
                                        customShadow = 'shadow-[0_15px_30px_rgba(0,0,0,0.4)]';
                                    }

                                    const showLiveRed = isSlotActive(dateKey, slot.id);

                                    return (
                                        <div key={`${dateKey}-${sIdx}`} className={`relative flex flex-col justify-end w-full min-h-[250px] rounded-[1.5rem] border-2 transition-all duration-300 ${bgClass} ${borderClass} ${customShadow}
                                                ${!isAssigned && 'opacity-60'}
                                            `}>
                                            {/* Horizontal Separator Line crossing the whole screen (Drawn once per row) */}
                                            {colIdx === 0 && sIdx > 0 && (
                                                <div className="absolute -top-[3.5rem] -left-16 w-[110vw] h-[1px] bg-gradient-to-r from-transparent via-[#4F7FFF]/20 to-transparent z-0 pointer-events-none flex items-center opacity-70">
                                                    <div className="absolute left-16 bg-[#040D21] px-4 py-1 rounded-full border border-[#4F7FFF]/20 shadow-[0_0_15px_rgba(79,127,255,0.15)] flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-pulse" />
                                                        <span className="text-[10px] tracking-[0.4em] font-bold text-[#4F7FFF] uppercase mt-px">
                                                            {slot.hour} {slot.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Top thick accent line removed as requested */}

                                            {/* English Side-Tab Badge */}
                                            {slot.language === 'en' && (
                                                <div className="absolute left-0 top-16 h-10 w-1 z-[70]">
                                                    <div className="absolute -left-[2px] top-0 h-full w-6 bg-[#FF6B00] rounded-r-lg shadow-[5px_0_15px_rgba(255,107,0,0.4)] backdrop-blur-md flex items-center justify-center overflow-hidden border-y border-r border-[#FF6B00]/20">
                                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter shadow-sm leading-none z-10">EN</span>
                                                    </div>
                                                    {/* Glow pulse */}
                                                    <div className="absolute -left-1 top-0 h-full w-1.5 bg-orange-600 blur-sm animate-pulse" />
                                                </div>
                                            )}

                                            {/* LIVE Bottom Red Glow (Matching Daily LiveBadge styling) */}
                                            {showLiveRed && (
                                                <motion.div
                                                    animate={{
                                                        boxShadow: [
                                                            "0 -5px 15px rgba(220,38,38,0.4)",
                                                            "0 -5px 25px rgba(220,38,38,0.7)",
                                                            "0 -5px 15px rgba(220,38,38,0.4)"
                                                        ]
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                    className="absolute -bottom-[2px] -left-[2px] -right-[2px] h-8 rounded-b-[1.5rem] overflow-hidden z-[60] pointer-events-none bg-gradient-to-r from-red-600/95 via-red-500 to-red-600/95 border-t border-white/30 backdrop-blur-md flex items-center justify-center"
                                                >
                                                    <motion.div
                                                        initial={{ y: 15, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
                                                        <span className="text-[8px] font-black text-white tracking-[0.4em] uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">EN CURSO</span>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Popping Avatar(s) */}
                                            <div className="absolute -top-9 inset-x-0 flex justify-center h-16">
                                                {isAssigned ? (
                                                    <div className="flex relative items-center justify-center">
                                                        {leaders.map((leader, lIdx) => (
                                                            <div key={lIdx} className={`relative w-[4.5rem] h-[4.5rem] rounded-[1.2rem] overflow-hidden border-[1.5px] shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-20 flex-shrink-0 bg-[#071020] ${avatarRing} ${lIdx > 0 ? '-ml-5' : ''}`}>
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-[currentColor]/30 via-transparent to-transparent opacity-60 z-20 pointer-events-none" style={{ color: topBorder }} />
                                                                <div className="absolute inset-0 rounded-[1.2rem] border-2 border-[currentColor]/40 animate-pulse opacity-50 z-20 pointer-events-none" style={{ borderColor: topBorder }} />
                                                                {leader.avatar ? (
                                                                    <img src={leader.avatar} className="w-full h-full object-cover relative z-10" alt="" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center relative z-10">
                                                                        <User className="w-6 h-6 opacity-50 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={`relative w-[4.5rem] h-[4.5rem] rounded-[1.2rem] overflow-hidden border-[1.5px] shadow-lg z-20 flex bg-[#071020] items-center justify-center ${borderClass}`}>
                                                        <span className="opacity-50 text-white">{slot.icon}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Names row as encapsulated premium pill(s) */}
                                            <div className="absolute top-[2.4rem] inset-x-0 w-full flex items-center justify-center z-30 px-1">
                                                <div className="flex items-center justify-center gap-1.5 w-full relative pt-2">
                                                    {isAssigned ? leaders.map((leader, lIdx) => (
                                                        <div key={lIdx} className="flex flex-col items-center min-w-[70px] max-w-[95%] z-30 pt-1">
                                                            <span
                                                                className="text-[6px] font-black uppercase tracking-[0.3em] mb-1.5 drop-shadow-[0_0_8px_currentColor]"
                                                                style={{ color: topBorder }}
                                                            >
                                                                {slot.roles[lIdx] || 'SERVICIO'}
                                                            </span>
                                                            <span className="text-[11px] leading-none font-black text-white uppercase tracking-[0.05em] drop-shadow-md bg-black/60 px-3 py-1.5 rounded-[0.6rem] border border-white/10 backdrop-blur-xl w-full flex justify-center text-center truncate">
                                                                {leader.name}
                                                            </span>
                                                        </div>
                                                    )) : (
                                                        <div className="flex flex-col items-center pt-1">
                                                            <span className="text-[10px] leading-none font-bold uppercase tracking-widest text-white/30 italic drop-shadow-md bg-black/40 px-4 py-1.5 rounded-[0.6rem] border border-white/5 backdrop-blur-xl">
                                                                VACANTE
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Inner Content matching Mockup precisely */}
                                            <div className="pt-5 pb-5 px-1 flex flex-col items-center justify-center text-center w-full z-10">

                                                {/* Titles perfectly matched to pill vs typography */}
                                                {slot.sundayType ? (
                                                    <div className="flex flex-col items-center justify-center mb-1.5 mt-1 w-full z-10 px-2 text-center">
                                                        <h3 className={`text-[17px] font-black uppercase tracking-[0.05em] leading-[1.1] drop-shadow-md ${slot.sundayType === 'exchange' ? 'text-[#d8b4fe]' :
                                                            slot.sundayType === 'visitors' ? 'text-[#6ee7b7]' : 'text-white/90'
                                                            }`}>
                                                            {slot.title}
                                                        </h3>
                                                        <p className="text-[10px] font-bold mt-1 uppercase tracking-[0.2em] flex items-center justify-center gap-1" style={{ color: topBorder }}>
                                                            {slot.subtitle}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-center mb-1.5 w-full">
                                                            <span
                                                                className="text-[8.5px] px-4 py-1.5 font-black tracking-[0.2em] uppercase border rounded-full bg-[#0A1628]/90 backdrop-blur-md shadow-md"
                                                                style={{
                                                                    color: topBorder,
                                                                    borderColor: topBorder
                                                                }}
                                                            >
                                                                {slot.title}
                                                            </span>
                                                        </div>
                                                        {slot.accent === 'orange' ? (
                                                            <p className="text-[8.5px] font-black tracking-[0.2em] -mb-1 uppercase text-white/50 z-10">{slot.subtitle}</p>
                                                        ) : null}
                                                    </>
                                                )}

                                                {/* HUGE Time */}
                                                <div className="flex items-baseline justify-center gap-1 mt-1.5 mb-1 relative">
                                                    <span className={`text-[3.5rem] font-black leading-none tracking-tighter ${slot.timeAccent}`}>
                                                        {slot.hour.split(':')[0]}:<span className="tracking-tight">{slot.hour.split(':')[1]}</span>
                                                    </span>
                                                    <span className={`text-[12px] font-black uppercase tracking-wider relative -top-6 text-white/40`}>
                                                        {slot.period}
                                                    </span>
                                                </div>

                                                {/* Bottom subtitle if not orange */}
                                                {slot.accent !== 'orange' ? (
                                                    <p className="text-[8.5px] font-black tracking-[0.2em] uppercase -mt-1 text-white/50 z-10">{slot.subtitle}</p>
                                                ) : null}

                                                {/* Empty spacer for RED glow if needed */}
                                                {showLiveRed && <div className="h-4" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── BOTTOM HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center justify-center pb-8 shrink-0 text-center"
            >
                <p className="text-[10px] tracking-[0.5em] text-[#4F7FFF] uppercase font-bold mb-2">Vista Semanal</p>
                <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-4">
                    PROGRAMA <span className="text-[#A3FF57]">SEMANAL</span>
                </h1>
                {/* Date range pill */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 border border-[#4F7FFF]/40 bg-[#0D1B3E]/80 rounded-full px-6 py-2 shadow-[0_0_20px_rgba(79,127,255,0.15)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF57] animate-pulse" />
                        <span className="text-[13px] font-bold tracking-[0.2em] text-white uppercase">
                            {format(today, 'd MMM', { locale: es })} — {format(addDays(today, 6), 'd MMM yyyy', { locale: es })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Footer branding */}
            <div className="absolute bottom-4 right-8 text-[8px] tracking-[0.5em] text-white/10 font-mono uppercase select-none z-10">
                LLDM · TC-OVERDRIVE V3
            </div>

        </div>
    );
}
