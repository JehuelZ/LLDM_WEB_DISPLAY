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
    // Determine if we have real data
    const hasData = data && data.length > 0 && data.some(d => (d.attended || d.value || 0) > 0);

    // Generate beautiful demo data if no real data exists
    const demoData = Array.from({ length: 31 }, (_, i) => ({
        label: (i + 1).toString(),
        value: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
        total: 100
    }));

    const activeData = hasData ? data : demoData;
    
    if (!activeData || activeData.length === 0) return <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-white/20">SIN DATOS</div>;

    const width = 440;
    const height = 290;
    const paddingX = 2; 
    const paddingY = 65; 
    
    const points = activeData.map((d, i) => ({
        x: (i / (activeData.length - 1 || 1)) * (width - paddingX * 2) + paddingX,
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

    const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    
    // Find index for today to set as default
    const todayIndex = React.useMemo(() => {
        const today = new Date().getDate().toString();
        const idx = activeData.findIndex(d => d.label === today);
        return idx >= 0 ? idx : activeData.length - 1;
    }, [activeData]);
    
    const handleInteraction = (clientX: number, target: SVGSVGElement) => {
        const rect = target.getBoundingClientRect();
        const svgX = ((clientX - rect.left) / rect.width) * width;
        
        let nearestIdx = 0;
        let minDist = Infinity;
        
        points.forEach((p, i) => {
            const dist = Math.abs(p.x - svgX);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = i;
            }
        });
        
        if (nearestIdx !== hoverIdx) {
            setHoverIdx(nearestIdx);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        handleInteraction(e.clientX, e.currentTarget);
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        setIsDragging(true);
        handleInteraction(e.clientX, e.currentTarget);
    };

    const linePath = isSmooth ? getCurvePath(points) : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Use today's index as default if not hovering or dragging
    const displayIdx = hoverIdx !== null ? hoverIdx : todayIndex;
    const highlightPoint = points[displayIdx];

    const gradientId = `line-gradient-${color.replace('#', '')}`;
    const filterId = `serpent-glow-${color.replace('#', '')}`;

    return (
        <div className="relative w-full h-full group select-none overflow-visible">
             {!hasData && (
                <div className="absolute top-10 right-10 z-20 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                    VISTA PREVIA (SIN DATOS)
                </div>
            )}
            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full overflow-visible touch-none cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                    setIsDragging(true);
                    handleInteraction(e.touches[0].clientX, e.currentTarget);
                }}
                onTouchMove={(e) => {
                    if (!isDragging) return;
                    handleInteraction(e.touches[0].clientX, e.currentTarget);
                }}
                onTouchEnd={() => setIsDragging(false)}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="50%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
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

                {/* Triple Glow Engine: Base Aura (Match Donut Intensity) */}
                <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }} 
                    animate={{ pathLength: 1, opacity: 0.5 }} 
                    transition={{ duration: 4, ease: "easeInOut" }} 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="15" 
                    strokeLinecap="round" 
                    className={`blur-[15px] drop-shadow-[0_0_20px_${color}]`}
                />

                {/* Main Serpent Line with Vibrant Glow */}
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
                    className={`drop-shadow-[0_0_18px_${color}cc]`}
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

                {/* Premium Floating Tooltip (Interactive Scrubbing) */}
                {showHighlight && highlightPoint && (
                    <g className="pointer-events-none">
                        <motion.foreignObject 
                            initial={{ opacity: 0, scale: 0.6 }} 
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                x: Math.max(5, Math.min(width - 75, highlightPoint.x - 35)),
                                y: Math.max(5, highlightPoint.y - 85)
                            }} 
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                            animate={{ 
                                scale: 1,
                                cx: highlightPoint.x,
                                cy: highlightPoint.y
                            }} 
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

