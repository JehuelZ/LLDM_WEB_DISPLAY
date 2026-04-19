'use client';

import React from 'react';
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
    Thermometer
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

const WeatherIcon = ({ code, className }: { code: string; className?: string }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} />;
    if (c >= 45 && c <= 48) return <Cloud className={className} />; // Fog
    if (c >= 51 && c <= 65) return <CloudRain className={className} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} />;
    if (c === 95) return <CloudLightning className={className} />;
    return <Cloud className={className} />;
};

const Sidebar: React.FC = () => {
    const { settings } = useAppStore();
    
    // Weather Data
    const { weather } = useWeather(
        settings?.weatherLat ?? 34.0522, 
        settings?.weatherLng ?? -118.2437,
        settings?.weatherUnit ?? 'fahrenheit'
    );

    return (
        <motion.aside 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed inset-y-0 left-0 w-[220px] h-full flex flex-col bg-white/[0.03] backdrop-blur-3xl border-r border-white/5 p-6 pt-24 z-[50]"
            style={{ fontFamily: "'Saira', sans-serif" }}
        >
            {/* Subtle vertical glow edge */}
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Current Weather Section */}
            <div className="flex flex-col mb-12">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 lowercase">
                    clima actual
                </span>
                
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <WeatherIcon code={weather?.icon || "0"} className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-[100] tracking-tighter leading-none">
                            {weather?.temp ?? '--'}°
                        </span>
                        <span className="text-[10px] font-light mt-1 text-white/40 lowercase tracking-widest truncate max-w-[120px]">
                            {weather?.condition || 'cargando...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Forecast List - Thinner version */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 lowercase">
                    pronóstico
                </span>

                <div className="flex flex-col gap-3">
                    {weather?.forecast.slice(1, 6).map((f, i) => (
                        <motion.div 
                            key={f.date}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1) }}
                            className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-white/30 w-8 lowercase tracking-widest">
                                    {format(new Date(f.date + 'T12:00:00'), 'eee', { locale: es })}
                                </span>
                                <WeatherIcon code={f.icon} className="w-3.5 h-3.5 text-white/50" />
                            </div>
                            <span className="text-lg font-[200]">
                                {f.temp}°
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Stats - Minimized */}
            <div className="mt-auto py-6 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between opacity-20">
                    <span className="text-[8px] uppercase tracking-widest lowercase">viento</span>
                    <Wind className="w-2.5 h-2.5" />
                </div>
                <div className="flex items-center justify-between opacity-20">
                    <span className="text-[8px] uppercase tracking-widest lowercase">humedad</span>
                    <Thermometer className="w-2.5 h-2.5" />
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
