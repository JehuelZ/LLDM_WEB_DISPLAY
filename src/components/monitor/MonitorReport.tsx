'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Users, Clock,
    TrendingUp, UserCheck, Baby, ChevronDown, Calendar, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppStore, ReportMemberData } from '@/lib/store';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <Card className="glass-card bg-white/5 border-white/10 overflow-hidden relative group">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", color)}>
            <Icon className="w-full h-full" />
        </div>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-md bg-white/5 border border-white/10", color)}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h3>
            <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{value}</p>
            {sub && <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{sub}</p>}
        </CardContent>
    </Card>
);

const AttendanceBar = ({ label, percent, color, value }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-black text-white">{value} <span className="text-[10px] text-slate-500 not-italic uppercase tracking-widest font-bold ml-1">Miembros</span></span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={cn("h-full transition-all duration-1000", color)}
            />
        </div>
    </div>
);

export function MonitorReport() {
    const { members, loadMembersFromCloud, loadAttendanceReportData } = useAppStore();

    // Generate last 6 months
    const months = useMemo(() => Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), i);
        return { label: format(d, 'MMMM yyyy', { locale: es }), value: format(d, 'yyyy-MM') };
    }), []);

    const [selectedMonth, setSelectedMonth] = useState(months[0].value);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState<ReportMemberData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadMembersFromCloud();
    }, []);

    // Load real data when month changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [y, m] = selectedMonth.split('-').map(Number);
                const start = format(startOfMonth(new Date(y, m - 1)), 'yyyy-MM-dd');
                const end = format(endOfMonth(new Date(y, m - 1)), 'yyyy-MM-dd');
                const data = await loadAttendanceReportData(start, end);
                setReportData(data);
            } catch (err) {
                console.error('Error loading monitor report data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        if (members.length > 0) {
            fetchData();
        }
    }, [selectedMonth, members.length]);

    // Compute real stats from report data
    const stats = useMemo(() => {
        const totalMembers = members.filter(m => m.status === 'Activo' && !m.hide_from_attendance).length;
        const avgPct = reportData.length > 0 ? Math.round(reportData.reduce((a, m) => a + m.percentage, 0) / reportData.length) : 0;

        // Group breakdown using real data
        const getGroupData = (filterFn: (m: ReportMemberData) => boolean) => {
            const filtered = reportData.filter(filterFn);
            const count = filtered.length;
            const avg = count > 0 ? Math.round(filtered.reduce((a, m) => a + m.percentage, 0) / count) : 0;
            return { count, avg };
        };

        const adultos = getGroupData(m => {
            const g = (m.member_group || '').toLowerCase();
            return !g.includes('niñ') && !g.includes('nin') && m.category?.toLowerCase() !== 'niño' && !g.includes('joven') && !g.includes('juvenil');
        });

        const ninos = getGroupData(m => {
            const g = (m.member_group || '').toLowerCase();
            return g.includes('niñ') || g.includes('nin') || m.category?.toLowerCase() === 'niño';
        });

        const jovenes = getGroupData(m => {
            const g = (m.member_group || '').toLowerCase();
            return g.includes('joven') || g.includes('juvenil');
        });

        const coro = getGroupData(m => {
            const g = (m.member_group || '').toLowerCase();
            return g.includes('coro');
        });

        return { totalMembers, avgPct, adultos, ninos, jovenes, coro };
    }, [reportData, members]);

    const getStatusLabel = (pct: number) => {
        if (pct >= 80) return 'Excelente';
        if (pct >= 50) return 'Requiere Atención';
        return 'Crítico';
    };

    const handlePrint = () => {
        setIsGenerating(true);
        setTimeout(() => {
            window.print();
            setIsGenerating(false);
        }, 800);
    };

    const selectedLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full mb-32 md:mb-10" id="pdf-report-container">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                        <FileText className="h-10 w-10 text-emerald-500" />
                        Reportes <span className="text-emerald-500">Mensuales</span>
                    </h2>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">
                        Datos reales de asistencia ({stats.totalMembers} Miembros Activos)
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 p-1.5 rounded-md flex items-center gap-2 flex-grow md:flex-grow-0 justify-center">
                        <Calendar className="w-4 h-4 ml-2 text-emerald-500" />
                        <select
                            className="bg-transparent text-[11px] font-black uppercase text-white hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer py-1.5 pr-2 capitalize"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value} className="bg-[#0f172a] text-white py-2 capitalize">{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <Button
                        onClick={handlePrint}
                        variant="outline"
                        disabled={isGenerating || isLoading}
                        className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 gap-2 font-black uppercase tracking-widest text-[10px] w-full md:w-auto h-12 rounded-md"
                    >
                        {isGenerating ? <TrendingUp className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isGenerating ? 'Procesando...' : 'Descargar PDF'}
                    </Button>
                </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:block border-b-4 border-emerald-500 pb-6 mb-8 mt-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black uppercase text-emerald-600">Reporte de Asistencia</h1>
                        <p className="uppercase tracking-[0.3em] font-extrabold text-slate-400 mt-2">Reporte Oficial — Datos Verificados</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black uppercase text-emerald-500 border border-emerald-500/50 px-4 py-1 inline-block rounded-lg capitalize">{selectedLabel}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-3">Generado: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Consultando datos de asistencia...</p>
                </div>
            ) : (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard title="Promedio General" value={`${stats.avgPct}%`} sub="Calculado de datos reales" icon={TrendingUp} color="text-emerald-500" />
                        <StatCard title="Total Membresía" value={stats.totalMembers.toString()} sub="Miembros activos" icon={Users} color="text-primary" />
                        <StatCard title="Adultos" value={`${stats.adultos.avg}%`} sub={`${stats.adultos.count} miembros`} icon={UserCheck} color="text-emerald-500" />
                        <StatCard title="Niños" value={`${stats.ninos.avg}%`} sub={`${stats.ninos.count} niños`} icon={Baby} color="text-cyan-400" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Groups Breakdown */}
                        <Card className="glass-card bg-white/5 border-white/10 lg:col-span-1 border-t-4 border-t-primary">
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl font-black uppercase text-white flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Distribución Activa
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Métricas reales del periodo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-4">
                                <AttendanceBar label="Adultos" percent={stats.adultos.avg} value={stats.adultos.count.toString()} color="bg-primary" />
                                <AttendanceBar label="Niños" percent={stats.ninos.avg} value={stats.ninos.count.toString()} color="bg-cyan-400" />
                                <AttendanceBar label="Jóvenes" percent={stats.jovenes.avg} value={stats.jovenes.count.toString()} color="bg-indigo-500" />

                                <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-4">
                                    <div className="w-14 h-14 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                        <Users className="w-7 h-7 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Base de Datos</p>
                                        <p className="text-3xl font-black text-white tracking-tighter">{stats.totalMembers} <span className="text-sm opacity-50 uppercase tracking-widest font-bold">Activos</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Group Table with real data */}
                        <Card className="glass-card bg-white/5 border-white/10 lg:col-span-2 border-t-4 border-t-emerald-500 overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg md:text-xl font-black uppercase text-white flex items-center gap-3">
                                        <UserCheck className="w-5 h-5 text-emerald-500" />
                                        Analítica por Grupo ({selectedLabel})
                                    </CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Datos reales de la base de datos</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full min-w-[500px]">
                                    <thead>
                                        <tr className="border-y border-white/5 bg-black/40">
                                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-emerald-500">Grupo</th>
                                            <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Población</th>
                                            <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Asistencia (%)</th>
                                            <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-emerald-400">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 bg-foreground/5">
                                        {[
                                            { label: 'Adultos', data: stats.adultos },
                                            { label: 'Niños', data: stats.ninos },
                                            { label: 'Jóvenes', data: stats.jovenes },
                                        ].map(group => (
                                            <tr key={group.label} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-white text-sm">{group.label}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center font-black text-slate-300">{group.data.count}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 font-black px-3 py-1 rounded-md border",
                                                        group.data.avg >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                                                        group.data.avg >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                                                        "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                                    )}>
                                                        {group.data.avg}% <TrendingUp className="w-3 h-3" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={cn("text-[10px] font-black uppercase",
                                                        group.data.avg >= 80 ? "text-emerald-500" : group.data.avg >= 50 ? "text-amber-400" : "text-rose-400"
                                                    )}>
                                                        {getStatusLabel(group.data.avg)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="hover:bg-white/5 transition-colors bg-black/20">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-emerald-500 text-sm uppercase">Total General</p>
                                            </td>
                                            <td className="px-6 py-4 text-center font-black text-emerald-400">{stats.totalMembers}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-2 font-black text-emerald-500 border-b-2 border-emerald-500 pb-0.5">
                                                    {stats.avgPct}% AVG
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
                </>
            )}

            <div className="mt-8 text-center no-print">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    Responsable de Asistencia • Datos verificados de Supabase
                </p>
            </div>
        </div>
    );
}
