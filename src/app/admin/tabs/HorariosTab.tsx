"use client"

import React, { useState, useEffect } from 'react'
import { Sparkles, Save, User as UserIcon, Clock, Languages, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, Crown, BookOpen, RefreshCw, Radio, Globe, Star, Zap, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import PremiumCalendar from '@/components/ui/PremiumCalendar'
import { useAppStore, DailySchedule } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TactileGlassCard, TactileSelect, TactileInput } from '@/components/admin/TactileUI'

interface HorariosTabProps {
    currentDate: string
    setCurrentDate: (date: string) => void
}

export const HorariosTab = ({
    currentDate,
    setCurrentDate
}: HorariosTabProps) => {
    const {
        members,
        monthlySchedule,
        saveScheduleDayToCloud,
        saveRecurringScheduleToCloud,
        seedMonthSchedule,
        showNotification,
        loadDayScheduleFromCloud
    } = useAppStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    // Sincronizar datos al cambiar fecha
    useEffect(() => {
        loadDayScheduleFromCloud(currentDate);
    }, [currentDate]);

    const sanitizedDate = currentDate.split(':')[0].split(' ')[0];
    const isSun = parseISO(sanitizedDate + 'T12:00:00').getDay() === 0;
    const isThu = parseISO(sanitizedDate + 'T12:00:00').getDay() === 3;
    
    const currentDaySchedule: DailySchedule = monthlySchedule[sanitizedDate] || {
        id: 'fallback',
        date: sanitizedDate,
        slots: {
            '5am': { leaderId: '', time: '05:00 AM', endTime: '05:30 AM', language: 'es' },
            '9am': { 
                consecrationLeaderId: '', 
                doctrineLeaderId: '', 
                time: '09:00 AM', 
                endTime: '10:00 AM', 
                language: 'es',
                sundayType: 'local',
                topic: ''
            },
            '12pm': { leaderId: '', time: '12:00 PM', endTime: '01:00 PM', language: 'es' },
            'evening': { 
                leaderIds: [], 
                time: '07:00 PM', 
                endTime: '08:00 PM', 
                type: 'regular', 
                language: 'es',
                doctrineLeaderId: '',
                topic: ''
            }
        }
    };

    const [tempCustomLabel, setTempCustomLabel] = useState('')

    // ─── Modo Día Extraordinario ───────────────────────────────────────
    const [dayModeActive, setDayModeActive] = useState(false)
    const [dayModeIcon, setDayModeIcon] = useState('radio')
    const [dayModeTitle, setDayModeTitle] = useState('')
    const [isSavingDayMode, setIsSavingDayMode] = useState(false)

    // Sync dayMode state from store when date changes
    useEffect(() => {
        const dm = currentDaySchedule?.dayMode || ''
        if (dm) {
            const parts = dm.split('|')
            setDayModeIcon(parts[0] || 'radio')
            setDayModeTitle(parts.slice(1).join('|') || '')
            setDayModeActive(true)
        } else {
            setDayModeActive(false)
            setDayModeIcon('radio')
            setDayModeTitle('')
        }
    }, [currentDate, currentDaySchedule?.dayMode])

    const DAY_MODE_ICONS = [
        { key: 'radio',    Icon: Radio,    label: 'Transmisión' },
        { key: 'crown',    Icon: Crown,    label: 'Ministerial' },
        { key: 'sparkles', Icon: Sparkles, label: 'General'     },
        { key: 'globe',    Icon: Globe,    label: 'Internacional'},
        { key: 'star',     Icon: Star,     label: 'Celebración'  },
        { key: 'zap',      Icon: Zap,      label: 'Oración'      },
    ] as const

    const saveDayMode = async (active: boolean, icon: string, title: string) => {
        setIsSavingDayMode(true)
        try {
            const selectedLabel = DAY_MODE_ICONS.find(i => i.key === icon)?.label || 'Evento Especial';
            const finalTitle = title.trim() || selectedLabel;
            const dayModeValue = active ? `${icon}|${finalTitle}` : null;
            const slotsWithDayMode = {
                ...currentDaySchedule.slots,
                dayMode: dayModeValue
            };
            await saveScheduleDayToCloud(sanitizedDate, slotsWithDayMode as any);
            showNotification(active ? `Modo extraordinario: ${finalTitle}` : 'Modo extraordinario desactivado', 'success');
        } catch (e) {
            showNotification('Error al guardar modo extraordinario', 'error')
        } finally {
            setIsSavingDayMode(false)
        }
    }
    // ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (currentDaySchedule?.slots?.['evening']) {
            setTempCustomLabel(currentDaySchedule.slots['evening'].customLabel || '')
        }
    }, [currentDate, currentDaySchedule?.slots?.['evening']?.customLabel])

    const allMemberOptions = members
        .filter(m => m.status === 'Activo')
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(m => ({ value: m.id, label: m.name }));

    const privilegedMemberOptions = members
        .filter(m => m.status === 'Activo' && m.can_manage_prayers !== false)
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(m => ({ value: m.id, label: m.name }));

    const updateSlot = async (slot: '5am' | '9am' | 'evening' | '12pm', updates: any) => {
        setIsSaving(true);
        try {
            const currentSlot = currentDaySchedule.slots[slot];
            const updatedSlot = { ...currentSlot, ...updates };
            
            const updatedSchedule = {
                ...currentDaySchedule,
                slots: {
                    ...currentDaySchedule.slots,
                    [slot]: updatedSlot
                }
            };

            await saveScheduleDayToCloud(sanitizedDate, updatedSchedule as any);
            showNotification('Horario actualizado correctamente', 'success');
        } catch (error) {
            console.error("Error updating slot:", error);
            showNotification('Error al actualizar el horario', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            key="horarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-6 rounded-md border border-[var(--tactile-border)] relative z-30">
                <div className="flex flex-col md:flex-row items-baseline gap-3">
                    <h2 className="text-2xl font-black text-foreground capitalize tracking-tighter">Programación</h2>
                    <div className="relative">
                        <button 
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="text-lg font-bold text-emerald-400 hover:text-emerald-300 capitalize tracking-tight transition-colors flex items-center gap-2"
                        >
                            {(() => {
                                try {
                                    return format(parseISO(sanitizedDate + 'T12:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
                                } catch (e) {
                                    return sanitizedDate;
                                }
                            })()}
                            <CalendarIcon className="w-4 h-4 opacity-50" />
                        </button>

                        <AnimatePresence>
                            {isCalendarOpen && (
                                <div className="absolute top-full left-0 mt-4 z-[100] w-[350px]">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                                    >
                                        <PremiumCalendar 
                                            selectedDate={sanitizedDate}
                                            onDateSelect={(date) => {
                                                setCurrentDate(date);
                                                setIsCalendarOpen(false);
                                            }}
                                            theme="primitivo"
                                        />
                                    </motion.div>
                                    <div 
                                        className="fixed inset-0 z-[-1]" 
                                        onClick={() => setIsCalendarOpen(false)}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5 mr-2">
                        <button 
                            onClick={() => setCurrentDate(format(subDays(parseISO(sanitizedDate + 'T12:00:00'), 1), 'yyyy-MM-dd'))}
                            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setCurrentDate(format(new Date(), 'yyyy-MM-dd'))}
                            className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-all"
                        >
                            HOY
                        </button>
                        <button 
                            onClick={() => setCurrentDate(format(addDays(parseISO(sanitizedDate + 'T12:00:00'), 1), 'yyyy-MM-dd'))}
                            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative group">
                        <input
                            type="date"
                            value={sanitizedDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            className="tactile-btn tactile-btn-glass text-[10px] px-6 h-10 group border-primary/20 hover:border-primary/50 relative z-20 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (confirm("¿Poblar el mes actual con datos de prueba?")) seedMonthSchedule();
                        }}
                        className="tactile-btn tactile-btn-glass text-[10px] px-6 h-10 group"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-2 group-hover:text-emerald-400 transition-colors" />
                        POBLAR
                    </button>
                </div>
            </div>

            {/* ─── PANEL: MODO DÍA EXTRAORDINARIO ─────────────────────────────── */}
            <div className={`relative rounded-xl border transition-all duration-500 overflow-hidden ${dayModeActive ? 'border-amber-500/60 bg-amber-500/5' : 'border-[var(--tactile-border)] bg-white/[0.02]'}`}>
                {/* Active glow strip */}
                {dayModeActive && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-pulse" />
                )}

                <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dayModeActive ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/30'}`}>
                                <Radio className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-foreground/80">Modo Día Extraordinario</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {dayModeActive ? '🔴 Activo — el display mostrará panel especial' : 'Inactivo — día normal con líderes asignados'}
                                </p>
                            </div>
                        </div>

                        {/* Toggle button */}
                        <button
                            onClick={() => {
                                const next = !dayModeActive
                                setDayModeActive(next)
                                if (!next) saveDayMode(false, dayModeIcon, dayModeTitle)
                            }}
                            disabled={isSavingDayMode}
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 disabled:opacity-50 ${dayModeActive ? 'bg-amber-500' : 'bg-white/10 border border-white/10'}`}
                        >
                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${dayModeActive ? 'left-8' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Expanded content when active */}
                    <AnimatePresence>
                        {dayModeActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 pt-2 border-t border-amber-500/20">
                                    {/* Icon selector */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-400/70 mb-2">Tipo de Evento</p>
                                        <div className="grid grid-cols-6 gap-2">
                                            {DAY_MODE_ICONS.map(({ key, Icon, label }) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setDayModeIcon(key)}
                                                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all ${dayModeIcon === key ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-[8px] font-bold uppercase tracking-wider leading-none">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title input */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-400/70 mb-2">Título que aparecerá en pantalla</p>
                                        <input
                                            type="text"
                                            value={dayModeTitle}
                                            onChange={e => setDayModeTitle(e.target.value)}
                                            placeholder="Ej. Transmisión desde Sede Internacional — Santa Cena 2025"
                                            className="w-full bg-black/30 border border-amber-500/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/60 transition-colors"
                                            onKeyDown={e => { if (e.key === 'Enter') saveDayMode(true, dayModeIcon, dayModeTitle) }}
                                        />
                                    </div>

                                    {/* Save button - Right aligned & Content fit */}
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => saveDayMode(true, dayModeIcon, dayModeTitle)}
                                            disabled={isSavingDayMode}
                                            className="tactile-btn tactile-btn-orange px-6 h-10 rounded-xl justify-center font-bold tracking-wider text-[11px] disabled:opacity-40 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            <Save className="w-3.5 h-3.5 mr-2" />
                                            {isSavingDayMode ? 'GUARDANDO...' : 'GUARDAR MODO EXTRAORDINARIO'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* ────────────────────────────────────────────────────────────────── */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 5 AM Slot */}

                <TactileGlassCard
                    title="05:00 AM"
                    subtitle="Oración de Primicias"
                    className="border-t-2 border-t-blue-500/30"
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentDaySchedule.slots['5am'].time}
                                    onChange={(e) => updateSlot('5am', { time: e.target.value })}
                                    className="bg-transparent border-b border-[var(--tactile-border-strong)] text-xl font-bold w-20 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => updateSlot('5am', { language: currentDaySchedule.slots['5am'].language === 'en' ? 'es' : 'en' })}
                                disabled={isSaving}
                                className={cn(
                                    "tactile-btn text-[10px] w-12 h-8 justify-center",
                                    currentDaySchedule.slots['5am'].language === 'en' ? "tactile-btn-orange" : "tactile-btn-glass",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {currentDaySchedule.slots['5am'].language === 'en' ? 'EN' : 'ES'}
                            </button>
                        </div>

                        <TactileSelect
                            label="RESPONSABLE"
                            value={currentDaySchedule.slots['5am'].leaderId}
                            onChange={(val: string) => updateSlot('5am', { leaderId: val })}
                            disabled={isSaving}
                            options={privilegedMemberOptions}
                            icon={UserIcon}
                        />

                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => updateSlot('5am', { leaderId: currentDaySchedule.slots['5am'].leaderId })}
                                className="tactile-btn tactile-btn-orange px-5 h-9 rounded-xl justify-center"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" /> GUARDAR
                            </button>
                        </div>

                        <div className="flex gap-3 pt-2 border-t border-[var(--tactile-border)]">
                            <button
                                onClick={() => saveRecurringScheduleToCloud(currentDate, '5am', currentDaySchedule.slots['5am'].leaderId, 'next')}
                                disabled={isSaving}
                                className="tactile-btn tactile-btn-glass text-[9px] flex-1 justify-center disabled:opacity-50"
                            >
                                PRÓX. LUNES
                            </button>
                            <button
                                onClick={() => saveRecurringScheduleToCloud(currentDate, '5am', currentDaySchedule.slots['5am'].leaderId, 'month')}
                                disabled={isSaving}
                                className="tactile-btn tactile-btn-glass text-[9px] flex-1 justify-center disabled:opacity-50"
                            >
                                TODO EL MES
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>

                {/* 9 AM Slot */}
                <TactileGlassCard
                    title={isSun ? "10:00 AM" : "09:00 AM"}
                    subtitle={isSun ? "Escuela Dominical" : "Consagración / Doctrina"}
                    className={cn("border-t-2", isSun ? "border-t-primary/30" : "border-t-emerald-500/30")}
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={currentDaySchedule.slots['9am'].time}
                                disabled={isSaving}
                                onChange={(e) => updateSlot('9am', { time: e.target.value })}
                                className="bg-transparent border-b border-[var(--tactile-border-strong)] text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={() => updateSlot('9am', { language: currentDaySchedule.slots['9am'].language === 'en' ? 'es' : 'en' })}
                                disabled={isSaving}
                                className={cn(
                                    "tactile-btn text-[10px] w-12 h-8 justify-center",
                                    currentDaySchedule.slots['9am'].language === 'en' ? "tactile-btn-orange" : "tactile-btn-glass",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {currentDaySchedule.slots['9am'].language === 'en' ? 'EN' : 'ES'}
                            </button>
                        </div>

                        {isSun ? (
                            <div className="space-y-4">
                                <TactileSelect
                                    label="TIPO DE DOMINICAL"
                                    value={currentDaySchedule.slots['9am'].sundayType || 'local'}
                                    onChange={(val: string) => updateSlot('9am', { sundayType: val })}
                                    disabled={isSaving}
                                    searchable={false}
                                    options={[
                                        { value: 'local', label: 'Dominical Local' },
                                        { value: 'exchange', label: 'Intercambio Ministerial' },
                                        { value: 'broadcast', label: 'Transmisión Dominical' },
                                        { value: 'visitors', label: 'Dominical de Visitas' },
                                    ]}
                                    icon={Crown}
                                />
                                <TactileInput
                                    label="TEMA / DETALLES (OPCIONAL)"
                                    placeholder="Ej. Estudio de la Fe..."
                                    value={(currentDaySchedule.slots['9am'] as any).topic || ''}
                                    onChange={(e: any) => updateSlot('9am', { topic: e.target.value })}
                                    disabled={isSaving}
                                    icon={Sparkles}
                                />
                            </div>
                        ) : (
                            <>
                                <TactileSelect
                                    label="CONSAGRACIÓN"
                                    value={currentDaySchedule.slots['9am'].consecrationLeaderId}
                                    onChange={(val: string) => updateSlot('9am', { consecrationLeaderId: val })}
                                    disabled={isSaving}
                                    options={privilegedMemberOptions}
                                    icon={UserIcon}
                                />
                                <TactileSelect
                                    label="DOCTRINA"
                                    value={currentDaySchedule.slots['9am'].doctrineLeaderId}
                                    onChange={(val: string) => updateSlot('9am', { doctrineLeaderId: val })}
                                    disabled={isSaving}
                                    options={privilegedMemberOptions}
                                    icon={Flame}
                                />
                            </>
                        )}

                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => updateSlot('9am', {})}
                                className="tactile-btn tactile-btn-orange px-5 h-9 rounded-xl justify-center"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" /> GUARDAR {isSun ? 'DOMINICAL' : 'PROGRAMA'}
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>

                {/* 12 PM Slot */}
                <TactileGlassCard
                    title="12:00 PM"
                    subtitle="Oración de mediodía"
                    className="border-t-2 border-t-emerald-500/30"
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={currentDaySchedule?.slots?.['12pm']?.time || '12:00 PM'}
                                disabled={isSaving}
                                onChange={(e) => updateSlot('12pm', { time: e.target.value })}
                                className="bg-transparent border-b border-[var(--tactile-border-strong)] text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={() => updateSlot('12pm', { language: currentDaySchedule?.slots?.['12pm']?.language === 'en' ? 'es' : 'en' })}
                                disabled={isSaving}
                                className={cn(
                                    "tactile-btn text-[10px] w-12 h-8 justify-center",
                                    currentDaySchedule?.slots?.['12pm']?.language === 'en' ? "tactile-btn-orange" : "tactile-btn-glass",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {currentDaySchedule?.slots?.['12pm']?.language === 'en' ? 'EN' : 'ES'}
                            </button>
                        </div>
                        <TactileSelect
                            label="RESPONSABLE"
                            value={currentDaySchedule?.slots?.['12pm']?.leaderId || ''}
                            onChange={(val: string) => updateSlot('12pm', { leaderId: val })}
                            disabled={isSaving}
                            options={privilegedMemberOptions}
                            icon={UserIcon}
                        />
                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => updateSlot('12pm', {})}
                                className="tactile-btn tactile-btn-orange px-5 h-9 rounded-xl justify-center"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" /> GUARDAR
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>

                {/* Evening Slot */}
                <TactileGlassCard
                    title="07:00 PM"
                    subtitle="Servicio de Oración"
                    className="border-t-2 border-t-pink-500/30"
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={currentDaySchedule.slots['evening'].time}
                                disabled={isSaving}
                                onChange={(e) => updateSlot('evening', { time: e.target.value })}
                                className="bg-transparent border-b border-[var(--tactile-border-strong)] text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={() => updateSlot('evening', { language: currentDaySchedule.slots['evening'].language === 'en' ? 'es' : 'en' })}
                                disabled={isSaving}
                                className={cn(
                                    "tactile-btn text-[10px] w-12 h-8 justify-center",
                                    currentDaySchedule.slots['evening'].language === 'en' ? "tactile-btn-orange" : "tactile-btn-glass",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {currentDaySchedule.slots['evening'].language === 'en' ? 'EN' : 'ES'}
                            </button>
                        </div>

                        <TactileSelect
                            label="TIPO DE SERVICIO"
                            value={currentDaySchedule.slots['evening'].type || 'regular'}
                            disabled={isSaving}
                            searchable={false}
                            onChange={(val: string) => {
                                const updates: any = { type: val };
                                if (val !== 'special') {
                                    updates.customLabel = '';
                                }
                                updateSlot('evening', updates);
                            }}
                            options={[
                                { value: 'regular', label: 'Regular' },
                                { value: 'youth', label: 'Jóvenes' },
                                { value: 'married', label: 'Casados' },
                                { value: 'children', label: 'Niños' },
                                { value: 'solos', label: 'Solos y Solas' },
                                { value: 'praise', label: 'Servicio de Alabanza' },
                                { value: 'special', label: 'Especial' },
                            ]}
                            icon={Sparkles}
                        />

                        {currentDaySchedule.slots['evening'].type === 'special' && (
                            <TactileInput
                                label="TÍTULO PERSONALIZADO (ESPECIAL) [↵ ENTER O CLIC FUERA PARA GUARDAR]"
                                placeholder="Ej. Servicio Especial de Niños, Aniversario..."
                                value={tempCustomLabel}
                                onChange={(e: any) => setTempCustomLabel(e.target.value)}
                                onBlur={() => {
                                    if (tempCustomLabel !== (currentDaySchedule?.slots?.['evening']?.customLabel || '')) {
                                        updateSlot('evening', { customLabel: tempCustomLabel });
                                    }
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                    }
                                }}
                                disabled={isSaving}
                                icon={Sparkles}
                            />
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <TactileSelect
                                label={['youth', 'praise', 'children'].includes(currentDaySchedule.slots['evening'].type) || isSun || isThu ? "DIRIGE" : "ENCARGADO"}
                                value={currentDaySchedule.slots['evening'].leaderIds[0] || ''}
                                onChange={(val: string) => updateSlot('evening', { leaderIds: [val] })}
                                disabled={isSaving}
                                options={privilegedMemberOptions}
                                icon={UserIcon}
                            />
                            <TactileSelect
                                label="DOCTRINA"
                                value={currentDaySchedule.slots['evening'].doctrineLeaderId || ''}
                                onChange={(val: string) => updateSlot('evening', { doctrineLeaderId: val })}
                                disabled={isSaving}
                                options={privilegedMemberOptions}
                                icon={BookOpen}
                            />
                        </div>

                        {/* Optional Third Privilege */}
                        <div className="border-t border-slate-700/50 pt-4 mt-2">
                            <h4 className="text-xs font-bold text-[#A3FF57]/80 uppercase tracking-widest mb-3">Tercer Privilegio (Opcional)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TactileInput
                                    label="Cargo / Privilegio"
                                    placeholder="Ej. Consagración, Coro, Ofrenda..."
                                    value={currentDaySchedule.slots['evening'].thirdLeaderRole || ''}
                                    onChange={(e: any) => updateSlot('evening', { thirdLeaderRole: e.target.value })}
                                    disabled={isSaving}
                                    icon={Sparkles}
                                />
                                <TactileSelect
                                    label="Encargado"
                                    value={currentDaySchedule.slots['evening'].consecrationLeaderId || ''}
                                    onChange={(val: string) => updateSlot('evening', { consecrationLeaderId: val })}
                                    disabled={isSaving}
                                    options={privilegedMemberOptions}
                                    icon={Flame}
                                />
                            </div>
                        </div>
                        <TactileInput
                            label="TEMA / ESTUDIO"
                            placeholder="Ej. El Arrepentimiento..."
                            value={currentDaySchedule.slots['evening'].topic || ''}
                            onChange={(e: any) => updateSlot('evening', { topic: e.target.value })}
                            disabled={isSaving}
                            icon={Sparkles}
                        />
                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => updateSlot('evening', {})}
                                className="tactile-btn tactile-btn-orange px-5 h-9 rounded-xl justify-center"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" /> GUARDAR SERVICIO
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