export const TactileBarChart = ({ data, totalMembers = 100 }: { data: any[], totalMembers?: number }) => {
    // Check if we have real data (at least one non-zero value in any session)
    const hasData = data && data.length > 0 && data.some(d => 
        d.sessions && (d.sessions['5am'] > 0 || d.sessions['9am'] > 0 || d.sessions['evening'] > 0)
    );
    
    // Triple session demo data if real data is missing (Fixed days LU-DO)
    const demoData = [
        { label: 'LU', sessions: { '5am': 25, '9am': 15, 'evening': 45 } },
        { label: 'MA', sessions: { '5am': 30, '9am': 40, 'evening': 55 } },
        { label: 'MI', sessions: { '5am': 20, '9am': 10, 'evening': 35 } },
        { label: 'JU', sessions: { '5am': 45, '9am': 60, 'evening': 70 } },
        { label: 'VI', sessions: { '5am': 35, '9am': 25, 'evening': 50 } },
        { label: 'SA', sessions: { '5am': 10, '9am': 15, 'evening': 40 } },
        { label: 'DO', sessions: { '5am': 60, '9am': 85, 'evening': 95 } },
    ];

    const activeData = hasData ? data : demoData;

    const width = 450;
    const height = 220;
    const paddingX = 40; // Symmetric padding for perfect centering
    const paddingBottom = 45;
    const paddingTop = 45;
    
    const chartAreaWidth = width - (paddingX * 2);
    const numSlots = 7;
    const slotWidth = chartAreaWidth / numSlots;
    
    const barWidth = 8;
    const barSpacing = 4;
    const totalGroupWidth = (barWidth * 3) + (barSpacing * 2);

    const sessionConfig = [
        { key: '5am' as const, color: '#3b82f6' },
        { key: '9am' as const, color: '#f43f5e' },
        { key: 'evening' as const, color: '#f59e0b' }
    ];

    const fixedLabels = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

    return (
        <div className="relative w-full h-full group select-none overflow-visible">
            {!hasData && (
                <div className="absolute top-2 right-10 z-20 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                    VISTA PREVIA
                </div>
            )}
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    {sessionConfig.map(s => (
                        <linearGradient key={s.color} id={`barGrad-${s.color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={s.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={s.color} stopOpacity="0.2" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Y-Axis Labels - Absolute Position (Internal) */}
                {[0, 0.5, 1].map(multiplier => {
                    const absVal = Math.round(totalMembers * multiplier);
                    const y = height - paddingBottom - (multiplier * (height - paddingTop - paddingBottom));
                    return (
                        <g key={multiplier}>
                            {/* Subtle Grid Line */}
                            <line 
                                x1={paddingX} y1={y} 
                                x2={width - paddingX} y2={y} 
                                stroke="white" strokeWidth="1" strokeOpacity="0.03"
                                strokeDasharray="2 4"
                            />
                            <text 
                                x={paddingX - 10} 
                                y={y + 3} 
                                textAnchor="end"
                                className="fill-white/10 text-[8px] font-black uppercase tracking-widest"
                            >
                                {absVal}
                            </text>
                        </g>
                    );
                })}

                {/* Grid Slots */}
                {Array.from({ length: 7 }).map((_, i) => {
                    const slotCenterX = paddingX + (i * slotWidth) + (slotWidth / 2);
                    const groupStartX = slotCenterX - (totalGroupWidth / 2);
                    
                    const dayData = activeData[i] || { sessions: { '5am': 0, '9am': 0, 'evening': 0 }, label: fixedLabels[i] };
                    let displayLabel = dayData.label || fixedLabels[i];
                    if (dayData.date) {
                        displayLabel = format(parseISO(dayData.date), 'EEEEEE', { locale: es }).toUpperCase();
                    }

                    return (
                        <g key={i}>
                            {sessionConfig.map((s, j) => {
                                const val = dayData.sessions ? (dayData.sessions[s.key] || 0) : 0;
                                if (val <= 0) return null; // REMOVE GHOST BARS

                                const ratio = Math.min(1, val / (totalMembers || 100));
                                const h = Math.max(8, ratio * (height - paddingTop - paddingBottom));
                                const x = groupStartX + j * (barWidth + barSpacing);
                                const y = height - paddingBottom - h;
                                const gradId = `barGrad-${s.color.replace('#', '')}`;

                                return (
                                    <g key={s.key} className="group/bar">
                                        {/* Main Pill */}
                                        <motion.rect
                                            initial={{ height: 0, y: height - paddingBottom }}
                                            animate={{ height: h, y: y }}
                                            transition={{ duration: 0.6, delay: (i * 0.04) + (j * 0.02), ease: "circOut" }}
                                            x={x} width={barWidth}
                                            fill={`url(#${gradId})`}
                                            rx={barWidth / 2}
                                            style={{ 
                                                filter: val > 0 ? `drop-shadow(0 0 8px ${s.color}66)` : 'none'
                                            }}
                                            className={cn(
                                                "transition-all duration-300 transition-opacity",
                                                val <= 0 && "opacity-0"
                                            )}
                                        />
                                        
                                        {/* Glow Layer (Mirror bar base exactly) */}
                                        {val > 0 && (
                                            <motion.rect
                                                initial={{ height: 0, y: height - paddingBottom, opacity: 0 }}
                                                animate={{ height: h, y: y, opacity: 0.15 }}
                                                transition={{ duration: 0.6, delay: (i * 0.04) + (j * 0.02), ease: "circOut" }}
                                                x={x - 4} width={barWidth + 8}
                                                fill={s.color}
                                                rx={(barWidth + 8) / 2}
                                                className="blur-[10px] pointer-events-none"
                                            />
                                        )}
                                        
                                        {/* Hover Count */}
                                        <text 
                                            x={x + barWidth / 2} 
                                            y={y - 10} 
                                            textAnchor="middle" 
                                            className="fill-white font-black text-[9px] opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none tabular-nums drop-shadow-lg"
                                        >
                                            {Math.round(val)}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Center Day Label */}
                            <text 
                                x={slotCenterX} 
                                y={height - 15} 
                                textAnchor="middle" 
                                className="fill-white/30 text-[9px] font-black uppercase tracking-widest"
                            >
                                {displayLabel}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
