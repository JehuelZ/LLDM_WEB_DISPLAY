"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    Calendar, ClipboardCheck, Search, CalendarClock, 
    RefreshCw, CheckCircle2, TrendingUp, TrendingDown,
    User, Check, Crown
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore, UserProfile } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TactileIconBox, TactileBadge, TactileGlassCard, TactileBarChart } from '@/components/admin/TactileUI'

interface AsistenciaTabProps {
    currentDate: string
    setCurrentDate: (date: string) => void
    members: UserProfile[]
    weeklyStats: any[]
}

export const AsistenciaTab = ({
    currentDate,
    setCurrentDate,
    members,
    weeklyStats
}: AsistenciaTabProps) => {
    const {
        attendanceRecords,
        saveAttendanceToCloud,
        showNotification,
        loadMemberAttendanceHistory
    } = useAppStore()

    const [currentAttendanceSession, setCurrentAttendanceSession] = useState<'5am' | '9am' | 'evening'>('5am')
    const [memberFilter, setMemberFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [optimisticAttendance, setOptimisticAttendance] = useState<Record<string, Record<string, boolean>>>({})
    const [processingToggles, setProcessingToggles] = useState<Record<string, boolean>>({})
    
    // For history modal (if we want to keep it here)
    const [selectedMemberForHistory, setSelectedMemberForHistory] = useState<UserProfile | null>(null)
    const [memberHistory, setMemberHistory] = useState<any[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    const handleViewHistory = async (member: UserProfile) => {
        setSelectedMemberForHistory(member);
        setIsLoadingHistory(true);
        try {
            const history = await loadMemberAttendanceHistory(member.id);
            setMemberHistory(history);
        } catch (error) {
            console.error("Error loading member history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const toggleAttendance = async (memberId: string, session: string) => {
        if (processingToggles[memberId]) return;

        const date = currentDate;
        const currentRecords = attendanceRecords[date] || [];
        const record = currentRecords.find(r => r.member_id === memberId && r.session_type === session);
        const willBePresent = !record?.present;

        // Optimistic UI
        setOptimisticAttendance(prev => ({
            ...prev,
            [memberId]: {
                ...(prev[memberId] || {}),
                [session]: willBePresent
            }
        }));

        setProcessingToggles(prev => ({ ...prev, [memberId]: true }));

        try {
            await saveAttendanceToCloud([{
                member_id: memberId,
                date: date,
                session_type: session as any,
                present: willBePresent,
                time: new Date().toLocaleTimeString('en-US', { hour12: false })
            }]);
        } catch (error) {
            console.error("Error toggling attendance:", error);
            showNotification(`Error al guardar asistencia: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
            setOptimisticAttendance(prev => ({
                ...prev,
                [memberId]: {
                    ...(prev[memberId] || {}),
                    [session]: !willBePresent
                }
            }));
        } finally {
            setProcessingToggles(prev => ({ ...prev, [memberId]: false }));
            setTimeout(() => {
                setOptimisticAttendance(prev => {
                    const next = { ...prev };
                    if (next[memberId]) {
                        delete next[memberId][session];
                        if (Object.keys(next[memberId]).length === 0) delete next[memberId];
                    }
                    return next;
                });
            }, 1000);
        }
    };

    return (
        <motion.div
            key="asistencia"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
        >
            {/* Attendance Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.03] p-8 rounded-[2.5rem] border border-[var(--tactile-border)] backdrop-blur-xl">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <h2 className="text-3xl font-black  capitalize tracking-tighter text-foreground">
                        Control de <span className="text-amber-400">Asistencia</span>
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-black capitalize text-primary">
                                {(() => {
                                    try {
                                        return format(parseISO(currentDate), "EEEE, d 'de' MMMM", { locale: es });
                                    } catch (e) {
                                        return currentDate;
                                    }
                                })()}
                            </span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                        <span className="text-[10px] font-bold text-muted-foreground capitalize tracking-widest leading-none">
                            {members.length} Miembros Registrados
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl shadow-2xl overflow-hidden">
                        {(['5am', '9am', 'evening'] as const).map(session => (
                            <button
                                key={session}
                                onClick={() => setCurrentAttendanceSession(session)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    currentAttendanceSession === session
                                        ? "bg-[#576983] text-black transform scale-[1.02]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                {session === '5am' ? '5:00 AM' : session === '9am' ? '9:00 AM' : '7:00 PM'}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-10 bg-white/10 mx-2" />
                    <button
                        onClick={() => (document.getElementById('global-date-picker') as HTMLInputElement)?.showPicker()}
                        className="tactile-btn tactile-btn-glass text-[10px] px-6 h-12 border-[var(--tactile-border-strong)]"
                    >
                        <CalendarClock className="w-4 h-4 mr-2 text-primary" />
                        OTRA FECHA
                    </button>
                </div>
            </div>

            {/* Horizontal Filter Bar & Search for Attendance Groups */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="admin-member-filters-bar flex-1 flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl shadow-2xl overflow-hidden">
                    {[
                        { id: 'all', label: 'TODOS', count: members.length },
                        { id: 'Administración', label: 'SIERVOS', count: members.filter(m => m.role === 'Administrador' || m.member_group === 'Administración').length },
                        { id: 'Casados', label: 'MATRIMONIOS', count: members.filter(m => m.member_group === 'Casados' || m.member_group === 'Casadas').length },
                        { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', count: members.filter(m => m.member_group === 'Solos y Solas').length },
                        { id: 'Jovenes', label: 'JÓVENES', count: members.filter(m => m.member_group === 'Jovenes').length },
                        { id: 'Niños', label: 'NIÑOS', count: members.filter(m => m.member_group === 'Niños' || m.member_group === 'Niñas').length },
                    ].map(group => (
                        <button
                            key={group.id}
                            onClick={() => setMemberFilter(group.id)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                memberFilter === group.id
                                    ? "bg-[#576983] text-black transform scale-[1.02]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {group.label} <span className="opacity-40 text-[8px] ml-1">{group.count}</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl p-1 shadow-inner group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="BUSCAR..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent h-9 pl-10 pr-4 text-[10px] font-black tracking-[0.15em] text-foreground outline-none placeholder:text-muted-foreground/30"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <TactileGlassCard className="md:col-span-3">
                    <div className="flex flex-col h-full">
                        <div className="mb-6">
                            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-1">Total de Asistencias</p>
                            <div className="text-3xl font-black text-foreground tabular-nums">
                                {weeklyStats.reduce((acc, s) => {
                                    const dayTotal = s.sessions ? Object.values(s.sessions).reduce((a: any, b: any) => a + b, 0) : 0;
                                    return acc + (dayTotal as number);
                                }, 0).toLocaleString()}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-h-[150px] relative">
                            <TactileBarChart data={weeklyStats} totalMembers={members.filter(m => m.status === 'Activo').length} />
                        </div>
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="Sesión Actual" className="md:col-span-1">
                    <div className="flex flex-col items-center justify-center h-48 gap-4 py-4">
                        {(() => {
                            const date = currentDate;
                            const session = currentAttendanceSession;
                            const count = (attendanceRecords[date] || []).filter(r => r.session_type === session && r.present).length;
                            const percent = Math.round((count / (members.length || 1)) * 100);
                            const displayPercent = Math.max(percent, 0.5);

                            return (
                                <>
                                    <div className="relative w-32 h-32">
                                        <div className="absolute inset-2 rounded-full border border-[var(--tactile-border)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]" viewBox="0 0 100 100">
                                            <defs>
                                                <linearGradient id="globalProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#cc9900" />
                                                    <stop offset="100%" stopColor="#f59e0b" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/5" />
                                            <motion.circle
                                                cx="50" cy="50" r="44" fill="none" stroke="url(#globalProgressGrad)" strokeWidth="10" strokeDasharray="276.46"
                                                initial={{ strokeDashoffset: 276.46 }}
                                                animate={{ strokeDashoffset: 276.46 - (276.46 * displayPercent / 100) }}
                                                transition={{ duration: 1.5, ease: "backOut" }}
                                                className="drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0 z-10">
                                            <span className="text-3xl font-black  text-foreground drop-shadow-md">{percent}%</span>
                                            <div className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/5 rounded-full border border-[var(--tactile-border-strong)]">
                                                <span className="text-[8px] font-black text-muted-foreground/70">{count}</span>
                                                <span className="text-[7px] font-bold text-muted-foreground/30">/</span>
                                                <span className="text-[8px] font-black text-muted-foreground/70">{members.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-4">
                                        <p className="text-[10px] font-black capitalize text-primary tracking-[0.3em] ">Asistencia en Vivo</p>
                                        <div className="flex gap-1">
                                            <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </TactileGlassCard>
            </div>

            {/* Member List Grid */}
            <TactileGlassCard title="LISTADO DE MIEMBROS" subtitle="TOQUE PARA MARCAR ASISTENCIA">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                    {members.filter(m => {
                        const normalize = (text: string) => (text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        const searchNormalized = normalize(searchTerm);
                        const nameMatch = normalize(m.name).includes(searchNormalized);
                        const groupMatch = normalize(m.member_group || '').includes(searchNormalized);
                        const matchesSearch = nameMatch || groupMatch;

                        if (!matchesSearch) return false;

                        if (memberFilter === 'all') return true;
                        if (memberFilter === 'Administración') return m.role === 'Administrador' || m.member_group === 'Administración';
                        if (memberFilter === 'Casados') return m.member_group === 'Casados' || m.member_group === 'Casadas';
                        if (memberFilter === 'Niños') return m.member_group === 'Niños' || m.member_group === 'Niñas';
                        if (memberFilter === 'Solos y Solas') return m.member_group === 'Solos y Solas';
                        if (memberFilter === 'Jovenes') return m.member_group === 'Jovenes';
                        
                        return m.member_group === memberFilter;
                    }).sort((a,b) => a.name.localeCompare(b.name)).map(member => {
                        const date = currentDate;
                        const session = currentAttendanceSession;
                        
                        const record = (attendanceRecords[date] || []).find(r => r.member_id === member.id && r.session_type === session);
                        const isOptimistic = optimisticAttendance[member.id]?.[session] !== undefined;
                        const isPresent = isOptimistic ? optimisticAttendance[member.id][session] : !!record?.present;
                        const isProcessing = processingToggles[member.id];

                        return (
                            <motion.div
                                key={member.id}
                                layoutId={member.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 text-left overflow-hidden group",
                                    isPresent 
                                        ? "bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                                        : "bg-white/[0.02] border-[var(--tactile-border)] hover:border-[var(--tactile-border-strong)]"
                                )}
                            >
                                {isPresent && (
                                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                )}

                                <div className="relative shrink-0 cursor-pointer hover:scale-110 transition-transform z-10"
                                     onClick={(e) => { e.stopPropagation(); handleViewHistory(member); }}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl border-2 overflow-hidden transition-all duration-500",
                                        isPresent ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-[var(--tactile-border-strong)]"
                                    )}>
                                        {member.avatar ? (
                                            <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground/20" />
                                            </div>
                                        )}
                                    </div>
                                    {isPresent && (
                                        <div className="absolute -right-1 -bottom-1 bg-primary text-black rounded-full p-0.5 border-2 border-[#050510]">
                                            <Check className="w-3 h-3 font-bold" />
                                        </div>
                                    )}
                                    {member.role === 'Administrador' && (
                                        <div className="absolute -top-1.5 -left-1.5 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full p-1 border border-white/20 shadow-lg rotate-[-15deg] z-20">
                                            <Crown className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                    {member.is_pre_registered && (
                                        <div className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-[8px] font-black w-9 h-6 flex items-center justify-center rounded-lg border-2 border-[#0b101e] text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-[5deg] group-hover:rotate-0 transition-transform z-20">
                                            PRE
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pr-4 cursor-pointer" onClick={() => toggleAttendance(member.id, session)}>
                                    <h4 className={cn(
                                        "font-black text-sm capitalize tracking-tight truncate",
                                        isPresent ? "text-primary" : "text-foreground"
                                    )}>
                                        {member.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-bold text-muted-foreground/30 capitalize tracking-widest">{member.member_group}</span>
                                        {record?.time && !isOptimistic && (
                                            <span className="text-[9px] font-medium text-primary/50 tabular-nums">{record.time.slice(0, 5)}</span>
                                        )}
                                    </div>
                                </div>

                                {isProcessing && (
                                    <div className="absolute inset-0 bg-[var(--tactile-bg)]/60 backdrop-blur-[1px] flex items-center justify-center">
                                        <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </TactileGlassCard>
        </motion.div>
    )
}
