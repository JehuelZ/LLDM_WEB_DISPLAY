'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Users, CheckCircle2, XCircle, Clock, Calendar, Filter, Save, AlertCircle, Star, LogIn, LogOut, UserCircle, Shirt, ChevronLeft, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { Baby, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface AttendanceMember {
    id: string;
    name: string;
    gender: 'Varon' | 'Hermana';
    category: 'Adulto' | 'Niño';
    email: string;
    avatar: string;
    attendance: {
        '5am': { present: boolean; time: string | null };
        '9am': { present: boolean; time: string | null };
        'evening': { present: boolean; time: string | null };
    };
    present: boolean;
    time: string | null;
    parentName?: string;
    deliveredBy?: string;
    collectedBy?: string;
    targetSession?: string;
}

export default function AttendanceDashboard() {
    const {
        currentUser,
        uniforms,
        uniformSchedule,
        kidsAssignments,
        members: storeMembers,
        loadMembersFromCloud,
        attendanceRecords,
        loadAttendanceFromCloud,
        saveAttendanceToCloud,
        loadWeeklyAttendanceStats
    } = useAppStore();

    const [activeTab, setActiveTab] = useState<'varones' | 'hermanas' | 'ninos'>('varones');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSession, setCurrentSession] = useState<'5am' | '9am' | 'evening'>('5am');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [optimisticAttendance, setOptimisticAttendance] = useState<Record<string, Record<string, boolean>>>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    // Track which member+session is currently being saved to avoid race conditions
    const [processingToggles, setProcessingToggles] = useState<Record<string, boolean>>({});
    const [weeklyStats, setWeeklyStats] = useState<any[]>([]);

    useEffect(() => {
        loadMembersFromCloud();
        const fetchWeekly = async () => {
            const data = await loadWeeklyAttendanceStats();
            setWeeklyStats(data);
        };
        fetchWeekly();
    }, []);

    useEffect(() => {
        // Al cambiar de fecha o sesión, limpiamos el estado optimista
        // y cargamos los datos reales desde la nube de inmediato.
        const refresh = async () => {
            setIsRefreshing(true);
            setOptimisticAttendance({});
            await loadAttendanceFromCloud(selectedDate);
            setIsRefreshing(false);
        };
        refresh();
    }, [selectedDate, currentSession]);

    // Escuchamos cambios en los registros globales para sincronizar el estado local
    useEffect(() => {
        if (attendanceRecords[selectedDate]) {
            setOptimisticAttendance({});
        }
    }, [attendanceRecords, selectedDate]);

    const adultUniform = uniforms.find(u => u.id === uniformSchedule[selectedDate]);
    const kidsAssignment = kidsAssignments[selectedDate];
    const kidsUniform = uniforms.find(u => u.id === kidsAssignment?.uniformId);

    // Filtered attendance for current session
    const currentSessionAttendance = useMemo(() => {
        return (attendanceRecords[selectedDate] || []).filter(r => r.session_type === currentSession);
    }, [attendanceRecords, selectedDate, currentSession]);

    // Transform store members into attendance-ready members
    const members = useMemo(() => {
        const recordsForDay = attendanceRecords[selectedDate] || [];

        return storeMembers.map(m => {
            const getSessionData = (session: '5am' | '9am' | 'evening') => {
                const record = recordsForDay.find(r => r.member_id === m.id && r.session_type === session);
                const isPresent = (optimisticAttendance[m.id] && optimisticAttendance[m.id][session] !== undefined)
                    ? optimisticAttendance[m.id][session]
                    : (record?.present || false);

                return {
                    present: isPresent,
                    time: record?.time || (isPresent ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null)
                };
            };

            const currentSessData = getSessionData(currentSession);

            return {
                id: m.id,
                name: m.name,
                gender: m.gender as 'Varon' | 'Hermana',
                category: (m.category === 'Niño' ? 'Niño' : 'Adulto') as 'Adulto' | 'Niño',
                email: m.email,
                avatar: m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`,
                attendance: {
                    '5am': getSessionData('5am'),
                    '9am': getSessionData('9am'),
                    'evening': getSessionData('evening')
                },
                present: currentSessData.present,
                time: currentSessData.time,
                deliveredBy: (recordsForDay.find(r => r.member_id === m.id && r.session_type === currentSession))?.delivered_by || '',
                collectedBy: (recordsForDay.find(r => r.member_id === m.id && r.session_type === currentSession))?.collected_by || '',
                parentName: (m as any).parentName || ''
            };
        });
    }, [storeMembers, attendanceRecords, selectedDate, optimisticAttendance, currentSession]);

    const [securityChild, setSecurityChild] = useState<any | null>(null);

    const handlePrevDay = () => {
        const [year, month, day] = selectedDate.split('-').map(Number);
        const d = new Date(year, month - 1, day - 1);
        setSelectedDate(format(d, 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        const [year, month, day] = selectedDate.split('-').map(Number);
        const d = new Date(year, month - 1, day + 1);
        setSelectedDate(format(d, 'yyyy-MM-dd'));
    };

    const toggleAttendance = async (memberId: string, sessionType: '5am' | '9am' | 'evening') => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        const sessionData = member.attendance[sessionType];

        if (member.category === 'Niño' && !sessionData.present) {
            // For children, we still use the security modal, but need to know which session
            setSecurityChild({ ...member, targetSession: sessionType });
            return;
        }

        const toggleKey = `${memberId}-${sessionType}`;
        if (processingToggles[toggleKey]) return;

        setProcessingToggles(prev => ({ ...prev, [toggleKey]: true }));

        // Optimistic Update
        const nextState = !sessionData.present;
        setOptimisticAttendance(prev => ({
            ...prev,
            [memberId]: {
                ...(prev[memberId] || {}),
                [sessionType]: nextState
            }
        }));

        const newRecord = {
            member_id: memberId,
            date: selectedDate,
            session_type: sessionType,
            present: nextState,
            time: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        };

        try {
            await saveAttendanceToCloud([newRecord]);
        } catch (error) {
            // Revert on error
            setOptimisticAttendance(prev => {
                if (!prev[memberId]) return prev;
                const updatedSession = { ...prev[memberId] };
                delete updatedSession[sessionType];
                return { ...prev, [memberId]: updatedSession };
            });
            alert("Error al sincronizar con la nube. Verifica tu conexión.");
        } finally {
            setProcessingToggles(prev => {
                const newState = { ...prev };
                delete newState[toggleKey];
                return newState;
            });
        }
    };

    const handleSecurityUpdate = async (id: string, type: 'delivered' | 'collected', value: string) => {
        const member = members.find(m => m.id === id);
        if (!member || !securityChild) return;

        const sessionToUpdate = securityChild.targetSession || currentSession;
        const sessionData = member.attendance[sessionToUpdate as keyof typeof member.attendance];

        const isCheckIn = type === 'delivered';
        const newRecord = {
            member_id: id,
            date: selectedDate,
            session_type: sessionToUpdate,
            present: isCheckIn ? true : (value ? false : sessionData.present),
            time: isCheckIn ? (sessionData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : sessionData.time,
            delivered_by: type === 'delivered' ? value : member.deliveredBy,
            collected_by: type === 'collected' ? value : member.collectedBy
        };

        await saveAttendanceToCloud([newRecord]);
        setSecurityChild(null);
    };

    const handleFinalize = async () => {
        setIsSaving(true);
        try {
            // Forzamos una recarga fresca desde la nube
            await loadAttendanceFromCloud(selectedDate);

            setTimeout(() => {
                setIsSaving(false);
                const attendedOverall = members.filter(m =>
                    m.attendance['5am'].present ||
                    m.attendance['9am'].present ||
                    m.attendance['evening'].present
                ).length;
                alert(`Sincronización completa. ${attendedOverall} miembros marcados en total para el día.`);
            }, 800);
        } catch (error) {
            setIsSaving(false);
            alert("Hubo un problema al finalizar. Por favor, verifica tu conexión.");
        }
    };

    const presentCount = members.filter(m => m.present).length;

    const filteredMembers = useMemo(() => {
        return members.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (activeTab === 'varones') return m.gender === 'Varon' && m.category === 'Adulto';
            if (activeTab === 'hermanas') return m.gender === 'Hermana' && m.category === 'Adulto';
            if (activeTab === 'ninos') return m.category === 'Niño';
            return true;
        });
    }, [members, searchTerm, activeTab]);

    const stats = useMemo(() => {
        const d = new Date(selectedDate + 'T12:00:00');
        const isSunday = d.getDay() === 0;

        const getSessCount = (s: '5am' | '9am' | 'evening') => members.filter(m => m.attendance[s].present).length;

        return {
            varones: members.filter(m => m.gender === 'Varon' && m.category === 'Adulto' && (m.attendance['5am'].present || m.attendance['9am'].present || m.attendance['evening'].present)).length,
            hermanas: members.filter(m => m.gender === 'Hermana' && m.category === 'Adulto' && (m.attendance['5am'].present || m.attendance['9am'].present || m.attendance['evening'].present)).length,
            ninos: members.filter(m => m.category === 'Niño' && (m.attendance['5am'].present || m.attendance['9am'].present || m.attendance['evening'].present)).length,
            total: members.length,
            session5am: getSessCount('5am'),
            session9am: getSessCount('9am'),
            sessionEvening: getSessCount('evening'),
            perfect: members.filter(m => m.attendance['5am'].present && m.attendance['9am'].present && m.attendance['evening'].present).length,
            isSunday
        };
    }, [members, selectedDate]);



    if (!currentUser.id) return null;

    // Security check: Only Admins or Attendance Managers can see this
    const canAccess = currentUser.role === 'Administrador' ||
        currentUser.role === 'Responsable de Asistencia' ||
        currentUser.privileges?.includes('monitor');

    if (!canAccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="glass-card max-w-md w-full p-8 text-center border-rose-500/20 bg-rose-500/5">
                    <Shield className="h-16 w-16 text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black uppercase italic text-rose-500 mb-2">Acceso Restringido</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Lo sentimos, no tienes los permisos necesarios para acceder al Panel de Asistencia Global.
                        Este módulo es exclusivo para el <span className="text-emerald-500 font-bold">Responsable de Asistencia</span>.
                    </p>
                    <Link href="/">
                        <Button className="w-full bg-foreground text-background font-black uppercase tracking-widest h-12 rounded-xl">
                            Volver a mi Dashboard
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const availableSessions = useMemo(() => {
        const d = new Date(selectedDate + 'T12:00:00');
        const dayOfWeek = d.getDay(); // 0 = Domingo, 4 = Jueves
        const isSunday = dayOfWeek === 0;
        const isThursday = dayOfWeek === 4;

        return [
            { id: '5am', label: '5:00 AM' },
            { id: '9am', label: isSunday ? 'Dominical' : '9:00 AM' },
            { id: 'evening', label: isSunday ? '6:00 PM' : (isThursday ? '6:30 PM' : '7:00 PM') }
        ];
    }, [selectedDate]);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                    <div className="w-full lg:w-auto">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground uppercase italic flex flex-wrap items-center gap-2 md:gap-3">
                            <span className="flex items-center gap-1.5">
                                <ClipboardCheck className="h-7 w-7 md:h-10 md:w-10 text-emerald-500" />
                                {currentUser.role === 'Administrador' ? 'Gestión de' : 'Responsable de'}
                            </span>
                            <span className="text-emerald-500">{currentUser.role === 'Administrador' ? ' Iglesia' : ' Asistencia'}</span>
                        </h1>
                        <p className="text-muted-foreground font-light text-xs md:text-base mt-1">Control Oficial de Ingreso - LLDM RODEO</p>
                    </div>
                </div>


                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Panel de Estadísticas Reales</span>
                    </div>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                    {/* Session Summary Stats (Replaces Selector) */}
                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-4 md:p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400">Resumen de Oraciones</span>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: '5:00 AM', count: stats.session5am, color: 'text-sky-400' },
                                { label: stats.isSunday ? 'Dominical' : '9:00 AM', count: stats.session9am, color: 'text-emerald-400' },
                                { label: 'Tarde', count: stats.sessionEvening, color: 'text-amber-400' }
                            ].map((s) => (
                                <div key={s.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-none">
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">{s.label}</span>
                                    <span className={cn("text-lg font-black italic", s.color)}>{s.count}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-emerald-500/20 flex justify-between items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                    setIsRefreshing(true);
                                    await loadAttendanceFromCloud(selectedDate);
                                    setIsRefreshing(false);
                                }}
                                className={cn("text-[9px] font-black uppercase tracking-widest text-emerald-500/50 hover:text-emerald-500 h-7 px-2", isRefreshing && "animate-pulse")}
                            >
                                <Users className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} /> {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
                            </Button>
                            <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                                <Star className="h-2.5 w-2.5 text-emerald-500 fill-emerald-500" />
                                <span className="text-xs font-black text-emerald-500">{stats.perfect}</span>
                            </div>
                        </div>
                    </Card>

                    {/* NEW: Session Pulse (Vertical Bars) */}
                    <Card className="glass-card bg-indigo-500/5 border-indigo-500/20 p-5 md:p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="h-4 w-4 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Actividad por Sesión</span>
                        </div>

                        <div className="flex-1 flex items-end justify-around gap-2 mb-2">
                            {[
                                { label: '5A', count: stats.session5am, color: 'bg-sky-400' },
                                { label: stats.isSunday ? 'DOM' : '9A', count: stats.session9am, color: 'bg-emerald-400' },
                                { label: 'TAR', count: stats.sessionEvening, color: 'bg-amber-400' }
                            ].map((bar) => {
                                const height = stats.total > 0 ? (bar.count / stats.total) * 100 : 0;
                                return (
                                    <div key={bar.label} className="flex flex-col items-center gap-2 w-full max-w-[40px]">
                                        <div className="w-full bg-white/5 rounded-t-lg relative flex items-end overflow-hidden" style={{ height: '80px' }}>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(height, 5)}%` }}
                                                className={cn("w-full transition-all duration-1000", bar.color)}
                                            />
                                            <span className="absolute top-1 left-0 w-full text-center text-[8px] font-black text-white mix-blend-difference">{bar.count}</span>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate w-full text-center">{bar.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-widest mt-auto italic">Comparativa de Reuniones</p>
                    </Card>

                    {/* NEW: Morning Mountain Chart */}
                    <Card className="glass-card bg-cyan-500/5 border-cyan-500/20 p-5 md:p-6 flex flex-col relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <TrendingUp className="h-4 w-4 text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Rendimiento Matinal</span>
                        </div>

                        <div className="flex-1 relative h-20 min-h-[80px] mt-2">
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                <defs>
                                    <linearGradient id="morningGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ d: "M 0 40 L 0 40 L 50 40 L 100 40 L 100 40 Z" }}
                                    animate={{
                                        d: `M 0 40 L 20 40 L 45 ${Math.max(40 - (stats.session5am / (stats.total || 1) * 60), 5)} L 75 ${Math.max(40 - (stats.session9am / (stats.total || 1) * 60), 5)} L 100 40 Z`
                                    }}
                                    fill="url(#morningGradient)"
                                    stroke="rgb(34,211,238)"
                                    strokeWidth="1.5"
                                    className="transition-all duration-[2000ms] ease-out"
                                />

                                <motion.circle
                                    initial={{ cy: 40 }}
                                    animate={{ cy: Math.max(40 - (stats.session5am / (stats.total || 1) * 60), 5) }}
                                    cx="45" r="1.5" fill="rgb(34,211,238)" className="transition-all duration-[2000ms]"
                                />
                                <motion.circle
                                    initial={{ cy: 40 }}
                                    animate={{ cy: Math.max(40 - (stats.session9am / (stats.total || 1) * 60), 5) }}
                                    cx="75" r="1.5" fill="rgb(34,211,238)" className="transition-all duration-[2000ms]"
                                />
                            </svg>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Pico 5 AM</span>
                                <span className="text-sm font-black text-cyan-400 italic">+{stats.session5am}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Pico 9 AM</span>
                                <span className="text-sm font-black text-emerald-400 italic">+{stats.session9am}</span>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                    </Card>

                    {/* Attendance Stats Chart (Based on session with most attendance) */}
                    <Card className="glass-card bg-primary/5 border-primary/20 p-5 md:p-6 flex flex-col justify-center items-center gap-4 relative">
                        <div className="flex w-full justify-between items-start absolute top-4 px-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/80">Impacto Diario</p>
                            <Users className="h-4 w-4 text-primary opacity-50" />
                        </div>

                        {/* Calculations based on the highest attended session to show "max reach" */}
                        {(() => {
                            const maxAttendance = Math.max(stats.session5am, stats.session9am, stats.sessionEvening);
                            const percentage = Math.round((maxAttendance / (stats.total || 1)) * 100);
                            return (
                                <>
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="50%" cy="50%" r="40%" className="stroke-foreground/10 fill-none stroke-[8px]" />
                                            <circle
                                                cx="50%" cy="50%" r="40%"
                                                style={{
                                                    strokeDasharray: '251.2',
                                                    strokeDashoffset: (251.2 - (251.2 * (maxAttendance / (stats.total || 1)))).toString()
                                                }}
                                                className="stroke-emerald-500 fill-none stroke-[8px] transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl md:text-2xl font-black text-foreground">{percentage}%</span>
                                            <span className="text-[8px] uppercase font-bold text-slate-500">Max Alcance</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {maxAttendance} Max</div>
                                        <div className="flex items-center gap-1.5 text-slate-500"><div className="w-2 h-2 rounded-full bg-foreground/20"></div> {stats.total} Total</div>
                                    </div>
                                </>
                            );
                        })()}
                    </Card>

                    {/* Group Distribution (Mini Bars) */}
                    <Card className="glass-card bg-amber-500/5 border-amber-500/20 p-5 md:p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Porcentaje por Grupo</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Varones', color: 'bg-primary', count: stats.varones, total: members.filter(m => m.gender === 'Varon' && m.category === 'Adulto').length },
                                { label: 'Hermanas', color: 'bg-rose-500', count: stats.hermanas, total: members.filter(m => m.gender === 'Hermana' && m.category === 'Adulto').length },
                                { label: 'Niños', color: 'bg-cyan-400', count: stats.ninos, total: members.filter(m => m.category === 'Niño').length }
                            ].map((group) => (
                                <div key={group.label} className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest saturate-[0.8]">
                                        <span>{group.label}</span>
                                        <span>{group.count} / {group.total}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(group.count / (group.total || 1)) * 100}%` }}
                                            className={cn("h-full transition-all duration-1000", group.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>


                {/* Historial Semanal (Gráfico de Barras con Límite de miembros) */}
                <Card className="glass-card bg-white/5 border-white/10 p-5 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="h-4 w-4 text-emerald-500" />
                                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground">Tendencia de Asistencia Real</h3>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Últimos 7 días • Basado en el total de la membresía ({storeMembers.length})</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500/80"></div> Asistencia</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-white/20 bg-white/5"></div> Capacidad Total</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 md:gap-4 items-end h-48 md:h-64 mb-4">
                        {weeklyStats.map((day, idx) => {
                            const isToday = day.date === selectedDate;
                            return (
                                <div key={day.date} className="group relative flex flex-col items-center h-full w-full">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                        <div className="bg-black/90 text-white text-[9px] px-2 py-1 rounded-md border border-white/10 whitespace-nowrap font-black">
                                            {day.attended} Hermanos ({Math.round(day.percentage)}%)
                                        </div>
                                    </div>

                                    {/* Background Bar (Total Capacity) */}
                                    <div className="w-full h-full bg-white/5 border border-white/5 rounded-t-xl overflow-hidden relative flex items-end">
                                        {/* Filled Bar (Attendance) */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(day.percentage, 2)}%` }}
                                            transition={{ duration: 1.5, delay: idx * 0.1, ease: 'easeOut' }}
                                            className={cn(
                                                "w-full transition-all duration-500 relative",
                                                isToday
                                                    ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                    : "bg-gradient-to-t from-slate-700 to-slate-500 opacity-60 group-hover:opacity-100"
                                            )}
                                        >
                                            <div className="absolute top-2 left-0 w-full text-center text-[8px] md:text-[10px] font-black text-white mix-blend-overlay">
                                                {day.attended}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Date Label */}
                                    <span className={cn(
                                        "text-[8px] md:text-[10px] font-bold mt-3 uppercase tracking-tighter truncate w-full text-center",
                                        isToday ? "text-emerald-500" : "text-slate-500"
                                    )}>
                                        {format(parseISO(day.date), 'eee dd', { locale: es })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Primary Controls (Date Selector & Finalize) relocated for better context grouping */}
                <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
                    <div className="flex items-center justify-between gap-4 bg-foreground/5 p-2 rounded-2xl border border-border/20 w-full lg:max-w-md backdrop-blur-xl">
                        <Button variant="ghost" size="icon" onClick={handlePrevDay} className="rounded-xl hover:bg-foreground/10 h-11 w-11 shrink-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-0.5 leading-none">Fecha Seleccionada</span>
                            <span className="text-[11px] md:text-xs font-black text-foreground uppercase tracking-tighter text-center">
                                {format(new Date(selectedDate + 'T12:00:00'), "EEEE d 'MMMM'", { locale: es })}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleNextDay} className="rounded-xl hover:bg-foreground/10 h-11 w-11 shrink-0">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleFinalize}
                        className="w-full lg:flex-1 bg-emerald-600 text-foreground hover:bg-emerald-500 glow-emerald border-none font-black uppercase tracking-widest px-8 h-12 rounded-2xl text-[10px] md:text-xs shrink-0"
                    >
                        <Save className="h-4 w-4 mr-2" /> Finalizar Asistencia
                    </Button>
                </div>

                {/* View Tabs */}
                <div className="flex p-1.5 md:p-1 bg-foreground/5 rounded-2x md:rounded-3xl border border-border/40 w-full md:w-fit mx-auto md:mx-0 backdrop-blur-xl overflow-x-auto no-scrollbar scroll-smooth snap-x">
                    <button
                        onClick={() => setActiveTab('varones')}
                        className={cn(
                            "flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'varones' ? "bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]" : "text-slate-500 hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <Shield className="w-4 h-4" /> Varones <span className="opacity-50 font-bold ml-1">({stats.varones})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('hermanas')}
                        className={cn(
                            "flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'hermanas' ? "bg-rose-500 text-black shadow-lg shadow-rose-500/20 scale-[1.02]" : "text-slate-500 hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <Star className="w-4 h-4" /> Hermanas <span className="opacity-50 font-bold ml-1">({stats.hermanas})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ninos')}
                        className={cn(
                            "flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'ninos' ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 scale-[1.02]" : "text-slate-500 hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <Baby className="w-4 h-4" /> Niños <span className="opacity-50 font-bold ml-1">({stats.ninos})</span>
                    </button>
                </div>

                {/* Member Check-in List */}
                <Card className="glass-card border-none bg-foreground/5 overflow-hidden">
                    <CardHeader className="border-b border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 md:py-8">
                        <div className="text-center sm:text-left">
                            <CardTitle className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter flex items-center justify-center sm:justify-start gap-3">
                                {activeTab === 'varones' && <span className="text-primary">Lista de Varones</span>}
                                {activeTab === 'hermanas' && <span className="text-rose-500">Lista de Hermanas</span>}
                                {activeTab === 'ninos' && <span className="text-cyan-400">Lista de Niños</span>}
                            </CardTitle>
                            <CardDescription className="uppercase text-[9px] md:text-[10px] font-bold tracking-widest text-slate-500 mt-1">Ingreso Seguro LLDM Rodeo</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Buscar por nombre..."
                                className="pl-12 bg-foreground/5 border-border/40 text-sm h-11 md:h-12 rounded-2xl focus:ring-primary/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-white/5">
                            {filteredMembers.map((member) => (
                                <motion.div
                                    key={member.id}
                                    whileTap={{ scale: 0.99 }}
                                    className={cn(
                                        "p-4 md:p-6 flex items-center justify-between transition-all duration-300 group hover:z-10",
                                        "hover:bg-foreground/[0.03] border-b border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                        <div className={cn(
                                            "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0",
                                            "border-border/40"
                                        )}>
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 pr-2">
                                            <p className={cn(
                                                "font-black uppercase tracking-tight transition-colors text-sm md:text-lg truncate text-foreground/90"
                                            )}>{member.name}</p>
                                            <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none block mt-0.5">{member.category}</span>
                                        </div>
                                    </div>

                                    {/* Triple Selection Circles */}
                                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                                        {[
                                            { id: '5am', label: '5' },
                                            { id: '9am', label: stats.isSunday ? 'D' : '9' },
                                            { id: 'evening', label: 'T' }
                                        ].map((sess) => {
                                            const isPresent = member.attendance[sess.id as keyof typeof member.attendance].present;
                                            const sessLabel = sess.id === 'evening' ? 'Tarde' : (sess.id === '9am' && stats.isSunday ? 'Dom' : sess.id);
                                            const isProcessing = processingToggles[`${member.id}-${sess.id}`];

                                            return (
                                                <div key={sess.id} className="flex flex-col items-center gap-1">
                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleAttendance(member.id, sess.id as any);
                                                        }}
                                                        className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-black text-[10px] sm:text-xs",
                                                            isProcessing && "animate-pulse opacity-50 cursor-wait",
                                                            isPresent
                                                                ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                                                                : "bg-foreground/5 border-border/20 text-slate-500 hover:border-emerald-500/50"
                                                        )}
                                                    >
                                                        {isProcessing ? (
                                                            <Clock className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            isPresent ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : sess.label
                                                        )}
                                                    </button>
                                                    <span className={cn(
                                                        "text-[7px] uppercase font-black tracking-tighter",
                                                        isPresent ? "text-emerald-500" : "text-slate-600"
                                                    )}>
                                                        {sessLabel}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </main>

            {/* Security Check Modal */}
            {securityChild && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg glass-card bg-[#0f172a] border-border/40 overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/20 bg-cyan-400/5 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400/30 overflow-hidden shadow-lg">
                                    <img src={securityChild.avatar} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase text-foreground italic">{securityChild.name}</CardTitle>
                                    <CardDescription className="text-cyan-400 font-bold tracking-widest uppercase text-[10px]">Seguridad de Entrega y Recepción</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-auto rounded-full hover:bg-foreground/10" onClick={() => setSecurityChild(null)}>
                                    <XCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {/* Check-in Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <LogIn className="w-5 h-5" />
                                    <h4 className="text-sm font-black uppercase tracking-widest italic">Entrada al Templo / Corito</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Entregado por (Padre/Madre/Tutor)</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            placeholder="Nombre de quien entrega..."
                                            className="pl-10 bg-foreground/5 border-border/40 focus:ring-emerald-500/50"
                                            defaultValue={securityChild.deliveredBy || securityChild.parentName}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSecurityUpdate(securityChild.id, 'delivered', (e.target as HTMLInputElement).value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-emerald-600 text-foreground font-black uppercase tracking-widest h-12 rounded-xl"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Nombre de quien entrega..."]') as HTMLInputElement;
                                        handleSecurityUpdate(securityChild.id, 'delivered', input.value);
                                    }}
                                >
                                    Confirmar Ingreso Seguro
                                </Button>
                            </div>

                            <div className="border-t border-border/20 pt-8 space-y-4">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <LogOut className="w-5 h-5" />
                                    <h4 className="text-sm font-black uppercase tracking-widest italic">Salida / Entrega Final</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recogido por (Autorizado)</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            placeholder="Nombre de quien recoge..."
                                            className="pl-10 bg-foreground/5 border-border/40 focus:ring-amber-500/50"
                                            defaultValue={securityChild.collectedBy}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSecurityUpdate(securityChild.id, 'collected', (e.target as HTMLInputElement).value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-black uppercase tracking-widest h-12 rounded-xl"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Nombre de quien recoge..."]') as HTMLInputElement;
                                        handleSecurityUpdate(securityChild.id, 'collected', input.value);
                                    }}
                                >
                                    Confirmar Entrega a Padres
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
