
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { differenceInDays, parseISO } from 'date-fns';

export function CeremonialCountdown() {
    const { settings, saveSettingsToCloud } = useAppStore();
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!settings.countdownDate || !settings.showCountdown) return;

        const calculateDays = () => {
            const target = parseISO(settings.countdownDate!);
            const now = new Date();
            const diffDays = differenceInDays(target, now);
            const diffMs = target.getTime() - now.getTime();

            if (diffMs <= 0) {
                setDaysLeft(0);
                // Automatically deactivate countdown when it reaches zero
                saveSettingsToCloud({ showCountdown: false });
                return true;
            }

            setDaysLeft(diffDays > 0 ? diffDays : 0);
            return false;
        };

        const isFinished = calculateDays();
        if (isFinished) return;

        const timer = setInterval(() => {
            const finished = calculateDays();
            if (finished) {
                clearInterval(timer);
            }
        }, 1000 * 60 * 60); // Update every hour

        return () => clearInterval(timer);
    }, [settings.countdownDate, settings.showCountdown, saveSettingsToCloud]);

    if (!settings.showCountdown || daysLeft === null) return null;

    const bgColor = settings.countdownBgColor || '#FFFFFF';
    const accentColor = settings.countdownAccentColor || '#d4af37';
    const bgUrl = settings.countdownBgImageUrl;

    return (
        <div
            className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: bgUrl ? 'transparent' : bgColor }}
        >
            {/* Background Image Layer */}
            {bgUrl && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={bgUrl}
                        className="w-full h-full object-cover"
                        alt="Background"
                    />
                    {/* Darker/Lighter Overlay for Legibility */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: bgColor === '#ffffff' || bgColor === '#FFFFFF'
                                ? 'rgba(255,255,255,0.7)'
                                : 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />
                </div>
            )}

            {/* Geometric Patterns */}
            <div className="absolute inset-0 pointer-events-none z-5">
                {/* Horizontal Center Line */}
                <div
                    className="absolute top-1/2 left-0 w-full h-[1px]"
                    style={{ background: `linear-gradient(to right, transparent, ${accentColor}66, transparent)` }}
                />

                {/* Diamond/Diagonal Lines Frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[85%] h-[85%] border-[1px] rotate-45" style={{ borderColor: `${accentColor}33` }} />
                    <div className="absolute w-[82%] h-[82%] border-[2px] rotate-45" style={{ borderColor: `${accentColor}1a` }} />
                </div>

                {/* Vertical Center Line */}
                <div
                    className="absolute left-1/2 top-0 h-full w-[1px]"
                    style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}66, transparent)` }}
                />

                {/* Corner Lines */}
                <div className="absolute top-0 left-0 w-48 h-48 border-l-[3px] border-t-[3px] m-8" style={{ borderColor: `${accentColor}4d` }} />
                <div className="absolute top-0 right-0 w-48 h-48 border-r-[3px] border-t-[3px] m-8" style={{ borderColor: `${accentColor}4d` }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 border-l-[3px] border-b-[3px] m-8" style={{ borderColor: `${accentColor}4d` }} />
                <div className="absolute bottom-0 right-0 w-48 h-48 border-r-[3px] border-b-[3px] m-8" style={{ borderColor: `${accentColor}4d` }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center text-center px-4"
            >
                {/* "FALTAN" Text */}
                <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-4xl md:text-7xl font-light tracking-[0.4em] uppercase mb-2"
                    style={{
                        fontFamily: 'var(--font-outfit), sans-serif',
                        color: `${accentColor}cc`
                    }}
                >
                    Faltan
                </motion.h3>

                {/* Big Number */}
                <div className="relative group">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 50 }}
                        className="relative"
                    >
                        <span
                            className="text-[20rem] md:text-[32rem] font-bold leading-none bg-clip-text text-transparent drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative z-10"
                            style={{
                                fontFamily: 'var(--font-outfit), sans-serif',
                                letterSpacing: '-0.02em',
                                backgroundImage: `linear-gradient(to bottom, ${accentColor}, ${accentColor}cc, ${accentColor}ee)`
                            }}
                        >
                            {daysLeft}
                        </span>

                        {/* Animated Shimmer Effect */}
                        <motion.div
                            animate={{
                                x: ['-100%', '200%'],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 4,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
                        />
                    </motion.div>
                </div>

                {/* "DÍAS" Text */}
                <motion.h3
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-5xl md:text-9xl font-black tracking-[0.5em] uppercase mt-2 mb-10 drop-shadow-sm"
                    style={{
                        fontFamily: 'var(--font-outfit), sans-serif',
                        color: accentColor
                    }}
                >
                    Días
                </motion.h3>

                {/* Hashtag and Date Box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="space-y-6 mt-4"
                >
                    <div
                        className="px-10 py-3 bg-gradient-to-r from-transparent via-black/5 to-transparent border-y"
                        style={{ borderColor: `${accentColor}33` }}
                    >
                        <p
                            className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic"
                            style={{ color: accentColor }}
                        >
                            {settings.countdownTitle || '#100AñosdeEsperanzaySalvación'}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <div className="h-[2px] w-20 bg-gradient-to-r from-transparent" style={{ backgroundColor: `${accentColor}99` }} />
                        <p
                            className="text-3xl md:text-6xl font-light tracking-[0.6em]"
                            style={{
                                fontFamily: 'var(--font-sora), sans-serif',
                                color: `${accentColor}e6`
                            }}
                        >
                            {settings.countdownDate ? settings.countdownDate.split('-').reverse().join('.') : '04.06.26'}
                        </p>
                        <div className="h-[2px] w-20 bg-gradient-to-l from-transparent" style={{ backgroundColor: `${accentColor}99` }} />
                    </div>
                </motion.div>

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-20 flex flex-col items-center"
                >
                    <img
                        src={settings.countdownLogoUrl || settings.churchLogoUrl || "/flama-oficial.svg"}
                        className="w-56 h-auto filter brightness-90 opacity-90 drop-shadow-lg"
                        alt="Logo Evento"
                    />
                </motion.div>
            </motion.div>

            {/* Premium Dust Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 md:w-1.5 h-1 md:h-1.5 rounded-full"
                        style={{ backgroundColor: `${accentColor}4d` }}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: 0,
                            scale: Math.random() + 0.5
                        }}
                        animate={{
                            y: [null, (Math.random() * -10 - 5) + "%"],
                            opacity: [0, 0.6, 0],
                            x: [null, (Math.random() * 2 - 1) + "%"]
                        }}
                        transition={{
                            duration: Math.random() * 7 + 8,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
