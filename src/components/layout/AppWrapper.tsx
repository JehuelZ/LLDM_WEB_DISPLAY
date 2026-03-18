
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

        // --- AUTH & SYNC ---
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setAuthSession(session);
                if (session?.user) {
                    await syncUserWithCloud(session.user.id);
                }
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthSession(session);
            if (session?.user) {
                syncUserWithCloud(session.user.id);
            }
        });

        // --- ROUTE GUARD (Client-side) ---
        // Protege las rutas administrativas de usuarios no autorizados
        const checkAdminAccess = async () => {
            if (typeof window === 'undefined') return;
            
            const path = window.location.pathname;
            if (path.startsWith('/admin')) {
                const { data: { session } } = await supabase.auth.getSession();
                
                // Si no hay sesión, al login
                if (!session) {
                    window.location.href = '/login?returnTo=' + encodeURIComponent(path);
                    return;
                }
                
                // Si hay sesión, verificar que el perfil sea Administrador
                // (Usamos una consulta directa para mayor seguridad que el estado local demorado)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('auth_user_id', session.user.id)
                    .single();
                
                if (profile?.role !== 'Administrador' && profile?.role !== 'Ministro a Cargo') {
                    console.warn("Acceso denegado a admin: Usuario no tiene rol de Administrador");
                    window.location.href = '/?error=access-denied';
                }
            }
        };

        checkAdminAccess();

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

    const fontFamily = settings.fontMain ?? 'Outfit';
    
    // Mapping for pre-loaded Next.js fonts (para mayor performance con las base)
    const nextFontVarMap: Record<string, string> = {
        'outfit': 'var(--font-outfit)',
        'sora': 'var(--font-sora)',
        'inter': 'var(--font-inter)',
        'montserrat': 'var(--font-montserrat)',
        'orbitron': 'var(--font-orbitron)',
    };

    // Mapping to real Google Font names for dynamic loading
    const googleFontNameMap: Record<string, string> = {
        'poppins': 'Poppins',
        'lexend': 'Lexend',
        'black-ops': 'Black Ops One',
        'syne': 'Syne',
        'playfair': 'Playfair Display',
        'lora': 'Lora',
    };

    const isNextFont = !!nextFontVarMap[fontFamily];

    useEffect(() => {
        if (!isNextFont && fontFamily) {
            // Get the proper Google Font name
            const realName = googleFontNameMap[fontFamily] || fontFamily;
            const fontNameForUrl = realName.replace(/\s+/g, '+');
            const linkId = `google-font-dynamic-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
            
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@400;500;600;700;800;900&display=swap`;
                document.head.appendChild(link);
            }
        }
    }, [fontFamily, isNextFont]);

    // Construct final font family for CSS
    const realFontName = googleFontNameMap[fontFamily] || fontFamily;
    const finalFontFamily = isNextFont ? nextFontVarMap[fontFamily] : `"${realFontName}"`;

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <div
            style={{ fontFamily: `${finalFontFamily}, sans-serif` }}
            className="min-h-screen transition-colors duration-500 bg-background text-foreground"
        >
            {children}
            <MobileNav />

            {/* Global Premium Notification Toast - Re-designed: Square Glassmorphism */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
                        className={cn(
                            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]",
                            "flex flex-col items-center text-center p-8 rounded-[2.5rem]",
                            "border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]",
                            "backdrop-blur-[64px] bg-black/40 min-w-[320px] max-w-[420px] overflow-hidden",
                            notification.type === 'success' && "border-amber-400/20 shadow-amber-400/5",
                            notification.type === 'error' && "border-red-500/20 shadow-red-500/5"
                        )}
                    >
                        {/* Interactive Shine Effect */}
                        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none rotate-12" />

                        {/* Dynamic Logo/Icon Section */}
                        <div className="relative mb-6">
                            <div className={cn(
                                "w-24 h-24 rounded-3xl flex items-center justify-center relative overflow-hidden bg-white/[0.03] border border-white/5",
                                notification.type === 'success' ? "shadow-[0_0_40px_rgba(251,191,36,0.1)]" : "shadow-[0_0_40px_rgba(239,68,68,0.1)]"
                             )}>
                                <img 
                                    src={settings.churchLogoUrl ?? "/flama-oficial.svg"} 
                                    className={cn(
                                        "w-14 h-14 object-contain brightness-0 invert opacity-60",
                                        notification.type === 'success' && "sepia-[1] saturate-[10000%] hue-rotate-[0deg] transition-all"
                                    )}
                                    alt="Logo"
                                />
                                {/* Internal Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            </div>
                            
                            {/* Small Status Badge */}
                            <div className={cn(
                                "absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center shadow-lg",
                                notification.type === 'success' ? "bg-amber-400 text-black" : "bg-red-500 text-white"
                            )}>
                                {notification.type === 'success' ? <CheckCircle className="w-5 h-5" strokeWidth={3} /> : <XCircle className="w-5 h-5" />}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3 relative z-10">
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-1",
                                notification.type === 'success' ? "text-amber-400" : "text-red-400"
                            )}>
                                {notification.type === 'success' ? 'SISTEMA LLDM' : 'ALTA PRIORIDAD'}
                            </p>
                            <h2 className="text-xl font-black italic tracking-tight text-white brightness-125 leading-tight">
                                {notification.message.replace(/^[✅⚠️❌]\s*/, '')}
                            </h2>
                            <p className="text-[9px] font-bold text-white/30 tracking-widest uppercase pb-2">
                                Operación finalizada satisfactoriamente
                            </p>
                        </div>

                        {/* Close Button / Understanding link */}
                        <button 
                            onClick={hideNotification} 
                            className="mt-6 w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 transition-all hover:text-white group relative overflow-hidden"
                        >
                            <span className="relative z-10 group-hover:scale-105 transition-transform inline-block">ENTENDIDO</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>

                        {/* Background subtle glow center */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-48 h-48 blur-[100px] opacity-20",
                            notification.type === 'success' ? "bg-amber-400" : "bg-red-500"
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
