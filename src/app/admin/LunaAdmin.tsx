'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    Terminal, Bell, Monitor, LogOut, Users, Clock, Palette, 
    Settings as SettingsIcon, User, Layout, Music2, Activity,
    Shield, ChevronLeft, ChevronRight, Target, Camera,
    ChevronDown, MoreHorizontal, Search, User as UserIcon,
    UserSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LunaDonut from '@/components/ui/LunaDonut';

interface LunaAdminProps {
    children?: React.ReactNode;
    propTab?: string;
}

const LunaAdmin: React.FC<LunaAdminProps> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // CORE STORE DATA
    const { 
        settings, 
        members = [], 
        setSettings,
        saveSettingsToCloud,
        currentUser
    } = useAppStore();

    // DERIVED STATS
    const activeMembersCount = members?.filter(m => m.status === 'Activo').length || 0;
    const totalMembersCount = members?.length || 0;
    const attendancePercentage = totalMembersCount > 0 ? (activeMembersCount / totalMembersCount) * 100 : 0;

    // NAVIGATION SYNC
    const activeTab = searchParams.get('tab') || 'dashboard';

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tabId);
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // NAVIGATION ITEMS
    const navItems = [
        { id: 'dashboard', icon: Layout, label: 'dashboard', color: 'bg-emerald-500' },
        { id: 'miembros', icon: Users, label: 'miembros', color: 'bg-blue-500' },
        { id: 'horarios', icon: Clock, label: 'horarios', color: 'bg-amber-500' },
        { id: 'contenido', icon: Monitor, label: 'contenido', color: 'bg-purple-500' },
        { id: 'coros', icon: Music2, label: 'coros', color: 'bg-pink-500' },
        { id: 'configuracion', icon: SettingsIcon, label: 'configuracion', color: 'bg-slate-500' },
        { id: 'perfil', icon: User, label: 'perfil', color: 'bg-white' },
    ];

    const monthlyStats = [
        { label: 'ENE', val: 85 }, { label: 'FEB', val: 78 }, { label: 'MAR', val: 92 },
        { label: 'ABR', val: 88 }, { label: 'MAY', val: 82 }, { label: 'JUN', val: 95 },
        { label: 'JUL', val: 89 }, { label: 'AGO', val: 84 }, { label: 'SEP', val: 91 },
        { label: 'OCT', val: 87 }, { label: 'NOV', val: 85 }, { label: 'DIC', val: 93 }
    ];

    return (
        <div className="min-h-screen bg-[#0a0b10] text-white flex font-inter admin-theme-luna overflow-hidden">
            {/* SIDEBAR - KINETIC SHELL */}
            <aside 
                className={cn(
                    "relative border-r border-white/5 bg-[#0d0e14] transition-all duration-700 ease-in-out group z-50 flex flex-col",
                    sidebarOpen ? "w-80" : "w-24"
                )}
            >
                {/* BRAND LOGO */}
                <div className="h-24 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
                    <div className="w-8 h-8 bg-emerald-500 rounded-none transform rotate-45 flex-shrink-0" />
                    <div className={cn(
                        "ml-6 transition-all duration-500 whitespace-nowrap",
                        sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                        <h1 className="text-xl font-[300] tracking-[0.2em] ">LUNA</h1>
                        <p className="text-[8px] font-[300] tracking-[0.5em] text-white/30 ">OBSERVATORY</p>
                    </div>
                </div>

                {/* NAV CORE */}
                <nav className="flex-1 py-12 px-6 space-y-3">
                    {navItems.map((item) => {
                        const active = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={cn(
                                    "w-full flex items-center h-14 transition-all duration-300 relative group/item rounded-none",
                                    active ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                                )}
                            >
                                {active && (
                                    <motion.div 
                                        layoutId="activePill"
                                        className="absolute left-0 w-1 h-6 bg-emerald-500" 
                                    />
                                )}
                                <div className={cn(
                                    "flex items-center justify-center transition-all duration-500",
                                    sidebarOpen ? "px-6" : "w-full"
                                )}>
                                    <item.icon className={cn(
                                        "w-4 h-4 transition-colors duration-500",
                                        active ? "text-emerald-400" : "text-white/20 group-hover/item:text-white/60"
                                    )} />
                                    {sidebarOpen && (
                                        <span className={cn(
                                            "ml-6 text-[10px] font-[300] tracking-[0.2em] uppercase transition-colors",
                                            active ? "text-white" : "text-white/30 group-hover/item:text-white/60"
                                        )}>
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* STATUS FOOTER */}
                <div className="p-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        {sidebarOpen && <span className="text-[8px] font-[300] tracking-[0.4em] text-white/20 ">SYSTEM LIVE</span>}
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full h-12 border border-white/5 flex items-center justify-center hover:bg-white/[0.02] transition-all"
                    >
                        <Terminal className="w-3 h-3 text-white/20" />
                    </button>
                </div>
            </aside>

            {/* MAIN STAGE */}
            <main className="flex-1 overflow-y-auto bg-[#0a0b10] relative">
                {/* HEADER - TACTICAL OVERLAY */}
                <div className="h-24 px-12 lg:px-16 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0b10]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-12">
                        <div className="space-y-1">
                            <h2 className="text-[10px] font-[300] tracking-[0.5em] text-white/30 uppercase ">{activeTab}</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-[300] tracking-widest text-white/60 tabular-nums">
                                    {format(currentTime, 'HH:mm:ss')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-white/5">
                            <button
                                onClick={() => saveSettingsToCloud({ adminTheme: 'primitivo' })}
                                className="text-[9px] font-[300] tracking-[0.4em] text-[#fbbf24] border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-2 hover:bg-[#fbbf24]/10 transition-all uppercase"
                            >
                                ACTIVAR PRIMITIVO
                            </button>
                            <div className="text-right">
                                <p className="text-[8px] font-[300] tracking-widest text-white/20 ">CONEXIÓN</p>
                                <p className="text-[10px] font-[300] tracking-widest text-emerald-400 ">ESTABLE</p>
                            </div>
                            <Activity className="w-4 h-4 text-emerald-500/40" />
                        </div>
                        <button className="relative w-10 h-10 flex items-center justify-center border border-white/5 hover:bg-white/5 transition-all">
                            <Bell className="w-4 h-4 text-white/30" />
                            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500" />
                        </button>
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center grayscale">
                            <User className="w-4 h-4 text-white/20" />
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="w-full px-6 lg:px-10 py-10 space-y-10">
                    {activeTab === 'dashboard' ? (
                        <div className="space-y-10 animate-in fade-in duration-1000">
                            {/* KPI ROW */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {[
                                    { icon: Users, val: activeMembersCount, lbl: 'miembros activos', sub: `de ${totalMembersCount}`, acc: '#ffffff' },
                                    { icon: Activity, val: '84.2%', lbl: 'fidelidad anual', sub: '+2.1% mes anterior', acc: '#10b981' },
                                    { icon: Shield, val: '99.9%', lbl: 'uptime sistema', sub: 'nodo central: ok', acc: '#3b82f6' },
                                    { icon: Target, val: '312', lbl: 'proyección', sub: 'clases activas', acc: '#f59e0b' },
                                ].map((kpi, i) => (
                                    <div key={i} className="p-8 border border-white/[0.04] bg-[#0d0e14] group hover:border-white/10 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-6">
                                            <kpi.icon className="w-4 h-4 text-white/20 group-hover:text-white transition-colors duration-500" />
                                            <div className="w-1 h-1 bg-white/10" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-[300] tracking-tight tabular-nums ">{kpi.val}</div>
                                            <div className="text-[8px] font-[300] tracking-[0.3em] uppercase text-white/20 ">{kpi.lbl}</div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/[0.04] text-[8px] font-[300] tracking-widest text-emerald-400/40 uppercase">
                                            {kpi.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* MAIN CONSOLE */}
                            <div className="p-10 border border-white/[0.04] bg-[#0d0e14]">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                                    <div className="lg:col-span-3 space-y-10">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-[300] tracking-[0.2em] ">TENDENCIA SEMANAL</h3>
                                                <p className="text-[8px] font-[300] tracking-[0.5em] text-white/20 ">MÉTRICAS DE ASISTENCIA GLOBAL</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500" />
                                                    <span className="text-[8px] tracking-widest text-white/30 ">ACTUAL</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 border border-white/20" />
                                                    <span className="text-[8px] tracking-widest text-white/30 ">PROMEDIO</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CHART AREA */}
                                        <div className="h-64 flex items-end gap-2 relative">
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-px bg-white/[0.02]" />)}
                                            </div>
                                            <div className="flex-1 flex items-end justify-between px-4 mt-8 h-full relative group">
                                                <svg className="w-full h-full absolute inset-0 overflow-visible">
                                                    <defs>
                                                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {monthlyStats && (
                                                        <>
                                                            <polyline 
                                                                fill="url(#lineGrad)" 
                                                                points={monthlyStats.map((s, i) => `${(i / (monthlyStats.length-1)) * 100}%,${100 - s.val}%`).join(' ') + ` 100,100 0,100`}
                                                                className="transition-all duration-1000"
                                                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                                                            />
                                                            <polyline 
                                                                fill="none" 
                                                                stroke="#10b981" 
                                                                strokeWidth="1.5" 
                                                                strokeLinecap="round" 
                                                                points={monthlyStats.map((s, i) => `${(i / (monthlyStats.length-1)) * 100}%,${100 - s.val}%`).join(' ')}
                                                                className="transition-all duration-1000"
                                                            />
                                                            <polyline 
                                                                fill="none" 
                                                                stroke="#ffffff" 
                                                                strokeWidth="1" 
                                                                strokeLinecap="round" 
                                                                strokeDasharray="4 4" 
                                                                style={{ opacity: 0.2 }} 
                                                            />
                                                        </>
                                                    )}
                                                </svg>
                                                <div className="flex justify-between w-full mt-10">
                                                    {monthlyStats.map(s => <span key={s.label} className="text-[8px] font-[300] text-white/20 tracking-widest ">{s.label}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DENSITY DONUT */}
                                    <div className="lg:pl-4 flex flex-col justify-between">
                                        <LunaDonut value={attendancePercentage} color="#34d399" colorEnd="#10b981" label="densidad" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {children}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LunaAdmin;
