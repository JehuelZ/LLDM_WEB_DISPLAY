'use client';

import React from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { useAppStore } from '@/lib/store';
import { Calendar, Clock, MapPin, User, ChevronRight, Sunrise, Sun, BookOpen } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSlideSystemTitle } from '@/lib/display_labels';

const LunaPremiumWeekly: React.FC = () => {
    const { fonts } = useFont();
    const { monthlySchedule, members, settings } = useAppStore();
    
    // Get start of current week (assuming Monday)
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 0 });
    
    const weekDays = [...Array(7)].map((_, i) => {
        const date = addDays(start, i);
        const key = format(date, 'yyyy-MM-dd');
        const sched = monthlySchedule?.[key];
        return { date, key, sched };
    });

    const getMember = (id?: string) => {
        if (!id) return null;
        return members?.find((m: any) => m.id?.toString().toLowerCase() === id.trim().toLowerCase());
    };

    const slideTitle = getSlideSystemTitle('weekly_program', settings?.language);

    return (
        <div className="flex flex-col gap-12 w-full h-full animate-in fade-in zoom-in-95 duration-1400 p-12 pt-40 pb-32 pl-[260px]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-surface-container-high/40 backdrop-blur-3xl rounded-3xl border-l-[4px] border-secondary shadow-[0_32px_64px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
                <div className="flex flex-col">
                    <span 
                        className="text-4xl font-light text-on-surface tracking-tight"
                        style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif' }}
                    >
                        {slideTitle}
                    </span>
                    <span className="text-[12px] uppercase font-bold tracking-[0.4em] text-secondary mt-2 opacity-80">
                        PLANIFICACIÓN SEMANAL • SEMANA DEL {format(start, 'dd', { locale: es })} AL {format(addDays(start, 6), 'dd MMMM', { locale: es })}
                    </span>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-7 gap-4 flex-1 min-h-0">
                {weekDays.map(({ date, key, sched }, index) => {
                    const isToday = key === format(today, 'yyyy-MM-dd');
                    const isSun = date.getDay() === 0;
                    
                    const lead5am = getMember(sched?.slots?.['5am']?.leaderId);
                    const lead9am = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                    const leadEv = getMember(sched?.slots?.['evening']?.leaderIds?.[0]);

                    return (
                        <div 
                            key={key}
                            className={`flex flex-col gap-4 p-5 rounded-3xl border transition-all duration-700 relative overflow-hidden ${
                                isToday 
                                ? 'bg-surface-bright/20 border-primary/50 shadow-[0_20px_40px_rgba(255,164,76,0.15)] scale-105 z-10' 
                                : 'bg-surface-container/20 border-white/5 hover:bg-surface-container/40'
                            }`}
                        >
                            {/* Day Header */}
                            <div className="flex flex-col items-center gap-1 border-b border-white/5 pb-4">
                                <span className={`text-[10px] uppercase font-black tracking-[0.3em] ${isToday ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}>
                                    {format(date, 'EEEE', { locale: es }).slice(0, 3)}
                                </span>
                                <span className={`text-4xl font-light ${isToday ? 'text-on-surface' : 'text-on-surface-variant'}`} style={{ fontFamily: fonts?.primary }}>
                                    {format(date, 'dd')}
                                </span>
                            </div>

                            {/* Mini Slots */}
                            <div className="flex flex-col gap-4 flex-1">
                                {[
                                    { id: '5am', lead: lead5am, color: 'text-primary' },
                                    { id: '9am', lead: lead9am, color: 'text-secondary' },
                                    { id: 'evening', lead: leadEv, color: 'text-tertiary' }
                                ].map((slot, idx) => (
                                    <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 group/slot hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[8px] uppercase font-bold tracking-widest ${slot.color} opacity-60`}>
                                                {slot.id}
                                            </span>
                                            {slot.lead && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                                                {slot.lead?.avatar ? (
                                                    <img src={slot.lead.avatar} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                   <User size={12} className="m-auto opacity-20" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-on-surface truncate leading-tight">
                                                {slot.lead?.name.split(' ')[0] || '---'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isToday && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black tracking-widest border border-primary/30 uppercase">HOY</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none" />
        </div>
    );
};

export default LunaPremiumWeekly;
