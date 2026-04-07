'use client';

import React from 'react';

interface ProgressProps {
    slides: any[];
    currentSlide: number;
    color?: string;
    showLabel?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ slides, currentSlide, color, showLabel = true }) => {
    const progress = slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

    return (
        <div className="absolute bottom-12 left-12 right-12 flex flex-col gap-2 z-[100] animate-in fade-in duration-1000 pointer-events-none">
            {showLabel && (
                <div className="flex justify-between items-end mb-1">
                    <span 
                        className="text-xs font-medium uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-2"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        Progreso del Ciclo
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#ffa44c]" />
                    </span>
                    <span 
                        className="text-lg font-light text-primary"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                        {Math.floor(progress)}
                        <span className="text-[10px] ml-0.5 opacity-60">%</span>
                    </span>
                </div>
            )}
            
            {/* The Layering Principle Progress Bar */}
            <div className="w-full h-[4px] bg-surface-container-high/40 backdrop-blur-sm rounded-full overflow-hidden shadow-inner relative ring-1 ring-white/5">
                {/* Surface Variant background that acts as a dim track */}
                <div className="absolute inset-0 bg-surface-variant/10" />
                
                {/* 
                    Luminescent Progress: 
                    Vibrant accent for orange progress with signature glow 
                */}
                <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-primary-container transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,164,76,0.5)] rounded-r-full"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
            
            {/* Kinetic Observatory Detail - Subtle atmospheric dots */}
            <div className="flex justify-between w-full opacity-10 px-1 mt-1">
                {slides.map((_, i) => (
                    <div key={i} className={`h-1 w-1 rounded-full ${i <= currentSlide ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                ))}
            </div>
        </div>
    );
};

export default Progress;
