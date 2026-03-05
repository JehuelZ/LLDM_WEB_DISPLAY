'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Phone, Mail, Church, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CountdownCard } from '@/components/CountdownCard';

export const GlassmorphismAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => allAnnouncements.filter(a => a.active), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full flex flex-col md:flex-row p-8 pt-10 gap-8 overflow-hidden bg-transparent font-sora relative">
            {/* Left Pillar: Announcements */}
            <div className="flex-1 flex flex-col min-w-0">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 mb-6 border-b border-white/5 pb-4"
                >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center border border-amber-500/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                        <Bell className="w-8 h-8 text-amber-500 relative z-10 animate-bounce" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase text-white leading-none tracking-tighter italic">
                            ANUNCIOS <span className="font-thin text-white/30 uppercase">IMPORTANTES</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Pillar Container for Notices */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden bg-black/20 rounded-[2rem] border border-white/5 p-3 shadow-inner">
                    <AnimatePresence mode="popLayout">
                        {announcements.map((ann, idx) => (
                            <motion.div
                                key={ann.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "flex flex-col p-6 rounded-[2rem] border transition-all hover:bg-white/[0.04] relative overflow-hidden group/ann",
                                    ann.priority > 0
                                        ? "border-amber-500/40 bg-amber-500/[0.03] shadow-[0_20px_40px_rgba(245,158,11,0.05)]"
                                        : "border-white/10 bg-white/[0.02]"
                                )}
                            >
                                {ann.priority > 0 && (
                                    <div className="absolute top-0 right-0 bg-amber-500/20 border-b border-l border-amber-500/40 px-6 py-2 rounded-bl-3xl z-10">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic text-glow-amber">Urgente</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-5 mb-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg group-hover/ann:scale-110 transition-transform",
                                        ann.priority > 0 ? "bg-amber-500/20 border-amber-500/30 text-amber-500 px-10" : "bg-white/5 border-white/10 text-white/40"
                                    )}>
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-[1.1] truncate flex-1 tracking-tighter">
                                        {ann.title}
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <p className="text-xl text-white/70 leading-relaxed italic border-l-4 border-amber-500/20 pl-6 font-medium">
                                        {ann.content}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center justify-between text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                                    <span>Comunicado Oficial</span>
                                    <span>#{String(idx + 1).padStart(2, '0')}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Pillar: Minister Info */}
            {settings.showMinisterOnDisplay && (
                <div className="w-[450px] shrink-0 flex flex-col h-full">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col items-center pt-12 pb-16 px-10 rounded-[4rem] border border-white/[0.05] bg-black/20 shadow-2xl relative overflow-hidden"
                    >
                        {/* Internal Card Frame */}
                        <div className="w-full flex-1 flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-[3.5rem] p-8 shadow-xl relative overflow-hidden group/minister">
                            <div className="relative w-64 h-80 mb-10">
                                <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-0 group-hover/minister:opacity-100 transition-opacity duration-700" />
                                <div className="w-full h-full rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover/minister:scale-105">
                                    {minister.avatar ? (
                                        <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Church className="w-24 h-24 text-white/10" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.3em] text-blue-400">
                                {minister.role || 'MINISTRO LOCAL'}
                            </div>

                            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase leading-none mb-6 text-center px-6">
                                {minister.name}
                            </h2>

                            <div className="w-full space-y-4 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4 text-white/60">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover/minister:bg-blue-500/20 transition-colors">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <span className="text-xl font-black italic tracking-widest">{minister.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/30">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover/minister:bg-blue-500/20 transition-colors">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-bold tracking-tight truncate">{minister.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3 opacity-20 uppercase tracking-[0.5em] text-[10px] font-black italic">
                            <Shield className="w-4 h-4" />
                            <span>Contacto</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
