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
        <div className="fixed bottom-8 right-8 z-[200] pointer-events-none">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="flex items-center gap-4 bg-[#16171F] border border-[#23242F] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-5 py-4"
            >
                {/* Seconds ring + logo */}
                <div className="relative w-20 h-20 flex-shrink-0">
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
                    <div className="absolute inset-[10px] rounded-xl bg-[#0F1117] border border-[#23242F] flex items-center justify-center">
                        <div className="w-9 h-9 flex items-center justify-center text-white">
                                <img
                                    src={settings.churchLogoUrl ?? '/flama-oficial.svg'}
                                    className="w-full h-full object-contain brightness-0 invert"
                                    alt="Church"
                                    onError={(e) => {
                                        e.currentTarget.src = '/flama-oficial.svg';
                                    }}
                                />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-14 bg-[#23242F]" />

                {/* Time & Date */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[3.5rem] font-bold leading-none text-white tracking-tight">
                            {isMounted ? format(now, 'HH:mm') : '--:--'}
                        </span>
                        <div className="flex flex-col items-start pb-1 gap-0.5">
                            <span className="text-xl font-semibold text-[#3B82F6] leading-none">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                            <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest">
                                {isMounted ? format(now, 'a') : '--'}
                            </span>
                        </div>
                    </div>
                    <span className="text-[11px] font-medium text-[#4B5563] mt-1 uppercase tracking-wider">
                        {isMounted ? format(now, 'EEEE, d MMM', { locale: es }) : '---'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
