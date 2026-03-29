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
    const isDark = settings.themeMode === 'dark';

    // Mock weather data
    const [weather] = useState({
        temp: 24,
        condition: 'Despejado',
        city: 'Rodeo',
        icon: Sun,
        forecast: [
            { day: 'Dom', temp: 26, icon: Sun, condition: 'Soleado' },
            { day: 'Lun', temp: 22, icon: Cloud, condition: 'Nublado' },
            { day: 'Mar', temp: 19, icon: CloudRain, condition: 'Lluvia' },
            { day: 'Mié', temp: 21, icon: Cloud, condition: 'Parcial' },
            { day: 'Jue', temp: 25, icon: Sun, condition: 'Soleado' },
        ]
    });

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
            "flex flex-col gap-4 p-6 rounded-3xl transition-all duration-500 group/weather",
            !compact && "bg-[var(--tactile-card-bg)] border border-[var(--tactile-border)] backdrop-blur-md shadow-xl",
            className
        )}>
            <div className="flex items-center justify-between gap-8">
                {/* Clock Section */}
                <div className="flex items-center gap-4 border-r border-[var(--tactile-border)] pr-8">
                    <div className={cn(
                        "p-3 rounded-2xl bg-primary/10 border border-primary/20",
                        isDark ? "text-primary" : "text-primary-dark"
                    )}>
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter tabular-nums leading-none">
                            {format(time, 'HH:mm')}
                            <span className="text-sm opacity-40 ml-1">{format(time, 'ss')}</span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--tactile-text-sub)] mt-1.5">
                            {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                    </div>
                </div>

                {/* Main Weather Section */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 group-hover/weather:scale-110 transition-transform duration-500">
                        <weather.icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tighter tabular-nums leading-none">
                                {settings.weatherUnit === 'fahrenheit' ? Math.round(weather.temp * 1.8 + 32) : weather.temp}°
                            </span>
                            <span className="text-xs font-black text-[var(--tactile-text-sub)] uppercase">
                                {settings.weatherUnit === 'fahrenheit' ? 'F' : 'C'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)] mt-1.5">
                            <MapPin className="w-3 h-3 text-primary" />
                            {weather.city} • {weather.condition}
                        </div>
                    </div>
                </div>

                {/* Live Indicator (Optional compact version) */}
                <AnimatePresence>
                    {activeSession && (
                        <Link href="/display" target="_blank">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 cursor-pointer group/live"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">VIVO: {activeSession.label}</span>
                            </motion.div>
                        </Link>
                    )}
                </AnimatePresence>
            </div>

            {/* 5-Day Forecast Grid */}
            <div className="grid grid-cols-5 gap-3 pt-4 border-t border-[var(--tactile-border)]">
                {weather.forecast.map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] hover:border-primary/30 transition-all group/day cursor-help">
                        <span className="text-[9px] font-black text-[var(--tactile-text-sub)] uppercase tracking-widest">{f.day}</span>
                        <f.icon className="w-4 h-4 text-amber-500/70 group-hover/day:scale-125 transition-transform" />
                        <span className="text-sm font-black tracking-tighter">{f.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminClockWeather;
