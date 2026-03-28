import React, { useState, useEffect } from 'react';
import { Clock, Cloud, Sun, CloudRain, CloudLightning, Thermometer, MapPin, Radio } from 'lucide-react';
import { format, parseISO } from 'date-fns';
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
    
    // Mock weather data - in a real app, this would come from an API
    const [weather] = useState({
        temp: 24,
        condition: 'Clear',
        city: 'Rodeo',
        icon: Sun
    });

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isDark = settings.themeMode === 'dark';

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

            if (slotId === '9am' && isSunToday) {
                if (slot?.time === '09:00 AM' || !slot?.time) start = 600; // 10:00 AM
                if (slot?.endTime === '10:00 AM' || !slot?.endTime) end = 720; // 12:00 PM
            }
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
            "flex items-center gap-6 px-6 py-2 rounded-2xl transition-all duration-500",
            !compact && "bg-white/5 border border-white/10 backdrop-blur-md shadow-xl",
            className
        )}>
            {/* Live Session Indicator */}
            <AnimatePresence>
                {activeSession && (
                    <Link href="/display" target="_blank">
                        <motion.div 
                            initial={{ opacity: 0, x: -10, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.8 }}
                            className="flex items-center gap-2 pr-6 border-r border-white/10 group cursor-pointer"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">VIVO</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5 group-hover:text-primary transition-colors">
                                    {activeSession.label}
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                )}
            </AnimatePresence>

            {/* Clock Section */}
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                <div className={cn(
                    "p-2 rounded-xl bg-primary/10 border border-primary/20",
                    isDark ? "text-primary" : "text-primary-dark"
                )}>
                    <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-black tracking-tighter tabular-nums leading-none">
                        {format(time, 'HH:mm:ss')}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                        {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                    </span>
                </div>
            </div>

            {/* Weather Section */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <weather.icon className="w-4 h-4 animation-pulse" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black tracking-tighter tabular-nums leading-none">
                            {settings.weatherUnit === 'fahrenheit' ? Math.round(weather.temp * 1.8 + 32) : weather.temp}°
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">
                            {settings.weatherUnit === 'fahrenheit' ? 'F' : 'C'}
                        </span>
                    </div>
                    {showLocation && (
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {weather.city}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminClockWeather;
