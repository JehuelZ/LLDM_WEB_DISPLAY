'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Zap, ZapOff } from 'lucide-react';
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
    const [autoScale, setAutoScale] = useState(1);

    const loadAllSchedulesFromCloud = useAppStore((state) => state.loadAllSchedulesFromCloud);
    const loadAnnouncementsFromCloud = useAppStore((state) => state.loadAnnouncementsFromCloud);
    const loadSettingsFromCloud = useAppStore((state) => state.loadSettingsFromCloud);
    const loadMembersFromCloud = useAppStore((state) => state.loadMembersFromCloud);
    const calendarStyles = useAppStore((state) => state.calendarStyles);
    const settings = useAppStore((state) => state.settings);
    const members = useAppStore((state) => state.members);
    const monthlySchedule = useAppStore((state) => state.monthlySchedule);
    const setSettings = useAppStore((state) => state.setSettings);
    const saveSettingsToCloud = useAppStore((state) => state.saveSettingsToCloud);

    // Secret Toggle State
    const [clickCount, setClickCount] = useState(0);
    const [showIndicator, setShowIndicator] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(0);

    const togglePerfMode = async () => {
        const newValue = !settings?.lowPerformanceMode;
        setSettings({ lowPerformanceMode: newValue });
        setShowIndicator(true);
        setTimeout(() => setShowIndicator(false), 3000);
        
        // Persist to cloud
        await saveSettingsToCloud({ lowPerformanceMode: newValue });
    };

    const handleSecretClick = () => {
        const now = Date.now();
        if (now - lastClickTime < 500) {
            const newCount = clickCount + 1;
            if (newCount >= 3) {
                togglePerfMode();
                setClickCount(0);
            } else {
                setClickCount(newCount);
            }
        } else {
            setClickCount(1);
        }
        setLastClickTime(now);
    };



    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setNow(new Date()), 1000);

        // Auto-scaling for TVs (assume target 1080p)
        const checkScale = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            // Always scale to fit 1920x1080 stage
            const sX = w / 1920;
            const sY = h / 1080;
            setAutoScale(Math.min(sX, sY));
        };

        checkScale();
        window.addEventListener('resize', checkScale);

        const unsubSettings = useAppStore.getState().subscribeToSettings();

        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', checkScale);
            unsubSettings();
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
        const themeId = settings?.displayTemplate || calendarStyles?.template || 'nocturno';
        const theme = getTheme(themeId);

        // If the user selected a specific font set index for this theme
        if (calendarStyles?.fontSetIndex !== undefined && theme.fontOptions && theme.fontOptions[calendarStyles.fontSetIndex]) {
            return {
                ...theme,
                fonts: theme.fontOptions[calendarStyles.fontSetIndex]
            };
        }

        return theme;
    }, [calendarStyles?.template, calendarStyles?.fontSetIndex, settings?.displayTemplate]);

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
            { id: 'countdown', component: <CountdownSlide />, enabled: settings?.showCountdown },
            { id: 'ceremonial-countdown', component: <CeremonialCountdownSlide />, enabled: false },
        ];
        return s.filter(slide => slide.enabled);
    }, [activeTheme, settings?.showCountdown, members, monthlySchedule]);

    useEffect(() => {
        if (slides.length === 0) return;

        const themeId = settings?.displayTemplate || calendarStyles?.template || 'nocturno';
        const durationKey = `${themeId}SlideDuration` as keyof typeof settings;
        const slideDuration = (settings[durationKey] as number) || 12;

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
    }, [slides.length, settings?.iglesiaSlideDuration, settings?.displayTemplate, calendarStyles?.template]);


    if (!isMounted) return null;

    if (!unlocked) {
        return <DisplayLock onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <main
            className={cn(
                "fixed inset-0 text-slate-50 overflow-hidden select-none",
                settings?.fontMain ? "" : activeTheme.fonts.primary,
                "cursor-none"
            )}
        >
            {/* Inject Google Font if configured */}
            {settings?.fontMain && (
                <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?family=${settings.fontMain.replace(/ /g, '+')}:wght@400;700;800;900&display=swap`}
                />
            )}
            
            <Background />

            {/* MAIN CONTENT STAGE WITH AUTO-SCALING FOR TVS */}
            <div
                key={`${activeTheme.id}-${settings?.fontMain}`}
                className="absolute z-10 flex items-center justify-center p-0 overflow-hidden w-[1920px] h-[1080px]"
                style={{
                    transform: `translate(calc(-50% + ${settings?.displayOffsetX || 0}px), calc(-50% + ${settings?.displayOffsetY || 0}px)) scale(${autoScale * (settings?.displayScale || 1.0)})`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center center',
                    fontFamily: settings?.fontMain ? `'${settings.fontMain}', sans-serif` : undefined
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {(() => {
                        const isLowPerf = settings?.lowPerformanceMode;
                        const animationType = settings?.animationType || settings?.iglesiaAnimation || 'metro';
                        const speed = (settings?.animationSpeed || settings?.iglesiaAnimationSpeed || 2.4) as number;

                        let variants: any = {
                            initial: { opacity: 0, x: '-100%' },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: '100%' }
                        };

                        let transition: any = {
                            duration: settings.transitionsEnabled === false ? 0 : speed,
                            ease: [0.4, 0, 0.2, 1],
                            opacity: { duration: settings.transitionsEnabled === false ? 0 : speed * 0.5 }
                        };

                        if (animationType === 'metro') {
                            // Right to Left flow like a train line
                            variants = {
                                initial: {
                                    opacity: 0,
                                    x: (isLowPerf ? '20%' : '100%'),
                                    filter: isLowPerf ? 'none' : 'blur(20px)',
                                    scale: isLowPerf ? 1 : 1.05
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0,
                                    filter: isLowPerf ? 'none' : 'blur(0px)',
                                    scale: 1
                                },
                                exit: {
                                    opacity: 0,
                                    x: (isLowPerf ? '-20%' : '-100%'),
                                    filter: isLowPerf ? 'none' : 'blur(20px)',
                                    scale: isLowPerf ? 1 : 0.95
                                }
                            } as any;
                            transition = {
                                duration: isLowPerf ? speed * 0.5 : speed,
                                ease: isLowPerf ? 'easeInOut' : [0.16, 1, 0.3, 1],
                                opacity: { duration: speed * 0.5 }
                            } as any;
                        } else if (animationType === 'breathing') {
                            // Subtle scale pulse with fade
                            variants = {
                                initial: { opacity: 0, scale: isLowPerf ? 1 : 1.1, filter: isLowPerf ? 'none' : 'blur(10px)' },
                                animate: { opacity: 1, scale: 1, filter: isLowPerf ? 'none' : 'blur(0px)' },
                                exit: { opacity: 0, scale: isLowPerf ? 1 : 0.9, filter: isLowPerf ? 'none' : 'blur(10px)' }
                            } as any;
                            transition = {
                                duration: isLowPerf ? speed * 0.5 : speed,
                                ease: 'easeInOut',
                                opacity: { duration: speed * 0.75 }
                            } as any;
                        } else if (animationType === 'fade') {
                            // Pure elegant fade
                            variants = {
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 }
                            } as any;
                            transition = {
                                duration: isLowPerf ? speed * 0.5 : speed,
                                ease: 'linear',
                                opacity: { duration: speed }
                            } as any;
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

                {/* SHARED OVERLAYS (Now inside the scaled stage to avoid TV clipping) */}
                <Clock now={now} isMounted={isMounted} settings={settings} />
                <Progress slides={slides} currentSlide={currentSlide} />
            </div>

            {/* Secret Toggle Area (Bottom Left) */}
            <div 
                className="fixed bottom-0 left-0 w-32 h-32 z-[1000] cursor-pointer"
                onClick={handleSecretClick}
            />

            {/* Performance Mode Indicator */}
            <AnimatePresence>
                {showIndicator && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-10 left-10 z-[1100] flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl shadow-2xl"
                    >
                        {settings?.lowPerformanceMode ? (
                            <>
                                <ZapOff className="w-5 h-5 text-amber-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">MODO RENDIMIENTO: <span className="text-amber-500 text-sm italic">OPTIMIZADO</span></span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">MODO RENDIMIENTO: <span className="text-primary text-sm italic">FLUIDO</span></span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-10 right-10 z-[500] flex gap-4 opacity-0 hover:opacity-100 transition-opacity">
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
