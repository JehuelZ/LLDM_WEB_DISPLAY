'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Thermometer } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWeather } from '@/hooks/useWeather';

export const WeatherForecast = () => {
    // Default to a generic location or use settings if available
    const { weather, loading } = useWeather(24.34, -104.28); // Durango / generic

    if (loading || !weather) return null;

    const getWeatherIcon = (code: string) => {
        const c = parseInt(code);
        if (c === 0 || c === 1) return <Sun className="text-yellow-400" />;
        if (c === 2 || c === 3) return <Cloud className="text-blue-300" />;
        if (c === 45 || c === 48) return <CloudFog className="text-gray-400" />;
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return <CloudRain className="text-blue-500" />;
        if (c === 95) return <CloudLightning className="text-purple-500" />;
        if ([71, 73, 75].includes(c)) return <Snowflake className="text-white" />;
        return <Sun className="text-yellow-400" />;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mt-8 px-4 py-3 rounded-3xl bg-[#0D1B3E]/40 border border-[#1E3A6E]/50 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
            <div className="flex items-center gap-3 px-4 border-r border-[#1E3A6E]/50 pr-6 mr-2">
                <div className="p-2 rounded-full bg-[#A3FF57]/10 border border-[#A3FF57]/20">
                    <Thermometer size={18} className="text-[#A3FF57]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#A3FF57] tracking-[0.2em] uppercase leading-none mb-1">PRONÓSTICO</span>
                    <span className="text-[14px] font-black text-white tracking-widest leading-none">5 DÍAS</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {weather.forecast.map((day, idx) => (
                    <motion.div 
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center gap-1.5"
                    >
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            {format(parseISO(day.date), 'EEE', { locale: es })}
                        </span>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-current blur-lg opacity-20 scale-150 transition-transform group-hover:scale-200" style={{ color: 'inherit' }} />
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center">
                                {getWeatherIcon(day.icon)}
                            </div>
                        </div>
                        <div className="flex items-start gap-0.5">
                            <span className="text-[15px] font-black text-white leading-none tracking-tighter">{day.temp}</span>
                            <span className="text-[8px] font-bold text-[#A3FF57] mt-0.5">°</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
