
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Save, Calendar, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { saveAnnouncement, saveSchedule, saveWeeklyTheme } from '@/lib/supabaseServices';
import { Header } from '@/components/layout/Header';

export default function SimpleAdmin() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Estado para nuevo anuncio
    const [ann, setAnn] = useState({
        title: '',
        content: '',
        category: 'general',
        priority: 1
    });

    // Estado para horario rápido
    const [sched, setSched] = useState({
        date: new Date().toLocaleDateString('en-CA'),
        five_am_leader: '',
        nine_am_consecration: '',
        nine_am_doctrine: '',
        evening_time: '7:00 PM',
        evening_type: 'regular'
    });

    // Estado para Tema Semanal
    const [theme, setThemeState] = useState({
        title: '',
        description: '',
        type: 'orthodoxy',
        start_date: new Date().toLocaleDateString('en-CA'),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
    });

    const handleSaveAnnouncement = async () => {
        setLoading(true);
        setStatus(null);
        try {
            await saveAnnouncement(ann);
            setStatus({ type: 'success', msg: '¡Anuncio publicado en la nube!' });
            setAnn({ title: '', content: '', category: 'general', priority: 1 });
        } catch (e) {
            setStatus({ type: 'error', msg: 'Error al guardar el anuncio' });
        }
        setLoading(false);
    };

    const handleSaveSchedule = async () => {
        setLoading(true);
        setStatus(null);
        try {
            // Adaptamos al formato de la tabla de Supabase
            await saveSchedule({
                date: sched.date,
                evening_service_time: sched.evening_time,
                evening_service_type: sched.evening_type,
                topic: 'Servicio Regular'
                // Agregaremos los leaders por ID en la versión completa, 
                // por ahora guardamos texto simple si fuera el caso o topic
            });
            setStatus({ type: 'success', msg: '¡Horario actualizado!' });
        } catch (e) {
            setStatus({ type: 'error', msg: 'Error al guardar el horario' });
        }
        setLoading(false);
    };

    const handleSaveTheme = async () => {
        setLoading(true);
        setStatus(null);
        try {
            await saveWeeklyTheme(theme);
            setStatus({ type: 'success', msg: '¡Tema semanal actualizado!' });
        } catch (e) {
            setStatus({ type: 'error', msg: 'Error al guardar el tema' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Panel de Administración <span className="text-primary">Nube</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Gestión Directa en Supabase - LLDM RODEO
                    </p>
                </div>

                {status && (
                    <div className={`p-4 rounded-md flex items-center gap-3 border shadow-lg animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-bold uppercase text-xs tracking-wider">{status.msg}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Crear Anuncio */}
                    <Card className="glass-card border-none bg-white/5 overflow-hidden">
                        <CardHeader className="bg-emerald-500/10 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-emerald-500 uppercase">
                                <Bell className="w-5 h-5" /> Nuevo Anuncio
                            </CardTitle>
                            <CardDescription>Aparecerá inmediatamente en el tablero</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Título del Anuncio</label>
                                <Input
                                    value={ann.title}
                                    onChange={(e) => setAnn({ ...ann, title: e.target.value })}
                                    placeholder="Ej: Ensayo de Coro"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mensaje o Detalles</label>
                                <textarea
                                    value={ann.content}
                                    onChange={(e) => setAnn({ ...ann, content: e.target.value })}
                                    placeholder="Escribe aquí la información..."
                                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <Button
                                onClick={handleSaveAnnouncement}
                                disabled={loading || !ann.title}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-wider py-6"
                            >
                                <Save className="mr-2 w-4 h-4" /> Publicar en la Nube
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Horario Rápido */}
                    <Card className="glass-card border-none bg-white/5 overflow-hidden">
                        <CardHeader className="bg-primary/10 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-primary uppercase">
                                <Calendar className="w-5 h-5" /> Horario del Día
                            </CardTitle>
                            <CardDescription>Cambia el servicio principal de hoy</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Fecha</label>
                                <Input
                                    type="date"
                                    value={sched.date}
                                    onChange={(e) => setSched({ ...sched, date: e.target.value })}
                                    className="bg-white/5 border-white/10 [color-scheme:dark]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Hora (Tarde)</label>
                                    <select
                                        value={sched.evening_time}
                                        onChange={(e) => setSched({ ...sched, evening_time: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-md h-10 px-3 text-xs font-bold"
                                    >
                                        <option value="6:00 PM">6:00 PM</option>
                                        <option value="6:30 PM">6:30 PM</option>
                                        <option value="7:00 PM">7:00 PM</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tipo de Servicio</label>
                                    <select
                                        value={sched.evening_type}
                                        onChange={(e) => setSched({ ...sched, evening_type: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-md h-10 px-3 text-xs font-bold uppercase"
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="youth">Jóvenes</option>
                                        <option value="children">Niños</option>
                                        <option value="special">Especial</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveSchedule}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/80 text-black font-black uppercase tracking-wider py-6"
                            >
                                <Save className="mr-2 w-4 h-4" /> Actualizar Horario
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tema Semanal */}
                    <Card className="glass-card border-none bg-white/5 overflow-hidden md:col-span-2">
                        <CardHeader className="bg-secondary/10 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-secondary uppercase">
                                <BookOpen className="w-5 h-5" /> Tema de la Semana
                            </CardTitle>
                            <CardDescription>Configura el título y descripción que aparecerá en el tablero</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Título del Tema</label>
                                        <Input
                                            value={theme.title}
                                            onChange={(e) => setThemeState({ ...theme, title: e.target.value })}
                                            placeholder="Ej: La Fidelidad a Dios"
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tipo de Tema</label>
                                        <select
                                            value={theme.type}
                                            onChange={(e) => setThemeState({ ...theme, type: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-md h-10 px-3 text-xs font-bold uppercase"
                                        >
                                            <option value="apostolic_presentation">Presentación Apostólica</option>
                                            <option value="apostolic_letter">Carta Apostólica</option>
                                            <option value="orthodoxy">Sana Doctrina</option>
                                            <option value="exchange">Intercambio de Ministro</option>
                                            <option value="free">Tema Ministerial / Libre</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Desde</label>
                                            <Input
                                                type="date"
                                                value={theme.start_date}
                                                onChange={(e) => setThemeState({ ...theme, start_date: e.target.value })}
                                                className="bg-white/5 border-white/10 [color-scheme:dark]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Hasta</label>
                                            <Input
                                                type="date"
                                                value={theme.end_date}
                                                onChange={(e) => setThemeState({ ...theme, end_date: e.target.value })}
                                                className="bg-white/5 border-white/10 [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Resumen / Descripción</label>
                                        <textarea
                                            value={theme.description}
                                            onChange={(e) => setThemeState({ ...theme, description: e.target.value })}
                                            placeholder="Breve explicación del tema..."
                                            className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveTheme}
                                disabled={loading || !theme.title}
                                className="w-full bg-secondary hover:bg-secondary/80 text-black font-black uppercase tracking-wider py-6"
                            >
                                <Save className="mr-2 w-4 h-4" /> Actualizar Tema Semanal
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="p-6 rounded-md bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                        Esta es una interfaz de administración segura conectada a <span className="text-white">Supabase Cloud</span>
                    </p>
                </div>
            </main>
        </div>
    );
}
