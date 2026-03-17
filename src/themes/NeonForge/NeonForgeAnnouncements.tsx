'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Phone, Mail, Church, AlertTriangle, Info, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getVariantTokens } from './tokens';
import { useMemo } from 'react';

// ─────────────────────────────────────────────
// NeonForge — Announcements Slide
// Compact cards, neon accent, minister optional
// ─────────────────────────────────────────────

export function NeonForgeAnnouncements() {
    const allAnnouncements = useAppStore((state: any) => state.announcements);
    const minister = useAppStore((state: any) => state.minister);
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);

    const announcements = useMemo(() => allAnnouncements.filter((a: any) => a.active), [allAnnouncements]);

    return (
        <div className="h-full w-full flex overflow-hidden relative"
            style={{ background: T.bg, fontFamily: 'var(--font-sora, ui-sans-serif)' }}>

            {/* Left — main content */}
            <div className="flex-1 flex flex-col px-10 pt-20 pb-8 min-w-0 z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-7 shrink-0"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: T.textMuted }}>
                        Tablón de Información
                    </p>
                    <h1 className="text-4xl font-black tracking-tight" style={{ color: T.white }}>
                        Comunicados <span style={{ color: T.accent }}>Activos</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-3 w-fit px-3 py-1 rounded-full"
                        style={{ background: T.card, border: `1px solid ${T.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.accent }} />
                        <Bell className="w-3 h-3" style={{ color: T.textSecondary }} />
                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: T.textSecondary }}>
                            {announcements.length} anuncio{announcements.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </motion.div>

                {/* Announcements */}
                {announcements.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                            <Bell className="w-14 h-14" style={{ color: T.textMuted }} />
                            <p className="text-sm font-medium tracking-wide" style={{ color: T.textMuted }}>Sin comunicados activos</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden content-start">
                        <AnimatePresence mode="popLayout">
                            {announcements.map((ann: any, idx: number) => {
                                const isUrgent = ann.priority > 0;
                                const accentColor = isUrgent ? T.live : T.accent;
                                return (
                                    <motion.div
                                        key={ann.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.07 }}
                                        className="relative flex flex-col rounded-2xl overflow-hidden"
                                        style={{
                                            background: T.card,
                                            border: `1px solid ${isUrgent ? `${T.live}50` : T.border}`,
                                            boxShadow: isUrgent ? `0 0 20px ${T.live}15` : 'none',
                                        }}
                                    >
                                        {/* Top accent line */}
                                        <div className="h-[2px] shrink-0"
                                            style={{ background: accentColor }} />

                                        {/* Content */}
                                        <div className="p-5 flex flex-col gap-3">
                                            {/* Badge */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
                                                    {isUrgent
                                                        ? <AlertTriangle className="w-4 h-4" style={{ color: T.live }} />
                                                        : <Info className="w-4 h-4" style={{ color: T.accent }} />
                                                    }
                                                </div>
                                                <span className="text-[9px] font-bold uppercase tracking-widest"
                                                    style={{ color: accentColor }}>
                                                    {isUrgent ? 'Urgente' : 'Aviso Oficial'}
                                                </span>
                                                {isUrgent && (
                                                    <span className="ml-auto w-2 h-2 rounded-full animate-pulse"
                                                        style={{ background: T.live }} />
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h2 className={`font-black leading-tight break-words ${ann.title.length > 25 ? 'text-xl' : 'text-2xl'}`}
                                                style={{ color: T.white }}>
                                                {ann.title}
                                            </h2>

                                            {/* Divider */}
                                            <div className="h-px" style={{ background: T.border }} />

                                            {/* Body */}
                                            <p className="text-[14px] leading-relaxed font-medium" style={{ color: T.textSecondary }}>
                                                {ann.content}
                                            </p>
                                        </div>

                                        {/* Watermark */}
                                        <div className="absolute bottom-3 right-4 text-[8px] uppercase tracking-widest select-none"
                                            style={{ color: T.border }}>
                                            LLDM
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Right — Minister panel (optional) */}
            {settings.showMinisterOnDisplay && (
                <div className="w-[300px] shrink-0 flex flex-col px-6 pt-20 pb-8 z-10"
                    style={{ borderLeft: `1px solid ${T.border}` }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col rounded-2xl overflow-hidden h-full"
                        style={{
                            background: T.card,
                            border: `1px solid ${T.accent}40`,
                            boxShadow: `0 0 30px ${T.accentGlow}`,
                        }}
                    >
                        {/* Top glow bar */}
                        <div className="h-[2px] shrink-0"
                            style={{ background: `linear-gradient(to right, ${T.secondary}, ${T.accent})` }} />

                        {/* Avatar */}
                        <div className="flex flex-col items-center pt-8 pb-4 px-5">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                                style={{
                                    border: `2px solid ${T.accent}50`,
                                    boxShadow: `0 0 30px ${T.accent}20`,
                                    background: T.bg,
                                }}>
                                {minister.avatar
                                    ? <img src={minister.avatar} className="w-full h-full object-cover" alt="" />
                                    : <Church className="w-12 h-12" style={{ color: `${T.accent}50` }} />
                                }
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Ministro</span>
                                <p className="text-xl font-black mt-0.5 leading-tight" style={{ color: T.white }}>{minister.name}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px mx-5" style={{ background: T.border }} />

                        {/* Contact */}
                        <div className="flex flex-col gap-2.5 p-5">
                            {minister.phone && (
                                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                                    style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: T.accentDim, border: `1px solid ${T.accent}30` }}>
                                        <Phone className="w-3.5 h-3.5" style={{ color: T.accent }} />
                                    </div>
                                    <span className="text-[12px] font-medium" style={{ color: T.textSecondary }}>{minister.phone}</span>
                                </div>
                            )}
                            {minister.email && (
                                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                                    style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: T.accentDim, border: `1px solid ${T.accent}30` }}>
                                        <Mail className="w-3.5 h-3.5" style={{ color: T.accent }} />
                                    </div>
                                    <span className="text-[11px] font-medium" style={{ color: T.textSecondary }}>{minister.email}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Footer */}
            <div className="absolute bottom-3 right-6 text-[8px] uppercase tracking-widest select-none"
                style={{ color: T.textMuted, opacity: 0.3 }}>
                LLDM · NF-ANN
            </div>
        </div>
    );
}
