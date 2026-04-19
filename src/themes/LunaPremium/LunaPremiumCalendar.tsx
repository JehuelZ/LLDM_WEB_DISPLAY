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
            <main className="flex-1 h-full flex flex-col px-4 py-8 pt-12 z-10 relative">
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
                        <div key={`pad-${i}`} className="relative" />
                    ))}

                    {days.map((date, idx) => {
                        const key = format(date, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[key];
                        const active = isSameDay(date, churchNow);
                        const isSunday = date.getDay() === 0;

                        // 1. Slot: 5 AM (Consecración)
                        const lead5am = getMember(sched?.slots?.['5am']?.leaderId);
                        
                        // 2. Slot: 9 AM (Joined by pipe if dual)
                        const lead9amCons = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                        const lead9amDoc = getMember(sched?.slots?.['9am']?.doctrineLeaderId);
                        const nineAmText = [lead9amCons?.name, lead9amDoc?.name].filter(Boolean).join(' | ');
                        
                        // 3. Slot: Evening (Joined by pipe)
                        const eveningSlot = sched?.slots?.['evening'];
                        const eveningLeaders = (eveningSlot?.leaderIds || [])
                            .map((id: string) => getMember(id))
                            .filter(Boolean);
                        if (eveningLeaders.length === 0 && eveningSlot?.leaderId) {
                            const fallback = getMember(eveningSlot.leaderId);
                            if (fallback) eveningLeaders.push(fallback);
                        }
                        const eveningText = eveningLeaders.map(l => l.name).join(' | ');

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
                                <span className={`text-xl font-[100] tracking-tighter transition-all duration-700 mb-2 ${
                                    active ? 'text-white' : 'text-white/30 group-hover:text-white/40'
                                }`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {/* Data Stack - Three Daily Slots with pipe formatting */}
                                <div className="flex flex-col gap-2.5 mt-auto pb-4">
                                    {/* Slot 1: 5am */}
                                    {lead5am && (
                                        <div className="flex items-baseline gap-1.5 overflow-hidden">
                                            <span className="text-[9px] text-white/40 font-[400] truncate capitalize shrink-0 max-w-[120px]">{lead5am.name}</span>
                                            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[5px] text-blue-400/60 tracking-[0.05em] lowercase shrink-0">consagración</span>
                                        </div>
                                    )}

                                    {/* Slot 2: 9am (Pipe formatted) */}
                                    {nineAmText && (
                                        <div className="flex items-baseline gap-1.5 overflow-hidden">
                                            <span className="text-[9px] text-white/40 font-[400] truncate capitalize shrink-0 max-w-[120px]">{nineAmText}</span>
                                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[5px] text-emerald-400/60 tracking-[0.05em] lowercase shrink-0">
                                                {isSunday ? 'escuela dominical' : (lead9amCons && lead9amDoc ? 'consagración | doctrina' : (lead9amDoc ? 'doctrina' : 'consagración'))}
                                            </span>
                                        </div>
                                    )}

                                    {/* Slot 3: Evening (Pipe formatted) */}
                                    {eveningText && (
                                        <div className="flex items-baseline gap-1.5 overflow-hidden">
                                            <span className="text-[9px] text-white/40 font-[400] truncate capitalize shrink-0 max-w-[120px]">{eveningText}</span>
                                            <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[5px] text-amber-400/60 tracking-[0.05em] lowercase shrink-0">oración</span>
                                        </div>
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
