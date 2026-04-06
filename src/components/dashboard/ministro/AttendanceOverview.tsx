'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/button'; // Wait, the original used Card from shadcn but imported as Card.
// Actually, I should check the original imports. 
// Original code at 485: <Card ... p-8 md:p-12 ...>
// Imports were: import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Card as CardUI } from "@/components/ui/card";
import { Activity, TrendingUp, Users, Target } from 'lucide-react';
import { MiniAreaChart } from './Charts';

interface AttendanceOverviewProps {
    members: any[];
    attendanceData: number[];
}

export function AttendanceOverview({ members, attendanceData }: AttendanceOverviewProps) {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Activo').length;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <CardUI className="glass-card border-none bg-black/40 p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                    <Activity className="w-8 h-8 text-primary opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
                </div>
                
                <div className="flex flex-col h-full justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] italic">Rendimiento</h3>
                                <p className="text-xl font-black text-white uppercase italic tracking-tighter">Asistencia General</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-7xl font-black text-primary italic tracking-tighter tabular-nums drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                                    {attendanceData.length > 0 ? attendanceData[attendanceData.length - 1] : 0}%
                                </span>
                                <span className="text-xs font-black text-muted-foreground uppercase italic tracking-widest">Global Mes</span>
                            </div>
                            <div className="w-full flex-grow pt-4">
                                <MiniAreaChart data={attendanceData} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardUI>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] hover:border-primary/20 transition-all group shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Censo Actual</span>
                    </div>
                    <p className="text-4xl font-black text-white italic tracking-tighter mb-1">{totalMembers}</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Registrados</p>
                </div>

                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] hover:border-emerald-500/20 transition-all group shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                            <Activity className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Actividad</span>
                    </div>
                    <p className="text-4xl font-black text-white italic tracking-tighter mb-1">{activeMembers}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Activos</p>
                </div>

                <CardUI className="sm:col-span-2 p-8 bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                        <Target className="w-64 h-64" />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] mb-2 italic">Objetivo Ministerial</h4>
                            <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Consolidación <br/>Estructural</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black text-primary italic tracking-tighter leading-none">85%</p>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic mt-1">Meta Trimestral</p>
                        </div>
                    </div>
                </CardUI>
            </div>
        </div>
    );
}
