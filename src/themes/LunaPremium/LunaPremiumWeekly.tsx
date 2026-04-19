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

        <div className="flex flex-col gap-12 w-full h-full animate-in fade-in zoom-in-95 duration-1400 px-4 py-8 pt-32 pb-32 pl-[220px]"
             style={{ fontFamily: "'Saira', sans-serif" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border-l-[4px] border-secondary shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/5">
                <div className="flex flex-col">
                    <span 
                        className="text-4xl font-[100] text-on-surface tracking-tight lowercase"
                    >
                        {slideTitle?.toLowerCase()}
                    </span>
                    <span className="text-[12px] font-[300] tracking-[0.4em] text-secondary mt-2 opacity-80 lowercase">
                        planificación semanal • semana del {format(start, 'dd', { locale: es })} al {format(addDays(start, 6), 'dd MMMM', { locale: es }).toLowerCase()}
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
                            className={`flex flex-col gap-4 p-5 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden ${
                                isToday 
                                ? 'bg-white/[0.08] border-primary/40 shadow-[0_20px_40px_rgba(255,164,76,0.1)] scale-105 z-10' 
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                            }`}
                        >
                            {/* Day Header */}
                            <div className="flex flex-col items-center gap-1 border-b border-white/10 pb-4">
                                <span className={`text-[10px] font-[300] tracking-[0.3em] lowercase ${isToday ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}>
                                    {format(date, 'EEEE', { locale: es }).slice(0, 3).toLowerCase()}
                                </span>
                                <span className={`text-4xl font-[100] ${isToday ? 'text-on-surface' : 'text-on-surface-variant'}`}>
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
                                            <span className={`text-[8px] font-[300] tracking-widest lowercase ${slot.color} opacity-60`}>
                                                {slot.id}
                                            </span>
                                            {slot.lead && <div className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-sm overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 grayscale group-hover/slot:grayscale-0 transition-all">
                                                {slot.lead?.avatar ? (
                                                    <img src={slot.lead.avatar} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                   <User size={12} className="m-auto opacity-20" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-[400] text-on-surface truncate leading-tight capitalize">
                                                {slot.lead?.name || '---'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isToday && (
                                <div className="absolute top-4 right-4">
                                    <div className="px-2 py-0.5 rounded-none bg-primary/20 text-primary text-[8px] font-[300] tracking-widest border border-primary/30 lowercase">hoy</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LunaPremiumWeekly;
