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
    Building2,
    MapPin
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

    // Weather Data from Admin Settings
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
            className="absolute inset-y-0 left-0 w-[420px] h-full flex flex-col bg-transparent p-16 py-20 z-[50]"
            style={{ fontFamily: "'Saira', sans-serif" }}
        >
            {/* Subtle vertical glow edge */}
            {/* No dividers between column and background */}

            {/* 1. LOGO ARRIBA */}
            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 rounded-sm bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group transition-all duration-700 hover:scale-110 p-2">
                    {settings?.churchLogoUrl || settings?.displayCustomBgUrl ? (
                        <img 
                            src={settings?.churchLogoUrl || settings?.displayCustomBgUrl} 
                            className="w-full h-full object-contain brightness-0 invert opacity-80" 
                            alt="logo" 
                        />
                    ) : (
                        <Building2 className="w-8 h-8 text-white/20" />
                    )}
                </div>
                <span className="text-[10px] font-[300] tracking-[0.4em] text-white/20 mt-4 lowercase truncate max-w-full px-2">
                    {settings?.churchShortName?.toLowerCase() || 'r o d e o'}
                </span>
            </div>

            {/* 2. CLIMA SIGUIENTE */}
            <div className="flex-1 flex flex-col overflow-hidden px-1">
                <div className="flex flex-col mb-8">
                    <span className="text-[9px] font-[300] tracking-[0.4em] text-white/10 mb-4 lowercase">
                        clima actual
                    </span>
                    <div className="flex items-center gap-8">
                        <div className="w-32 h-32 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <WeatherIcon code={weather?.icon || "0"} className="w-24 h-24 text-white/70" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-8xl font-[100] tracking-tighter leading-none mb-2">
                                {weather?.temp ?? '--'}°
                            </span>
                            <span className="text-[14px] font-[300] text-white/30 lowercase tracking-[0.2em] truncate max-w-[200px]">
                                {weather?.condition?.toLowerCase() || 'cargando...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-[300] tracking-[0.4em] text-white/10 mb-4 lowercase">
                        pronóstico
                    </span>
                    {weather?.forecast.slice(1, 6).map((f, i) => (
                        <motion.div 
                            key={f.date}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1) }}
                            className="flex items-center justify-between p-4 rounded-sm bg-white/[0.02] border border-white/5"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-[12px] font-[300] text-white/20 w-10 lowercase tracking-widest">
                                    {format(new Date(f.date + 'T12:00:00'), 'eee', { locale: es }).slice(0, 3).toLowerCase()}
                                </span>
                                <WeatherIcon code={f.icon} className="w-10 h-10 text-white/40" />
                            </div>
                            <span className="text-3xl font-[100]">
                                {f.temp}°
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 3. ABAJO HORA */}
            <div className="mt-auto pt-8 border-t border-white/5 flex flex-col items-center">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-[100] tracking-tighter leading-none">
                        {formattedTime}
                    </span>
                    <span className="text-xs font-[300] text-white/20 lowercase">
                        {ampm}
                    </span>
                </div>
                <div className="flex flex-col items-center opacity-40">
                    <span className="text-[10px] font-[300] tracking-widest lowercase leading-tight">
                        {dayName}
                    </span>
                    <span className="text-[10px] font-[300] lowercase">
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
