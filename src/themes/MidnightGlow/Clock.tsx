'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Flame, BookOpen, Star, Heart, Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import { ChurchIcon as Church } from '@/components/ui/ChurchIcon';
import { useWeather } from '@/hooks/useWeather';
import { parseISO } from 'date-fns';

export const MidnightGlowClock = ({ now, isMounted, settings }: { now: Date, isMounted: boolean, settings: any }) => {
    // Circumference of the circle for the seconds ring
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isMounted ? circumference - (now.getSeconds() / 60) * circumference : circumference;

    const { weather, loading } = useWeather(
        settings.weatherLat || 38.033, 
        settings.weatherLng || -122.273,
        settings.weatherUnit || 'celsius'
    );

    const getWeatherIcon = (code: string) => {
        const c = parseInt(code);
        if (c === 0 || c === 1) return <Sun size={20} className="text-yellow-400" />;
        if (c === 2 || c === 3) return <Cloud size={20} className="text-blue-300" />;
        if (c === 45 || c === 48) return <CloudFog size={20} className="text-gray-400" />;
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return <CloudRain size={20} className="text-blue-500" />;
        if (c === 95) return <CloudLightning size={20} className="text-purple-500" />;
        if ([71, 73, 75].includes(c)) return <Snowflake size={20} className="text-white" />;
        return <Sun size={20} className="text-yellow-400" />;
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[200] scale-60 sm:scale-75 md:scale-90 lg:scale-100 origin-bottom-right pointer-events-none transition-all duration-500">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                className="flex items-center bg-[#071020]/95 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(79,127,255,0.08)] p-1.5 pl-6 pr-8 relative overflow-hidden"
            >

                {/* Subtle background glow inside the pill */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A6E]/20 via-transparent to-transparent pointer-events-none" />

                {/* ── WEATHER SECTION ── */}
                {weather && isMounted && (
                    <div className="flex items-center gap-3 mr-5 border-r border-white/10 pr-5">
                        {/* Current Weather Highlight */}
                        <div className="flex items-center gap-2 mr-3 border-r border-white/5 pr-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#A3FF57] blur-md opacity-20 scale-125" />
                                <div className="relative z-10 scale-110">
                                    {getWeatherIcon(weather.icon)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-[#A3FF57] uppercase tracking-[0.2em] -mb-1 opacity-80">Ahora</span>
                                <div className="flex items-start">
                                    <span className="text-[15px] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{weather.temp}</span>
                                    <span className="text-[8px] font-bold text-[#A3FF57]">°</span>
                                </div>
                            </div>
                        </div>

                        {/* Future Forecast (Next 4 days) */}
                        {weather.forecast.slice(1, 5).map((day, idx) => (
                            <div key={day.date} className="flex items-center gap-1.5">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-current blur-md opacity-20 scale-100" style={{ color: 'inherit' }} />
                                    <div className="relative z-10 scale-90">
                                        {getWeatherIcon(day.icon)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
                                        {format(parseISO(day.date), 'EEE', { locale: es })}
                                    </span>
                                    <div className="flex items-start">
                                        <span className="text-[11px] font-black text-white/80 leading-none tracking-tighter">{day.temp}</span>
                                        <span className="text-[6px] font-bold text-[#A3FF57]">°</span>
                                    </div>
                                </div>
                                {idx < 3 && (
                                    <div className="w-[1px] h-2.5 bg-white/5 ml-1.5" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Circular Logo & Seconds Ring */}
                <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(163,255,87,0.3)]" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        {/* Animated progress ring */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke="#A3FF57"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            style={{
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dashoffset 1s linear'
                            }}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="absolute inset-1.5 rounded-full bg-[#0D1B3E] border border-[#4F7FFF]/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(79,127,255,0.25),0_0_15px_rgba(79,127,255,0.15)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4F7FFF]/20 to-transparent rounded-full" />
                        <div className="w-7 h-7 relative z-10 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                            <img 
                                src={settings.churchLogoUrl ?? "/flama-oficial.svg"} 
                                className="w-full h-full object-contain brightness-0 invert filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                                alt="Church" 
                            />
                        </div>
                    </div>
                </div>

                {/* Elegant Separator */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#4F7FFF]/40 to-transparent mx-4" />

                {/* Time Display */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-end gap-2 -mb-0.5">
                        <span className="text-[1.75rem] leading-[0.85] font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                            {isMounted ? format(now, 'hh:mm') : '--:--'}
                        </span>

                        <div className="flex flex-col pb-0.5">
                            <span className="text-sm font-black text-[#A3FF57] leading-none tracking-widest drop-shadow-[0_0_10px_rgba(163,255,87,0.4)]">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                            <span className="text-[8px] font-black text-[#4F7FFF] uppercase tracking-[0.2em] mt-0.5 drop-shadow-md">
                                {isMounted ? format(now, 'a') : '--'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1 pl-1">
                        <div className="h-[1.5px] w-4 bg-[#A3FF57] rounded-full shadow-[0_0_6px_#A3FF57]" />
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">
                            {isMounted ? format(now, 'EEEE, d MMMM', { locale: es }) : '---'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

