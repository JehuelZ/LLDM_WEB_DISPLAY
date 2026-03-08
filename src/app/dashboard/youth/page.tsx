'use client';

import { motion } from 'framer-motion';
import { Users, Star, Calendar, MessageSquare, TrendingUp, Trophy, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function YouthDashboard() {
    const { currentUser } = useAppStore();
    const router = useRouter();

    const stats = [
        { label: 'Participación', value: '—%', icon: TrendingUp, color: 'text-indigo-400' },
        { label: 'Actividades', value: '0/0', icon: Calendar, color: 'text-amber-400' },
        { label: 'Puntos', value: '0', icon: Trophy, color: 'text-yellow-400' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-all duration-500">
            <Header />

            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Star className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Juventud <span className="text-indigo-400 italic">LLDM</span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-tight mt-2">Panel del Encargado de Jóvenes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 bg-foreground/[0.02]">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color} opacity-70`}>{stat.label}</span>
                            </div>
                            <h4 className="text-3xl font-black text-white italic">{stat.value}</h4>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="glass-card border-none bg-foreground/[0.02] backdrop-blur-xl p-8 rounded-[2.5rem]">
                        <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-4 mb-6">
                            <Calendar className="w-6 h-6 text-indigo-400" />
                            Próximas Actividades
                        </h2>
                        <div className="space-y-4">
                            {([].map((act: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div>
                                        <p className="font-bold text-white text-sm">{act.title}</p>
                                        <p className="text-xs text-slate-500">{act.time}</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        DETALLES <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            )))}
                        </div>
                        {[].length === 0 && <p className="text-xs text-slate-500 italic text-center py-4">No hay próximas actividades programadas.</p>}
                    </Card>

                    <Card className="glass-card border-none bg-indigo-500/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-indigo-500/10">
                        <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-4 mb-6">
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
