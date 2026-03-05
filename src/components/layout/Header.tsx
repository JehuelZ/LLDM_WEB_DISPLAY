'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn, ShieldCheck, Mail, Shield, Church, Cross, Star, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
    const { currentUser, authSession, signOut, messages, subscribeToMessages, loadCloudMessages, settings } = useAppStore();
    const router = useRouter();

    const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);

    const isCustom = settings.churchIcon === 'custom';
    const logoUrl = settings.customIconUrl || settings.churchLogoUrl || "/lldm_rodeo_logo.svg";
    const isDefaultLogo = logoUrl.includes('/lldm_rodeo_logo.svg') || logoUrl.includes('/flama-oficial.svg') || logoUrl.includes('/lldm_aniversario.svg') || logoUrl.includes('/lldm_santa_cena.svg');

    useEffect(() => {
        if (authSession) {
            loadCloudMessages();
            const unsubscribe = subscribeToMessages();
            return () => unsubscribe();
        }
    }, [authSession, subscribeToMessages, loadCloudMessages]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl">
            <div className="container flex h-16 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/10 overflow-hidden group-hover:border-primary/50 transition-all">
                            {isCustom || isDefaultLogo ? (
                                <img
                                    src={logoUrl}
                                    className={cn(
                                        "w-full h-full object-contain p-1.5 transition-transform group-hover:scale-110",
                                        isDefaultLogo ? "dark:invert invert-0" : "dark:brightness-110"
                                    )}
                                    alt="Logo"
                                />
                            ) : (
                                <div className="text-primary group-hover:scale-110 transition-transform">
                                    {(() => {
                                        const icons: Record<string, any> = { shield: Shield, church: Church, cross: Cross, star: Star, heart: Heart };
                                        const Icon = icons[settings.churchIcon] || Shield;
                                        return <Icon className="w-6 h-6" />;
                                    })()}
                                </div>
                            )}
                        </div>
                        <span className="hidden font-black sm:inline-block text-xl tracking-tighter uppercase italic group-hover:text-primary transition-colors text-foreground">
                            LLDM <span className="text-primary italic">RODEO</span>
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
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
                        {(currentUser.role === 'Administrador' || currentUser.name.includes(settings.ministerName || '')) && (
                            <Link
                                href="/dashboard/ministro"
                                className="transition-colors hover:text-primary text-muted-foreground uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                            >
                                <Shield className="w-3 h-3 text-primary" /> Ministro
                            </Link>
                        )}
                        {(currentUser.role === 'Administrador' || process.env.NODE_ENV === 'development') && (
                            <Link
                                href="/admin"
                                className="transition-colors text-primary uppercase tracking-widest text-[10px] font-black flex items-center gap-1"
                            >
                                <ShieldCheck className="w-3 h-3" /> Admin
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
                    <div className="flex items-center gap-4">
                        {authSession ? (
                            <div className="flex items-center gap-4 bg-foreground/5 py-1.5 px-3 rounded-2xl border border-border/10">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary transition-all shadow-lg shadow-primary/10">
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[10px] font-black uppercase text-foreground leading-none">{currentUser.name}</p>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{currentUser.role}</p>
                                    </div>
                                </Link>
                                <div className="w-px h-6 bg-border/20" />

                                {unreadCount > 0 && (
                                    <div className="relative cursor-pointer group/msg" onClick={() => router.push(currentUser.role === 'Administrador' ? '/admin#mensajes' : '/')}>
                                        <Mail className="w-4 h-4 text-primary animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border border-black group-hover/msg:scale-110 transition-transform">
                                            {unreadCount}
                                        </span>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        signOut();
                                        router.push('/login');
                                    }}
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
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
