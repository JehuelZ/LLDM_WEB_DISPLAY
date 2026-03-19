'use client';

import React, { useState, useEffect } from 'react';
import { useFont } from '@/components/layout/FontWrapper';

interface ClockProps {
    isVertical?: boolean;
}

const Clock: React.FC<ClockProps> = ({ isVertical }) => {
    const [time, setTime] = useState(new Date());
    const { fonts } = useFont();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return { display: `${formattedHours}:${formattedMinutes}`, ampm };
    };

    const { display, ampm } = formatTime(time);
    const day = time.toLocaleDateString('es-ES', { weekday: 'long' });
    const fullDate = time.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className={`flex flex-col ${isVertical ? 'items-center text-center' : 'items-start'} gap-0 select-none animate-in fade-in slide-in-from-top-4 duration-1200`}>
            {/* Manrope Display Numbers for the Clock */}
            <div className="flex items-baseline gap-2">
                <span 
                    className="text-8xl font-light tracking-tighter text-on-surface drop-shadow-sm"
                    style={{ fontFamily: fonts?.primary || 'Manrope, sans-serif', letterSpacing: '-0.04em' }}
                >
                    {display}
                </span>
                <span 
                    className="text-2xl font-medium uppercase text-on-surface-variant tracking-[0.2em]"
                    style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                >
                    {ampm}
                </span>
            </div>
            
            {/* Minimal High-Tech Labels */}
            <div className="flex flex-col mt-[-0.5rem]">
                <span 
                    className="text-xl font-medium text-primary tracking-wide capitalize"
                    style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                >
                    {day}
                </span>
                <span 
                    className="text-sm font-light text-on-surface-variant opacity-60 uppercase tracking-widest"
                    style={{ fontFamily: fonts?.secondary || 'Inter, sans-serif' }}
                >
                    {fullDate}
                </span>
            </div>

            {/* Kinetic Glow Effect */}
            <div className="w-12 h-[1px] bg-primary/40 mt-4 self-start shadow-[0_0_10px_#ffa44c]" />
        </div>
    );
};

export default Clock;
