"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    CalendarClock, Sparkles, User, Save, Flame, Crown, BookOpen, 
    RefreshCw
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
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
        showNotification
    } = useAppStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const isSun = parseISO(currentDate).getDay() === 0;
    
    const currentDaySchedule: DailySchedule = monthlySchedule[currentDate] || {
        id: 'fallback',
        date: currentDate,
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

    const memberOptions = members
        .filter(m => m.status === 'Activo')
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

            await saveScheduleDayToCloud(currentDate, updatedSchedule as any);
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-6 rounded-md border border-[var(--tactile-border)]">
                <div className="flex flex-col md:flex-row items-baseline gap-3">
                    <h2 className="text-2xl font-black text-foreground capitalize tracking-tighter">Programación</h2>
                    <span className="text-lg font-bold text-muted-foreground capitalize tracking-tight opacity-70">
                        {(() => {
                            try {
                                return format(parseISO(currentDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
                            } catch (e) {
                                return currentDate;
                            }
                        })()}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input
                            type="date"
                            value={currentDate}
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
                        POBLAR MES
                    </button>
                </div>
            </div>

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
                            options={memberOptions}
                            icon={User}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => updateSlot('5am', { leaderId: currentDaySchedule.slots['5am'].leaderId })}
                                className="tactile-btn tactile-btn-orange flex-1 justify-center h-10"
                            >
                                <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR
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
                                    options={memberOptions}
                                    icon={User}
                                />
                                <TactileSelect
                                    label="DOCTRINA"
                                    value={currentDaySchedule.slots['9am'].doctrineLeaderId}
                                    onChange={(val: string) => updateSlot('9am', { doctrineLeaderId: val })}
                                    disabled={isSaving}
                                    options={memberOptions}
                                    icon={Flame}
                                />
                            </>
                        )}

                        <button
                            onClick={() => updateSlot('9am', {})}
                            className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                        >
                            <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR {isSun ? 'DOMINICAL' : 'PROGRAMA'}
                        </button>
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
                            options={memberOptions}
                            icon={User}
                        />
                        <button
                            onClick={() => updateSlot('12pm', {})}
                            className="tactile-btn tactile-btn-orange w-full justify-center h-10"
                        >
                            <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR
                        </button>
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

                        {['youth', 'praise', 'children'].includes(currentDaySchedule.slots['evening'].type) ? (
                            <div className="grid grid-cols-1 gap-4">
                                <TactileSelect
                                    label="DIRIGE"
                                    value={currentDaySchedule.slots['evening'].leaderIds[0] || ''}
                                    onChange={(val: string) => updateSlot('evening', { leaderIds: [val] })}
                                    disabled={isSaving}
                                    options={memberOptions}
                                    icon={User}
                                />
                                <TactileSelect
                                    label="DOCTRINA"
                                    value={currentDaySchedule.slots['evening'].doctrineLeaderId || ''}
                                    onChange={(val: string) => updateSlot('evening', { doctrineLeaderId: val })}
                                    disabled={isSaving}
                                    options={memberOptions}
                                    icon={BookOpen}
                                />
                            </div>
                        ) : (
                            <TactileSelect
                                label="ENCARGADO"
                                value={currentDaySchedule.slots['evening'].leaderIds[0] || ''}
                                onChange={(val: string) => updateSlot('evening', { leaderIds: [val] })}
                                disabled={isSaving}
                                options={memberOptions}
                                icon={User}
                            />
                        )}
                        <TactileInput
                            label="TEMA / ESTUDIO"
                            placeholder="Ej. El Arrepentimiento..."
                            value={currentDaySchedule.slots['evening'].topic || ''}
                            onChange={(e: any) => updateSlot('evening', { topic: e.target.value })}
                            disabled={isSaving}
                            icon={Sparkles}
                        />
                        <button
                            onClick={() => updateSlot('evening', {})}
                            className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                        >
                            <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR SERVICIO
                        </button>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
