'use client';

export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    Users, 
    Calendar, 
    Activity, 
    Bell, 
    Search, 
    MessageSquare, 
    Phone,
    Thermometer,
    Heart,
    Zap,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import FervorPulse from '@/components/dashboard/minister/FervorPulse';
import VigilanceRadar from '@/components/dashboard/minister/VigilanceRadar';
import AgendaSantidad from '@/components/dashboard/minister/AgendaSantidad';
import SoulIntercession from '@/components/dashboard/minister/SoulIntercession';
import './MinisterStyles.css';

export default function MinisterDashboard() {
    const [activeTab, setActiveTab] = useState<'pulse' | 'radar' | 'agenda' | 'intercession'>('pulse');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const { 
        members, 
        loadMembersFromCloud, 
        loadWeeklyAttendanceStats,
        loadCloudMessages,
        loadAllSchedulesFromCloud,
        monthlySchedule,
        messages,
        showNotification 
    } = useAppStore();

    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    const safeFormatDate = (dateStr: any, fmt: string = 'dd MMM') => {
        if (!dateStr || dateStr === 'Hoy' || dateStr === 'Ahora') return 'HOY';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'OFFLINE';
            return format(d, fmt, { locale: es }).toUpperCase();
        } catch {
            return 'OFFLINE';
        }
    };

    const realStats = React.useMemo(() => {
        const activeMembers = members.filter(m => m.status === 'Activo' && !m.hide_from_membership_count);
        const atRiskCount = members.filter(m => (m.status === 'Inactivo' || (m.member_group as string) === 'Visitas') && !m.hide_from_membership_count).length;
        const prayerRequests = messages.filter(msg => msg.targetRole === 'Ministro a Cargo' && !msg.isRead).length;

        // Fallback strategy: If real-time attendance table is empty, use the historical average from member stats
        let totalAttendance = 0;
        if (attendanceData.length > 0) {
            totalAttendance = attendanceData[attendanceData.length - 1].attended;
        } else if (activeMembers.length > 0) {
            const globalAvg = activeMembers.reduce((acc, m) => {
                const att = m.stats?.attendance;
                return acc + (att && att.total > 0 ? (att.attended / att.total) : 0);
            }, 0) / activeMembers.length;
            totalAttendance = Math.round(globalAvg * activeMembers.length);
        }

        return {
            totalAttendance,
            totalMembers: activeMembers.length || 0,
            atRisk: atRiskCount || 0,
            newConvert: members.filter(m => (m.member_group as string) === 'Nuevos' && !m.hide_from_membership_count).length || 0,
            prayersRequested: prayerRequests || 0
        };
    }, [members, messages, attendanceData]);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            
            await Promise.all([
                loadMembersFromCloud(),
                loadCloudMessages(),
                loadAllSchedulesFromCloud()
            ]);
            
            const weeklyStats = await loadWeeklyAttendanceStats();
            if (weeklyStats) setAttendanceData(weeklyStats);
            setIsLoaded(true);
        };
        init();
    }, [router, loadMembersFromCloud, loadWeeklyAttendanceStats, loadCloudMessages, loadAllSchedulesFromCloud]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative">
                    <div className="w-32 h-32 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                    <Shield className="absolute inset-0 m-auto w-10 h-10 text-emerald-500 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="minister-root no-scrollbar overflow-x-hidden">
            {/* --- HEADER RADAR --- */}
            <div className="flex flex-col mb-12">
                <div className="flex flex-wrap items-center justify-between gap-8 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-4">
                            <Shield className="w-full h-full text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-1">
                                Minister <span className="text-emerald-500">Console</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Vigilancia Espiritual v4.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">● System Live</span>
                            <span suppressHydrationWarning className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                                {isLoaded ? format(new Date(), 'EEEE, d MMMM', { locale: es }) : '...'}
                            </span>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/[0.06] transition-all relative">
                            <Bell className="w-5 h-5 text-white/40" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-ruby-500 rounded-full border-2 border-[#050505]" />
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="disjointed-line" />
            </div>

            {/* --- MAIN DASHBOARD GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                
                {/* Spiritual Pulse Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FervorPulse 
                            title="Fervor de Oración" 
                            value={realStats.totalAttendance} 
                            total={realStats.totalMembers} 
                            icon={Heart} 
                            color="#10b981"
                            subtitle="Basado en la asistencia del último servicio de asamblea."
                        />
                        <FervorPulse 
                            title="Almas en Riesgo" 
                            value={realStats.atRisk} 
                            total={realStats.totalMembers} 
                            icon={Activity} 
                            color="#ef4444"
                            unit="CRÍT"
                            subtitle="Hermanos ausentes por más de 3 servicios seguidos."
                        />
                    </div>

                    {/* Navigation Tabs - Tactile Style */}
                    <div className="flex flex-wrap gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] w-fit">
                        {[
                            { id: 'pulse', label: 'Monitor de Salud', icon: Zap },
                            { id: 'radar', label: 'Rastreo de Almas', icon: Users },
                            { id: 'agenda', label: 'Rol de Santidad', icon: Calendar },
                            { id: 'intercession', label: 'Intercesión', icon: MessageSquare }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-8 h-14 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                                    activeTab === t.id 
                                        ? "bg-white/10 text-white border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.4)]" 
                                        : "text-white/20 hover:text-white/40"
                                )}
                            >
                                <t.icon className={cn("w-4 h-4", activeTab === t.id ? "text-emerald-500" : "text-white/10")} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="tactile-card min-h-[600px] flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1"
                            >
                                {activeTab === 'radar' && (
                                    <VigilanceRadar members={members
                                        .filter(m => !m.hide_from_attendance && !m.hide_from_membership_count)
                                        .map(m => {
                                            const att = m.stats?.attendance;
                                            const attendanceRatio = att && att.total > 0 
                                                ? att.attended / att.total 
                                                : 0;
                                            
                                            let fervor: 'high' | 'medium' | 'low' = 'medium';
                                            if (m.status !== 'Activo') fervor = 'low';
                                            else if (attendanceRatio >= 0.8) fervor = 'high';
                                            else if (attendanceRatio < 0.45) fervor = 'low';

                                            return {
                                                id: m.id,
                                                name: m.name,
                                                status: m.status,
                                                group: m.member_group || (m.category === 'Varon' ? 'VARONES' : 'HERMANAS'),
                                                last_attendance: safeFormatDate(m.lastActive),
                                                fervor,
                                                ratio: attendanceRatio // Internal use for sorting
                                            };
                                        })
                                        .sort((a, b) => {
                                            // Priority: low fervor first
                                            if (a.fervor === 'low' && b.fervor !== 'low') return -1;
                                            if (a.fervor !== 'low' && b.fervor === 'low') return 1;
                                            // Then by attendance ratio (ascending)
                                            return (a as any).ratio - (b as any).ratio;
                                        })
                                    } />
                                )}
                                
                                {activeTab === 'agenda' && (
                                    <AgendaSantidad 
                                        schedule={Array.from({ length: 7 }).map((_, i) => {
                                            const d = addDays(new Date(), i - 1);
                                            const dateStr = format(d, 'yyyy-MM-dd');
                                            const daySched = monthlySchedule[dateStr];
                                            
                                            const getMemberName = (id: string | null) => {
                                                if (!id) return 'POR ASIGNAR';
                                                const m = members.find(mem => mem.id === id);
                                                return m ? m.name.split(' ')[0] : 'OFFLINE';
                                            };

                                            return {
                                                date: d,
                                                slots: {
                                                    '5am': { 
                                                        time: daySched?.slots?.['5am']?.time || '05:00 AM', 
                                                        leaderName: getMemberName(daySched?.slots?.['5am']?.leaderId || null), 
                                                        type: daySched?.slots?.['5am']?.customLabel || 'ORACIÓN', 
                                                        language: daySched?.slots?.['5am']?.language || 'ES' 
                                                    },
                                                    '9am': { 
                                                        time: daySched?.slots?.['9am']?.time || '09:00 AM', 
                                                        leaderName: getMemberName(daySched?.slots?.['9am']?.doctrineLeaderId || null), 
                                                        type: daySched?.slots?.['9am']?.customLabel || 'DOCTRINA', 
                                                        language: daySched?.slots?.['9am']?.language || 'ES' 
                                                    },
                                                    'evening': { 
                                                        time: daySched?.slots?.evening?.time || '07:00 PM', 
                                                        leaderName: daySched?.slots?.evening?.leaderIds?.[0] ? getMemberName(daySched.slots.evening.leaderIds[0]) : 'POR ASIGNAR', 
                                                        type: daySched?.slots?.evening?.type || 'SERVICIO', 
                                                        language: daySched?.slots?.evening?.language || 'ES' 
                                                    }
                                                }
                                            };
                                        })} 
                                    />
                                )}

                                {activeTab === 'intercession' && (
                                    <SoulIntercession requests={messages
                                        .filter(msg => {
                                            const sender = members.find(m => m.id === msg.senderId);
                                            const isRestricted = sender?.hide_from_attendance || sender?.hide_from_membership_count;
                                            return msg.targetRole === 'Ministro a Cargo' && !isRestricted;
                                        })
                                        .map(msg => {
                                            const sender = members.find(m => m.id === msg.senderId);
                                            return {
                                                id: msg.id,
                                                memberName: msg.senderName || 'Anónimo',
                                                group: sender?.member_group || (sender?.category === 'Varon' ? 'VARÓN' : 'CONGREGACIÓN'),
                                                content: msg.content,
                                                status: msg.isRead ? 'answered' : (msg.subject?.toLowerCase().includes('urgent') ? 'urgent' : 'regular'),
                                                category: (msg.subject || 'Intercesión') as any,
                                                createdAt: safeFormatDate(msg.createdAt)
                                            };
                                        })} 
                                    />
                                )}

                                {activeTab === 'pulse' && (
                                    <div className="flex flex-col h-full gap-8 p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                                                <Users className="w-8 h-8 text-emerald-500 mb-4" />
                                                <span className="text-3xl font-black italic">{realStats.totalMembers}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2">Censo Activo</span>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                                                <Activity className="w-8 h-8 text-ruby-500 mb-4" />
                                                <span className="text-3xl font-black italic">{realStats.atRisk}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2">En Vigilancia</span>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                                                <Zap className="w-8 h-8 text-blue-500 mb-4" />
                                                <span className="text-3xl font-black italic">{realStats.newConvert}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2">Nuevos Ingresos</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="w-24 h-24 rounded-full border border-emerald-500/20 border-t-emerald-500 animate-spin mb-8" />
                                            <h3 className="text-xl font-black italic uppercase italic tracking-tighter">Motor de Inteligencia Espiritual</h3>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] mt-4 opacity-40">Procesando tendencias de oración y fervor...</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Alerts Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="tactile-card bg-emerald-500/[0.02]">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center justify-between">
                            Peticiones Urgentes
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px]">{realStats.prayersRequested}</span>
                        </h4>
                        <div className="space-y-4">
                            {messages
                                .filter(msg => msg.targetRole === 'Ministro a Cargo' && !msg.isRead)
                                .slice(0, 3)
                                .map(msg => (
                                    <div key={msg.id} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{msg.senderName || 'MIEMBRO'}</span>
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                        </div>
                                        <p className="text-[10px] font-bold leading-relaxed mb-3 line-clamp-2">{msg.content}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Recibido {safeFormatDate(msg.createdAt, 'HH:mm')}</span>
                                        </div>
                                    </div>
                                ))}
                            {realStats.prayersRequested === 0 && (
                                <div className="py-12 text-center opacity-20 border border-white/5 border-dashed rounded-3xl">
                                    <p className="text-[9px] font-black uppercase tracking-widest">Sin peticiones pendientes</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => setActiveTab('intercession')}
                            className="w-full h-12 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest mt-8 hover:bg-white/[0.03] transition-all"
                        >
                            Ver Buzón de Intercesión
                        </button>
                    </div>

                     <div className="tactile-card overflow-hidden min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/60">Mapa de Vigilancia</h4>
                            <MapPin className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 relative flex items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5 overflow-hidden group">
                            {/* Radar Circles */}
                            <div className="absolute w-[300px] h-[300px] border border-emerald-500/10 rounded-full animate-ping opacity-20" />
                            <div className="absolute w-[200px] h-[200px] border border-emerald-500/20 rounded-full" />
                            <div className="absolute w-[100px] h-[100px] border border-emerald-500/30 rounded-full" />
                            <div className="absolute w-full h-px bg-white/5" />
                            <div className="absolute h-full w-px bg-white/5" />
                            
                            {/* Radar Scanline */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 origin-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ width: '50%', right: '50%' }}
                            />

                            {/* Member Dots */}
                            {members.filter(m => !m.hide_from_attendance).slice(0, 15).map((m, i) => {
                                const angle = (i * 360 / 15) * (Math.PI / 180);
                                const radius = 40 + Math.random() * 80;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                const isAtRisk = m.status !== 'Activo';

                                return (
                                    <motion.div
                                        key={m.id}
                                        className={cn(
                                            "absolute w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                                            isAtRisk ? "text-ruby-500" : "text-emerald-500"
                                        )}
                                        style={{ x, y }}
                                        animate={{ 
                                            opacity: [0.4, 1, 0.4],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                            duration: 2 + Math.random() * 2, 
                                            repeat: Infinity,
                                            delay: Math.random() * 2
                                        }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap text-[6px] font-black uppercase tracking-widest text-white">
                                            {m.name.split(' ')[0]}
                                        </div>
                                    </motion.div>
                                );
                            })}
                            
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                <p className="text-[7px] font-black uppercase opacity-20 tracking-[0.5em] animate-pulse">Scanning Sectors...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
