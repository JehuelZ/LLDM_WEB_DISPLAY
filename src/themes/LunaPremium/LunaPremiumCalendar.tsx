'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { getChurchNow } from '@/lib/time';

// ─────────────────────────────────────────────
// LUNA PREMIUM THEME: CALENDAR SLIDE
// Aesthetic: Ultra-Minimalist Industrial
// NO BOXES, NO DIVISIONS: Minimal Information Layer
// ─────────────────────────────────────────────

const LunaPremiumCalendar: React.FC = () => {
    const { monthlySchedule, settings, members } = useAppStore();
    const churchNow = getChurchNow(settings);
    
    const start = startOfMonth(churchNow);
    const end = endOfMonth(churchNow);
    const days = eachDayOfInterval({ start, end });
    
    // Add prefix padding for the first day of month (Sunday start)
    const firstDay = start.getDay();
    const padding = Array.from({ length: firstDay });

    const getMember = (id?: string) => {
        if (!id) return null;
        return members?.find((m: any) => m.id?.toString().toLowerCase() === id.trim().toLowerCase());
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.015 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex w-full h-full bg-transparent text-white font-[300] pl-[220px] overflow-hidden" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* MAIN CONTENT: CALENDAR */}
            <main className="flex-1 h-full flex flex-col p-16 pt-12 z-10 relative">
                {/* Header */}
                <header className="flex flex-col mb-12">
                    <div className="flex items-baseline gap-4 mb-2">
                        <h1 className="text-2xl font-[100] tracking-[0.4em] lowercase leading-none opacity-40">
                            {format(churchNow, 'MMMM', { locale: es }).toLowerCase()}
                        </h1>
                        <span className="text-xs font-[100] text-white/10 lowercase tracking-widest">
                            {format(churchNow, 'yyyy')}
                        </span>
                    </div>
                </header>

                {/* Day Labels - With tiny dividers */}
                <div className="grid grid-cols-7 mb-4">
                    {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map((d, i) => (
                        <div key={d} className="relative text-center">
                            <span className="text-[10px] font-[300] tracking-[0.6em] text-white/20 lowercase">
                                {d}
                            </span>
                            {/* Tiny vertical divider marker between labels */}
                            {i < 6 && (
                                <div className="absolute top-1/2 -right-[1px] -translate-y-1/2 w-[1px] h-3 bg-white/5" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid - Ultra Clean / Data Rich */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-7 flex-1"
                >
                    {padding.map((_, i) => (
                        <div key={`pad-${i}`} className="relative border-r border-white/[0.01]" />
                    ))}

                    {days.map((date, idx) => {
                        const key = format(date, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[key];
                        const active = isSameDay(date, churchNow);
                        const isSunday = date.getDay() === 0;

                        // Get responsibly names
                        const lead5am = getMember(sched?.slots?.['5am']?.leaderId);
                        const lead9am = isSunday 
                            ? getMember(sched?.slots?.['9am']?.doctrineLeaderId)
                            : getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                        const lead7pm = getMember(sched?.slots?.['evening']?.leaderIds?.[0]);
                        
                        const colIndex = (padding.length + idx) % 7;
                        const isLastCol = colIndex === 6;

                        return (
                            <motion.div 
                                key={key}
                                variants={itemVariants}
                                className="flex flex-col p-4 relative group"
                            >
                                {/* Vertical Column Divider */}
                                {!isLastCol && (
                                    <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-white/[0.02]" />
                                )}

                                {/* Today Indicator */}
                                {active && (
                                    <div className="absolute inset-2 border border-white/10 opacity-30" />
                                )}
                                
                                {/* Day Number */}
                                <span className={`text-4xl font-[100] tracking-tighter mb-4 ${
                                    active ? 'text-white' : 'text-white/20'
                                }`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {/* Data Stack */}
                                <div className="flex flex-col gap-3 mt-auto pb-4">
                                    {(lead5am || lead9am || lead7pm) ? (
                                        <>
                                            {lead5am && (
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-white/10 tracking-widest lowercase">consagración</span>
                                                    <span className="text-[9px] text-white/40 truncate lowercase">{lead5am.name.split(' ')[0]}</span>
                                                </div>
                                            )}
                                            {lead9am && (
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-white/10 tracking-widest lowercase">doctrina</span>
                                                    <span className="text-[9px] text-white/40 truncate lowercase">{lead9am.name.split(' ')[0]}</span>
                                                </div>
                                            )}
                                            {lead7pm && (
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-white/10 tracking-widest lowercase">oración</span>
                                                    <span className="text-[9px] text-white/40 truncate lowercase">{lead7pm.name.split(' ')[0]}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="h-1 w-4 bg-white/[0.02]" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Legend */}
                <footer className="mt-12 flex items-center gap-12 opacity-[0.05]">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-white/20" />
                        <span className="text-[9px] tracking-[0.4em] font-[300] lowercase">actividad</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-4 h-[1px] bg-white" />
                        <span className="text-[9px] tracking-[0.4em] font-[300] lowercase">hoy</span>
                     </div>
                </footer>
            </main>

            {/* Atmosphere background column guides */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.01]" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', 
                     backgroundSize: 'calc(100% / 7) 100%' 
                 }} />
        </div>
    );
};

export default LunaPremiumCalendar;
