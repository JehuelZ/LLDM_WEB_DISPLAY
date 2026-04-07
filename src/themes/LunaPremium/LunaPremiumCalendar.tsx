'use client';

import React from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSlideSystemTitle } from '@/lib/display_labels';

const LunaPremiumCalendar: React.FC = () => {
    const { fonts } = useFont();
    const { monthlySchedule, settings } = useAppStore();
    
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });
    
    // Add prefix padding for the first day of month (Sunday start)
    const firstDay = start.getDay();
    const padding = Array.from({ length: firstDay });

    const slideTitle = getSlideSystemTitle('calendar', settings?.language);

    return (
        <div className="flex flex-col gap-12 w-full h-full animate-in fade-in zoom-in-95 duration-1400 p-12 pt-40 pb-32">
             {/* Header */}
             <div className="flex items-center justify-between px-8 py-6 bg-surface-container-high/40 backdrop-blur-3xl rounded-3xl border-l-[4px] border-primary shadow-[0_32px_64px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
                <div className="flex flex-col">
                    <span 
                        className="text-4xl font-light text-on-surface tracking-tight"
                        style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif' }}
                    >
                        {slideTitle}
                    </span>
                    <span className="text-[12px] uppercase font-bold tracking-[0.4em] text-primary mt-2 opacity-80">
                        {format(now, 'MMMM yyyy', { locale: es }).toUpperCase()} • {days.length} DÍAS PROGRAMADOS
                    </span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 flex-1">
                {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black tracking-[0.3em] text-on-surface-variant opacity-40 py-2">
                        {d}
                    </div>
                ))}
                
                {padding.map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square rounded-2xl bg-white/[0.02]" />
                ))}

                {days.map(date => {
                    const key = format(date, 'yyyy-MM-dd');
                    const sched = monthlySchedule?.[key];
                    const active = isToday(date);
                    const hasData = sched?.slots?.['5am']?.leaderId || sched?.slots?.['9am']?.consecrationLeaderId || sched?.slots?.['evening']?.leaderIds?.length;

                    return (
                        <div 
                            key={key}
                            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-500 relative ${
                                active 
                                ? 'bg-primary/20 border-primary shadow-[0_12px_24px_rgba(255,164,76,0.2)] scale-110 z-10' 
                                : 'bg-surface-container/20 border-white/5 hover:bg-surface-container/40'
                            }`}
                        >
                            <span className={`text-2xl font-light ${active ? 'text-on-surface' : 'text-on-surface-variant'}`} style={{ fontFamily: fonts?.primary }}>
                                {format(date, 'd')}
                            </span>
                            {hasData && (
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                                    <div className="w-1 h-1 rounded-full bg-secondary/40" />
                                    <div className="w-1 h-1 rounded-full bg-tertiary/40" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        </div>
    );
};

export default LunaPremiumCalendar;
