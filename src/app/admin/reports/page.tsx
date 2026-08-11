
'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, subMonths, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    FileText, Download, Printer, Filter, Calendar,
    ArrowUpRight, ArrowDownRight, Users, Clock,
    TrendingUp, Flame, Baby, ChevronDown, Search,
    User, BarChart3, Table, UserCheck, X, ChevronLeft,
    ChevronRight, Percent, CalendarDays, Church, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, ReportMemberData } from '@/lib/store';

// ─── Helpers ─────────────────────────────────────────────────────────
const getMonthRange = (monthStr: string) => {
    const [y, m] = monthStr.split('-').map(Number);
    const start = startOfMonth(new Date(y, m - 1));
    const end = endOfMonth(new Date(y, m - 1));
    return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
};

const getMonthLabel = (monthStr: string) => {
    const [y, m] = monthStr.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return format(d, 'MMMM yyyy', { locale: es });
};

const generateMonthOptions = () => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 0; i < 18; i++) {
        const d = subMonths(now, i);
        months.push(format(d, 'yyyy-MM'));
    }
    return months;
};

const getStatusLabel = (pct: number) => {
    if (pct >= 80) return { label: 'Excelente', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (pct >= 50) return { label: 'Regular', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Baja Asistencia', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
};

const GROUPS = [
    { id: 'all', label: 'Todos' },
    { id: 'Administración', label: 'Siervos' },
    { id: 'Casados', label: 'Matrimonios' },
    { id: 'Solos y Solas', label: 'Solos y Solas' },
    { id: 'Jovenes', label: 'Jóvenes' },
    { id: 'Niños', label: 'Niños' },
];

const matchesGroup = (m: ReportMemberData, groupId: string): boolean => {
    if (groupId === 'all') return true;
    const g = (m.member_group || '').toLowerCase();
    if (groupId === 'Administración') return g === 'administración' || g === 'ministerio';
    if (groupId === 'Casados') return g.includes('casad') || g.includes('matrimon');
    if (groupId === 'Solos y Solas') return g.includes('solo') || g.includes('sola');
    if (groupId === 'Jovenes') return g.includes('joven') || g.includes('juvenil');
    if (groupId === 'Niños') return g.includes('niñ') || g.includes('nin') || m.category?.toLowerCase() === 'niño';
    return false;
};

// ─── Sub-Components ──────────────────────────────────────────────────

const KpiCard = ({ title, value, sub, icon: Icon, color }: { title: string; value: string; sub?: string; icon: any; color: string }) => (
    <div className="relative bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-5 overflow-hidden group hover:border-[var(--tactile-border-strong)] transition-all">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity", color)}>
            <Icon className="w-full h-full" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 mb-2">{title}</p>
        <p className="text-2xl font-black text-foreground tracking-tighter tabular-nums">{value}</p>
        {sub && <p className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">{sub}</p>}
    </div>
);

const ProgressBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{label}</span>
                <span className="text-xs font-black text-foreground tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn("h-full rounded-full", color)}
                />
            </div>
        </div>
    );
};

// ─── Individual Member Heatmap ────────────────────────────────────────
const AttendanceHeatmap = ({ monthStr, dailyDetail, serviceDays }: {
    monthStr: string;
    dailyDetail: Record<string, { '5am': boolean; '9am': boolean; 'evening': boolean }>;
    serviceDays: Set<string>;
}) => {
    const [y, m] = monthStr.split('-').map(Number);
    const start = startOfMonth(new Date(y, m - 1));
    const end = endOfMonth(new Date(y, m - 1));
    const days = eachDayOfInterval({ start, end });
    const startDow = getDay(start); // 0=Sun

    const blanks = Array.from({ length: startDow });
    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    return (
        <div className="bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-3">Calendario de Asistencia</p>
            <div className="grid grid-cols-7 gap-1">
                {dayNames.map((d, i) => (
                    <div key={`h-${i}`} className="text-[8px] font-black text-muted-foreground/30 text-center uppercase">{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`b-${i}`} />)}
                {days.map(day => {
                    const ds = format(day, 'yyyy-MM-dd');
                    const hadService = serviceDays.has(ds);
                    const detail = dailyDetail[ds];
                    const sessCount = detail ? [detail['5am'], detail['9am'], detail['evening']].filter(Boolean).length : 0;

                    let bg = 'bg-white/[0.02] border-transparent'; // no service
                    if (hadService && sessCount === 0) bg = 'bg-rose-500/15 border-rose-500/30';
                    else if (sessCount === 1) bg = 'bg-amber-500/20 border-amber-500/30';
                    else if (sessCount === 2) bg = 'bg-emerald-500/20 border-emerald-500/30';
                    else if (sessCount >= 3) bg = 'bg-emerald-500/40 border-emerald-500/50';

                    return (
                        <div
                            key={ds}
                            title={hadService ? `${ds}: ${sessCount} sesiones` : `${ds}: Sin servicio`}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded-[4px] text-[9px] font-bold border transition-all cursor-default",
                                bg,
                                hadService ? 'text-foreground/60' : 'text-foreground/15'
                            )}
                        >
                            {day.getDate()}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center gap-3 mt-3 justify-center">
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-white/[0.03]" /><span className="text-[7px] text-muted-foreground/30 uppercase">Sin Servicio</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-rose-500/20" /><span className="text-[7px] text-muted-foreground/30 uppercase">Falta</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500/20" /><span className="text-[7px] text-muted-foreground/30 uppercase">1 Sesión</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" /><span className="text-[7px] text-muted-foreground/30 uppercase">Completo</span></div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// ███ MAIN COMPONENT ███
// ═══════════════════════════════════════════════════════════════════════

export default function ReportsPage() {
    const {
        settings,
        members,
        loadMembersFromCloud,
        loadSettingsFromCloud,
        loadAttendanceReportData,
        showNotification
    } = useAppStore();

    // ─── State ────────────────────────────────────────────────────────
    const monthOptions = useMemo(() => generateMonthOptions(), []);
    const [mode, setMode] = useState<'general' | 'individual'>('general');
    const [startMonth, setStartMonth] = useState(monthOptions[0]);
    const [endMonth, setEndMonth] = useState(monthOptions[0]);
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedChurch, setSelectedChurch] = useState('all');
    const [sessionFilter, setSessionFilter] = useState<'all' | '5am' | '9am' | 'evening'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [reportData, setReportData] = useState<ReportMemberData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Individual mode state
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [individualSearch, setIndividualSearch] = useState('');

    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadMembersFromCloud();
        loadSettingsFromCloud();
    }, []);

    // ─── Generate Report ───────────────────────────────────────────────
    const generateReport = useCallback(async () => {
        setIsLoading(true);
        setHasGenerated(false);
        try {
            const { start } = getMonthRange(startMonth);
            const { end } = getMonthRange(endMonth < startMonth ? startMonth : endMonth);
            const data = await loadAttendanceReportData(start, end);
            setReportData(data);
            setHasGenerated(true);
        } catch (err) {
            console.error('Error generating report:', err);
            showNotification('Error al generar el reporte', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [startMonth, endMonth, loadAttendanceReportData, showNotification]);

    // ─── Filtered Data ─────────────────────────────────────────────────
    const filteredData = useMemo(() => {
        let data = reportData;

        if (selectedGroup !== 'all') {
            data = data.filter(m => matchesGroup(m, selectedGroup));
        }

        if (selectedChurch !== 'all') {
            const mainName = settings.mainChurch?.name || settings.mainChurchName || 'Principal';
            data = data.filter(m => {
                if (selectedChurch === 'Principal' || selectedChurch === mainName) {
                    return !m.assigned_church || m.assigned_church === 'Principal' || m.assigned_church === mainName;
                }
                return m.assigned_church === selectedChurch;
            });
        }

        if (searchTerm) {
            const norm = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            data = data.filter(m => m.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(norm));
        }

        return data;
    }, [reportData, selectedGroup, selectedChurch, searchTerm, settings]);

    // ─── Computed KPIs ──────────────────────────────────────────────────
    const kpis = useMemo(() => {
        if (filteredData.length === 0) return { avgPct: 0, totalMembers: 0, totalDays: 0, bestGroup: '-' };
        const avgPct = Math.round(filteredData.reduce((a, m) => a + m.percentage, 0) / filteredData.length);
        const totalDays = new Set(filteredData.flatMap(m => Object.keys(m.daily_detail))).size;

        // Find best performing group
        const groupAvgs: Record<string, number[]> = {};
        GROUPS.filter(g => g.id !== 'all').forEach(g => {
            const gMembers = filteredData.filter(m => matchesGroup(m, g.id));
            if (gMembers.length > 0) {
                groupAvgs[g.label] = gMembers.map(m => m.percentage);
            }
        });
        let bestGroup = '-';
        let bestAvg = -1;
        Object.entries(groupAvgs).forEach(([label, pcts]) => {
            const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
            if (avg > bestAvg) { bestAvg = avg; bestGroup = label; }
        });

        return { avgPct, totalMembers: filteredData.length, totalDays, bestGroup };
    }, [filteredData]);

    // ─── Individual Member ──────────────────────────────────────────────
    const selectedMember = useMemo(() => {
        if (!selectedMemberId) return null;
        return reportData.find(m => m.member_id === selectedMemberId) || null;
    }, [selectedMemberId, reportData]);

    // Service days for heatmap
    const serviceDays = useMemo(() => {
        const days = new Set<string>();
        reportData.forEach(m => Object.keys(m.daily_detail).forEach(d => days.add(d)));
        return days;
    }, [reportData]);

    // ─── PDF Export ─────────────────────────────────────────────────────
    const handleExportPDF = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        try {
            const html2pdf = (await import('html2pdf.js' as any)).default;
            const filename = mode === 'individual' && selectedMember
                ? `Reporte_${selectedMember.name.replace(/\s+/g, '_')}_${startMonth}.pdf`
                : `Reporte_General_Asistencia_${startMonth}_a_${endMonth}.pdf`;
            const opt = {
                margin: 0.4,
                filename,
                image: { type: 'jpeg' as const, quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' as const },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
            await html2pdf().set(opt).from(reportRef.current).save();
            showNotification('PDF exportado correctamente', 'success');
        } catch (err) {
            console.error('Error exporting PDF:', err);
            showNotification('Error al exportar PDF', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // ─── CSV Export ──────────────────────────────────────────────────────
    const handleExportCSV = () => {
        const headers = ['Nombre', 'Grupo', '5AM', '9AM', 'Tarde', 'Total', 'Porcentaje', 'Estado'];
        const rows = filteredData.map(m => {
            const status = getStatusLabel(m.percentage);
            return [m.name, m.member_group || '', m.sessions['5am'], m.sessions['9am'], m.sessions['evening'], m.total_present, `${m.percentage}%`, status.label].join(',');
        });
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Asistencia_${startMonth}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('CSV exportado correctamente', 'success');
    };

    const templateConfig = settings.reportTemplatesConfig || {
        pdf: {
            title: 'INFORME OFICIAL DE ASISTENCIA',
            subtitle: 'La Luz del Mundo',
            logoType: 'official_gold',
            showSignatures: true,
            ministerSignatureTitle: 'Ministro a Cargo',
            attendanceOfficerSignatureTitle: 'Encargado de Asistencia'
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">

            {/* ─── HEADER ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-2 no-print">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
                    <FileText className="h-7 w-7 text-emerald-500" />
                    Reportes de <span className="text-emerald-500">Asistencia</span>
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                    Datos reales de la tabla de asistencia • {members.length} miembros registrados
                </p>
            </div>

            {/* ─── CONTROL BAR ──────────────────────────────────────── */}
            <div className="bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-4 md:p-6 space-y-4 no-print">
                {/* Row 1: Mode + Month Range */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Mode Toggle */}
                    <div className="flex items-center p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md">
                        {(['general', 'individual'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setSelectedMemberId(null); }}
                                className={cn(
                                    "px-5 py-2 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-all",
                                    mode === m ? "bg-emerald-500 text-black" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {m === 'general' ? '📊 General' : '👤 Individual'}
                            </button>
                        ))}
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <CalendarDays className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="relative">
                            <select
                                value={startMonth}
                                onChange={e => setStartMonth(e.target.value)}
                                className="appearance-none bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md px-3 py-2 pr-7 text-[10px] font-black uppercase text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
                            >
                                {monthOptions.map(m => <option key={m} value={m} className="bg-slate-900 capitalize">{getMonthLabel(m)}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-emerald-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/30">→</span>
                        <div className="relative">
                            <select
                                value={endMonth}
                                onChange={e => setEndMonth(e.target.value)}
                                className="appearance-none bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md px-3 py-2 pr-7 text-[10px] font-black uppercase text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
                            >
                                {monthOptions.map(m => <option key={m} value={m} className="bg-slate-900 capitalize">{getMonthLabel(m)}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-emerald-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateReport}
                        disabled={isLoading}
                        className={cn(
                            "px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            isLoading
                                ? "bg-emerald-500/20 text-emerald-400 cursor-wait"
                                : "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98]"
                        )}
                    >
                        {isLoading ? (
                            <><div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> Consultando...</>
                        ) : (
                            <><BarChart3 className="w-4 h-4" /> Generar Reporte</>
                        )}
                    </button>
                </div>

                {/* Row 2: Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Group Filter */}
                    <div className="flex items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md overflow-x-auto scrollbar-hide">
                        {GROUPS.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGroup(g.id)}
                                className={cn(
                                    "flex-none px-3 py-1.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    selectedGroup === g.id ? "bg-[#576983] text-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>

                    {/* Church Filter */}
                    {(settings.missions || []).length > 0 && (
                        <div className="flex items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md">
                            <Church className="w-3 h-3 text-emerald-500 ml-2" />
                            {[
                                { id: 'all', label: 'Todas' },
                                { id: 'Principal', label: settings.mainChurch?.name || 'Principal' },
                                ...(settings.missions || []).map((m: any) => ({ id: typeof m === 'string' ? m : m.name, label: typeof m === 'string' ? m : m.name }))
                            ].map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedChurch(c.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        selectedChurch === c.id ? "bg-emerald-500 text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Session Filter */}
                    <div className="flex items-center gap-1 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md">
                        {(['all', '5am', '9am', 'evening'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setSessionFilter(s)}
                                className={cn(
                                    "px-3 py-1.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all",
                                    sessionFilter === s ? "bg-[#576983] text-black" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {s === 'all' ? 'Todas' : s === 'evening' ? 'Tarde' : s.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" />
                        <input
                            type="text"
                            placeholder="BUSCAR MIEMBRO..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md h-8 pl-9 pr-4 text-[10px] font-black tracking-[0.1em] text-foreground outline-none placeholder:text-muted-foreground/20 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Export Buttons */}
                    {hasGenerated && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {isExporting ? '...' : 'PDF'}
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-foreground/70 border border-[var(--tactile-border)] text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Table className="w-3.5 h-3.5" />
                                CSV
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-foreground/70 border border-[var(--tactile-border)] text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Printer className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── CONTENT (ref for PDF) ────────────────────────────── */}
            <div ref={reportRef}>
                {!hasGenerated ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white/[0.01] border border-dashed border-[var(--tactile-border)] rounded-md no-print">
                        <BarChart3 className="w-12 h-12 text-muted-foreground/10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                            Selecciona el rango de meses y presiona "Generar Reporte"
                        </p>
                    </div>
                ) : mode === 'general' ? (
                    /* ═══ GENERAL MODE ═══ */
                    <div className="space-y-6">
                        {/* Print Header */}
                        <div className="hidden print:block border-b-2 border-emerald-500 pb-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{templateConfig.pdf.title}</h1>
                                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">{templateConfig.pdf.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black uppercase">{getMonthLabel(startMonth)}{startMonth !== endMonth ? ` — ${getMonthLabel(endMonth)}` : ''}</p>
                                    <p className="text-xs text-slate-500">Generado: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* KPI Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <KpiCard title="Asistencia Promedio" value={`${kpis.avgPct}%`} icon={TrendingUp} color="text-emerald-500" />
                            <KpiCard title="Miembros Activos" value={kpis.totalMembers.toString()} sub="en filtro actual" icon={Users} color="text-primary" />
                            <KpiCard title="Días con Servicio" value={kpis.totalDays.toString()} sub="en el periodo" icon={CalendarDays} color="text-amber-400" />
                            <KpiCard title="Mejor Grupo" value={kpis.bestGroup} icon={Flame} color="text-emerald-500" />
                        </div>

                        {/* Group Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-5 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5 text-primary" />
                                    Distribución por Grupo
                                </p>
                                {GROUPS.filter(g => g.id !== 'all').map(g => {
                                    const gm = reportData.filter(m => matchesGroup(m, g.id));
                                    const avg = gm.length > 0 ? Math.round(gm.reduce((a, m) => a + m.percentage, 0) / gm.length) : 0;
                                    const colors: Record<string, string> = {
                                        'Administración': 'bg-primary',
                                        'Casados': 'bg-emerald-500',
                                        'Solos y Solas': 'bg-amber-500',
                                        'Jovenes': 'bg-indigo-500',
                                        'Niños': 'bg-cyan-400',
                                    };
                                    return <ProgressBar key={g.id} label={`${g.label} (${gm.length})`} value={avg} max={100} color={colors[g.id] || 'bg-primary'} />;
                                })}
                            </div>

                            {/* Nominal Table */}
                            <div className="lg:col-span-3 bg-white/[0.03] border border-[var(--tactile-border)] rounded-md overflow-hidden">
                                <div className="p-4 border-b border-[var(--tactile-border)] flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-2">
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        Listado Nominal — {filteredData.length} miembros
                                    </p>
                                </div>
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="w-full min-w-[700px]">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-[var(--tactile-inner-bg)] border-b border-[var(--tactile-border)]">
                                                <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">#</th>
                                                <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Miembro</th>
                                                <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Grupo</th>
                                                <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">5 AM</th>
                                                <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">9 AM</th>
                                                <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Tarde</th>
                                                <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Total</th>
                                                <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">%</th>
                                                <th className="px-4 py-3 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {filteredData.map((m, i) => {
                                                const status = getStatusLabel(m.percentage);
                                                return (
                                                    <tr key={m.member_id} className="group hover:bg-white/[0.03] transition-colors">
                                                        <td className="px-4 py-3 text-[10px] text-muted-foreground/30 tabular-nums">{i + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--tactile-border)] bg-[var(--tactile-inner-bg)] shrink-0">
                                                                    {m.avatar ? (
                                                                        <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-muted-foreground/30">
                                                                            {m.name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-bold text-foreground capitalize truncate max-w-[150px]">{m.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-[10px] text-muted-foreground/50 uppercase tracking-widest">{m.member_group || '—'}</td>
                                                        <td className="px-4 py-3 text-center text-xs font-bold text-foreground/60 tabular-nums">{m.sessions['5am']}</td>
                                                        <td className="px-4 py-3 text-center text-xs font-bold text-foreground/60 tabular-nums">{m.sessions['9am']}</td>
                                                        <td className="px-4 py-3 text-center text-xs font-bold text-foreground/60 tabular-nums">{m.sessions['evening']}</td>
                                                        <td className="px-4 py-3 text-center text-sm font-black text-foreground tabular-nums">{m.total_present}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={cn("text-sm font-black tabular-nums", m.percentage >= 80 ? "text-emerald-400" : m.percentage >= 50 ? "text-amber-400" : "text-rose-400")}>
                                                                {m.percentage}%
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border", status.bg, status.color)}>
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredData.length === 0 && (
                                                <tr>
                                                    <td colSpan={9} className="px-4 py-12 text-center text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                                                        Sin datos de asistencia para este periodo
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Print Signatures */}
                        {templateConfig.pdf.showSignatures && (
                            <div className="hidden print:grid grid-cols-2 gap-12 pt-16 border-t border-slate-200 mt-12 text-center text-xs text-slate-900">
                                <div>
                                    <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                                    <p className="font-black uppercase">{templateConfig.pdf.ministerSignatureTitle}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Firma y Sello Oficial</p>
                                </div>
                                <div>
                                    <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                                    <p className="font-black uppercase">{templateConfig.pdf.attendanceOfficerSignatureTitle}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Firma Responsable</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ═══ INDIVIDUAL MODE ═══ */
                    <div className="space-y-6">
                        {/* Member Selector */}
                        {!selectedMemberId && (
                            <div className="bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-6 space-y-4 no-print">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-2">
                                    <Search className="w-3.5 h-3.5 text-emerald-500" />
                                    Seleccionar Miembro para Reporte Individual
                                </p>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                    <input
                                        type="text"
                                        placeholder="Escriba el nombre del miembro..."
                                        value={individualSearch}
                                        onChange={e => setIndividualSearch(e.target.value)}
                                        className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md h-12 pl-10 pr-4 text-sm font-bold text-foreground outline-none placeholder:text-muted-foreground/20 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                                    {reportData
                                        .filter(m => {
                                            if (!individualSearch) return true;
                                            const norm = individualSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                                            return m.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(norm);
                                        })
                                        .map(m => (
                                            <button
                                                key={m.member_id}
                                                onClick={() => setSelectedMemberId(m.member_id)}
                                                className="flex items-center gap-3 p-3 rounded-md border border-[var(--tactile-border)] hover:border-emerald-500/40 bg-white/[0.02] hover:bg-emerald-500/5 transition-all text-left"
                                            >
                                                <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--tactile-border)] bg-[var(--tactile-inner-bg)] shrink-0">
                                                    {m.avatar ? (
                                                        <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-muted-foreground/30">{m.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-foreground capitalize truncate">{m.name}</p>
                                                    <p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest">{m.member_group || 'Sin grupo'}</p>
                                                </div>
                                                <span className={cn("ml-auto text-xs font-black tabular-nums shrink-0", m.percentage >= 80 ? "text-emerald-400" : m.percentage >= 50 ? "text-amber-400" : "text-rose-400")}>
                                                    {m.percentage}%
                                                </span>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* Individual Report View */}
                        {selectedMember && (
                            <div className="space-y-6">
                                {/* Back button */}
                                <button
                                    onClick={() => setSelectedMemberId(null)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors no-print"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Volver al Listado
                                </button>

                                {/* Print Header */}
                                <div className="hidden print:block border-b-2 border-emerald-500 pb-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h1 className="text-2xl font-black uppercase text-slate-900">REPORTE INDIVIDUAL DE ASISTENCIA</h1>
                                            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">{templateConfig.pdf.subtitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black uppercase">{getMonthLabel(startMonth)}</p>
                                            <p className="text-xs text-slate-500">Generado: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Header */}
                                <div className="bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-6 flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/30 bg-[var(--tactile-inner-bg)] shrink-0">
                                        {selectedMember.avatar ? (
                                            <img src={selectedMember.avatar} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-muted-foreground/20">{selectedMember.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">{selectedMember.name}</h3>
                                        <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{selectedMember.member_group || 'Sin grupo'}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{selectedMember.category}</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-foreground tabular-nums">{selectedMember.percentage}%</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Asistencia</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-emerald-500 tabular-nums">{selectedMember.days_attended}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Días</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Session Breakdown + Heatmap */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Session Bars */}
                                    <div className="bg-white/[0.03] border border-[var(--tactile-border)] rounded-md p-5 space-y-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Desglose por Sesión</p>
                                        <ProgressBar label="Oración 5:00 AM" value={selectedMember.sessions['5am']} max={selectedMember.total_possible > 0 ? Math.ceil(selectedMember.total_possible / 3) : 1} color="bg-amber-500" />
                                        <ProgressBar label="Oración 9:00 AM" value={selectedMember.sessions['9am']} max={selectedMember.total_possible > 0 ? Math.ceil(selectedMember.total_possible / 3) : 1} color="bg-primary" />
                                        <ProgressBar label="Oración de la Tarde" value={selectedMember.sessions['evening']} max={selectedMember.total_possible > 0 ? Math.ceil(selectedMember.total_possible / 3) : 1} color="bg-emerald-500" />
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Total Registros</span>
                                            <span className="text-lg font-black text-foreground tabular-nums">{selectedMember.total_present} <span className="text-[10px] text-muted-foreground/30 font-bold">/ {selectedMember.total_possible}</span></span>
                                        </div>
                                    </div>

                                    {/* Heatmap */}
                                    <AttendanceHeatmap monthStr={startMonth} dailyDetail={selectedMember.daily_detail} serviceDays={serviceDays} />
                                </div>

                                {/* Print Signatures */}
                                {templateConfig.pdf.showSignatures && (
                                    <div className="hidden print:grid grid-cols-2 gap-12 pt-16 border-t border-slate-200 mt-12 text-center text-xs text-slate-900">
                                        <div>
                                            <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                                            <p className="font-black uppercase">{templateConfig.pdf.ministerSignatureTitle}</p>
                                        </div>
                                        <div>
                                            <div className="border-b border-slate-400 mb-2 w-3/4 mx-auto" />
                                            <p className="font-black uppercase">{templateConfig.pdf.attendanceOfficerSignatureTitle}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Notice */}
            {hasGenerated && (
                <div className="mt-4 p-4 rounded-md bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-3 no-print">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] text-muted-foreground/50 uppercase font-black tracking-[0.2em] text-center">
                        Reporte basado en {reportData.length} miembros activos • Datos reales de la base de datos de asistencia
                    </p>
                </div>
            )}
        </div>
    );
}
