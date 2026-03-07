'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Users, CheckCircle2, XCircle, Clock, Calendar, Filter, Save, AlertCircle, Star, LogIn, LogOut, UserCircle, Shirt, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { Baby, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
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
        saveAttendanceToCloud
    } = useAppStore();

    const [activeTab, setActiveTab] = useState<'varones' | 'hermanas' | 'ninos'>('varones');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSession, setCurrentSession] = useState<'5am' | '9am' | 'evening'>('5am');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    // MemberID -> Record<SessionType, present>
    const [optimisticAttendance, setOptimisticAttendance] = useState<Record<string, Record<string, boolean>>>({});

    useEffect(() => {
        loadMembersFromCloud();
    }, []);

    useEffect(() => {
        // Al cambiar de fecha o sesión, limpiamos el estado optimista
        // y cargamos los datos reales desde la nube de inmediato.
        setOptimisticAttendance({});
        loadAttendanceFromCloud(selectedDate);
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
                avatar: m.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
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
            alert("Error al guardar la asistencia. Intenta de nuevo.");
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

    const stats = {
        varones: members.filter(m => m.gender === 'Varon' && m.category === 'Adulto' && m.attendance[currentSession].present).length,
        hermanas: members.filter(m => m.gender === 'Hermana' && m.category === 'Adulto' && m.attendance[currentSession].present).length,
        ninos: members.filter(m => m.category === 'Niño' && m.attendance[currentSession].present).length,
        total: members.length,
        totalPresent: members.filter(m => m.attendance[currentSession].present).length
    };



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
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                        <div className="flex items-center justify-between gap-2 bg-foreground/5 p-1.5 rounded-2xl border border-border/20 flex-1 lg:flex-none">
                            <Button variant="ghost" size="icon" onClick={handlePrevDay} className="rounded-xl hover:bg-foreground/10 h-9 w-9 shrink-0">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-col items-center px-2 min-w-[120px]">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary italic leading-none mb-1">Fecha de Lista</span>
                                <span className="text-[10px] md:text-xs font-black text-foreground uppercase tracking-tighter text-center">
                                    {format(new Date(selectedDate + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es })}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleNextDay} className="rounded-xl hover:bg-foreground/10 h-9 w-9 shrink-0">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleFinalize}
                            className="bg-emerald-600 text-foreground hover:bg-emerald-500 glow-emerald border-none font-black uppercase tracking-widest px-6 h-12 lg:h-11 rounded-2xl md:rounded-xl text-[10px]"
                        >
                            <Save className="h-4 w-4 mr-2" /> Finalizar
                        </Button>
                    </div>
                </div>


                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                    {/* Session Selector */}
                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-4 md:p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400">Seleccionar Sesión</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 relative z-10">
                            {availableSessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => setCurrentSession(session.id as any)}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-3 md:py-2 px-1 rounded-2xl border transition-all duration-300 gap-1.5",
                                        currentSession === session.id
                                            ? "bg-emerald-500 border-emerald-400 text-black shadow-lg scale-105"
                                            : "bg-foreground/5 border-border/40 text-slate-400 hover:border-emerald-500/50"
                                    )}
                                >
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tight leading-none">{session.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[9px] md:text-[10px] text-slate-500 mt-4 uppercase font-bold text-center italic">{format(new Date(selectedDate + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es })}</p>
                    </Card>

                    {/* Attendance Stats Chart (Donut-like) */}
                    <Card className="glass-card bg-primary/5 border-primary/20 p-5 md:p-6 flex flex-col justify-center items-center gap-4 relative">
                        <div className="flex w-full justify-between items-start absolute top-4 px-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/80">Estadística Global</p>
                            <Users className="h-4 w-4 text-primary opacity-50" />
                        </div>

                        <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                            {/* Simple CSS Circular Chart */}
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    className="stroke-foreground/10 fill-none stroke-[8px]"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    style={{
                                        strokeDasharray: '251.2',
                                        strokeDashoffset: (251.2 - (251.2 * (stats.totalPresent / (stats.total || 1)))).toString()
                                    }}
                                    className="stroke-emerald-500 fill-none stroke-[8px] transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl md:text-2xl font-black text-foreground">{Math.round((stats.totalPresent / (stats.total || 1)) * 100)}%</span>
                                <span className="text-[8px] uppercase font-bold text-slate-500">Presentes</span>
                            </div>
                        </div>

                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {stats.totalPresent}</div>
                            <div className="flex items-center gap-1.5 text-slate-500"><div className="w-2 h-2 rounded-full bg-foreground/20"></div> {stats.total - stats.totalPresent} Faltan</div>
                        </div>
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
                                            { id: '9am', label: '9' },
                                            { id: 'evening', label: 'T' }
                                        ].map((sess) => {
                                            const isPresent = member.attendance[sess.id as keyof typeof member.attendance].present;
                                            return (
                                                <div key={sess.id} className="flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleAttendance(member.id, sess.id as any);
                                                        }}
                                                        className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-black text-[10px] sm:text-xs",
                                                            isPresent
                                                                ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                                                                : "bg-foreground/5 border-border/20 text-slate-500 hover:border-emerald-500/50"
                                                        )}
                                                    >
                                                        {isPresent ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : sess.label}
                                                    </button>
                                                    <span className={cn(
                                                        "text-[7px] uppercase font-black tracking-tighter",
                                                        isPresent ? "text-emerald-500" : "text-slate-600"
                                                    )}>
                                                        {sess.id === 'evening' ? 'Tarde' : sess.id}
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
