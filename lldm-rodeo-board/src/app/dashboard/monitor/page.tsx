
'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Users, CheckCircle2, XCircle, Clock, Calendar, Filter, Save, AlertCircle, Star, LogIn, LogOut, UserCircle, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
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
    const { uniforms, uniformSchedule, kidsAssignments } = useAppStore();
    const [activeTab, setActiveTab] = useState<'varones' | 'hermanas' | 'ninos'>('varones');
    const [searchTerm, setSearchTerm] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];
    const adultUniform = uniforms.find(u => u.id === uniformSchedule[todayStr]);
    const kidsAssignment = kidsAssignments[todayStr];
    const kidsUniform = uniforms.find(u => u.id === kidsAssignment?.uniformId);

    // Mock data for members to check attendance
    const [members, setMembers] = useState<AttendanceMember[]>([
        { id: 1, name: 'Abraham Samuel', gender: 'Varon', category: 'Adulto', email: 'abraham@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', present: false, time: null },
        { id: 2, name: 'Maria Garcia', gender: 'Hermana', category: 'Adulto', email: 'maria@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', present: true, time: '08:55 AM' },
        { id: 3, name: 'Juan P. Hernandez', gender: 'Varon', category: 'Adulto', email: 'juan@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', present: false, time: null },
        { id: 4, name: 'Ricardo Mendez', gender: 'Varon', category: 'Adulto', email: 'ricardo@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', present: false, time: null },
        { id: 5, name: 'Samuelito Rojas Jr.', gender: 'Varon', category: 'Niño', email: 'samuelito@example.com', avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&h=200&fit=crop', present: true, time: '09:05 AM', parentName: 'Samuel Rojas', deliveredBy: 'Samuel Rojas', collectedBy: '' },
        { id: 6, name: 'Esther Lopez', gender: 'Hermana', category: 'Adulto', email: 'esther@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', present: false, time: null },
        { id: 7, name: 'Mateo Rojas', gender: 'Varon', category: 'Niño', email: 'mateo@example.com', avatar: 'https://images.unsplash.com/photo-1503919919749-645b3419ee53?w=200&h=200&fit=crop', present: true, time: '09:12 AM', parentName: 'Samuel Rojas', deliveredBy: 'Samuel Rojas', collectedBy: '' },
        { id: 8, name: 'Rebeca Garcia', gender: 'Hermana', category: 'Niño', email: 'rebeca@example.com', avatar: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=100&h=100&fit=crop', present: false, time: null, parentName: 'Hermia Garcia', deliveredBy: '', collectedBy: '' },
    ]);

    const [securityChild, setSecurityChild] = useState<AttendanceMember | null>(null);

    const toggleAttendance = (id: number) => {
        const member = members.find(m => m.id === id);
        if (member?.category === 'Niño') {
            setSecurityChild(member);
            return;
        }

        setMembers(members.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    present: !m.present,
                    time: !m.present ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
                };
            }
            return m;
        }));
    };

    const handleSecurityUpdate = (id: number, type: 'delivered' | 'collected', value: string) => {
        setMembers(members.map(m => {
            if (m.id === id) {
                const isCheckIn = type === 'delivered';
                return {
                    ...m,
                    present: isCheckIn ? true : (value ? false : m.present),
                    time: isCheckIn ? (m.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : m.time,
                    deliveredBy: type === 'delivered' ? value : m.deliveredBy,
                    collectedBy: type === 'collected' ? value : m.collectedBy
                };
            }
            return m;
        }));
        setSecurityChild(null);
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
                            <ClipboardCheck className="h-10 w-10 text-emerald-500" />
                            Responsable de <span className="text-emerald-500">Asistencia</span>
                        </h1>
                        <p className="text-muted-foreground font-light">Control Oficial de Ingreso - LLDM RODEO</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-emerald-600 text-foreground hover:bg-emerald-500 glow-emerald border-none font-bold gap-2">
                            <Save className="h-4 w-4" /> Finalizar Registro
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Session Info */}
                    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-6 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <ClipboardCheck className="h-16 w-16 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="h-5 w-5 text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Sesión Actual</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground italic uppercase relative z-10">Servicio General</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-bold relative z-10">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

                        {(adultUniform || kidsUniform) && (
                            <div className="mt-4 flex flex-col gap-2 relative z-10 animate-in slide-in-from-left duration-500">
                                {adultUniform && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-lg w-fit">
                                        <Shirt className="w-3 h-3 text-secondary" />
                                        <span className="text-[9px] font-black text-secondary uppercase italic">Coro: {adultUniform.name}</span>
                                    </div>
                                )}
                                {kidsUniform && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-lg w-fit">
                                        <Shirt className="w-3 h-3 text-cyan-400" />
                                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter">Corito: {kidsUniform.name}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Attendance Counter */}
                    <Card className="glass-card bg-primary/5 border-primary/20 p-6 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1">Presentes ahora</p>
                            <h3 className="text-4xl font-black text-foreground italic">{presentCount} <span className="text-lg text-slate-500 not-italic">/ {members.length}</span></h3>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                    </Card>

                    {/* Access Status */}
                    <Card className="glass-card bg-amber-500/5 border-amber-500/20 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Seguridad del Sistema</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Tu registro es la <span className="text-amber-500 font-bold">única fuente oficial</span>. Los miembros no pueden modificar su asistencia personalmente.
                        </p>
                    </Card>
                </div>

                {/* View Tabs */}
                <div className="flex p-1.5 bg-foreground/5 rounded-3xl border border-border/40 w-fit mx-auto md:mx-0 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('varones')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3",
                            activeTab === 'varones' ? "bg-primary text-black shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Shield className="w-4 h-4" /> Varones <span className="opacity-50 font-bold">({stats.varones})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('hermanas')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3",
                            activeTab === 'hermanas' ? "bg-rose-500 text-black shadow-[0_0_20px_rgba(244,63,94,0.5)]" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Star className="w-4 h-4" /> Hermanas <span className="opacity-50 font-bold">({stats.hermanas})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ninos')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3",
                            activeTab === 'ninos' ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "text-slate-500 hover:text-foreground"
                        )}
                    >
                        <Baby className="w-4 h-4" /> Niños <span className="opacity-50 font-bold">({stats.ninos})</span>
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
                                        "p-6 flex items-center justify-between cursor-pointer transition-all duration-300 group hover:z-10",
                                        member.present ? "bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" : "hover:bg-foreground/[0.03]"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                            member.present ? "border-emerald-500/50 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-border/40"
                                        )}>
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-black uppercase tracking-tight transition-colors text-lg",
                                                member.present ? "text-foreground" : "text-slate-400 group-hover:text-foreground"
                                            )}>{member.name}</p>
                                            <div className="flex flex-col gap-1 mt-0.5">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{member.category}</span>
                                                {member.category === 'Niño' && (
                                                    <span className="text-[9px] text-cyan-400 font-bold italic leading-none">Hijo de {member.parentName}</span>
                                                )}
                                                {member.present && (
                                                    <span className="text-[10px] text-emerald-500 font-black flex items-center gap-1 mt-1">
                                                        <Clock className="h-3 w-3" /> {member.time}
                                                        {member.deliveredBy && <span className="text-slate-500 scale-90 ml-1">• En: {member.deliveredBy}</span>}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                        member.present
                                            ? "bg-emerald-500 text-black rotate-0 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            : "bg-foreground/5 text-slate-600 -rotate-90 group-hover:rotate-0 group-hover:bg-foreground/10 group-hover:text-slate-400"
                                    )}>
                                        {member.present ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
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
