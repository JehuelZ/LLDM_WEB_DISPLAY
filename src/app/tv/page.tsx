
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getTheme } from '@/themes';
import { CeremonialCountdown } from '@/components/CeremonialCountdown';
import { CountdownCard } from '@/components/CountdownCard';
import './tv.css';

/**
 * MODO TV OPTIMIZADO:
 * 1. Sin bloqueo de PIN (Auto-arranque).
 * 2. Carga mínima de componentes administrativos.
 * 3. Auto-escalado agresivo para pantallas grandes.
 */
export default function TVModePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [now, setNow] = useState(() => new Date());
    const [autoScale, setAutoScale] = useState(1);

    const {
        loadAllSchedulesFromCloud,
        loadAnnouncementsFromCloud,
        loadSettingsFromCloud,
        loadMembersFromCloud,
        loadThemeFromCloud,
        settings,
        calendarStyles,
        subscribeToSettings
    } = useAppStore();

    useEffect(() => {
        setIsMounted(true);
        document.body.classList.add('tv-mode');
        const timer = setInterval(() => setNow(new Date()), 1000);

        const checkScale = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const sX = w / 1920;
            const sY = h / 1080;
            setAutoScale(Math.min(sX, sY));
        };

        checkScale();
        window.addEventListener('resize', checkScale);

        // Carga inicial de datos
        const init = async () => {
            await Promise.all([
                loadAllSchedulesFromCloud(),
                loadAnnouncementsFromCloud(),
                loadSettingsFromCloud(),
                loadMembersFromCloud(),
                loadThemeFromCloud()
            ]);
        };
        init();

        const unsubSettings = subscribeToSettings();

        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', checkScale);
            unsubSettings();
        };
    }, []);

    const activeTheme = useMemo(() => {
        const themeId = settings?.displayTemplate || calendarStyles?.template || 'nocturno';
        const theme = getTheme(themeId);
        return theme;
    }, [settings.displayTemplate, calendarStyles?.template]);

    const slides = useMemo(() => {
        const { Schedule, ScheduleTomorrow, Calendar, Weekly, Announcements } = activeTheme.slides;
        const s = [
            { id: 'calendar', component: <Calendar />, enabled: true },
            { id: 'weekly', component: <Weekly />, enabled: true },
            { id: 'announcements', component: <Announcements />, enabled: true },
            { id: 'schedule', component: <Schedule />, enabled: true },
            { id: 'schedule_tomorrow', component: ScheduleTomorrow ? <ScheduleTomorrow /> : <Schedule isTomorrow />, enabled: true },
            { id: 'countdown', component: <div className="h-full w-full flex items-center justify-center bg-black/40 backdrop-blur-md"><CountdownCard /></div>, enabled: settings.showCountdown },
        ];
        return s.filter(slide => slide.enabled);
    }, [activeTheme, settings.showCountdown]);

    useEffect(() => {
        const themeId = settings?.displayTemplate || calendarStyles?.template || 'nocturno';
        const durationKey = `${themeId}SlideDuration` as keyof typeof settings;
        const duration = (settings[durationKey] as number) || 12;

        const rotationTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, duration * 1000);

        const refreshTimer = setInterval(() => {
            loadAllSchedulesFromCloud();
            loadAnnouncementsFromCloud();
            loadSettingsFromCloud();
            loadMembersFromCloud();
            loadThemeFromCloud();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(rotationTimer);
            clearInterval(refreshTimer);
        };
    }, [slides.length, settings.iglesiaSlideDuration]);

    if (!isMounted) return <div className="bg-black w-full h-full" />;

    const { Background, Clock, Progress } = activeTheme.components;

    return (
        <main className={cn("fixed inset-0 overflow-hidden select-none cursor-none bg-black", activeTheme.fonts.primary)}>
            <Background />

            <div
                key={activeTheme.id}
                className="absolute z-10 flex items-center justify-center p-0 overflow-hidden w-[1920px] h-[1080px]"
                style={{
                    transform: `translate(-50%, -50%) scale(${autoScale})`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center center'
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={slides[currentSlide]?.id}
                        initial={{ opacity: 0, x: settings.transitionsEnabled === false ? 0 : 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: settings.transitionsEnabled === false ? 0 : -100 }}
                        transition={{ duration: settings.transitionsEnabled === false ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                    >
                        {slides[currentSlide]?.component}
                    </motion.div>
                </AnimatePresence>

                <Clock now={now} isMounted={isMounted} settings={settings} />
                <Progress slides={slides} currentSlide={currentSlide} />
            </div>

            {/* Marcador técnico discreto */}
            <div className="fixed bottom-4 left-4 opacity-5 text-[8px] font-mono uppercase tracking-[0.5em]">
                LLDM RODEO / MODO TV AUTOMATIZADO
            </div>
        </main>
    );
}
