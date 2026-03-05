'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { LeaderProfile } from '@/components/LeaderProfile';
import { CalendarDays, User, Clock as ClockIcon, Shield, ChevronRight, Radio, Globe } from 'lucide-react';
import { getServiceTypeLabel } from '@/lib/display_labels';

export const GlassmorphismSchedule = ({ isTomorrow = false }: any) => {
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
    const settings = useAppStore((state) => state.settings);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // Logic for Today or Tomorrow
    const targetDate = isTomorrow ? addDays(currentTime, 1) : currentTime;
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const schedule = monthlySchedule[dateStr];
    const displayDate = schedule ? parseISO(schedule.date) : targetDate;

    // Active Slot Detection
    const isSlotActive = (slotId: '5am' | '9am' | 'evening') => {
        if (isTomorrow) return false;
        const now = new Date();
        const curMin = now.getHours() * 60 + now.getMinutes();
        const isSunday = displayDate.getDay() === 0;

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

        const slot = schedule?.slots?.[slotId];
        const start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        const end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;
        return curMin >= start && curMin <= end;
    };

    return (
        <div className="h-full flex flex-col p-8 pt-10 font-sora relative overflow-hidden bg-transparent">
            {/* Header branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-end justify-between mb-8 border-b border-white/10 pb-4"
            >
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-16 h-1 bg-blue-500 rounded-full shadow-[0_0_20px_blue]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40">
                            {isTomorrow ? 'PRÓXIMO PROGRAMA' : 'CALENDARIO DE MINISTERIO'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold uppercase tracking-tighter text-white leading-none">
                        Programa <span className="font-thin italic text-white/40">{isTomorrow ? 'Para Mañana' : 'Del Día'}</span>
                    </h2>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] py-4 px-10 flex items-center gap-6 shadow-2xl">
                    <div className="flex flex-col items-center border-r border-white/10 pr-8">
                        <span className="text-5xl font-black text-white">{format(displayDate, 'd')}</span>
                        <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{format(displayDate, 'MMM', { locale: es })}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white/80 uppercase italic tracking-tight">{format(displayDate, 'EEEE', { locale: es })}</span>
                        <span className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] mt-1">{format(displayDate, 'yyyy')}</span>
                    </div>
                </div>
            </motion.div>

            {/* Main schedule layout */}
            <div className="flex-1 grid grid-cols-3 gap-6 items-stretch">
                <ScheduleBlock
                    time="5:00 AM"
                    title="CONSAGRACIÓN"
                    leaderId={schedule?.slots?.['5am']?.leaderId}
                    members={members}
                    colorClass="bg-blue-600"
                    icon={<Shield className="w-10 h-10" />}
                    minimal={true}
                    language={schedule?.slots?.['5am']?.language}
                    isActive={isSlotActive('5am')}
                />

                <ScheduleBlock
                    time="9:00 AM"
                    title="CONSAGRACIÓN Y DOCTRINA"
                    leaderId={schedule?.slots?.['9am']?.consecrationLeaderId || schedule?.slots?.['9am']?.doctrineLeaderId}
                    secondaryLeaderId={schedule?.slots?.['9am']?.consecrationLeaderId && schedule?.slots?.['9am']?.doctrineLeaderId && schedule?.slots?.['9am']?.consecrationLeaderId !== schedule?.slots?.['9am']?.doctrineLeaderId ? schedule?.slots?.['9am']?.doctrineLeaderId : undefined}
                    members={members}
                    colorClass="bg-orange-500"
                    icon={<CalendarDays className="w-10 h-10" />}
                    isTiny={true}
                    minimal={true}
                    language={schedule?.slots?.['9am']?.language}
                    isActive={isSlotActive('9am')}
                />

                <ScheduleBlock
                    time="7:00 PM"
                    title={(() => {
                        const slot = schedule?.slots?.['evening'];
                        if (slot?.customLabel) return slot.customLabel.toUpperCase();
                        if (slot?.topic) return slot.topic.toUpperCase();
                        return getServiceTypeLabel(slot?.type || 'regular', settings.language).toUpperCase();
                    })()}
                    leaderId={schedule?.slots?.['evening']?.leaderIds?.[0]}
                    secondaryLeaderId={schedule?.slots?.['evening']?.doctrineLeaderId || schedule?.slots?.['evening']?.leaderIds?.[1]}
                    members={members}
                    colorClass="bg-purple-600"
                    icon={<ClockIcon className="w-10 h-10" />}
                    language={schedule?.slots?.['evening']?.language}
                    isActive={isSlotActive('evening')}
                />
            </div>

        </div>
    );
};

const ScheduleBlock = ({ time, title, leaderId, secondaryLeaderId, members, colorClass, icon, language, isTiny, minimal, isActive }: any) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isActive ? {
                y: 0, opacity: 1,
                scale: [1, 1.015, 1],
                transition: {
                    y: { duration: 0.5 },
                    opacity: { duration: 0.5 },
                    scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }
            } : { y: 0, opacity: 1, scale: 1 }}
            className={cn(
                "group relative flex flex-col bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border transition-all hover:bg-white/5 shadow-2xl overflow-hidden p-12",
                isActive ? "border-emerald-500/60 bg-emerald-500/[0.04] shadow-[0_0_80px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/30" : "border-white/10"
            )}
        >
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-transparent pointer-events-none" />
            )}

            {isActive && (
                <div className="absolute top-8 right-8 z-20 flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-500/20 backdrop-blur-2xl border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_#10b981]"></span>
                    </span>
                    <span className="text-[13px] font-black uppercase tracking-[0.3em] text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">EN CURSO</span>
                </div>
            )}

            <div className={cn("absolute top-0 right-0 w-40 h-40 opacity-[0.05] rounded-bl-[100%] pointer-events-none group-hover:opacity-10 transition-opacity", colorClass)} />

            {/* English Badge */}
            {language === 'en' && (
                <div className="absolute top-8 right-8 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-2xl border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <Globe className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">EN</span>
                </div>
            )}

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex flex-col gap-2">
                    <span className="text-6xl font-black text-white italic tracking-tighter leading-none">{time}</span>
                    <span className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] ml-1">{title}</span>
                </div>
                {isActive ? null : icon}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4 gap-6">
                <LeaderProfile
                    leaderId={leaderId}
                    responsibility={secondaryLeaderId ? "Consagración" : title}
                    colorClass={colorClass}
                    size={isTiny ? "tiny" : (secondaryLeaderId ? "small" : "large")}
                    members={members}
                    minimal={minimal}
                />
                {secondaryLeaderId && (
                    <div className="w-full flex justify-center">
                        <div className="w-16 h-px bg-white/10 my-2" />
                    </div>
                )}
                {secondaryLeaderId && (
                    <LeaderProfile
                        leaderId={secondaryLeaderId}
                        responsibility="Doctrina"
                        colorClass={colorClass}
                        size={isTiny ? "tiny" : "small"}
                        members={members}
                        minimal={minimal}
                    />
                )}
            </div>
        </motion.div>
    );
};
