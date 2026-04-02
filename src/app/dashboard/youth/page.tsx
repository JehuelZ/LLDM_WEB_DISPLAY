'use client';

import { motion } from 'framer-motion';
import { Users, Star, Calendar, MessageSquare, TrendingUp, Trophy, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

export default function YouthDashboard() {
    const { currentUser } = useAppStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    const stats = [
        { label: 'Participación', value: '—%', icon: TrendingUp, color: 'text-indigo-400' },
        { label: 'Actividades', value: '0/0', icon: Calendar, color: 'text-emerald-400' },
        { label: 'Puntos', value: '0', icon: Trophy, color: 'text-emerald-400' },
    ];

    return (
        <div className="min-h-screen text-foreground transition-all duration-500">
            <Header />

            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-[2.2rem] bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-[1.8rem] bg-black/40 flex items-center justify-center overflow-hidden">
                                     <Star className="w-10 h-10 text-indigo-400 animate-pulse fill-indigo-400/20" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-500 p-2 rounded-xl border-4 border-[#020617] shadow-lg">
                                 <Trophy className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                Active Youth Hub
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Juventud <span className="text-indigo-400 italic">RODEO</span>
                            </h1>
                            <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg mt-2 opacity-80">Coordination & spiritual growth panel for the youth group.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-black/40 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className={`p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                                     <stat.icon className={`w-6 h-6 ${stat.color} shadow-[0_0_15px_rgba(99,102,241,0.3)]`} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${stat.color} opacity-60`}>{stat.label}</span>
                            </div>
                            <h4 className="text-4xl md:text-5xl font-black text-foreground italic tracking-tighter relative z-10 leading-none group-hover:translate-x-1 transition-transform">{stat.value}</h4>
                            <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full bg-gradient-to-r from-indigo-500 to-transparent`}
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="glass-card border-none bg-foreground/[0.02] backdrop-blur-xl p-8 rounded-[2.5rem]">
                        <h2 className="text-xl font-black text-foreground uppercase italic flex items-center gap-4 mb-6">
                            <Calendar className="w-6 h-6 text-indigo-400" />
                            Próximas Actividades
                        </h2>
                        <div className="space-y-4">
                            {([].map((act: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div>
                                        <p className="font-bold text-foreground text-sm">{act.title}</p>
                                        <p className="text-xs text-muted-foreground">{act.time}</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        DETALLES <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            )))}
                        </div>
                        {[].length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">No hay próximas actividades programadas.</p>}
                    </Card>

                    <Card className="glass-card border-none bg-indigo-500/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-indigo-500/10">
                        <h2 className="text-xl font-black text-foreground uppercase italic flex items-center gap-4 mb-6">
                            <MessageSquare className="w-6 h-6 text-indigo-400" />
                            Comunicados Juveniles
                        </h2>
                        <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 italic text-sm text-indigo-100 mb-6">
                            "El que tiene oídos para oír, oiga lo que el Espíritu dice a las iglesias. – Apocalipsis 2:7"
                        </div>
                        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest h-12 rounded-2xl">
                            Enviar Mensaje al Grupo
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    );
}
