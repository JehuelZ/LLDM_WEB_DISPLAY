"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    Music2, Plus, Bell, Edit2, Trash2, 
    CalendarDays
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TactileGlassCard } from '@/components/admin/TactileUI'

interface CorosTabProps {
    currentDate: string
    setActiveTab: (tab: string) => void
}

export const CorosTab = ({
    currentDate,
    setActiveTab
}: CorosTabProps) => {
    const {
        rehearsals,
        deleteRehearsalFromCloud,
        uniforms,
        uniformSchedule,
        saveUniformForDateToCloud,
        announcements,
        deleteAnnouncementFromCloud
    } = useAppStore()

    // Assuming we have a way to show rehearsal modal, but for now we'll just link it or wait for full refactor
    // In this extraction, I'll focus on the UI part.

    return (
        <motion.div
            key="coros"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            <div className="col-span-1 md:col-span-6 space-y-6">
                <TactileGlassCard title="ENSAYOS DE CORO">
                    <div className="space-y-4">
                        {rehearsals.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-[var(--tactile-border)] rounded-2xl text-center bg-black/5">
                                <p className="text-muted-foreground text-xs font-bold">No hay ensayos programados</p>
                            </div>
                        ) : (
                            rehearsals.map(reh => (
                                <div key={reh.id} className="flex items-center gap-4 p-4 bg-black/5 rounded-xl border border-[var(--tactile-border)] group">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                                        {['D', 'L', 'M', 'X', 'J', 'V', 'S'][reh.dayOfWeek]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-sm capitalize">{reh.location}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground">{reh.time}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (confirm('¿Eliminar este ensayo?')) {
                                                await deleteRehearsalFromCloud(reh.id);
                                            }
                                        }}
                                        className="tactile-btn tactile-btn-glass !rounded-full w-8 h-8 p-0 items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                        <button
                            className="tactile-btn tactile-btn-glass w-full justify-start gap-4 h-12 px-6"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-black capitalize tracking-widest">Agregar Ensayos</span>
                        </button>
                    </div>
                </TactileGlassCard>
            </div>

            <div className="col-span-1 md:col-span-6 space-y-6">
                <TactileGlassCard title="UNIFORMES DE LA SEMANA">
                    <div className="space-y-4">
                        {(() => {
                            const today = new Date(currentDate + 'T12:00:00');
                            const start = new Date(today);
                            const dayOfWeek = today.getDay();
                            const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                            start.setDate(today.getDate() + offset);

                            const weekDays = Array.from({ length: 7 }, (_, i) => {
                                const d = new Date(start);
                                d.setDate(start.getDate() + i);
                                return format(d, 'yyyy-MM-dd');
                            });

                            return weekDays.map((date) => {
                                const uniformId = uniformSchedule[date];
                                const uniform = uniforms.find(u => u.id === uniformId);
                                return (
                                    <div key={date} className="flex items-center justify-between p-4 bg-black/5 rounded-xl border border-[var(--tactile-border)] relative group/row">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-muted-foreground capitalize tracking-widest mb-1 truncate">
                                                {format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })}
                                            </span>
                                            <span className={cn("font-black px-4 py-1.5 rounded-xl border border-[var(--tactile-border)] bg-black/20 text-xs", uniform ? "text-primary border-primary/20" : "text-foreground/20")}>
                                                {uniform?.name || 'NO DEFINIDO'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 relative">
                                            <select
                                                value={uniformId || ''}
                                                onChange={(e) => saveUniformForDateToCloud(date, e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                            >
                                                <option value="">(Sin Uniforme)</option>
                                                {uniforms.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                            <button className="tactile-btn tactile-btn-glass h-9 text-[9px] pointer-events-none group-hover/row:bg-primary group-hover/row:text-black transition-all">CAMBIAR</button>
                                        </div>
                                    </div>
                                )
                            });
                        })()}
                    </div>
                </TactileGlassCard>
            </div>

            <div className="col-span-1 md:col-span-12 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black capitalize tracking-widest text-foreground">Avisos del Coro</h3>
                </div>
                <div className="space-y-4">
                    {announcements.filter(a => a.category === 'choir' || a.title.toLowerCase().includes('coro')).length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-[var(--tactile-border)] rounded-[2.5rem] text-center bg-black/5">
                            <p className="text-muted-foreground font-bold capitalize tracking-widest text-xs">No hay avisos específicos para el coro</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {announcements.filter(a => a.category === 'choir' || a.title.toLowerCase().includes('coro')).map((ann) => (
                                <div key={ann.id} className="bg-black/5 p-6 rounded-3xl border border-[var(--tactile-border)] flex items-start gap-4 group hover:bg-[var(--tactile-item-hover)] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 border border-pink-500/20">
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm capitalize truncate">{ann.title}</h4>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{ann.content}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={async () => {
                                                if (confirm('¿Eliminar este aviso de coro?')) {
                                                    await deleteAnnouncementFromCloud(ann.id);
                                                }
                                            }}
                                            className="tactile-btn tactile-btn-glass !rounded-full w-8 h-8 p-0 items-center justify-center hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
