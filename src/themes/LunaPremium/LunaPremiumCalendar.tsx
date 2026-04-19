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
// NO BOXES, NO DIVISIONS: Only tiny subtle markers
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
            <main className="flex-1 h-full flex flex-col p-16 pt-32 z-10 relative">
                {/* Header */}
                <header className="flex flex-col mb-20">
                    <div className="flex items-baseline gap-4 mb-2">
                        <h1 className="text-7xl font-[100] tracking-tighter lowercase leading-none opacity-80">
                            {format(churchNow, 'MMMM', { locale: es }).toLowerCase()}
                        </h1>
                        <span className="text-3xl font-[100] text-white/10 lowercase">
                            {format(churchNow, 'yyyy')}
                        </span>
                    </div>
                </header>

                {/* Day Labels - With tiny dividers */}
                <div className="grid grid-cols-7 mb-8">
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

                {/* Calendar Grid - Ultra Clean */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-7 flex-1"
                >
                    {padding.map((_, i) => (
                        <div key={`pad-${i}`} className="relative">
                             {/* Vertical guide line - Extremely faint */}
                             <div className="absolute inset-y-0 right-0 w-[1px] bg-white/[0.02]" />
                        </div>
                    ))}

                    {days.map((date, idx) => {
                        const key = format(date, 'yyyy-MM-dd');
                        const sched = monthlySchedule?.[key];
                        const active = isSameDay(date, churchNow);
                        const hasData = sched?.slots?.['5am']?.leaderId || sched?.slots?.['9am']?.consecrationLeaderId || sched?.slots?.['evening']?.leaderIds?.length;
                        
                        const colIndex = (padding.length + idx) % 7;
                        const isLastCol = colIndex === 6;

                        return (
                            <motion.div 
                                key={key}
                                variants={itemVariants}
                                className="flex flex-col items-center justify-center relative group"
                            >
                                {/* Vertical Column Divider - Faint line */}
                                {!isLastCol && (
                                    <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-white/[0.02]" />
                                )}

                                {/* Active State Indicator - Minimalist */}
                                {active && (
                                    <motion.div 
                                        layoutId="luna_active_bg"
                                        className="absolute inset-4 border border-white/10 rounded-sm"
                                    />
                                )}
                                
                                <span className={`text-6xl font-[100] tracking-tighter transition-all duration-700 ${
                                    active ? 'text-white scale-110' : 'text-white/30 group-hover:text-white/50'
                                }`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {hasData && (
                                    <div className="absolute bottom-6 w-0.5 h-3 bg-white/10" />
                                )}
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

            {/* Atmosphere column layout (vertical lines only) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.01]" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px)', 
                     backgroundSize: 'calc(100% / 7) 100%' 
                 }} />
        </div>
    );
};

export default LunaPremiumCalendar;
