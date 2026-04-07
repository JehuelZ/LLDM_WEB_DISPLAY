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
    const { monthlySchedule, members, settings } = useAppStore();
    
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
            title: schedule?.slots?.['5am']?.customLabel || getSlotLabel('5am', settings?.language),
            time: schedule?.slots?.['5am']?.time || '05:00 AM',
            ministerId: schedule?.slots?.['5am']?.leaderId,
            type: 'consecration'
        },
        {
            id: '9am',
            title: isSunday 
                ? (schedule?.slots?.['9am']?.customLabel || schedule?.slots?.['9am']?.topic || getSlotLabel('9am_sunday', settings?.language))
                : (schedule?.slots?.['9am']?.customLabel || getSlotLabel('9am_regular', settings?.language)),
            time: schedule?.slots?.['9am']?.time || (isSunday ? '10:00 AM' : '09:00 AM'),
            ministerId: schedule?.slots?.['9am']?.consecrationLeaderId,
            minister2Id: schedule?.slots?.['9am']?.doctrineLeaderId,
            type: isSunday ? 'special' : 'doctrine'
        },
        {
            id: 'evening',
            title: schedule?.slots?.['evening']?.customLabel || (isSunday ? 'Servicio Vespertino' : getSlotLabel('evening_regular', settings?.language)),
            time: schedule?.slots?.['evening']?.time || '07:00 PM',
            ministerId: schedule?.slots?.['evening']?.leaderIds?.[0],
            minister2Id: schedule?.slots?.['evening']?.doctrineLeaderId || schedule?.slots?.['evening']?.leaderIds?.[1],
            type: schedule?.slots?.['evening']?.type || 'regular'
        }
    ].filter(s => s.ministerId || s.minister2Id || !isTomorrow);

    const slideTitle = getSlideSystemTitle(isTomorrow ? 'schedule_tomorrow' : 'schedule', settings?.language);

    return (
        <div className="flex flex-col gap-12 w-full h-full animate-in fade-in zoom-in-95 duration-1400 p-12 pt-40 pb-32">
            {/* High-Tech Section Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-surface-container-high/40 backdrop-blur-3xl rounded-3xl border-l-[4px] border-primary shadow-[0_32px_64px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
                <div className="flex flex-col">
                    <span 
                        className="text-4xl font-light text-on-surface tracking-tight"
                        style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif' }}
                    >
                        {slideTitle}
                    </span>
                    <span className="text-[12px] uppercase font-bold tracking-[0.4em] text-primary mt-2 opacity-80">
                        SISTEMA DE GESTIÓN ESPIRITUAL • {format(targetDate, 'dd MMMM yyyy', { locale: es })}
                    </span>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[11px] text-on-surface-variant uppercase tracking-widest font-black opacity-40">Modo de Visualización</span>
                        <span className="text-md font-medium text-secondary flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#339af0]" />
                            TIEMPO REAL
                        </span>
                    </div>
                </div>
            </div>

            {/* Kinetic Table - Daily Slots */}
            <div className="grid grid-cols-1 gap-6 px-2 overflow-y-auto custom-scrollbar pr-4">
                {slots.map((slot, index) => {
                    const m1 = getMember(slot.ministerId);
                    const m2 = getMember(slot.minister2Id);
                    
                    return (
                        <div 
                            key={slot.id}
                            className="group flex flex-col gap-6 p-8 bg-surface-container/30 backdrop-blur-2xl rounded-3xl hover:bg-surface-bright/20 transition-all duration-700 relative overflow-hidden ring-1 ring-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
                        >
                            {/* High-Chroma Gradient Highlight */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-primary to-primary-container opacity-20 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex items-center justify-between relative z-10 gap-12">
                                {/* Time & Day Module */}
                                <div className="flex items-center gap-8 min-w-[280px]">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary font-bold shadow-lg ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                                        <Clock size={32} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span 
                                            className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant font-black opacity-40"
                                            style={{ fontFamily: fonts?.secondary || 'Inter' }}
                                        >
                                            INICIO PROGRAMADO
                                        </span>
                                        <span 
                                            className="text-4xl font-light text-on-surface"
                                            style={{ fontFamily: fonts?.primary || 'Manrope' }}
                                        >
                                            {slot.time}
                                        </span>
                                    </div>
                                </div>

                                {/* Service Identity Module */}
                                <div className="flex-1">
                                    <span 
                                        className="text-3xl font-light text-on-surface leading-tight transition-all duration-500 group-hover:text-primary tracking-tight"
                                        style={{ fontFamily: fonts?.primary || 'Manrope' }}
                                    >
                                        {slot.title}
                                    </span>
                                    <div className="flex items-center gap-8 mt-3">
                                        <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
                                            <MapPin size={16} className="text-secondary" />
                                            SANTUARIO PRINCIPAL
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
                                            <Sunrise size={16} className="text-primary" />
                                            {getServiceTypeLabel(slot.type, settings?.language)}
                                        </div>
                                    </div>
                                </div>

                                {/* Ministers Module */}
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-4">
                                        {[m1, m2].filter(Boolean).map((m: any, idx) => (
                                            <div key={idx} className="relative group/avatar">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-surface shadow-2xl relative transition-transform duration-500 group-hover/avatar:scale-110">
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
                                        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-1 opacity-60">
                                            RESPONSABLES
                                        </span>
                                        <span className="text-lg font-bold text-on-surface truncate" style={{ fontFamily: fonts?.primary }}>
                                            {m1?.name || (m2 ? '' : 'PENDIENTE')}
                                            {m1 && m2 && ' / '}
                                            {m2?.name}
                                        </span>
                                        <span className="text-xs text-on-surface-variant opacity-60 font-medium">
                                            {m1 ? m1.group || 'MINISTERIO' : ''}
                                        </span>
                                    </div>
                                </div>

                                {/* Interactive Indicator */}
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-[1px] bg-white/5" />
                                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
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

            {/* Atmospheric Observatory Detail - Soft diffused light */}
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
        </div>
    );
};

export default LunaPremiumSchedule;
