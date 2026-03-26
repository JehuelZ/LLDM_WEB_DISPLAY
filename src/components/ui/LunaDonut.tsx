'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LunaDonutProps {
    value: number;
    color: string;
    colorEnd: string;
    label: string;
}

const LunaDonut: React.FC<LunaDonutProps> = ({ value, color, colorEnd, label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-6 relative group">
            <svg className="w-48 h-48 transform -rotate-90 overflow-visible">
                {/* Background Track */}
                <circle
                    cx="96" cy="96" r={radius}
                    stroke="currentColor" strokeWidth="1"
                    fill="transparent" className="text-white/5"
                />
                
                {/* Main Progress Ring */}
                <motion.circle
                    cx="96" cy="96" r={radius}
                    stroke={color} strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                />

                {/* Tactical Markers */}
                {[0, 90, 180, 270].map((angle) => (
                    <line
                        key={angle}
                        x1="96" y1="50" x2="96" y2="54"
                        stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
                        transform={`rotate(${angle} 96 96)`}
                    />
                ))}
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-[300] tracking-tighter tabular-nums"
                >
                    {Math.round(value)}%
                </motion.span>
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="text-[8px] font-[300] tracking-[0.5em] uppercase mt-2"
                >
                    {label}
                </motion.span>
            </div>

            {/* Kinetic Decoration */}
            <div className="absolute -inset-4 border border-white/[0.02] rounded-full pointer-events-none animate-[spin_20s_linear_infinite]" />
        </div>
    );
};

export default LunaDonut;
