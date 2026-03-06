
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
        theme,
        loadThemeFromCloud,
        settings
    } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        loadAllSchedulesFromCloud();
        loadThemeFromCloud();
    }, [loadAllSchedulesFromCloud, loadThemeFromCloud]);

    // Use real cloud schedule data

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
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
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

            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Print Title (Hidden in browser) */}
                <div className="print-only text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter">Lista de oraciones del mes</h1>
                    <p className="text-xl uppercase font-black italic">{monthName} {year} - LLDM RODEO</p>
                </div>

                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
                    <div className="space-y-1 md:space-y-2 w-full md:w-auto text-center md:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft className="w-3 h-3" /> Volver al Inicio
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4">
                            <CalendarIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            Calendario <span className="text-primary lg:not-italic">Especial</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight text-xs md:text-base">Servicios, oraciones y temas semanales</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <Button
                            onClick={handlePrint}
                            className="w-full sm:w-auto bg-foreground/5 border border-border/40 bg-foreground/10 text-foreground font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl gap-2 order-2 sm:order-1"
                        >
                            <Printer className="w-4 h-4 text-primary" /> Imprimir / PDF
                        </Button>

                        <div className="flex items-center justify-between sm:justify-center gap-4 bg-foreground/5 p-2 rounded-2xl border border-border/20 backdrop-blur-xl w-full sm:w-auto order-1 sm:order-2">
                            <Button variant="ghost" size="icon" className="rounded-xl bg-foreground/10 h-10 w-10" onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1))}>
                                <ChevronLeft className="w-5 h-5 text-slate-400" />
                            </Button>
                            <h2 className="text-base md:text-lg font-black uppercase italic text-foreground min-w-[120px] text-center">{monthName} {year}</h2>
                            <Button variant="ghost" size="icon" className="rounded-xl bg-foreground/10 h-10 w-10" onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1))}>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Calendar Grid */}
                    <div className="lg:col-span-3">
                        <Card className="glass-card border-none bg-foreground/5 overflow-hidden">
                            <div className="overflow-x-auto no-scrollbar scroll-smooth">
                                <div className="min-w-[700px] md:min-w-0">
                                    <div className="grid grid-cols-7 border-b border-border/20 bg-white/[0.02] calendar-grid-header">
                                        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day, i) => (
                                            <div key={day} className={cn(
                                                "py-4 text-center text-[10px] font-black uppercase tracking-[0.2em]",
                                                i === 0 ? "text-rose-500" : "text-slate-500"
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
                                                    "h-28 border-b border-r border-border/20 p-2 transition-all duration-300 group hover:bg-white/[0.02] relative",
                                                    isToday && "bg-primary/[0.03]"
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
                                                                    5AM: {event.slots['5am'].leaderId.split(' ')[0]}
                                                                </div>
                                                            )}
                                                            {event.slots['9am'].doctrineLeaderId && (
                                                                <div className="p-1 rounded bg-amber-500/10 text-amber-400 text-[7px] font-black uppercase truncate">
                                                                    9AM: {event.slots['9am'].doctrineLeaderId.split(' ')[0]}
                                                                </div>
                                                            )}
                                                            {event.slots.evening.leaderIds.length > 0 && (
                                                                <div className="p-1 rounded bg-purple-500/10 text-purple-400 text-[7px] font-black uppercase truncate">
                                                                    {event.slots.evening.time}: {event.slots.evening.leaderIds[0].split(' ')[0]}
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
                        <Card className="glass-card border-l-4 border-l-primary bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" /> Tema Principal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-foreground/5 rounded-xl border border-border/20">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Período Actual</p>
                                    <p className="text-sm font-bold text-foreground mt-1">"{theme.title}"</p>
                                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-3">{theme.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none bg-foreground/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" /> Eventos Próximos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4 items-start pb-4 border-b border-border/20">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-black leading-none">22</span>
                                        <span className="text-[8px] font-bold uppercase">Feb</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase italic">Dominical General</p>
                                        <p className="text-[10px] text-slate-500">Servicio especial de santa cena local.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-black leading-none">14</span>
                                        <span className="text-[8px] font-bold uppercase">Mar</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase italic">Aniversario Local</p>
                                        <p className="text-[10px] text-slate-500">Celebración de los 10 años de la iglesia.</p>
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
