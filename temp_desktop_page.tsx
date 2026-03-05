'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bell, User, CalendarDays, Phone, Mail, Church, Shield, Cross, Star, Heart, Music, Sparkles, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO, addDays, addMonths } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { CountdownCard } from '@/components/CountdownCard';
import { CeremonialCountdown } from '@/components/CeremonialCountdown';

const FullscreenButton = () => {
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            className="fixed bottom-10 right-10 z-[500] p-4 rounded-full bg-black/40 border border-white/20 text-white shadow-2xl hover:text-primary hover:border-primary hover:bg-black/60 hover:scale-110 transition-all duration-300 backdrop-blur-xl group cursor-pointer"
            title="Pantalla Completa"
        >
            <Maximize className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
    );
};

/**
 * Premium Profile Component for Broadcast-Style Displays
 * Used primarily in the Daily Schedule view
 */
const LeaderProfile = ({
    leaderId,
    responsibility,
    colorClass,
    size = "large",
    members,
    layout = "vertical"
}: {
    leaderId: string | null,
    responsibility: string,
    colorClass: string,
    size?: "large" | "small",
    members: any[],
    layout?: "vertical" | "horizontal"
}) => {
    const isMin = size === "small";

    // Member data lookup
    const member = useMemo(() => {
        if (!leaderId) return null;
        const cleanId = leaderId.trim().toLowerCase();
        return members.find(m => m.id.toLowerCase() === cleanId);
    }, [leaderId, members]);

    const name = member ? member.name : (leaderId && leaderId.length > 20 ? 'HERMANO ASIGNADO' : (leaderId || '---'));
    const avatar = member?.avatar;

    if (layout === "horizontal") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-10 w-full group/leader px-8 py-4 relative"
            >
                <div className="relative shrink-0">
                    <div className={cn(
                        "absolute -inset-4 rounded-full blur-[40px] opacity-20 animate-pulse transition-colors duration-1000",
                        colorClass
                    )} />
                    <div className={cn(
                        "rounded-[2.5rem] bg-slate-900 flex items-center justify-center border-4 overflow-hidden relative shadow-2xl transition-all duration-700 group-hover/leader:scale-110",
                        isMin ? "w-24 h-24" : "w-32 h-32",
                        colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/50')
                    )}>
                        {avatar ? (
                            <img src={avatar} className="w-full h-full object-cover scale-110" alt={name} />
                        ) : (
                            <User className={cn("opacity-20 text-white", isMin ? "w-10 h-10" : "w-14 h-14")} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "font-black text-white italic tracking-tighter leading-none transition-all duration-700 group-hover/leader:tracking-normal truncate",
                        isMin ? "text-4xl" : "text-6xl"
                    )}>
                        {name}
                    </h3>
                </div>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                        "px-8 py-2 rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] border backdrop-blur-3xl shadow-2xl shrink-0 italic",
                        colorClass.replace('bg-', 'text-').replace('/10', '').replace('/20', ''),
                        colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/60'),
                        colorClass.replace('bg-', 'bg-').replace('/10', '/30').replace('/20', '/40')
                    )}
                >
                    {responsibility}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 group/leader w-full max-w-md"
        >
            <div className="relative">
                {/* Dynamic Glow Background */}
                <div className={cn(
                    "absolute -inset-8 rounded-full blur-[100px] opacity-30 animate-pulse transition-colors duration-1000",
                    colorClass
                )} />

                {/* Main Photo Container - Squircle Upgrade */}
                <div className={cn(
                    "rounded-[4rem] bg-slate-900 flex items-center justify-center border-[6px] overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)] transition-all duration-1000 group-hover/leader:scale-105 group-hover/leader:rotate-3",
                    isMin ? "w-56 h-56" : "w-80 h-80",
                    colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/50')
                )}>
                    {avatar ? (
                        <img
                            src={avatar}
                            className="w-full h-full object-cover scale-110 group-hover/leader:scale-125 transition-transform duration-[2000ms] ease-out"
                            alt={name}
                        />
                    ) : (
                        <User className={cn("opacity-20 text-white", isMin ? "w-24 h-24" : "w-36 h-36")} />
                    )}

                    {/* Glass Glare Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/leader:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Decorative Squircle Frame */}
                <div className={cn(
                    "absolute -inset-4 rounded-[4.5rem] border-2 border-dashed opacity-20 group-hover/leader:rotate-12 transition-transform duration-[3000ms]",
                    colorClass.replace('bg-', 'border-').replace('/10', '').replace('/20', '')
                )} />
            </div>

            <div className="text-center space-y-4 px-6 relative z-10">
                {/* Responsibility Badge */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                        "inline-block px-8 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.4em] border backdrop-blur-2xl shadow-2xl",
                        colorClass.replace('bg-', 'text-').replace('/10', '').replace('/20', ''),
                        colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/60'),
                        colorClass.replace('bg-', 'bg-').replace('/10', '/30').replace('/20', '/40')
                    )}
                >
                    {responsibility}
                </motion.div>

                {/* Name with Broadcast Styling */}
                <h3 className={cn(
                    "font-black text-foreground text-glow uppercase italic tracking-tighter leading-none transition-all duration-700 group-hover/leader:tracking-normal",
                    isMin ? "text-4xl" : "text-7xl"
                )}>
                    {name}
                </h3>
            </div>
        </motion.div>
    );
};

