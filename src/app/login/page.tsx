
'use client';

import { LoginScreen } from '@/components/auth/LoginScreen';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { authSession } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        if (authSession) {
            router.push('/dashboard');
        }
    }, [authSession, router]);

    return <LoginScreen />;
}
