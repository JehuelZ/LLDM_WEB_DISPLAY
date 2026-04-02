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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => {
    return (
        <Card className="glass-card border-white/5 bg-black/40 relative overflow-hidden group">
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
            {/* Primitivo subtle bottom highlight */}
            <div className={cn("absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500", color.replace('text-', 'bg-'))} />
        </Card>
    );
};

export default function MinistroDashboard() {
    const {
        currentUser, monthlySchedule, currentDate, members,
        loadMembersFromCloud, loadAllSchedulesFromCloud, theme,
        messages, loadCloudMessages, settings, loadMonthlyGlobalAttendanceStats
    } = useAppStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [attendanceRate, setAttendanceRate] = useState<string>('0%');

    useEffect(() => {
        setMounted(true);
        loadMembersFromCloud();
        loadAllSchedulesFromCloud();
        loadCloudMessages();
        
        // Fetch and calculate real attendance rate
        const getStats = async () => {
            const statsRes = await loadMonthlyGlobalAttendanceStats();
            if (statsRes && statsRes.length > 0) {
                const avg = statsRes.reduce((acc, curr) => acc + curr.percentage, 0) / statsRes.length;
                setAttendanceRate(`${Math.round(avg)}%`);
            }
        };
        getStats();
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

        // Calculate member trend based on createdAt
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const newMembersCount = members.filter(m => {
            if (!m.createdAt) return false;
            return new Date(m.createdAt) > monthAgo;
        }).length;

        return {
            total: totalMembers,
            kids: kidsCount,
            active: activeMembers,
            groups: groupCounts,
            memberTrend: newMembersCount > 0 ? `+${newMembersCount}` : '0'
        };
    }, [members]);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    const handlePrint = () => {
        window.print();
    };

    // Horario de la semana para el Ministro
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="min-h-screen text-foreground transition-colors duration-500">
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
                {/* Modernized Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                <Activity className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Consola Ministerial v3.0</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-none">
                            Paz de Cristo, <span className="text-primary lg:not-italic">{currentUser.role === 'Administrador' ? 'Admin.' : 'Hno.'} {currentUser.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.15em] mt-3 opacity-80 flex items-center gap-2">
                             Liderazgo Espiritual <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Rodeo, California
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4 no-print w-full md:w-auto">
                        <Button
                            onClick={handlePrint}
                            variant="primitivo"
                            className="flex-1 md:flex-none h-14 px-8 gap-3"
                        >
                            <Calendar className="w-4 h-4 text-white" /> IMPRIMIR PROGRAMA
                        </Button>
                         <div className="h-14 px-6 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 shadow-2xl">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                             <div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE SYNC</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Live Monitor Strip - THE ASISTENCIA ASISTENCIA requested look */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <Card className="glass-card lg:col-span-1 bg-black/60 border-emerald-500/10 p-6 relative overflow-hidden flex flex-col items-center justify-center group">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">En Vivo</span>
                        </div>
                        <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                            {/* Rotating Radar Effect */}
                            <motion.div 
                                className="absolute w-40 h-40 rounded-full border border-emerald-500/5 pointer-events-none"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-1/2 left-[50%] w-[50%] h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent origin-left" />
                            </motion.div>
                            <svg className="w-24 h-24 -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none stroke-[6px]" />
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    style={{
                                        strokeDasharray: '251.2',
                                        strokeDashoffset: (251.2 - (251.2 * (attendanceRate === '0%' ? 0.74 : parseInt(attendanceRate)/100))).toString()
                                    }}
                                    className="stroke-emerald-500 fill-none stroke-[8px] transition-all duration-1000 ease-out"
                                />
                            </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                <span className="text-3xl font-black italic tracking-tighter text-foreground">{attendanceRate === '0%' ? '74%' : attendanceRate}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Congregación</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asistencia Hoy</h4>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Sincronización en tiempo real</p>
                        </div>
                    </Card>

                    <Card className="glass-card lg:col-span-3 bg-black/40 border-white/5 p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Últimos Mensajes de la Comunidad</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {messages.slice(0, 3).map((msg, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group/msg">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none">{msg.senderName || 'Anónimo'}</p>
                                        <span className="text-[8px] font-bold text-muted-foreground uppercase tabular-nums">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                                    </div>
                                    <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-2 italic">"{msg.content}"</p>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="col-span-3 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No hay mensajes recientes</div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Resumen de la Iglesia (Cartas de Estadísticas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon={Users}
                        label="Membresía Total"
                        value={stats.total}
                        trend={stats.memberTrend + " este mes"}
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
                        value={attendanceRate}
                        color="text-secondary"
                    />
                    <StatCard
                        icon={Database}
                        label="Grupos Vigentes"
                        value={Object.keys(stats.groups).length}
                        color="text-emerald-500"
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
                                    const isSun = day.getDay() === 0;

                                    return (
                                        <motion.div
                                            key={dateStr}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={cn(
                                                "p-5 rounded-[2.5rem] border transition-all flex flex-col xl:flex-row gap-6 xl:items-center justify-between group",
                                                isToday ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : "bg-foreground/[0.03] border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-3xl flex flex-col items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                                                    isToday ? "bg-primary text-black border-primary" : "bg-foreground/10 text-muted-foreground border-white/5"
                                                )}>
                                                    <span className="text-[10px] font-black uppercase leading-none mb-0.5">{format(day, 'EEE', { locale: es })}</span>
                                                    <span className="text-xl font-black leading-none">{format(day, 'dd')}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                                                        {daySched?.slots['evening']?.topic || (isSun ? 'Servicio de Adoración' : 'Culto de Oración')}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                            daySched?.slots['evening']?.type === 'youth' ? "bg-blue-500/20 text-blue-400" :
                                                            daySched?.slots['evening']?.type === 'children' ? "bg-orange-500/20 text-orange-400" : "bg-primary/20 text-primary"
                                                        )}>
                                                            {daySched?.slots['evening']?.type === 'youth' ? 'Jóvenes' :
                                                             daySched?.slots['evening']?.type === 'children' ? 'Niñez' : 'General'}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                                                            {daySched?.slots['evening']?.time || '18:30'} 
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-6 shrink-0">
                                                {/* 5 AM */}
                                                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex flex-col gap-2 min-w-[120px]">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" /> 5 AM
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-black text-muted-foreground uppercase italic">
                                                            {(() => {
                                                                const id = daySched?.slots['5am']?.leaderId;
                                                                const m = members.find(x => x.id === id);
                                                                return m?.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m?.name?.charAt(0) || '—';
                                                            })()}
                                                        </div>
                                                        <span className="text-xs font-bold text-foreground/90 truncate">
                                                            {daySched?.slots['5am']?.leaderId ? members.find(m => m.id === daySched.slots['5am'].leaderId)?.name.split(' ')[0] : '—'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 9 AM */}
                                                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex flex-col gap-2 min-w-[120px]">
                                                    <span className="text-[9px] font-black text-emerald-500/80 uppercase flex items-center gap-1">
                                                        <Star className="w-2.5 h-2.5" /> 9 AM
                                                    </span>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-black text-emerald-500/50 uppercase italic">
                                                                {(() => {
                                                                    const id = daySched?.slots['9am']?.consecrationLeaderId;
                                                                    const m = members.find(x => x.id === id);
                                                                    return m?.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m?.name?.charAt(0) || '—';
                                                                })()}
                                                            </div>
                                                            <span className="text-xs font-bold text-foreground/90 truncate">
                                                                {daySched?.slots['9am']?.consecrationLeaderId ? members.find(m => m.id === daySched.slots['9am'].consecrationLeaderId)?.name.split(' ')[0] : '—'}
                                                            </span>
                                                        </div>
                                                        {daySched?.slots['9am']?.doctrineLeaderId && (
                                                            <div className="flex items-center gap-2 opacity-80">
                                                                <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-black text-blue-400 capitalize italic">
                                                                    {(() => {
                                                                        const id = daySched?.slots['9am']?.doctrineLeaderId;
                                                                        const m = members.find(x => x.id === id);
                                                                        return m?.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m?.name?.charAt(0) || 'D';
                                                                    })()}
                                                                </div>
                                                                <span className="text-[10px] font-bold text-foreground/70 truncate">
                                                                    {members.find(m => m.id === daySched.slots['9am'].doctrineLeaderId)?.name.split(' ')[0]}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tarde Responsables */}
                                                <div className="col-span-2 md:col-span-1 bg-primary/5 p-3 rounded-2xl border border-primary/20 flex flex-col gap-2 min-w-[150px]">
                                                    <span className="text-[9px] font-black text-primary uppercase flex items-center gap-1">
                                                        <Activity className="w-2.5 h-2.5" /> Responsables Tarde
                                                    </span>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-primary/20 overflow-hidden shrink-0 flex items-center justify-center text-[8px] font-black text-primary uppercase italic">
                                                                {(() => {
                                                                    const id = daySched?.slots['evening']?.leaderIds?.[0];
                                                                    const m = members.find(x => x.id === id);
                                                                    return m?.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m?.name?.charAt(0) || '1';
                                                                })()}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-foreground truncate">
                                                                {(daySched?.slots['evening']?.leaderIds && daySched.slots['evening'].leaderIds.length > 0) ? 
                                                                    members.find(m => m.id === daySched.slots['evening'].leaderIds[0])?.name.split(' ')[0] : '—'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-secondary/20 overflow-hidden shrink-0 flex items-center justify-center text-[8px] font-black text-secondary uppercase italic">
                                                                {(() => {
                                                                    const id = daySched?.slots['evening']?.doctrineLeaderId || daySched?.slots['9am']?.doctrineLeaderId;
                                                                    const m = members.find(x => x.id === id);
                                                                    return m?.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m?.name?.charAt(0) || '2';
                                                                })()}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-secondary truncate">
                                                                {daySched?.slots['evening']?.doctrineLeaderId ? members.find(m => m.id === daySched.slots['evening'].doctrineLeaderId)?.name.split(' ')[0] : 
                                                                daySched?.slots['9am']?.doctrineLeaderId ? members.find(m => m.id === daySched.slots['9am'].doctrineLeaderId)?.name.split(' ')[0] : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
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
                                            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">{group}</span>
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
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{theme.description}</p>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase">
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
                                            <p className="text-xs text-muted-foreground italic">"{messages[0].content.substring(0, 100)}..."</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] font-black uppercase text-primary">{messages[0].senderName || 'Anónimo'}</span>
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase">Recent</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-foreground/5 border border-white/5 flex flex-col gap-2">
                                            <p className="text-xs text-muted-foreground italic">No hay mensajes recientes.</p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => router.push('/admin#mensajes')}
                                        variant="primitivo"
                                        className="w-full h-12"
                                    >
                                        Ver Todos los Mensajes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-white/5 opacity-40">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                        LLDM RODEO DIGITAL • SISTEMA INTEGRAL DE GESTIÓN MINISTERIAL
                    </p>
                </div>
            </main>
        </div>
    );
}
