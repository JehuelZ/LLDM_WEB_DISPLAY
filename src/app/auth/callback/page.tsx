'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAppStore } from '@/lib/store';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { setAuthSession, syncUserWithCloud } = useAppStore();

    useEffect(() => {
        const handleCallback = async () => {
            // Supabase maneja automáticamente el intercambio de código por sesión
            const { data: { session }, error } = await supabase.auth.getSession();

            if (session?.user) {
                setAuthSession(session);
                // Sincronizar perfil (vincula pre-registrado si existe)
                await syncUserWithCloud(session.user.id);
            }

            // Redirigir al dashboard
            router.push('/dashboard');
        };

        handleCallback();
    }, [router, setAuthSession, syncUserWithCloud]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                    Verificando acceso...
                </p>
            </div>
        </div>
    );
}
