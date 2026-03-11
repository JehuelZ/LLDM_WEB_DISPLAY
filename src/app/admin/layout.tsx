'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
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
    Menu,
    Activity,
    User,
    Music,
    ClipboardCheck,
    Baby,
    FileText,
    Cloud,
    Lock,
    ArrowRight
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

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

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { settings, currentUser, isLoading, authSession } = useAppStore();
    const router = useRouter();
    const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';

    const isAuthorized = (authSession?.user && currentUser.role === 'Administrador') || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

    if (!isAuthorized && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden w-full">
                {/* Fondo Animado */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 dots-pattern opacity-10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md z-10"
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
                            {currentUser.id === '1' ? (
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
                                        <p className="text-sm font-bold text-foreground">{currentUser.email}</p>
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
                        ID de Intento: {currentUser.id.slice(0, 8)}...
                    </p>
                </motion.div>
            </div>
        );
    }

    const logoUrl = settings.churchLogoUrl || settings.customIconUrl || "/flama-oficial.svg";
    const isDefaultLogo = logoUrl.includes('/flama-oficial.svg');

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-500">
            {/* Sidebar */}
            <aside className={cn(
                "border-r border-border/40 bg-card/50 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out z-50",
                collapsed ? "w-20" : "w-72"
            )}>
                <div className={cn("p-6 flex items-center shrink-0", collapsed ? "justify-center" : "justify-between")}>
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-2 py-1 overflow-hidden whitespace-nowrap">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden p-1.5">
                                <img
                                    src={logoUrl}
                                    alt="Church Logo"
                                    className={cn(
                                        "w-full h-full object-contain",
                                        isDefaultLogo ? "dark:invert invert-0" : "dark:brightness-110"
                                    )}
                                />
                            </div>
                            <h1 className="text-xl font-black text-foreground tracking-tighter uppercase italic">LLDM<span className="text-primary italic">RODEO</span></h1>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg bg-foreground/10 text-muted-foreground transition-colors"
                    >
                        {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className={cn(
                        "px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500",
                        collapsed && "text-center px-0 invisible h-0 py-0"
                    )}>{t.principal}</div>

                    <Link href="/admin?tab=dashboard"
                        onClick={() => {
                            setTimeout(() => {
                                window.dispatchEvent(new Event('popstate'));
                                window.dispatchEvent(new Event('tab-change'));
                            }, 50);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border",
                            (pathname === '/admin' && currentTab === 'dashboard') ? "bg-primary/10 text-primary font-bold border-primary/20 shadow-lg shadow-primary/5" : "bg-foreground/5 text-muted-foreground border-transparent",
                            collapsed && "justify-center px-0"
                        )}>
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.dashboard}</span>}
                    </Link>

                    <Link href="/admin?tab=horarios"
                        onClick={() => {
                            setTimeout(() => {
                                window.dispatchEvent(new Event('popstate'));
                                window.dispatchEvent(new Event('tab-change'));
                            }, 50);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                            currentTab === 'horarios' ? "bg-primary/10 text-primary font-bold border border-primary/20" : "bg-foreground/5 text-muted-foreground",
                            collapsed && "justify-center px-0"
                        )}>
                        <Calendar className="w-5 h-5 group-hover:text-primary transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.horarios}</span>}
                    </Link>

                    <Link href="/admin?tab=contenido"
                        onClick={() => {
                            setTimeout(() => {
                                window.dispatchEvent(new Event('popstate'));
                                window.dispatchEvent(new Event('tab-change'));
                            }, 50);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                            (currentTab === 'contenido' || currentTab === 'temas') ? "bg-secondary/10 text-secondary font-bold border border-secondary/20" : "bg-foreground/5 text-muted-foreground",
                            collapsed && "justify-center px-0"
                        )}>
                        <BookOpen className="w-5 h-5 group-hover:text-secondary transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.temas}</span>}
                    </Link>

                    <div className={cn(
                        "px-4 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500",
                        collapsed && "invisible h-0 py-0"
                    )}>{t.gestion}</div>

                    <Link href="/admin/members" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin/members' ? "bg-accent/10 text-accent font-bold border border-accent/20" : "bg-foreground/5 text-muted-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <Users className="w-5 h-5 group-hover:text-accent transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.miembros}</span>}
                    </Link>

                    <Link href="/admin/reports" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin/reports' ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" : "bg-foreground/5 text-muted-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <FileText className="w-5 h-5 group-hover:text-emerald-400 transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.reportes}</span>}
                    </Link>

                    <Link href="/admin?tab=anuncios"
                        onClick={() => {
                            setTimeout(() => {
                                window.dispatchEvent(new Event('popstate'));
                                window.dispatchEvent(new Event('tab-change'));
                            }, 50);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                            collapsed && "justify-center px-0 bg-foreground/5 text-muted-foreground"
                        )}>
                        <Bell className="w-5 h-5 group-hover:text-yellow-500 transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.anuncios}</span>}
                    </Link>

                    <Link href="/admin/cloud" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin/cloud' ? "bg-primary/10 text-primary font-bold border-primary/20" : "bg-foreground/5 text-muted-foreground border-transparent",
                        collapsed && "justify-center px-0"
                    )}>
                        <Cloud className="w-5 h-5 shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.admin_cloud}</span>}
                    </Link>

                    <div className={cn(
                        "px-4 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2",
                        collapsed && "invisible h-0 py-0"
                    )}>
                        <Activity className="h-3 w-3 text-secondary animate-pulse" /> {t.simulador}
                    </div>

                    <div className="space-y-1">
                        <Link href="/" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <User className="w-4 h-4 text-emerald-500" />
                            {!collapsed && <span>Vista Miembro</span>}
                        </Link>
                        <Link href="/dashboard/coro" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Music className="w-4 h-4 text-secondary" />
                            {!collapsed && <span>Vista Coro</span>}
                        </Link>
                        <Link href="/dashboard/responsable" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                             <Flame className="w-4 h-4 text-primary" />
                            {!collapsed && <span>Vista Responsable</span>}
                        </Link>
                        <Link href="/dashboard/monitor" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                            {!collapsed && <span>Vista Monitor</span>}
                        </Link>
                        <Link href="/dashboard/ninos" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Baby className="w-4 h-4 text-cyan-400" />
                            {!collapsed && <span>Vista Niños</span>}
                        </Link>
                    </div>

                    <div className="mt-auto pt-10">
                        <Link href="/admin?tab=ajustes"
                            onClick={() => {
                                setTimeout(() => {
                                    window.dispatchEvent(new Event('popstate'));
                                    window.dispatchEvent(new Event('tab-change'));
                                }, 50);
                            }}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group border-t border-white/5 mt-auto",
                                collapsed && "justify-center px-0 border-none"
                            )}>
                            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.configuracion}</span>}
                        </Link>
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
                    className={cn("block p-6 border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer", collapsed && "p-4")}
                >
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
                        <div className="w-9 h-9 rounded-full border border-primary/30 p-0.5 shrink-0 overflow-hidden bg-slate-800/50 hover:border-primary transition-colors">
                            <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} className="w-full h-full object-cover rounded-full" alt="Admin" />
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <div className="text-sm font-black text-white leading-none truncate group-hover:text-primary transition-colors">{currentUser.name}</div>
                                <div className="text-[9px] text-primary mt-1 uppercase font-black tracking-widest">{currentUser.role === 'Administrador' ? 'ADMINISTRADOR DEL SISTEMA' : currentUser.role}</div>
                            </div>
                        )}
                    </div>
                </Link>

            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
