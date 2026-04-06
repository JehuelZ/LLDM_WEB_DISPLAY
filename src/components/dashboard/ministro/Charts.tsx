'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function StatBarChart({ percent, label, value, total, gradientId }: { percent: number, label: string, value: number, total: number, gradientId: string }) {
    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 italic">{label}</span>
                    <span className="text-3xl font-black text-white italic leading-none">{percent}%</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{value} de {total}</span>
                </div>
            </div>
            
            <div className="h-4 bg-white/5 rounded-full overflow-hidden relative group">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn("h-full relative z-10", gradientId === 'blue' ? "bg-blue-500" : gradientId === 'purple' ? "bg-purple-500" : "bg-orange-500")}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2 animate-shimmer" />
            </div>
            
            <div className="flex justify-between text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest italic">
                <span>0% Eficiencia</span>
                <span>Óptimo 100%</span>
            </div>
        </div>
    );
}

export function StatDoughnut({ percent, label, value, total, gradientId }: { percent: number, label: string, value: number, total: number, gradientId: string }) {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-6 p-4 relative group">
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r={radius} fill="transparent" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                    <motion.circle 
                        cx="56" cy="56" r={radius} fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className={cn(gradientId === 'purple' ? "text-purple-500" : "text-orange-500")}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white italic leading-none">{percent}%</span>
                    <span className="text-[10px] font-bold text-muted-foreground/40 mt-1">{value}/{total}</span>
                </div>
            </div>
            <div className="text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">{label}</span>
            </div>
        </div>
    );
}

export function MiniAreaChart({ data }: { data: number[] }) {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
    
    return (
        <svg className="w-full h-12 text-primary" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`M 0,100 L ${points} L 100,100 Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-1000"
            />
            <path
                d={`M 0,${100 - (data[0] / max) * 100} L ${points}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000"
            />
        </svg>
    );
}
