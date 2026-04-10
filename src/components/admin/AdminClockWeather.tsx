import React, { useState, useEffect } from 'react';
import { Clock, Search, Cloud, Sun, CloudRain, MapPin, Radio } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface AdminClockWeatherProps {
    className?: string;
    showLocation?: boolean;
    compact?: boolean;
}

const AdminClockWeather: React.FC<AdminClockWeatherProps> = ({ 
    className, 
    showLocation = true,
    compact = false 
}) => {
    const [time, setTime] = useState(new Date());
    const { settings, monthlySchedule, currentDate } = useAppStore();
    const isDark = settings.themeMode === 'dark';

// Animated Weather Icons using Framer Motion + Lucide
const AnimatedSun = ({ className }: { className?: string }) => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={className}
    >
        <Sun className="w-full h-full text-yellow-400" />
    </motion.div>
);

const AnimatedCloud = ({ className }: { className?: string }) => (
    <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={className}
    >
        <Cloud className="w-full h-full text-slate-300" />
    </motion.div>
);

const AnimatedRain = ({ className }: { className?: string }) => (
    <motion.div
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={className}
    >
        <CloudRain className="w-full h-full text-blue-400" />
    </motion.div>
);

// Map WMO Weather Codes to our Animated Icons and Text
const getWeatherInfo = (code: number) => {
    if (code === 0) return { icon: AnimatedSun, condition: 'Despejado' };
    if (code >= 1 && code <= 3) return { icon: AnimatedCloud, condition: 'Nublado' };
    if (code >= 45 && code <= 48) return { icon: AnimatedCloud, condition: 'Niebla' };
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { icon: AnimatedRain, condition: 'Lluvia' };
    if (code >= 71 && code <= 77) return { icon: AnimatedCloud, condition: 'Nieve' }; // using cloud as fallback for snow if Snowflake not imported
    if (code >= 95) return { icon: AnimatedRain, condition: 'Tormenta' };
    return { icon: AnimatedSun, condition: 'Parcial' }; // fallback
};

