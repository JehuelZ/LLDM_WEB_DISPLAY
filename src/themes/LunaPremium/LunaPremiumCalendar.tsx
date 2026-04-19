'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { getChurchNow } from '@/lib/time';

// ─────────────────────────────────────────────
// LUNA PREMIUM THEME: CALENDAR SLIDE
// Aesthetic: Strict Lowercase, font-300, Saira
// Layout: Minimal Grid Division
// NO BOXES: Only faint dividing lines
// ─────────────────────────────────────────────

const LunaPremiumCalendar: React.FC = () => {
    const { monthlySchedule, settings } = useAppStore();
    const churchNow = getChurchNow(settings);
    
    const start = startOfMonth(churchNow);
    const end = endOfMonth(churchNow);
    const days = eachDayOfInterval({ start, end });
    
    // Add prefix padding for the first day of month (Sunday start)
    const firstDay = start.getDay();
    const padding = Array.from({ length: firstDay });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <div className="flex w-full h-full bg-transparent text-white font-[300] pl-[220px] overflow-hidden" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* MAIN CONTENT: CALENDAR */}
            <main className="flex-1 h-full flex flex-col p-16 pt-32 z-10 relative">
                {/* Header */}
                <header className="flex flex-col mb-16">
                    <div className="flex items-baseline gap-4 mb-2">
                        <h1 className="text-6xl font-[100] tracking-tighter lowercase leading-none">
                            {format(churchNow, 'MMMM', { locale: es }).toLowerCase()}
                        </h1>
                        <span className="text-2xl font-[100] text-white/30 lowercase">
                            {format(churchNow, 'yyyy')}
                        </span>
                    </div>
                </header>

                {/* Calendar Grid - Minimalist Divide */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-7 flex-1 border-t border-l border-white/5"
                >
                    {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map(d => (
                        <div key={d} className="text-center text-[9px] font-[300] tracking-[0.4em] text-white/10 py-5 lowercase border-r border-b border-white/5">
                            {d}
                        </div>
                    ))}
                    
                    {padding.map((_, i) => (
                        <div key={`pad-${i}`} className="border-r border-b border-white/[0.02]" />
                    ))}

                    {days.map(date => {
                        const key = format(date, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[key];
                        const active = isSameDay(date, churchNow);
                        const hasData = sched?.slots?.['5am']?.leaderId || sched?.slots?.['9am']?.consecrationLeaderId || sched?.slots?.['evening']?.leaderIds?.length;

                        return (
                            <motion.div 
                                key={key}
                                variants={itemVariants}
                                className={`flex flex-col items-center justify-center transition-all duration-700 relative border-r border-b border-white/5 hover:bg-white/[0.02] ${
                                    active ? 'bg-white/[0.05]' : ''
                                }`}
                            >
                                {active && (
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/20 text-white text-[7px] font-[300] lowercase tracking-widest">hoy</div>
                                )}
                                
                                <span className={`text-4xl font-[100] tracking-tighter ${active ? 'text-white' : 'text-white/40'}`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {hasData && (
                                    <div className="absolute bottom-4 w-1 h-1 bg-white/10" />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Legend */}
                <footer className="mt-8 flex items-center gap-8 opacity-10">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 border border-white" />
                        <span className="text-[8px] tracking-[0.2em] font-[300] lowercase">actividad</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white" />
                        <span className="text-[8px] tracking-[0.2em] font-[300] lowercase">hoy</span>
                     </div>
                </footer>
            </main>

            {/* Atmosphere grid layout */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.01]" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }} />
        </div>
    );
};

export default LunaPremiumCalendar;
