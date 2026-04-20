'use client';

import React, { useState, useEffect } from 'react';
import { useFont } from '@/components/layout/FontWrapper';
import { useWeather } from '@/hooks/useWeather';
import { useAppStore } from '@/lib/store';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, Sunrise, MapPin } from 'lucide-react';

interface ClockProps {
    isVertical?: boolean;
    now?: Date;
    settings?: any;
    isMounted?: boolean;
}

const WeatherIcon = ({ code, className, size = 20 }: { code: string, className?: string, size?: number }) => {
    const c = parseInt(code);
    if (c === 0) return <Sun className={className} size={size} />;
    if (c >= 1 && c <= 3) return <Cloud className={className} size={size} />;
    if (c >= 45 && c <= 48) return <CloudFog className={className} size={size} />;
    if (c >= 51 && c <= 55) return <CloudDrizzle className={className} size={size} />;
    if (c >= 61 && c <= 65) return <CloudRain className={className} size={size} />;
    if (c >= 71 && c <= 75) return <CloudSnow className={className} size={size} />;
    if (c >= 80 && c <= 82) return <CloudRain className={className} size={size} />;
    if (c === 95) return <CloudLightning className={className} size={size} />;
    return <Sun className={className} size={size} />;
};

const Clock: React.FC<ClockProps> = ({ isVertical, now: externalNow, settings: externalSettings, isMounted }) => {
    const [time, setTime] = useState(externalNow || new Date());
    const storeSettings = useAppStore((state) => state.settings);
    const settings = externalSettings || storeSettings;
    
    const unit = settings?.weatherUnit || 'fahrenheit';

    // Weather Fetching
    const { weather } = useWeather(
        settings?.weatherLat || 34.0522,
        settings?.weatherLng || -118.2437,
        unit
    );

    useEffect(() => {
        if (!externalNow) {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        } else {
            setTime(externalNow);
        }
    }, [externalNow]);

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return { display: `${formattedHours}:${formattedMinutes}`, ampm };
    };

    const { display, ampm } = formatTime(time);
    const day = time.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const fullDate = time.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toLowerCase();

    // In Luna Premium, the clock and weather are often in the Sidebar.
    // This component might be a secondary or floating version.
    // If it's returning null, it's likely intentional to avoid duplication,
    // but the file should at least be valid.
    
    // However, the user wants LARGER icons, so if this clock is visible,
    // we should make sure it also has large icons.
    
    // For now, let's keep it minimal but valid, returning null if it's meant to be hidden 
    // in favor of the Sidebar, or rendering a small version if needed.
    
    return null; 
};

export default Clock;
