"use client"

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    LayoutDashboard, CheckCircle2, TrendingUp, 
    ArrowUpRight, Users, UserCheck, Clock,
    Zap, Activity, Shield, Target, Smartphone,
    ChevronRight, Bell, Calendar
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import AdminClockWeather from '@/components/admin/AdminClockWeather'

// --- HIGH FIDELITY WIDGETS (PRIMITIVO DNA) ---

const StatBox = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-5 rounded-3xl bg-[#0b101e] border border-[#dca54e]/10 group overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={64} style={{ color }} />
        </div>
        <div className="flex items-start justify-between mb-4">
            <div className={cn("p-3 rounded-2xl bg-opacity-10", `bg-[${color}]/10`)} style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
            </div>
            {trend && (
                <div className={cn("flex items-center gap-1 text-[10px] font-black italic", trend > 0 ? "text-emerald-500" : "text-orange-500")}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : <Activity size={12} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-black text-foreground font-orbitron">{value}</h3>
        </div>
    </motion.div>
);

const AttendancePillRow = ({ label, values }: { label: string, values: number[] }) => (
    <div className="flex items-center gap-4 py-2 border-b border-[#dca54e]/5 group hover:bg-white/[0.01] px-2 transition-colors">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground w-20">{label}</span>
        <div className="flex-1 flex gap-1 h-3">
            {values.map((v, i) => (
                <motion.div 
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    className={cn(
                        "h-full rounded-full transition-all",
                        i === 0 ? "bg-[#dca54e]" : i === 1 ? "bg-[#dca54e]/60" : "bg-[#dca54e]/30"
                    )}
                    style={{ filter: `drop-shadow(0 0 5px ${i === 0 ? '#dca54e44' : 'transparent'})` }}
                />
            ))}
        </div>
        <span className="text-[10px] font-black text-[#dca54e] italic min-w-[30px] text-right">{Math.max(...values)}%</span>
    </div>
);

const OrbitalGauge = ({ value, label, color = "#dca54e" }: any) => (
    <div className="flex flex-col items-center gap-4 group">
        <div className="relative w-32 h-32">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                <motion.circle 
                    cx="64" cy="64" r="58" 
                    stroke={color} strokeWidth="4" 
                    strokeDasharray={364}
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 364 - (364 * value / 100) }}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </svg>
            {/* Center Data */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-orbitron text-foreground">{value}%</span>
            </div>
            {/* Orbital Marker */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 p-1"
            >
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" style={{ backgroundColor: color }} />
            </motion.div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---

export const DashboardTab = () => {
    const { members, messages, setActiveTab, settings } = useAppStore();

    const activeMembers = useMemo(() => members.filter(m => m.status === 'Activo'), [members]);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* WELCOME BANNER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-[#dca54e]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#dca54e]">Sistema de Mando LLDM Rodeo</span>
                    </div>
                    <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase font-orbitron">
                        Consola <span className="text-[#dca54e]">Hardware</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-[#0b101e] p-2 rounded-2xl border border-[#dca54e]/10">
                    <AdminClockWeather className="scale-90" />
                </div>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox title="Miembros Totales" value={members.length} icon={Users} color="#dca54e" trend={+2.4} />
                <StatBox title="Asistencia hoy" value="84%" icon={UserCheck} color="#3b82f6" trend={+1.1} />
                <StatBox title="Mensajes" value={messages.length} icon={Bell} color="#ef4444" trend={-0.5} />
                <StatBox title="Sincronización" value="99.9" icon={Activity} color="#10b981" />
            </div>

            {/* MAIN DATA GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* TELEMETRY PANEL (RADARS) */}
                <div className="lg:col-span-8 p-8 rounded-[40px] bg-[#0b101e] border border-[#dca54e]/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#dca54e] animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#dca54e] mb-12 flex items-center gap-4">
                        <Target size={14} /> Telemetría Global de Membresía
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <OrbitalGauge value={Math.round((activeMembers.length / members.length) * 100)} label="Actividad" />
                        <OrbitalGauge value={88} label="Puntualidad" color="#3b82f6" />
                        <OrbitalGauge value={92} label="Retención" color="#10b981" />
                        <OrbitalGauge value={75} label="Participación" color="#10b981" />
                    </div>

                    <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-4">Relación de Asistencia Semanal (Primitivo Scale)</h4>
                        <AttendancePillRow label="Lunes" values={[85, 70, 95]} />
                        <AttendancePillRow label="Martes" values={[92, 85, 88]} />
                        <AttendancePillRow label="Miércoles" values={[78, 65, 82]} />
                        <AttendancePillRow label="Jueves" values={[100, 95, 98]} />
                    </div>
                </div>

                {/* SIDE ACTIONS / CHANNELS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-[35px] bg-gradient-to-br from-[#dca54e] to-[#b88636] group relative overflow-hidden cursor-pointer"
                         onClick={() => window.open('https://lldmrodeo.org', '_blank')}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <div className="relative z-10">
                            <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-md">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Ver Sitio En Vivo</h3>
                            <p className="text-white/70 text-xs font-medium mb-4">Acceso directo a la terminal de visualización pública.</p>
                            <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest">
                                Abrir Terminal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[35px] bg-[#0b101e] border border-[#dca54e]/10 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#dca54e]">Protocolos Rápidos</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Crear Notificación', icon: Bell },
                                { label: 'Gestionar Miembros', icon: Users },
                                { label: 'Calendario de Cultos', icon: Calendar },
                                { label: 'Ajustes del Sistema', icon: Shield }
                            ].map((btn, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#dca54e]/30 hover:bg-white/[0.05] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <btn.icon size={16} className="text-muted-foreground group-hover:text-[#dca54e] transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{btn.label}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}
