
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Printer, Filter, Calendar,
    ArrowUpRight, ArrowDownRight, Users, Clock,
    TrendingUp, Shield, Baby, Music, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

export default function ReportsPage() {
    const [selectedMonth, setSelectedMonth] = useState('Febrero 2026');
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                        <FileText className="h-10 w-10 text-emerald-500" />
                        Reportes <span className="text-emerald-500">Sintetizados</span>
                    </h2>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">
                        Análisis de Fidelidad e Impacto en la Iglesia
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase">
                            <Filter className="w-3 h-3 mr-2 text-emerald-500" /> Filtrar
                        </Button>
                        <div className="w-px h-4 bg-white/10" />
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase text-white hover:text-emerald-400 transition-colors">
                            {selectedMonth} <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 gap-2 font-black uppercase text-[10px]">
                        <Printer className="w-4 h-4" /> Imprimir
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-black uppercase text-[10px] min-w-[140px]"
                    >
                        {isGenerating ? (
                            <>Generando...</>
                        ) : (
                            <><Download className="w-4 h-4" /> Exportar PDF</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block border-b-4 border-emerald-500 pb-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic italic text-emerald-600">LLDM RODEO APP</h1>
                        <p className="uppercase tracking-[0.3em] font-bold text-slate-600">Reporte Mensual de Asistencia</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black uppercase">{selectedMonth}</p>
                        <p className="text-xs text-slate-500">Generado: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Asistencia Promedio"
                    value="—%"
                    change="0%"
                    trend="up"
                    icon={TrendingUp}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Nuevos Registros"
                    value="0"
                    change="0"
                    trend="up"
                    icon={Users}
                    color="text-primary"
                />
                <StatCard
                    title="Puntualidad"
                    value="—%"
                    change="0%"
                    trend="up"
                    icon={Clock}
                    color="text-amber-500"
                />
                <StatCard
                    title="Actividad de Niños"
                    value="—%"
                    change="0%"
                    trend="up"
                    icon={Baby}
                    color="text-cyan-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Groups Breakdown */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-1 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Distribución por Grupos
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Resumen de participación activa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-4">
                        <AttendanceBar label=" Adultos (Varones/Hnas)" percent={0} value="0" color="bg-primary shadow-primary/50" />
                        <AttendanceBar label="Solos y Solas" percent={0} value="0" color="bg-emerald-500 shadow-emerald-500/50" />
                        <AttendanceBar label="Niños (Escuela Dominical)" percent={0} value="0" color="bg-cyan-400 shadow-cyan-400/50" />
                        <AttendanceBar label="Miembros del Coro" percent={0} value="0" color="bg-indigo-500 shadow-indigo-500/50" />

                        <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Users className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Miembros Registrados</p>
                                <p className="text-2xl font-black text-white italic tracking-tighter">0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Synthesis Table */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-2 border-t-4 border-t-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Fidelidad de Responsabilidades
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Cumplimiento de Monitores y Responsables</CardDescription>
                        </div>
                        <div className="print:hidden">
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase hover:text-emerald-400">Ver Todos</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-y border-white/5 bg-white/5">
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Responsable</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Grupo</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Previstos</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Cumplidos</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Eficiencia</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {([].map((row: any, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                            <td colSpan={5} className="py-8 text-center text-xs text-slate-500 font-bold uppercase tracking-widest italic">No hay datos de eficiencia registrados.</td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Flow Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 rounded-3xl bg-secondary/5 border border-secondary/10 flex items-center justify-center gap-4 backdrop-blur-xl no-print"
            >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <Music className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] max-w-2xl text-center">
                    Reporte sintetizado generado automáticamente basado en las <span className="text-secondary font-bold">validaciones digitales</span> del Responsable de Asistencia y los sistemas de seguridad infantil.
                </p>
            </motion.div>
        </div>
    );
}

