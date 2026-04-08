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

    const [realStats, setRealStats] = useState({
        totalAttendance: 0,
        totalMembers: 0,
        atRisk: 0,
        newConvert: 0,
        prayersRequested: 0
    });

    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }
            
            await Promise.all([
                loadMembersFromCloud(),
                loadCloudMessages(),
                loadAllSchedulesFromCloud()
            ]);
            
            const weeklyStats = await loadWeeklyAttendanceStats();
            setAttendanceData(weeklyStats);

            const activeMembers = members.filter(m => m.status === 'Activo' && !m.hide_from_membership_count);
            const atRiskCount = members.filter(m => (m.status === 'Inactivo' || (m.member_group as string) === 'Visitas') && !m.hide_from_membership_count).length;
            const prayerRequests = messages.filter(msg => msg.targetRole === 'Ministro a Cargo' && !msg.isRead).length;

            setRealStats({
                totalAttendance: weeklyStats.length > 0 ? weeklyStats[weeklyStats.length - 1].attended : 0,
                totalMembers: activeMembers.length,
                atRisk: atRiskCount,
                newConvert: members.filter(m => (m.member_group as string) === 'Nuevos' && !m.hide_from_membership_count).length,
                prayersRequested: prayerRequests
            });

            setIsLoaded(true);
        };
        init();
    }, [router, loadMembersFromCloud, loadWeeklyAttendanceStats, loadCloudMessages, loadAllSchedulesFromCloud, messages.length]);

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
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{format(new Date(), 'EEEE, d MMMM', { locale: es })}</span>
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
                                        .slice(0, 40)
                                        .map(m => {
                                        const attendanceRatio = m.stats?.attendance 
                                            ? m.stats.attendance.attended / (m.stats.attendance.total || 1) 
                                            : 0;
                                        
                                        let fervor: 'high' | 'medium' | 'low' = 'medium';
                                        if (m.status !== 'Activo') fervor = 'low';
                                        else if (attendanceRatio >= 0.7) fervor = 'high';
                                        else if (attendanceRatio < 0.3) fervor = 'low';

                                        return {
                                            id: m.id,
                                            name: m.name,
                                            status: m.status,
                                            group: m.member_group || (m.category === 'Varon' ? 'VARONES' : 'HERMANAS'),
                                            last_attendance: m.lastActive && m.lastActive !== 'Ahora' 
                                                ? format(new Date(m.lastActive), 'dd MMM', { locale: es }).toUpperCase()
                                                : 'HOY',
                                            fervor
                                        };
                                    })} />
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
                                                createdAt: format(new Date(msg.createdAt), 'dd MMM', { locale: es })
                                            };
                                        })} 
                                    />
                                )}

                                {activeTab === 'pulse' && (
                                    <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-12">
                                        <Zap className="w-20 h-20 mb-6 animate-pulse" />
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Monitor de Salud en Línea</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-4 text-white">Escaneando censo espiritual en tiempo real...</p>
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
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Recibido {format(new Date(msg.createdAt), 'HH:mm')}</span>
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

                    <div className="tactile-card overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/60">Mapa de Vigilancia</h4>
                            <MapPin className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="aspect-square rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center p-8 relative">
                            <div className="absolute inset-0 bg-emerald-500/5 blur-[80px]" />
                            <Search className="w-10 h-10 mb-4 opacity-10 animate-pulse" />
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Radar Geográfico Desconectado</p>
                            <p className="text-[7px] font-black uppercase opacity-20 mt-2 tracking-widest">En espera de coordenadas de censo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
