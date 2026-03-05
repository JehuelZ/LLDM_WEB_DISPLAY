
'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function FontWrapper({ children }: { children: React.ReactNode }) {
    const fontFamily = useAppStore((state) => state.calendarStyles.fontFamily);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    const fontVar = fontFamily === 'sora' ? 'var(--font-sora)' : fontFamily === 'inter' ? 'var(--font-inter)' : 'var(--font-outfit)';

    return (
        <div style={{ fontFamily: `${fontVar}, sans-serif` }} className="min-h-screen">
            {children}
        </div>
    );
}
