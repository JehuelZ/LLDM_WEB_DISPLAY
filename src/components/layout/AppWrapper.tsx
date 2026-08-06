
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useIsPhone } from '@/hooks/useIsPhone';
import { MobileNav } from './MobileNav';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Theme Styles
import '@/app/admin/PrimitivoStyles.css';
import '@/app/admin/LunaStyles.css';
import '@/app/admin/ClassicStyles.css';

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const { calendarStyles, settings, setAuthSession, syncUserWithCloud, notification, hideNotification, loadSettingsFromCloud } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const isPhone = useIsPhone();

    useEffect(() => {
        setMounted(true);
        loadSettingsFromCloud(); // Carga configuración pública (logo, tema, etc.) de inmediato

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

    // --- DYNAMIC FAVICON SYNC & THEMING ---
    useEffect(() => {
        if (!mounted) return;

    }, [mounted]);

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
            {/* Global Premium Notification Toast - Re-designed: Centered Dark Frosted Backdrop */}
            <AnimatePresence>
                {notification && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        {/* Dark backdrop overlay with smoked glass / frosted effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={hideNotification}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-300"
                        />

                        {/* Centered Modern Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className={cn(
                                "relative z-10 flex flex-col items-center text-center p-8 md:p-10 rounded-[2.5rem]",
                                "border backdrop-blur-2xl bg-slate-950/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(255,255,255,0.05)]",
                                "w-full max-w-[440px] overflow-hidden",
                                notification.type === 'success' && "border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)]",
                                notification.type === 'error' && "border-red-500/30 shadow-[0_0_80px_rgba(239,68,68,0.15)]",
                                notification.type === 'warning' && "border-amber-400/30 shadow-[0_0_80px_rgba(251,191,36,0.15)]"
                            )}
                        >
                            {/* Ambient Top Glow Line */}
                            <div className={cn(
                                "absolute top-0 left-1/4 right-1/4 h-[2px] rounded-full blur-[1px]",
                                notification.type === 'success' ? "bg-gradient-to-r from-transparent via-emerald-400 to-transparent" : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
                            )} />

                            {/* Interactive Light Beam */}
                            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent pointer-events-none rotate-12" />

                            {/* Dynamic Logo / Badge Section */}
                            <div className="relative mb-6">
                                <div className={cn(
                                    "w-24 h-24 rounded-[2.2rem] flex items-center justify-center relative overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl transition-all",
                                    notification.type === 'success' ? "shadow-emerald-500/20" : "shadow-red-500/20"
                                )}>
                                    <img 
                                        src={(settings.churchLogoUrl === '' || !settings.churchLogoUrl) ? "/lldm_flama_3.svg" : settings.churchLogoUrl} 
                                        className={cn(
                                            "w-13 h-13 object-contain transition-all drop-shadow-md",
                                            (settings.churchLogoUrl === '' || !settings.churchLogoUrl) && "brightness-0 invert opacity-90"
                                        )}
                                        alt="Logo"
                                    />
                                    {/* Internal Mirror Highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                                </div>
                                
                                {/* Status Icon Overlay */}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-2 border-slate-950 backdrop-blur-xl flex items-center justify-center shadow-xl",
                                    notification.type === 'success' ? "bg-emerald-500 text-slate-950" : "bg-red-500 text-white"
                                )}>
                                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" strokeWidth={3} /> : <XCircle className="w-5 h-5" strokeWidth={2.5} />}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-3 relative z-10 w-full">
                                <p className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.4em]",
                                    notification.type === 'success' ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {notification.type === 'success' ? 'LLDM RODEO • SISTEMAS' : 'NOTIFICACIÓN DEL SISTEMA'}
                                </p>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-snug">
                                    {notification.message.replace(/^[✅⚠️❌]\s*/, '')}
                                </h2>
                                <div className="w-10 h-[2px] bg-white/10 mx-auto rounded-full my-3" />
                                <p className="text-[9px] font-bold text-white/40 tracking-widest uppercase">
                                    Confirmado por la administración
                                </p>
                            </div>

                            {/* Centered Modern Button */}
                            <button 
                                onClick={hideNotification} 
                                className={cn(
                                    "mt-7 w-full h-12 rounded-2xl flex items-center justify-center gap-2",
                                    "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all group relative overflow-hidden",
                                    "text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)]"
                                )}
                            >
                                <span className="relative z-10">CONTINUAR</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </AnimatePresence>
            {/* PWA Install Prompt Banner */}
            <PWAInstallPrompt />
        </div>
    );
}
