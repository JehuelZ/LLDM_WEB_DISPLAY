
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

            {/* Global Premium Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                        className={cn(
                            "fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-4 px-6 py-4 rounded-[2rem] border shadow-2xl backdrop-blur-2xl min-w-[320px] max-w-[90vw]",
                            notification.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10",
                            notification.type === 'error' && "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10",
                            notification.type === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-500/10",
                            notification.type === 'info' && "bg-primary/10 border-primary/20 text-primary shadow-primary/10"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                            notification.type === 'success' && "bg-emerald-500/20",
                            notification.type === 'error' && "bg-red-500/20",
                            notification.type === 'warning' && "bg-amber-500/20",
                            notification.type === 'info' && "bg-primary/20"
                        )}>
                            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                            {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                            {notification.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">
                                {notification.type === 'success' ? 'Éxito' : 
                                 notification.type === 'error' ? 'Error' : 
                                 notification.type === 'warning' ? 'Aviso' : 'Información'}
                            </p>
                            <p className="text-sm font-bold italic leading-tight">{notification.message.replace(/^[✅⚠️❌]\s*/, '')}</p>
                        </div>
                        <button 
                            onClick={hideNotification} 
                            className="ml-2 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors opacity-40 hover:opacity-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
