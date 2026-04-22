import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, BookOpen, User, Star, Church, Cross, Heart, Radio } from 'lucide-react';
import { LeaderProfile } from '@/components/LeaderProfile';

export const GlassmorphismCalendar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const currentMonth = startOfMonth(currentTime);
    const endOfCurrentMonth = endOfMonth(currentTime);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
    const settings = useAppStore((state) => state.settings);

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

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'HERMANO ASIGNADO' : (id || 'NO ASIGNADO')),
            avatar: member?.avatar || null,
        };
    };

    return (
        <div className="h-full flex flex-col p-8 pt-10 relative overflow-hidden bg-transparent">
            {/* Minimalist Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between mb-6 border-b border-white/5 pb-4"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                        <CalendarDays className="w-8 h-8 text-blue-500 relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase text-white leading-none tracking-tighter italic shadow-2xl">
                            {format(currentTime, 'MMMM', { locale: es }).toUpperCase()} <span className="font-thin text-white/30">{format(currentTime, 'yyyy')}</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-8 bg-white/5 backdrop-blur-3xl px-8 py-3 rounded-[2rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">05 AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">09 AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">TARDES</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-400 tracking-[0.2em] uppercase">EN CURSO</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* True Grid Layout */}
            <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 p-2 shadow-inner relative flex flex-col">
                {/* Column Backgrounds (Visual Only) */}
                <div className="absolute inset-2 grid grid-cols-7 gap-2 pointer-events-none">
                    {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((_, dowIndex) => (
                        <div 
                            key={dowIndex} 
                            className={cn(
                                "rounded-[3.5rem] h-full transition-all border border-white/[0.02]", 
                                dowIndex === 0 ? "bg-red-500/5" : "bg-white/[0.02]"
                            )} 
                        />
                    ))}
                </div>

                {/* Headers */}
                <div className="grid grid-cols-7 gap-2 relative z-10 pt-4 pb-2">
                    {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((dowName, dowIndex) => (
                        <div key={dowName} className="text-center relative">
                            <span className={cn(
                                "text-2xl font-black uppercase tracking-tighter italic z-10 relative",
                                dowIndex === 0 ? "text-red-500" : "text-white/60"
                            )}>
                                {dowName}
                            </span>
                            <div className={cn("mx-auto mt-1 w-8 h-1 rounded-full opacity-20", dowIndex === 0 ? "bg-red-500" : "bg-blue-500")} />
                        </div>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative z-10 mt-2 pb-12 px-2">
                    <div className="grid grid-cols-7 gap-2 auto-rows-max">
                        {/* Blanks */}
                        {blanks.map(b => (
                            <div key={`blank-${b}`} className="w-full min-h-[100px]" />
                        ))}

                        {/* Days */}
                        {days.map((day, idx) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const sched = monthlySchedule[dateKey];
                            const todayKey = format(currentTime, 'yyyy-MM-dd');
                            const isToday = dateKey === todayKey;
                            const dayIsSunday = getDay(day) === 0;
                            const is14th = day.getDate() === 14;

                            const detail5am = getMemberDetail(sched?.slots?.['5am']?.leaderId);
                            const detail9am = getMemberDetail(sched?.slots?.['9am']?.consecrationLeaderId || sched?.slots?.['9am']?.doctrineLeaderId);
                            const detailEv = getMemberDetail(sched?.slots?.['evening']?.leaderIds?.[0]);

                            const active5am = isSlotActive(dateKey, '5am');
                            const active9am = isSlotActive(dateKey, '9am');
                            const activeEv = isSlotActive(dateKey, 'evening');
                            const anyActive = active5am || active9am || activeEv;

                            return (
                                <motion.div
                                    key={dateKey}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className={cn(
                                        "w-full bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10 flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-4 shadow-xl transition-all hover:bg-white/10 relative h-full",
                                        isToday && "bg-blue-500/10 border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.1)]",
                                        is14th && !isToday && "bg-orange-500/5 border-orange-500/30",
                                        anyActive && "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                                    )}
                                >
                                    {is14th && !isToday && (
                                        <div className="absolute -top-1 -right-1">
                                            <Star size={16} className="text-orange-500/40 fill-orange-500/20" />
                                        </div>
                                    )}
                                    <div className="flex flex-row xl:flex-col items-center justify-between xl:justify-center xl:min-w-[32px] gap-2">
                                        <span className={cn(
                                            "text-xl font-black italic leading-none",
                                            isToday ? "text-blue-400" : (dayIsSunday ? "text-red-500/90" : "text-white/60")
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                        <div className="hidden xl:block h-8 w-[1px] bg-white/10" />
                                    </div>

                                    <div className="flex-1 flex flex-col gap-1 min-w-0 justify-center">
                                        {/* 5 AM */}
                                        <div className={cn("flex items-center gap-1.5 truncate transition-colors", active5am && "text-emerald-400")}>
                                            {active5am && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                            <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", active5am ? "text-emerald-400" : "text-blue-400/60")}>5 AM</span>
                                            <span className={cn("text-[10px] font-black truncate uppercase tracking-tight", active5am ? "text-emerald-400" : "text-white/90")}>
                                                {detail5am.name || '---'}
                                            </span>
                                        </div>

                                        {/* 9 AM / 10 AM (Domingo) */}
                                        <div className={cn("flex items-start gap-1.5 transition-colors", active9am && "text-emerald-400")}>
                                            <div className="flex items-center gap-1.5 mt-[1px]">
                                                {active9am && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                                <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", active9am ? "text-emerald-400" : "text-orange-400/60")}>
                                                    {dayIsSunday ? "10 AM" : "9 AM"}
                                                </span>
                                            </div>
                                            <div className={cn("text-[10px] font-black uppercase tracking-tight flex flex-col min-w-0 flex-1 leading-tight", active9am ? "text-emerald-400" : "text-white/90")}>
                                                {dayIsSunday ? (() => {
                                                    const name = getMemberDetail(sched?.slots?.['9am']?.consecrationLeaderId).name;
                                                    const type = sched?.slots?.['9am']?.sundayType;
                                                    const label = type === 'exchange' ? 'INTERCAMBIO' : type === 'visitors' ? 'VISITAS' : 'DOMINICAL';
                                                    return (
                                                        <>
                                                            <span className="truncate w-full">{name || '---'}</span>
                                                            <span className={cn("truncate w-full text-[8.5px]", active9am ? "text-emerald-500/80" : "text-white/50")}>{label}</span>
                                                        </>
                                                    );
                                                })() : (() => {
                                                    const l1 = getMemberDetail(sched?.slots?.['9am']?.consecrationLeaderId).name;
                                                    const l2 = getMemberDetail(sched?.slots?.['9am']?.doctrineLeaderId).name;
                                                    if (l1 && l2 && l1 !== l2) return (
                                                        <>
                                                            <span className="truncate w-full">{l1}</span>
                                                            <span className={cn("truncate w-full text-[8.5px]", active9am ? "text-emerald-500/80" : "text-white/50")}>{l2}</span>
                                                        </>
                                                    );
                                                    return <span className="truncate w-full">{l1 || l2 || '---'}</span>;
                                                })()}
                                            </div>
                                        </div>

                                        {/* 7 PM */}
                                        <div className={cn("flex items-start gap-1.5 transition-colors", activeEv && "text-emerald-400")}>
                                            <div className="flex items-center gap-1.5 mt-[1px]">
                                                {activeEv && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                                <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", activeEv ? "text-emerald-400" : "text-purple-400/60")}>19 PM</span>
                                            </div>
                                            {sched?.slots?.evening?.language === 'en' && (
                                                <span className="text-[6px] font-black text-blue-400 bg-blue-400/10 px-1 py-[0.5px] rounded-[2px] border border-blue-400/20 leading-none mt-[1px]">EN</span>
                                            )}
                                            <div className={cn("text-[10px] font-black uppercase tracking-tight flex flex-col min-w-0 flex-1 leading-tight", activeEv ? "text-emerald-400" : "text-white/90")}>
                                                {(() => {
                                                    const ids = sched?.slots?.['evening']?.leaderIds || [];
                                                    if (ids.length > 1) {
                                                        const n1 = getMemberDetail(ids[0]).name;
                                                        const n2 = getMemberDetail(ids[1]).name;
                                                        return (
                                                            <>
                                                                <span className="truncate w-full">{n1}</span>
                                                                <span className={cn("truncate w-full text-[8.5px]", activeEv ? "text-emerald-500/80" : "text-white/50")}>{n2}</span>
                                                            </>
                                                        );
                                                    }
                                                    return <span className="truncate w-full">{detailEv.name || '---'}</span>;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
