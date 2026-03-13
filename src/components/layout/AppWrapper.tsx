
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useIsPhone } from '@/hooks/useIsPhone';
import { MobileNav } from './MobileNav';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const { calendarStyles, settings, setAuthSession, syncUserWithCloud, notification, hideNotification } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const isPhone = useIsPhone();

    useEffect(() => {
        setMounted(true);

        // Escuchar cambios de autenticación (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setAuthSession(session);
                if (session?.user) {
                    // Sincronizar perfil del usuario autenticado
                    await syncUserWithCloud(session.user.id);
                }
            }
        );

        // Obtener la sesión actual al montar
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthSession(session);
            if (session?.user) {
                syncUserWithCloud(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, [setAuthSession, syncUserWithCloud]);

    useEffect(() => {
        if (mounted) {
            const root = window.document.documentElement;
            root.classList.remove('light-theme', 'dark-theme', 'is-phone');
            root.classList.add(settings.themeMode === 'light' ? 'light-theme' : 'dark-theme');
            if (isPhone) root.classList.add('is-phone');
            root.setAttribute('data-theme', settings.themeMode);
        }
    }, [settings.themeMode, mounted, isPhone]);

    if (!mounted) {
        return <>{children}</>;
    }

    const fontFamily = calendarStyles.fontFamily;
    const fontVar = fontFamily === 'sora' ? 'var(--font-sora)' : fontFamily === 'inter' ? 'var(--font-inter)' : 'var(--font-outfit)';

    return (
        <div
            style={{ fontFamily: `${fontVar}, sans-serif` }}
            className="min-h-screen transition-colors duration-500 bg-background text-foreground"
        >
            {children}
            <MobileNav />

            {/* Global Premium Notification Toast - Redesigned for Center Display */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-40%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-60%' }}
                        className={cn(
                            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex items-center gap-10 p-12 rounded-[4.5rem] border shadow-[0_0_200px_rgba(0,0,0,0.8)] backdrop-blur-[120px] min-w-[580px] max-w-[95vw] overflow-hidden",
                            notification.type === 'success' && "bg-[#0A0A0A]/80 border-amber-400/30 text-white shadow-amber-400/20",
                            notification.type === 'error' && "bg-[#0A0A0A]/80 border-red-500/30 text-white shadow-red-500/20",
                            notification.type === 'warning' && "bg-[#0A0A0A]/80 border-orange-500/30 text-white shadow-orange-500/20",
                            notification.type === 'info' && "bg-[#0A0A0A]/80 border-primary/30 text-white shadow-primary/20"
                        )}
                    >
                        {/* Interactive Background Elements */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <div className={cn(
                                "absolute -top-1/2 -left-1/2 w-full h-full blur-[100px] rounded-full",
                                notification.type === 'success' ? "bg-amber-400" :
                                notification.type === 'error' ? "bg-red-500" :
                                notification.type === 'warning' ? "bg-orange-500" : "bg-primary"
                            )} />
                        </div>

                        <div className={cn(
                            "w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-2 border-white/10 ring-8 ring-white/[0.03]",
                            notification.type === 'success' && "bg-amber-400 text-black shadow-amber-400/50",
                            notification.type === 'error' && "bg-red-500 text-white",
                            notification.type === 'warning' && "bg-orange-500 text-white",
                            notification.type === 'info' && "bg-primary text-black"
                        )}>
                            {notification.type === 'success' && <CheckCircle className="w-12 h-12" strokeWidth={3} />}
                            {notification.type === 'error' && <XCircle className="w-12 h-12" strokeWidth={3} />}
                            {notification.type === 'warning' && <AlertCircle className="w-12 h-12" strokeWidth={3} />}
                            {notification.type === 'info' && <Info className="w-12 h-12" strokeWidth={3} />}
                        </div>

                        <div className="flex-1 space-y-2 relative z-10">
                            <p className={cn(
                                "text-[12px] font-black uppercase tracking-[0.6em] mb-1.5",
                                notification.type === 'success' ? "text-amber-400" :
                                notification.type === 'error' ? "text-red-400" :
                                notification.type === 'warning' ? "text-orange-400" : "text-primary"
                            )}>
                                {notification.type === 'success' ? 'ÉXITO' : 
                                 notification.type === 'error' ? 'ERROR' : 
                                 notification.type === 'warning' ? 'AVISO' : 'NOTIFICACIÓN'}
                            </p>
                            <h2 className="text-4xl font-black italic tracking-tighter leading-[0.9] text-white brightness-125">
                                {notification.message.replace(/^[✅⚠️❌]\s*/, '')}
                            </h2>
                            <p className="text-xs font-bold text-white/40 tracking-widest uppercase mt-4">Operación finalizada correctamente</p>
                        </div>

                        <button 
                            onClick={hideNotification} 
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group shadow-lg"
                        >
                            <X className="w-6 h-6 text-white/40 group-hover:text-white group-hover:scale-110 transition-all" />
                        </button>

                        {/* Bottom Accent Loader Effect */}
                        <div className={cn(
                            "absolute bottom-0 left-0 right-0 h-1.5 opacity-60",
                            notification.type === 'success' ? "bg-amber-400" :
                            notification.type === 'error' ? "bg-red-500" :
                            notification.type === 'warning' ? "bg-orange-500" : "bg-primary"
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
