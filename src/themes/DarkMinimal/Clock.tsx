'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Flame, Church, Cross, Star, Heart, Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { parseISO } from 'date-fns';

export const DarkMinimalClock = ({ now, isMounted, settings }: { now: Date, isMounted: boolean, settings: any }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isMounted
        ? circumference - (now.getSeconds() / 60) * circumference
        : circumference;

    const { weather } = useWeather(
        settings.weatherLat || 38.033,
        settings.weatherLng || -122.267,
        settings.weatherUnit || 'fahrenheit'
    );

    const getWeatherIcon = (code: string) => {
        const c = parseInt(code);
        if (c === 0 || c === 1) return <Sun size={14} className="text-[#F59E0B]" />;
        if (c === 2 || c === 3) return <Cloud size={14} className="text-[#60A5FA]" />;
        if (c === 45 || c === 48) return <CloudFog size={14} className="text-[#9CA3AF]" />;
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return <CloudRain size={14} className="text-[#3B82F6]" />;
        if (c === 95) return <CloudLightning size={14} className="text-[#8B5CF6]" />;
        if ([71, 73, 75].includes(c)) return <Snowflake size={14} className="text-white" />;
        return <Sun size={14} className="text-[#F59E0B]" />;
    };

    const showWeather = settings.minimalShowWeather === true;
    const showForecast = settings.minimalShowForecast === true;

    return (
        <div className="fixed bottom-6 right-6 z-[200] pointer-events-none">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="flex items-center gap-3 bg-[#16171F]/90 backdrop-blur-xl border border-[#23242F]/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-4 py-2.5"
            >
                {/* Weather Section (Compact Forecast) */}
                {isMounted && showWeather && weather && (
                    <div className="flex items-center gap-3 pr-4 border-r border-[#23242F]/80">
                        {/* Current Temp */}
                        <div className="flex flex-col items-center gap-0.5">
                            {getWeatherIcon(weather.icon)}
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-[14px] font-black text-white leading-none">{weather.temp}</span>
                                <span className="text-[8px] font-bold text-[#F59E0B] leading-none mb-1">°</span>
                            </div>
                        </div>

                        {/* 5-Day Strip */}
                        {showForecast && (
                            <div className="flex items-center gap-3 ml-1">
                                {weather.forecast.slice(1, 6).map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                        <span className="text-[7px] font-bold text-[#9CA3AF] uppercase tracking-tighter">
                                            {format(parseISO(day.date), 'eee', { locale: es })}
                                        </span>
                                        <div className="scale-75 origin-center">
                                            {getWeatherIcon(day.icon)}
                                        </div>
                                        <span className="text-[9px] font-black text-white tracking-tighter">
                                            {day.temp}°
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Seconds ring + logo */}
                <div className="relative w-11 h-11 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Track */}
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#23242F" strokeWidth="4" />
                        {/* Progress */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            style={{
                                strokeDashoffset,
                                transition: 'stroke-dashoffset 1s linear',
                            }}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Inner logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 flex items-center justify-center text-white">
                                <img
                                    src={settings.churchLogoUrl ?? '/flama-oficial.svg'}
                                    className="w-full h-full object-contain brightness-0 invert opacity-60"
                                    alt="Church"
                                    onError={(e) => {
                                        e.currentTarget.src = '/flama-oficial.svg';
                                    }}
                                />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#23242F]/80" />

                {/* Time & Date */}
                <div className="flex flex-col justify-center min-w-[70px]">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[1.65rem] font-black leading-none text-white tracking-tighter">
                            {isMounted ? format(now, 'HH:mm') : '--:--'}
                        </span>
                        <div className="flex flex-col items-start pb-0.5 gap-0">
                            <span className="text-[10px] font-bold text-[#3B82F6] leading-none">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                            <span className="text-[7px] font-bold text-[#9CA3AF] uppercase tracking-widest leading-none">
                                {isMounted ? format(now, 'a') : '--'}
                            </span>
                        </div>
                    </div>
                    <span className="text-[8px] font-bold text-[#4B5563] mt-0.5 uppercase tracking-[0.15em] whitespace-nowrap">
                        {isMounted ? format(now, 'EEEE, d MMM', { locale: es }) : '---'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
