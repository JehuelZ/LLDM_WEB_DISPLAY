'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToMonitor() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/monitor');
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-t-emerald-500 border-emerald-500/20 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">Redirigiendo al Panel de Asistencia...</p>
        </div>
    );
}
