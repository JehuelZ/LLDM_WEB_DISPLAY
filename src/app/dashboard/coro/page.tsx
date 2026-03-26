
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
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CoroDashboard() {
    const {
        uniforms, uniformSchedule, rehearsals, announcements, currentUser,
        addUniform, removeUniform, setUniformForDate, setRehearsals,
        saveAnnouncementToCloud, deleteAnnouncementFromCloud, sendCloudMessage, 
        saveUniformForDateToCloud, saveUniformToCloud, loadUniformsFromCloud, showNotification
    } = useAppStore();

    const [mounted, setMounted] = useState(false);
    const [showLeaderPanel, setShowLeaderPanel] = useState(false);
    const [showUniformForm, setShowUniformForm] = useState(false);
    const [newUniform, setNewUniform] = useState({
        name: '',
        varones: { traje: '', pantalon: '', camisa: '', corbata: '' },
        hermanas: { toga: '', chalina: '', falda: '', blusa: '' }
    });
    const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRehearsals, setEditingRehearsals] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        loadUniformsFromCloud();
    }, [loadUniformsFromCloud]);

    useEffect(() => {
        if (rehearsals) {
            setEditingRehearsals(rehearsals);
        }
    }, [rehearsals]);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    const isLeader = currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges.includes('leader');

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
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">

                {/* Enhanced Hero Section for Choir Leader */}
                <section className="animate-in fade-in slide-in-from-top-8 duration-1000">
                    <div className="glass-card p-8 md:p-12 rounded-[3.5rem] border-secondary/10 bg-black/40 backdrop-blur-3xl overflow-hidden relative border group">
                        {/* Interactive Aura */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-secondary/20 transition-all duration-1000" />
                        
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Music className="w-64 h-64 text-secondary rotate-12" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative group/avatar">
                                    <div className="absolute -inset-2 bg-gradient-to-tr from-secondary to-purple-400 rounded-[2.5rem] blur opacity-20 group-hover/avatar:opacity-50 transition duration-700"></div>
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.2rem] overflow-hidden border-2 border-secondary/30 bg-black p-1">
                                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                                            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-secondary p-2 rounded-xl border-4 border-[#020617] shadow-xl">
                                        <Star className="w-4 h-4 text-white fill-white" />
                                    </div>
                                </div>

                                <div className="text-center md:text-left space-y-2">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                                        Dirigencia Vocal
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                        {currentUser.name.split(' ')[0]} <span className="text-secondary tracking-[-0.05em] not-italic">HUB</span>
                                    </h1>
                                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-md opacity-80">
                                        Gestión maestra de ensayos, uniformes y cantos sagrados del Coro de Adultos.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isLeader && (
                                    <Button
                                        onClick={() => setShowLeaderPanel(!showLeaderPanel)}
                                        className={cn(
                                            "font-black uppercase italic tracking-[0.2em] px-10 h-16 rounded-[2rem] transition-all shadow-2xl relative overflow-hidden group/btn",
                                            showLeaderPanel
                                                ? "bg-white text-black hover:bg-slate-200"
                                                : "bg-secondary hover:bg-secondary/90 text-white"
                                        )}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Settings className={cn("h-5 w-5 transition-transform duration-700", showLeaderPanel && "rotate-180")} /> 
                                            {showLeaderPanel ? 'Cerrar Consola' : 'Cargar Consola'}
                                        </span>
                                        {!showLeaderPanel && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
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
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 bg-secondary/5 p-6 rounded-3xl border border-secondary/20"
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
                                                    ? "bg-secondary text-foreground"
                                                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {editingRehearsals.map(r => (
                                        <div key={r.id} className="flex items-center gap-2 bg-foreground/5 p-2 rounded-xl border border-border/20">
                                            <span className="text-[10px] font-black text-muted-foreground w-16 uppercase">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][r.dayOfWeek]}</span>
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
                                                className="bg-transparent text-[10px] font-medium text-muted-foreground outline-none flex-1"
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
                                        <div className="text-[9px] font-black text-muted-foreground uppercase w-20">{day.dayName} {format(parseISO(day.date), 'd')}</div>
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
                                                <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Varones</p>
                                                <Input placeholder="Traje (Domingo)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.traje} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, traje: e.target.value } })} />
                                                <Input placeholder="Pantalón (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.pantalon} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, pantalon: e.target.value } })} />
                                                <Input placeholder="Camisa (Jueves)" className="text-[9px] h-6 mb-1 bg-background" value={newUniform.varones.camisa} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, camisa: e.target.value } })} />
                                                <Input placeholder="Corbata" className="text-[9px] h-6 bg-background" value={newUniform.varones.corbata} onChange={e => setNewUniform({ ...newUniform, varones: { ...newUniform.varones, corbata: e.target.value } })} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Hermanas</p>
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
                                                    const newId = Math.random().toString(36).substr(2, 9);
                                                    addUniform({ id: newId, category: 'Adulto', ...newUniform });
                                                    saveUniformToCloud(newUniform.name, 'Adulto', newUniform.varones, newUniform.hermanas, undefined);
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
                                                    <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">
                                                        V: {u.varones?.traje ? `Tr: ${u.varones.traje}` : (u.varones?.pantalon || u.varones?.camisa) ? `P: ${u.varones?.pantalon}, C: ${u.varones?.camisa}` : 'No Asignado'}, Corb: {u.varones?.corbata}<br />
                                                        H: {u.hermanas?.toga ? `T: ${u.hermanas.toga}` : (u.hermanas?.falda || u.hermanas?.blusa) ? `F: ${u.hermanas?.falda}, B: ${u.hermanas?.blusa}` : 'No Asignado'}, Ch: {u.hermanas?.chalina}
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
                                        onClick={async () => {
                                            const title = document.getElementById('choir-msg-title') as HTMLInputElement;
                                            const body = document.getElementById('choir-msg-body') as HTMLTextAreaElement;
                                            if (title.value && body.value) {
                                                setIsSaving(true);
                                                try {
                                                    await saveAnnouncementToCloud({
                                                        id: editingAnnId || undefined,
                                                        title: title.value,
                                                        content: body.value,
                                                        category: 'choir',
                                                        priority: 1
                                                    });
                                                    title.value = '';
                                                    body.value = '';
                                                    setEditingAnnId(null);
                                                    showNotification(editingAnnId ? "Aviso actualizado." : "Aviso publicado.");
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            }
                                        }}
                                        disabled={isSaving}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest h-8"
                                    >
                                        {isSaving ? '...' : (editingAnnId ? 'Actualizar' : 'Aviso')} <Bell className="ml-1 w-3 h-3" />
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
                                                showNotification("Mensaje interno enviado al coro exitosamente.");
                                            }
                                        }}
                                        className="w-full bg-secondary hover:bg-secondary/80 text-white text-[9px] font-black uppercase tracking-widest h-8"
                                    >
                                        Interno <Send className="ml-1 w-3 h-3" />
                                    </Button>
                                    {editingAnnId && (
                                        <Button
                                            variant="ghost"
                                            className="col-span-2 text-[8px] h-6 uppercase font-bold"
                                            onClick={() => {
                                                setEditingAnnId(null);
                                                (document.getElementById('choir-msg-title') as any).value = '';
                                                (document.getElementById('choir-msg-body') as any).value = '';
                                            }}
                                        >
                                            Cancelar Edición
                                        </Button>
                                    )}
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
                                                    <p className="text-xs text-muted-foreground uppercase font-bold">
                                                        Próximo {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][r.dayOfWeek]}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-[10px] font-black uppercase">Obligatorio</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-foreground/5 rounded-lg border border-border/40 mt-4">
                                                <p className="text-xs font-bold text-foreground mb-1 uppercase tracking-tighter">Ubicación: <span className="text-muted-foreground">{r.location}</span></p>
                                                <p className="text-[10px] text-muted-foreground font-medium italic">"{r.notes || 'Favor de ser puntuales.'}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">No hay ensayos programados.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Calendario de Uniformes */}
                    <Card className="glass-card border-none bg-black/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 group-hover:w-2 transition-all opacity-50" />
                        
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-amber-500 text-[11px] font-black uppercase tracking-widest">
                                <Shirt className="h-4 w-4" /> Uniformes de Gala
                            </CardTitle>
                            <CardDescription className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Presentaciones Jueves y Domingo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-8 px-4">
                            {upcomingDays.map((day, i) => {
                                const uniform = uniforms.find(u => u.id === day.uniformId);
                                return (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group/row hover:bg-amber-500/10 transition-all duration-500">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black text-amber-500/70 uppercase italic tracking-widest">{day.dayName}, {format(parseISO(day.date), 'd MMM')}</span>
                                                {uniform && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
                                            </div>
                                            <p className="text-[15px] font-black text-foreground tracking-tight uppercase italic group-hover/row:text-amber-400 transition-colors leading-none">{uniform ? uniform.name : 'Por asignar'}</p>
                                            {uniform && (
                                                <div className="flex flex-col gap-1 mt-3 opacity-60 group-hover/row:opacity-100 transition-opacity">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-[7px] font-black uppercase text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded leading-none mt-0.5">V</span>
                                                        <span className="text-[9px] font-bold text-muted-foreground leading-tight">
                                                            {uniform.varones?.traje ? uniform.varones.traje : `${uniform.varones?.pantalon}, ${uniform.varones?.camisa}`}, {uniform.varones?.corbata}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-2 border-t border-white/5 pt-1">
                                                        <span className="text-[7px] font-black uppercase text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded leading-none mt-0.5">H</span>
                                                        <span className="text-[9px] font-bold text-muted-foreground leading-tight">
                                                            {uniform.hermanas?.toga ? uniform.hermanas.toga : `${uniform.hermanas?.falda}, ${uniform.hermanas?.blusa}`}, {uniform.hermanas?.chalina}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {uniform && <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 group-hover/row:scale-110 transition-transform"><Shirt className="w-4 h-4 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" /></div>}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Estadísticas de Asistencia (Coro) */}
                    <Card className="glass-card border-none bg-black/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-secondary text-[11px] font-black uppercase tracking-widest">
                                <Users className="h-4 w-4" /> Fidelidad Vocal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <div className="flex flex-col items-center py-4 relative">
                                {/* Rotating Radar Effect */}
                                <motion.div 
                                    className="absolute w-40 h-40 rounded-full border border-secondary/5 pointer-events-none"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute top-1/2 left-[50%] w-[50%] h-[1px] bg-gradient-to-r from-secondary/20 to-transparent origin-left" />
                                </motion.div>

                                <div className="relative w-36 h-36 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="choirAttGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ec4899" />
                                                <stop offset="100%" stopColor="#f472b6" />
                                            </linearGradient>
                                            <filter id="choirAttGlow">
                                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>
                                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                                        <motion.circle 
                                            cx="50" 
                                            cy="50" 
                                            r="40" 
                                            stroke="url(#choirAttGrad)" 
                                            strokeWidth="10" 
                                            fill="transparent" 
                                            strokeDasharray="251.2" 
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 * (1 - (isNaN(attRate) ? 0 : attRate) / 100) }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round" 
                                            filter="url(#choirAttGlow)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                        <span className="text-4xl font-black text-foreground italic tracking-tighter leading-none">{attRate}%</span>
                                        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1 leading-none">Global</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 w-full mt-10 gap-4 text-center">
                                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05] group/stat">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover/stat:text-secondary transition-colors">Servicios</p>
                                        <p className="text-2xl font-black text-foreground italic leading-none">{att?.attended || 0}/{att?.total || 0}</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05] group/stat">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover/stat:text-secondary transition-colors">Privilegios</p>
                                        <p className="text-2xl font-black text-foreground italic leading-none">{ledCount}</p>
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
                                <div key={i} className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex gap-4 items-start animate-in slide-in-from-bottom duration-500 group" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary"><Calendar className="h-5 w-5" /></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground uppercase italic tracking-tight">{a.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                                        <span className="text-[8px] text-muted-foreground font-bold uppercase mt-2 block">{format(parseISO(a.timestamp), 'Pp', { locale: es })}</span>
                                    </div>
                                    {isLeader && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingAnnId(a.id);
                                                    setShowLeaderPanel(true);
                                                    setTimeout(() => {
                                                        const title = document.getElementById('choir-msg-title') as HTMLInputElement;
                                                        const body = document.getElementById('choir-msg-body') as HTMLTextAreaElement;
                                                        if (title && body) {
                                                            title.value = a.title;
                                                            body.value = a.content;
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }
                                                    }, 100);
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                            >
                                                <Settings className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await deleteAnnouncementFromCloud(a.id);
                                                    showNotification("Aviso eliminado correctamente.");
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No hay avisos recientes para el coro.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
