'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { getVariantTokens } from './tokens';

// ─────────────────────────────────────────────
// NeonForge — Progress dots
// ─────────────────────────────────────────────

export function NeonForgeProgress({ currentSlide = 0, slides = [] }: { currentSlide?: number; slides?: any[] }) {
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);
    const total = slides.length || 5;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        width: i === currentSlide ? 24 : 6,
                        opacity: i === currentSlide ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-1.5 rounded-full"
                    style={{ background: T.accent }}
                />
            ))}
        </div>
    );
}
