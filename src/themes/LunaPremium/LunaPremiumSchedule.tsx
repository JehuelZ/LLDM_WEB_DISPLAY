'use client';

import React from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { useAppStore } from '@/lib/store';
import { Calendar, Clock, MapPin, User, ChevronRight, Sunrise, Sun, BookOpen } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSlideSystemTitle, getSlotLabel, getServiceTypeLabel } from '@/lib/display_labels';

interface ScheduleProps {
    data?: any;
    isTomorrow?: boolean;
}

const LunaPremiumSchedule: React.FC<ScheduleProps> = ({ isTomorrow = false }) => {
    const { fonts } = useFont();
    const { monthlySchedule, members, settings, theme } = useAppStore();
    
    // Get target date
    const targetDate = isTomorrow ? addDays(new Date(), 1) : new Date();
    const dateKey = format(targetDate, 'yyyy-MM-dd');
    const schedule = monthlySchedule?.[dateKey];
    const isSunday = targetDate.getDay() === 0;

    const getMember = (id?: string) => {
        if (!id) return null;
        return members?.find((m: any) => m.id?.toString().toLowerCase() === id.trim().toLowerCase());
    };

    const slots = [
        {
            id: '5am',
            title: (schedule?.slots?.['5am']?.customLabel || getSlotLabel('5am', settings?.language))?.toLowerCase(),
            time: schedule?.slots?.['5am']?.time || '05:00 am',
            ministerId: schedule?.slots?.['5am']?.leaderId,
            type: 'consecration'
        },
        {
            id: '9am',
            title: isSunday 
                ? (schedule?.slots?.['9am']?.customLabel || schedule?.slots?.['9am']?.topic || getSlotLabel('9am_sunday', settings?.language))
                : (schedule?.slots?.['9am']?.customLabel || getSlotLabel('9am_regular', settings?.language)),
            time: schedule?.slots?.['9am']?.time || (isSunday ? '10:00 am' : '09:00 am'),
            ministerId: schedule?.slots?.['9am']?.consecrationLeaderId,
            minister2Id: schedule?.slots?.['9am']?.doctrineLeaderId,
            type: isSunday ? 'special' : 'doctrine'
        },
        {
            id: 'evening',
            title: (schedule?.slots?.['evening']?.customLabel || (isSunday ? 'servicio vespertino' : getSlotLabel('evening_regular', settings?.language)))?.toLowerCase(),
            time: schedule?.slots?.['evening']?.time || '07:00 pm',
            ministerId: schedule?.slots?.['evening']?.leaderIds?.[0],
            minister2Id: schedule?.slots?.['evening']?.doctrineLeaderId || schedule?.slots?.['evening']?.leaderIds?.[1],
            type: schedule?.slots?.['evening']?.type || 'regular'
        }
    ].filter(s => s.ministerId || s.minister2Id || !isTomorrow);

    const slideTitle = getSlideSystemTitle(isTomorrow ? 'schedule_tomorrow' : 'schedule', settings?.language)?.toLowerCase();

    return (
        <div className="flex flex-col gap-12 w-full h-full animate-in fade-in zoom-in-95 duration-1400 pl-[320px] pr-4 py-8 pt-32 pb-32 relative"
             style={{ fontFamily: "'Saira', sans-serif" }}>
            {/* High-Tech Section Header (Synchronized Flare Style) */}
            <header className="flex flex-col mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-[100] lowercase leading-none tracking-tight">
                            {slideTitle}
                        </h2>
                        {/* Title Flare Underline */}
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-2 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    </div>
                    
                    {/* Date Badge */}
                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-[500] tracking-[0.3em] uppercase self-end mb-2">
                        {format(targetDate, 'dd MMMM yyyy', { locale: es }).toLowerCase()}
                    </div>
                    
                    {theme && theme.title && (
                        <div className="px-4 py-1.5 bg-white/[0.03] border border-amber-500/30 rounded-full backdrop-blur-md flex items-center gap-2 self-end mb-1 ml-auto">
                            <BookOpen size={14} className="text-amber-500" />
                            <span className="text-[9px] tracking-[0.3em] uppercase text-amber-500/80 font-black">Tema Semanal:</span>
                            <span className="text-[11px] tracking-widest uppercase text-white/90 font-[400]">{theme.title}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Kinetic Table - Daily Slots */}
            <div className="grid grid-cols-1 gap-6 px-2 overflow-y-auto custom-scrollbar pr-4">
                {slots.map((slot, index) => {
                    const m1 = getMember(slot.ministerId);
                    const m2 = getMember(slot.minister2Id);
                    
                    return (
                        <div 
                            key={slot.id}
                            className="group flex flex-col gap-6 px-6 py-8 bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] hover:bg-white/[0.05] transition-all duration-700 relative overflow-hidden border border-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-primary-container opacity-20 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex items-center justify-between relative z-10 gap-12">
                                {/* Time & Day Module */}
                                <div className="flex items-center gap-8 min-w-[280px]">
                                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-primary font-[300] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <Clock size={32} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span 
                                            className="text-[11px] tracking-[0.3em] text-on-surface-variant font-[300] opacity-40 lowercase"
                                        >
                                            inicio programado
                                        </span>
                                        <span 
                                            className="text-4xl font-[100] text-on-surface lowercase"
                                        >
                                            {slot.time.toLowerCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Service Identity Module */}
                                <div className="flex-1">
                                    <span 
                                        className="text-3xl font-[300] text-on-surface leading-tight transition-all duration-500 group-hover:text-primary tracking-tight lowercase"
                                    >
                                        {slot.title?.toLowerCase()}
                                    </span>
                                    <div className="flex items-center gap-8 mt-3">
                                        <div className="flex items-center gap-2.5 text-[12px] tracking-widest text-on-surface-variant font-[300] opacity-60 lowercase">
                                            <MapPin size={16} className="text-secondary" />
                                            santuario principal
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <div className="flex items-center gap-2.5 text-[12px] tracking-widest text-on-surface-variant font-[300] opacity-60 lowercase">
                                            <Sunrise size={16} className="text-primary" />
                                            {getServiceTypeLabel(slot.type, settings?.language)?.toLowerCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Ministers Module */}
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-4">
                                        {[m1, m2].filter(Boolean).map((m: any, idx) => (
                                            <div key={idx} className="relative group/avatar">
                                                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-surface shadow-2xl relative transition-transform duration-500 group-hover/avatar:scale-110 grayscale group-hover:grayscale-0">
                                                    {m.avatar || m.avatarUrl ? (
                                                        <img src={m.avatar || m.avatarUrl} className="w-full h-full object-cover" alt={m.name} />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                            <User size={32} className="text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col min-w-[200px]">
                                        <span className="text-[10px] tracking-[0.4em] text-primary font-[300] mb-1 opacity-60 lowercase">
                                            responsables
                                        </span>
                                        <span className="text-lg font-[400] text-on-surface truncate capitalize">
                                            {m1?.name || (m2 ? '' : 'pendiente')}
                                            {m1 && m2 && ' | '}
                                            {m2?.name}
                                        </span>
                                        <span className="text-xs text-on-surface-variant opacity-60 font-[300] lowercase">
                                            {m1 ? m1.group?.toLowerCase() || 'ministerio' : ''}
                                        </span>
                                    </div>
                                </div>

                                {/* Interactive Indicator */}
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-[1px] bg-white/5" />
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <ChevronRight size={24} className="text-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Kinetic Progress Layer (Pulse Gradient) */}
                            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                <div className="h-full bg-gradient-to-r from-primary via-primary to-transparent w-full animate-shimmer" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LunaPremiumSchedule;
