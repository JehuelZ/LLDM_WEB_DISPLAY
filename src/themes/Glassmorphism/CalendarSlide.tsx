import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Shield, Clock, BookOpen, User, Star, Church, Cross, Heart, Radio } from 'lucide-react';
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
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || null,
        };
    };

    return (
        <div className="h-full flex flex-col p-16 pt-24 font-sora relative overflow-hidden bg-transparent">
            {/* Minimalist Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between mb-12 border-b border-white/5 pb-8"
            >
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                        <CalendarDays className="w-12 h-12 text-blue-500 relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black uppercase text-white leading-none tracking-tighter italic shadow-2xl">
                            {format(currentTime, 'MMMM', { locale: es }).toUpperCase()} <span className="font-thin text-white/30">{format(currentTime, 'yyyy')}</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-10 bg-white/5 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
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

            {/* Pillar Grid Layout - Matching Weekly Style */}
            <div className="flex-1 grid grid-cols-7 gap-3 overflow-hidden h-full rounded-[4rem] border border-white/5 bg-black/20 p-2 shadow-inner">
                {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((dowName, dowIndex) => {
                    const daysInColumn = days.filter(d => getDay(d) === dowIndex);
                    const isSunday = dowIndex === 0;

                    return (
                        <div
                            key={dowName}
                            className={cn(
                                "flex flex-col overflow-hidden h-full rounded-[3.5rem] transition-all hover:bg-white/[0.04] border border-white/[0.02]",
                                isSunday ? "bg-red-500/5" : "bg-white/[0.02]"
                            )}
                        >
                            {/* Column Header */}
                            <div className="text-center pt-8 pb-8 relative">
                                <span className={cn(
                                    "text-2xl font-black uppercase tracking-tighter italic z-10 relative",
                                    isSunday ? "text-red-500" : "text-white/60"
                                )}>
                                    {dowName}
                                </span>
                                <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full opacity-20", isSunday ? "bg-red-500" : "bg-blue-500")} />
                            </div>

                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-4 pb-12 custom-scrollbar scroll-smooth">
                                {daysInColumn.map((day, idx) => {
                                    const dateKey = format(day, 'yyyy-MM-dd');
                                    const sched = monthlySchedule[dateKey];
                                    const todayKey = format(currentTime, 'yyyy-MM-dd');
                                    const isToday = dateKey === todayKey;
                                    const dayIsSunday = getDay(day) === 0;

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
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (dowIndex * 0.05) + (idx * 0.05) }}
                                            className={cn(
                                                "w-full bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-4 shadow-xl group/slot transition-all hover:bg-white/10 relative",
                                                isToday && "bg-blue-500/10 border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.1)]",
                                                anyActive && "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                                            )}
                                        >
                                            <div className="flex flex-col items-center justify-center min-w-[32px]">
                                                <span className={cn(
                                                    "text-xl font-black italic leading-none",
                                                    isToday ? "text-blue-400" : (isSunday ? "text-red-500/90" : "text-white/60")
                                                )}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>

                                            <div className="h-8 w-[1px] bg-white/10" />

                                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                                                {/* 5 AM */}
                                                <div className={cn("flex items-center gap-1.5 truncate transition-colors", active5am && "text-emerald-400")}>
                                                    {active5am && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                                    <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", active5am ? "text-emerald-400" : "text-blue-400/60")}>5 AM</span>
                                                    <span className={cn("text-[10px] font-black truncate uppercase tracking-tight", active5am ? "text-emerald-400" : "text-white/90")}>
                                                        {detail5am.name || '---'}
                                                    </span>
                                                </div>

                                                {/* 9 AM */}
                                                <div className={cn("flex items-center gap-1.5 truncate transition-colors", active9am && "text-emerald-400")}>
                                                    {active9am && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                                    <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", active9am ? "text-emerald-400" : "text-orange-400/60")}>9 AM</span>
                                                    <div className={cn("text-[10px] font-black truncate uppercase tracking-tight flex items-center gap-1.5", active9am ? "text-emerald-400" : "text-white/90")}>
                                                        {(() => {
                                                            const l1 = detail9am.name;
                                                            const l2 = getMemberDetail(sched?.slots?.['9am']?.doctrineLeaderId).name;
                                                            if (l1 && l2 && l1 !== l2) return (
                                                                <>
                                                                    <span>{l1}</span>
                                                                    <div className={cn("w-[2px] h-3 rounded-full", active9am ? "bg-emerald-500/40" : "bg-orange-500/30")} />
                                                                    <span>{l2}</span>
                                                                </>
                                                            );
                                                            return <span>{l1 || l2 || '---'}</span>;
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* 7 PM */}
                                                <div className={cn("flex items-center gap-1.5 truncate transition-colors", activeEv && "text-emerald-400")}>
                                                    {activeEv && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                                                    <span className={cn("text-[7px] font-black uppercase w-7 flex-shrink-0", activeEv ? "text-emerald-400" : "text-purple-400/60")}>19 PM</span>
                                                    {sched?.slots?.evening?.language === 'en' && (
                                                        <span className="text-[6px] font-black text-blue-400 bg-blue-400/10 px-1 py-[0.5px] rounded-[2px] border border-blue-400/20 leading-none">EN</span>
                                                    )}
                                                    <div className={cn("text-[10px] font-black truncate uppercase tracking-tight flex items-center gap-1.5", activeEv ? "text-emerald-400" : "text-white/90")}>
                                                        {(() => {
                                                            const ids = sched?.slots?.['evening']?.leaderIds || [];
                                                            if (ids.length > 1) {
                                                                const n1 = getMemberDetail(ids[0]).name;
                                                                const n2 = getMemberDetail(ids[1]).name;
                                                                return (
                                                                    <>
                                                                        <span>{n1}</span>
                                                                        <div className={cn("w-[2px] h-3 rounded-full", activeEv ? "bg-emerald-500/40" : "bg-purple-500/30")} />
                                                                        <span>{n2}</span>
                                                                    </>
                                                                );
                                                            }
                                                            return <span>{detailEv.name || '---'}</span>;
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
