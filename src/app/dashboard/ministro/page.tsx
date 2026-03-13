'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Calendar, Users, TrendingUp, BookOpen, Clock,
    Bell, Mail, ChevronRight, Activity, Star, Award,
    MessageSquare, CheckCircle2, LayoutDashboard, Database
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <Card className="glass-card border-none bg-foreground/5 relative overflow-hidden group">
        <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity", color)}>
            <Icon className="w-20 h-20" />
        </div>
        <CardContent className="p-6">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
                <div className="flex items-end gap-3 mt-1">
                    <span className="text-3xl font-black italic tracking-tighter text-foreground">{value}</span>
                    {trend && (
                        <span className="text-[10px] font-bold text-emerald-500 mb-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <TrendingUp className="w-3 h-3" /> {trend}
                        </span>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function MinistroDashboard() {
    const {
        currentUser, monthlySchedule, currentDate, members,
        loadMembersFromCloud, loadAllSchedulesFromCloud, theme,
        messages, loadCloudMessages, settings
    } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        loadMembersFromCloud();
        loadAllSchedulesFromCloud();
        loadCloudMessages();
    }, []);

    // Cálculo de estadísticas de la iglesia
    const stats = useMemo(() => {
        const totalMembers = members.length;
        const kidsCount = members.filter(m => m.category === 'Niño').length;
        const activeMembers = members.filter(m => m.status === 'Activo').length;

        // Distribución por grupos
        const groupCounts: Record<string, number> = {};
        members.forEach(m => {
            if (m.member_group) {
                groupCounts[m.member_group] = (groupCounts[m.member_group] || 0) + 1;
            }
        });

        return {
            total: totalMembers,
            kids: kidsCount,
            active: activeMembers,
            groups: groupCounts,
            attendanceRate: "88%"
        };
    }, [members]);

    const handlePrint = () => {
        window.print();
    };

    // Horario de la semana para el Ministro
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    .glass-card { border: 1px solid #eee !important; background: white !important; shadow: none !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="no-print">
                <Header />
            </div>

            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8">
                {/* Saludo y Título Profesional */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <Settings className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Consola de Supervisión Ministerial</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">
                            Paz de Cristo, <span className="text-primary not-italic">{currentUser.role === 'Administrador' ? 'Administrador' : 'Hno.'} {currentUser.name.split(' ')[0] || 'Ministro'}</span>
                        </h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
                            Liderazgo Espiritual - Rodeo, CA
                        </p>
                    </motion.div>

                    <div className="flex gap-3 no-print">
                        <button
                            onClick={handlePrint}
                            className="p-3 bg-foreground/5 rounded-2xl border border-border/10 flex items-center gap-2 hover:bg-foreground/10 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Imprimir Programa</span>
                        </button>
                        <div className="p-3 bg-foreground/5 rounded-2xl border border-border/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase">Estado Global</p>
                                <p className="text-xs font-bold text-emerald-500 uppercase">Sincronizado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resumen de la Iglesia (Doughnuts/Cartas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon={Users}
                        label="Membresía Total"
                        value={stats.total}
                        trend="+5 este mes"
                        color="text-blue-500"
                    />
                    <StatCard
                        icon={Star}
                        label="Total Niños"
                        value={stats.kids}
                        color="text-orange-500"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Fieles Activos"
                        value={stats.active}
                        color="text-emerald-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Asistencia Promedio"
                        value={stats.attendanceRate}
                        color="text-secondary"
                    />
                    <StatCard
                        icon={Database}
                        label="Grupos Vigentes"
                        value={Object.keys(stats.groups).length}
                        color="text-amber-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Programación de la Semana */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card border-none bg-foreground/2">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" /> Agenda de la Semana
                                        </CardTitle>
                                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Supervisión de Privilegios</CardDescription>
                                    </div>
                                    <div className="text-[10px] font-black uppercase bg-primary/20 text-primary px-3 py-1 rounded-full">
                                        {format(weekStart, 'dd MMM')} - {format(weekEnd, 'dd MMM')}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {weekDays.map((day, i) => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const daySched = monthlySchedule[dateStr];
                                    const isToday = isSameDay(day, today);

                                    return (
                                        <motion.div
                                            key={dateStr}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={cn(
                                                "p-4 rounded-3xl border transition-all flex flex-col md:flex-row gap-4 items-center justify-between group",
                                                isToday ? "bg-primary/5 border-primary/20 shadow-lg" : "bg-foreground/5 border-transparent hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 border",
                                                    isToday ? "bg-primary text-black border-primary" : "bg-foreground/10 text-slate-400 border-white/5"
                                                )}>
                                                    <span className="text-[10px] font-black uppercase leading-none">{format(day, 'EEE', { locale: es })}</span>
                                                    <span className="text-lg font-black leading-none">{format(day, 'dd')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                                                        {daySched?.slots['evening']?.type === 'youth' ? 'Servicio de Jóvenes' :
                                                            daySched?.slots['evening']?.type === 'children' ? 'Servicio de la Niñez' : 'Culto de Adoración'}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        {daySched?.slots['evening']?.time || '18:30'} • {daySched?.slots['evening']?.topic || 'Privilegios Generales'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-8 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                                                {/* 5 AM */}
                                                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase text-center w-full">5 AM</span>
                                                    <span className="text-xs font-bold text-foreground/80 truncate max-w-[80px]">
                                                        {daySched?.slots['5am']?.leaderId ? members.find(m => m.id === daySched.slots['5am'].leaderId)?.name.split(' ')[0] : '—'}
                                                    </span>
                                                </div>
                                                {/* Evening */}
                                                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase text-center w-full">Encargado</span>
                                                    <span className="text-xs font-bold text-primary truncate max-w-[100px]">
                                                        {daySched?.slots['evening']?.leaderIds?.[0] ? members.find(m => m.id === daySched.slots['evening'].leaderIds[0])?.name.split(' ')[0] : '—'}
                                                    </span>
                                                </div>
                                                {/* Doctrina */}
                                                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase text-center w-full">Doctrina</span>
                                                    <span className="text-xs font-bold text-secondary truncate max-w-[100px]">
                                                        {daySched?.slots['evening']?.doctrineLeaderId ? members.find(m => m.id === daySched.slots['evening'].doctrineLeaderId)?.name.split(' ')[0] : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Censo por Grupos */}
                        <Card className="glass-card border-none bg-foreground/2 no-print">
                            <CardHeader>
                                <CardTitle className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
                                    <Users className="w-5 h-5 text-emerald-500" /> Censo por Grupos
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Distribución de la Membresía</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(stats.groups).map(([group, count]) => (
                                    <div key={group} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">{group}</span>
                                            <span className="text-sm font-black text-foreground">{count}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / stats.total) * 100}%` }}
                                                className="h-full bg-emerald-500/50"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna Derecha: Sana Doctrina y Mensajes */}
                    <div className="space-y-6">
                        {/* Tema Vigente */}
                        <Card className="glass-card border-none bg-secondary/5 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all" />
                            <CardHeader>
                                <CardTitle className="text-lg font-black uppercase text-secondary italic flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Sana Doctrina
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Tema Semanal Vigente</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <h3 className="text-xl font-black text-foreground leading-tight italic">"{theme.title}"</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{theme.description}</p>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                                        <Clock className="w-4 h-4 text-secondary" />
                                        Enfoque: {theme.type.replace('_', ' ')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mensajes para el Ministro */}
                        <Card className="glass-card border-none bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-black uppercase text-primary italic flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" /> Comunicación
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Peticiones y Notas Directas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messages.length > 0 ? (
                                        <div className="p-4 rounded-2xl bg-foreground/5 border border-white/5 flex flex-col gap-2">
                                            <p className="text-xs text-slate-300 italic">"{messages[0].content.substring(0, 100)}..."</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] font-black uppercase text-primary">{messages[0].senderName || 'Anónimo'}</span>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase">Recent</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-foreground/5 border border-white/5 flex flex-col gap-2">
                                            <p className="text-xs text-slate-500 italic">No hay mensajes recientes.</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => router.push('/admin#mensajes')}
                                        className="w-full py-3 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                    >
                                        Ver Todos los Mensajes
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-white/5 opacity-40">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">
                        LLDM RODEO DIGITAL • SISTEMA INTEGRAL DE GESTIÓN MINISTERIAL
                    </p>
                </div>
            </main>
        </div>
    );
}
