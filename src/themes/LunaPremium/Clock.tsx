'use client';

import React, { useState, useEffect } from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { useWeather } from '@/hooks/useWeather';
import { useAppStore } from '@/lib/store';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, Sunrise, MapPin } from 'lucide-react';

interface ClockProps {
    isVertical?: boolean;
    now?: Date;
    settings?: any;
}

const WeatherIcon = ({ code, className, size = 20 }: { code: string, className?: string, size?: number }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} size={size} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} size={size} />;
    if (c >= 45 && c <= 48) return <CloudFog className={className} size={size} />;
    if (c >= 51 && c <= 55) return <CloudDrizzle className={className} size={size} />;
    if (c >= 61 && c <= 65) return <CloudRain className={className} size={size} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} size={size} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} size={size} />;
    if (c === 95) return <CloudLightning className={className} size={size} />;
    return <Sun className={className} size={size} />;
};

const Clock: React.FC<ClockProps> = ({ isVertical, now: externalNow, settings: externalSettings }) => {
    const [time, setTime] = useState(externalNow || new Date());
    const { fonts } = useFont();
    const storeSettings = useAppStore((state) => state.settings);
    const settings = externalSettings || storeSettings;
    
    const unit = settings?.weatherUnit || 'fahrenheit';
    const isCelsius = unit === 'celsius';

    // Weather Fetching
    const { weather } = useWeather(
        settings?.neonForgeCityData?.lat || 34.0522,
        settings?.neonForgeCityData?.lon || -118.2437,
        unit
    );

    useEffect(() => {
        if (!externalNow) {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        } else {
            setTime(externalNow);
        }
    }, [externalNow]);

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return { display: `${formattedHours}:${formattedMinutes}`, ampm };
    };

    const { display, ampm } = formatTime(time);
    const day = time.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const fullDate = time.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toLowerCase();

    return (
        <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-[100] pointer-events-none">
            {/* Left side: Branding & Weather */}
            <div className="flex flex-col gap-4 pointer-events-auto">
                <div className="flex items-center gap-4 bg-surface-container/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                         {settings?.churchAvatar ? (
                             <img src={settings.churchAvatar} className="w-8 h-8 object-contain" alt="Logo" />
                         ) : (
                             <span className="text-primary font-black text-xl">L</span>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-on-surface tracking-tight" style={{ fontFamily: fonts?.primary }}>
                            {settings?.churchName || 'LLDM Rodeo'}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-60 font-bold">
                            {settings?.churchAddress || 'CONGREGATION HUB'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-container/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 shadow-2xl w-fit">
                    <div className="text-primary">
                        {weather ? (
                            <WeatherIcon code={weather.icon} size={24} />
                        ) : (
                            <Sunrise size={24} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-light text-on-surface" style={{ fontFamily: fonts?.primary }}>
                            {weather ? `${weather.temp}°` : '--°'}
                            <span className="text-xs ml-1 opacity-60 uppercase">{isCelsius ? 'C' : 'F'}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-60 font-bold flex items-center gap-1">
                            <MapPin size={10} />
                            {settings?.neonForgeCityData?.name || 'Rodeo'}
                        </span>
                    </div>
                    {weather?.forecast && (
                         <div className="flex gap-4 ml-4 pl-4 border-l border-white/10">
                             {weather.forecast.slice(1, 3).map((f, i) => (
                                 <div key={i} className="flex flex-col items-center">
                                     <WeatherIcon code={f.icon} size={14} className="opacity-60" />
                                     <span className="text-xs font-bold text-on-surface-variant">{f.temp}°</span>
                                 </div>
                             ))}
                         </div>
                    )}
                </div>
            </div>

            {/* Right side: Time */}
            <div className={`flex flex-col ${isVertical ? 'items-center text-center' : 'items-end'} gap-0 select-none pointer-events-auto`}>
                <div className="flex items-baseline gap-3">
                    <span 
                        className="text-8xl font-light tracking-tighter text-on-surface drop-shadow-[0_0_20px_rgba(255,164,76,0.15)]"
                        style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif', letterSpacing: '-0.04em' }}
                    >
                        {display}
                    </span>
                    <span 
                        className="text-2xl font-medium uppercase text-primary tracking-[0.2em]"
                        style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                    >
                        {ampm}
                    </span>
                </div>
                
                <div className="flex flex-col items-end mt-[-0.5rem]">
                    <span 
                        className="text-xl font-medium text-on-surface tracking-wide capitalize"
                        style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                    >
                        {day}
                    </span>
                    <span 
                        className="text-sm font-light text-on-surface-variant opacity-60 uppercase tracking-[0.3em] font-bold"
                        style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                    >
                        {fullDate}
                    </span>
                </div>

                <div className="w-12 h-[2px] bg-primary mt-4 shadow-[0_0_15px_#ffa44c]" />
            </div>
        </div>
    );
};

export default Clock;
