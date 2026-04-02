
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useIsPhone } from '@/hooks/useIsPhone';
import { MobileNav } from './MobileNav';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Theme Styles
import '@/app/admin/PrimitivoStyles.css';
import '@/app/admin/LunaStyles.css';
import '@/app/admin/ClassicStyles.css';

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

        // Protege las rutas administrativas de usuarios no autorizados
        const checkAdminAccess = async () => {
            if (typeof window === 'undefined') return;
            
            const path = window.location.pathname;
            if (path.startsWith('/admin')) {
                // EXCEPCIÓN PARA DESARROLLO: Si hay un usuario simulado en el store, permitir el paso
                const { currentUser } = useAppStore.getState();
                if (currentUser && (currentUser.privileges?.includes('admin') || currentUser.id === 'dev-admin-id')) {
                    console.log("Acceso concedido vía Simulación Local (Dev Mode)");
                    return;
                }

                const { data: { session } } = await supabase.auth.getSession();
                
                // Si no hay sesión, al login
                if (!session) {
                    window.location.href = '/login?returnTo=' + encodeURIComponent(path);
                    return;
                }
                
                // Si hay sesión, verificar que el perfil sea Administrador
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
            
            // Sync Admin Theme classes globally for consistent background/aesthetics
            const themeClass = settings.adminTheme === 'primitivo' ? 'admin-theme-primitivo' : 
                              settings.adminTheme === 'tactile' ? 'admin-theme-tactile' :
                              settings.adminTheme === 'luna' ? 'admin-theme-luna' : 
                              'admin-theme-classic';
            
            document.body.classList.remove('admin-theme-primitivo', 'admin-theme-tactile', 'admin-theme-luna', 'admin-theme-classic');
            document.body.classList.add(themeClass);

            if (isPhone) root.classList.add('is-phone');
            root.setAttribute('data-theme', settings.themeMode);
        }
    }, [settings.themeMode, settings.adminTheme, mounted, isPhone]);

    const fontFamily = settings.fontMain ?? 'Poppins';
    
    // Mapping for pre-loaded Next.js fonts (para mayor performance con las base)
    const nextFontVarMap: Record<string, string> = {
        'outfit': 'var(--font-outfit)',
        'sora': 'var(--font-sora)',
        'inter': 'var(--font-inter)',
        'montserrat': 'var(--font-montserrat)',
        'orbitron': 'var(--font-orbitron)',
        'poppins': 'var(--font-poppins)',
    };

    // Mapping to real Google Font names for dynamic loading
    const googleFontNameMap: Record<string, string> = {
        'poppins': 'Poppins',
        'lexend': 'Lexend',
        'black-ops': 'Black Ops One',
        'syne': 'Syne',
        'playfair': 'Playfair Display',
        'lora': 'Lora',
        'outfit': 'Outfit',
        'sora': 'Sora',
        'inter': 'Inter',
        'montserrat': 'Montserrat',
        'orbitron': 'Orbitron'
    };

    const isNextFont = !!nextFontVarMap[fontFamily];

    useEffect(() => {
        if (!isNextFont && fontFamily) {
            // Check if fontFamily is already a Name or an ID
            const realName = googleFontNameMap[fontFamily.toLowerCase()] || fontFamily;
            const fontNameForUrl = realName.replace(/\s+/g, '+');
            const linkId = `google-font-dynamic-${realName.replace(/\s+/g, '-').toLowerCase()}`;
            
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@300;400;500;600;700;800;900&display=swap`;
                document.head.appendChild(link);
            }
        }
    }, [fontFamily, isNextFont]);

    // --- DYNAMIC FAVICON SYNC ---
    useEffect(() => {
        if (mounted) {
            const logoUrl = (settings.churchLogoUrl === '' || !settings.churchLogoUrl) ? "/favicon.ico" : settings.churchLogoUrl;
            
            // Update standard icon
            let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = logoUrl;

            // Update Apple Touch Icon if it exists or create one
            let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            if (!appleLink) {
                appleLink = document.createElement('link');
                appleLink.rel = 'apple-touch-icon';
                document.head.appendChild(appleLink);
            }
            appleLink.href = logoUrl;
        }
    }, [settings.churchLogoUrl, mounted]);

    // Construct final font family for CSS
    const realFontName = googleFontNameMap[fontFamily.toLowerCase()] || fontFamily;
    const finalFontFamily = isNextFont ? nextFontVarMap[fontFamily.toLowerCase()] : `"${realFontName}"`;

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <div
            style={{ 
                fontFamily: `${finalFontFamily}, sans-serif`,
                fontWeight: settings.fontWeight || '400'
            }}
            className="min-h-screen transition-colors duration-500 text-foreground"
        >
            {children}
            <MobileNav />

            {/* Global Premium Notification Toast - Re-designed: Square Glassmorphism */}
            <AnimatePresence>
            {/* Global Premium Notification Toast - Re-designed: "Papel Cebolla" (Onion Skin) Glassmorphism */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
                        className={cn(
                            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]",
                            "flex flex-col items-center text-center p-10 rounded-[2.5rem]",
                            "border border-white/20 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)]",
                            "backdrop-blur-[80px] bg-white/15 min-w-[340px] max-w-[450px] overflow-hidden",
                            notification.type === 'success' && "border-emerald-500/30",
                            notification.type === 'error' && "border-red-500/30",
                            notification.type === 'warning' && "border-emerald-400/30"
                        )}
                    >
                        {/* Interactive Shine Effect */}
                        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-white/[0.08] to-transparent pointer-events-none rotate-12" />

                        {/* Dynamic Logo/Icon Section */}
                        <div className="relative mb-8">
                            <div className={cn(
                                "w-28 h-28 rounded-[2rem] flex items-center justify-center relative overflow-hidden bg-white/20 border border-white/30 backdrop-blur-md",
                                notification.type === 'success' ? "shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]" : "shadow-[0_20px_40px_-10px_rgba(239,68,68,0.3)]"
                             )}>
                                <img 
                                    src={(settings.churchLogoUrl === '' || !settings.churchLogoUrl) ? "/lldm_flama_3.svg" : settings.churchLogoUrl} 
                                    className={cn(
                                        "w-16 h-16 object-contain transition-all",
                                        (settings.churchLogoUrl === '' || !settings.churchLogoUrl) && "brightness-0 invert opacity-80"
                                    )}
                                    alt="Logo"
                                />
                                {/* Internal Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            </div>
                            
                            {/* Small Status Badge */}
                            <div className={cn(
                                "absolute -bottom-1 -right-1 w-10 h-10 rounded-full border-4 border-[#fff]/10 backdrop-blur-xl flex items-center justify-center shadow-2xl",
                                notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                            )}>
                                {notification.type === 'success' ? <CheckCircle className="w-6 h-6" strokeWidth={3} /> : <XCircle className="w-6 h-6" />}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 relative z-10 mb-2">
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.5em] mb-1",
                                notification.type === 'success' ? "text-emerald-500" : "text-red-500"
                            )}>
                                {notification.type === 'success' ? 'LLDM RODEO / SISTEMAS' : 'ALTA PRIORIDAD'}
                            </p>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-sm leading-tight">
                                {notification.message.replace(/^[✅⚠️❌]\s*/, '')}
                            </h2>
                            <div className="w-12 h-1 bg-white/10 mx-auto rounded-full" />
                            <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">
                                Realizado con éxito por la administración
                            </p>
                        </div>

                        {/* Centered Theme Button - Standardized: Small height, Full width */}
                        <button 
                            onClick={hideNotification} 
                            className={cn(
                                "mt-8 w-full h-11 rounded-xl flex items-center justify-center gap-3",
                                "bg-primary hover:brightness-110 active:scale-95 transition-all group relative overflow-hidden",
                                "text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)]"
                            )}
                        >
                            <span className="relative z-10">CONTINUAR</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>

                        {/* Background subtle glow center */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-64 h-64 blur-[120px] opacity-10",
                            notification.type === 'success' ? "bg-emerald-500" : "bg-red-500"
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
            </AnimatePresence>
        </div>
    );
}
