'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Activity, User, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SlotData {
    time: string;
    leaderName: string;
    type?: string;
    language?: string;
}

interface DaySchedule {
    date: Date;
    slots: {
        '5am'?: SlotData;
        '9am'?: SlotData;
        'evening'?: SlotData;
    };
}

export default function AgendaSantidad({ schedule }: { schedule: DaySchedule[] }) {
    const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());
    
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* --- SELECTOR DE DÍA (HORIZONTAL TACTILE) --- */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {weekDays.map((day) => {
                    const isSelected = isSameDay(day, selectedDay);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex-shrink-0 w-24 h-28 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group",
                                isSelected 
                                    ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.1)]" 
                                    : "bg-white/[0.02] border-white/5 hover:border-white/20"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                            )}
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                isSelected ? "text-emerald-500" : "text-white/20"
                            )}>
                                {format(day, 'EEE', { locale: es })}
                            </span>
                            <span className={cn(
                                "text-2xl font-black italic",
                                isSelected ? "text-white" : "text-white/40"
                            )}>
                                {format(day, 'd')}
                            </span>
                            {isToday && (
                                <div className="mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[6px] font-black uppercase tracking-[0.2em]">Hoy</div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* --- DETALLE DE TURNOS (CENTRO DE MANDO) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {[
                    { id: '5am', label: 'Primicias', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/5', time: '05:00 AM' },
                    { id: '9am', label: 'Consagración', icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/5', time: '09:00 AM' },
                    { id: 'evening', label: 'Servicio Noche', icon: Activity, color: 'text-pink-400', bg: 'bg-pink-500/5', time: '07:00 PM' }
                ].map((slot) => {
                    const dayData = schedule.find(d => isSameDay(d.date, selectedDay));
                    const data = dayData?.slots[slot.id as keyof typeof dayData.slots];

                    return (
                        <div key={slot.id} className="tactile-card flex flex-col p-6 h-full border-white/5 hover:border-white/10 group transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className={cn("p-3 rounded-2xl", slot.bg)}>
                                    <slot.icon className={cn("w-5 h-5", slot.color)} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{slot.time}</span>
                            </div>
                            
                            <div className="flex-1">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 italic">{slot.label}</h4>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/5 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white/20" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black italic uppercase italic tracking-tight text-white group-hover:text-primary transition-colors">
                                            {data?.leaderName || 'SIN ENCARGADO'}
                                        </p>
                                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Responsable de Gracia</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Instrucción</span>
                                        <span className="text-[9px] font-bold text-white/60 uppercase">{data?.type || 'REGULAR'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Idioma</span>
                                        <span className="text-[9px] font-bold text-white/60 uppercase">{data?.language || 'ESPAÑOL'}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/[0.06] hover:text-white transition-all">
                                Gestionar Turno
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
