'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, BookOpen, User, Church, Music, Sparkles, Star, Cross, Radio } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const GlassmorphismWeekly = () => {
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
    const theme = useAppStore((state) => state.theme);
    const settings = useAppStore((state) => state.settings);

    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // Active Slot Detection
    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | 'evening') => {
        const todayKey = format(currentTime, 'yyyy-MM-dd');
        if (dateKey !== todayKey) return false;

        const curMin = currentTime.getHours() * 60 + currentTime.getMinutes();
        const isSunday = currentTime.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
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
        const start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        const end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;
        return curMin >= start && curMin <= end;
    };

    const daysProgram = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(new Date(), i);
            const dateKey = format(date, 'yyyy-MM-dd');
            return {
                dateKey,
                dayName: format(date, 'eee', { locale: es }).toUpperCase(),
                dayNum: format(date, 'd'),
                sched: monthlySchedule[dateKey]
            };
        });
    }, [monthlySchedule]);

    // Member name helper
    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || null,
        };
    };

    const getImpactLevel = (type: string) => {
        if (type === 'special') return 5;
        if (type === 'praise') return 4;
        if (type === 'youth') return 3;
        return 2;
    };

    if (!mounted) return null;

    return (
        <div className="h-full flex flex-col p-8 pt-10 bg-transparent relative overflow-hidden font-sora">


            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/10 group-hover:opacity-100 opacity-0 transition-opacity" />
                        <CalendarDays className="w-8 h-8 text-blue-500 relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase text-white leading-none tracking-tighter italic shadow-2xl">PROGRAMA <span className="font-thin text-white/30">SEMANAL</span></h2>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-8 bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-3xl overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                    <h3 className="text-2xl font-black text-white uppercase italic truncate">{theme.title || 'ORACIÓN CONTINUA'}</h3>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.4em] mt-1 font-black">{theme.type || 'ESTUDIO BÍBLICO'}</p>
                </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-7 gap-2 overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 p-2 shadow-inner">
                {daysProgram.map((day, idx) => {
                    const type = day.sched?.slots?.['evening']?.type || 'regular';
                    const impact = getImpactLevel(type);
                    const isSunday = day.dayName === 'DOM' || day.dayName === 'DOMINGO';

                    return (
                        <div key={day.dateKey} className={cn("relative flex flex-col items-center pt-4 pb-8 px-3 rounded-[2rem] overflow-hidden transition-all hover:bg-white/[0.04]", isSunday ? "bg-red-500/5" : "bg-white/[0.02]")}>
                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[100px] font-black text-white/5 select-none">{day.dayNum}</span>
                            <span className={cn("text-xl font-black mb-4 z-10 italic uppercase tracking-tighter", isSunday ? "text-red-500/60" : "text-white/60")}>{day.dayName}</span>

                            <div className="flex-1 flex flex-col items-center justify-start z-10 w-full gap-3">
                                {(['5am', '9am', 'evening'] as const).map((slotKey) => {
                                    const slot = (day.sched?.slots as any)?.[slotKey];
                                    if (!slot) return null;

                                    const isActive = isSlotActive(day.dateKey, slotKey);

                                    // Abbreviate name helper
                                    const formatShortName = (name: string) => {
                                        if (!name) return '';
                                        const parts = name.split(' ');
                                        return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name;
                                    };

                                    let shortName = '';
                                    if (slotKey === '5am') {
                                        shortName = formatShortName(getMemberDetail(slot.leaderId).name);
                                    } else if (slotKey === '9am') {
                                        const l1 = getMemberDetail(slot.consecrationLeaderId).name;
                                        const l2 = getMemberDetail(slot.doctrineLeaderId).name;
                                        if (l1 && l2 && l1.toLowerCase() !== l2.toLowerCase()) {
                                            shortName = `${formatShortName(l1)} | ${formatShortName(l2)}`;
                                        } else {
                                            shortName = formatShortName(l1 || l2);
                                        }
                                    } else if (slotKey === 'evening') {
                                        const ids = slot.leaderIds || [];
                                        if (ids.length > 1) {
                                            shortName = `${formatShortName(getMemberDetail(ids[0]).name)} | ${formatShortName(getMemberDetail(ids[1]).name)}`;
                                        } else {
                                            shortName = formatShortName(getMemberDetail(ids[0]).name);
                                        }
                                    }

                                    if (!shortName) return null;

                                    const isVertical = true; // Uniform vertical style for all slots
                                    const l1 = getMemberDetail(slotKey === '5am' ? slot.leaderId : (slotKey === '9am' ? slot.consecrationLeaderId : slot.leaderIds?.[0]));
                                    const l2Id = slotKey === '9am' ? (slot.consecrationLeaderId !== slot.doctrineLeaderId ? slot.doctrineLeaderId : null) : slot.leaderIds?.[1];
                                    const l2 = getMemberDetail(l2Id);

                                    return (
                                        <motion.div
                                            key={slotKey}
                                            animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                            transition={isActive ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
                                            className={cn(
                                                "w-full bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center text-center shadow-xl group/slot relative overflow-hidden transition-all duration-300",
                                                isActive && "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute top-1 right-1 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40">
                                                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                                                    <span className="text-[7px] font-black text-emerald-400 tracking-[0.1em]">LIVE</span>
                                                </div>
                                            )}
                                            {slotKey === 'evening' && slot.language === 'en' && (
                                                <div className="absolute top-1 left-1 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/40">
                                                    <span className="text-[7px] font-black text-blue-400 tracking-[0.1em]">EN</span>
                                                </div>
                                            )}

                                            {/* Avatars Section */}
                                            <div className="flex items-center justify-center -space-x-3 mb-2 flex-shrink-0">
                                                {/* Leader 1 Avatar */}
                                                <div className={cn(
                                                    "rounded-full bg-black/40 border-2 border-white/20 overflow-hidden relative shadow-lg transition-transform group-hover/slot:scale-110",
                                                    l2.name ? "w-16 h-16 z-20" : "w-20 h-20",
                                                    isActive && "border-emerald-400"
                                                )}>
                                                    {l1.avatar ? (
                                                        <img src={l1.avatar} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <User className="w-full h-full p-2 text-white/20" />
                                                    )}
                                                    <div className={cn("absolute inset-0 opacity-20", isActive ? 'bg-emerald-500' : (slotKey === '5am' ? 'bg-blue-500' : slotKey === '9am' ? 'bg-orange-500' : 'bg-purple-500'))} />
                                                </div>

                                                {/* Leader 2 Avatar */}
                                                {l2.name && (
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-full bg-black/40 border-2 border-white/20 overflow-hidden relative shadow-lg z-10 transition-transform group-hover/slot:scale-110",
                                                        isActive && "border-emerald-400"
                                                    )}>
                                                        {l2.avatar ? (
                                                            <img src={l2.avatar} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <User className="w-full h-full p-2 text-white/20" />
                                                        )}
                                                        <div className={cn("absolute inset-0 opacity-20", isActive ? 'bg-emerald-500' : (slotKey === '9am' ? 'bg-orange-500' : 'bg-purple-500'))} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center min-w-0">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-[0.1em] leading-none mb-1 opacity-80",
                                                    isActive ? 'text-emerald-400' : (slotKey === '5am' ? 'text-blue-400' : slotKey === '9am' ? 'text-orange-400' : 'text-purple-400')
                                                )}>
                                                    {slotKey === '5am' ? 'CONSAGRACIÓN' :
                                                        slotKey === '9am' ? (isSunday ? 'DOMINICAL' : 'CONS. | DOCTRINA') :
                                                            (() => {
                                                                const sOut = (day.sched?.slots as any)?.evening;
                                                                if (sOut?.customLabel) return sOut.customLabel.toUpperCase();
                                                                switch (sOut?.type) {
                                                                    case 'youth': return 'JÓVENES';
                                                                    case 'praise': return 'ALABANZA';
                                                                    case 'married': return 'MATRIMONIOS';
                                                                    case 'children': return 'NIÑOS';
                                                                    case 'special': return 'ESPECIAL';
                                                                    case 'regular': return 'ORACIÓN';
                                                                    case 'doctrine': return 'CULTO';
                                                                    default: return 'CULTO';
                                                                }
                                                            })()}
                                                </span>
                                                <span className="font-black text-white leading-tight uppercase truncate w-full text-[14px]">
                                                    {shortName}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="absolute bottom-6 left-10 right-10 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(impact / 5) * 100}%` }} className={cn("h-full", isSunday ? "bg-red-500" : "bg-blue-500")} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

