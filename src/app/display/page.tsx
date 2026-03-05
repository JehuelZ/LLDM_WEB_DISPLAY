'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CountdownCard } from '@/components/CountdownCard';
import { CeremonialCountdown } from '@/components/CeremonialCountdown';
import { getTheme } from '@/themes';
import { DisplayLock } from '@/components/display/DisplayLock';

const FullscreenButton = () => {
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            className="fixed bottom-10 right-10 z-[500] p-4 rounded-full bg-black/40 border border-white/20 text-white shadow-2xl hover:text-primary hover:border-primary hover:bg-black/60 hover:scale-110 transition-all duration-300 backdrop-blur-xl group cursor-pointer"
            title="Pantalla Completa"
        >
            <Maximize className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
    );
};

export default function DisplayPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [now, setNow] = useState(() => new Date());
    const [unlocked, setUnlocked] = useState(false);

    const loadAllSchedulesFromCloud = useAppStore((state) => state.loadAllSchedulesFromCloud);
    const loadAnnouncementsFromCloud = useAppStore((state) => state.loadAnnouncementsFromCloud);
    const loadSettingsFromCloud = useAppStore((state) => state.loadSettingsFromCloud);
    const loadMembersFromCloud = useAppStore((state) => state.loadMembersFromCloud);
    const calendarStyles = useAppStore((state) => state.calendarStyles);
    const settings = useAppStore((state) => state.settings);
    const members = useAppStore((state) => state.members);
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);



    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setNow(new Date()), 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const initData = async () => {
            await Promise.all([
                loadAllSchedulesFromCloud(),
                loadAnnouncementsFromCloud(),
                loadSettingsFromCloud(),
                loadMembersFromCloud(),
                useAppStore.getState().loadThemeFromCloud()
            ]);
        };
        initData();
    }, [loadAllSchedulesFromCloud, loadAnnouncementsFromCloud, loadSettingsFromCloud, loadMembersFromCloud]);

    // Theme engine: choose the correct theme based on settings
    const activeTheme = useMemo(() => {
        const theme = getTheme(calendarStyles?.template || 'nocturno');

        // If the user selected a specific font set index for this theme
        if (calendarStyles?.fontSetIndex !== undefined && theme.fontOptions && theme.fontOptions[calendarStyles.fontSetIndex]) {
            return {
                ...theme,
                fonts: theme.fontOptions[calendarStyles.fontSetIndex]
            };
        }

        return theme;
    }, [calendarStyles?.template, calendarStyles?.fontSetIndex]);

    const { Schedule, Calendar, Weekly, Announcements } = activeTheme.slides;
    const { Background, Clock, Progress } = activeTheme.components;

    const slides = useMemo(() => {
        const { Schedule, ScheduleTomorrow: ThemeScheduleTomorrow, Calendar, Weekly, Announcements } = activeTheme.slides;

        const s = [
            { id: 'calendar', component: <Calendar />, enabled: true },
            { id: 'weekly_program', component: <Weekly />, enabled: true },
            { id: 'announcements', component: <Announcements />, enabled: true },
            { id: 'schedule', component: <Schedule />, enabled: true },
            {
                id: 'schedule_tomorrow',
                component: ThemeScheduleTomorrow ? <ThemeScheduleTomorrow /> : <Schedule isTomorrow={true} />,
                enabled: true
            },
            { id: 'countdown', component: <CountdownSlide />, enabled: settings.showCountdown },
            { id: 'ceremonial-countdown', component: <CeremonialCountdownSlide />, enabled: false },
        ];
        return s.filter(slide => slide.enabled);
    }, [activeTheme, settings.showCountdown, members, monthlySchedule]);

    useEffect(() => {
        if (slides.length === 0) return;

        const isIglesia = calendarStyles?.template === 'iglesia';
        const slideDuration = (isIglesia ? settings.iglesiaSlideDuration : 12) || 12;

        // Slide rotation timer
        const rotationTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, slideDuration * 1000);

        // ... rest of the timers ...
        const refreshTimer = setInterval(() => {
            console.log("Refreshing system data...");
            const state = useAppStore.getState();
            state.loadAllSchedulesFromCloud();
            state.loadAnnouncementsFromCloud();
            state.loadSettingsFromCloud();
            state.loadMembersFromCloud();
            state.loadThemeFromCloud();
        }, 5 * 60 * 1000);

        let lastDay = new Date().getDate();
        const dateCheckTimer = setInterval(() => {
            const today = new Date().getDate();
            if (today !== lastDay) {
                console.log("Day change detected. Reloading app...");
                window.location.reload();
            }
        }, 60000);

        return () => {
            clearInterval(rotationTimer);
            clearInterval(refreshTimer);
            clearInterval(dateCheckTimer);
        };
    }, [slides.length, settings.iglesiaSlideDuration, calendarStyles?.template]);


    if (!isMounted) return null;

    if (!unlocked) {
        return <DisplayLock onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <main
            className={cn(
                "fixed inset-0 text-slate-50 overflow-hidden select-none",
                activeTheme.fonts.primary,
                "cursor-none"
            )}
        >
            <Background />

            {/* MAIN CONTENT STAGE */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {(() => {
                        const isIglesia = calendarStyles?.template === 'iglesia';
                        const animationType = settings.iglesiaAnimation || 'metro';

                        // Custom Animation Logic
                        let variants: any = {
                            initial: { opacity: 0, x: '-100%' },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: '100%' }
                        };

                        let transition: any = {
                            duration: 1.6,
                            ease: [0.4, 0, 0.2, 1],
                            opacity: { duration: 1.2 }
                        };


                        if (isIglesia) {
                            const speed = settings.iglesiaAnimationSpeed || 2.4;

                            if (animationType === 'metro') {
                                // Right to Left flow like a train line
                                variants = {
                                    initial: {
                                        opacity: 0,
                                        x: '100%',
                                        filter: 'blur(20px)',
                                        scale: 1.05
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0,
                                        filter: 'blur(0px)',
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        x: '-100%',
                                        filter: 'blur(20px)',
                                        scale: 0.95
                                    }
                                };
                                transition = {
                                    duration: speed,
                                    ease: [0.16, 1, 0.3, 1] as any,
                                    opacity: { duration: speed * 0.5 }
                                } as any;
                            } else if (animationType === 'breathing') {
                                // Subtle scale pulse with fade
                                variants = {
                                    initial: { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
                                    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                                    exit: { opacity: 0, scale: 0.9, filter: 'blur(10px)' }
                                };
                                transition = {
                                    duration: speed,
                                    ease: 'easeInOut' as any,
                                    opacity: { duration: speed * 0.75 }
                                } as any;
                            } else if (animationType === 'fade') {
                                // Pure elegant fade
                                variants = {
                                    initial: { opacity: 0 },
                                    animate: { opacity: 1 },
                                    exit: { opacity: 0 }
                                };
                                transition = {
                                    duration: speed,
                                    ease: 'linear' as any,
                                    opacity: { duration: speed }
                                } as any;
                            }
                        }

                        return (
                            <motion.div
                                key={slides[currentSlide]?.id || 'empty'}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={transition}
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                            >
                                {slides[currentSlide]?.component}
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>


            {/* SHARED OVERLAYS (Can be overrideen or replaced by active theme) */}
            <Clock now={now} isMounted={isMounted} settings={settings} />
            <Progress slides={slides} currentSlide={currentSlide} />

            <div className="fixed bottom-10 right-10 z-[500] flex gap-4">
                <FullscreenButton />
            </div>
        </main>
    );
}

// Fixed Placeholder slides for missing or shared functionality
function CountdownSlide() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-black/40 backdrop-blur-md">
            <CountdownCard />
        </div>
    );
}

function CeremonialCountdownSlide() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-black/60 backdrop-blur-xl">
            <CeremonialCountdown />
        </div>
    );
}
