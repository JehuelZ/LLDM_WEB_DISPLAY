'use client';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FervorPulse from '@/components/dashboard/minister/FervorPulse';
import VigilanceRadar from '@/components/dashboard/minister/VigilanceRadar';
import './MinisterStyles.css';

export default function MinisterDashboard() {
    const [activeTab, setActiveTab] = useState<'pulse' | 'radar' | 'agenda' | 'intercession'>('pulse');
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const { members, loadMembersFromCloud, showNotification } = useAppStore();

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }
            await loadMembersFromCloud();
            setIsLoaded(true);
        };
        init();
    }, [router, loadMembersFromCloud]);

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

    const mockStats = {
        totalAttendance: 142,
        totalMembers: 168,
        atRisk: 12,
        newConvert: 5,
        prayersRequested: 8
    };

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
                            value={mockStats.totalAttendance} 
                            total={mockStats.totalMembers} 
                            icon={Heart} 
                            color="#10b981"
                            subtitle="Basado en la asistencia del último servicio de asamblea."
                        />
                        <FervorPulse 
                            title="Almas en Riesgo" 
                            value={mockStats.atRisk} 
                            total={mockStats.totalMembers} 
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

                    <div className="tactile-card min-h-[500px]">
                        {activeTab === 'radar' ? (
                            <VigilanceRadar members={members.slice(0, 10).map(m => ({
                                id: m.id,
                                name: m.name,
                                status: m.status,
                                last_attendance: 'HACE 2 DÍAS',
                                fervor: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high'
                            }))} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                                <Zap className="w-20 h-20 mb-6 animate-pulse" />
                                <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">Módulo en Desarrollo</h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Sincronizando frecuencias espirituales...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Alerts Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="tactile-card bg-emerald-500/[0.02]">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center justify-between">
                            Peticiones Urgentes
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px]">{mockStats.prayersRequested}</span>
                        </h4>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Petición Familiar</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                    </div>
                                    <p className="text-[10px] font-bold leading-relaxed mb-3">Intercesión por salud de pariente del Hno. Zelaya.</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Recibido hace 2h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full h-12 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest mt-8 hover:bg-white/[0.03] transition-all">Ver Todas las Intercesiones</button>
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
