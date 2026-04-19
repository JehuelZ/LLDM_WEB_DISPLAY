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
// Layout: Adaptive with Persistent Sidebar
// NO CIRCLES: Industrial Square Design
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
        visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="flex w-full h-full bg-transparent text-white font-[300] pl-[220px] overflow-hidden" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* MAIN CONTENT: CALENDAR */}
            <main className="flex-1 h-full flex flex-col p-16 pt-32 z-10 relative">
                {/* Header */}
                <header className="flex flex-col mb-12">
                    <div className="flex items-baseline gap-4 mb-2">
                        <h1 className="text-6xl font-[300] tracking-tighter lowercase leading-none">
                            {format(churchNow, 'MMMM', { locale: es }).toLowerCase()}
                        </h1>
                        <span className="text-2xl font-[100] text-white/30 lowercase">
                            {format(churchNow, 'yyyy')}
                        </span>
                    </div>
                    <div className="h-[1px] w-20 bg-white/20 mt-4" />
                </header>

                {/* Calendar Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-7 gap-4 flex-1 pb-10"
                >
                    {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map(d => (
                        <div key={d} className="text-center text-[9px] font-[300] tracking-[0.4em] text-white/10 pb-4 lowercase">
                            {d}
                        </div>
                    ))}
                    
                    {padding.map((_, i) => (
                        <div key={`pad-${i}`} className="aspect-square opacity-0" />
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
                                className={`aspect-square rounded-sm border flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden ${
                                    active 
                                    ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] z-10' 
                                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                                }`}
                            >
                                <span className={`text-2xl font-[100] tracking-tighter ${active ? 'text-black' : 'text-white'}`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {hasData && !active && (
                                    <div className="absolute bottom-3 flex gap-1">
                                        <div className="w-[3px] h-[3px] rounded-none bg-white opacity-20" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Legend */}
                <footer className="flex items-center gap-8 opacity-10">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-none border border-white" />
                        <span className="text-[8px] tracking-[0.2em] font-[300] lowercase">actividad</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-none bg-white" />
                        <span className="text-[8px] tracking-[0.2em] font-[300] lowercase">hoy</span>
                     </div>
                </footer>
            </main>

            {/* Atmosphere grid (rectangles instead of dots) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.01]" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
                     backgroundSize: '30px 30px' 
                 }} />
        </div>
    );
};

export default LunaPremiumCalendar;
