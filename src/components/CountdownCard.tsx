
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Sparkles, Clock, Target } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns';

export function CountdownCard() {
    const { settings, saveSettingsToCloud } = useAppStore();
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!settings.showCountdown || !settings.countdownDate) return;

        const checkCountdown = () => {
            const target = parseISO(settings.countdownDate!);
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                // Automatically deactivate countdown when it reaches zero
                saveSettingsToCloud({ showCountdown: false });
                return true; // Finished
            }

            setTimeLeft({
                days: differenceInDays(target, now),
                hours: differenceInHours(target, now) % 24,
                minutes: differenceInMinutes(target, now) % 60,
                seconds: differenceInSeconds(target, now) % 60,
            });
            return false;
        };

        // Run immediately
        const isFinished = checkCountdown();
        if (isFinished) return;

        const timer = setInterval(() => {
            const finished = checkCountdown();
            if (finished) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [settings.showCountdown, settings.countdownDate, saveSettingsToCloud]);

    if (!settings.showCountdown || !timeLeft) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />

            <div className="relative glass-card p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-background/40 to-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 py-6 md:py-8 px-6 md:px-10 shadow-2xl overflow-hidden">
                {/* Background Sparkles Animation */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-40 h-40 text-primary" />
                    </motion.div>
                </div>

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] group-hover:scale-110 transition-transform overflow-hidden">
                        {settings.countdownLogoUrl ? (
                            <img src={settings.countdownLogoUrl} className="w-full h-full object-contain p-2" alt="Logo Evento" />
                        ) : (
                            <CalendarDays className="w-10 h-10 text-primary" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Fecha Memorable</span>
                            <div className="h-px w-8 bg-primary/30" />
                        </div>
                        <h3 className="text-xl md:text-4xl font-black text-foreground uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                            {settings.countdownTitle || 'Evento Especial'}
                        </h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                            <Target className="w-3 h-3" /> Faltan para el gran día
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 relative z-10 w-full md:w-auto justify-center md:justify-end">
                    {[
                        { label: 'Días', value: timeLeft.days },
                        { label: 'Hrs', value: timeLeft.hours },
                        { label: 'Min', value: timeLeft.minutes },
                        { label: 'Seg', value: timeLeft.seconds }
                    ].map((unit, i) => (
                        <div key={unit.label} className="flex flex-col items-center">
                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={unit.value}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="text-3xl md:text-6xl font-black text-foreground tabular-nums text-glow drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                                    >
                                        {unit.value.toString().padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                                <div className="absolute -inset-x-2 bottom-0 h-1 bg-primary/20 rounded-full blur-[2px]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">{unit.label}</span>
                        </div>
                    ))}

                    <div className="hidden md:flex ml-4 w-12 h-12 rounded-full border border-primary/20 items-center justify-center group-hover:bg-primary/10 transition-colors animate-pulse">
                        <Clock className="w-6 h-6 text-primary/40" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
