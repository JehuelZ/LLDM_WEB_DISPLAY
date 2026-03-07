
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useIsPhone } from '@/hooks/useIsPhone';
import { MobileNav } from './MobileNav';

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const { calendarStyles, settings, setAuthSession, syncUserWithCloud } = useAppStore();
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
        </div>
    );
}
