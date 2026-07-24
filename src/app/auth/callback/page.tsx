'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAppStore } from '@/lib/store';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuthSession, syncUserWithCloud } = useAppStore();

    useEffect(() => {
        const handleCallback = async () => {
            // Supabase maneja automáticamente el intercambio de código por sesión
            const { data: { session }, error } = await supabase.auth.getSession();

            if (session?.user) {
                // Revisar si viene de una reclamación por URL param (QR) o por localStorage
                const urlClaimId = searchParams.get('claim_profile_id');
                const localClaimId = typeof window !== 'undefined' ? localStorage.getItem('pending_claim_profile_id') : null;
                const claimProfileId = urlClaimId || localClaimId;

                if (claimProfileId && session.user.email) {
                    // Llamar a RPC para vincular el Google user a este profile ID de forma atómica
                    await supabase.rpc('claim_member_portal', { 
                        p_profile_id: claimProfileId, 
                        p_email: session.user.email,
                        p_auth_user_id: session.user.id
                    });
                    
                    // Limpiar localStorage si existía
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('pending_claim_profile_id');
                    }
                }

                setAuthSession(session);
                // Sincronizar perfil (vincula pre-registrado si existe)
                await syncUserWithCloud(session.user.id);
            }

            // Redirigir al portal
            router.push('/portal');
        };

        handleCallback();
    }, [router, searchParams, setAuthSession, syncUserWithCloud]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                    Verificando acceso al portal...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
