"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    LayoutDashboard, CheckCircle2, RefreshCw, Flame, 
    TrendingUp, TrendingDown, Sparkles, Save
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
    TactileIconBox, TactileBadge, TactileGlassCard, 
    TactileInput 
} from '@/components/admin/TactileUI'
import { TactilePieChart, TactileAreaChart } from '@/components/ui/Charts'
import AdminClockWeather from '@/components/admin/AdminClockWeather'
import { Users, UserCheck, Clock, ShieldAlert } from 'lucide-react'

interface DashboardTabProps {
    isSaving: boolean
    setIsSaving: (val: boolean) => void
    activeTab: string
    setActiveTab: (val: string) => void
    intelligenceRange: 7 | 15 | 30 | 'month'
    setIntelligenceRange: (val: 7 | 15 | 30 | 'month') => void
    attendanceTrend: { value: number, isPos: boolean }
    monthlyIntelligence: { label: string, value: number }[]
    weeklyStats: any[]
}

export const DashboardTab = ({
    isSaving,
    setIsSaving,
    activeTab,
    setActiveTab,
    intelligenceRange,
    setIntelligenceRange,
    attendanceTrend,
    monthlyIntelligence,
    weeklyStats
}: DashboardTabProps) => {
    const {
        members,
        theme,
        setTheme,
        saveThemeToCloud,
        loadAllSchedulesFromCloud,
        loadAnnouncementsFromCloud,
        loadSettingsFromCloud,
        loadMembersFromCloud,
        loadUniformsFromCloud,
        showNotification
    } = useAppStore()

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            {/* Left Column - System Summary */}
            <div className="col-span-1 md:col-span-8 space-y-6">
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-4xl font-black text-foreground" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>Resumen del Sistema</h2>
                    {isSaving && (
                        <TactileBadge className="border-primary/20 bg-primary/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                            <span className="text-primary">Sincronizando...</span>
                        </TactileBadge>
                    )}
                </div>

                {/* --- STATS BOXES ROW --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-[var(--tactile-border)] backdrop-blur-md group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Users size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Miembros</span>
                        </div>
                        <div className="text-2xl font-black text-foreground tabular-nums">{members.length}</div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-[var(--tactile-border)] backdrop-blur-md group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <UserCheck size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activos</span>
                        </div>
                        <div className="text-2xl font-black text-foreground tabular-nums">
                            {members.filter(m => m.status === 'Activo').length}
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-[var(--tactile-border)] backdrop-blur-md group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asistencia Sem.</span>
                        </div>
                        <div className="text-2xl font-black text-foreground tabular-nums">
                            {attendanceTrend.isPos ? '+' : ''}{attendanceTrend.value}%
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-[var(--tactile-border)] backdrop-blur-md group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                <ShieldAlert size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pendientes</span>
                        </div>
                        <div className="text-2xl font-black text-foreground tabular-nums">
                            {members.filter(m => m.status === 'Pendiente').length}
                        </div>
                    </div>
                </div>

                {/* --- WEATHER WIDGET --- */}
                <div className="mb-8">
                    <AdminClockWeather className="w-full" />
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setActiveTab('asistencia')}
                        className="w-full flex items-center gap-6 p-4 border-b border-[var(--tactile-border)] hover:bg-white/[0.01] transition-colors group text-left"
                    >
                        <TactileIconBox icon={CheckCircle2} color="#3b82f6" />
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">Asistencia de Hoy</h4>
                            <p className="text-muted-foreground text-sm">Registro de asistencia en curso</p>
                        </div>
                        <TactileBadge className="bg-primary/10 border-emerald-500/20 text-emerald-400">
                            Normal
                        </TactileBadge>
                    </button>
                </div>

                <div className="mt-12 flex gap-4">
                    <button
                        onClick={async () => {
                            setIsSaving(true);
                            await Promise.all([
                                loadAllSchedulesFromCloud(),
                                loadAnnouncementsFromCloud(),
                                loadSettingsFromCloud(),
                                loadMembersFromCloud(),
                                loadUniformsFromCloud()
                            ]);
                            setIsSaving(false);
                            showNotification('Datos sincronizados con la nube', 'success');
                        }}
                        className="tactile-btn tactile-btn-orange text-xs px-8"
                    >
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                        Sincronizar Ahora
                    </button>
                    <button className="tactile-btn tactile-btn-glass text-xs px-8">Historial</button>
                </div>
            </div>

            {/* Right Column - Intelligence */}
            <div className="col-span-1 md:col-span-4 space-y-8">
                <TactileGlassCard 
                    title="INTELIGENCIA MENSUAL" 
                    className="w-full"
                    extra={
                        <div className="flex bg-white/5 p-1 rounded-full border border-[var(--tactile-border)] backdrop-blur-md">
                            {['month', 30, 15, 7].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setIntelligenceRange(r as any)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-[9px] font-black transition-all duration-300 tracking-widest uppercase",
                                        intelligenceRange === r 
                                            ? "bg-primary text-black shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105" 
                                            : "text-foreground/30 hover:text-foreground/60"
                                    )}
                                >
                                    {r === 'month' ? 'MES' : `${r}D`}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black capitalize text-primary tracking-[0.2em]">
                                {intelligenceRange === 'month' ? 'Rendimiento Este Mes' : `Rendimiento Últimos ${intelligenceRange} Días`}
                            </p>
                            <TactileBadge className={cn(
                                "gap-1.5",
                                attendanceTrend.isPos ? "bg-primary/10 border-emerald-500/20 text-emerald-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                            )}>
                                {attendanceTrend.isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>{attendanceTrend.isPos ? '+' : '-'}{attendanceTrend.value}%</span>
                            </TactileBadge>
                        </div>

                        <div className="flex flex-col items-center py-4 relative overflow-hidden group">
                            <div className="w-full h-80 relative mt-4">
                                <TactileAreaChart 
                                    data={monthlyIntelligence} 
                                    color="#f59e0b" 
                                    isSmooth={true} 
                                    showHighlight={true}
                                    totalMembers={members.filter(m => m.status === 'Activo').length}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full px-8 pb-4 border-t border-[var(--tactile-border)] pt-6 mt-4">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-1">
                                        PROMEDIO {intelligenceRange === 'month' ? 'MES' : `${intelligenceRange}D`}
                                    </p>
                                    <div className="text-xl font-black text-primary italic">
                                        {monthlyIntelligence.length > 0 
                                            ? Math.round(monthlyIntelligence.reduce((acc, m) => acc + m.value, 0) / monthlyIntelligence.length) 
                                            : 0}%
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-1">PICO MÁXIMO</p>
                                    <div className="text-xl font-black text-emerald-500 italic">
                                        {monthlyIntelligence.length > 0 ? Math.max(...monthlyIntelligence.map(m => m.value)) : 0}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        <TactilePieChart 
                            title="Membresía"
                            data={[
                                { 
                                    label: 'Casados', 
                                    value: members.filter(m => (m.member_group || '').includes('Casado')).length, 
                                    color: '#10b981' 
                                },
                                { 
                                    label: 'Jóvenes', 
                                    value: members.filter(m => (m.member_group || '') === 'Jovenes').length, 
                                    color: '#fbbf24' 
                                },
                                { 
                                    label: 'Solos', 
                                    value: members.filter(m => (m.member_group || '') === 'Solos y Solas').length, 
                                    color: '#8b5cf6' 
                                },
                                { 
                                    label: 'Niños', 
                                    value: members.filter(m => (m.category === 'Niño' || (m.member_group || '').startsWith('Niño'))).length, 
                                    color: '#0ea5e9' 
                                },
                            ]}
                        />
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="Tema Semanal" className="w-full">
                    <div className="space-y-5">
                        <TactileInput
                            label="Título"
                            value={theme.title || ''}
                            onChange={(e: any) => setTheme({ ...theme, title: e.target.value })}
                            icon={Sparkles}
                        />
                        <div className="space-y-1">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">Tipo</label>
                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl shadow-2xl overflow-hidden">
                                {['orthodoxy', 'apostolic_letter'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setTheme({ ...theme, type: type as any })}
                                        className={cn(
                                            "flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                            theme.type === type
                                                ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                                : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        {type === 'orthodoxy' ? 'Ortodoxia' : 'Carta de Apostolado'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    await saveThemeToCloud(theme);
                                    showNotification('Tema de la semana actualizado', 'success');
                                } catch (err) {
                                    showNotification('Error al guardar el tema', 'error');
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            disabled={isSaving}
                            className="tactile-btn tactile-btn-orange w-full h-10 justify-center text-[10px]"
                        >
                            {isSaving ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                            ) : (
                                <Save className="w-3.5 h-3.5 mr-2" />
                            )}
                            {isSaving ? 'GUARDANDO...' : 'ACTUALIZAR TEMA'}
                        </button>
                        <button
                            onClick={() => setActiveTab('contenido')}
                            className="tactile-btn tactile-btn-glass w-full h-10 justify-center text-[9px] border-[var(--tactile-border)]"
                        >
                            VER DETALLES COMPLETOS
                        </button>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
