
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const { calendarStyles, settings, setAuthSession, syncUserWithCloud, loadSettingsFromCloud, subscribeToSettings } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadSettingsFromCloud();
        const unsubscribeSettings = subscribeToSettings();

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

        return () => {
            subscription.unsubscribe();
            unsubscribeSettings();
        };
    }, [setAuthSession, syncUserWithCloud, loadSettingsFromCloud, subscribeToSettings]);

    const themeMode = settings.themeMode;

    useEffect(() => {
        if (mounted) {
            const root = window.document.documentElement;
            root.classList.remove('light-theme', 'dark-theme');
            root.classList.add(themeMode === 'light' ? 'light-theme' : 'dark-theme');

            // For older browsers or specific CSS selectors, also set data-theme
            root.setAttribute('data-theme', themeMode);
        }
    }, [themeMode, mounted]);

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
        </div>
    );
}
