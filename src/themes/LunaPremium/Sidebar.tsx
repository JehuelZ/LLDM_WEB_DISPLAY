'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
    Cloud, 
    Sun, 
    CloudRain, 
    CloudLightning, 
    CloudSnow, 
    Wind,
    Thermometer,
    Church
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

const WeatherIcon = ({ code, className }: { code: string; className?: string }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} />;
    if (c >= 45 && c <= 48) return <Cloud className={className} />; 
    if (c >= 51 && c <= 65) return <CloudRain className={className} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} />;
    if (c === 95) return <CloudLightning className={className} />;
    return <Cloud className={className} />;
};

const Sidebar: React.FC = () => {
    const { settings } = useAppStore();
    const [now, setNow] = useState(new Date());
    
    // Update local time for clock
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Weather Data
    const { weather } = useWeather(
        settings?.weatherLat ?? 34.0522, 
        settings?.weatherLng ?? -118.2437,
        settings?.weatherUnit ?? 'fahrenheit'
    );

    const formattedTime = format(now, 'h:mm');
    const ampm = format(now, 'a').toLowerCase();
    const dayName = format(now, 'EEEE', { locale: es }).toLowerCase();
    const fullDate = format(now, 'd MMMM', { locale: es }).toLowerCase();

    return (
        <motion.aside 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed inset-y-0 left-0 w-[220px] h-full flex flex-col bg-white/[0.03] backdrop-blur-3xl border-r border-white/5 p-6 py-12 z-[50]"
            style={{ fontFamily: "'Saira', sans-serif" }}
        >
            {/* Subtle vertical glow edge */}
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* 1. LOGO ARRIBA */}
            <div className="flex flex-col items-center mb-16">
                <div className="w-16 h-16 rounded-[2rem] bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group transition-all duration-700 hover:scale-110">
                    {settings?.churchAvatar ? (
                        <img src={settings.churchAvatar} className="w-10 h-10 object-contain brightness-0 invert opacity-60" alt="Logo" />
                    ) : (
                        <Church className="w-8 h-8 text-white/20" />
                    )}
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 mt-4 lowercase">
                    {settings?.churchShortName || 'r o d e o'}
                </span>
            </div>

            {/* 2. CLIMA SIGUIENTE (Central) */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2 mb-10">
                    <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                        <WeatherIcon code={weather?.icon || "0"} className="w-10 h-10 text-white/80" />
                    </div>
                    <span className="text-5xl font-[100] tracking-tighter leading-none">
                        {weather?.temp ?? '--'}°
                    </span>
                    <span className="text-[10px] font-light text-white/30 lowercase tracking-[0.2em] text-center px-4">
                        {weather?.condition || 'cargando...'}
                    </span>
                </div>

                {/* Vertical Forecast Line */}
                <div className="flex flex-col gap-4">
                    {weather?.forecast.slice(1, 4).map((f, i) => (
                        <div key={i} className="flex flex-col items-center opacity-40">
                            <span className="text-[9px] font-bold text-white/40 lowercase mb-1">
                                {format(new Date(f.date + 'T12:00:00'), 'eee', { locale: es }).slice(0, 2)}
                            </span>
                            <span className="text-sm font-[100]">
                                {f.temp}°
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. ABAJO HORA */}
            <div className="mt-auto pt-10 border-t border-white/5 flex flex-col items-center">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-[200] tracking-tighter leading-none">
                        {formattedTime}
                    </span>
                    <span className="text-xs font-bold text-white/20 uppercase">
                        {ampm}
                    </span>
                </div>
                <div className="flex flex-col items-center opacity-40">
                    <span className="text-[10px] font-bold tracking-widest lowercase">
                        {dayName}
                    </span>
                    <span className="text-[10px] font-light lowercase">
                        {fullDate}
                    </span>
                </div>
            </div>
            
            {/* Force Load Saira Font */}
            <link 
                href="https://fonts.googleapis.com/css2?family=Saira:wght@100;200;300;400;900&display=swap" 
                rel="stylesheet" 
            />
        </motion.aside>
    );
};

export default Sidebar;
