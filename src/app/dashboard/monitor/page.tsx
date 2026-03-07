'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Users, CheckCircle2, XCircle, Clock, Calendar, Filter, Save, AlertCircle, Star, LogIn, LogOut, UserCircle, Shirt } from 'lucide-react';
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
    id: number;
    name: string;
    gender: 'Varon' | 'Hermana';
    category: 'Adulto' | 'Niño';
    email: string;
    avatar: string;
    present: boolean;
    time: string | null;
    parentName?: string;
    deliveredBy?: string;
    collectedBy?: string;
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

    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

    useEffect(() => {
        loadMembersFromCloud();
        loadAttendanceFromCloud(todayStr);
    }, [todayStr]);

    const adultUniform = uniforms.find(u => u.id === uniformSchedule[todayStr]);
    const kidsAssignment = kidsAssignments[todayStr];
    const kidsUniform = uniforms.find(u => u.id === kidsAssignment?.uniformId);

    // Filtered attendance for current session
    const currentSessionAttendance = useMemo(() => {
        return (attendanceRecords[todayStr] || []).filter(r => r.session_type === currentSession);
    }, [attendanceRecords, todayStr, currentSession]);

    // Transform store members into attendance-ready members
    const members = useMemo(() => {
        return storeMembers.map(m => {
            const record = currentSessionAttendance.find(r => r.member_id === m.id);
            return {
                id: m.id,
                name: m.name,
                gender: m.gender as 'Varon' | 'Hermana',
                category: (m.category === 'Niño' ? 'Niño' : 'Adulto') as 'Adulto' | 'Niño',
                email: m.email,
                avatar: m.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                present: record?.present || false,
                time: record?.time || null,
                deliveredBy: record?.delivered_by || '',
                collectedBy: record?.collected_by || '',
                parentName: (m as any).parentName || ''
            };
        });
    }, [storeMembers, currentSessionAttendance]);

    const [securityChild, setSecurityChild] = useState<any | null>(null);

    const toggleAttendance = async (memberId: string) => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        if (member.category === 'Niño' && !member.present) {
            setSecurityChild(member);
            return;
        }

        const newRecord = {
            member_id: memberId,
            date: todayStr,
            session_type: currentSession,
            present: !member.present,
            time: !member.present ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        };

        await saveAttendanceToCloud([newRecord]);
    };

    const handleSecurityUpdate = async (id: string, type: 'delivered' | 'collected', value: string) => {
        const member = members.find(m => m.id === id);
        if (!member) return;

        const isCheckIn = type === 'delivered';
        const newRecord = {
            member_id: id,
            date: todayStr,
            session_type: currentSession,
            present: isCheckIn ? true : (value ? false : member.present),
            time: isCheckIn ? (member.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : member.time,
            delivered_by: type === 'delivered' ? value : member.deliveredBy,
            collected_by: type === 'collected' ? value : member.collectedBy
        };

        await saveAttendanceToCloud([newRecord]);
        setSecurityChild(null);
    };

    const handleFinalize = async () => {
        setIsSaving(true);
        // Records are already saved on toggle, but we can do a final sync or report generation here
        setTimeout(() => {
            setIsSaving(false);
            const attended = members.filter(m => m.present).length;
            alert(`Sincronización completa. ${attended} miembros registrados para la sesión de ${currentSession === '5am' ? 'las 5:00 AM' : currentSession === '9am' ? 'las 9:00 AM' : 'la tarde'}.`);
        }, 1000);
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
        varones: members.filter(m => m.gender === 'Varon' && m.category === 'Adulto' && m.present).length,
        hermanas: members.filter(m => m.gender === 'Hermana' && m.category === 'Adulto' && m.present).length,
        ninos: members.filter(m => m.category === 'Niño' && m.present).length,
        total: members.length,
        totalPresent: members.filter(m => m.present).length
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

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase italic flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                            <span className="flex items-center gap-2">
                                <ClipboardCheck className="h-8 w-8 md:h-10 md:w-10 text-emerald-500" />
                                {currentUser.role === 'Administrador' ? 'Gestión de' : 'Responsable de'}
                            </span>
                            <span className="text-emerald-500">{currentUser.role === 'Administrador' ? ' Iglesia' : ' Asistencia'}</span>
                        </h1>
                        <p className="text-muted-foreground font-light text-sm md:text-base">Control Oficial de Ingreso - LLDM RODEO</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            onClick={handleFinalize}
                            className="flex-1 md:flex-none bg-emerald-600 text-foreground hover:bg-emerald-500 glow-emerald border-none font-bold gap-2 h-12 md:h-auto"
                        >
                            <Save className="h-4 w-4" /> Finalizar
                        </Button>
                    </div>
                </div>


                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                    {/* Session Selector */}
                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-5 md:p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400">Seleccionar Sesión</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 relative z-10">
                            {[
                                { id: '5am', label: '5:00 AM', icon: <Clock className="w-3 h-3" /> },
                                { id: '9am', label: '9:00 AM', icon: <Clock className="w-3 h-3" /> },
                                { id: 'evening', label: '7:00 PM', icon: <Clock className="w-3 h-3" /> }
                            ].map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => setCurrentSession(session.id as any)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 gap-1",
                                        currentSession === session.id
                                            ? "bg-emerald-500 border-emerald-400 text-black shadow-lg scale-105"
                                            : "bg-foreground/5 border-border/40 text-slate-400 hover:border-emerald-500/50"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-tight">{session.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold text-center italic">{format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</p>
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
                <div className="flex p-1 bg-foreground/5 rounded-2xl md:rounded-3xl border border-border/40 w-full md:w-fit mx-auto md:mx-0 backdrop-blur-xl overflow-x-auto no-scrollbar scroll-smooth snap-x">
                    <button
                        onClick={() => setActiveTab('varones')}
                        className={cn(
                            "flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'varones' ? "bg-primary text-black shadow-lg" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" /> Varones <span className="opacity-50 font-bold hidden xs:inline">({stats.varones})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('hermanas')}
                        className={cn(
                            "flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'hermanas' ? "bg-rose-500 text-black shadow-lg" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Star className="w-3.5 h-3.5 md:w-4 md:h-4" /> Hermanas <span className="opacity-50 font-bold hidden xs:inline">({stats.hermanas})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ninos')}
                        className={cn(
                            "flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap snap-center",
                            activeTab === 'ninos' ? "bg-cyan-400 text-black shadow-lg" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Baby className="w-3.5 h-3.5 md:w-4 md:h-4" /> Niños <span className="opacity-50 font-bold hidden xs:inline">({stats.ninos})</span>
                    </button>
                </div>

                {/* Member Check-in List */}
                <Card className="glass-card border-none bg-foreground/5 overflow-hidden">
                    <CardHeader className="border-b border-border/20 flex flex-col md:flex-row items-center justify-between gap-6 py-8">
                        <div>
                            <CardTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                {activeTab === 'varones' && <span className="text-primary truncate">Lista de Varones</span>}
                                {activeTab === 'hermanas' && <span className="text-rose-500 truncate">Lista de Hermanas</span>}
                                {activeTab === 'ninos' && <span className="text-cyan-400 truncate">Lista de Niños</span>}
                            </CardTitle>
                            <CardDescription className="uppercase text-[10px] font-bold tracking-widest text-slate-500 mt-1">Ingreso Seguro LLDM Rodeo</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Buscar por nombre..."
                                className="pl-12 bg-foreground/5 border-border/40 text-sm h-12 rounded-2xl focus:ring-primary/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-white/5">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => toggleAttendance(member.id)}
                                    className={cn(
                                        "p-4 md:p-6 flex items-center justify-between cursor-pointer transition-all duration-300 group hover:z-10",
                                        member.present ? "bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" : "hover:bg-foreground/[0.03]"
                                    )}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={cn(
                                            "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                            member.present ? "border-emerald-500/50 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-border/40"
                                        )}>
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-black uppercase tracking-tight transition-colors text-base md:text-lg saturate-[0.8]",
                                                member.present ? "text-foreground" : "text-slate-400 group-hover:text-foreground"
                                            )}>{member.name}</p>
                                            <div className="flex flex-col gap-0.5 mt-0.5">
                                                <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{member.category}</span>
                                                {member.present && (
                                                    <span className="text-[9px] md:text-[10px] text-emerald-500 font-black flex items-center gap-1 mt-1">
                                                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" /> {member.time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                        member.present
                                            ? "bg-emerald-500 text-black rotate-0 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            : "bg-foreground/5 text-slate-600 -rotate-90 group-hover:rotate-0 group-hover:bg-foreground/10 group-hover:text-slate-400"
                                    )}>
                                        {member.present ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" /> : <XCircle className="h-5 w-5 md:h-6 md:w-6" />}
                                    </div>
                                </div>
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
