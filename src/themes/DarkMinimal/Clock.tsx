'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Flame, Church, Cross, Star, Heart } from 'lucide-react';

export const DarkMinimalClock = ({ now, isMounted, settings }: { now: Date, isMounted: boolean, settings: any }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isMounted
        ? circumference - (now.getSeconds() / 60) * circumference
        : circumference;

    return (
        <div className="fixed bottom-6 right-6 z-[200] pointer-events-none">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="flex items-center gap-2 bg-[#16171F]/80 backdrop-blur-md border border-[#23242F]/50 rounded-xl shadow-lg px-3 py-2"
            >
                {/* Seconds ring + logo */}
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Track */}
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#23242F" strokeWidth="3" />
                        {/* Progress */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
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
                        <div className="w-6 h-6 flex items-center justify-center text-white">
                                <img
                                    src={settings.churchLogoUrl ?? '/flama-oficial.svg'}
                                    className="w-full h-full object-contain brightness-0 invert opacity-80"
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
                <div className="flex flex-col justify-center">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[1.75rem] font-bold leading-none text-white tracking-tight">
                            {isMounted ? format(now, 'HH:mm') : '--:--'}
                        </span>
                        <div className="flex flex-col items-start pb-0.5 gap-0">
                            <span className="text-[10px] font-bold text-[#3B82F6] leading-none">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                            <span className="text-[7px] font-medium text-[#9CA3AF] uppercase tracking-widest leading-none">
                                {isMounted ? format(now, 'a') : '--'}
                            </span>
                        </div>
                    </div>
                    <span className="text-[8px] font-medium text-[#4B5563] mt-0.5 uppercase tracking-wider">
                        {isMounted ? format(now, 'EEEE, d MMM', { locale: es }) : '---'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
