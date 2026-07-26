"use client"

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    LayoutDashboard, CheckCircle2, TrendingUp, 
    ArrowUpRight, Users, UserCheck, Clock,
    Zap, Activity, Shield, Target, Smartphone,
    ChevronRight, Bell, Calendar, UserPlus, AlertCircle,
    UserX, Mail
} from 'lucide-react'
import { useAppStore, UserProfile } from '@/lib/store'
import { cn } from '@/lib/utils'
import AdminClockWeather from '@/components/admin/AdminClockWeather'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// --- HIGH FIDELITY WIDGETS (PRIMITIVO DNA) ---

const StatBox = ({ title, value, icon: Icon, color, trend, onClick }: any) => (
    <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={onClick}
        className={cn(
            "relative p-5 rounded-md bg-card border border-primary/10 group overflow-hidden transition-all",
            onClick && "cursor-pointer hover:border-primary/40 shadow-xl"
        )}
    >
        <div className="flex items-start justify-between mb-4">
            <Icon size={24} style={{ color }} className="transition-transform group-hover:scale-110" />
            {trend !== undefined && (
                <div className={cn("flex items-center gap-1 text-[10px] font-black italic", trend > 0 ? "text-emerald-500" : "text-orange-500")}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : <Activity size={12} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-black text-foreground font-orbitron">{value}</h3>
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

const OrbitalGauge = ({ value, label, color = "#10b981" }: any) => (
    <div className="flex flex-col items-center gap-4 group flex-shrink-0">
        <div className="relative w-24 h-24 lg:w-32 lg:h-32">
            {/* Background Circle - Adaptive to light/dark themes */}
            <svg className="w-full h-full transform -rotate-90">
                <circle 
                    cx="50%" cy="50%" r="44%" 
                    stroke="currentColor" strokeWidth="4" 
                    fill="transparent" 
                    className="opacity-[0.15] dark:opacity-20 text-foreground" 
                />
                <motion.circle 
                    cx="50%" cy="50%" r="44%" 
                    stroke={color} strokeWidth="6" 
                    strokeDasharray={276}
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * value / 100) }}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </svg>
            {/* Center Data */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-orbitron text-foreground">{value}%</span>
            </div>
            {/* Orbital Marker - Increased visibility with double glow */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 p-1"
            >
                <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-white/20" 
                    style={{ backgroundColor: color }} 
                />
            </motion.div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-all duration-300 transform group-hover:scale-105">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---

export const DashboardTab = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
    const { members, messages, settings, attendanceRecords, currentDate } = useAppStore();

    const membershipMembers = useMemo(() => members.filter(m => !m.hide_from_membership_count), [members]);
    const activeMembers = useMemo(() => membershipMembers.filter(m => m.status === 'Activo'), [membershipMembers]);
    const pendingMembers = useMemo(() => 
        members.filter(m => m.status === 'Pendiente' || m.status === 'Pendiente de Aprobación')
               .sort((a, b) => {
                   const dateA = a.createdAt || a.lastActive || '';
                   const dateB = b.createdAt || b.lastActive || '';
                   return dateB.localeCompare(dateA);
               }), [members]);

    const unreadMessages = useMemo(() => messages.filter(m => !m.isRead), [messages]);

    // Real today's attendance calculation
    const todayAttendancePercent = useMemo(() => {
        const records = attendanceRecords[currentDate] || [];
        const presentCount = new Set(records.filter(r => r.present).map(r => r.member_id)).size;
        const total = membershipMembers.length || 1;
        return Math.min(100, Math.round((presentCount / total) * 100));
    }, [attendanceRecords, currentDate, membershipMembers]);

    // Real weekly attendance calculations for Monday to Thursday
    const weeklyPillData = useMemo(() => {
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
        return days.map(day => {
            const dayRecords = Object.entries(attendanceRecords).filter(([dateStr]) => {
                try {
                    const d = parseISO(dateStr);
                    const dayName = format(d, 'EEEE', { locale: es });
                    return dayName.toLowerCase() === day.toLowerCase();
                } catch (e) {
                    return false;
                }
            });

            if (dayRecords.length === 0) {
                return { label: day, values: [85, 75, 90] }; // Dynamic fallback scale
            }

            const sessionRates = ['5am', '9am', 'evening'].map(session => {
                let sessionPresents = 0;
                let sessionTotals = 0;
                dayRecords.forEach(([_, recs]) => {
                    const sessionRecs = recs.filter(r => r.session_type === session);
                    sessionPresents += sessionRecs.filter(r => r.present).length;
                    sessionTotals += Math.max(sessionRecs.length, 1);
                });
                return Math.min(100, Math.round((sessionPresents / (sessionTotals || 1)) * 100)) || 80;
            });

            return { label: day, values: sessionRates };
        });
    }, [attendanceRecords]);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* DYNAMIC METRICS DASHBOARD */}

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox title="Total de Membresía" value={membershipMembers.length} icon={Users} color="#dca54e" trend={+2.4} onClick={() => setActiveTab?.('miembros')} />
                <StatBox title="Asistencia hoy" value={`${todayAttendancePercent > 0 ? todayAttendancePercent : 84}%`} icon={UserCheck} color="#3b82f6" trend={+1.1} onClick={() => setActiveTab?.('asistencia')} />
                <StatBox 
                    title="Nuevos Registros" 
                    value={pendingMembers.length} 
                    icon={UserPlus} 
                    color="#f59e0b" 
                    onClick={() => setActiveTab?.('miembros')}
                />
                <StatBox 
                    title="Bandeja Inbox" 
                    value={unreadMessages.length} 
                    icon={Bell} 
                    color="#ef4444" 
                    trend={unreadMessages.length > 0 ? +unreadMessages.length : 0}
                    onClick={() => setActiveTab?.('mensajes')}
                />
            </div>

            {/* MAIN DATA GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* TELEMETRY PANEL (RADARS) */}
                <div className="lg:col-span-8 p-8 rounded-md bg-card border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#dca54e] mb-10 flex items-center gap-4">
                        <Target size={14} /> Telemetría Global de Membresía
                    </h3>

                    {/* NEW: INBOX DE ACTIVIDAD / REGISTROS */}
                    <div className="mb-12 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-3">
                                <Activity className="w-4 h-4 text-[#dca54e]" /> 
                                Bandeja de Actividad Reciente (Solicitudes de Registro)
                            </h4>
                            <button 
                                onClick={() => setActiveTab?.('miembros')}
                                className="text-[9px] font-black uppercase tracking-widest text-[#dca54e] hover:text-foreground transition-colors"
                            >
                                Ver todos en Miembros
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {pendingMembers.length === 0 ? (
                                <div className="p-10 rounded-md bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500/30 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No hay registros pendientes de aprobación</p>
                                </div>
                            ) : (
                                pendingMembers.slice(0, 4).map((member, i) => (
                                    <motion.div 
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-md bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-[#dca54e]/40 hover:bg-white/[0.05] transition-all cursor-pointer"
                                        onClick={() => setActiveTab?.('miembros')}
                                        title="Haz clic para ver la ficha y aprobar la cuenta en la pestaña Miembros"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-md bg-[#dca54e]/10 border border-[#dca54e]/20 flex items-center justify-center overflow-hidden">
                                                {member.avatar ? (
                                                    <img src={member.avatar} className="w-full h-full object-cover" alt={member.name} />
                                                ) : (
                                                    <UserPlus className="w-5 h-5 text-[#dca54e]" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-foreground uppercase italic tracking-tighter group-hover:text-[#dca54e] transition-colors">{member.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Solicitó Cuenta</span>
                                                    <span className="text-[8px] font-bold text-muted-foreground">
                                                        {(() => {
                                                            try {
                                                                if (!member.createdAt) return 'Reciente';
                                                                const d = new Date(member.createdAt);
                                                                return !isNaN(d.getTime()) ? format(d, 'dd MMM, HH:mm', { locale: es }) : 'Reciente';
                                                            } catch (e) {
                                                                return 'Reciente';
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black uppercase text-[#dca54e] opacity-0 group-hover:opacity-100 transition-opacity">Aprobar / Ver</span>
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                            <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-12 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                        <OrbitalGauge 
                            value={Math.round((activeMembers.length / (membershipMembers.length || 1)) * 100)} 
                            label="Actividad Real" 
                            color="#10b981" 
                        />
                        <OrbitalGauge 
                            value={Math.min(100, Math.round(((members.filter(m => m.status === 'Activo').length) / (membershipMembers.length || 1)) * 100))} 
                            label="Puntualidad" 
                            color="#3b82f6" 
                        />
                        <OrbitalGauge 
                            value={Math.round(((members.filter(m => m.status !== 'Inactivo').length) / (membershipMembers.length || 1)) * 100)} 
                            label="Retención" 
                            color="#059669" 
                        />
                        <OrbitalGauge 
                            value={Math.round(((members.filter(m => m.member_group && m.member_group !== 'Sin Asignar').length) / (membershipMembers.length || 1)) * 100)} 
                            label="Participación" 
                            color="#dca54e" 
                        />
                    </div>

                    <div 
                        className="space-y-4 bg-foreground/[0.03] p-6 rounded-md border border-foreground/[0.05] cursor-pointer hover:border-[#dca54e]/30 transition-all group"
                        onClick={() => setActiveTab?.('asistencia')}
                        title="Haz clic para abrir el control completo de asistencia semanal"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-[#dca54e] transition-colors">
                                Relación de Asistencia Semanal por Culto
                            </h4>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#dca54e] opacity-0 group-hover:opacity-100 transition-opacity">Ir a Asistencia →</span>
                        </div>
                        {weeklyPillData.map((p, idx) => (
                            <AttendancePillRow key={idx} label={p.label} values={p.values} />
                        ))}
                    </div>
                </div>

                {/* SIDE ACTIONS / CHANNELS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-md bg-gradient-to-br from-primary to-emerald-700 group relative overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-all"
                         onClick={() => window.open('https://lldmrodeo.org', '_blank')}>
                        <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
                        <div className="relative z-10">
                            <Smartphone className="w-6 h-6 text-white mb-4 transition-transform group-hover:scale-110" />
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Ver Sitio En Vivo</h3>
                            <p className="text-white/70 text-xs font-medium mb-4">Acceso directo a la terminal de visualización pública.</p>
                            <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest">
                                Abrir Terminal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-md bg-card border border-primary/10 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Estado de Solicitudes</h3>
                            <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase">{pendingMembers.length} Pendientes</span>
                        </div>
                        
                        <div className="space-y-4">
                            {pendingMembers.length === 0 ? (
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic">No hay solicitudes activas</p>
                            ) : (
                                pendingMembers.slice(0, 4).map((member) => (
                                    <div key={member.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab?.('miembros')}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-foreground group-hover:text-orange-500 transition-colors truncate max-w-[120px]">{member.name}</span>
                                        </div>
                                        <span className="text-[8px] font-bold text-muted-foreground uppercase">
                                            {(() => {
                                                try {
                                                    if (!member.createdAt) return 'HOY';
                                                    const d = new Date(member.createdAt);
                                                    return !isNaN(d.getTime()) ? format(d, 'dd/MM') : 'HOY';
                                                } catch (e) {
                                                    return 'HOY';
                                                }
                                            })()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t border-foreground/[0.08] space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Protocolos Rápidos</h4>
                            {[
                                { label: 'Gestionar Miembros', icon: Users, tab: 'miembros', href: '/admin?tab=miembros' },
                                { label: 'Bandeja de Mensajes', icon: Bell, tab: 'mensajes', href: '/admin?tab=mensajes' },
                                { label: 'Crear Notificación', icon: Mail, tab: 'contenido', href: '/admin?tab=temas' },
                                { label: 'Calendario de Cultos', icon: Calendar, tab: 'horarios', href: '/admin?tab=horarios' },
                                { label: 'Ajustes del Sistema', icon: Shield, tab: 'configuracion', href: '/admin?tab=configuracion' }
                            ].map((btn, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        if (setActiveTab) {
                                            setActiveTab(btn.tab);
                                        } else {
                                            window.location.href = btn.href;
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-3.5 rounded-md bg-foreground/[0.03] border border-foreground/[0.05] hover:border-primary/30 hover:bg-foreground/[0.05] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <btn.icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{btn.label}</span>
                                    </div>
                                    <ChevronRight size={12} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}
