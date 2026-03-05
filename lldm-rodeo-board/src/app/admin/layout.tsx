'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Users,
    Bell,
    Settings,
    Shield,
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
    Cloud
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

const ICON_MAP = {
    shield: Shield,
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
        admin_user: 'Admin Usuario',
        admin_role: 'Administrador'
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
        admin_role: 'Administrator'
    }
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { settings, setCurrentUser } = useAppStore();
    const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isCustom = settings.churchIcon === 'custom' && settings.customIconUrl;
    const ChurchIcon = ICON_MAP[settings.churchIcon as keyof typeof ICON_MAP] || Shield;

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
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden">
                                {isCustom ? (
                                    <img src={settings.customIconUrl} alt="Church Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <ChurchIcon className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">LLDM<span className="text-primary italic">RODEO</span></h1>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg bg-foreground/10 text-muted-foreground text-foreground transition-colors"
                    >
                        {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className={cn(
                        "px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500",
                        collapsed && "text-center px-0 invisible h-0 py-0"
                    )}>{t.principal}</div>

                    <Link href="/admin" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border",
                        pathname === '/admin' ? "bg-primary/10 text-primary font-bold border-primary/20" : "bg-foreground/5 text-muted-foreground text-foreground border-transparent",
                        collapsed && "justify-center px-0"
                    )}>
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.dashboard}</span>}
                    </Link>

                    <Link href="/admin#horarios" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin' ? "bg-foreground/5 text-muted-foreground text-foreground" : "bg-foreground/5 text-muted-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <Calendar className="w-5 h-5 group-hover:text-primary transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.horarios}</span>}
                    </Link>

                    <Link href="/admin#temas" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
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
                        pathname === '/admin/members' ? "bg-accent/10 text-accent font-bold border border-accent/20" : "bg-foreground/5 text-muted-foreground text-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <Users className="w-5 h-5 group-hover:text-accent transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.miembros}</span>}
                    </Link>

                    <Link href="/admin/reports" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin/reports' ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" : "bg-foreground/5 text-muted-foreground text-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <FileText className="w-5 h-5 group-hover:text-emerald-400 transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.reportes}</span>}
                    </Link>

                    <Link href="/admin" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        collapsed && "justify-center px-0 bg-foreground/5 text-muted-foreground text-foreground"
                    )}>
                        <Bell className="w-5 h-5 group-hover:text-yellow-500 transition-colors shrink-0" />
                        {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.anuncios}</span>}
                    </Link>

                    <Link href="/admin/cloud" className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        pathname === '/admin/cloud' ? "bg-primary/10 text-primary font-bold border-primary/20" : "bg-foreground/5 text-muted-foreground text-foreground border-transparent",
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
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground text-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <User className="w-4 h-4 text-emerald-500" />
                            {!collapsed && <span>Vista Miembro</span>}
                        </Link>
                        <Link href="/dashboard/coro" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground text-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Music className="w-4 h-4 text-secondary" />
                            {!collapsed && <span>Vista Coro</span>}
                        </Link>
                        <Link href="/dashboard/responsable" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground text-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Shield className="w-4 h-4 text-primary" />
                            {!collapsed && <span>Vista Responsable</span>}
                        </Link>
                        <Link href="/dashboard/monitor" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground text-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                            {!collapsed && <span>Vista Monitor</span>}
                        </Link>
                        <Link href="/dashboard/ninos" className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs bg-foreground/5 text-muted-foreground text-foreground transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Baby className="w-4 h-4 text-cyan-400" />
                            {!collapsed && <span>Vista Niños</span>}
                        </Link>
                    </div>

                    {!collapsed && (
                        <div className="mt-8 px-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">{t.demo_mode}</p>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setCurrentUser({
                                        id: '10',
                                        name: 'Samuelito Rojas Jr.',
                                        email: 'samuelito.jr@lldm.org',
                                        phone: '555-KIDS',
                                        avatar: 'https://images.unsplash.com/photo-1503919919749-645b3419ee53?w=200&h=200&fit=crop',
                                        category: 'Niño',
                                        member_group: 'Niños',
                                        role: 'Miembro',
                                        gender: 'Varon',
                                        status: 'Activo',
                                        lastActive: 'Hoy',
                                        stats: { attendance: { attended: 12, total: 12 }, participation: { led: 4, total: 4 }, punctuality: 100 },
                                        medals: 12,
                                        parentName: 'Samuel Rojas',
                                        nextPrivilege: 'Participación Especial',
                                        privileges: []
                                    });
                                }}
                                className="w-full justify-start gap-3 text-xs bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/20 rounded-xl"
                            >
                                <Baby className="w-4 h-4" />
                                <span>Ver como Samuelito</span>
                            </Button>
                        </div>
                    )}

                    <div className="mt-auto pt-10">
                        <Link href="/admin#configuracion" className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group border-t border-white/5 mt-auto",
                            collapsed && "justify-center px-0 border-none"
                        )}>
                            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 shrink-0" />
                            {!collapsed && <span className="overflow-hidden whitespace-nowrap">{t.configuracion}</span>}
                        </Link>
                    </div>
                </nav>

                <div className={cn("p-6 border-t border-white/5", collapsed && "p-4")}>
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 shrink-0" />
                        {!collapsed && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <div className="text-sm font-bold text-white leading-none">{t.admin_user}</div>
                                <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{t.admin_role}</div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
