
'use client';

import { motion } from 'framer-motion';
import { Settings, Users, Calendar, CheckCircle2, AlertCircle, Clock, TrendingUp, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

// --- Components ---

const StatDoughnut = ({
    percent,
    label,
    value,
    total,
    color = "primary",
    size = 120
}: {
    percent: number;
    label: string;
    value: number | string;
    total: number | string;
    color?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'amber' | 'cyan';
    size?: number;
}) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const colorMap = {
        primary: "stroke-blue-500",
        secondary: "stroke-purple-500",
        accent: "stroke-pink-500",
        emerald: "stroke-emerald-500",
        amber: "stroke-amber-500",
        cyan: "stroke-cyan-500"
    };

    const glowMap = {
        primary: "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        secondary: "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
        accent: "drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
        emerald: "drop-shadow-[0_0_8_rgba(16,185,129,0.5)]",
        amber: "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        cyan: "drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={circumference} style={{ strokeDashoffset }} strokeLinecap="round" className={cn("transition-all duration-1000 ease-out", colorMap[color], glowMap[color])} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
                    <span className="text-lg font-black text-white">{percent}%</span>
                </div>
            </div>
            {label && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>}
        </div>
    );
};

import { useState, useEffect } from 'react';

export default function ResponsableDashboard() {
    const { currentUser } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
                            <Settings className="h-10 w-10 text-primary" />
                            Panel de <span className="text-primary">{currentUser.role === 'Administrador' ? 'Gestión de Grupos' : 'Responsable'}</span>
                        </h1>
                        <p className="text-muted-foreground font-light">Gestión de Grupo y Oración - LLDM RODEO</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="neon-button gap-2 scale-105">
                            <CheckCircle2 className="h-4 w-4" />
                            Pasar Lista Hoy
                        </Button>
                    </div>
                </div>

                {/* Highlight Stats */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="glass-card bg-primary/5 border-primary/20 p-6 relative overflow-hidden group hover:bg-primary/10 transition-colors">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1">Tu Grupo</p>
                                <h3 className="text-4xl font-black text-foreground italic">Grupo ---</h3>
                                <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-tighter">0 Miembros activos</p>
                            </div>
                            <Users className="h-8 w-8 text-primary/20" />
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                    </Card>

                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-6 flex justify-between items-center group">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Asistencia Semanal</p>
                            <h3 className="text-4xl font-black text-foreground italic">84%</h3>
                            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-bold">
                                <TrendingUp className="h-3 w-3 text-emerald-500" /> +5% VS SEMANA ANTERIOR
                            </p>
                        </div>
                        <StatDoughnut percent={84} label="" value="" total="" size={70} color="emerald" />
                    </Card>

                    <Card className="glass-card bg-secondary/5 border-secondary/20 p-6 flex justify-between items-center group">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Meta Mensual</p>
                            <h3 className="text-4xl font-black text-foreground italic">92%</h3>
                            <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">Faltan 8% para la meta</p>
                        </div>
                        <StatDoughnut percent={92} label="" value="" total="" size={70} color="secondary" />
                    </Card>

                    <Card className="glass-card bg-accent/5 border-accent/20 p-6 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Visitas Pendientes</p>
                            <h3 className="text-3xl font-black text-foreground italic">0 HERMANOS</h3>
                            <div className="mt-4 flex -space-x-2 h-8">
                                {/* No pending visits */}
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Members List specifically for this responsible */}
                    <Card className="lg:col-span-2 glass-card border-none bg-foreground/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black uppercase">Miembros de mi Grupo</CardTitle>
                                <CardDescription>Seguimiento individual de asistencia y participación</CardDescription>
                            </div>
                            <div className="relative w-48 hidden md:block">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                <Input placeholder="Buscar..." className="pl-8 h-8 bg-foreground/5 border-border/40 text-xs" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/20">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Miembro</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center">Asistencias</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Estado</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest italic">
                                                No hay miembros asignados a este grupo
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Tracking Card */}
                    <div className="space-y-6">
                        <Card className="glass-card bg-secondary/5 border-secondary/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-secondary" /> Registro Rápido
                                </CardTitle>
                                <CardDescription>Oración de la mañana (9:00 AM)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-slate-400 italic">No hay responsable asignado hoy.</p>
                                    <Button variant="outline" className="w-full justify-between h-12 px-4 group">
                                        <span>Confirmar Asistencia</span>
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary transition-colors">
                                            <CheckCircle2 className="h-3 w-3 text-secondary group-hover:text-foreground" />
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card bg-red-500/5 border-red-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
                                    <AlertCircle className="h-5 w-5" /> Alertas del Grupo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="p-3 rounded-lg bg-foreground/5 border border-border/20 text-xs text-slate-500 text-center italic">
                                        No hay alertas pendientes.
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
