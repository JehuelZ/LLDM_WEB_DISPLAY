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
    data: ChartDataPoint[];
    color?: string;
    isSmooth?: boolean;
    showHighlight?: boolean;
}

export const TactileAreaChart = ({ data, color = "#f59e0b", isSmooth = true, showHighlight = true }: ChartProps) => {
    if (!data || data.length === 0) return <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-white/20">SIN DATOS</div>;

    const width = 400;
    const height = 150;
    const padding = 20;
    
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * (width - padding * 2) + padding,
        y: height - (((d.attended || d.value || 0) / (d.total || 100)) * (height - padding * 2)) - padding,
        val: d.attended || d.value || 0,
        label: d.date || d.label
    }));

    const getCurvePath = (pts: any[]) => {
        if (pts.length < 2) return "";
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i - 1, 0)];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[Math.min(i + 2, pts.length - 1)];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return path;
    };

    const linePath = isSmooth ? getCurvePath(points) : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    const highlightPoint = points[points.length - 1];

    return (
        <div className="relative w-full h-full group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id={`${color.replace('#', '')}areaGradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <g key={v}>
                        <line x1={padding} y1={padding + (height - padding * 2) * v} x2={width - padding} y2={padding + (height - padding * 2) * v} stroke="currentColor" className="text-white/5" strokeWidth="1" />
                        <text x={padding - 5} y={padding + (height - padding * 2) * v + 3} textAnchor="end" className="fill-white/10 text-[6px] font-black">{Math.round((1-v) * 100)}%</text>
                    </g>
                ))}
                <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} d={areaPath} fill={`url(#${color.replace('#', '')}areaGradient)`} className="pointer-events-none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                {showHighlight && highlightPoint && (
                    <g className="filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} cx={highlightPoint.x} cy={highlightPoint.y} r="6" fill="#fff" stroke={color} strokeWidth="3" />
                        <foreignObject x={highlightPoint.x - 30} y={highlightPoint.y - 45} width="60" height="30">
                            <div className="flex flex-col items-center justify-center">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="px-2 py-0.5 bg-white text-[10px] font-black text-black rounded-md shadow-lg">{Math.round(highlightPoint.val)}%</motion.div>
                                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
                            </div>
                        </foreignObject>
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
