'use client';

import { motion } from 'framer-motion';
import { Baby, Clock, Calendar, Star, Users, ArrowLeft, CheckCircle2, AlertCircle, Music, Trophy, Target, Download, ExternalLink, TrendingUp, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { cn, getLocalDateString } from '@/lib/utils';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function NiñosDashboard() {
    const { currentUser, kidsAssignments, uniforms } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    const childProfile = currentUser.category === 'Niño' ? { ...currentUser, parentName: currentUser.parentName || 'Padre/Madre' } : {
        name: 'Sin Asignar',
        member_group: 'Niños',
        avatar: `https://ui-avatars.com/api/?name=Niño&background=random`,
        medals: 0,
        nextPrivilege: 'No definido',
        parentName: 'N/A'
    };

    // Find the next available assignment in the store
    const nextAssignmentDate = Object.keys(kidsAssignments).sort().find(d => new Date(d) >= new Date()) || getLocalDateString();
    const assignment = kidsAssignments[nextAssignmentDate];
    const assignmentUniform = uniforms.find(u => u.id === assignment?.uniformId);

    const responsibilities = [
        {
            part: 'Primera Parte',
            child: assignment?.serviceChild || 'Por asignar',
            role: 'Dirigente',
            description: 'Llevar el orden de los cantos y la oración inicial.'
        },
        {
            part: 'Segunda Parte',
            child: assignment?.doctrineChild || 'Por asignar',
            role: 'Expositor',
            description: 'Explicar el tema semanal.'
        }
    ];

    const choirInfo = {
        responsable: 'Responsable de Coro',
        nextRehearsal: 'Por definir',
        songs: [],
    };

    return (
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-cyan-400/30">
                                <img src={childProfile.avatar} alt={childProfile.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-xl">
                                <Trophy className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-[10px] font-black uppercase tracking-widest transition-colors mb-2">
                                <ArrowLeft className="w-3 h-3" /> Panel General
                            </Link>
                            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">
                                Hola, <span className="text-cyan-400">{childProfile.name.split(' ')[0]}</span>!
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest bg-foreground/5 px-2 py-0.5 rounded border border-border/20">{childProfile.member_group}</span>
                                <span className="text-xs text-emerald-500/80 font-black uppercase flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-emerald-500" /> {childProfile.medals} Medallas de Fidelidad
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="primitivo" className="px-8 flex-1 md:flex-none">
                            Misión de Hoy
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* My Task and Stats */}
                    <div className="space-y-6">
                        <Card className="glass-card border-none bg-black/40 overflow-hidden relative group">
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 group-hover:w-2 transition-all" />
                            
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.2em] flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Mi Próximo Privilegio
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 mt-2 relative overflow-hidden">
                                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 leading-none">Próximo Sábado</p>
                                    <p className="text-2xl font-black text-foreground italic uppercase tracking-tighter leading-tight">
                                        {childProfile.nextPrivilege?.split('(')[0] || 'Responsabilidad'}
                                    </p>
                                    <p className="text-[10px] text-cyan-400/60 mt-2 font-black italic uppercase tracking-tight">
                                        {childProfile.nextPrivilege}
                                    </p>
                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/2 -translate-y-full group-hover:translate-y-[200%] transition-transform duration-[2000ms] ease-linear" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.05]">
                                        <p className="text-[7px] font-black text-slate-500 uppercase mb-1 tracking-widest">Asistencia</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-xl font-black text-emerald-400 italic">100%</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.05]">
                                        <p className="text-[7px] font-black text-slate-500 uppercase mb-1 tracking-widest">Puebla</p>
                                        <p className="text-xl font-black text-cyan-400 italic">SI</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none bg-black/40">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Material Infantil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pb-8">
                                <Button variant="primitivo" className="w-full justify-between h-14 px-6">
                                    Himnario Corito
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="primitivo" className="w-full justify-between h-14 px-6">
                                    Lectura Semanal
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Service and Choir Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Servicio de Niños Card */}
                            <Card className="glass-card border-none bg-black/40 relative overflow-hidden group">
                                {assignmentUniform && (
                                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/20 rounded-xl flex items-center gap-1.5 animate-pulse z-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                        <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter">{assignmentUniform.name}</span>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-[13px] font-black uppercase italic text-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" /> Reunión Infantil
                                    </CardTitle>
                                    <CardDescription className="text-[9px] uppercase font-black text-slate-500 tracking-widest leading-none mt-1">Sábado, 7:00 PM • Privilegios</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {responsibilities.map((resp, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-4 rounded-3xl bg-white/[0.02] border border-white/5 group/row hover:bg-white/[0.04] transition-all">
                                            <span className="text-[8px] font-black uppercase text-primary tracking-widest">{resp.part}</span>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-[15px] font-black text-foreground group-hover/row:text-primary transition-colors italic uppercase">{resp.child}</p>
                                                <span className="text-[8px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-black uppercase tracking-widest">{resp.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Corito de Niños Card */}
                            <Card className="glass-card border-l-4 border-l-secondary bg-secondary/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Music className="w-16 h-16 text-secondary" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-sm font-black uppercase italic text-secondary flex items-center gap-2">
                                        <Music className="w-4 h-4" /> Corito de Niños
                                    </CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold text-slate-500">Dirección: {choirInfo.responsable}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 block">
                                        <div className="flex items-center gap-2 text-secondary mb-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Aviso de Ensayo</p>
                                        </div>
                                        <p className="text-sm font-black text-foreground italic">"Ensayo al finalizar la oración o mientras los adultos están en su reunión."</p>
                                        <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold">* El tiempo exacto lo decide la Hna. Responsable.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase px-1">Cantos para Repasar:</p>
                                        <div className="space-y-1">
                                            {choirInfo.songs.map((song, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200 px-2 py-1.5 bg-foreground/5 rounded-lg border border-transparent hover:border-secondary/20 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                                    {song}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Achievement Wall - Medallas de Oro */}
                        <Card className="glass-card border-none bg-black/40 relative overflow-hidden group">
                             {/* Background Glow */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                             
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-[14px] font-black uppercase italic text-emerald-500 flex items-center gap-2">
                                    <Trophy className="w-5 h-5" /> Muro de Medallas de Oro
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl uppercase tracking-widest border border-emerald-500/20">Súper Fiel</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, rotate: -20 }}
                                            whileInView={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: i * 0.05, type: 'spring' }}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[0_5px_15px_rgba(245,158,11,0.1)] group/medal"
                                        >
                                            <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 group-hover/medal:scale-110 transition-transform" />
                                        </motion.div>
                                    ))}
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center border-dashed group/next">
                                        <span className="text-xs font-black text-slate-600 group-hover/next:text-slate-400 transition-colors">?</span>
                                    </div>
                                </div>
                                <p className="mt-8 text-[11px] text-slate-500 font-black uppercase tracking-widest text-center border-t border-white/5 pt-6">
                                    "¡Sigue adelante! Cada participación te acerca a una nueva medalla de oro."
                                </p>
                            </CardContent>
                        </Card>

                        {/* Attendance Security Note for Kids */}
                        <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/20" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-sm text-foreground uppercase font-black tracking-widest italic leading-none mb-1">Puntos de Fidelidad</p>
                                    <p className="text-[11px] text-slate-500 uppercase font-black tracking-tight leading-tight max-w-md">Recuerda llegar temprano para que el Responsable de Asistencia te otorgue tu medalla digital.</p>
                                </div>
                            </div>
                            <Button variant="primitivo" className="h-14 px-8 gap-3 group/btn">
                                Ver Logros <TrendingUp className="h-4 w-4 group-hover/btn:translate-y-[-2px] transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
