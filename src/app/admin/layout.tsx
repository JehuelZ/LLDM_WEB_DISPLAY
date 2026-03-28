'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Users,
    Bell,
    Settings,
    Flame,
    Church,
    Cross,
    Star,
    Heart,
    ChevronLeft,
    ChevronRight,
    Menu,
    Activity,
    User,
    Music,
    ClipboardCheck,
    Baby,
    FileText,
    Cloud,
    Lock,
    ArrowRight,
    Sun,
    Moon,
    Contrast,
    RefreshCw,
    CalendarDays,
    ExternalLink
} from "lucide-react";
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import './LunaStyles.css';
import './ClassicStyles.css';
import './PrimitivoStyles.css';
import LunaAdmin from './LunaAdmin';
import TactileAdmin from './TactileAdmin';
import AdminClockWeather from '@/components/admin/AdminClockWeather';
import PremiumCalendar from '@/components/ui/PremiumCalendar';

const ICON_MAP: Record<string, any> = {
    church: Church,
    cross: Cross,
    star: Star,
    heart: Heart,
};

const TRANSLATIONS = {
    es: {
        principal: 'Principal',
        dashboard: 'Dashboard',
        horarios: 'Horarios',
        temas: 'Temas Semanales',
        gestion: 'Gestión',
        miembros: 'Miembros',
        reportes: 'Reportes',
        anuncios: 'Anuncios',
        admin_cloud: 'Admin Nube',
        simulador: 'Simulador de Roles',
        demo_mode: 'Modo Demo',
        configuracion: 'Configuración',
        admin_user: 'Administrador',
        admin_role: 'Panel de Control'
    },
    en: {
        principal: 'Primary',
        dashboard: 'Dashboard',
        horarios: 'Schedules',
        temas: 'Weekly Themes',
        gestion: 'Management',
        miembros: 'Members',
        reportes: 'Reports',
        anuncios: 'Announcements',
        admin_cloud: 'Cloud Admin',
        simulador: 'Role Simulator',
        demo_mode: 'Demo Mode',
        configuracion: 'Settings',
        admin_user: 'Admin User',
        admin_role: 'Minister in Charge'
    }
};

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode
}) {
    const { settings, setSettings, currentUser, isLoading, authSession, saveSettingsToCloud, currentDate, setCurrentDate } = useAppStore();
    const router = useRouter();
    const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';

    // Handle initial theme loading from localStorage for local dev robustness
    useEffect(() => {
        const savedTheme = localStorage.getItem('admin_theme_choice') as any;
        if (savedTheme && savedTheme !== settings.adminTheme) {
            setSettings({ adminTheme: savedTheme });
            setMounted(true);
        } else {
            setMounted(true);
        }
    }, []);

    // Apply theme class to body for global style control (Phase 2)
    useEffect(() => {
        if (!mounted) return;
        
        const themeClass = settings.adminTheme === 'primitivo' ? 'admin-theme-primitivo' : 
                          settings.adminTheme === 'tactile' ? 'admin-theme-tactile' :
                          settings.adminTheme === 'luna' ? 'admin-theme-luna' : 
                          'admin-theme-classic';
        
        // Remove old theme classes
        document.body.classList.remove('admin-theme-primitivo', 'admin-theme-tactile', 'admin-theme-luna', 'admin-theme-classic');
        // Add new theme class
        document.body.classList.add(themeClass);
        
        // Save to localStorage as fallback
        localStorage.setItem('admin_theme_choice', settings.adminTheme || 'classic');

        return () => {
            document.body.classList.remove('admin-theme-primitivo', 'admin-theme-tactile', 'admin-theme-luna', 'admin-theme-classic');
        };
    }, [settings.adminTheme, mounted]);


    const isAuthorized = (authSession?.user && currentUser?.role === 'Administrador') || (mounted && typeof window !== 'undefined' && window.location.hostname === 'localhost');

    // Prevent hydration mismatch by returning a consistent loader or null until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-t-primary border-primary/20 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 animate-pulse">Iniciando Panel...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden w-full">
                {/* Fondo Animado */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 dots-pattern opacity-10" />
                </div>

                <div className="w-full max-w-md z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                    <Card className="glass-card border-white/5 shadow-2xl overflow-hidden backdrop-blur-2xl bg-card/50">
                        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />
                        <CardHeader className="text-center pt-10 pb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/5">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic text-foreground mb-2">
                                Acceso <span className="text-red-500">Restringido</span>
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium px-4">
                                Esta área es exclusiva para administradores autorizados de LLDM RODEO.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-10 px-8">
                            {currentUser?.id === '1' ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 text-center">Debes iniciar sesión con tu cuenta autorizada</p>
                                    <Link href="/login" className="block">
                                        <Button className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 group shadow-xl shadow-primary/20">
                                            Ir al Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Usuario Activo</p>
                                        <p className="text-sm font-bold text-foreground">{currentUser?.email}</p>
                                        <p className="text-[9px] text-red-400 font-black uppercase mt-2 italic">Sin permisos de administrador</p>
                                    </div>
                                    <Link href="/" className="block">
                                        <Button variant="outline" className="w-full h-12 border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
                                            Volver al Inicio
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        ID de Intento: {currentUser?.id.slice(0, 8)}...
                    </p>
                </motion.div>
                </div>
            </div>
        );
    }

    // Force flama-oficial for branding regardless of settings, unless a real custom icon is intentionally set
    const logoUrl = settings.churchLogoUrl || "/flama-oficial.svg";



    const themeClass = (settings.adminTheme as any) === 'primitivo' ? 'admin-theme-primitivo' : 
                      (settings.adminTheme as any) === 'tactile' ? 'admin-theme-tactile' :
                      (settings.adminTheme as any) === 'luna' ? 'admin-theme-luna' : 
                      'admin-theme-classic';


    return (
        <div className={cn("min-h-screen bg-background text-foreground flex transition-colors duration-500 overflow-hidden", themeClass)}>
            {/* Sidebar */}
            <aside 
                id="admin-sidebar-master"
                className={cn(
                "relative h-screen flex flex-col transition-all duration-300 z-50 admin-sidebar-v2 overflow-visible border-r border-border/10",
                collapsed ? "w-24" : "w-64",
                themeClass === 'admin-theme-primitivo' 
                    ? "admin-sidebar-isolation-primitivo" 
                    : "bg-white/[0.02] border-r border-white/5"
            )}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3.5 top-20 w-7 h-7 bg-[#f59e0b] rounded-full flex items-center justify-center z-[60] text-white hover:scale-110 transition-transform border-none active:scale-95 shadow-lg"
                    title={collapsed ? "Expandir" : "Contraer"}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <div className={cn("p-6 flex items-center transition-all", collapsed ? "justify-center px-2" : "gap-3")}>
                    <div className="w-11 h-11 flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                        <img 
                            src={logoUrl} 
                            className="w-full h-full object-contain" 
                            style={{ 
                                filter: 'brightness(0) saturate(100%) invert(84%) sepia(18%) saturate(3040%) hue-rotate(330deg) brightness(103%) contrast(100%) drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))'
                            }} 
                            alt="Logo" 
                        />
                    </div>
                    {!collapsed && (
                        <h1 className={cn(
                            "text-[14px] font-black tracking-[0.2em] transition-all duration-500 admin-sidebar-logo-text",
                            themeClass === 'admin-theme-primitivo' ? "uppercase italic" : "lowercase"
                        )}>
                            <span className="logo-lldm">lldm</span> <span className="logo-rodeo">rodeo</span>
                        </h1>
                    )}
                </div>

                <nav className={cn("flex-1 py-6 flex flex-col items-stretch overflow-y-auto scrollbar-hide", collapsed ? "px-2" : "px-4")}>
                    <div className={cn(
                        "px-4 py-3 text-[11px] font-bold lowercase tracking-[0.2em]",
                        settings.adminTheme === 'primitivo' ? "text-muted-foreground" : "text-white/30",
                        collapsed && "text-center px-0 invisible h-0 py-0"
                    )}>{t.principal}</div>

                    <Link href="/admin?tab=dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                            (pathname === '/admin' && currentTab === 'dashboard') 
                                ? "bg-tactile-orange-pill text-white font-bold rounded-full" 
                                : settings.adminTheme === 'primitivo' 
                                    ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" 
                                    : "text-white/40 hover:text-white bg-transparent",
                            collapsed && "justify-center px-0"
                        )}>
                        {(pathname === '/admin' && currentTab === 'dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <LayoutDashboard className={cn("w-5 h-5 shrink-0 transition-colors", (pathname === '/admin' && currentTab === 'dashboard') ? "text-white" : "")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.dashboard}</span>}
                    </Link>

                    <Link href="/admin?tab=horarios"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                            currentTab === 'horarios' 
                                ? "bg-tactile-orange-pill text-white font-bold rounded-full" 
                                : settings.adminTheme === 'primitivo' 
                                    ? "text-muted-foreground hover:text-foreground" 
                                    : "text-white/40 hover:text-white bg-transparent",
                            collapsed && "justify-center px-0"
                        )}>
                        {currentTab === 'horarios' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <Calendar className={cn("w-5 h-5 transition-colors shrink-0", currentTab === 'horarios' ? "text-white" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "group-hover:text-white")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.horarios}</span>}
                    </Link>

                    <Link href="/admin?tab=contenido"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                            (currentTab === 'contenido' || currentTab === 'temas') 
                                ? "bg-tactile-orange-pill text-tactile-orange font-bold rounded-full" 
                                : settings.adminTheme === 'primitivo' 
                                    ? "text-muted-foreground hover:text-foreground" 
                                    : "text-white/40 hover:text-white bg-transparent",
                            collapsed && "justify-center px-0"
                        )}>
                        {(currentTab === 'contenido' || currentTab === 'temas') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <BookOpen className={cn("w-5 h-5 transition-colors shrink-0", (currentTab === 'contenido' || currentTab === 'temas') ? "text-tactile-orange" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "group-hover:text-tactile-orange")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.temas}</span>}
                    </Link>

                    <div className={cn(
                        "px-4 py-6 text-[11px] font-bold lowercase tracking-[0.2em]",
                        settings.adminTheme === 'primitivo' ? "text-muted-foreground" : "text-white/30",
                        collapsed && "invisible h-0 py-0"
                    )}>{t.gestion}</div>

                    <Link href="/admin/members" className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                        pathname === '/admin/members' 
                            ? "bg-tactile-orange-pill text-tactile-orange font-bold rounded-full" 
                            : settings.adminTheme === 'primitivo' 
                                ? "text-muted-foreground hover:text-foreground" 
                                : "text-white/40 hover:text-white bg-transparent",
                        collapsed && "justify-center px-0"
                    )}>
                        {pathname === '/admin/members' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <Users className={cn("w-5 h-5 transition-colors shrink-0", pathname === '/admin/members' ? "text-tactile-orange" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "group-hover:text-tactile-orange")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.miembros}</span>}
                    </Link>

                    <Link href="/admin/reports" className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                        pathname === '/admin/reports' 
                            ? "bg-tactile-orange-pill text-tactile-orange font-bold rounded-full" 
                            : settings.adminTheme === 'primitivo' 
                                ? "text-muted-foreground hover:text-foreground" 
                                : "text-white/40 hover:text-white bg-transparent",
                        collapsed && "justify-center px-0"
                    )}>
                        {pathname === '/admin/reports' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <FileText className={cn("w-5 h-5 transition-colors shrink-0", pathname === '/admin/reports' ? "text-tactile-orange" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "group-hover:text-tactile-orange")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.reportes}</span>}
                    </Link>

                    <Link href="/admin/cloud" className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                        pathname === '/admin/cloud' 
                            ? "bg-tactile-orange-pill text-tactile-orange font-bold rounded-full" 
                            : settings.adminTheme === 'primitivo' 
                                ? "text-muted-foreground hover:text-foreground" 
                                : "text-white/40 hover:text-white bg-transparent",
                        collapsed && "justify-center px-0"
                    )}>
                        {pathname === '/admin/cloud' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 active-indicator-orange rounded-r-full" />}
                        <Cloud className={cn("w-5 h-5 transition-colors shrink-0", pathname === '/admin/cloud' ? "text-tactile-orange" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "")} />
                        {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap">{t.admin_cloud}</span>}
                    </Link>

                    <div className={cn(
                        "px-4 py-6 text-[11px] font-bold lowercase tracking-[0.2em] flex items-center gap-2",
                        settings.adminTheme === 'primitivo' ? "text-muted-foreground" : "text-white/30",
                        collapsed && "invisible h-0 py-0"
                    )}>
                        <Activity className="h-3 w-3 text-[#f59e0b] animate-pulse" /> {t.simulador}
                    </div>

                    <div className="space-y-0.5">
                        <Link href="/" className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold bg-transparent transition-all shadow-none",
                            settings.adminTheme === 'primitivo' ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white",
                            collapsed && "justify-center px-0"
                        )}>
                            <User className="w-5 h-5 text-emerald-500 shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Vista Miembro</span>}
                        </Link>
                        <Link href="/dashboard/coro" className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold bg-transparent transition-all shadow-none",
                            settings.adminTheme === 'primitivo' ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white",
                            collapsed && "justify-center px-0"
                        )}>
                            <Music className="w-5 h-5 text-[#f59e0b] shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Vista Coro</span>}
                        </Link>
                        <Link href="/dashboard/responsable" className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold bg-transparent transition-all shadow-none",
                            settings.adminTheme === 'primitivo' ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white",
                            collapsed && "justify-center px-0"
                        )}>
                             <Flame className="w-5 h-5 text-tactile-orange shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Vista Responsable</span>}
                        </Link>
                        <Link href="/dashboard/monitor" className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold bg-transparent transition-all shadow-none",
                            settings.adminTheme === 'primitivo' ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white",
                            collapsed && "justify-center px-0"
                        )}>
                            <ClipboardCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Vista Monitor</span>}
                        </Link>
                        <Link href="/dashboard/ninos" className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold bg-transparent transition-all shadow-none",
                            settings.adminTheme === 'primitivo' ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white",
                            collapsed && "justify-center px-0"
                        )}>
                            <Baby className="w-5 h-5 text-cyan-400 shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Vista Niños</span>}
                        </Link>
                    </div>

                    <div className={cn("mt-auto pt-6 px-4 space-y-4", collapsed && "px-0")}>
                        <Link href="/admin?tab=configuracion"
                                className={cn(
                                "flex items-center gap-3 px-3 py-2.5 transition-all group relative shadow-none",
                                currentTab === 'configuracion' 
                                    ? "bg-tactile-orange-pill text-white font-semibold rounded-full" 
                                    : settings.adminTheme === 'primitivo' 
                                        ? "text-muted-foreground hover:text-foreground" 
                                        : "text-white/40 hover:text-white bg-transparent",
                                collapsed && "justify-center px-0"
                            )}>
                            {currentTab === 'configuracion' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/2 bg-slate-400 rounded-r-full" />}
                            <Settings className={cn("w-5 h-5 group-hover:rotate-45 transition-transform duration-500 shrink-0 shadow-none", currentTab === 'configuracion' ? "" : settings.adminTheme === 'primitivo' ? "text-muted-foreground group-hover:text-foreground" : "")} />
                            {!collapsed && <span className="text-[13px] font-semibold overflow-hidden whitespace-nowrap shadow-none">{t.configuracion}</span>}
                        </Link>

                        {/* Theme Switcher - Divided Icon Pill (Alair Style) */}
                        <div className={cn(
                            "transition-all duration-500 shadow-none border-none",
                            collapsed ? "flex justify-center" : "bg-white/[0.08] p-1 rounded-full flex items-center gap-0 w-fit mx-auto"
                        )}>
                            {collapsed ? (
                                <button
                                    onClick={() => saveSettingsToCloud({ themeMode: settings.themeMode === 'light' ? 'dark' : 'light' })}
                                    className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:text-primary transition-all shadow-none group/theme"
                                    title={settings.themeMode === 'light' ? "Cambiar a Oscuro" : "Cambiar a Claro"}
                                >
                                    <Contrast className="w-5 h-5 transition-transform group-hover/theme:rotate-180 duration-500 shadow-none" />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => saveSettingsToCloud({ themeMode: 'light' })}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center rounded-full transition-all group/btn shadow-none border-none",
                                            settings.themeMode === 'light' 
                                                ? "bg-[#2b3043] text-white" 
                                                : "text-white/40 hover:text-white"
                                        )}
                                        title="Modo Claro"
                                    >
                                        <Sun className={cn("w-4 h-4 shrink-0 shadow-none", settings.themeMode === 'light' ? "text-white" : "text-white/40")} />
                                    </button>
                                    
                                    {/* Subtle Vertical Divider */}
                                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                    
                                    <button
                                        onClick={() => saveSettingsToCloud({ themeMode: 'dark' })}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center rounded-full transition-all group/btn shadow-none border-none",
                                            settings.themeMode === 'dark' 
                                                ? "bg-[#2b3043] text-white" 
                                                : "text-white/40 hover:text-white"
                                        )}
                                        title="Modo Oscuro"
                                    >
                                        <Moon className={cn("w-4 h-4 shrink-0 shadow-none", settings.themeMode === 'dark' ? "text-white" : "text-white/40")} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <Link
                    href="/admin?tab=perfil"
                    onClick={() => {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('popstate'));
                            window.dispatchEvent(new Event('tab-change'));
                        }, 100);
                    }}
                    className={cn("block px-4 py-3 transition-colors cursor-pointer bg-transparent shadow-none border-none", collapsed ? "p-3" : "mt-2")}
                >
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-1")}>
                        <div className="w-9 h-9 shrink-0 overflow-hidden bg-transparent shadow-none border-none">
                            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`} className="w-full h-full object-cover rounded-full" alt="Admin" />
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <div className="text-[13px] font-semibold text-white leading-none truncate group-hover:text-[#f59e0b] transition-colors shadow-none">{currentUser?.name}</div>
                                <div className="text-[11px] text-white/30 mt-1.5 uppercase font-bold tracking-[0.15em] truncate shadow-none">{currentUser?.role === 'Administrador' ? 'SISTEMA ADMIN' : currentUser?.role}</div>
                            </div>
                        )}
                    </div>
                </Link>

            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-background relative transition-all duration-300">
                <header className={cn(
                    "h-20 px-8 flex items-center justify-between z-30 shrink-0",
                    themeClass === 'admin-theme-primitivo' ? "bg-[#0a0a0a]/50 backdrop-blur-xl border-b border-white/5" : "bg-white/5 border-b border-white/5"
                )}>
                    {/* Identity + Breadcrumb (Pizarra) */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 leading-none">
                                Bienvenido, <span className="text-foreground">{currentUser?.name.split(' ')[0] || 'Admin'}</span>
                            </h2>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1.5 opacity-60">
                                Panel de Control Digital - LLDM Rodeo
                            </p>
                        </div>
                        
                        <div className="w-[1px] h-8 bg-white/5 mx-2" />

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 leading-none">Pizarra</span>
                            <span className="text-[12px] font-black uppercase tracking-tighter text-foreground mt-1.5">
                                {currentTab === 'dashboard' ? 'Principal' : currentTab}
                            </span>
                        </div>
                    </div>

                    {/* Global Widgets & Tools */}
                    <div className="flex items-center gap-6">
                        <div className="w-[1px] h-8 bg-white/5" />
                        
                        {/* Clock/Weather */}
                        <AdminClockWeather compact showLocation={false} className="border-none bg-transparent shadow-none px-0" />
                        
                        <div className="w-[1px] h-8 bg-white/5" />

                        {/* Quick Tools */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => (document.getElementById('global-sync-btn') as HTMLElement)?.click()}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all text-white/40 hover:text-primary group"
                                title="Sincronizar Datos"
                            >
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                            </button>

                            {/* Global Calendar */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className="h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 tabular-nums hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <CalendarDays className="w-3 h-3" />
                                    {format(parseISO(currentDate), "ddd d MMM", { locale: es })}
                                </button>
                                
                                <AnimatePresence>
                                    {isCalendarOpen && (
                                        <div className="fixed top-24 right-8 z-[100] w-[340px]">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                                            >
                                                <PremiumCalendar 
                                                    selectedDate={currentDate}
                                                    onDateSelect={(date) => {
                                                        setCurrentDate(date);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                    theme={settings.adminTheme === 'luna' ? 'luna' : 'primitivo'}
                                                />
                                            </motion.div>
                                            <div 
                                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]" 
                                                onClick={() => setIsCalendarOpen(false)}
                                            />
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link href="/display" target="_blank">
                                <button className="h-10 px-6 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group">
                                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Pizarra</span>
                                </button>
                            </Link>
                        </div>
                        
                        <div className="w-[1px] h-8 bg-white/5" />

                        {/* User Profile Mini */}
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none opacity-60">ADMINISTRADOR</span>
                                <span className="text-xs font-bold text-foreground mt-1">{currentUser?.name?.split(' ')[0]}</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1">
                                <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`} className="w-full h-full object-cover rounded-lg" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area - Minimized Padding */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 overflow-y-auto">
                    {(settings.adminTheme as any) === 'luna' ? (
                        <LunaAdmin propTab={currentTab} isSubpage={pathname !== '/admin'}>
                            {children}
                        </LunaAdmin>
                    ) : (settings.adminTheme as any) === 'tactile' ? (
                        <TactileAdmin propTab={currentTab} isSubpage={pathname !== '/admin'}>
                            {children}
                        </TactileAdmin>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-t-primary border-primary/20 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Cargando Administrador...</p>
                </div>
            </div>
        }>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    );
}
