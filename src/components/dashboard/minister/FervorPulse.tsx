'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FervorPulseProps {
    title: string;
    value: number;
    total: number;
    icon: LucideIcon;
    color?: string;
    unit?: string;
    subtitle?: string;
}

export default function FervorPulse({ 
    title, 
    value, 
    total, 
    icon: Icon, 
    color = "var(--fervor-emerald)",
    unit = "%",
    subtitle
}: FervorPulseProps) {
    const percentage = Math.round((value / total) * 100);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="tactile-card group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">{title}</p>
                    <h3 className="text-2xl font-black italic uppercase">{value}<span className="text-xs opacity-40 ml-1">/{total}</span></h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Donut Chart */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-white/[0.03]"
                        />
                        <motion.circle
                            cx="56"
                            cy="56"
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            style={{ filter: `drop-shadow(0 0 8px ${color}44)` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black italic">{percentage}</span>
                        <span className="text-[8px] font-black uppercase opacity-40">{unit}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Salud Espiritual</span>
                            <span className="text-[10px] font-bold" style={{ color }}>{percentage}%</span>
                        </div>
                        <div className="tech-bar-container">
                            <motion.div 
                                className="tech-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{ background: color, boxShadow: `0 0 10px ${color}66` }}
                            />
                        </div>
                    </div>
                    {subtitle && (
                        <p className="text-[9px] font-bold leading-relaxed text-muted-foreground/60 uppercase italic tracking-tighter">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Glowing Accent */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 blur-[60px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40" style={{ background: color }} />
        </div>
    );
}
