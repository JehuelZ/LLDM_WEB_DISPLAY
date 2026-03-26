
'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, User, BookOpen, Star, FileDown, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
    const {
        monthlySchedule,
        loadAllSchedulesFromCloud,
        members,
        loadMembersFromCloud,
        theme,
        loadThemeFromCloud,
        settings
    } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        loadAllSchedulesFromCloud();
        loadMembersFromCloud();
        loadThemeFromCloud();
    }, [loadAllSchedulesFromCloud, loadMembersFromCloud, loadThemeFromCloud]);

    const getMemberName = (id: string) => {
        if (!id) return '';
        const member = members.find(m => m.id === id);
        if (member) return member.name;
        // Fallback for names already stored as strings or legacy format
        return id.includes('-') ? 'Asignado' : id;
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        width: 100% !important;
                        height: auto !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    main.container {
                        max-width: none !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .lg\:col-span-3 {
                        grid-column: span 4 / span 4 !important;
                        width: 100% !important;
                    }
                    .glass-card {
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: black !important;
                        width: 100% !important;
                        overflow: visible !important;
                    }
                    .calendar-grid-header {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        border: 1.5px solid black !important;
                        border-bottom: none !important;
                        background: #f0f0f0 !important;
                    }
                    .calendar-grid-days {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        border-left: 1.5px solid black !important;
                        border-top: 1.5px solid black !important;
                        page-break-inside: avoid !important;
                    }
                    .calendar-grid-days > div {
                        border-right: 1.5px solid black !important;
                        border-bottom: 1.5px solid black !important;
                        height: 110px !important;
                        min-height: 110px !important;
                        background: white !important;
                        page-break-inside: avoid !important;
                        position: static !important;
                    }
                    .text-white, .text-slate-200, .text-slate-400, .text-slate-500, .text-slate-600 {
                        color: black !important;
                    }
                    .font-black {
                        font-weight: 900 !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            <div className="no-print">
                <Header />
            </div>

            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Print Title (Hidden in browser) */}
                <div className="print-only text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter">Lista de oraciones del mes</h1>
                    <p className="text-xl uppercase font-black italic">{monthName} {year} - LLDM RODEO</p>
                </div>

                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 no-print">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                             <CalendarIcon className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                Special Event Calendar
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Calendario <span className="text-primary lg:not-italic">ESPECIAL</span>
                            </h1>
                            <p className="text-muted-foreground font-bold tracking-tight text-sm mt-2 opacity-80">Servicios, oraciones y temas semanales integrados.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <Button
                            onClick={handlePrint}
                            variant="primitivo"
                            className="w-full sm:w-auto h-14 px-8 gap-3 order-2 sm:order-1"
                        >
                            <Printer className="w-4 h-4 text-primary-foreground" /> IMPRIMIR / PDF
                        </Button>

                        <div className="flex items-center justify-between sm:justify-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-3xl w-full sm:w-auto order-1 sm:order-2 shadow-2xl">
                            <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 h-10 w-10 hover:bg-white/10" onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1))}>
                                <ChevronLeft className="w-5 h-5 text-slate-400" />
                            </Button>
                            <h2 className="text-base md:text-lg font-black uppercase italic text-foreground min-w-[140px] text-center tracking-tight">{monthName} {year}</h2>
                            <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 h-10 w-10 hover:bg-white/10" onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1))}>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Calendar Grid */}
                    <div className="lg:col-span-3">
                        <Card className="glass-card border-none bg-black/40 overflow-hidden rounded-[2.5rem] shadow-2xl relative">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                            <div className="overflow-x-auto no-scrollbar scroll-smooth">
                                <div className="min-w-[750px] md:min-w-0">
                                    <div className="grid grid-cols-7 border-b border-border/20 bg-white/[0.02] calendar-grid-header">
                                        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day, i) => (
                                            <div key={day} className={cn(
                                                "py-4 text-center text-[10px] font-black uppercase tracking-[0.2em]",
                                                i === 0 ? "text-rose-500" : "text-muted-foreground"
                                            )}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 calendar-grid-days">
                                        {blanks.map(i => (
                                            <div key={`blank-${i}`} className="h-28 border-b border-r border-border/20 bg-black/10" />
                                        ))}
                                        {days.map(day => {
                                            const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const event = monthlySchedule[dateStr];
                                            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                                            return (
                                                <div key={day} className={cn(
                                                    "h-32 border-b border-r border-white/5 p-3 transition-all duration-500 group hover:bg-white/[0.04] relative",
                                                    isToday && "bg-primary/[0.05]"
                                                )}>
                                                    <div className="flex justify-between items-start">
                                                        <span className={cn(
                                                            "text-sm font-black italic",
                                                            isToday ? "text-primary scale-125" : "text-slate-600 group-hover:text-slate-400"
                                                        )}>{day}</span>
                                                        {isToday && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse no-print" />}
                                                    </div>

                                                    {event && (
                                                        <div className="mt-2 space-y-1">
                                                            {event.slots['5am'].leaderId && (
                                                                <div className="p-1 rounded bg-blue-500/10 text-blue-400 text-[7px] font-black uppercase truncate">
                                                                    5AM: {getMemberName(event.slots['5am'].leaderId).split(' ')[0]}
                                                                </div>
                                                            )}
                                                            {event.slots['9am'].doctrineLeaderId && (
                                                                <div className="p-1 rounded bg-amber-500/10 text-amber-400 text-[7px] font-black uppercase truncate">
                                                                    9AM: {getMemberName(event.slots['9am'].doctrineLeaderId).split(' ')[0]}
                                                                </div>
                                                            )}
                                                            {event.slots.evening.leaderIds.length > 0 && (
                                                                <div className="p-1 rounded bg-purple-500/10 text-purple-400 text-[7px] font-black uppercase truncate">
                                                                    {event.slots.evening.time}: {getMemberName(event.slots.evening.leaderIds[0]).split(' ')[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Side Info / Legend */}
                    <div className="space-y-6 no-print">
                        <Card className="glass-card border-none bg-black/40 rounded-[2rem] relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground">
                                    <BookOpen className="w-4 h-4 text-primary" /> Tema Principal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-8">
                                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-3">Ciclo de Enseñanza</p>
                                    <p className="text-lg font-black text-foreground leading-tight italic tracking-tighter">"{theme.title}"</p>
                                    {theme.description && (
                                        <p className="text-[11px] text-muted-foreground font-bold mt-4 leading-relaxed line-clamp-4 opacity-80">{theme.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none bg-black/40 rounded-[2rem] relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground">
                                    <Star className="w-4 h-4 text-amber-500 animate-pulse" /> Eventos Próximos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-8">
                                <div className="flex gap-5 items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group/ev cursor-pointer">
                                    <div className="w-12 h-12 rounded-[1.2rem] bg-amber-500/10 border border-amber-500/20 text-amber-500 flex flex-col items-center justify-center shrink-0 group-hover/ev:scale-110 transition-transform shadow-xl">
                                        <span className="text-sm font-black leading-none">22</span>
                                        <span className="text-[9px] font-black uppercase">Feb</span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-foreground uppercase italic tracking-tighter leading-none mb-1">Dominical General</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Servicio Especial</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group/ev cursor-pointer">
                                    <div className="w-12 h-12 rounded-[1.2rem] bg-rose-500/10 border border-rose-500/20 text-rose-500 flex flex-col items-center justify-center shrink-0 group-hover/ev:scale-110 transition-transform shadow-xl">
                                        <span className="text-sm font-black leading-none">14</span>
                                        <span className="text-[9px] font-black uppercase">Mar</span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-foreground uppercase italic tracking-tighter leading-none mb-1">Aniversario Local</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Celebración</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </main>
        </div>
    );
}