// Components for each slide type
const ScheduleSlide = () => {
    const scheduleMap = useAppStore((state) => state.monthlySchedule);
    const currentDate = useAppStore((state) => state.currentDate);
    const members = useAppStore((state) => state.members);
    const calendarStyles = useAppStore((state) => state.calendarStyles);
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const schedule = scheduleMap[todayStr];

    const displayDate = schedule ? parseISO(schedule.date) : new Date();
    const dayName = format(displayDate, 'eee', { locale: es }).toUpperCase();
    const dayNumber = format(displayDate, 'd');

    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || null
        };
    };

    const isCurrentActive = (slot: '5am' | '9am' | 'evening') => {
        if (!schedule || schedule.date !== todayStr) return false;
        const currentHour = currentTime.getHours();

        if (slot === '5am') return currentHour >= 5 && currentHour < 7;
        if (slot === '9am') return currentHour >= 9 && currentHour < 13;
        if (slot === 'evening') return currentHour >= 18 && currentHour < 21;

        return false;
    };

    // We don't return early if !schedule anymore, we render the structure with "Pendiente"


    return (
        <div className="h-full flex flex-col justify-start items-center p-8 pt-10 overflow-hidden bg-transparent">
            {/* Header: Premium Broadcast Style Header */}
            <div className="w-full max-w-[95vw] mb-12 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1 pl-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-primary/50 uppercase italic">Daily Prayer Schedule</span>
                    </div>
                    <h2 className="text-7xl font-black uppercase tracking-tighter flex items-baseline gap-4 leading-none italic">
                        <span className="text-white drop-shadow-2xl">Programa</span>
                        <span className="text-primary text-glow drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                            DEL DÍA
                        </span>
                        <span className="text-2xl font-thin text-white/20 tracking-[0.5em] not-italic font-sans uppercase">
                            {format(displayDate, 'EEEE d MMM', { locale: es })}
                        </span>
                    </h2>
                </div>
            </div>

            <div className="w-full max-w-[95vw] flex-1 relative">
                {/* Column Background Strips for Schedule */}
                <div
                    className="absolute inset-x-0 -top-4 -bottom-10 grid grid-cols-3 gap-8 pointer-events-none z-0"
                >
                    <div className="h-full bg-blue-500/[0.03] border-x border-blue-500/10" />
                    <div className="h-full bg-orange-500/[0.03] border-x border-orange-500/10" />
                    <div className="h-full bg-purple-500/[0.03] border-x border-purple-500/10" />
                </div>

                <div className="w-full h-full grid grid-cols-3 gap-8 items-start relative z-10">
                    {/* 5 AM SLOT */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "rounded-[4rem] border border-blue-500/20 bg-black/80 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-[600px] transition-all duration-500 p-8",
                            isCurrentActive('5am') && "ring-2 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                        )}
                    >
                        {/* Large Background Hour */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            <span className="text-[18rem] font-black absolute top-[-4rem] left-1/2 -translate-x-1/2 opacity-[0.05] select-none leading-none text-blue-500 italic">
                                05
                            </span>
                        </div>

                        {/* Top Header Label */}
                        <div className="flex justify-between items-start mb-8 relative z-20">
                            <span className="px-6 py-2 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] border border-blue-500/30 bg-blue-500/20 text-blue-300 shadow-2xl shrink-0 italic">CONSAGRACIÓN 5 AM</span>
                            {isCurrentActive('5am') && (
                                <span className="px-5 py-2 bg-red-600 animate-pulse text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shrink-0">EN CURSO</span>
                            )}
                        </div>

                        {/* Middle Cards (Weekly Program Style) */}
                        <div className="flex-1 flex flex-col justify-center gap-4 relative z-20 w-full mb-8">
                            {schedule?.slots['5am']?.leaderId ? (
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center gap-0 rounded-3xl bg-white/5 border border-white/10 w-full relative transition-all group/card overflow-hidden h-28 shadow-xl hover:bg-blue-500/10 hover:border-blue-500/30"
                                >
                                    <div className="w-28 h-full relative shrink-0 border-r border-white/10 overflow-hidden flex items-center justify-center bg-blue-500/10">
                                        {getMemberDetail(schedule.slots['5am'].leaderId).avatar ? (
                                            <img src={getMemberDetail(schedule.slots['5am'].leaderId).avatar!} className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10"><User className="w-10 h-10 text-blue-200" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    </div>
                                    <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-md italic bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                CONSAGRACIÓN
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none group-hover/card:text-glow-blue">
                                            {getMemberDetail(schedule.slots['5am'].leaderId).name || '---'}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="w-full h-full flex flex-col gap-4">
                                    <div className="flex-1 rounded-3xl border border-white/5 border-dashed flex items-center justify-center opacity-30 text-white font-black text-2xl uppercase tracking-widest italic">Pendiente</div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* 9 AM SLOT */}
                    {/* 9 AM SLOT */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={cn(
                            "rounded-[4rem] border border-orange-500/20 bg-black/80 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-[600px] transition-all duration-500 p-8",
                            isCurrentActive('9am') && "ring-2 ring-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.2)]"
                        )}
                    >
                        {/* Large Background Hour */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            <span className="text-[18rem] font-black absolute top-[-4rem] left-1/2 -translate-x-1/2 opacity-[0.05] select-none leading-none text-orange-500 italic">
                                09
                            </span>
                        </div>

                        {/* Top Header Label */}
                        <div className="flex justify-between items-start mb-8 relative z-20">
                            <span className="px-6 py-2 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] border border-orange-500/30 bg-orange-500/20 text-orange-300 shadow-2xl shrink-0 italic">DOMINGO 10 AM / ENTRE SEMANA 9 AM</span>
                            {isCurrentActive('9am') && (
                                <span className="px-5 py-2 bg-red-600 animate-pulse text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shrink-0">EN CURSO</span>
                            )}
                        </div>

                        {/* Middle Cards (Weekly Program Style) */}
                        <div className="flex-1 flex flex-col justify-center gap-4 relative z-20 w-full mb-8">
                            {/* Service / Doctrine Card */}
                            {schedule?.slots['9am']?.doctrineLeaderId && (
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center gap-0 rounded-3xl bg-white/5 border border-white/10 w-full relative transition-all group/card overflow-hidden h-28 shadow-xl hover:bg-orange-500/10 hover:border-orange-500/30"
                                >
                                    <div className="w-28 h-full relative shrink-0 border-r border-white/10 overflow-hidden flex items-center justify-center bg-orange-500/10">
                                        {getMemberDetail(schedule.slots['9am'].doctrineLeaderId).avatar ? (
                                            <img src={getMemberDetail(schedule.slots['9am'].doctrineLeaderId).avatar!} className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10"><User className="w-10 h-10 text-orange-200" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    </div>
                                    <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-md italic bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                SERVICIO
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none group-hover/card:text-glow-orange">
                                            {getMemberDetail(schedule.slots['9am'].doctrineLeaderId).name || '---'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Consecration Card */}
                            {schedule?.slots['9am']?.consecrationLeaderId && (
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center gap-0 rounded-3xl bg-white/5 border border-white/10 w-full relative transition-all group/card overflow-hidden h-28 shadow-xl hover:bg-yellow-500/10 hover:border-yellow-500/30"
                                >
                                    <div className="w-28 h-full relative shrink-0 border-r border-white/10 overflow-hidden flex items-center justify-center bg-yellow-500/10">
                                        {getMemberDetail(schedule.slots['9am'].consecrationLeaderId).avatar ? (
                                            <img src={getMemberDetail(schedule.slots['9am'].consecrationLeaderId).avatar!} className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10"><User className="w-10 h-10 text-yellow-200" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    </div>
                                    <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-md italic bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                CONSAGRACIÓN
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none group-hover/card:text-glow-yellow">
                                            {getMemberDetail(schedule.slots['9am'].consecrationLeaderId).name || '---'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {(!schedule?.slots['9am']?.doctrineLeaderId && !schedule?.slots['9am']?.consecrationLeaderId) && (
                                <div className="w-full h-full flex flex-col gap-4">
                                    <div className="flex-1 rounded-3xl border border-white/5 border-dashed flex items-center justify-center opacity-30 text-white font-black text-2xl uppercase tracking-widest italic">Pendiente</div>
                                </div>
                            )}
                        </div>
                    </motion.div>


                    {/* 7 PM SLOT */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                            "rounded-[4rem] border border-purple-500/20 bg-black/80 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-[600px] transition-all duration-500 p-8",
                            isCurrentActive('evening') && "ring-2 ring-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
                        )}
                    >
                        {/* Large Background Hour */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            <span className="text-[18rem] font-black absolute top-[-4rem] left-1/2 -translate-x-1/2 opacity-[0.05] select-none leading-none text-purple-500 italic">
                                07
                            </span>
                        </div>

                        {/* Top Header Label */}
                        <div className="flex justify-between items-start mb-8 relative z-20">
                            <div className="flex flex-col gap-2">
                                <span className="px-6 py-2 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] border border-purple-500/30 bg-purple-500/20 text-purple-300 shadow-2xl shrink-0 italic w-fit">
                                    {(schedule?.slots['evening']?.type === 'youth' ? 'SERVICIO DE JÓVENES' :
                                        schedule?.slots['evening']?.type === 'praise' ? 'ALABANZA' : 'ESPECIAL') || 'SERVICIO 7 PM'}
                                </span>
                                {schedule?.slots['evening']?.language === 'en' && (
                                    <div className="bg-[#fbbf24] text-black px-3 py-1 rounded-lg text-xs font-black w-fit shadow-xl border border-black/10 uppercase tracking-widest italic">ENGLISH</div>
                                )}
                            </div>
                            {isCurrentActive('evening') && (
                                <span className="px-5 py-2 bg-red-600 animate-pulse text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shrink-0">EN CURSO</span>
                            )}
                        </div>

                        {/* Middle Cards (Weekly Program Style) */}
                        <div className="flex-1 flex flex-col justify-center gap-4 relative z-20 w-full mb-8">
                            {schedule?.slots['evening']?.leaderIds && schedule.slots['evening'].leaderIds.length > 0 ? (
                                schedule.slots['evening'].leaderIds.map((id, idx) => {
                                    const roleStr = idx === 0 ? "PRINCIPAL" : "AUXILIAR";
                                    return (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex items-center gap-0 rounded-3xl bg-white/5 border border-white/10 w-full relative transition-all group/card overflow-hidden h-28 shadow-xl hover:bg-purple-500/10 hover:border-purple-500/30"
                                        >
                                            <div className="w-28 h-full relative shrink-0 border-r border-white/10 overflow-hidden flex items-center justify-center bg-purple-500/10">
                                                {getMemberDetail(id).avatar ? (
                                                    <img src={getMemberDetail(id).avatar!} className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-10"><User className="w-10 h-10 text-purple-200" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            </div>
                                            <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-md italic bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                        {roleStr}
                                                    </span>
                                                </div>
                                                <p className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none group-hover/card:text-glow-purple">
                                                    {getMemberDetail(id).name || '---'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="w-full h-full flex flex-col gap-4">
                                    <div className="flex-1 rounded-3xl border border-white/5 border-dashed flex items-center justify-center opacity-30 text-white font-black text-2xl uppercase tracking-widest italic">Pendiente</div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const CalendarSlide = () => {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);
    const numWeeks = Math.ceil((days.length + blanks.length) / 7);

    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
    const settings = useAppStore((state) => state.settings);
    const calendarStyles = useAppStore((state) => state.calendarStyles || {
        sundayColor: '#ef4444',
        thursdayColor: '#10b981',
        special14thColor: '#f59e0b',
        showGlassEffect: true,
        fontFamily: 'outfit'
    });
    const specialEventTitle = useAppStore((state) => state.specialEventTitle || 'Historia de la Iglesia');

    const sundayColor = calendarStyles.sundayColor;
    const thursdayColor = calendarStyles.thursdayColor;
    const special14thColor = calendarStyles.special14thColor;
    const showGlassEffect = calendarStyles.showGlassEffect;

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || null
        };
    };

    const getServiceTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'youth': 'Jóvenes',
            'married': 'Casados',
            'children': 'Niños',
            'praise': 'Alabanza',
            'special': 'Especial',
            'regular': 'Regular'
        };
        return types[type] || 'Regular';
    };

    return (
        <div className="h-full flex flex-col pt-0 pb-14 px-4 relative overflow-hidden bg-transparent">
            {calendarStyles.template === 'minimalist' ? (
                <div className="absolute inset-0 bg-[#09090b] text-white overflow-hidden flex flex-col" style={{ borderLeft: `32px solid ${sundayColor}` }}>
                    {/* Header Minimalista */}
                    <div className="flex justify-between items-start px-12 pt-6 mb-4 font-sans">
                        <div className="text-[100px] leading-[0.8] font-bold tracking-tighter" style={{ color: sundayColor }}>
                            {format(today, 'MM')}
                        </div>
                        <div className="flex items-baseline gap-4 pt-4">
                            <span className="text-[4rem] font-bold text-white/30 tracking-tight">{format(today, 'yyyy')}</span>
                            <span className="text-[4rem] font-bold tracking-tight" style={{ color: sundayColor }}>
                                {format(today, 'MMMM', { locale: enUS })}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 px-12 grid grid-rows-[auto_1fr] pb-1 w-full max-w-[100vw] overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-white/20 pb-2">
                            {[
                                { label: 'Monday', color: '#fff' },
                                { label: 'Tuesday', color: '#fff' },
                                { label: 'Wednesday', color: '#fff' },
                                { label: 'Thursday', color: '#fff' },
                                { label: 'Friday', color: '#fff' },
                                { label: 'Saturday', color: '#fff' },
                                { label: 'Sunday', color: sundayColor }
                            ].map((d, i) => (
                                <div key={i} className="text-left px-4 flex flex-col justify-end">
                                    <span className="text-xl font-bold font-sans tracking-tight" style={{ color: d.color }}>{d.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 border-l border-white/10 font-sans mt-0 h-full min-h-0" style={{ gridTemplateRows: `repeat(${numWeeks}, 1fr)` }}>
                            {Array.from({ length: getDay(currentMonth) === 0 ? 6 : getDay(currentMonth) - 1 }, (_, i) => i).map((_, i) => (
                                <div key={`mb-${i}`} className="border-r border-b border-white/10" />
                            ))}

                            {days.map((day, i) => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const sched = monthlySchedule[dateKey];
                                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                                const isSunday = getDay(day) === 0;
                                const isPastDay = day.getTime() < new Date(today).setHours(0, 0, 0, 0);

                                return (
                                    <div key={dateKey} className="border-r border-b border-white/10 p-2 px-4 flex flex-col items-start relative overflow-hidden group">
                                        {isToday && <div className="absolute inset-0 z-0 bg-white/5" />}

                                        <span
                                            className={cn("text-[40px] leading-none font-bold z-10 transition-colors mt-0", isPastDay ? "opacity-20" : "")}
                                            style={{ color: isPastDay ? 'white' : (isSunday ? sundayColor : 'white') }}
                                        >
                                            {format(day, 'd')}
                                        </span>

                                        {sched && (
                                            <div className={cn("flex flex-col gap-1 w-full z-10 mt-auto pt-1", isPastDay ? "opacity-40" : "")}>
                                                {/* 5am */}
                                                {sched.slots['5am'].leaderId && (
                                                    <div className="text-[9px] leading-tight">
                                                        <div className="text-white/30 uppercase font-black tracking-widest">{sched.slots['5am'].time || '05:00 AM'}</div>
                                                        <div className="text-white/70 truncate font-semibold">{getMemberDetail(sched.slots['5am'].leaderId).name}</div>
                                                    </div>
                                                )}
                                                {/* 9am or Sunday */}
                                                {sched.slots['9am'].doctrineLeaderId && (
                                                    <div className="text-[9px] leading-tight mt-0.5">
                                                        <div className="uppercase font-black tracking-widest" style={{ color: isSunday ? sundayColor : 'rgba(255,255,255,0.3)' }}>
                                                            {sched.slots['9am'].time || (isSunday ? '10:00 AM' : '09:00 AM')}
                                                        </div>
                                                        {!isSunday && sched.slots['9am'].consecrationLeaderId && (
                                                            <div className="flex flex-col mb-0.5">
                                                                <span className="text-white/70 truncate font-semibold uppercase">{getMemberDetail(sched.slots['9am'].consecrationLeaderId).name}</span>
                                                                <span className="text-[6.5px] font-bold text-white/30 uppercase tracking-widest leading-none">CONSAGRACIÓN</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-white/70 truncate font-semibold uppercase">
                                                                {getMemberDetail(sched.slots['9am'].doctrineLeaderId).name}
                                                            </span>
                                                            {!isSunday && (
                                                                <span className="text-[6.5px] font-bold text-white/30 uppercase tracking-widest leading-none mt-0.5">SERVICIO</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Evening */}
                                                {sched.slots['evening'].leaderIds.length > 0 && (
                                                    <div className="text-[9px] leading-tight mt-0.5 flex flex-col gap-0.5">
                                                        <div className="text-white/30 uppercase font-black tracking-widest">
                                                            {sched.slots['evening'].time || '07:00 PM'} • {getServiceTypeLabel(sched.slots['evening'].type)}
                                                        </div>
                                                        {sched.slots['evening'].leaderIds.map((id, aidx) => (
                                                            <div key={aidx} className="flex flex-col mb-0.5">
                                                                <span className="text-white/70 truncate font-semibold uppercase">{getMemberDetail(id).name}</span>
                                                                {sched.slots['evening'].leaderIds.length > 1 && (
                                                                    <span className="text-[6.5px] font-bold text-white/30 uppercase tracking-widest leading-none">
                                                                        {aidx === 0 ? 'SERVICIO' : 'CONSAGRACIÓN'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header section with styling controls context */}
                    <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-2xl">
                                <CalendarDays className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1 pl-1">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                    <span className="text-[10px] font-black tracking-[0.5em] text-primary/50 uppercase italic">Monthly Service Program</span>
                                </div>
                                <h2 className="text-7xl font-black uppercase tracking-tighter flex items-baseline gap-4 leading-none italic">
                                    <span className="text-white drop-shadow-2xl">Calendario</span>
                                    <span className="text-primary text-glow drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                                        {format(today, 'MMMM', { locale: es }).toUpperCase()}
                                    </span>
                                    <span className="text-2xl font-thin text-white/20 tracking-[0.5em] not-italic font-sans">
                                        {format(today, 'yyyy')}
                                    </span>
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col min-h-0">
                        {/* Header Labels (Now outside the column strips) */}
                        <div
                            className="grid gap-2 mb-6"
                            style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
                        >
                            {[
                                { label: 'DOM', color: 'text-red-500' },
                                { label: 'LUN' },
                                { label: 'MAR' },
                                { label: 'MIÉ' },
                                { label: 'JUE', color: 'text-emerald-500' },
                                { label: 'VIE' },
                                { label: 'SÁB' }
                            ].map((d, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "text-2xl font-black uppercase tracking-[0.2em] text-center italic py-2",
                                        d.color || "text-white/40"
                                    )}
                                >
                                    {d.label}
                                </div>
                            ))}
                        </div>

                        {/* Column Background Strips and Grid Container */}
                        <div className="flex-1 relative">
                            {/* Column Background Strips (The "Single Column" look) */}
                            <div
                                className="absolute inset-0 grid gap-x-2 pointer-events-none z-0"
                                style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                                    const isSunday = i === 0;
                                    const isTodayCol = getDay(today) === i;
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-full rounded-none transition-all duration-1000",
                                                isSunday ? "bg-red-500/10 border-x border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.05)]" :
                                                    isTodayCol ? "bg-primary/10 border-x border-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.05)]" :
                                                        "bg-white/[0.02]" // Uniform background for non-Sunday/non-Today columns
                                            )}
                                        />
                                    );
                                })}
                            </div>

                            <div
                                className="flex-1 grid gap-2 relative z-10"
                                style={{
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gridTemplateRows: `repeat(${numWeeks}, 1fr)`
                                }}
                            >
                                {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-transparent" />)}

                                {days.map((day, i) => {
                                    const dateKey = format(day, 'yyyy-MM-dd');
                                    const sched = monthlySchedule[dateKey];
                                    const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                                    const is14th = day.getDate() === 14;
                                    const isSunday = getDay(day) === 0;
                                    const isThursday = getDay(day) === 4;

                                    // Calculate row for interleaving effect
                                    const cellIndex = blanks.length + i;
                                    const rowIndex = Math.floor(cellIndex / 7);
                                    const isEvenRow = rowIndex % 2 === 0;

                                    // Determine primary color for the day
                                    let dayColor = null;
                                    if (is14th) dayColor = special14thColor;
                                    else if (isSunday) dayColor = sundayColor;
                                    else if (isThursday) dayColor = thursdayColor;

                                    const isWideDay = false; // All columns are now same width

                                    const todayStart = new Date(today);
                                    todayStart.setHours(0, 0, 0, 0);
                                    const isPastDay = day.getTime() < todayStart.getTime();

                                    const currentHour = today.getHours();
                                    const currentMinute = today.getMinutes();
                                    const currentTotalMin = currentHour * 60 + currentMinute;

                                    const checkTimeState = (
                                        timeStr: string | undefined,
                                        endTimeStr: string | undefined,
                                        defaultStartH: number,
                                        defaultStartM: number,
                                        durationMin: number
                                    ) => {
                                        let startH = defaultStartH;
                                        let startM = defaultStartM;
                                        if (timeStr) {
                                            const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/i);
                                            if (match) {
                                                startH = parseInt(match[1], 10);
                                                startM = parseInt(match[2], 10);
                                                if (match[3]) {
                                                    const ampm = match[3].toUpperCase();
                                                    if (ampm === 'PM' && startH < 12) startH += 12;
                                                    if (ampm === 'AM' && startH === 12) startH = 0;
                                                }
                                            }
                                        }

                                        const startTotalMin = startH * 60 + startM;
                                        let endTotalMin = startTotalMin + durationMin;
                                        if (endTimeStr) {
                                            const match = endTimeStr.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/i);
                                            if (match) {
                                                let endH = parseInt(match[1], 10);
                                                let endM = parseInt(match[2], 10);
                                                if (match[3]) {
                                                    const ampm = match[3].toUpperCase();
                                                    if (ampm === 'PM' && endH < 12) endH += 12;
                                                    if (ampm === 'AM' && endH === 12) endH = 0;
                                                }
                                                endTotalMin = endH * 60 + endM;
                                            }
                                        }

                                        const isPast = isPastDay || (isToday && currentTotalMin >= endTotalMin);
                                        const isNow = isToday && currentTotalMin >= (startTotalMin - 30) && currentTotalMin < endTotalMin;
                                        return { isPast, isNow, timeStr: timeStr || `${startH > 12 ? startH - 12 : startH === 0 ? 12 : startH}:${startM.toString().padStart(2, '0')} ${startH >= 12 ? 'PM' : 'AM'}` };
                                    };

                                    const { isPast: is5amPast, isNow: is5amNow } = checkTimeState(sched?.slots?.['5am']?.time, sched?.slots?.['5am']?.endTime, 5, 0, 30);
                                    const default9amHour = isSunday ? 10 : 9;
                                    const duration9am = isSunday ? 120 : 60;
                                    const { isPast: is9amPast, isNow: is9amNow } = checkTimeState(sched?.slots?.['9am']?.time, sched?.slots?.['9am']?.endTime, default9amHour, 0, duration9am);
                                    const isEveningSpecial = sched?.slots?.['evening']?.type === 'special';
                                    const eveningDuration = isEveningSpecial ? (isSunday ? 150 : isThursday ? 120 : 90) : 90;
                                    const defaultEveningHour = isEveningSpecial && isSunday ? 18 : isEveningSpecial && isThursday ? 18 : 19;
                                    const defaultEveningMin = isEveningSpecial && isThursday ? 30 : 0;
                                    const { isPast: isEveningPast, isNow: isEveningNow } = checkTimeState(sched?.slots?.['evening']?.time, sched?.slots?.['evening']?.endTime, defaultEveningHour, defaultEveningMin, eveningDuration);

                                    return (
                                        <motion.div
                                            key={dateKey}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.01 }}
                                            className={cn(
                                                "p-1.5 flex flex-col overflow-visible relative group transition-all duration-300",
                                                isToday ? "border-2 border-primary bg-primary/20 ring-4 ring-primary/30 shadow-[0_0_60px_rgba(59,130,246,0.5)] z-30 scale-[1.03] rounded-[1.5rem]" : "border-none bg-transparent"
                                            )}
                                        >
                                            {/* Glass reflection effect removed for performance */}


                                            {/* Static Glow instead of Pulse for performance */}
                                            {dayColor && (
                                                <div
                                                    className="absolute inset-0 rounded-[1.5rem] overflow-hidden z-0 opacity-10"
                                                    style={{ background: `radial-gradient(circle at center, ${dayColor}11 0%, transparent 80%)` }}
                                                />
                                            )}

                                            {/* Large Background Day Number (Weekly Program Style) */}
                                            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                                                <span className={cn(
                                                    "text-[8rem] font-black absolute top-[-1rem] left-1/2 -translate-x-1/2 opacity-[0.05] select-none leading-none",
                                                    isSunday ? "text-red-500" : "text-white"
                                                )}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>

                                            <span className={cn(
                                                "text-[18px] font-black absolute -top-3 -right-2 z-30 italic bg-[#0a0f1d] px-2.5 py-0.5 rounded-xl border border-white/10 shadow-xl leading-none flex items-center justify-center",
                                                isToday ? "text-primary text-glow border-primary/50" : "text-muted-foreground/50 border-white/5"
                                            )} style={{ color: !isToday && dayColor ? dayColor : undefined }}>
                                                {format(day, 'd')}
                                            </span>

                                            {/* English label for any selected service */}
                                            {sched?.slots?.['evening']?.language === 'en' && (
                                                <span className="absolute -top-3 -left-2 bg-primary text-[10px] text-black px-2 py-1 rounded-xl font-black z-30 shadow-xl tracking-tighter border border-[#0a0f1d]">EN</span>
                                            )}

                                            {is14th && (
                                                <div className="mt-0 text-center z-20">
                                                    <div
                                                        className="text-[12px] font-black uppercase leading-tight py-1 px-3 rounded-xl shadow-xl border border-white/5"
                                                        style={{ backgroundColor: `${special14thColor}33`, color: special14thColor }}
                                                    >
                                                        {specialEventTitle}
                                                    </div>
                                                </div>
                                            )}

                                            <div className={cn("z-10 w-full flex-1 flex flex-col justify-end relative", is14th ? "mt-0" : "mt-0")}>
                                                {sched ? (
                                                    <div className="flex flex-col rounded-2xl overflow-hidden glass-card border border-white/5 bg-black/80 shadow-2xl">
                                                        {/* 5 AM SLOT */}
                                                        {sched.slots['5am']?.leaderId && (
                                                            <div className={cn(
                                                                "flex items-center gap-0 group/row transition-all relative overflow-hidden h-11",
                                                                is5amPast ? "grayscale opacity-40"
                                                                    : is5amNow ? "bg-blue-500/30 animate-pulse-slow shadow-[inset_0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50"
                                                                        : "bg-blue-500/5 hover:bg-blue-500/10"
                                                            )}>
                                                                <div className="w-11 h-full relative shrink-0 border-r border-white/5 overflow-hidden flex items-center justify-center bg-blue-500/10">
                                                                    {getMemberDetail(sched.slots['5am'].leaderId).avatar ? (
                                                                        <img src={getMemberDetail(sched.slots['5am'].leaderId).avatar!} className="w-full h-full object-cover group-hover/row:scale-125 transition-transform duration-700" />
                                                                    ) : <User className="w-5 h-5 text-blue-300/20" />}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                                                </div>
                                                                <div className="flex-1 flex flex-col justify-center min-w-0 px-3 z-20">
                                                                    <span className="font-black text-white truncate uppercase tracking-tighter italic leading-none text-[10px]">{getMemberDetail(sched.slots['5am'].leaderId).name}</span>
                                                                    <div className="bg-blue-500/30 border border-blue-400/30 px-1 h-2.5 flex items-center justify-center rounded mt-0 w-fit">
                                                                        <span className="text-[6px] font-black text-blue-200 uppercase tracking-widest leading-none">CONSAGRACIÓN</span>
                                                                    </div>
                                                                </div>
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                                    <div className="bg-blue-500/40 border border-blue-400/40 px-1.5 h-3.5 flex items-center justify-center rounded-lg shadow-xl">
                                                                        <span className="text-[8px] font-black text-white italic leading-[0.7] drop-shadow-md">{sched.slots['5am'].time || '05:00 AM'}</span>
                                                                    </div>
                                                                </div>
                                                                {is5amNow && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[6px] font-black italic tracking-widest px-1.5 py-0.5 rounded-bl-lg shadow-lg z-50 animate-pulse">YA</div>}
                                                            </div>
                                                        )}

                                                        {/* Divider 5am -> 9am */}
                                                        {sched.slots['5am']?.leaderId && (sched.slots['9am']?.doctrineLeaderId || sched.slots['evening']?.leaderIds?.length > 0) && (
                                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[0.5px]" />
                                                        )}

                                                        {/* 9 AM SLOT */}
                                                        {sched.slots['9am']?.doctrineLeaderId && (
                                                            <div className={cn(
                                                                "group/row transition-all relative overflow-hidden h-11",
                                                                is9amPast ? "grayscale opacity-40"
                                                                    : is9amNow ? "bg-orange-500/30 ring-1 ring-orange-500/50 shadow-[inset_0_0_15px_rgba(249,115,22,0.3)] animate-pulse-slow"
                                                                        : "bg-orange-500/5 hover:bg-orange-500/10"
                                                            )}>
                                                                {(() => {
                                                                    const consecDetail = getMemberDetail(sched.slots['9am'].consecrationLeaderId);
                                                                    const doctDetail = getMemberDetail(sched.slots['9am'].doctrineLeaderId);
                                                                    const hasDual = !isSunday && sched.slots['9am'].consecrationLeaderId && sched.slots['9am'].doctrineLeaderId;

                                                                    return (
                                                                        <div className="flex items-center justify-between h-full relative">
                                                                            {/* Left Leader (Consecration) */}
                                                                            <div className="flex items-center min-w-0 h-full">
                                                                                <div className="w-11 h-full relative shrink-0 border-r border-white/5 overflow-hidden bg-orange-500/20 flex items-center justify-center">
                                                                                    {(hasDual ? consecDetail.avatar : doctDetail.avatar) ? <img src={(hasDual ? consecDetail.avatar : doctDetail.avatar)!} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-orange-300/20" />}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                                                                </div>
                                                                                <div className="flex flex-col justify-center px-1.5 min-w-0">
                                                                                    <span className="font-black text-white truncate uppercase tracking-tighter italic leading-none text-[8px]">
                                                                                        {hasDual ? consecDetail.name : doctDetail.name}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Center Service Label and Time */}
                                                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                                                                <div className="bg-orange-500/30 border border-orange-400/30 px-1 h-2.5 flex items-center justify-center rounded mb-0.5">
                                                                                    <span className="text-[4px] font-black text-orange-200 uppercase tracking-widest leading-none">{isSunday ? 'DOMINICAL' : 'DUAL'}</span>
                                                                                </div>
                                                                                <div className="bg-orange-600/60 border border-orange-500/40 px-1.5 h-3.5 flex items-center justify-center rounded-md shadow-xl">
                                                                                    <span className="text-[8px] font-black text-white italic leading-[0.7]">{sched.slots['9am'].time || (isSunday ? '10:00 AM' : '09:00 AM')}</span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Right Leader (Doctrine - Only if Dual) */}
                                                                            {hasDual && (
                                                                                <div className="flex flex-row-reverse items-center min-w-0 h-full">
                                                                                    <div className="w-11 h-full relative shrink-0 border-l border-white/5 overflow-hidden bg-orange-500/20 flex items-center justify-center">
                                                                                        {doctDetail.avatar ? <img src={doctDetail.avatar} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-orange-300/20" />}
                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                                                                    </div>
                                                                                    <div className="flex flex-col justify-center px-1.5 min-w-0 text-right">
                                                                                        <span className="font-black text-white truncate uppercase tracking-tighter italic leading-none text-[8px]">
                                                                                            {doctDetail.name}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {is9amNow && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[6px] font-black italic tracking-widest px-1.5 py-0.5 rounded-bl-lg shadow-lg z-50 animate-pulse">YA</div>}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}

                                                        {/* Divider 9am -> Evening */}
                                                        {sched.slots['9am']?.doctrineLeaderId && sched.slots['evening']?.leaderIds?.length > 0 && (
                                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[0.5px]" />
                                                        )}

                                                        {/* 7 PM (EVENING) SLOT */}
                                                        {sched.slots['evening']?.leaderIds?.length > 0 && (
                                                            <div className={cn(
                                                                "group/row transition-all relative overflow-hidden h-11",
                                                                isEveningPast ? "grayscale opacity-40"
                                                                    : isEveningNow ? "bg-purple-500/30 ring-1 ring-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.3)] animate-pulse-slow"
                                                                        : "bg-purple-500/5 hover:bg-purple-500/10"
                                                            )}>
                                                                <div className="flex flex-col h-full divide-y divide-white/5">
                                                                    {sched.slots['evening'].leaderIds.map((id, idx) => {
                                                                        const detail = getMemberDetail(id);
                                                                        return (
                                                                            <div key={idx} className="flex-1 flex items-center relative h-full min-w-0">
                                                                                <div className="w-11 h-full relative shrink-0 overflow-hidden bg-purple-500/10 flex items-center justify-center border-r border-white/5">
                                                                                    {detail.avatar ? <img src={detail.avatar} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-purple-300/20" />}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                                                                </div>
                                                                                <div className="flex-1 flex flex-col justify-center min-w-0 px-3 z-20">
                                                                                    <span className="font-black text-white truncate uppercase tracking-tighter italic leading-none text-[9px]">{detail.name}</span>
                                                                                    <div className="bg-purple-500/30 border border-purple-400/30 px-1 h-2.5 flex items-center justify-center rounded mt-0 w-fit">
                                                                                        <span className="text-[5px] font-black text-purple-200 uppercase tracking-widest leading-none">
                                                                                            {sched.slots['evening'].leaderIds.length > 1 ? (idx === 0 ? 'SERVICIO' : 'CONSAGRACIÓN') : getServiceTypeLabel(sched.slots['evening'].type)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                                    <div className="bg-purple-600/40 border border-purple-500/40 px-1.5 h-3.5 flex items-center justify-center rounded-lg shadow-xl">
                                                                        <span className="text-[8px] font-black text-white italic leading-[0.7] drop-shadow-md">{sched.slots['evening'].time || '07:00 PM'}</span>
                                                                    </div>
                                                                </div>
                                                                {isEveningNow && <div className="absolute top-0 right-0 bg-purple-500 text-white text-[6px] font-black italic tracking-widest px-1.5 py-0.5 rounded-bl-lg shadow-lg z-50 animate-pulse">YA</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    !is14th && (
                                                        <div className="flex-1 flex items-center justify-center text-white/5 text-2xl font-black uppercase tracking-[0.5em] italic">
                                                            Libre
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

const ThemeSlide = () => {
    const theme = useAppStore((state) => state.theme);
    return (
        <div className="h-full flex flex-col justify-start items-center pt-40 p-12 text-center bg-transparent">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card max-w-6xl w-full p-20 rounded-[4rem] border border-secondary/30 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5 shadow-2xl"
            >
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-full scale-150 animate-pulse" />
                    <BookOpen className="w-32 h-32 text-secondary mx-auto relative z-10" />
                </div>

                <h3 className="text-3xl uppercase tracking-[0.6em] mb-6 flex justify-center items-center gap-6">
                    <span className="font-extralight text-muted-foreground italic">Tema</span>
                    <div className="h-px w-12 bg-secondary/40" />
                    <span className="font-black text-secondary">Semanal</span>
                </h3>

                <h2 className="text-[7rem] font-black text-foreground mb-8 text-glow-secondary leading-tight tracking-tighter uppercase italic">{theme.title}</h2>

                <div className="flex justify-center flex-wrap gap-6 mb-12">
                    <span className="px-8 py-2.5 bg-secondary/20 text-secondary rounded-[2rem] text-xl font-black border border-secondary/40 uppercase tracking-widest italic shadow-xl">{theme.type}</span>
                </div>

                {theme.description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic font-light tracking-wide border-t border-white/5 pt-8"
                    >
                        "{theme.description}"
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

const AnnouncementsSlide = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => allAnnouncements.filter(a => a.active), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full flex flex-col md:flex-row p-16 gap-12 overflow-hidden bg-transparent">
            {/* Left Section: Announcements */}
            <div className="flex-1 flex flex-col min-w-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-10 mb-12"
                >
                    <div className="p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/30 shadow-xl relative overflow-hidden group">
                        <Bell className="w-12 h-12 text-amber-500 animate-bounce relative z-10" />
                    </div>
                    <h2 className="text-8xl font-black uppercase tracking-tighter text-foreground leading-none">
                        Anuncios <span className="text-amber-500 text-glow-amber">Importantes</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto pr-6 custom-scrollbar scroll-smooth pb-10">
                    <AnimatePresence mode="popLayout">
                        {announcements.map((ann, idx) => (
                            <motion.div
                                key={ann.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", damping: 25 }}
                                className={cn(
                                    "glass-card p-10 rounded-[3rem] border-2 relative group overflow-hidden flex flex-col shadow-xl transition-all duration-700",
                                    ann.priority > 0 ? "border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-transparent to-amber-500/5" : "border-white/10"
                                )}
                            >
                                {ann.priority > 0 && (
                                    <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-1.5 rounded-bl-2xl font-black text-sm uppercase italic tracking-widest shadow-2xl z-20 animate-pulse">URGENTE</div>
                                )}

                                <h3 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter group-hover:text-amber-400 transition-colors leading-[1.1]">{ann.title}</h3>
                                <p className="text-xl text-muted-foreground leading-relaxed flex-1 italic font-light line-clamp-3 border-l-4 border-amber-500/20 pl-5">
                                    {ann.content.replace('el como', 'el coro')}
                                </p>
                            </motion.div>
                        ))}
                        {settings.showCountdown && (
                            <motion.div
                                key="countdown-announcement"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="col-span-full mt-4"
                            >
                                <CountdownCard />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Section: Minister (Compact Sidebar) */}
            {settings.showMinisterOnDisplay && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-[450px] shrink-0 flex flex-col gap-8"
                >
                    <div className="flex-1 glass-card rounded-[4rem] border-primary/30 bg-gradient-to-b from-primary/10 via-transparent to-primary/5 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                            <Church className="w-60 h-60 text-primary" />
                        </div>

                        <div className="relative mb-10 group">
                            <div className="absolute -inset-6 bg-primary/20 rounded-[3rem] blur-[50px] opacity-40 group-hover:opacity-80 transition-all duration-1000 animate-pulse" />
                            <div className="w-64 h-80 rounded-[2.5rem] overflow-hidden border-4 border-primary/40 shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105">
                                {minister.avatar ? (
                                    <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                ) : (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                        <User className="w-24 h-24 text-primary/20" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <span className="px-6 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-black border border-primary/40 uppercase tracking-[0.3em] italic">Encargado Ministerial</span>
                            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{minister.name}</h2>
                            <div className="h-px w-20 bg-primary/30 mx-auto" />

                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex items-center gap-4 justify-center text-white/40">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <span className="text-lg font-bold tracking-tight">{minister.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 justify-center text-white/40">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="text-base font-medium truncate max-w-[300px]">{minister.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const MinisterSlide = () => {
    const minister = useAppStore((state) => state.minister);
    return (
        <div className="h-full flex items-center justify-center p-20 bg-transparent">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[1400px] w-full glass-card p-20 flex flex-col md:flex-row items-center gap-24 rounded-[6rem] border-primary/30 relative overflow-hidden bg-gradient-to-br from-primary/15 via-transparent to-primary/5 shadow-2xl"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 p-20 opacity-[0.05] rotate-12">
                    <Church className="w-96 h-96 text-primary" />
                </div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />

                <div className="relative group shrink-0">
                    <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[80px] opacity-50 group-hover:opacity-100 transition-all duration-1000 animate-pulse" />
                    <div className="w-[450px] h-[550px] rounded-[3.5rem] overflow-hidden border-[8px] border-primary/40 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 transition-transform duration-1000 group-hover:scale-[1.02] group-hover:-rotate-1">
                        {minister.avatar ? (
                            <img src={minister.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[3000ms] ease-out" alt="Ministro" />
                        ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                <User className="w-48 h-48 text-primary/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-8 relative z-10 overflow-hidden">
                    <div className="space-y-3">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="inline-block px-8 py-2 bg-primary/10 border border-primary/20 rounded-2xl text-xl font-black uppercase tracking-[0.5em] text-primary italic"
                        >
                            MINISTRO <span className="font-extralight">RESPONSABLE</span>
                        </motion.div>
                        <h1 className="text-[7rem] font-black text-foreground text-glow leading-[0.9] tracking-tighter uppercase italic">
                            {minister.name}
                        </h1>
                        <div className="h-2 w-48 bg-gradient-to-r from-primary to-transparent mt-4 rounded-full" />
                    </div>

                    <p className="text-3xl text-muted-foreground leading-relaxed italic border-l-[6px] border-primary/40 pl-10 py-2 font-light max-w-4xl">
                        "Enviado por la Gracia de Dios para la guía espiritual y bienestar de la Iglesia del Señor en este lugar."
                    </p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] flex items-center gap-8 border border-white/10 hover:bg-white/10 transition-all duration-500 group/item shadow-xl min-w-[320px]"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(59,130,246,0.3)] group-hover/item:scale-110 transition-transform duration-500 ring-4 ring-primary/10 shrink-0">
                                <Phone className="w-10 h-10" />
                            </div>
                            <div className="text-left space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-1">TELÉFONO DIRECTO</p>
                                <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter group-hover/item:text-primary transition-colors">{minister.phone}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] flex items-center gap-8 border border-white/10 hover:bg-white/10 transition-all duration-500 group/item shadow-xl min-w-[400px]"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(59,130,246,0.3)] group-hover/item:scale-110 transition-transform duration-500 ring-4 ring-primary/10 shrink-0">
                                <Mail className="w-10 h-10" />
                            </div>
                            <div className="text-left space-y-1 overflow-hidden">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-1">CORREO ELECTRÓNICO</p>
                                <p className="text-[1.8rem] font-black text-foreground group-hover/item:text-primary transition-colors truncate">{minister.email}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const CountdownSlide = () => {
    return (
        <div className="h-full flex flex-col justify-center items-center p-20 bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl"
            >
                <CountdownCard />
            </motion.div>
        </div>
    );
};

const CeremonialCountdownSlide = () => {
    return (
        <div className="h-full w-full bg-transparent">
            <CeremonialCountdown />
        </div>
    );
};

const WeeklyProgramSlide = () => {
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
    const theme = useAppStore((state) => state.theme);
    const settings = useAppStore((state) => state.settings);

    // Fix hydration mismatch by ensuring the same date reference and only rendering after mount
    const [mounted, setMounted] = useState(false);
    const [today] = useState(() => new Date());

    useEffect(() => {
        setMounted(true);
    }, []);

    // Preparar datos de los próximos 7 días con un enfoque de "Broadcast Weather"
    const daysProgram = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(today, i);
            const dateKey = format(date, 'yyyy-MM-dd');
            return {
                dateKey,
                dayName: format(date, 'eee', { locale: es }).toUpperCase(),
                dayNum: format(date, 'd'),
                sched: monthlySchedule[dateKey]
            };
        });
    }, [monthlySchedule, today]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'praise': return <Music className="w-16 h-16 text-yellow-400 text-glow-yellow" />;
            case 'special': return <Sparkles className="w-16 h-16 text-cyan-400 text-glow-blue" />;
            case 'youth': return <Star className="w-16 h-16 text-purple-400 text-glow-purple" />;
            case 'regular': return <Cross className="w-16 h-16 text-primary text-glow" />;
            default: return <Shield className="w-16 h-16 text-white/40" />;
        }
    };

    const getImpactLevel = (type: string) => {
        if (type === 'special') return 5;
        if (type === 'praise') return 4;
        if (type === 'youth') return 3;
        return 2;
    };

    if (!mounted) return null;

    return (
        <div className="h-full flex flex-col p-16 pt-24 bg-transparent relative overflow-hidden">
            {/* Large Background Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -z-10">
                {settings.churchLogoUrl ? (
                    <img src={settings.churchLogoUrl} className="w-[80%] h-auto object-contain" />
                ) : (
                    <Shield className="w-2/3 h-2/3 text-white" />
                )}
            </div>

            {/* Header style from broadcast forecast mockup */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-end mb-16 border-b border-white/10 pb-10"
            >
                <div className="flex items-center gap-10">
                    <div className="w-28 h-28 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <CalendarDays className="w-14 h-14 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-[4rem] font-black uppercase tracking-tighter leading-none italic">
                            <span className="text-primary text-glow">ORACIONES EN LA SEMANA</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1 bg-primary/20 text-primary text-xs font-black rounded-lg uppercase tracking-widest">EN VIVO</span>
                            <p className="text-2xl font-bold text-white/30 tracking-[0.4em] uppercase italic">Agenda de Bendición • LLDM Rodeo</p>
                        </div>
                    </div>
                </div>

                {/* Theme Integration */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 max-w-2xl mx-12 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-3xl overflow-hidden relative group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BookOpen className="w-20 h-20 text-white" />
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">TEMA SEMANAL</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter line-clamp-1 mb-1">{theme.title}</h3>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{theme.type}</p>
                </motion.div>

                {/* Spiritual Impact Scale equivalent from photo */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">INTENSIDAD ESPIRITUAL</p>
                    <div className="flex gap-3 relative z-10">
                        {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-500",
                                n === 1 && "bg-blue-600/20 text-blue-400 border border-blue-600/30",
                                n === 2 && "bg-green-600/20 text-green-400 border border-green-600/30",
                                n === 3 && "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
                                n === 4 && "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]",
                                n === 5 && "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse",
                            )}>
                                {n}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* The 7-Day Grid from weather graphics structure */}
            <div className="flex-1 grid grid-cols-7 gap-3 overflow-hidden rounded-[4rem] border border-white/5 shadow-2xl bg-black/20 backdrop-blur-sm">
                {daysProgram.map((day, idx) => {
                    const type = day.sched?.slots?.['evening']?.type || 'regular';
                    const date = parseISO(day.dateKey);
                    const isSunday = getDay(date) === 0;
                    const sundayColor = settings.primaryColor || '#ef4444'; // Use primary or red for Sunday

                    const leaderId = day.sched?.slots?.['evening']?.leaderIds?.[0];
                    const leaderName = members.find(m => m.id === leaderId)?.name || '---';
                    const impact = getImpactLevel(type);

                    return (
                        <motion.div
                            key={day.dateKey}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, type: "spring", damping: 20 }}
                            className={cn(
                                "relative flex flex-col items-center pt-6 pb-12 px-4 group transition-all duration-700",
                                isSunday ? "bg-red-500/10 border-x border-red-500/30" :
                                    idx === 0 ? "bg-primary/10 border-x border-primary/20" : "hover:bg-white/[0.04]",
                                idx % 2 === 0 && idx !== 0 && !isSunday ? "bg-white/[0.02]" : "",
                                type === 'special' && !isSunday && "bg-cyan-500/10 border-x border-cyan-500/20"
                            )}
                        >
                            {/* Floating Background Day Number */}
                            <span className={cn(
                                "absolute top-6 left-1/2 -translate-x-1/2 text-[140px] font-black select-none pointer-events-none z-0",
                                isSunday ? "text-red-500/10" : "text-white/5"
                            )}>
                                {day.dayNum}
                            </span>

                            {/* Day Name */}
                            <div className="text-center mb-4 z-10 pt-2">
                                <span className={cn(
                                    "text-2xl font-black tracking-widest block transition-colors duration-500",
                                    isSunday ? "text-red-500" : (idx === 0) ? "text-primary" : "text-white/60 group-hover:text-white"
                                )}>
                                    {day.dayName}
                                </span>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col items-center justify-start z-10 w-full mt-4">
                                <div className="text-center space-y-4 w-full">

                                    <div className="flex flex-col gap-2 w-full pt-2 overflow-y-auto custom-scrollbar-mini">
                                        {['5am', '9am', 'evening'].map((slotKey) => {
                                            const slot = day.sched?.slots?.[slotKey as '5am' | '9am' | 'evening'];
                                            if (!slot) return null;

                                            let leaderIds: string[] = [];
                                            if (slotKey === '5am') {
                                                const s = slot as { leaderId: string };
                                                if (s.leaderId) leaderIds.push(s.leaderId);
                                            } else if (slotKey === '9am') {
                                                const s = slot as { consecrationLeaderId: string; doctrineLeaderId: string };
                                                if (s.consecrationLeaderId) leaderIds.push(s.consecrationLeaderId);
                                                if (s.doctrineLeaderId) leaderIds.push(s.doctrineLeaderId);
                                            } else if (slotKey === 'evening') {
                                                const s = slot as { leaderIds: string[] };
                                                if (s.leaderIds) leaderIds = [...s.leaderIds];
                                            }

                                            const timeLabel = slotKey === '5am' ? '5 AM' : slotKey === '9am' ? '9 AM' : 'TARDE';

                                            return leaderIds.map((lId, lIdx) => {
                                                const member = members.find(m => m.id.trim().toLowerCase() === lId?.trim().toLowerCase());
                                                return (
                                                    <motion.div
                                                        key={`${slotKey}-${lIdx}`}
                                                        whileHover={{ scale: 1.02, x: 5 }}
                                                        className={cn(
                                                            "flex items-center gap-0 rounded-2xl bg-white/5 border border-white/5 w-full relative z-10 transition-all mb-2 group/card overflow-hidden h-16",
                                                            slotKey === '5am' ? "hover:bg-blue-500/10 hover:border-blue-500/20" :
                                                                slotKey === '9am' ? "hover:bg-orange-500/10 hover:border-orange-500/20" :
                                                                    "hover:bg-purple-500/10 hover:border-purple-500/20"
                                                        )}
                                                    >
                                                        {/* Integrated Image Zone */}
                                                        <div className={cn(
                                                            "w-16 h-full relative shrink-0 border-r border-white/10 overflow-hidden flex items-center justify-center",
                                                            slotKey === '5am' ? "bg-blue-500/10" :
                                                                slotKey === '9am' ? "bg-orange-500/10" :
                                                                    "bg-purple-500/10"
                                                        )}>
                                                            {member?.avatar ? (
                                                                <img src={member.avatar} className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-700" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center opacity-10"><User className="w-6 h-6" /></div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                        </div>

                                                        <div className="flex-1 p-2 min-w-0">
                                                            <div className="flex items-center justify-between mb-0.5">
                                                                <span className={cn(
                                                                    "text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-md italic",
                                                                    slotKey === '5am' ? "bg-blue-500/20 text-blue-300" :
                                                                        slotKey === '9am' ? "bg-orange-500/20 text-orange-300" :
                                                                            "bg-purple-500/20 text-purple-300"
                                                                )}>
                                                                    {timeLabel} {leaderIds.length > 1 && (lIdx === 0 ? '• SERVICIO' : '• CONSAGR.')}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12px] font-black text-white/95 uppercase tracking-tighter truncate leading-tight group-hover/card:text-white">
                                                                {member?.name || '---'}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            });
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Impact Bar at bottom */}
                            <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-white/5 rounded-full overflow-hidden z-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(impact / 5) * 100}%` }}
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        impact === 5 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" :
                                            impact === 4 ? "bg-orange-500" :
                                                impact === 3 ? "bg-yellow-500" : "bg-blue-500"
                                    )}
                                />
                            </div>

                            {/* Gradient Overlay for texture */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default function DisplayPage() {
    const [currentSlide, setCurrentSlide] = useState(3);
    const [isMounted, setIsMounted] = useState(false);
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const loadAllSchedulesFromCloud = useAppStore((state) => state.loadAllSchedulesFromCloud);
    const loadAnnouncementsFromCloud = useAppStore((state) => state.loadAnnouncementsFromCloud);
    const loadSettingsFromCloud = useAppStore((state) => state.loadSettingsFromCloud);
    const calendarStyles = useAppStore((state) => state.calendarStyles);
    const settings = useAppStore((state) => state.settings);
    const members = useAppStore((state) => state.members);
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);

    // Initial data loading
    useEffect(() => {
        const initData = async () => {
            await Promise.all([
                loadAllSchedulesFromCloud(),
                loadAnnouncementsFromCloud(),
                loadSettingsFromCloud()
            ]);
        };
        initData();
    }, [loadAllSchedulesFromCloud, loadAnnouncementsFromCloud, loadSettingsFromCloud]);

    const slides = useMemo(() => {
        const s = [
            { id: 'calendar', component: <CalendarSlide />, enabled: true },
            { id: 'weekly_program', component: <WeeklyProgramSlide />, enabled: true },
            { id: 'announcements', component: <AnnouncementsSlide />, enabled: true },
            { id: 'schedule', component: <ScheduleSlide />, enabled: true },
            { id: 'countdown', component: <CountdownSlide />, enabled: settings.showCountdown },
            { id: 'ceremonial-countdown', component: <CeremonialCountdownSlide />, enabled: settings.showCountdown },
        ];
        return s.filter(slide => slide.enabled);
    }, [settings.showMinisterOnDisplay, settings.showCountdown, members, monthlySchedule]);

    useEffect(() => {
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 15000);

        return () => clearInterval(timer);
    }, [slides.length]);

    // Dynamic global styling from store
    const fontFamily = useMemo(() => {
        if (calendarStyles?.fontFamily === 'sora') return 'var(--font-sora)';
        if (calendarStyles?.fontFamily === 'inter') return 'var(--font-inter)';
        return 'var(--font-outfit)';
    }, [calendarStyles?.fontFamily]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <main
            className="fixed inset-0 bg-[#020617] text-slate-50 overflow-hidden cursor-none select-none"
            style={{ fontFamily: fontFamily }}
        >
            {/* Super premium background engine */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 1. Deep Base Architecture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-black to-[#0f172a]" />

                {/* 3. Global Atmospheric Glows */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-blue-600/20 blur-[180px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-purple-600/20 blur-[180px] rounded-full"
                />
                <motion.div
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/5 blur-[100px]"
                />

                {/* 4. Tech Grid / Dots Pattern */}
                <div className={cn(
                    "absolute inset-0 opacity-20 z-[5]",
                    settings.displayBgStyle === 'dynamic' ? 'dots-dynamic' : 'dots-pattern'
                )} />

                {/* 5. Master Church Identity (Background Logo) */}
                {settings.displayBgMode !== 'none' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 z-10 p-40">
                        <motion.img
                            src={settings.displayBgMode === 'official' ? (settings.displayBgUrl || "/lldm_oficial_logo.svg") : (settings.displayCustomBgUrl || "/lldm_oficial_logo.svg")}
                            className="max-w-[50%] max-h-[50vh] w-auto h-auto object-contain select-none opacity-5"
                            style={{
                                filter: 'brightness(1.5) drop-shadow(0 0 100px rgba(255, 255, 255, 0.1))',
                            }}
                            animate={{
                                scale: [1, 1.03, 1],
                                opacity: [0.05, 0.1, 0.05]
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Floating Information Overlay (Sports Broadcast Clock) */}
            <div className="fixed bottom-8 right-8 z-[200] scale-90 origin-bottom-right pointer-events-none">
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex shadow-[0_30px_100px_rgba(0,0,0,0.9)] rounded-[2.5rem] overflow-hidden border border-white/20 bg-black/40 backdrop-blur-[50px]"
                >
                    {/* Brand ID Module */}
                    <div
                        className="w-20 flex items-center justify-center relative overflow-hidden px-4"
                        style={{ backgroundColor: settings.primaryColor }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-black/40 pointer-events-none" />
                        <div className="w-12 h-12 flex items-center justify-center relative z-10 pointer-events-none">
                            {settings.churchIcon === 'custom' ? (
                                <img
                                    src={settings.customIconUrl || settings.churchLogoUrl || "/lldm_rodeo_logo.svg"}
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] brightness-0 invert"
                                    alt="Church"
                                />
                            ) : (
                                <div className="text-white filter drop-shadow-[0_0_25px_rgba(255,255,255,1)]">
                                    {(() => {
                                        const icons = { shield: Shield, church: Church, cross: Cross, star: Star, heart: Heart };
                                        const Icon = (icons as any)[settings.churchIcon] || Shield;
                                        return <Icon className="w-8 h-8" strokeWidth={3} />;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Clock & Context Module */}
                    <div className="bg-black/90 px-8 py-4 flex items-center gap-6 border-l border-white/10 relative overflow-hidden min-w-[380px]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[70px] rounded-full" />

                        <div className="text-[4.5rem] font-black text-white text-glow italic tracking-tighter leading-none relative z-10 flex items-center gap-2">
                            {isMounted ? format(now, 'HH:mm') : '--:--'}
                            <span className="text-xl font-black text-primary/60 self-end mb-1 tracking-widest uppercase ml-2 tabular-nums">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                        </div>

                        <div className="flex flex-col items-start justify-center leading-none relative z-10 border-l-[3px] border-primary/40 pl-6 h-fit mr-4">
                            <div className="text-2xl font-black text-primary uppercase tracking-tight italic mb-1">
                                {isMounted ? format(now, 'EEEE', { locale: es }) : '---'}
                            </div>
                            <div className="text-xs font-bold text-white/60 uppercase tracking-[0.3em] italic">
                                {isMounted ? format(now, 'd MMM yyyy', { locale: es }) : '--- --- ---'}
                            </div>
                        </div>

                        <div className="text-xl text-white font-black uppercase tracking-widest self-center bg-white/10 px-3 py-1 rounded-2xl border border-white/10 h-fit ml-auto z-10">
                            {format(new Date(), 'a')}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Core Slide Viewport */}
            <div className="relative z-10 h-full w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.97, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.03, filter: 'blur(20px)' }}
                        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full w-full"
                    >
                        {slides.length > 0 ? slides[currentSlide].component : (
                            <div className="h-full flex items-center justify-center opacity-30">
                                <h1 className="text-5xl font-black tracking-[1em] uppercase">Sistema LLDM</h1>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation & Progress State Indicators */}
            <div className="fixed bottom-12 left-12 flex items-center gap-12 z-[200] bg-black/50 backdrop-blur-[40px] px-14 py-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                {slides.map((slide, idx) => (
                    <div key={slide.id} className="relative flex flex-col items-center">
                        <button
                            onClick={() => setCurrentSlide(idx)}
                            className={cn(
                                "flex items-center gap-5 transition-all duration-1000",
                                currentSlide === idx ? "opacity-100 scale-110" : "opacity-25 scale-100 hover:opacity-50"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded-full transition-all duration-1000 border-2",
                                currentSlide === idx ? "bg-primary border-primary shadow-[0_0_35px_rgba(59,130,246,1)] scale-125" : "bg-white/20 border-transparent"
                            )} />
                            <span className={cn(
                                "text-sm font-black uppercase tracking-[0.4em] transition-all duration-1000 italic",
                                currentSlide === idx ? "text-primary text-glow" : "text-white"
                            )}>
                                {slide.id}
                            </span>
                        </button>

                        {currentSlide === idx && (
                            <motion.div
                                layoutId="activeSlideIndicator"
                                className="absolute -bottom-3 w-full h-[3px] bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Aesthetic Branding Progress Bar */}
            <div className="fixed bottom-0 left-0 w-full h-[6px] bg-black/40 z-[300]">
                <motion.div
                    key={`progress-${currentSlide}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary shadow-[0_0_25px_rgba(59,130,246,0.8)]"
                />
            </div>

            <FullscreenButton />
        </main>
    );
}
