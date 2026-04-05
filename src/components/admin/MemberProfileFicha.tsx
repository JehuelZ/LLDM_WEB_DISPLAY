import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, User, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';
import { useAppStore, UserProfile, AttendanceRecord } from '@/lib/store';
import { cn } from '@/lib/utils';
// html2pdf imported dynamically inside handler to avoid SSR issues

interface FichaProps {
    member: UserProfile;
    onClose: () => void;
}

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
            // Lazy load html2pdf only on client side to avoid SSR "self is not defined" error
            const html2pdf = (await import('html2pdf.js' as any)).default;
            
            const element = printRef.current;
            const opt = {
                margin:       0.5,
                filename:     `Ficha_${member.name.replace(/\s+/g, '_')}_${selectedMonthStr}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
            };

            // Adding small delay to ensure loading states or UI changes are flushed
            setTimeout(() => {
                html2pdf().set(opt).from(element).save().then(() => {
                    setIsExporting(false);
                });
            }, 300);
        } catch (err) {
            console.error('Error generating PDF:', err);
            setIsExporting(false);
        }
    };

    // Calculate metrics for selected month
    const currentMonthRecords = attendanceHist.filter(r => r.date.startsWith(selectedMonthStr));
    const attendanceCount = currentMonthRecords.filter(r => r.present).length;
    // For "possible" attendance, we might just assume 30 for now or rely on records.
    // Usually, attendance is tracked per expected service. For simplicity, we show pure presences found.
    const uniqueDaysAttended = new Set(currentMonthRecords.filter(r => r.present).map(r => r.date)).size;

    // Calculate prayers/services assigned for selected month
    let servicesAssigned = 0;
    Object.values(monthlySchedule).forEach(day => {
        if (!day.date.startsWith(selectedMonthStr)) return;
        if (day.slots?.['5am']?.leaderId === member.id) servicesAssigned++;
        if (day.slots?.['9am']?.consecrationLeaderId === member.id || day.slots?.['9am']?.doctrineLeaderId === member.id) servicesAssigned++;
        if (day.slots?.['evening']?.doctrineLeaderId === member.id || (day.slots?.['evening']?.leaderIds && day.slots['evening'].leaderIds.includes(member.id))) servicesAssigned++;
    });

    const formatMonthName = (monthStr: string) => {
        const [y, m] = monthStr.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
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
                        <div className="space-y-8 print-container">
                            
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
                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        
                                        {/* Attendance Card */}
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <Calendar className="w-24 h-24" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                Asistencia Registrada
                                            </h4>
                                            
                                            <div className="flex items-end gap-3 mb-2">
                                                <span className="text-5xl font-black text-[var(--tactile-text)] leading-none">{attendanceCount}</span>
                                                <span className="text-sm font-bold text-[var(--tactile-text-sub)] mb-1">registros</span>
                                            </div>
                                            <p className="text-[11px] font-medium text-[var(--tactile-text-sub)]/70 uppercase">
                                                Asistió en <strong className="text-[var(--tactile-text)]">{uniqueDaysAttended} días</strong> diferentes durante {formatMonthName(selectedMonthStr).toLowerCase()}.
                                            </p>
                                        </div>

                                        {/* Activity Card */}
                                        <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <Activity className="w-24 h-24" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--tactile-text-sub)] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                Actividad Ministerial
                                            </h4>
                                            
                                            <div className="flex items-end gap-3 mb-2">
                                                <span className="text-5xl font-black text-emerald-500 leading-none">{servicesAssigned}</span>
                                                <span className="text-sm font-bold text-[var(--tactile-text-sub)] mb-1">servicios</span>
                                            </div>
                                            <p className="text-[11px] font-medium text-[var(--tactile-text-sub)]/70 uppercase">
                                                Oraciones agendadas oficialmente a lo largo del mes seleccionado.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Breakdown Section if needed */}
                                    {servicesAssigned > 0 && (
                                        <div className="mt-6 border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-5">
                                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Desempeño
                                            </h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                                El hermano(a) <strong>{member.name}</strong> ha sido comisionado(a) para dirigir <strong>{servicesAssigned}</strong> servicios este mes. Es fundamental corroborar su asistencia puntual y su disposición para llevar a cabo estos compromisos sagrados.
                                            </p>
                                        </div>
                                    )}

                                    {attendanceCount === 0 && servicesAssigned === 0 && (
                                        <div className="mt-8 text-center p-8 border border-dashed border-[var(--tactile-border)] rounded-lg">
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
