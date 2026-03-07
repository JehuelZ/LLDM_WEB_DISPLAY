'use client';

import { motion } from 'framer-motion';
import { Baby, Clock, Calendar, ShieldCheck, Star, Users, ArrowLeft, CheckCircle2, AlertCircle, Music, Trophy, Target, Download, ExternalLink, TrendingUp, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { useAppStore } from '@/lib/store';

export default function NiñosDashboard() {
    const { currentUser, kidsAssignments, uniforms } = useAppStore();
    const childProfile = currentUser.category === 'Niño' ? { ...currentUser, parentName: currentUser.parentName || 'Padre/Madre' } : {
        name: 'Samuelito Rojas Jr.',
        member_group: 'Niños',
        avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&h=200&fit=crop',
        medals: 12,
        nextPrivilege: 'Dirigente (Último Sábado)',
        parentName: 'Samuel Rojas'
    };

    // Find the next available assignment in the store
    const nextAssignmentDate = Object.keys(kidsAssignments).sort().find(d => new Date(d) >= new Date()) || '2026-02-28';
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
        responsable: 'Hna. Rebeca Jimenez',
        nextRehearsal: 'Mañana, 4:00 PM',
        songs: ['Soy un niño de luz', 'Cantad alegres', 'Gratitud infantil'],
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                <img src={childProfile.avatar} alt={childProfile.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-xl shadow-lg">
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
                                <span className="text-xs text-yellow-500/80 font-black uppercase flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-yellow-500" /> {childProfile.medals} Medallas de Fidelidad
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest px-8 rounded-2xl flex-1 md:flex-none">
                            Misión de Hoy
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* My Task and Stats */}
                    <div className="space-y-6">
                        <Card className="glass-card border-l-4 border-l-cyan-500 bg-cyan-500/5 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-cyan-400 tracking-[0.2em] flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Mi Próximo Privilegio
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-2xl bg-foreground/5 border border-border/40 mt-2">
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Próximo Sábado</p>
                                    <p className="text-2xl font-black text-foreground italic uppercase tracking-tighter">
                                        {childProfile.nextPrivilege?.split('(')[0] || 'Responsabilidad'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2 font-medium italic">
                                        "{childProfile.nextPrivilege}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-3 bg-foreground/5 rounded-xl border border-border/20 text-center">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Asistencia</p>
                                        <p className="text-xl font-black text-emerald-400 italic">100%</p>
                                    </div>
                                    <div className="p-3 bg-foreground/5 rounded-xl border border-border/20 text-center">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Puebla</p>
                                        <p className="text-xl font-black text-cyan-400 italic">SI</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none bg-foreground/5">
                            <CardHeader>
                                <CardTitle className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Material Infantil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-between h-14 border-border/40 hover:bg-foreground/5 text-xs font-bold uppercase tracking-widest rounded-2xl">
                                    Himnario Corito
                                    <Download className="w-4 h-4 text-cyan-400" />
                                </Button>
                                <Button variant="outline" className="w-full justify-between h-14 border-border/40 hover:bg-foreground/5 text-xs font-bold uppercase tracking-widest rounded-2xl">
                                    Lectura Semanal
                                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Service and Choir Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Servicio de Niños Card */}
                            <Card className="glass-card border-none bg-foreground/5 relative overflow-hidden">
                                {assignmentUniform && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-500/20 border border-cyan-500/20 rounded-lg flex items-center gap-1.5 animate-pulse">
                                        <Shirt className="w-3 h-3 text-cyan-400" />
                                        <span className="text-[8px] font-black text-cyan-400 uppercase">{assignmentUniform.name}</span>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-sm font-black uppercase italic text-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" /> Reunión Infantil
                                    </CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Sábado, 7:00 PM - Panel de Privilegios</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {responsibilities.map((resp, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-foreground/5 border border-border/20">
                                            <span className="text-[9px] font-black uppercase text-primary/70">{resp.part}</span>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-black text-foreground">{resp.child}</p>
                                                <span className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-black uppercase">{resp.role}</span>
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
                        <Card className="glass-card border-none bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase italic text-amber-500 flex items-center gap-2">
                                    <Trophy className="w-5 h-5" /> Muro de Medallas de Oro
                                </CardTitle>
                                <span className="text-[10px] font-black text-amber-500/50 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Súper Fiel</span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                        >
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        </motion.div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-foreground/5 border border-border/40 flex items-center justify-center border-dashed">
                                        <span className="text-xs font-black text-slate-600">?</span>
                                    </div>
                                </div>
                                <p className="mt-6 text-[11px] text-slate-400 font-medium italic text-center border-t border-border/20 pt-4">
                                    "¡Increíble Samuelito! Te falta solo <span className="text-amber-500 font-bold">1 medalla</span> para completar tu primer set de 13 medallas de oro."
                                </p>
                            </CardContent>
                        </Card>

                        {/* Attendance Security Note for Kids */}
                        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between gap-4 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground uppercase font-black tracking-widest italic">Puntos de Fidelidad</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Recuerda llegar temprano para que el Responsable de Asistencia te ponga una medalla.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-[10px] font-black uppercase text-emerald-500 gap-2 hover:bg-emerald-500/10">
                                Ver Logros <TrendingUp className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
