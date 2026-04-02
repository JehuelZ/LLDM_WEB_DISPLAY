'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    Terminal, Bell, Monitor, LogOut, Users, Clock, Palette, 
    Settings as SettingsIcon, User, Layout, Music2, Activity,
    Shield, ChevronLeft, ChevronRight, Target, Camera,
    ChevronDown, MoreHorizontal, Search, User as UserIcon,
    UserSearch, CalendarDays, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LunaDonut from '@/components/ui/LunaDonut';
import { TactileAreaChart, TactileBarChart } from '@/components/ui/Charts';
import PremiumCalendar from '@/components/ui/PremiumCalendar';
import AdminClockWeather from '@/components/admin/AdminClockWeather';

interface LunaAdminProps {
    children?: React.ReactNode;
    propTab?: string;
    isSubpage?: boolean;
}

const LunaAdmin: React.FC<LunaAdminProps> = ({ children, isSubpage }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // CORE STORE DATA
    const { 
        settings, 
        members = [], 
        setSettings,
        saveSettingsToCloud,
        currentUser,
        currentDate,
        setCurrentDate
    } = useAppStore();

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    // NAVIGATION ITEMS
    const navItems = [
        { id: 'dashboard', icon: Layout, label: 'dashboard', color: 'bg-emerald-500' },
        { id: 'miembros', icon: Users, label: 'miembros', color: 'bg-blue-500' },
        { id: 'horarios', icon: Clock, label: 'horarios', color: 'bg-emerald-500' },
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
        <div className="w-full admin-theme-luna animate-in fade-in duration-700">
            {activeTab === 'dashboard' && !isSubpage ? (
                <>
                    {/* KPI ROW */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {[
                            { icon: Users, val: activeMembersCount, lbl: 'miembros activos', sub: `de ${totalMembersCount}` },
                            { icon: Activity, val: '84.2%', lbl: 'fidelidad anual', sub: '+2.1% mes anterior' },
                            { icon: Shield, val: '99.9%', lbl: 'uptime sistema', sub: 'nodo central: ok' },
                            { icon: Target, val: '312', lbl: 'proyección', sub: 'clases activas' },
                        ].map((kpi, i) => (
                            <div key={i} className="p-8 border border-white/[0.02] bg-white/[0.02] group hover:border-white/10 transition-all duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <kpi.icon className="w-4 h-4 text-white/20 group-hover:text-white transition-colors duration-500" />
                                    <div className="w-1 h-1 bg-white/10" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-3xl font-[200] tracking-tighter tabular-nums">{kpi.val}</h4>
                                    <p className="text-[8px] font-[300] tracking-[0.3em] uppercase text-white/30">{kpi.lbl}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* MAIN CHARTS AREA */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="p-10 border border-white/[0.02] bg-white/[0.01]">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-[10px] font-[300] tracking-[0.4em] text-white/40 uppercase">flujo de asistencia semanal</h3>
                                </div>
                                <div className="h-[300px] w-full">
                                    <TactileAreaChart 
                                        data={monthlyStats.map(s => ({ label: s.label, value: s.val }))} 
                                    />
                                </div>
                        </div>
                    </div>

                        <div className="space-y-10">
                            <div className="p-10 border border-white/[0.02] bg-white/[0.01]">
                                <h3 className="text-[10px] font-[300] tracking-[0.4em] text-white/40 uppercase mb-10 text-center">composición de grupo</h3>
                                <div className="h-[250px] flex items-center justify-center">
                                    <LunaDonut 
                                        value={attendancePercentage} 
                                        color="#10b981" 
                                        colorEnd="#059669" 
                                        label="FIDELIDAD" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            )}
        </div>
    );
};

export default LunaAdmin;
