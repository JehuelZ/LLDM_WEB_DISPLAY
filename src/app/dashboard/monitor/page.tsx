
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
    const { currentUser, uniforms, uniformSchedule, kidsAssignments, members: storeMembers, loadMembersFromCloud } = useAppStore();
    const [activeTab, setActiveTab] = useState<'varones' | 'hermanas' | 'ninos'>('varones');
    const [searchTerm, setSearchTerm] = useState('');
    const [localAttendance, setLocalAttendance] = useState<Record<number, { present: boolean, time: string | null, deliveredBy?: string, collectedBy?: string }>>({});

    useEffect(() => {
        loadMembersFromCloud();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];
    const adultUniform = uniforms.find(u => u.id === uniformSchedule[todayStr]);
    const kidsAssignment = kidsAssignments[todayStr];
    const kidsUniform = uniforms.find(u => u.id === kidsAssignment?.uniformId);

    // Transform store members into attendance-ready members
    const members = useMemo(() => {
        return storeMembers.map(m => ({
            id: m.id as unknown as number,
            name: m.name,
            gender: m.gender as 'Varon' | 'Hermana',
            category: (m.category === 'Niño' ? 'Niño' : 'Adulto') as 'Adulto' | 'Niño',
            email: m.email,
            avatar: m.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            present: localAttendance[m.id as unknown as number]?.present || false,
            time: localAttendance[m.id as unknown as number]?.time || null,
            deliveredBy: localAttendance[m.id as unknown as number]?.deliveredBy || '',
            collectedBy: localAttendance[m.id as unknown as number]?.collectedBy || '',
            parentName: m.parentName || ''
        }));
    }, [storeMembers, localAttendance]);

    const [securityChild, setSecurityChild] = useState<any | null>(null);

    const toggleAttendance = (id: number) => {
        const member = members.find(m => m.id === id);
        if (member?.category === 'Niño' && !member.present) {
            setSecurityChild(member);
            return;
        }

        setLocalAttendance(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                present: !prev[id]?.present,
                time: !prev[id]?.present ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
            }
        }));
    };

    const handleSecurityUpdate = (id: number, type: 'delivered' | 'collected', value: string) => {
        setLocalAttendance(prev => {
            const isCheckIn = type === 'delivered';
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    present: isCheckIn ? true : (value ? false : prev[id]?.present),
                    time: isCheckIn ? (prev[id]?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : prev[id]?.time,
                    deliveredBy: type === 'delivered' ? value : prev[id]?.deliveredBy,
                    collectedBy: type === 'collected' ? value : prev[id]?.collectedBy
                }
            };
        });
        setSecurityChild(null);
    };

    const handleFinalize = () => {
        const attended = Object.entries(localAttendance).filter(([_, v]) => v.present).length;
        alert(`Asistencia guardada: ${attended} presentes. Los datos se han sincronizado con la nube.`);
        // Here we would typically call a batch update to Supabase
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
                    {/* Session Info */}
                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-5 md:p-6 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
                            <ClipboardCheck className="h-16 w-16 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400">Sesión Actual</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-foreground italic uppercase relative z-10">Servicio General</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase font-bold relative z-10">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </Card>

                    {/* Attendance Counter */}
                    <Card className="glass-card bg-primary/5 border-primary/20 p-5 md:p-6 flex justify-between items-center">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1">Presentes ahora</p>
                            <h3 className="text-3xl md:text-4xl font-black text-foreground italic">{presentCount} <span className="text-sm md:text-lg text-slate-500 not-italic">/ {members.length}</span></h3>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                    </Card>

                    {/* Access Status */}
                    <Card className="glass-card bg-amber-500/5 border-amber-500/20 p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-amber-500">Seguridad</span>
                        </div>
                        <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed italic opacity-80">
                            Registro oficial de asistencia.
                        </p>
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
