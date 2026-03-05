'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bell, User, CalendarDays, Phone, Mail } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Components for each slide type
const ScheduleSlide = () => {
    // Current day schedule retrieval
    const scheduleMap = useAppStore((state) => state.monthlySchedule);
    const currentDate = useAppStore((state) => state.currentDate);
    const members = useAppStore((state) => state.members);
    const schedule = scheduleMap[currentDate] || Object.values(scheduleMap)[0]; // Fallback if today not found

    const getMemberName = (id: string | null) => {
        if (!id) return '---';
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);

        if (member) return member.name;

        // Debug logging to help identify why a UUID isn't mapping
        if (id.length > 20) {
            console.log('Member lookup failed for ID:', id, 'Available members:', members.length);
            return 'Hermano Asignado'; // Fallback text instead of UUID
        }

        return id;
    };

    const getMemberAvatar = (id: string | null) => {
        if (!id) return null;
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);
        return member?.avatar || null;
    };

    if (!schedule) return null;

    return (
        <div className="h-full flex flex-col justify-center items-center p-12">
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-8xl mb-16 text-foreground text-glow flex items-baseline gap-6"
            >
                <span className="font-extralight text-primary/80">Programa de</span>
                <span className="font-black uppercase tracking-tighter">Oración</span>
                <span className="text-4xl font-light ml-6 text-muted-foreground border-l-2 border-white/20 pl-6">
                    {format(parseISO(schedule.date), "EEEE d 'de' MMMM", { locale: es })}
                </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[95%]">
                {/* 5 AM */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-blue-500/20 flex flex-col items-center bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 relative group"
                >
                    <div className="absolute -inset-2 bg-blue-500/10 rounded-[4rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="text-7xl font-black mb-6 text-blue-400 text-glow">5:00 AM</div>
                    <div className="text-3xl text-muted-foreground mb-10 font-medium uppercase tracking-[0.2em]">Consagración</div>

                    <div className="flex flex-col items-center gap-8 mt-auto w-full relative z-10">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="w-52 h-52 rounded-full bg-slate-900 flex items-center justify-center border-4 border-blue-500/50 overflow-hidden relative shadow-2xl">
                                {getMemberAvatar(schedule.slots['5am'].leaderId) ? (
                                    <img
                                        src={getMemberAvatar(schedule.slots['5am'].leaderId)!}
                                        className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                                        alt="Avatar"
                                    />
                                ) : (
                                    <User className="w-24 h-24 text-blue-400" />
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold opacity-70 mb-2 uppercase tracking-widest text-blue-300">Hno. Responsable</div>
                            <div className="text-6xl font-black text-foreground text-glow leading-tight">{getMemberName(schedule.slots['5am'].leaderId)}</div>
                        </div>
                    </div>
                </motion.div>

                {/* 9 AM */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-yellow-500/20 flex flex-col items-center bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 relative group"
                >
                    <div className="absolute -inset-2 bg-yellow-500/10 rounded-[4rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="text-7xl font-black mb-6 text-yellow-500 text-glow">9:00 AM</div>
                    <div className="text-3xl text-muted-foreground mb-10 font-medium uppercase tracking-[0.2em]">Oración</div>

                    <div className="space-y-12 w-full mt-auto relative z-10">
                        <div className="flex flex-col gap-4 border-b-2 border-white/5 pb-10">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-yellow-500/30 rounded-full blur-lg" />
                                    {getMemberAvatar(schedule.slots['9am'].consecrationLeaderId) ? (
                                        <img src={getMemberAvatar(schedule.slots['9am'].consecrationLeaderId)!} className="w-20 h-20 rounded-full border-4 border-yellow-500/30 object-cover relative z-10" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-4 border-yellow-500/30 relative z-10"><User className="w-10 h-10 text-yellow-500/50" /></div>
                                    )}
                                </div>
                                <span className="text-4xl font-medium text-yellow-200/80 italic">Consagración:</span>
                            </div>
                            <span className="text-5xl font-black text-foreground pl-25">{getMemberName(schedule.slots['9am'].consecrationLeaderId)}</span>
                        </div>
                        <div className="flex flex-col gap-4 pb-4">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-yellow-500/30 rounded-full blur-lg" />
                                    {getMemberAvatar(schedule.slots['9am'].doctrineLeaderId) ? (
                                        <img src={getMemberAvatar(schedule.slots['9am'].doctrineLeaderId)!} className="w-20 h-20 rounded-full border-4 border-yellow-500/30 object-cover relative z-10" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-4 border-yellow-500/30 relative z-10"><User className="w-10 h-10 text-yellow-500/50" /></div>
                                    )}
                                </div>
                                <span className="text-4xl font-medium text-yellow-200/80 italic">Doctrina:</span>
                            </div>
                            <span className="text-6xl font-black text-foreground pl-25 text-glow leading-tight">{getMemberName(schedule.slots['9am'].doctrineLeaderId)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Evening */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-purple-500/20 flex flex-col items-center bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 relative group overflow-hidden"
                >
                    <div className="absolute -inset-2 bg-purple-500/10 rounded-[4rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {schedule.date === format(new Date(), 'yyyy-MM-dd') && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-800 text-foreground px-10 ry-4 rounded-bl-[3rem] font-black text-3xl animate-pulse shadow-2xl z-20 border-l border-b border-white/20">
                            HOY
                        </div>
                    )}
                    <div className="text-7xl font-black mb-6 text-purple-400 text-glow-purple">7:00 PM</div>
                    <div className="text-3xl text-muted-foreground mb-10 capitalize font-medium uppercase tracking-[0.2em]">
                        {schedule.date === format(new Date(), 'yyyy-MM-dd') && getDay(new Date()) === 0 ? 'Servicio de Alabanza' :
                            schedule.slots['evening'].type === 'special' ? 'Servicio Especial' :
                                schedule.slots['evening'].type === 'youth' ? 'Servicio de Jóvenes' :
                                    schedule.slots['evening'].type === 'married' ? 'Servicio de Casados' :
                                        schedule.slots['evening'].type === 'children' ? 'Servicio de Niños' : 'Servicio Regular'}
                    </div>

                    <div className="space-y-12 w-full mt-auto relative z-10">
                        <div className="text-center">
                            <div className="text-3xl text-purple-300 mb-8 uppercase tracking-[0.4em] font-black opacity-80">
                                {schedule.slots['evening'].type === 'special' || schedule.slots['evening'].leaderIds.length > 1 ? 'Preside' : 'Hno. Responsable'}
                            </div>
                            <div className="flex justify-center flex-wrap gap-10">
                                {schedule.slots['evening'].leaderIds.length > 0 ? (
                                    schedule.slots['evening'].leaderIds.map(leader => (
                                        <div key={leader} className="flex flex-col items-center gap-6 group/item">
                                            <div className="relative">
                                                <div className="absolute -inset-3 bg-purple-500/20 rounded-full blur-xl group-hover/item:bg-purple-500/40 transition-colors" />
                                                <div className="w-40 h-40 rounded-full bg-slate-900 flex items-center justify-center border-4 border-purple-500/50 overflow-hidden relative shadow-xl">
                                                    {getMemberAvatar(leader) ? (
                                                        <img src={getMemberAvatar(leader)!} className="w-full h-full object-cover scale-110 group-hover/item:scale-125 transition-transform duration-700" />
                                                    ) : (
                                                        <User className="w-16 h-16 text-purple-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-5xl font-black text-foreground text-glow-purple tracking-tight">{getMemberName(leader)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-4xl text-muted-foreground italic font-light">Pendiente de asignar</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
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

    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const members = useAppStore((state) => state.members);
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

    const getMemberName = (id: string | null) => {
        if (!id) return '';
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);
        return member ? member.name : id;
    };

    const getMemberAvatar = (id: string | null) => {
        if (!id) return null;
        const cleanId = id.trim().toLowerCase();
        const member = members.find(m => m.id.toLowerCase() === cleanId);
        return member?.avatar || null;
    };

    return (
        <div className="h-full flex flex-col pt-6 pb-24 px-10 relative overflow-hidden">
            {/* Header section with styling controls context */}
            <div className="flex justify-between items-end mb-12">
                <div className="flex items-center gap-8">
                    <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 shadow-2xl">
                        <CalendarDays className="w-16 h-16 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-8xl font-black uppercase tracking-tighter text-foreground flex items-center gap-6">
                            Calendario <span className="text-primary/40 font-thin">/</span>
                            <span className="text-primary text-glow drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                {format(today, 'MMMM yyyy', { locale: es }).toUpperCase()}
                            </span>
                        </h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-6 mb-4">
                {[
                    { label: 'DOM', color: sundayColor },
                    { label: 'LUN' },
                    { label: 'MAR' },
                    { label: 'MIÉ' },
                    { label: 'JUE', color: thursdayColor },
                    { label: 'VIE' },
                    { label: 'SÁB' }
                ].map((d, idx) => (
                    <div
                        key={idx}
                        className="text-xl font-bold uppercase tracking-widest text-center"
                        style={{ color: d.color || 'var(--muted-foreground)' }}
                    >
                        {d.label}
                    </div>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-3">
                {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-transparent" />)}

                {days.map((day, i) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const sched = monthlySchedule[dateKey];
                    const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                    const is14th = day.getDate() === 14;
                    const isSunday = getDay(day) === 0;
                    const isThursday = getDay(day) === 4;

                    // Determine primary color for the day
                    let dayColor = null;
                    if (is14th) dayColor = special14thColor;
                    else if (isSunday) dayColor = sundayColor;
                    else if (isThursday) dayColor = thursdayColor;

                    return (
                        <motion.div
                            key={dateKey}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={cn(
                                "rounded-2xl p-4 border border-border/40 bg-foreground/5 flex flex-col overflow-hidden relative group transition-all duration-300",
                                isToday && "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-[0_0_40px_rgba(59,130,246,0.3)] z-20 scale-[1.02]"
                            )}
                            style={{
                                borderColor: dayColor ? `${dayColor}66` : undefined,
                                backgroundColor: dayColor ? `${dayColor}10` : undefined,
                                outline: (isSunday || isThursday || is14th) && !isToday ? `1px solid ${dayColor}33` : undefined
                            }}
                        >
                            {/* Glass reflection effect */}
                            {showGlassEffect && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                                    <motion.div
                                        animate={{ translateX: ['-100%', '200%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                                        className="absolute -inset-[100%] opacity-20 bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-[35deg]"
                                    />
                                </div>
                            )}

                            {/* Inner Glow Pulse */}
                            {dayColor && (
                                <motion.div
                                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 z-0"
                                    style={{ background: `radial-gradient(circle at center, ${dayColor}22 0%, transparent 70%)` }}
                                />
                            )}

                            <span className={cn(
                                "text-2xl font-black absolute top-2 right-3 z-10",
                                isToday ? "text-primary text-glow" : "text-muted-foreground/60"
                            )} style={{ color: !isToday && dayColor ? dayColor : undefined }}>
                                {format(day, 'd')}
                            </span>

                            {is14th && (
                                <div className="mt-6 text-center z-10">
                                    <div
                                        className="text-[9px] sm:text-[10px] font-black uppercase leading-tight py-1 rounded-lg shadow-lg backdrop-blur-md border border-white/5"
                                        style={{ backgroundColor: `${special14thColor}33`, color: special14thColor }}
                                    >
                                        {specialEventTitle}
                                    </div>
                                </div>
                            )}

                            <div className={cn("space-y-1.5 z-10 w-full flex-1 flex flex-col justify-end", is14th ? "mt-1" : "mt-6")}>
                                {sched ? (
                                    <>
                                        {/* 5 AM */}
                                        <div className="flex items-center gap-1.5 px-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 py-1 hover:bg-blue-500/20 transition-colors group/row">
                                            {getMemberAvatar(sched.slots['5am'].leaderId) ? (
                                                <img src={getMemberAvatar(sched.slots['5am'].leaderId)!} className="w-6 h-6 rounded-full object-cover shrink-0 border-2 border-blue-400/30 group-hover/row:border-blue-400/60 transition-colors" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/20"><User className="w-3 h-3 text-blue-300" /></div>
                                            )}
                                            <div className="flex-1 flex items-center justify-between gap-1 min-w-0">
                                                <span className="text-[11px] font-black text-blue-50 truncate uppercase tracking-tight italic">{getMemberName(sched.slots['5am'].leaderId)}</span>
                                                <span className="text-[8px] font-black bg-blue-500/90 text-white px-1.5 py-0.5 rounded-md uppercase tracking-tighter shrink-0 shadow-lg shadow-blue-900/40">5 AM</span>
                                            </div>
                                        </div>

                                        {/* 9 AM - Combined Row */}
                                        <div className="bg-slate-900/40 rounded-lg border border-white/5 px-1.5 py-1.5 space-y-1.5 hover:bg-white/5 transition-colors">
                                            <div className="text-[6px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-0.5 border-b border-white/5 pb-1">9:00 AM</div>

                                            {/* Consagración */}
                                            <div className="flex items-center gap-1.5 group/row">
                                                {getMemberAvatar(sched.slots['9am'].consecrationLeaderId) ? (
                                                    <img src={getMemberAvatar(sched.slots['9am'].consecrationLeaderId)!} className="w-5 h-5 rounded-full object-cover shrink-0 border border-orange-500/30" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20"><User className="w-2.5 h-2.5 text-orange-400/50" /></div>
                                                )}
                                                <div className="flex-1 flex items-center justify-between min-w-0">
                                                    <span className="text-[9.5px] font-black text-slate-200 truncate uppercase tracking-tight italic">{getMemberName(sched.slots['9am'].consecrationLeaderId)}</span>
                                                    <span className="text-[6.5px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shrink-0 ml-1.5 shadow-lg shadow-orange-900/40">Consagración</span>
                                                </div>
                                            </div>

                                            {/* Doctrina */}
                                            <div className="flex items-center gap-1.5 group/row">
                                                {getMemberAvatar(sched.slots['9am'].doctrineLeaderId) ? (
                                                    <img src={getMemberAvatar(sched.slots['9am'].doctrineLeaderId)!} className="w-5 h-5 rounded-full object-cover shrink-0 border border-yellow-400/30" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/20"><User className="w-2.5 h-2.5 text-yellow-300/50" /></div>
                                                )}
                                                <div className="flex-1 flex items-center justify-between min-w-0">
                                                    <span className="text-[9.5px] font-black text-slate-200 truncate uppercase tracking-tight italic">{getMemberName(sched.slots['9am'].doctrineLeaderId)}</span>
                                                    <span className="text-[6.5px] font-black bg-yellow-400 text-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shrink-0 ml-1.5 shadow-lg shadow-yellow-900/40">Doctrina</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 7 PM */}
                                        <div className="bg-purple-900/40 rounded-lg border border-purple-500/30 px-1.5 py-1.5 space-y-1.5 hover:bg-purple-800/40 transition-all group/row">
                                            <div className="text-[6px] font-bold text-purple-300/60 uppercase tracking-[0.2em] mb-0.5 border-b border-purple-500/20 pb-1 flex justify-between">
                                                <span>7:00 PM</span>
                                                <span className="text-purple-400">{sched.slots['evening'].leaderIds.length > 1 ? 'Servicio de Alabanza' : 'Servicio Regular'}</span>
                                            </div>
                                            {sched.slots['evening'].leaderIds.slice(0, 2).map((leaderId, idx) => (
                                                <div key={leaderId} className="flex items-center gap-1.5">
                                                    {getMemberAvatar(leaderId) ? (
                                                        <img src={getMemberAvatar(leaderId)!} className="w-5 h-5 rounded-full object-cover shrink-0 border border-purple-400/30 group-hover/row:border-purple-400/60 transition-colors shadow-lg" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-400/20"><User className="w-2.5 h-2.5 text-purple-200" /></div>
                                                    )}
                                                    <div className="flex-1 flex items-center justify-between min-w-0">
                                                        <span className="text-[11px] font-black text-purple-50 truncate uppercase tracking-normal drop-shadow-lg italic">{getMemberName(leaderId)}</span>
                                                        <span className={cn(
                                                            "text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shrink-0 ml-1.5 shadow-lg",
                                                            idx === 0 ? "bg-blue-600 text-white shadow-blue-900/40" : "bg-purple-600 text-white shadow-purple-900/40"
                                                        )}>
                                                            {sched.slots['evening'].leaderIds.length > 1 ? (idx === 0 ? 'Servicio' : 'Doctrina') : 'Encargado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    !is14th && (
                                        <div className="flex-1 flex items-center justify-center text-muted-foreground/10 text-[11px] font-black uppercase tracking-[0.2em] italic">
                                            Sin programación
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const ThemeSlide = () => {
    const theme = useAppStore((state) => state.theme);
    return (
        <div className="h-full flex flex-col justify-center items-center p-12 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card max-w-5xl w-full p-16 rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent"
            >
                <BookOpen className="w-24 h-24 text-secondary mx-auto mb-8" />
                <h3 className="text-2xl uppercase tracking-[0.5em] mb-4 flex justify-center items-center gap-3">
                    <span className="font-extralight text-muted-foreground">Tema</span>
                    <span className="font-bold text-secondary">Semanal</span>
                </h3>
                <h2 className="text-8xl font-black text-foreground mb-8 text-glow-secondary leading-tight">{theme.title}</h2>
                <div className="flex justify-center flex-wrap gap-4 mb-12">
                    <span className="px-6 py-2 bg-secondary/20 text-secondary rounded-full text-xl font-bold border border-secondary/30 uppercase tracking-widest italic">{theme.type}</span>
                </div>
                {theme.description && (
                    <p className="text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic font-light tracking-wide">
                        {theme.description}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

const AnnouncementsSlide = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const announcements = useMemo(() => allAnnouncements.filter(a => a.active), [allAnnouncements]);

    return (
        <div className="h-full flex flex-col p-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 mb-12"
            >
                <div className="p-5 bg-amber-500/10 rounded-3xl border border-amber-500/30">
                    <Bell className="w-12 h-12 text-amber-500 animate-bounce" />
                </div>
                <h2 className="text-7xl font-black uppercase tracking-tighter text-foreground">
                    Anuncios <span className="text-amber-500 text-glow">Importantes</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 overflow-y-auto pr-6 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {announcements.map((ann, idx) => (
                        <motion.div
                            key={ann.id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "glass-card p-12 rounded-[3rem] border-2 relative group overflow-hidden flex flex-col",
                                ann.priority > 0 ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]" : "border-white/10"
                            )}
                        >
                            {ann.priority > 0 && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white px-10 py-3 rounded-bl-[2rem] font-black text-2xl uppercase italic tracking-widest shadow-2xl z-20">URGENTE</div>
                            )}
                            <h3 className="text-5xl font-black text-foreground mb-6 uppercase tracking-tight group-hover:text-amber-400 transition-colors leading-tight">{ann.title}</h3>
                            <p className="text-2xl text-muted-foreground leading-relaxed flex-1 italic font-light line-clamp-4">{ann.content}</p>
                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xl font-bold uppercase tracking-widest text-white/30 italic">Publicado recientemente</span>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/10" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="col-span-full h-full flex flex-col items-center justify-center opacity-30 text-center py-40">
                            <Mail className="w-40 h-40 mb-10" />
                            <h3 className="text-4xl font-black uppercase tracking-widest italic">No hay comunicados activos</h3>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function DisplayPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const loadAllSchedulesFromCloud = useAppStore((state) => state.loadAllSchedulesFromCloud);
    const loadAnnouncementsFromCloud = useAppStore((state) => state.loadAnnouncementsFromCloud);
    const loadSettingsFromCloud = useAppStore((state) => state.loadSettingsFromCloud);
    const calendarStyles = useAppStore((state) => state.calendarStyles);

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

    const slides = [
        { id: 'schedule', component: <ScheduleSlide /> },
        { id: 'calendar', component: <CalendarSlide /> },
        { id: 'theme', component: <ThemeSlide /> },
        { id: 'announcements', component: <AnnouncementsSlide /> },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 15000); // 15 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    // Dynamic font family from store
    const fontFamily = calendarStyles?.fontFamily === 'sora' ? 'var(--font-sora)' :
        calendarStyles?.fontFamily === 'inter' ? 'var(--font-inter)' :
            'var(--font-outfit)';

    return (
        <main
            className="fixed inset-0 bg-[#020617] text-slate-50 overflow-hidden cursor-none"
            style={{ fontFamily: fontFamily }}
        >
            {/* Super premium background with dynamic elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                {/* Ambient glow effects */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-1/2 h-1/2 bg-blue-600/20 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-1/2 h-1/2 bg-purple-600/20 blur-[150px] rounded-full"
                />
            </div>

            {/* Subtle church logo in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none overflow-hidden z-0">
                <motion.img
                    src="/flama-oficial.svg"
                    className="max-w-[85%] max-h-[85vh] w-auto h-auto object-contain filter invert sepia(1) saturate(100) hue-rotate(-15deg) brightness(1.2)"
                    style={{
                        filter: 'invert(1) drop-shadow(0 0 60px rgba(251, 191, 36, 0.6)) brightness(1.8)',
                        opacity: 0.5
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Clock Overlay - Always Visible - Sports Broadcast Style */}
            <div className="fixed top-8 right-12 z-50 pointer-events-none flex flex-col items-end">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/60 backdrop-blur-2xl px-12 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-end"
                >
                    <div className="text-8xl font-black text-white text-glow italic tracking-tighter leading-none mb-2">
                        {format(new Date(), 'HH:mm')}
                        <span className="text-4xl text-primary/60 ml-3 not-italic">{format(new Date(), 'a')}</span>
                    </div>
                    <div className="text-2xl font-black text-primary uppercase tracking-[0.4em] italic opacity-80 flex items-center gap-4">
                        <div className="h-0.5 w-12 bg-primary/30" />
                        {format(new Date(), 'EEEE, d MMMM', { locale: es })}
                        <div className="h-0.5 w-12 bg-primary/30" />
                    </div>
                </motion.div>
            </div>

            {/* Main Content Carousel */}
            <div className="relative z-10 h-full w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full w-full"
                    >
                        {slides[currentSlide].component}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Slide Progress Indicator */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10 z-50 bg-black/40 backdrop-blur-xl px-12 py-5 rounded-full border border-white/5 shadow-2xl">
                {slides.map((slide, idx) => (
                    <div key={slide.id} className="relative flex flex-col items-center">
                        <button
                            onClick={() => setCurrentSlide(idx)}
                            className={cn(
                                "flex items-center gap-4 transition-all duration-700",
                                currentSlide === idx ? "opacity-100 scale-110" : "opacity-30 scale-100"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full transition-all duration-700",
                                currentSlide === idx ? "bg-primary shadow-[0_0_20px_rgba(59,130,246,1)] scale-150" : "bg-white/40"
                            )} />
                            <span className={cn(
                                "text-xs font-black uppercase tracking-[0.3em] transition-all duration-700",
                                currentSlide === idx ? "text-primary" : "text-white"
                            )}>
                                {slide.id}
                            </span>
                        </button>
                        {currentSlide === idx && (
                            <motion.div
                                layoutId="activeSlide"
                                className="absolute -bottom-2 w-full h-1 bg-primary rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Accent Line */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-foreground/5 z-50">
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-secondary shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                />
            </div>
        </main>
    );
}
