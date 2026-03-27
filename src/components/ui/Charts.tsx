'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChartDataPoint {
    date?: string;
    label?: string;
    attended?: number;
    value?: number;
    total?: number;
}

interface ChartProps {
    data: any[];
    color?: string;
    isSmooth?: boolean;
    showHighlight?: boolean;
    totalMembers?: number; // Nueva prop para escala real
}

export const TactileAreaChart = ({ data, color = "#f59e0b", isSmooth = true, showHighlight = true, totalMembers = 100 }: ChartProps) => {
    if (!data || data.length === 0) return <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-white/20">SIN DATOS</div>;

    const width = 440;
    const height = 290;
    const paddingX = 2; // Máxima expansión horizontal
    const paddingY = 65; 
    
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * (width - paddingX * 2) + paddingX,
        y: height - (((d.attended || d.value || 0) / (d.total || 100)) * (height - paddingY * 2)) - paddingY,
        val: d.attended || d.value || 0,
        label: d.label
    }));

    const getCurvePath = (pts: any[]) => {
        if (pts.length < 2) return "";
        let path = `M ${pts[0].x} ${pts[0].y}`;
        const tension = 0.5;
        
        for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const cp1x = p1.x + (p2.x - p1.x) * tension;
            const cp2x = p2.x - (p2.x - p1.x) * tension;
            path += ` C ${cp1x} ${p1.y}, ${cp2x} ${p2.y}, ${p2.x} ${p2.y}`;
        }
        return path;
    };

    const linePath = isSmooth ? getCurvePath(points) : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    const highlightIndex = Math.min(points.length - 1, 24); 
    const highlightPoint = points[highlightIndex];    const gradientId = `line-gradient-${color.replace('#', '')}`;
    const filterId = `serpent-glow-${color.replace('#', '')}`;

    return (
        <div className="relative w-full h-full group select-none overflow-visible">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="30%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="75%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                    </linearGradient>

                    <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="15" result="blur" />
                        <feComponentTransfer in="blur" result="brightBlur">
                            <feFuncA type="linear" slope="3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="brightBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    
                    <linearGradient id="verticalLineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Vertical Grid Lines & Dots */}
                {points.map((p, i) => (
                    (i === 0 || i % 5 === 0 || i === points.length - 1) && (
                        <g key={i}>
                            <line 
                                x1={p.x} y1={p.y + 25} x2={p.x} y2={height - 40} 
                                stroke="url(#verticalLineGradient)" 
                                strokeWidth="0.8" 
                                strokeDasharray="3 3"
                            />
                            <circle cx={p.x} cy={height - 35} r="1.5" fill="white" fillOpacity="0.1" />
                        </g>
                    )
                ))}

                {/* Y-Axis Labels (Absolute Member Count) */}
                {[0, 0.5, 1].map(multiplier => {
                    const absVal = Math.round(totalMembers * multiplier);
                    return (
                        <text 
                            key={multiplier} 
                            x={12} 
                            y={height - paddingY - (multiplier) * (height - paddingY * 2) + 3} 
                            className="fill-white/10 text-[9px] font-black uppercase tracking-widest"
                        >
                            {absVal}
                        </text>
                    );
                })}

                {/* Triple Glow Engine: Base Aura */}
                <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }} 
                    animate={{ pathLength: 1, opacity: 0.6 }} 
                    transition={{ duration: 4, ease: "easeInOut" }} 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="20" 
                    strokeLinecap="round" 
                    filter={`url(#${filterId})`}
                    className="blur-[25px] opacity-30"
                />

                {/* Triple Glow Engine: Secondary Halo */}
                <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }} 
                    animate={{ pathLength: 1, opacity: 0.8 }} 
                    transition={{ duration: 3.5, ease: "easeInOut" }} 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    filter={`url(#${filterId})`}
                />

                {/* Triple Glow Engine: Main Serpent Stroke with Gradient */}
                <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }} 
                    animate={{ pathLength: 1, opacity: 1 }} 
                    transition={{ duration: 3, ease: "easeInOut" }} 
                    d={linePath} 
                    fill="none" 
                    stroke={`url(#${gradientId})`} 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                />

                {/* Bottom Day Labels */}
                {points.map((p, i) => (
                    (i === 0 || i === 4 || i === 9 || i === 14 || i === 19 || i === 24 || i === points.length - 1) && (
                        <text 
                            key={i} 
                            x={Math.max(12, Math.min(width - 12, p.x))} // Inset labels so they fit
                            y={height - 15} 
                            textAnchor="middle" 
                            className="fill-white/15 text-[10px] font-black uppercase tracking-[0.1em]"
                        >
                            {p.label}
                        </text>
                    )
                ))}

                {/* Premium Floating Tooltip */}
                {showHighlight && highlightPoint && (
                    <g>
                        <motion.foreignObject 
                            initial={{ opacity: 0, scale: 0.6 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: 2.8, duration: 0.7, type: 'spring' }}
                            x={Math.max(5, Math.min(width - 75, highlightPoint.x - 35))} 
                            y={Math.max(5, highlightPoint.y - 90)} 
                            width="75" 
                            height="75"
                        >
                            <div className="flex flex-col items-center">
                                <div className="px-3 py-2 bg-white text-[16px] font-black text-slate-950 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] flex items-center gap-2 translate-y-2">
                                    {Math.round(highlightPoint.val)}%
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/30" />
                                </div>
                                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white relative z-10" />
                            </div>
                        </motion.foreignObject>

                        <motion.circle 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
                            cx={highlightPoint.x} 
                            cy={highlightPoint.y} 
                            r="10" 
                            fill="white" 
                            stroke={color} 
                            strokeWidth="6"
                            className="drop-shadow-[0_0_25px_white]"
                        />
                    </g>
                )}
            </svg>
        </div>
    );
};

export const TactileBarChart = ({ data }: { data: ChartDataPoint[] }) => {
    if (!data || data.length === 0) return <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-white/20">SIN DATOS</div>;

    const width = 400;
    const height = 150;
    const padding = 20;
    const barWidth = 14;
    const gap = (width - padding * 2) / (data.length || 1);
    const colors = ['#3b82f6', '#4b5563', '#4b5563', '#f43f5e', '#4b5563', '#f59e0b', '#4b5563'];

    return (
        <div className="relative w-full h-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {data.map((d, i) => {
                    const h = ((d.attended || d.value || 0) / (d.total || 100)) * (height - padding * 2);
                    const x = padding + i * gap + (gap - barWidth) / 2;
                    const y = height - h - padding;
                    const color = colors[i % colors.length];
                    const isMuted = color === '#4b5563';
                    return (
                        <g key={i} className="group/bar">
                            <motion.rect
                                initial={{ height: 0, y: height - padding }}
                                animate={{ height: Math.max(h, 4), y: Math.min(y, height - padding - 4) }}
                                transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                                x={x} y={y} width={barWidth} height={Math.max(h, 4)}
                                fill={color}
                                rx={barWidth / 2}
                                className={cn("transition-all duration-300", isMuted ? "opacity-20 group-hover/bar:opacity-40" : "drop-shadow-[0_0_12px_rgba(0,0,0,0.3)] group-hover/bar:brightness-125")}
                            />
                            <text x={x + barWidth / 2} y={height - 2} textAnchor="middle" className="text-[8px] font-black fill-white/10 uppercase tracking-tighter">
                                {d.date ? format(parseISO(d.date), 'EE', { locale: es }).substring(0, 2) : (d.label || '')}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
