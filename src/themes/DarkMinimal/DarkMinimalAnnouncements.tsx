'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Phone, Mail, Church, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const DarkMinimalAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const minister = useAppStore((state) => state.minister);
    const announcements = useMemo(() => allAnnouncements.filter(a => a.active), [allAnnouncements]);

    return (
        <div
            className="h-full w-full flex md:flex-row overflow-hidden relative"
            style={{ background: '#0F1117' }}
        >
            {/* ── LEFT: Announcements ── */}
            <div className="flex-1 flex flex-col px-10 pt-10 pb-8 z-10 min-w-0">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-7 shrink-0"
                >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4B5563] mb-1">
                        Tablón de Información
                    </p>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Comunicados <span className="text-[#3B82F6]">Activos</span>
                    </h1>
                    <div className="flex items-center gap-2 border border-[#23242F] bg-[#16171F] rounded-full px-4 py-1 mt-3 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                        <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                            <Bell className="w-3 h-3" /> {announcements.length} anuncio{announcements.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </motion.div>

                {/* Announcements grid */}
                {announcements.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <Bell className="w-12 h-12 text-[#4B5563]" />
                            <p className="text-[#4B5563] text-sm font-medium tracking-wide">Sin comunicados activos</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden content-start">
                        <AnimatePresence mode="popLayout">
                            {announcements.map((ann, idx) => {
                                const isUrgent = ann.priority > 0;
                                return (
                                    <motion.div
                                        key={ann.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.07 }}
                                        className={`relative flex flex-col rounded-2xl border overflow-hidden
                                            ${isUrgent
                                                ? 'border-[#EF4444]/40 bg-[#1A1010] shadow-[0_0_0_1px_rgba(239,68,68,0.08)]'
                                                : 'border-[#23242F] bg-[#16171F]'
                                            }
                                        `}
                                    >
                                        {/* Top accent line */}
                                        <div className={`h-[2px] ${isUrgent ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'} shrink-0`} />

                                        {/* Content */}
                                        <div className="p-5 flex flex-col gap-3">
                                            {/* Badge row */}
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                                    ${isUrgent ? 'bg-[#EF4444]/15 border border-[#EF4444]/30' : 'bg-[#3B82F6]/10 border border-[#3B82F6]/20'}
                                                `}>
                                                    {isUrgent
                                                        ? <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                                                        : <Info className="w-4 h-4 text-[#3B82F6]" />
                                                    }
                                                </div>
                                                <span className={`text-[9px] font-semibold uppercase tracking-widest ${isUrgent ? 'text-[#EF4444]' : 'text-[#3B82F6]'}`}>
                                                    {isUrgent ? 'Atención' : 'Aviso Oficial'}
                                                </span>
                                                {isUrgent && (
                                                    <span className="ml-auto w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h2 className={`font-bold text-white leading-tight tracking-tight
                                                ${ann.title.length > 25 ? 'text-lg' : 'text-xl'}
                                            `}>
                                                {ann.title}
                                            </h2>

                                            {/* Divider */}
                                            <div className={`h-px ${isUrgent ? 'bg-[#EF4444]/15' : 'bg-[#23242F]'}`} />

                                            {/* Body */}
                                            <p className="text-[14px] text-[#9CA3AF] leading-relaxed font-medium">
                                                {ann.content}
                                            </p>
                                        </div>

                                        {/* Footer watermark */}
                                        <div className="absolute bottom-3 right-4 text-[9px] tracking-widest text-[#1E1F28] font-mono uppercase select-none">
                                            LLDM
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── RIGHT: Minister card (optional) ── */}
            {settings.showMinisterOnDisplay && (
                <div className="w-[340px] shrink-0 flex flex-col px-6 pt-10 pb-8 z-10 border-l border-[#23242F]">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col rounded-2xl border border-[#3B82F6]/40 bg-[#1C1E2C] overflow-hidden h-full"
                    >
                        {/* Top accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] shrink-0" />

                        {/* Avatar */}
                        <div className="flex flex-col items-center pt-8 pb-4 px-6">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#3B82F6]/40 bg-[#16171F] flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
                                {minister.avatar
                                    ? <img src={minister.avatar} className="w-full h-full object-cover" alt="" />
                                    : <Church className="w-12 h-12 text-[#3B82F6]/40" />
                                }
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563]">Ministro</span>
                                <p className="text-lg font-bold text-white mt-0.5 leading-tight">{minister.name}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#23242F] mx-5" />

                        {/* Contact info */}
                        <div className="flex flex-col gap-3 p-5">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563]">Ministerio</span>
                            {minister.phone && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1117] border border-[#23242F]">
                                    <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-[#3B82F6]" />
                                    </div>
                                    <span className="text-[13px] font-medium text-[#9CA3AF] truncate">{minister.phone}</span>
                                </div>
                            )}
                            {minister.email && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1117] border border-[#23242F]">
                                    <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 text-[#3B82F6]" />
                                    </div>
                                    <span className="text-[12px] font-medium text-[#9CA3AF] truncate">{minister.email}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Footer branding */}
            <div className="absolute bottom-2 right-8 text-[9px] tracking-widest text-[#1A1B23] font-mono uppercase select-none">
                LLDM · DM-ANN
            </div>
        </div>
    );
};
