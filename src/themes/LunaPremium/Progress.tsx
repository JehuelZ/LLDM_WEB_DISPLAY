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
        <div className="absolute bottom-12 left-12 right-12 flex flex-col gap-2 z-[100] animate-in fade-in duration-1000 pointer-events-none pl-[220px]">
            {showLabel && (
                <div className="flex justify-between items-end mb-1">
                    <span 
                        className="text-xs font-[300] lowercase tracking-[0.3em] text-white/20 flex items-center gap-2"
                        style={{ fontFamily: "'Saira', sans-serif" }}
                    >
                        progreso del ciclo
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    </span>
                    <span 
                        className="text-lg font-[100] text-white/40"
                        style={{ fontFamily: "'Saira', sans-serif" }}
                    >
                        {Math.floor(progress)}
                        <span className="text-[10px] ml-0.5 opacity-60">%</span>
                    </span>
                </div>
            )}
            
            {/* The Layering Principle Progress Bar */}
            <div className="w-full h-[4px] bg-white/5 backdrop-blur-sm rounded-full overflow-hidden relative ring-1 ring-white/5">
                <div className="absolute inset-0 bg-white/[0.02]" />
                
                <div 
                    className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-1000 ease-out rounded-r-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* Kinetic Observatory Detail - Subtle atmospheric dots */}
            <div className="flex justify-between w-full opacity-5 px-1 mt-1">
                {slides.map((_, i) => (
                    <div key={i} className={`h-1 w-1 rounded-full ${i <= currentSlide ? 'bg-white' : 'bg-white/20'}`} />
                ))}
            </div>
        </div>
    );
};

export default Progress;
