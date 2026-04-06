'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn, Mail, Church, Flame, Star, Heart, ClipboardCheck, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

import { UserMenu } from './UserMenu';

export function Header() {
    const { currentUser, authSession, signOut, messages, subscribeToMessages, loadCloudMessages, settings } = useAppStore();
    const router = useRouter();

    const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);

    const logoUrl = settings.churchLogoUrl ?? "/lldm_flama_3.svg";

    useEffect(() => {
        if (authSession) {
            loadCloudMessages();
            const unsubscribe = subscribeToMessages();
            return () => unsubscribe();
        }
    }, [authSession, subscribeToMessages, loadCloudMessages]);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-500",
            settings.adminTheme === 'primitivo' 
                ? "border-b border-white/5 bg-black/40 backdrop-blur-2xl px-2" 
                : "border-b border-border bg-background/50 backdrop-blur-xl"
        )}>
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <img
                            src={logoUrl}
                            className={cn(
                                "w-full h-full object-contain transition-all duration-700",
                                settings.adminTheme === 'primitivo' && "saturate-[1.5] brightness-125"
                            )}
                            style={{ 
                                filter: 'brightness(0) invert(84%) sepia(18%) saturate(3040%) hue-rotate(330deg) brightness(103%) contrast(100%) drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))'
                            }}
                            alt="Logo"
                        />
                    </div>
                    <span className={cn(
                        "font-black inline-block text-[15px] sm:text-xl tracking-tighter uppercase italic group-hover:text-primary transition-colors text-foreground",
                        settings.adminTheme === 'primitivo' && "tracking-[-0.05em]"
                    )}>
                        LLDM <span className="text-emerald-500 italic">RODEO v3.6.1</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
                    <Link
                        href="/dashboard"
                        className="transition-colors hover:text-primary text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-black"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/display"
                        className="transition-colors hover:text-primary text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-black"
                    >
                        Display Mode
                    </Link>
                    <Link
                        href="/calendar"
                        className="transition-colors hover:text-primary text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-black"
                    >
                        Schedule
                    </Link>
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Ministro a Cargo' || currentUser?.name?.includes(settings.ministerName || '')) && (
                        <Link
                            href="/dashboard/ministro"
                            className="transition-colors hover:text-primary text-muted-foreground uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                        >
                            Ministro
                        </Link>
                    )}
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Responsable de Asistencia') && (
                        <Link
                            href="/dashboard/monitor"
                            className="transition-colors hover:text-primary text-muted-foreground uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                        >
                            Asistencia
                        </Link>
                    )}
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Dirigente Coro Adultos') && (
                        <Link
                            href="/dashboard/coro"
                            className="transition-colors hover:text-primary text-muted-foreground uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                        >
                            Coro
                        </Link>
                    )}
                    {currentUser?.role === 'Administrador' && (
                        <Link
                            href="/admin"
                            className="transition-colors text-primary uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                        >
                            Admin
                        </Link>
                    )}
                </nav>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-4">
                        {authSession ? (
                            <div className="flex items-center gap-4">
                                {unreadCount > 0 && (
                                    <div
                                        className="relative cursor-pointer group/msg p-2 hover:bg-foreground/5 rounded-xl transition-all"
                                        onClick={() => router.push(currentUser?.role === 'Administrador' ? '/admin#mensajes' : '/')}
                                    >
                                        <Mail className="w-4 h-4 text-primary animate-pulse" />
                                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border border-black group-hover/msg:scale-110 transition-transform">
                                            {unreadCount}
                                        </span>
                                    </div>
                                )}
                                <UserMenu />
                            </div>
                        ) : (
                            <Button
                                onClick={() => router.push('/login')}
                                className="h-9 px-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all"
                            >
                                <LogIn className="h-4 w-4 mr-2" /> Iniciar Sesión
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>

    );
}
