'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Phone, Mail, Building2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, getActiveAnnouncements } from '@/lib/utils';

export const LunaAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => getActiveAnnouncements(allAnnouncements), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full flex flex-col md:flex-row p-12 pt-32 gap-12 overflow-hidden bg-transparent relative pl-[220px]" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* 1. LEFT PILLAR: ANNOUNCEMENTS */}
            <div className="flex-1 flex flex-col min-w-0">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col mb-12"
                >
                    <h2 className="text-6xl font-[200] lowercase leading-none tracking-tighter">
                        anuncios <span className="text-white/20">importantes</span>
                    </h2>
                    <div className="h-[1px] w-40 bg-white/10 mt-6" />
                </motion.div>

                {/* Notices Container */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {announcements.map((ann, idx) => (
                            <motion.div
                                key={ann.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "flex flex-col p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] relative overflow-hidden group",
                                    ann.priority > 1 && "bg-white/[0.04] border-white/20"
                                )}
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-[200] lowercase tracking-tight">
                                        {ann.title.toLowerCase()}
                                    </h3>
                                </div>

                                <p className="text-xl font-[200] text-white/50 lowercase leading-relaxed">
                                    {ann.content.toLowerCase()}
                                </p>

                                <div className="mt-auto pt-8 flex items-center justify-between text-[10px] font-[300] text-white/10 lowercase tracking-[0.2em]">
                                    <span>canal oficial</span>
                                    <span>#{String(idx + 1).padStart(2, '0')}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. RIGHT PILLAR: MINISTER */}
            {settings.showMinisterOnDisplay && (
                <div className="w-[480px] shrink-0 flex flex-col h-full">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col items-center p-12 rounded-[5rem] border border-white/5 bg-white/[0.03] backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="relative w-72 h-96 mb-12">
                            <div className="w-full h-full rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl grayscale transition-all duration-700 hover:grayscale-0">
                                {minister.avatar ? (
                                    <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <Building2 className="w-24 h-24 text-white/10" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] lowercase font-[300] tracking-[0.4em] text-white/40 mb-4">
                                {minister.role?.toLowerCase() || 'ministro local'}
                            </span>
                            <h2 className="text-3xl font-[200] lowercase tracking-tighter mb-8 text-center">
                                {minister.name.toLowerCase()}
                            </h2>
                        </div>

                        <div className="w-full space-y-6 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-6 text-white/30 truncate">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <span className="text-xl font-[100] tracking-widest">{minister.phone}</span>
                            </div>
                            <div className="flex items-center gap-6 text-white/10 truncate">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <span className="text-[12px] font-[300] lowercase tracking-wide truncate">{minister.email?.toLowerCase()}</span>
                            </div>
                        </div>

                        {/* Force Load Saira Font */}
                        <link 
                            href="https://fonts.googleapis.com/css2?family=Saira:wght@100;200;300;400;900&display=swap" 
                            rel="stylesheet" 
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
};
