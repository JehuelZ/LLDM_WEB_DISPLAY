'use client';

import { useAppStore } from '@/lib/store';
import { LayoutDashboard, Calendar, ClipboardCheck, User, Shield, Music } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MobileNav() {
    const { currentUser, authSession, messages } = useAppStore();
    const pathname = usePathname();

    const unreadMessagesCount = messages.filter(m => !m.isRead && m.targetRole === currentUser.role).length;

    if (!authSession) return null;

    const navItems = [
        {
            label: 'Inicio',
            icon: LayoutDashboard,
            href: '/',
            active: pathname === '/'
        },
        {
            label: 'Agenda',
            icon: Calendar,
            href: '/calendar',
            active: pathname.startsWith('/calendar')
        },
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Responsable de Asistencia' || currentUser.privileges?.includes('monitor') ? [{
            label: 'Asistencia',
            icon: ClipboardCheck,
            href: '/dashboard/monitor',
            active: pathname.startsWith('/dashboard/monitor'),
            color: 'text-emerald-500'
        }] : []),
        ...(currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges?.includes('choir') ? [{
            label: 'Coro',
            icon: Music,
            href: '/dashboard/coro',
            active: pathname.startsWith('/dashboard/coro'),
            color: 'text-secondary'
        }] : []),
        ...(currentUser.role === 'Administrador' ? [{
            label: 'Admin',
            icon: Shield,
            href: '/admin',
            active: pathname.startsWith('/admin'),
            color: 'text-primary'
        }] : []),
        {
            label: 'Perfil',
            icon: User,
            href: '/dashboard#messages',
            active: pathname.includes('messages'),
            badge: unreadMessagesCount > 0
        }
    ];

    // Limit to 5 items max for better look on small screens
    const visibleItems = navItems.slice(0, 5);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 pb-6 pointer-events-none">
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="bg-card/80 backdrop-blur-2xl border border-border/20 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around p-2 pointer-events-auto max-w-md mx-auto ring-1 ring-white/5"
            >
                {visibleItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 relative group",
                            item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {item.active && (
                            <motion.div
                                layoutId="nav-active"
                                className="absolute inset-0 bg-foreground/5 rounded-2xl -z-10 border border-white/5"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform duration-300 group-active:scale-90",
                            item.active ? (item.color || "text-primary") : "text-muted-foreground",
                            item.active && "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                        )} />
                        {('badge' in item && item.badge) && (
                            <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border border-card shadow-lg z-20" />
                        )}
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            item.active ? "opacity-100" : "opacity-60"
                        )}>
                            {item.label}
                        </span>
                        {item.active && (
                            <motion.div
                                layoutId="nav-dot"
                                className="w-1 h-1 rounded-full bg-primary mt-0.5"
                            />
                        )}
                    </Link>
                ))}
            </motion.nav>
        </div>
    );
}
