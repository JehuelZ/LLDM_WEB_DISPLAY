'use client';

import React from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

interface ScheduleProps {
    data: any;
}

const LunaPremiumSchedule: React.FC<ScheduleProps> = ({ data }) => {
    const { fonts } = useFont();

    if (!data || !data.items) {
        return (
            <div className="flex items-center justify-center h-full text-on-surface-variant font-light tracking-widest opacity-40 uppercase text-xs">
                Sincronizando Datos del Observatorio...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full h-full animate-in fade-in zoom-in-95 duration-1400">
            {/* High-Tech Section Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high/60 backdrop-blur-xl rounded-2xl border-l-[4px] border-primary shadow-[0_24px_48px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col">
                    <span 
                        className="text-2xl font-light text-on-surface tracking-tight"
                        style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif' }}
                    >
                        Distribución Semanal de Asistencia
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mt-1 opacity-80">
                        ANALYTICS ENGINE V3.0
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Estado</span>
                        <span className="text-sm font-medium text-secondary flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            ACTIVO
                        </span>
                    </div>
                </div>
            </div>

            {/* Kinetic Table - No Lines Rule */}
            <div className="flex flex-col gap-3 px-2 overflow-y-auto custom-scrollbar pr-4">
                {data.items.slice(0, 7).map((item: any, index: number) => (
                    <div 
                        key={index}
                        className="group flex flex-col gap-4 p-5 bg-surface-container/60 backdrop-blur-xl rounded-2xl hover:bg-surface-bright transition-all duration-500 relative overflow-hidden ring-1 ring-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    >
                        {/* High-Chroma Gradient Highlight */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        
                        <div className="flex items-center justify-between relative z-10">
                            {/* Time & Day Module */}
                            <div className="flex items-center gap-6 min-w-[200px]">
                                <div className="p-3 bg-surface-container-high rounded-xl text-primary font-bold shadow-md shadow-black/20">
                                    <Clock size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span 
                                        className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-medium opacity-60"
                                        style={{ fontFamily: fonts?.secondary || 'Inter' }}
                                    >
                                        Inicia a las
                                    </span>
                                    <span 
                                        className="text-xl font-medium text-on-surface"
                                        style={{ fontFamily: fonts?.primary || 'Manrope' }}
                                    >
                                        {item.time || '18:00'}
                                    </span>
                                </div>
                            </div>

                            {/* Service Identity Module */}
                            <div className="flex-1 px-8">
                                <span 
                                    className="text-lg font-light text-on-surface leading-tight transition-all duration-300 group-hover:text-primary tracking-tight"
                                    style={{ fontFamily: fonts?.primary || 'Manrope' }}
                                >
                                    {item.title || 'Servicio de Oración'}
                                </span>
                                <div className="flex items-center gap-4 mt-1 opacity-60">
                                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-on-surface-variant">
                                        <MapPin size={12} className="text-secondary" />
                                        {item.location || 'Santuario Principal'}
                                    </div>
                                    <div className="text-[10px] text-on-surface-variant/40">•</div>
                                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-on-surface-variant">
                                        <User size={12} className="text-primary" />
                                        {item.minister || 'Ministerio Local'}
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Segment Indicator */}
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-[2px] bg-on-surface-variant opacity-10" />
                                <ChevronRight 
                                    size={20} 
                                    className="text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" 
                                />
                            </div>
                        </div>

                        {/* Kinetic Progress Layer (Bar Chart Gradient) */}
                        <div className="w-full h-[3px] bg-surface-container-highest/20 rounded-full overflow-hidden mt-1 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                             <div 
                                className="h-full bg-gradient-to-r from-primary to-primary-container shadow-[0_0_8px_rgba(255,164,76,0.3)] transition-all duration-1000 ease-out delay-300"
                                style={{ width: index % 2 === 0 ? '75%' : '88%' }}
                             />
                        </div>
                    </div>
                ))}
            </div>

            {/* Atmospheric Observatory Detail - Soft diffused light */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default LunaPremiumSchedule;