// ... inside your component
    // Dynamic weather data from Open-Meteo for Rodeo, CA
    const [weather, setWeather] = useState<{
        temp: number;
        condition: string;
        city: string;
        icon: any;
        forecast: any[];
    } | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Rodeo CA coords: 38.033, -122.267
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.033&longitude=-122.267&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=America%2FLos_Angeles');
                const data = await res.json();
                
                const currInfo = getWeatherInfo(data.current.weather_code);
                
                // create forecast array, skipping today (index 0) if you want next 5 days
                const forecast = [];
                for (let i = 1; i <= 5; i++) {
                    const code = data.daily.weather_code[i];
                    const tempMax = Math.round(data.daily.temperature_2m_max[i]);
                    const timeStr = data.daily.time[i]; // "YYYY-MM-DD"
                    const [y, m, d] = timeStr.split('-');
                    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
                    
                    forecast.push({
                        day: format(dateObj, 'eee', { locale: es }),
                        temp: tempMax,
                        ...getWeatherInfo(code)
                    });
                }
                
                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    condition: currInfo.condition,
                    city: 'Rodeo, CA',
                    icon: currInfo.icon,
                    forecast
                });
            } catch (err) {
                console.error("Failed to fetch weather:", err);
            }
        };

        fetchWeather();
        // Refresh weather every 15 mins
        const interval = setInterval(fetchWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Live Session Detection Logic
    const parseTimeStr = (t?: string) => {
        if (!t) return null;
        const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!match) return null;
        let [_, hStr, mStr, period] = match;
        let h = parseInt(hStr, 10);
        let m = parseInt(mStr, 10);
        if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
        if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    };

    const getActiveSession = () => {
        const curMin = time.getHours() * 60 + time.getMinutes();
        const sched = monthlySchedule[currentDate];
        if (!sched) return null;
        const isSunToday = time.getDay() === 0;
        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunToday ? '10:00' : '09:00', end: isSunToday ? '12:00' : '10:15' },
            'evening': { start: '18:30', end: '20:30' },
        };
        const checkActive = (slotId: '5am' | '9am' | 'evening') => {
            const slot = (sched?.slots as any)?.[slotId];
            let start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
            let end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;
            return curMin >= start && curMin <= end;
        };
        if (checkActive('9am')) return { id: '9am', label: isSunToday ? 'Dominical' : 'Oración' };
        if (checkActive('evening')) return { id: 'evening', label: 'Servicio' };
        if (checkActive('5am')) return { id: '5am', label: 'Oración 5AM' };
        return null;
    };

    const activeSession = getActiveSession();

    return (
        <div className={cn(
            "flex items-center gap-6 p-4 transition-all duration-500 group/weather shadow-none border-none bg-transparent",
            !compact ? "bg-[var(--tactile-card-bg)] border border-[var(--tactile-border)] backdrop-blur-md shadow-xl p-6 rounded-md" : "p-0",
            className
        )}>
            {/* Searcher Section - HIDDEN ON MOBILE/TABLET */}
            <div className="relative group/search hidden xl:flex flex-1 min-w-[200px] max-w-[280px]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within/search:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className={cn(
                        "w-full h-11 pl-11 pr-4 rounded-md transition-all text-xs font-bold tracking-tight focus:outline-none",
                        isDark 
                            ? "bg-white/[0.03] border-white/[0.05] focus:bg-white/[0.06] focus:border-emerald-500/30 text-white placeholder:text-muted-foreground/20" 
                            : "bg-white/40 border-black/[0.05] focus:bg-white focus:border-emerald-500/30 text-slate-900 placeholder:text-slate-400 shadow-sm"
                    )}
                />
            </div>

            {/* Clock Section */}
            <div className={cn("flex items-center gap-4 pr-6 shrink-0 border-r", isDark ? "border-white/5" : "border-black/5")}>
                <div className={cn(
                    "p-2.5 rounded-md bg-primary/10 border border-primary/20",
                    isDark ? "text-primary" : "text-primary-dark"
                )}>
                    <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter tabular-nums leading-none">
                        {format(time, 'HH:mm')}
                        <span className={cn("text-[10px] ml-1", isDark ? "opacity-40" : "opacity-60")}>{format(time, 'ss')}</span>
                    </span>
                    <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] mt-1", isDark ? "text-muted-foreground opacity-60" : "text-slate-600 opacity-90")}>
                        {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                    </span>
                </div>
            </div>

            {/* Main Weather Section */}
            {weather ? (
                <div className={cn("flex items-center gap-4 pr-6 shrink-0 border-r", isDark ? "border-white/5" : "border-black/5")}>
                    <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 group-hover/weather:scale-110 transition-transform duration-500">
                        <weather.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-xl font-black tracking-tighter tabular-nums">
                                {settings.weatherUnit === 'fahrenheit' ? Math.round(weather.temp * 1.8 + 32) : weather.temp}°
                            </span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase">
                                {settings.weatherUnit === 'fahrenheit' ? 'F' : 'C'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">
                            {weather.city} • {weather.condition}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cn("flex items-center gap-4 pr-6 shrink-0 border-r animate-pulse", isDark ? "border-white/5" : "border-black/5")}>
                    <div className="w-10 h-10 rounded-md bg-emerald-500/10 border border-emerald-500/20" />
                    <div className="flex flex-col gap-2">
                        <div className="w-10 h-5 bg-emerald-500/10 rounded" />
                        <div className="w-16 h-2 bg-emerald-500/5 rounded" />
                    </div>
                </div>
            )}

            {/* 5-Day Forecast - HIDDEN ON MOBILE/TABLET */}
            <div className="hidden 2xl:flex items-center gap-2.5">
                {weather?.forecast.map((f: any, i: number) => (
                    <div 
                        key={i} 
                        className={cn(
                            "flex items-center gap-3 p-1.5 px-3 rounded-md transition-all group/day cursor-help min-w-[70px] border",
                            isDark 
                                ? "bg-white/[0.03] border-white/[0.05] hover:border-emerald-500/30 hover:bg-white/[0.06]" 
                                : "bg-white/40 border-black/[0.05] hover:border-emerald-500/30 hover:bg-white/60 shadow-sm"
                        )}
                    >
                        <div className="flex flex-col items-start leading-none gap-1">
                            <span className={cn("text-[7px] font-black uppercase tracking-[0.15em] leading-none", isDark ? "text-muted-foreground" : "text-slate-600")}>{f.day}</span>
                            <span className="text-[11px] font-black tracking-tighter text-foreground tabular-nums leading-none">
                                {settings.weatherUnit === 'fahrenheit' ? Math.round(f.temp * 1.8 + 32) : f.temp}°
                            </span>
                        </div>
                        <f.icon className="w-3.5 h-3.5 text-emerald-500/60" />
                    </div>
                ))}
            </div>

            {/* Live Indicator */}
            <AnimatePresence>
                {activeSession && (
                    <Link href="/display" target="_blank" className="ml-2">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 cursor-pointer group/live whitespace-nowrap"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] leading-none">{activeSession.label}</span>
                        </motion.div>
                    </Link>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClockWeather;
