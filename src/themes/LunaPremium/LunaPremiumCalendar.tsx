'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cloud, 
    Sun, 
    CloudRain, 
    CloudLightning, 
    CloudSnow, 
    Wind,
    Thermometer,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { getChurchNow } from '@/lib/time';

// ─────────────────────────────────────────────
// LUNA PREMIUM THEME: CALENDAR SLIDE
// Aesthetic: Strict Lowercase, font-300, Saira
// Layout: Vertical Weather Column (Left)
// ─────────────────────────────────────────────

const WeatherIcon = ({ code, className }: { code: string; className?: string }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} />;
    if (c >= 51 && c <= 65) return <CloudRain className={className} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} />;
    if (c === 95) return <CloudLightning className={className} />;
    return <Cloud className={className} />;
};

const LunaPremiumCalendar: React.FC = () => {
    const { monthlySchedule, settings } = useAppStore();
    const churchNow = getChurchNow(settings);
    
    // Weather Data
    const { weather, loading: weatherLoading } = useWeather(
        settings?.weatherLat ?? 34.0522, 
        settings?.weatherLng ?? -118.2437,
        settings?.weatherUnit ?? 'fahrenheit'
    );

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
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex w-full h-full bg-transparent text-white font-[300] selection:bg-white selection:text-black overflow-hidden" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* 1. LEFT COLUMN: WEATHER (Top to Bottom) */}
            <motion.aside 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-[380px] h-full flex flex-col bg-white/[0.04] backdrop-blur-3xl border-r border-white/5 p-10 pt-24 z-20 relative"
            >
                {/* Subtle vertical glow */}
                <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Current Weather Section */}
                <div className="flex flex-col mb-16">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-8 lowercase">
                        clima actual
                    </span>
                    
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                            <WeatherIcon code={weather?.icon || "0"} className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-7xl font-[100] tracking-tighter leading-none">
                                {weather?.temp ?? '--'}°
                            </span>
                            <span className="text-[12px] font-light mt-2 text-white/50 lowercase tracking-widest">
                                {weather?.condition || 'cargando...'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Forecast List */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-2 lowercase">
                        pronóstico semanal
                    </span>

                    <div className="flex flex-col gap-4">
                        {weather?.forecast.slice(1, 6).map((f, i) => (
                            <motion.div 
                                key={f.date}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (i * 0.1) }}
                                className="flex items-center justify-between p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-bold text-white/40 w-10 lowercase tracking-widest">
                                        {format(new Date(f.date + 'T12:00:00'), 'eee', { locale: es })}
                                    </span>
                                    <WeatherIcon code={f.icon} className="w-4 h-4 text-white/60" />
                                </div>
                                <span className="text-xl font-[200]">
                                    {f.temp}°
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-auto py-8 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between opacity-30">
                        <span className="text-[9px] uppercase tracking-widest lowercase">viento</span>
                        <Wind className="w-3 h-3" />
                    </div>
                    <div className="flex items-center justify-between opacity-30">
                        <span className="text-[9px] uppercase tracking-widest lowercase">humedad</span>
                        <Thermometer className="w-3 h-3" />
                    </div>
                </div>
            </motion.aside>

            {/* 2. MAIN CONTENT: CALENDAR */}
            <main className="flex-1 h-full flex flex-col p-20 pt-32 z-10 relative">
                {/* Header */}
                <header className="flex flex-col mb-16">
                    <div className="flex items-baseline gap-4 mb-2">
                        <h1 className="text-6xl font-[200] tracking-tighter lowercase leading-none">
                            {format(churchNow, 'MMMM', { locale: es })}
                        </h1>
                        <span className="text-2xl font-[100] text-white/30 lowercase">
                            {format(churchNow, 'yyyy')}
                        </span>
                    </div>
                    <div className="h-[1px] w-40 bg-gradient-to-r from-white/40 to-transparent mt-4" />
                </header>

                {/* Calendar Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-7 gap-5 flex-1"
                >
                    {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold tracking-[0.4em] text-white/20 pb-6 lowercase">
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
                                className={`aspect-square rounded-full border flex flex-col items-center justify-center gap-1 transition-all duration-700 relative group overflow-hidden ${
                                    active 
                                    ? 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.2)] z-10' 
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
                                }`}
                            >
                                <span className={`text-3xl font-[100] tracking-tighter ${active ? 'text-black' : 'text-white'}`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {hasData && !active && (
                                    <div className="absolute bottom-4 flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,1)]" />
                                    </div>
                                )}

                                {active && (
                                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Legend or Stats */}
                <footer className="mt-12 flex items-center gap-10 opacity-20">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full border border-white" />
                        <span className="text-[10px] tracking-[0.2em] font-bold lowercase">actividad programada</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="text-[10px] tracking-[0.2em] font-bold lowercase">hoy</span>
                     </div>
                </footer>
            </main>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/[0.02] blur-[140px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/[0.01] blur-[160px] rounded-full" />
                
                {/* Thin lines texture */}
                <div className="absolute inset-0 opacity-[0.02]" 
                     style={{ 
                         backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', 
                         backgroundSize: '40px 40px' 
                     }} />
            </div>

            {/* Force Load Saira Font */}
            <link 
                href="https://fonts.googleapis.com/css2?family=Saira:wght@100;200;300;400;900&display=swap" 
                rel="stylesheet" 
            />
        </div>
    );
};

export default LunaPremiumCalendar;
