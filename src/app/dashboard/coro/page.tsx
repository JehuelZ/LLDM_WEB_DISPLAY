
'use client';

import { motion } from 'framer-motion';
import { Music, Calendar, BookOpen, Users, Clock, Download, ExternalLink, Shirt, Settings, Plus, Send, Bell, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { format, addDays, startOfWeek, isThursday, isSunday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function CoroDashboard() {
    const {
        uniforms, uniformSchedule, rehearsals, announcements, currentUser,
        addUniform, removeUniform, setUniformForDate, setRehearsals,
        saveAnnouncementToCloud, sendCloudMessage, saveUniformForDateToCloud
    } = useAppStore();

    const [showLeaderPanel, setShowLeaderPanel] = useState(false);
    const isLeader = currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges.includes('leader');
    const [showUniformForm, setShowUniformForm] = useState(false);
    const [newUniform, setNewUniform] = useState({
        name: '',
        varones: { traje: '', pantalon: '', camisa: '', corbata: '' },
        hermanas: { toga: '', chalina: '', falda: '', blusa: '' }
    });

    // Get next 14 days to show upcoming uniform assignments
    const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
        const date = addDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        return {
            date: dateStr,
            dayName: format(date, 'EEEE', { locale: es }),
            isRelevant: isThursday(date) || isSunday(date),
            uniformId: uniformSchedule[dateStr]
        };
    }).filter(d => d.isRelevant);

    // Rehearsal editing state
    const [editingRehearsals, setEditingRehearsals] = useState(rehearsals);

    const toggleRehearsalDay = (dayIndex: number) => {
        const exists = editingRehearsals.some(r => r.dayOfWeek === dayIndex);
        if (exists) {
            setEditingRehearsals(editingRehearsals.filter(r => r.dayOfWeek !== dayIndex));
        } else {
            setEditingRehearsals([...editingRehearsals, {
                id: Math.random().toString(36).substr(2, 9),
                dayOfWeek: dayIndex,
                time: '07:00 PM',
                location: 'Salón de Actos'
            }]);
        }
    };

    const att = currentUser.stats?.attendance;
    const attRate = att ? Math.round((att.attended / att.total) * 100) : 0;
    const ledCount = currentUser.stats?.participation?.led || 0;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

                {/* Enhanced Hero Section for Choir Leader */}
                <section className="animate-in fade-in slide-in-from-top-8 duration-1000">
                    <div className="glass-card p-8 md:p-10 rounded-[3rem] border-secondary/10 bg-secondary/[0.02] backdrop-blur-3xl overflow-hidden relative border">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Music className="w-64 h-64 text-secondary" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-secondary to-purple-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.8rem] overflow-hidden border-2 border-secondary/20 relative bg-black shadow-2xl">
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-secondary p-1.5 rounded-lg border-2 border-[#050505]">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                </div>

                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-black uppercase tracking-widest mb-2">
                                        Dirigencia Vocal
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase italic leading-none">
                                        {currentUser.name} <span className="text-secondary italic">Choir Hub</span>
                                    </h1>
                                    <p className="text-slate-500 font-medium tracking-tight text-sm md:text-base mt-1">Gestión de ensayos, uniformes y cantos sagrados.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isLeader && (
                                    <Button
                                        onClick={() => setShowLeaderPanel(!showLeaderPanel)}
                                        className={cn(
                                            "font-black uppercase tracking-[0.2em] px-8 h-14 rounded-2xl transition-all shadow-xl",
                                            showLeaderPanel
                                                ? "bg-white text-black hover:bg-slate-200 shadow-white/10"
                                                : "bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20"
                                        )}
                                    >
                                        <Settings className="h-4 w-4 mr-2" /> {showLeaderPanel ? 'Cerrar Panel' : 'Panel Dirigente'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* LEADER MANAGEMENT PANEL (Hidden by default) */}
                {isLeader && showLeaderPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 bg-secondary/5 p-6 rounded-3xl border border-secondary/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                    >
                        {/* Manage Rehearsals */}
                        <Card className="glass-card bg-transparent border-dashed border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-secondary flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Programar Repasos
                                </CardTitle>
                                <CardDescription>Seleccione los días de ensayo semanal</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => (
                                        <button
                                            key={i}
                                            onClick={() => toggleRehearsalDay(i)}
                                            className={cn(
                                                "w-8 h-8 rounded-lg text-[10px] font-black transition-all",
                                                editingRehearsals.some(r => r.dayOfWeek === i)
                                                    ? "bg-secondary text-foreground shadow-lg shadow-secondary/20"
                                                    : "bg-foreground/5 text-slate-500 hover:bg-foreground/10"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {editingRehearsals.map(r => (
                                        <div key={r.id} className="flex items-center gap-2 bg-foreground/5 p-2 rounded-xl border border-border/20">
                                            <span className="text-[10px] font-black text-slate-400 w-16 uppercase">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][r.dayOfWeek]}</span>
                                            <input
                                                type="text"
                                                defaultValue={r.time}
                                                className="bg-transparent text-[10px] font-bold text-foreground outline-none w-16"
                                                onBlur={(e) => {
                                                    const updated = editingRehearsals.map(existing => existing.id === r.id ? { ...existing, time: e.target.value } : existing);
                                                    setEditingRehearsals(updated);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={r.location}
                                                className="bg-transparent text-[10px] font-medium text-slate-500 outline-none flex-1"
                                                onBlur={(e) => {
                                                    const updated = editingRehearsals.map(existing => existing.id === r.id ? { ...existing, location: e.target.value } : existing);
                                                    setEditingRehearsals(updated);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest h-8"
                                    onClick={() => setRehearsals(editingRehearsals)}
                                >
                                    Guardar Horarios
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Assign Uniforms (Quick View) */}
                        <Card className="glass-card bg-transparent border-dashed border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-amber-500 flex items-center gap-2">
                                    <Shirt className="w-4 h-4" /> Asignar Uniformes
                                </CardTitle>
                                <CardDescription>Para Jueves y Domingos próximos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {upcomingDays.map((day, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="text-[9px] font-black text-slate-500 uppercase w-20">{day.dayName} {format(parseISO(day.date), 'd')}</div>
                                        <select
                                            value={day.uniformId || ''}
                                            onChange={async (e) => {
                                                setUniformForDate(day.date, e.target.value);
                                                await saveUniformForDateToCloud(day.date, e.target.value);
                                            }}
                                            className="bg-foreground/5 border border-border/40 rounded-lg text-[10px] font-bold text-foreground px-2 py-1 flex-1 outline-none"
                                        >
                                            <option value="" className="bg-card">Por asignar</option>
                                            {uniforms.filter(u => u.category === 'Adulto').map(u => (
                                                <option key={u.id} value={u.id} className="bg-card">{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Catálogo de Uniformes */}
                        <Card className="glass-card bg-transparent border-dashed border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-pink-500 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Shirt className="w-4 h-4" /> Catálogo</span>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowUniformForm(!showUniformForm)}>
                                        <Plus className="w-4 h-4 text-pink-500" />
                                    </Button>
                                </CardTitle>
                                <CardDescription>Administrar uniformes del coro</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {showUniformForm ? (
                                    <div className="space-y-2 p-2 bg-foreground/5 rounded-xl border border-border/20">
                                        <Input
                                            placeholder="Nombre (ej. Gala Blanco)"
                                            className="text-[10px] h-7 bg-background"
                                            value={newUniform.name}
                                            onChange={e => setNewUniform({ ...newUniform, name: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Varones</p>
                                                <Input placeholder="Traje (Domingo)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.traje} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, traje: e.target.value } })} />
                                                <Input placeholder="Pantalón (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.pantalon} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, pantalon: e.target.value } })} />
                                                <Input placeholder="Camisa (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.camisa} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, camisa: e.target.value } })} />
                                                <Input placeholder="Corbata" className="text-[9px] h-6 bg-background" value={newUniform.varones.corbata} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, corbata: e.target.value } })} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Hermanas</p>
                                                <Input placeholder="Toga (Domingo)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.hermanas.toga} onChange={e => setNewUniform({ ...newUniform, hermanas: { ...newUniform.hermanas, toga: e.target.value } })} />
                                                <Input placeholder="Falda (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.hermanas.falda} onChange={e => setNewUniform({ ...newUniform, hermanas: { ...newUniform.hermanas, falda: e.target.value } })} />
                                                <Input placeholder="Blusa (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.hermanas.blusa} onChange={e => setNewUniform({ ...newUniform, hermanas: { ...newUniform.hermanas, blusa: e.target.value } })} />
                                                <Input placeholder="Chalina" className="text-[9px] h-6 bg-background" value={newUniform.hermanas.chalina} onChange={e => setNewUniform({ ...newUniform, hermanas: { ...newUniform.hermanas, chalina: e.target.value } })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="ghost" className="h-6 flex-1 text-[9px] uppercase font-black" onClick={() => setShowUniformForm(false)}>Cancelar</Button>
                                            <Button size="sm" className="h-6 flex-1 text-[9px] uppercase font-black bg-pink-500 hover:bg-pink-400 text-white" onClick={() => {
                                                if (newUniform.name) {
                                                    addUniform({ id: Math.random().toString(36).substr(2, 9), category: 'Adulto', ...newUniform });
                                                    setShowUniformForm(false);
                                                    setNewUniform({ name: '', varones: { traje: '', pantalon: '', camisa: '', corbata: '' }, hermanas: { toga: '', chalina: '', falda: '', blusa: '' } });
                                                }
                                            }}>Guardar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {uniforms.filter(u => u.category === 'Adulto').map(u => (
                                            <div key={u.id} className="flex items-center justify-between p-2 bg-foreground/5 rounded-lg border border-border/20 group">
                                                <div>
                                                    <p className="text-[10px] font-bold text-foreground">{u.name}</p>
                                                    <p className="text-[8px] text-slate-500 leading-tight mt-0.5">
                                                        V: {u.varones?.traje ? `Tr: ${u.varones.traje}` : `P: ${u.varones?.pantalon}, C: ${u.varones?.camisa}`}, Corb: {u.varones?.corbata}<br />
                                                        H: {u.hermanas?.toga ? `T: ${u.hermanas.toga}` : `F: ${u.hermanas?.falda}, B: ${u.hermanas?.blusa}`}, Ch: {u.hermanas?.chalina}
                                                    </p>
                                                </div>
                                                <button onClick={() => removeUniform(u.id)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Send Choir Message */}
                        <Card className="glass-card bg-transparent border-dashed border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-cyan-400 flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Comunicado al Coro
                                </CardTitle>
                                <CardDescription>Se mostrará en los avisos del panel</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Input id="choir-msg-title" placeholder="Título del aviso..." className="bg-foreground/5 border-border/40 text-[10px] font-bold h-8" />
                                <textarea
                                    id="choir-msg-body"
                                    placeholder="Instrucciones para los hermanos..."
                                    className="w-full bg-foreground/5 border border-border/40 rounded-xl text-[10px] p-3 text-foreground h-20 outline-none focus:border-cyan-400/50 transition-colors resize-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={() => {
                                            const title = document.getElementById('choir-msg-title') as HTMLInputElement;
                                            const body = document.getElementById('choir-msg-body') as HTMLTextAreaElement;
                                            if (title.value && body.value) {
                                                saveAnnouncementToCloud({
                                                    title: title.value,
                                                    content: body.value,
                                                    category: 'choir',
                                                    priority: 1
                                                });
                                                title.value = '';
                                                body.value = '';
                                                alert("Aviso público publicado en el panel.")
                                            }
                                        }}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest h-8"
                                    >
                                        Aviso <Bell className="ml-1 w-3 h-3" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const title = document.getElementById('choir-msg-title') as HTMLInputElement;
                                            const body = document.getElementById('choir-msg-body') as HTMLTextAreaElement;
                                            if (title.value && body.value) {
                                                sendCloudMessage({
                                                    senderId: currentUser.id,
                                                    targetRole: 'Coro',
                                                    subject: title.value,
                                                    content: body.value
                                                });
                                                title.value = '';
                                                body.value = '';
                                                alert("Mensaje interno enviado al coro exitosamente.");
                                            }
                                        }}
                                        className="w-full bg-secondary hover:bg-secondary/80 text-white text-[9px] font-black uppercase tracking-widest h-8"
                                    >
                                        Interno <Send className="ml-1 w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Próximo Ensayo */}
                    <Card className="glass-card border-l-4 border-l-secondary bg-secondary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-secondary">
                                <Clock className="h-5 w-5" /> Próximo Ensayo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rehearsals.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {rehearsals.slice(0, 1).map(r => (
                                        <div key={r.id}>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-3xl font-black text-foreground italic">{r.time}</p>
                                                    <p className="text-xs text-slate-500 uppercase font-bold">
                                                        Próximo {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][r.dayOfWeek]}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-[10px] font-black uppercase">Obligatorio</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-foreground/5 rounded-lg border border-border/40 mt-4">
                                                <p className="text-xs font-bold text-foreground mb-1 uppercase tracking-tighter">Ubicación: <span className="text-slate-400">{r.location}</span></p>
                                                <p className="text-[10px] text-slate-500 font-medium italic">"{r.notes || 'Favor de ser puntuales.'}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 italic">No hay ensayos programados.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Calendario de Uniformes */}
                    <Card className="glass-card border-l-4 border-l-amber-500 bg-amber-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shirt className="w-16 h-16 text-amber-500" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-500">
                                <Shirt className="h-5 w-5" /> Calendario de Uniformes
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Presentaciones Jueves y Domingo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingDays.map((day, i) => {
                                const uniform = uniforms.find(u => u.id === day.uniformId);
                                return (
                                    <div key={i} className="flex items-center justify-between p-3 bg-foreground/5 rounded-xl border border-white/5 group hover:bg-amber-500/10 transition-colors">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-500 uppercase italic">{day.dayName}, {format(parseISO(day.date), 'd MMM')}</span>
                                            <p className="text-sm font-black text-foreground tracking-tight uppercase italic">{uniform ? uniform.name : 'Por asignar'}</p>
                                            {uniform && (
                                                <div className="flex gap-3 mt-1 opacity-70">
                                                    <span className="text-[8px] font-medium leading-tight">
                                                        <strong className="text-slate-400">Varones:</strong> {uniform.varones?.traje ? `Tr: ${uniform.varones.traje}` : `P: ${uniform.varones?.pantalon}, C: ${uniform.varones?.camisa}`}, Corb: {uniform.varones?.corbata}
                                                    </span>
                                                    <span className="text-[8px] font-medium leading-tight border-l border-white/10 pl-3">
                                                        <strong className="text-slate-400">Hermanas:</strong> {uniform.hermanas?.toga ? `T: ${uniform.hermanas.toga}` : `F: ${uniform.hermanas?.falda}, B: ${uniform.hermanas?.blusa}`}, Ch: {uniform.hermanas?.chalina}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {uniform && <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/20"><Shirt className="w-4 h-4 text-amber-500" /></div>}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Estadísticas de Asistencia (Coro) */}
                    <Card className="glass-card border-l-4 border-l-emerald-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-500">
                                <Users className="h-5 w-5" /> Mi Asistencia Coro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center py-2">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-foreground/5" />
                                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - attRate / 100)} strokeLinecap="round" className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-foreground">{attRate}%</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 w-full mt-6 gap-4 text-center">
                                    <div className="p-2 bg-foreground/5 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Servicios</p>
                                        <p className="text-xl font-black text-foreground">{att?.attended || 0}/{att?.total || 0}</p>
                                    </div>
                                    <div className="p-2 bg-foreground/5 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Privilegios</p>
                                        <p className="text-xl font-black text-foreground">{ledCount}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Avisos Coro Adulto */}
                <Card className="glass-card border-none bg-foreground/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Avisos del Coro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {announcements.filter(a => a.category === 'important' || a.category === 'choir' || a.title.toLowerCase().includes('coro')).map((a, i) => (
                                <div key={i} className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex gap-4 items-start animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary"><Calendar className="h-5 w-5" /></div>
                                    <div>
                                        <h4 className="font-bold text-foreground uppercase italic tracking-tight">{a.title}</h4>
                                        <p className="text-sm text-slate-400 mt-1">{a.content}</p>
                                        <span className="text-[8px] text-slate-600 font-bold uppercase mt-2 block">{format(parseISO(a.timestamp), 'Pp', { locale: es })}</span>
                                    </div>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <p className="text-sm text-slate-500 italic">No hay avisos recientes para el coro.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
