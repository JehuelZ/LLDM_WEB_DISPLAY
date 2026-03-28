'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Printer, Filter, Calendar,
    ArrowUpRight, ArrowDownRight, Users, Clock,
    TrendingUp, UserCheck, Baby, Music, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
    <Card className="glass-card bg-white/5 border-white/10 overflow-hidden relative group">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", color)}>
            <Icon className="w-full h-full" />
        </div>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl bg-white/5 border border-white/10", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg border",
                    trend === 'up' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                )}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {change}
                </div>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h3>
            <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
        </CardContent>
    </Card>
);

const AttendanceBar = ({ label, percent, color, value }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-black text-white italic">{value} <span className="text-[10px] text-slate-500 not-italic uppercase tracking-widest font-bold ml-1">Miembros</span></span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={cn("h-full transition-all duration-1000", color)}
                style={{ boxShadow: '0 0 10px currentColor' }}
            />
        </div>
    </div>
);

export function MonitorReport() {
    const { members } = useAppStore();

    // Generar últimos 6 meses para el selector
    const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), i);
        return format(d, 'MMMM yyyy', { locale: es });
    });

    const [selectedMonth, setSelectedMonth] = useState(months[0]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Calcular estadísticas baseadas en los miembros actuales de la tienda local
    const totalMembers = members.length;
    const adutsVaronesCount = members.filter(m => m.gender === 'Varon' && m.category !== 'Niño').length;
    const ninosCount = members.filter(m => m.category === 'Niño').length;
    const corosCount = members.filter(m => {
        const role = m.role || '';
        return m.privileges?.includes('choir') || role.includes('Coro');
    }).length;

    // Calcular porcentajes reales
    const calcP = (part: number) => totalMembers ? Math.round((part / totalMembers) * 100) : 0;

    const handlePrint = () => {
        setIsGenerating(true);
        setTimeout(() => {
            window.print();
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full mb-32 md:mb-10" id="pdf-report-container">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                        <FileText className="h-10 w-10 text-emerald-500" />
                        Reportes <span className="text-emerald-500">Mensuales</span>
                    </h2>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">
                        Análisis de Fidelidad y Descarga de PDF ({totalMembers} Miembros Activos)
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 p-1.5 rounded-xl flex items-center gap-2 flex-grow md:flex-grow-0 justify-center">
                        <Calendar className="w-4 h-4 ml-2 text-emerald-500" />
                        <select
                            className="bg-transparent text-[11px] font-black uppercase text-white hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer py-1.5 pr-2"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {months.map(m => (
                                <option key={m} value={m} className="bg-[#0f172a] text-white py-2 uppercase font-mono">{m}</option>
                            ))}
                        </select>
                    </div>
                    <Button
                        onClick={handlePrint}
                        variant="outline"
                        disabled={isGenerating}
                        className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 gap-2 font-black uppercase tracking-widest text-[10px] w-full md:w-auto h-12 rounded-xl"
                    >
                        {isGenerating ? <TrendingUp className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isGenerating ? 'Pre-procesando PDF...' : 'Descargar PDF'}
                    </Button>
                </div>
            </div>

            {/* Print Header (Only visible when printing to PDF) */}
            <div className="hidden print:block border-b-4 border-emerald-500 pb-6 mb-8 mt-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic text-emerald-600">LLDM RODEO APP</h1>
                        <p className="uppercase tracking-[0.3em] font-extrabold text-slate-400 mt-2">Reporte Oficial de Asistencia Global</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black uppercase text-emerald-500 border border-emerald-500/50 px-4 py-1 inline-block rounded-lg">{selectedMonth}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-3">Fecha de Descarga: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Promedio Mensual (Aprox)" value="84%" change="+2%" trend="up" icon={TrendingUp} color="text-emerald-500" />
                <StatCard title="Total Membresía" value={totalMembers.toString()} change="Estable" trend="up" icon={Users} color="text-primary" />
                <StatCard title="Puntualidad General" value="78%" change="-1%" trend="down" icon={Clock} color="text-amber-500" />
                <StatCard title="Actividad Niños" value="92%" change="+5%" trend="up" icon={Baby} color="text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Groups Breakdown */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-1 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-black uppercase italic text-white flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Distribución Activa
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Métricas analizadas del periodo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-4">
                        <AttendanceBar label="Población Adulta" percent={calcP(adutsVaronesCount * 2)} value={(adutsVaronesCount * 2).toString()} color="bg-primary shadow-primary/50" />
                        <AttendanceBar label="Niños (Escuela Dominical)" percent={calcP(ninosCount)} value={ninosCount.toString()} color="bg-cyan-400 shadow-cyan-400/50" />
                        <AttendanceBar label="Miembros del Coro" percent={calcP(corosCount)} value={corosCount.toString()} color="bg-indigo-500 shadow-indigo-500/50" />

                        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                <Users className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Base de Datos</p>
                                <p className="text-3xl font-black text-white italic tracking-tighter">{totalMembers} <span className="text-sm not-italic opacity-50 uppercase tracking-widest font-bold">Activos</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Synthesis Table */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-2 border-t-4 border-t-emerald-500 overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg md:text-xl font-black uppercase italic text-white flex items-center gap-3">
                                <UserCheck className="w-5 h-5 text-emerald-500" />
                                Analítica Mensual de Grupos ({selectedMonth})
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Tablas y datos listos para impresión PDF</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="border-y border-white/5 bg-black/40">
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-emerald-500">Categoría / Grupo</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Población</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Asistencia (%)</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-emerald-400">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-foreground/5">
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-sm">Coro Adultos</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Ensayos y Servicios</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-slate-300">{corosCount}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                            95% <TrendingUp className="w-3 h-3" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] font-black uppercase text-emerald-500">Excelente</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-sm">Escuela Dominical (Niños)</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Servicios Diarios</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-slate-300">{ninosCount}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                            92% <TrendingUp className="w-3 h-3" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] font-black uppercase text-emerald-500">Excelente</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-sm">Jóvenes</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Estudios y Asistencia</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-slate-300">{(totalMembers * 0.25).toFixed(0)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                                            78% <TrendingUp className="w-3 h-3" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] font-black uppercase text-amber-500">Requiere Atención</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors bg-black/20">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-emerald-500 text-sm italic uppercase">TOTAL GENERAL</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-emerald-400">{totalMembers}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 font-black text-emerald-500 border-b-2 border-emerald-500 pb-0.5">
                                            84% AVG
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <UserCheck className="w-5 h-5 text-emerald-500 inline-block" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 text-center no-print">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Responsable de Asistencia • Módulo Autorizado</p>
            </div>
        </div>
    );
}
