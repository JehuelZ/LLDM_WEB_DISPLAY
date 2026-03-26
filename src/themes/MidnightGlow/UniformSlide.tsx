'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, CheckCircle2, Award, Users, User, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ─────────────────────────────────────────────
// THEME: Tech Corporate — Uniform Slide
// Paleta: navy #040D21 · card #0D1B3E · neon-green #A3FF57 · blue-bright #4F7FFF
// ─────────────────────────────────────────────

export function MidnightGlowUniform() {
    const uniforms = useAppStore((state: any) => state.uniforms);
    const uniformSchedule = useAppStore((state: any) => state.uniformSchedule);
    
    const now = new Date();
    const dateKey = format(now, 'yyyy-MM-dd');
    const uniformId = uniformSchedule[dateKey];
    const todayUniform = uniforms.find((u: any) => u.id === uniformId);

    // Fallback si no hay uniforme asignado
    if (!todayUniform) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                <Shirt className="w-16 h-16 opacity-20" />
                <p className="text-xl font-bold uppercase tracking-[0.2em]">Sin uniforme asignado hoy</p>
                <p className="text-sm opacity-60">Consulte el calendario de coros</p>
            </div>
        );
    }

    const { varones, hermanas, name } = todayUniform;

    return (
        <div className="flex flex-col h-full w-full px-12 py-10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

            {/* Header Area */}
            <div className="flex items-end justify-between mb-16 relative z-10 border-b border-white/5 pb-8">
                <div className="flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-2"
                    >
                        <div className="w-12 h-1 bg-[#A3FF57] rounded-full shadow-[0_0_15px_#A3FF57]" />
                        <span className="text-[#A3FF57] font-black uppercase tracking-[0.4em] text-xs">Presentación Oficial</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none"
                    >
                        Uniforme <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7FFF] to-[#A3FF57]">del Día</span>
                    </motion.h1>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-white italic lowercase opacity-40">{format(now, 'EEEE dd', { locale: es })}</span>
                    <div className="px-4 py-1 bg-[#0D1B3E] border border-[#4F7FFF]/30 rounded-full mt-2">
                        <span className="text-[#4F7FFF] text-[10px] font-black uppercase tracking-widest">{name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-12 flex-1 relative z-10">
                {/* VARONES */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative group h-full"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-[#4F7FFF]/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative h-full bg-[#0D1B3E]/80 backdrop-blur-3xl border-2 border-[#1E3A6E] rounded-[3rem] p-10 flex flex-col shadow-2xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#040D21] border border-[#4F7FFF]/40 flex items-center justify-center shadow-inner">
                                <User className="w-8 h-8 text-[#4F7FFF]" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sección <span className="text-[#4F7FFF]">Varones</span></h3>
                                <div className="h-1 w-12 bg-[#4F7FFF]/30 rounded-full mt-1" />
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <UniformItem label="Traje / Saco" value={varones?.traje} icon={<Award className="w-4 h-4" />} />
                            <UniformItem label="Camisa" value={varones?.camisa} icon={<Shirt className="w-4 h-4" />} color="blue" />
                            <UniformItem label="Pantalón" value={varones?.pantalon} icon={<Users className="w-4 h-4" />} />
                            <UniformItem label="Corbata" value={varones?.corbata} icon={<Flame className="w-4 h-4" />} color="accent" />
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-8 right-8 text-[#4F7FFF]/5 font-black text-8xl italic pointer-events-none select-none">MEN</div>
                    </div>
                </motion.div>

                {/* HERMANAS */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative group h-full"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-[#A3FF57]/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative h-full bg-[#0D1B3E]/80 backdrop-blur-3xl border-2 border-[#1E3A6E] rounded-[3rem] p-10 flex flex-col shadow-2xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#040D21] border border-[#A3FF57]/40 flex items-center justify-center shadow-inner">
                                <Users className="w-8 h-8 text-[#A3FF57]" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sección <span className="text-[#A3FF57]">Hermanas</span></h3>
                                <div className="h-1 w-12 bg-[#A3FF57]/30 rounded-full mt-1" />
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <UniformItem label="Toga / Vestido" value={hermanas?.toga} icon={<Award className="w-4 h-4" />} color="emerald" />
                            <UniformItem label="Blusa" value={hermanas?.blusa} icon={<Shirt className="w-4 h-4" />} color="emerald" />
                            <UniformItem label="Falda" value={hermanas?.falda} icon={<Users className="w-4 h-4" />} color="emerald" />
                            <UniformItem label="Chalina" value={hermanas?.chalina} icon={<SparklesIcon className="w-4 h-4" />} color="emerald" />
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-8 right-8 text-[#A3FF57]/5 font-black text-8xl italic pointer-events-none select-none">WOMEN</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
);

function UniformItem({ label, value, icon, color = 'blue' }: { label: string; value?: string; icon: React.ReactNode; color?: 'blue' | 'emerald' | 'accent' }) {
    if (!value) return null;

    const colors = {
        blue: "text-[#4F7FFF] bg-[#4F7FFF]/10 border-[#4F7FFF]/20",
        emerald: "text-[#A3FF57] bg-[#A3FF57]/10 border-[#A3FF57]/20",
        accent: "text-amber-400 bg-amber-400/10 border-amber-400/20"
    };

    return (
        <div className="flex items-center gap-4 group/item">
            <div className={`p-3 rounded-xl border ${colors[color]} group-hover/item:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{label}</span>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white uppercase tracking-tight">{value}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A3FF57]/50" />
                </div>
            </div>
        </div>
    );
}
