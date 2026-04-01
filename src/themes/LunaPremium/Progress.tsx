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
        <div className="flex flex-col gap-2 w-full animate-in fade-in duration-1000">
            {showLabel && (
                <div className="flex justify-between items-end mb-1">
                    <span 
                        className="text-xs font-medium uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        Progreso del Servicio
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
            <div className="w-full h-[6px] bg-surface-container-high rounded-full overflow-hidden shadow-inner relative">
                {/* Surface Variant background that acts as a dim track */}
                <div className="absolute inset-0 bg-surface-variant/20" />
                
                {/* 
                    Luminescent Progress: 
                    Vibrant accent for orange progress with signature glow 
                */}
                <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-container transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,164,76,0.3)] rounded-r-md"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
            
            {/* Kinetic Observatory Detail - Subtle atmospheric line */}
            <div className="flex justify-between w-full opacity-20 px-0.5">
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-1 w-[1px] bg-on-surface-variant" />
                ))}
            </div>
        </div>
    );
};

export default Progress;
