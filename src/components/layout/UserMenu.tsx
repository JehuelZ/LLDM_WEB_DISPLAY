'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    User,
    Settings,
    Shield,
    LayoutDashboard,
    Bell,
    ChevronDown,
    Activity,
    Edit2,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function UserMenu() {
    const { currentUser, signOut } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        {
            label: 'Mi Perfil',
            icon: User,
            href: '/dashboard/profile',
            description: 'Ver y editar tus datos'
        },
        {
            label: 'Mensajes',
            icon: Bell,
            href: currentUser.role === 'Administrador' ? '/admin#mensajes' : '/#mensajes',
            description: 'Buzón de notificaciones'
        },
        {
            label: 'Mi Actividad',
            icon: Activity,
            href: '/dashboard',
            description: 'Estadísticas y reportes'
        }
    ];

    const privilegeItems = [
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Responsable de Asistencia' || currentUser.privileges?.includes('monitor') || currentUser.privileges?.includes('admin') ? [{
            label: 'Pasar Asistencia',
            icon: LayoutDashboard,
            href: '/dashboard/monitor',
            description: 'Control de ingreso oficial',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10'
        }] : []),
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges?.includes('choir') || currentUser.privileges?.includes('admin') ? [{
            label: 'Gestión de Coro',
            icon: Settings,
            href: '/dashboard/coro',
            description: 'Ensayos y uniformes',
            color: 'text-secondary',
            bgColor: 'bg-secondary/10'
        }] : []),
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Ministro a Cargo' || currentUser.privileges?.includes('admin') ? [{
            label: 'Panel de Ministro',
            icon: Shield,
            href: '/dashboard/ministro',
            description: 'Visión general de la iglesia',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
        }] : []),
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Encargado de Jóvenes' || currentUser.privileges?.includes('youth_leader') || currentUser.privileges?.includes('admin') ? [{
            label: 'Gestión de Jóvenes',
            icon: Users,
            href: '/dashboard/youth',
            description: 'Supervisión juvenil',
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-400/10'
        }] : [])
    ];

    const adminItems = [
        {
            label: 'Panel Administrativo',
            icon: Shield,
            href: '/admin',
            active: currentUser.role === 'Administrador'
        }
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 p-1 pr-3 rounded-full transition-all duration-300",
                    isOpen ? "bg-primary/20 ring-2 ring-primary/30 shadow-lg shadow-primary/10" : "hover:bg-foreground/5"
                )}
            >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 shadow-sm relative group bg-foreground/5 flex items-center justify-center">
                    {currentUser.avatar && !currentUser.avatar.includes('unsplash.com/photo-1507003211169-0a1dd7228f2d') ? (
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-[10px] font-black text-primary uppercase italic">
                            {currentUser.name.charAt(0)}
                        </span>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ChevronDown className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black uppercase text-foreground leading-none">{currentUser.name}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{currentUser.role}</p>
                </div>
                <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute right-0 mt-3 w-72 rounded-3xl bg-card/80 backdrop-blur-2xl border border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
                    >
                        {/* Header Profile Info */}
                        <div className="p-5 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-b border-border/10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-primary/30 shadow-inner bg-foreground/5 flex items-center justify-center">
                                    {currentUser.avatar && !currentUser.avatar.includes('unsplash.com/photo-1507003211169-0a1dd7228f2d') ? (
                                        <img src={currentUser.avatar} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <span className="text-xl font-black text-primary uppercase italic">
                                            {currentUser.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-foreground uppercase italic leading-tight">{currentUser.name}</h4>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{currentUser.role}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] text-emerald-500 font-black uppercase">En Línea</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-foreground/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/10 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase italic tracking-tight">{item.label}</p>
                                        <p className="text-[9px] text-muted-foreground font-medium">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Privilege Items */}
                        {privilegeItems.length > 0 && (
                            <div className="p-2 border-t border-border/10">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3 mb-2 mt-1">Acciones por Privilegio</p>
                                <div className="space-y-1">
                                    {privilegeItems.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-foreground/5 transition-all group"
                                        >
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-border/10 group-hover:scale-110 transition-all", item.bgColor)}>
                                                <item.icon className={cn("w-4 h-4 transition-colors", item.color)} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-foreground uppercase italic tracking-tight">{item.label}</p>
                                                <p className="text-[9px] text-muted-foreground font-medium tracking-tight">{item.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Section */}
                        {currentUser.role === 'Administrador' && (
                            <div className="p-2 border-t border-border/10">
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                        <Shield className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-primary uppercase italic tracking-tight">Administración</p>
                                        <p className="text-[9px] text-primary/70 font-medium tracking-tight">Gestionar Iglesia</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="p-2 bg-foreground/[0.02]">
                            <button
                                onClick={() => {
                                    signOut();
                                    router.push('/login');
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/10 group-hover:bg-red-500/10 transition-all">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black uppercase italic tracking-tight">Cerrar Sesión</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
