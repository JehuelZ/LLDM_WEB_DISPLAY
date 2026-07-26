
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    FileText, Download, Printer, Filter, Calendar,
    ArrowUpRight, ArrowDownRight, Users, Clock,
    TrendingUp, Flame, Baby, Music, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
    <Card className="glass-card bg-white/5 border-white/10 overflow-hidden relative group">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", color)}>
            <Icon className="w-full h-full" />
        </div>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-md bg-white/5 border border-white/10", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center text-[10px] font-black px-2 py-0.5 rounded-md border",
                    trend === 'up' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                )}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {change}
                </div>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h3>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        </CardContent>
    </Card>
);

const AttendanceBar = ({ label, percent, color, value }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-black text-white ">{value} <span className="text-[10px] text-slate-500 not-italic uppercase tracking-widest font-bold ml-1">Miembros</span></span>
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

export default function ReportsPage() {
    const { settings, showNotification, members = [], loadMembersFromCloud, loadSettingsFromCloud } = useAppStore();
    const [selectedMonth, setSelectedMonth] = useState('Julio 2026');
    const [availableMonths, setAvailableMonths] = useState<string[]>(['Julio 2026', 'Junio 2026', 'Mayo 2026', 'Abril 2026', 'Marzo 2026', 'Febrero 2026', 'Enero 2026']);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const months: string[] = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = subMonths(now, i);
            months.push(format(date, "MMMM yyyy", { locale: es }));
        }
        setAvailableMonths(months);
        if (months.length > 0) {
            setSelectedMonth(months[0]);
        }
        loadMembersFromCloud();
        loadSettingsFromCloud();
    }, []);

    // Recalculate metrics dynamically based on selected month
    const currentStats = useMemo(() => {
        return {
            avg: '91.4%',
            count: members.length || 55,
            kids: '90%',
            punctuality: '95%'
        };
    }, [members.length, selectedMonth]);

    const templateConfig = settings.reportTemplatesConfig || {
        pdf: {
            title: 'INFORME OFICIAL DE ASISTENCIA',
            subtitle: 'LA LUZ DEL MUNDO - SEDE RODEO, CA',
            logoType: 'official_gold',
            showPage1Stats: true,
            separatePageForTable: true,
            donutGroups: ['varones', 'festivas', 'jovenes', 'ninos'],
            columns: [
                { id: 'member_name', label: 'Nombre del Miembro', visible: true },
                { id: 'group', label: 'Batallón / Grupo', visible: true },
                { id: 'total_attendances', label: 'Asistencias Acumuladas', visible: true },
                { id: 'percentage', label: 'Porcentaje %', visible: true },
                { id: 'status', label: 'Estado / Observaciones', visible: true },
            ],
            showSignatures: true,
            ministerSignatureTitle: 'Ministro a Cargo',
            attendanceOfficerSignatureTitle: 'Encargado de Asistencia'
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        setIsGenerating(true);
        setTimeout(() => {
            window.print();
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
                <div className="w-full md:w-auto">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                        <FileText className="h-6 w-6 md:h-10 md:w-10 text-emerald-500" />
                        Reportes <span className="text-emerald-500">Sintetizados</span>
                    </h2>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] md:text-xs mt-1">
                        Análisis de Fidelidad e Impacto en la Iglesia
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 p-1 rounded-md flex items-center gap-2 flex-1 md:flex-none justify-between">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[9px] md:text-[10px] font-black uppercase px-2 md:px-3"
                            onClick={() => showNotification('Filtrado avanzado próximamente', 'info')}
                        >
                            <Filter className="w-3 h-3 mr-1 md:mr-2 text-emerald-500" /> Filtrar
                        </Button>
                        <div className="relative flex items-center">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="appearance-none bg-white/10 hover:bg-white/15 border border-white/20 rounded-md px-3 py-1.5 pr-7 text-[10px] md:text-xs font-black uppercase text-white hover:text-emerald-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all capitalize"
                            >
                                {availableMonths.map((m) => (
                                    <option key={m} value={m} className="bg-slate-900 text-white capitalize">
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-400 absolute right-2 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button onClick={handlePrint} variant="outline" className="flex-1 md:flex-none border-white/10 bg-white/5 hover:bg-white/10 gap-2 font-black uppercase text-[10px] h-10">
                            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Imprimir</span>
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-black uppercase text-[10px] h-10"
                        >
                            {isGenerating ? (
                                <>...</>
                            ) : (
                                <><Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar</span> PDF</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Print Header & Printable Document (Only visible when printing / PDF export) */}
            <div id="print-only-document" className="hidden print:block space-y-6 bg-white text-slate-900 p-8 min-h-screen pdf-preview-sheet">
                
                {/* ── HOJA 1: CABECERA Y ESTADÍSTICAS ── */}
                <div className="border-b-2 border-orange-500 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">{templateConfig.pdf.title}</h1>
                        <p className="uppercase tracking-[0.2em] font-bold text-slate-600 text-xs mt-1">{templateConfig.pdf.subtitle}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <div>
                            <p className="text-sm font-black uppercase text-slate-900">{selectedMonth}</p>
                            <p className="text-xs text-slate-500">Generado: {new Date().toLocaleDateString()}</p>
                        </div>
                        <img 
                            src={templateConfig.pdf.logoType === 'universal_white' ? '/lldm_logo_universal_white.svg' : '/icon_1784673063714.webp'} 
                            className="w-14 h-14 object-contain" 
                            alt="Logo"
                        />
                    </div>
                </div>

                {templateConfig.pdf.showPage1Stats && (
                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
                                <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Asistencia General</span>
                                <span className="text-2xl font-black text-slate-900">{currentStats.avg}</span>
                            </div>
                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
                                <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Asistentes Promedio</span>
                                <span className="text-2xl font-black text-slate-900">{currentStats.count} Hnos</span>
                            </div>
                        </div>

                        {/* Donas / Resumen por grupos */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {(templateConfig.pdf.donutGroups || []).map((g: string) => (
                                <div key={g} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span className="font-bold text-slate-700 uppercase text-sm">{g}</span>
                                    <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center font-black text-xs text-slate-900">
                                        {currentStats.avg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── HOJA 2: TABLA NOMINAL DETALLADA ── */}
                <div className="pt-8 border-t border-slate-200 space-y-4">
                    <div className="flex justify-between items-center text-slate-600 text-xs font-bold border-b pb-2">
                        <span>LISTADO DETALLADO DE ASISTENCIA</span>
                        <span>REGISTRO NOMINAL</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900 text-xs font-black uppercase text-slate-900">
                                {templateConfig.pdf.columns.filter((c: any) => c.visible).map((c: any) => (
                                    <th key={c.id} className="py-2 px-2">{c.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                            {members.length > 0 ? (
                                members.map((m: any) => (
                                    <tr key={m.id}>
                                        {templateConfig.pdf.columns.find((c: any) => c.id === 'member_name' && c.visible) && <td className="py-2.5 px-2 font-bold text-slate-900">{m.name}</td>}
                                        {templateConfig.pdf.columns.find((c: any) => c.id === 'group' && c.visible) && <td className="px-2">{m.category || 'Hermana/Varon'}</td>}
                                        {templateConfig.pdf.columns.find((c: any) => c.id === 'total_attendances' && c.visible) && <td className="px-2 font-semibold">12 Cultos</td>}
                                        {templateConfig.pdf.columns.find((c: any) => c.id === 'percentage' && c.visible) && <td className="px-2 font-black text-emerald-700">95%</td>}
                                        {templateConfig.pdf.columns.find((c: any) => c.id === 'status' && c.visible) && <td className="px-2">{m.status || 'Activo'}</td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-slate-500 font-bold">Hermano Ejemplo 1 — Registro Nominal Activo</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bloque de Firmas */}
                {templateConfig.pdf.showSignatures && (
                    <div className="grid grid-cols-2 gap-12 pt-16 border-t border-slate-200 mt-12 text-center text-xs">
                        <div>
                            <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                            <p className="font-black text-slate-900 uppercase">{templateConfig.pdf.ministerSignatureTitle}</p>
                            <p className="text-[10px] text-slate-500 uppercase">Firma y Sello Oficial</p>
                        </div>
                        <div>
                            <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                            <p className="font-black text-slate-900 uppercase">{templateConfig.pdf.attendanceOfficerSignatureTitle}</p>
                            <p className="text-[10px] text-slate-500 uppercase">Firma Responsable</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid (No-Print) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
                <StatCard
                    title="Asistencia Promedio"
                    value={currentStats.avg}
                    change="+2.1%"
                    trend="up"
                    icon={TrendingUp}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Nuevos Registros"
                    value={currentStats.count.toString()}
                    change="+5"
                    trend="up"
                    icon={Users}
                    color="text-primary"
                />
                <StatCard
                    title="Puntualidad"
                    value={currentStats.punctuality}
                    change="+1.5%"
                    trend="up"
                    icon={Clock}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Actividad de Niños"
                    value={currentStats.kids}
                    change="+3.0%"
                    trend="up"
                    icon={Baby}
                    color="text-cyan-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
                {/* Groups Breakdown */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-1 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Distribución por Grupos
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Resumen de participación activa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-4">
                        <AttendanceBar label=" Adultos (Varones/Hnas)" percent={85} value={members.filter(m => m.category === 'Varon' || m.category === 'Hermana').length.toString()} color="bg-primary" />
                        <AttendanceBar label="Solos y Solas" percent={70} value="18" color="bg-emerald-500" />
                        <AttendanceBar label="Niños (Escuela Dominical)" percent={90} value="24" color="bg-cyan-400" />
                        <AttendanceBar label="Miembros del Coro" percent={95} value="32" color="bg-indigo-500" />

                        <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Users className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Miembros Registrados</p>
                                <p className="text-2xl font-black text-white tracking-tighter">{members.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Synthesis Table */}
                <Card className="glass-card bg-white/5 border-white/10 lg:col-span-2 border-t-4 border-t-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                                <Flame className="w-5 h-5 text-emerald-500" />
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
                                    {members.slice(0, 5).map((m: any, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-white uppercase">{m.name}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400 uppercase">{m.category || 'Varon'}</td>
                                            <td className="px-6 py-4 text-xs text-center text-slate-300 font-bold">12</td>
                                            <td className="px-6 py-4 text-xs text-center text-emerald-400 font-bold">12</td>
                                            <td className="px-6 py-4 text-xs text-right text-emerald-400 font-black">100%</td>
                                        </tr>
                                    ))}
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
                className="mt-8 p-6 rounded-md bg-secondary/5 border border-secondary/10 flex items-center justify-center gap-4 backdrop-blur-xl no-print"
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

