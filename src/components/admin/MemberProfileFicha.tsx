import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, User, Calendar, Activity, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { useAppStore, UserProfile, AttendanceRecord } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
// html2pdf imported dynamically inside handler to avoid SSR issues

interface FichaProps {
    member: UserProfile;
    onClose: () => void;
}

// ─── Session Progress Bar ──────────────────────────────────────────
const SessionBar = ({ label, count, total, color }: { label: string; count: number; total: number; color: string }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50">{label}</span>
                <span className="text-[10px] font-black text-[var(--tactile-text)] tabular-nums">{count} <span className="text-[var(--tactile-text-sub)]/30 text-[8px]">/ {total}</span></span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={cn("h-full rounded-full", color)}
                />
            </div>
        </div>
    );
};

// ─── Mini Heatmap Calendar ──────────────────────────────────────────
const MiniHeatmap = ({ monthStr, dailyDetail, serviceDays }: {
    monthStr: string;
    dailyDetail: Record<string, { '5am': boolean; '9am': boolean; 'evening': boolean }>;
    serviceDays: string[];
}) => {
    const [y, m] = monthStr.split('-').map(Number);
    const start = startOfMonth(new Date(y, m - 1));
    const end = endOfMonth(new Date(y, m - 1));
    const days = eachDayOfInterval({ start, end });
    const startDow = getDay(start);
    const blanks = Array.from({ length: startDow });
    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const serviceDaysSet = new Set(serviceDays);

    return (
        <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50 mb-2 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Calendario del Mes
            </p>
            <div className="grid grid-cols-7 gap-0.5">
                {dayNames.map((d, i) => (
                    <div key={`h-${i}`} className="text-[7px] font-bold text-[var(--tactile-text-sub)]/20 text-center">{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`b-${i}`} />)}
                {days.map(day => {
                    const ds = format(day, 'yyyy-MM-dd');
                    const hadService = serviceDaysSet.has(ds);
                    const detail = dailyDetail[ds];
                    const sessCount = detail ? [detail['5am'], detail['9am'], detail['evening']].filter(Boolean).length : 0;

                    let bg = 'bg-white/[0.02]';
                    if (hadService && sessCount === 0) bg = 'bg-rose-500/15';
                    else if (sessCount === 1) bg = 'bg-amber-500/20';
                    else if (sessCount === 2) bg = 'bg-emerald-500/20';
                    else if (sessCount >= 3) bg = 'bg-emerald-500/40';

                    return (
                        <div
                            key={ds}
                            className={cn("aspect-square flex items-center justify-center rounded-[3px] text-[8px] font-bold transition-all", bg, hadService ? 'text-[var(--tactile-text)]/60' : 'text-[var(--tactile-text)]/15')}
                        >
                            {day.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const MemberProfileFicha: React.FC<FichaProps> = ({ member, onClose }) => {
    const { loadMemberAttendanceHistory, loadAllSchedulesFromCloud, monthlySchedule } = useAppStore();
    const [attendanceHist, setAttendanceHist] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonthStr, setSelectedMonthStr] = useState<string>(''); // format YYYY-MM
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            await loadAllSchedulesFromCloud();
            const records = await loadMemberAttendanceHistory(member.id);
            setAttendanceHist(records);
            
            // Determine available months from attendance + schedule
            const monthsSet = new Set<string>();
            const now = new Date();
            const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            monthsSet.add(currentMonthStr);
            
            records.forEach(r => {
                if(r.date) monthsSet.add(r.date.substring(0, 7));
            });
            Object.keys(monthlySchedule).forEach(date => {
                monthsSet.add(date.substring(0, 7));
            });
            
            const sortedMonths = Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
            setAvailableMonths(sortedMonths);
            setSelectedMonthStr(currentMonthStr);
            
            setIsLoading(false);
        };
        initData();
    }, [member.id]);

    const handleExportPDF = async () => {
        if (!printRef.current) return;
        setIsExporting(true);
        
        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            
            const element = printRef.current;
            const opt = {
                margin:       0.5,
                filename:     `Ficha_${member.name.replace(/\s+/g, '_')}_${selectedMonthStr}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
            setIsExporting(false);
        } catch (err) {
            console.error('Error generating PDF:', err);
            setIsExporting(false);
        }
    };


    // Calculate metrics for selected month
    const currentMonthRecords = attendanceHist.filter(r => r?.date && selectedMonthStr && r.date.startsWith(selectedMonthStr));
    const presentRecords = currentMonthRecords.filter(r => r.present);
    const attendanceCount = presentRecords.length;
    const uniqueDaysAttended = new Set(presentRecords.map(r => r.date)).size;

    // Session breakdown
    const sessionBreakdown = {
        '5am': presentRecords.filter(r => r.session_type === '5am').length,
        '9am': presentRecords.filter(r => r.session_type === '9am').length,
        'evening': presentRecords.filter(r => r.session_type === 'evening').length,
    };

    // Determine total possible services in month (count unique days with any attendance across all members as approximation)
    // We use all records from the month to find service days
    const allMonthDates = new Set(currentMonthRecords.map(r => r.date));
    const serviceDaysArr = Array.from(allMonthDates);
    
    // For percentage: count session-days that had any service
    // Since we only have this member's records, use unique dates as proxy
    const totalPossibleSessions = serviceDaysArr.length * 3; // approximate: 3 sessions per service day
    const attendancePercentage = totalPossibleSessions > 0 ? Math.round((attendanceCount / totalPossibleSessions) * 100) : 0;
    
    // Build daily detail for heatmap
    const dailyDetail: Record<string, { '5am': boolean; '9am': boolean; 'evening': boolean }> = {};
    presentRecords.forEach(r => {
        if (!r.date) return;
        if (!dailyDetail[r.date]) {
            dailyDetail[r.date] = { '5am': false, '9am': false, 'evening': false };
        }
        if (r.session_type === '5am' || r.session_type === '9am' || r.session_type === 'evening') {
            dailyDetail[r.date][r.session_type] = true;
        }
    });

    // Calculate prayers/services assigned for selected month
    let servicesAssigned = 0;
    Object.values(monthlySchedule || {}).forEach(day => {
        if (!day?.date || !selectedMonthStr || !day.date.startsWith(selectedMonthStr)) return;
        if (day.slots?.['5am']?.leaderId === member.id) servicesAssigned++;
        if (day.slots?.['9am']?.consecrationLeaderId === member.id || day.slots?.['9am']?.doctrineLeaderId === member.id) servicesAssigned++;
        if (day.slots?.['evening']?.doctrineLeaderId === member.id || (day.slots?.['evening']?.leaderIds && day.slots['evening'].leaderIds.includes(member.id))) servicesAssigned++;
    });

    const formatMonthName = (monthStr: string) => {
        const [y, m] = monthStr.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    const getPercentageColor = (pct: number) => {
        if (pct >= 80) return 'text-emerald-500';
        if (pct >= 50) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--tactile-bg)] border border-[var(--tactile-border-strong)] rounded-xl shadow-[0_0_50px_rgba(30,30,30,0.5)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-[var(--tactile-border)] bg-[var(--tactile-inner-bg-alt)] shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30 bg-[var(--tactile-inner-bg)]">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-full h-full p-2 text-emerald-500/40" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-foreground leading-none">{member.name}</h3>
                                <div className="text-[10px] text-foreground/50 uppercase tracking-widest mt-1">
                                    {member.role} • {member.member_group}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-[var(--tactile-item-hover)] flex items-center justify-center transition-colors text-foreground/50 hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content inside Ref for PDF */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-[var(--tactile-bg)]" ref={printRef}>
                        
                        {/* PDF Specific Styling (injected classes that look great on screen config) */}
                        <div className="space-y-6 print-container">
                            
                            {/* Selector / Context Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--tactile-inner-bg)] p-4 rounded-lg border border-[var(--tactile-border)]">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">PERIODO DE EVALUACIÓN</h4>
                                    <select 
                                        className="bg-transparent text-sm font-bold uppercase cursor-pointer outline-none text-foreground border-none appearance-none"
                                        value={selectedMonthStr}
                                        onChange={(e) => setSelectedMonthStr(e.target.value)}
                                        disabled={isExporting} // lock during export to avoid glitches
                                    >
                                        {availableMonths.map(m => (
                                            <option key={m} value={m} className="bg-black text-white">{formatMonthName(m)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="hidden sm:block">
                                    {!isExporting && (
                                        <button 
                                            onClick={handleExportPDF}
                                            className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <Download className="w-3 h-3" />
                                            DESCARGAR PDF
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center opacity-50 space-y-4">
                                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Calculando Métricas...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Top Metrics Row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-4 text-center">
                                            <p className={cn("text-3xl font-black tabular-nums", getPercentageColor(attendancePercentage))}>{attendancePercentage}%</p>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50 mt-1">Asistencia</p>
                                        </div>
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-4 text-center">
                                            <p className="text-3xl font-black text-[var(--tactile-text)] tabular-nums">{uniqueDaysAttended}</p>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50 mt-1">Días</p>
                                        </div>
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-4 text-center">
                                            <p className="text-3xl font-black text-emerald-500 tabular-nums">{attendanceCount}</p>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50 mt-1">Registros</p>
                                        </div>
                                    </div>

                                    {/* Session Breakdown */}
                                    <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-5 space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)]/50 flex items-center gap-2 mb-3">
                                            <BarChart3 className="w-3 h-3 text-primary" /> Desglose por Sesión
                                        </h4>
                                        <SessionBar label="Oración 5:00 AM" count={sessionBreakdown['5am']} total={serviceDaysArr.length || 1} color="bg-amber-500" />
                                        <SessionBar label="Oración 9:00 AM" count={sessionBreakdown['9am']} total={serviceDaysArr.length || 1} color="bg-primary" />
                                        <SessionBar label="Oración de la Tarde" count={sessionBreakdown['evening']} total={serviceDaysArr.length || 1} color="bg-emerald-500" />
                                    </div>

                                    {/* Mini Heatmap Calendar */}
                                    {selectedMonthStr && (
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-5">
                                            <MiniHeatmap monthStr={selectedMonthStr} dailyDetail={dailyDetail} serviceDays={serviceDaysArr} />
                                        </div>
                                    )}

                                    {/* Activity Card */}
                                    {servicesAssigned > 0 && (
                                        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-5">
                                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Actividad Ministerial
                                            </h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                                El hermano(a) <strong>{member.name}</strong> ha sido comisionado(a) para dirigir <strong>{servicesAssigned}</strong> servicios este mes. Es fundamental corroborar su asistencia puntual y su disposición para llevar a cabo estos compromisos sagrados.
                                            </p>
                                        </div>
                                    )}

                                    {attendanceCount === 0 && servicesAssigned === 0 && (
                                        <div className="mt-4 text-center p-8 border border-dashed border-[var(--tactile-border)] rounded-lg">
                                            <Clock className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                                            <p className="text-sm text-foreground/50 font-bold uppercase tracking-widest">Sin actividad registrada en este periodo.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Export Button (only visible on small screens and when not exporting) */}
                    <div className="sm:hidden p-4 border-t border-[var(--tactile-border)] bg-[var(--tactile-inner-bg)]">
                        {!isExporting && (
                            <button 
                                onClick={handleExportPDF}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Download className="w-4 h-4" />
                                DESCARGAR PDF
                            </button>
                        )}
                        {isExporting && (
                            <div className="h-12 flex items-center justify-center text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                Preparando Documento...
                            </div>
                        )}
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
