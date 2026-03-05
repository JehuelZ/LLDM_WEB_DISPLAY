'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Shield, Church, Cross, Star, Heart } from 'lucide-react';

export const MidnightGlowClock = ({ now, isMounted, settings }: { now: Date, isMounted: boolean, settings: any }) => {
    // Circumference of the circle for the seconds ring
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isMounted ? circumference - (now.getSeconds() / 60) * circumference : circumference;

    return (
        <div className="fixed bottom-10 right-10 z-[200] scale-90 origin-bottom-right pointer-events-none font-orbitron">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                className="flex items-center bg-[#071020]/95 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(79,127,255,0.1)] p-3 pr-12 relative overflow-hidden"
            >

                {/* Subtle background glow inside the pill */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A6E]/20 to-transparent pointer-events-none" />

                {/* Circular Logo & Seconds Ring */}
                <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(163,255,87,0.4)]" viewBox="0 0 100 100">
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

                    <div className="absolute inset-2 rounded-full bg-[#0D1B3E] border-[2px] border-[#4F7FFF]/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(79,127,255,0.3),0_0_20px_rgba(79,127,255,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4F7FFF]/20 to-transparent rounded-full" />
                        <div className="w-14 h-14 relative z-10 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            {settings.churchIcon === 'custom' ? (
                                <img
                                    src={settings.customIconUrl || settings.churchLogoUrl || "/lldm_rodeo_logo.svg"}
                                    className="w-full h-full object-contain brightness-0 invert"
                                    alt="Church"
                                />
                            ) : (
                                <div className="text-white">
                                    {(() => {
                                        const icons = { shield: Shield, church: Church, cross: Cross, star: Star, heart: Heart };
                                        const Icon = (icons as any)[settings.churchIcon] || Shield;
                                        return <Icon className="w-10 h-10" strokeWidth={2.5} />;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Elegant Separator */}
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#4F7FFF]/40 to-transparent mx-6" />

                {/* Time Display */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-end gap-3 -mb-1">
                        <span className="text-[5.5rem] leading-[0.85] font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            {isMounted ? format(now, 'HH:mm') : '--:--'}
                        </span>

                        <div className="flex flex-col pb-1">
                            <span className="text-3xl font-black text-[#A3FF57] leading-none tracking-widest drop-shadow-[0_0_15px_rgba(163,255,87,0.5)]">
                                {isMounted ? format(now, 'ss') : '--'}
                            </span>
                            <span className="text-sm font-black text-[#4F7FFF] uppercase tracking-[0.2em] mt-1 drop-shadow-md">
                                {isMounted ? format(now, 'a') : '--'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pl-2">
                        <div className="h-[2px] w-8 bg-[#A3FF57] rounded-full shadow-[0_0_8px_#A3FF57]" />
                        <span className="text-[14px] font-black text-white/50 uppercase tracking-[0.3em]">
                            {isMounted ? format(now, 'EEEE, d MMMM', { locale: es }) : '---'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

