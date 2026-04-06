'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Calendar, 
    ArrowLeft, 
    ChevronRight, 
    Clock, 
    Star, 
    Activity 
} from 'lucide-react';
import { format, addDays, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface AgendaSectionProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    monthlySchedule: Record<string, any>;
    monthDays: Date[];
    privilegedMembers: any[];
    updateDaySlot: (date: Date, slot: string, data: any) => Promise<void>;
    saveRecurringScheduleToCloud: (dateStr: string, slotKey: string, leaderId: string, type: 'next' | 'month') => Promise<void>;
    showNotification: (msg: string, type?: 'success' | 'error') => void;
}

export function AgendaSection({
    selectedDate,
    setSelectedDate,
    monthlySchedule,
    monthDays,
    privilegedMembers,
    updateDaySlot,
    saveRecurringScheduleToCloud,
    showNotification
}: AgendaSectionProps) {
    return (
        <motion.div
            key="agenda"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* --- SECCIÓN DE GESTIÓN DIARIA (ESTILO ADMINISTRADOR) --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-black/40 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex items-center gap-6 z-10">
                    <div className="flex gap-2">
                            <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-primary" />
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Agenda de la Semana
                            </h2>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 italic border-l-2 border-primary/20 pl-3">Supervisión de Privilegios</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10">
                    <div className="relative group">
                        <input
                            type="date"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                            className="h-12 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                        />
                    </div>
                    <Button 
                        variant="secondary" 
                        className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/40"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        <Clock className="w-3.5 h-3.5 mr-2" /> HOY
                    </Button>
                </div>
            </div>

            {/* --- AGENDA SEMANAL DETALLADA (ESTILO CLÁSICO RESTAURADO) --- */}
            <div className="flex overflow-x-auto gap-4 pb-8 mb-4 no-scrollbar">
                {(() => {
                    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                    return Array.from({ length: 7 }).map((_, i) => {
                        const day = addDays(weekStart, i);
                        const dStr = format(day, 'yyyy-MM-dd');
                        const sched = monthlySchedule[dStr];
                        const isToday = isSameDay(day, new Date());
                        const isSel = isSameDay(day, selectedDate);
                        
                        return (
                            <div 
                                key={dStr}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "flex-shrink-0 w-[180px] flex flex-col p-5 rounded-[2rem] border transition-all cursor-pointer hover:shadow-xl group relative overflow-hidden",
                                    isSel ? "bg-primary border-primary shadow-[0_0_30px_rgba(239,68,68,0.2)]" : 
                                    isToday ? "bg-primary/10 border-primary/40" : "bg-white/[0.03] border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="flex justify-between items-baseline mb-4">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-tighter",
                                        isSel ? "text-black" : "text-muted-foreground/60"
                                    )}>
                                        {format(day, 'EEEE', { locale: es })}
                                    </span>
                                    <span className={cn(
                                        "text-xl font-black italic",
                                        isSel ? "text-black" : "text-white"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {/* Primicias */}
                                    <div className="flex flex-col">
                                        <span className={cn("text-[8px] font-black uppercase opacity-40", isSel ? "text-black" : "text-blue-400")}>5 AM</span>
                                        <p className={cn("text-[10px] font-bold truncate", isSel ? "text-black/80" : "text-white")}>
                                            {sched?.slots?.['5am']?.leaderId ? privilegedMembers.find(m => m.id === sched.slots['5am'].leaderId)?.name : '---'}
                                        </p>
                                    </div>
                                    {/* 9AM */}
                                    <div className="flex flex-col">
                                        <span className={cn("text-[8px] font-black uppercase opacity-40", isSel ? "text-black" : "text-emerald-400")}>9 AM</span>
                                        <p className={cn("text-[10px] font-bold truncate", isSel ? "text-black/80" : "text-white")}>
                                            {(sched?.slots?.['9am']?.leaderId || sched?.slots?.['9am']?.consecrationLeaderId) ? 
                                                privilegedMembers.find(m => m.id === (sched.slots['9am'].leaderId || sched.slots['9am'].consecrationLeaderId))?.name : '---'}
                                        </p>
                                    </div>
                                    {/* Evening */}
                                    <div className="flex flex-col">
                                        <span className={cn("text-[8px] font-black uppercase opacity-40", isSel ? "text-black" : "text-pink-400")}>Noche</span>
                                        <p className={cn("text-[10px] font-bold truncate", isSel ? "text-black/80" : "text-white")}>
                                            {sched?.slots?.['evening']?.leaderIds?.[0] ? privilegedMembers.find(m => m.id === sched.slots['evening'].leaderIds[0])?.name : '---'}
                                        </p>
                                    </div>
                                </div>

                                {isToday && <div className="absolute top-2 right-4 text-[7px] font-black text-primary px-2 py-0.5 rounded-full bg-primary/20 border border-primary/20">HOY</div>}
                            </div>
                        );
                    });
                })()}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navegador Mensual (Mini mapa) */}
                <div className="lg:col-span-3">
                    <Card className="glass-card border-none bg-black/40 p-6 rounded-[2.5rem]">
                        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cobertura</CardTitle>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            </div>
                        </CardHeader>
                        <div className="grid grid-cols-7 gap-2">
                            {['D','L','M','X','J','V','S'].map(d => (<div key={d} className="text-center text-[9px] font-black text-muted-foreground/30 uppercase">{d}</div>))}
                            
                            {/* Spacers for first day of month alignment */}
                            {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
                                <div key={`spacer-${i}`} className="aspect-square" />
                            ))}

                            {monthDays.map((day) => {
                                const dStr = format(day, 'yyyy-MM-dd');
                                const isSel = isSameDay(day, selectedDate);
                                const sched = monthlySchedule[dStr];
                                const missing = sched && (!sched.slots['5am']?.leaderId || !sched.slots['evening']?.leaderIds?.length);
                                
                                return (
                                    <div 
                                        key={dStr} 
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center text-[10px] font-black cursor-pointer border relative transition-all",
                                            isSel ? "bg-primary text-black border-primary shadow-lg" : 
                                            isSameDay(day, new Date()) ? "border-primary/40 text-primary" :
                                            "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                                        )}
                                    >
                                        {format(day, 'd')}
                                        {sched && missing && !isSel && <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    
                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] mt-6">
                        <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-4 italic">Guía de Uso</h4>
                        <ul className="space-y-3 text-[10px] font-medium text-muted-foreground/60 leading-tight italic">
                            <li className="flex gap-2"><span>•</span> Cambios sincronizados automáticamente.</li>
                            <li className="flex gap-2"><span>•</span> Use el selector de fecha para navegar.</li>
                            <li className="flex gap-2"><span>•</span> Los domingos requieren temas específicos.</li>
                        </ul>
                    </div>
                </div>

                {/* Llenado por Horas (Sistema Principal) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 5 AM Slot */}
                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-1 italic"><Clock className="w-3.5 h-3.5" /> 05:00 AM</span>
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Primicias</h4>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost"
                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                onClick={() => updateDaySlot(selectedDate, '5am', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en' ? 'es' : 'en' })}
                            >
                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en' ? 'EN' : 'ES')}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hora</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-blue-500/40"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.time || '05:00 AM'}
                                        onChange={(e) => updateDaySlot(selectedDate, '5am', { time: e.target.value })}
                                    />
                                </div>
                                <div className="flex-[2] space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Responsable</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-blue-500/40 appearance-none transition-all"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId || ''}
                                        onChange={(e) => updateDaySlot(selectedDate, '5am', { leaderId: e.target.value })}
                                    >
                                        <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                        {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase rounded-xl h-10 hover:bg-primary/20" onClick={() => {
                                    const leaderId = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId;
                                    if (leaderId) saveRecurringScheduleToCloud(format(selectedDate, 'yyyy-MM-dd'), '5am', leaderId, 'next');
                                    else showNotification('Seleccione un encargado', 'error');
                                }}>Próx. Lunes</Button>
                                <Button size="sm" variant="ghost" className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase rounded-xl h-10 hover:bg-primary/20" onClick={() => {
                                    const leaderId = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId;
                                    if (leaderId) saveRecurringScheduleToCloud(format(selectedDate, 'yyyy-MM-dd'), '5am', leaderId, 'month');
                                    else showNotification('Seleccione un encargado', 'error');
                                }}>Todo el Mes</Button>
                            </div>
                        </div>
                    </Card>

                    {/* 9 AM Slot */}
                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-emerald-500/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-1 italic">
                                    <Star className="w-3.5 h-3.5" /> 
                                    {selectedDate.getDay() === 0 ? "10:00 AM" : (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.time || "09:00 AM")}
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                        {selectedDate.getDay() === 0 ? "Escuela Dominical" : (selectedDate.getDate() === 14 ? "Servicio de Historia" : "Consagración")}
                                    </h4>
                                    {selectedDate.getDay() !== 0 && <span className="text-[10px] font-black text-pink-400/60 uppercase italic tracking-widest">(Hermana)</span>}
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost"
                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                onClick={() => updateDaySlot(selectedDate, '9am', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en' ? 'es' : 'en' })}
                            >
                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en' ? 'EN' : 'ES')}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hora</label>
                                <input 
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-emerald-500/40"
                                    value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.time || (selectedDate.getDay() === 0 ? '10:00 AM' : '09:00 AM')}
                                    onChange={(e) => updateDaySlot(selectedDate, '9am', { time: e.target.value })}
                                />
                            </div>
                            {selectedDate.getDay() === 0 ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Modalidad</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-primary/40 appearance-none"
                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.sundayType || 'local'}
                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { sundayType: e.target.value })}
                                        >
                                            <option value="local" className="bg-[#0c0c0c]">DOMINICAL LOCAL</option>
                                            <option value="exchange" className="bg-[#0c0c0c]">INTERCAMBIO MINISTERIAL</option>
                                            <option value="broadcast" className="bg-[#0c0c0c]">TRANSMISIÓN VIVO</option>
                                            <option value="visitors" className="bg-[#0c0c0c]">DOMINICAL DE VISITAS</option>
                                        </select>
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Tema o Doctrina..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white italic outline-none focus:border-primary/40"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.topic || ''}
                                        onChange={(e) => updateDaySlot(selectedDate, '9am', { topic: e.target.value })}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Consagración (Hermana)</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.consecrationLeaderId || ''}
                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { consecrationLeaderId: e.target.value })}
                                        >
                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Doctrina (Hermana)</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.doctrineLeaderId || ''}
                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { doctrineLeaderId: e.target.value })}
                                        >
                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>


                    {/* Evening Slot */}
                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-pink-500/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-2 mb-1 italic"><Activity className="w-3.5 h-3.5" /> 07:00 PM</span>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                        {(() => {
                                            if (format(selectedDate, 'd') === '14') return 'Servicio de Historia';
                                            
                                            const slotData = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening'];
                                            const serviceType = slotData?.type || (selectedDate.getDay() === 4 ? 'youth' : (selectedDate.getDay() === 0 ? 'married' : 'regular'));
                                            
                                            switch(serviceType) {
                                                case 'youth': return 'Servicio de Jóvenes';
                                                case 'married': return 'Servicio de Casados';
                                                case 'children': return 'Servicio de Niños';
                                                case 'solos': return 'Servicio Solos y Solas';
                                                case 'praise': return 'Servicio de Alabanza';
                                                default: return 'Servicio Principal';
                                            }
                                        })()}
                                    </h4>
                                    {format(selectedDate, 'd') === '14' && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-lg text-[8px] font-bold tracking-[0.2em] animate-pulse uppercase">Día 14 • Pasaje Bíblico</span>}
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost"
                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                onClick={() => updateDaySlot(selectedDate, 'evening', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en' ? 'es' : 'en' })}
                            >
                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en' ? 'EN' : 'ES')}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Hora</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-pink-500/40"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.time || (selectedDate.getDay() === 4 ? '06:30 PM' : '07:00 PM')}
                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { time: e.target.value })}
                                    />
                                </div>
                                <div className="flex-[2] space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Tipo de Servicio</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none select-none"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || (selectedDate.getDay() === 4 ? 'youth' : (selectedDate.getDay() === 0 ? 'married' : 'regular'))}
                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { type: e.target.value })}
                                    >
                                        <option value="regular" className="bg-[#0c0c0c]">REGULAR</option>
                                        <option value="youth" className="bg-[#0c0c0c]">JÓVENES</option>
                                        <option value="married" className="bg-[#0c0c0c]">CASADOS</option>
                                        <option value="children" className="bg-[#0c0c0c]">NIÑOS</option>
                                        <option value="solos" className="bg-[#0c0c0c]">SOLOS Y SOLAS</option>
                                        <option value="praise" className="bg-[#0c0c0c]">ALABANZA</option>
                                        <option value="special" className="bg-[#0c0c0c]">ESPECIAL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                        {['youth', 'praise', 'children'].includes(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || '') ? 'Dirige' : 'En el Altar'}
                                    </label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.leaderIds?.[0] || ''}
                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { leaderIds: [e.target.value] })}
                                    >
                                        <option value="" className="bg-[#0c0c0c]">SIN ENCARGADO</option>
                                        {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                    </select>
                                </div>
                                {['youth', 'praise', 'children'].includes(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || '') && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Doctrina</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.doctrineLeaderId || ''}
                                            onChange={(e) => updateDaySlot(selectedDate, 'evening', { doctrineLeaderId: e.target.value })}
                                        >
                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <input 
                                type="text"
                                placeholder={format(selectedDate, 'd') === '14' ? "Historia: [Nombre del Pasaje...]" : "Tema / Estudio..."}
                                className={cn(
                                    "w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white italic outline-none focus:border-pink-500/40",
                                    format(selectedDate, 'd') === '14' && "border-blue-500/50"
                                )}
                                value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.topic || ''}
                                onChange={(e) => updateDaySlot(selectedDate, 'evening', { topic: e.target.value })}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
