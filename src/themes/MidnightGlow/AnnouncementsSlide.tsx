'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Phone, Mail, Church } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, getActiveAnnouncements } from '@/lib/utils';
import { CountdownCard } from '@/components/CountdownCard';

export const MidnightGlowAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => getActiveAnnouncements(allAnnouncements), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full w-full flex flex-col md:flex-row overflow-hidden relative" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 30%, #071428 0%, #040D21 60%, #02080F 100%)' }}>
            {/* ── Background texture: dot grid ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #4F7FFF 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Diagonal lines texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #4F7FFF 0, #4F7FFF 1px, transparent 0, transparent 50%)',
                    backgroundSize: '24px 24px',
                }}
            />
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-[#4F7FFF]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#A3FF57]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-1 flex flex-col min-w-0 px-10 pt-8 pb-10 z-10 w-full h-full justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0 overflow-visible px-6 mt-2">
                    <AnimatePresence mode="popLayout">
                        {announcements.map((ann, idx) => {
                            const isUrgent = ann.priority > 0;
                            const cardBg = isUrgent ? 'bg-[#030B06]' : 'bg-[#0D1B3E]';
                            const cardBorder = isUrgent ? 'border-[#10B981]/40' : 'border-[#1E3A6E]';
                            const topAccent = isUrgent ? 'bg-gradient-to-r from-transparent via-[#10B981]/50 to-[#10B981]' : 'bg-gradient-to-r from-transparent via-[#4F7FFF]/50 to-[#4F7FFF]';
                            const badgeBorderText = isUrgent ? 'text-[#A3FF57] border-[#A3FF57]/40' : 'text-[#4F7FFF] border-[#4F7FFF]/40';
                            const customShadow = isUrgent ? 'shadow-[0_30px_90px_rgba(16,185,129,0.15)]' : 'shadow-[0_30px_90px_rgba(0,0,0,0.7)]';

                            return (
                                <motion.div
                                    key={ann.id}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className={`relative flex flex-col rounded-[2.5rem] border-2 ${cardBorder} ${cardBg} ${customShadow} transition-all duration-500 overflow-visible group pb-6 pt-5`}
                                >
                                    {/* Top accent line */}
                                    <div className={`absolute top-0 left-0 right-0 h-[4px] ${topAccent} rounded-t-[2.5rem]`} />

                                    {/* Ambient Top Glow */}
                                    <div className="absolute top-0 left-0 right-0 h-40 opacity-30 mix-blend-screen pointer-events-none"
                                        style={{ background: isUrgent ? 'radial-gradient(circle at 50% -20%, #10B981 0%, transparent 70%)' : 'radial-gradient(circle at 50% -20%, #4F7FFF 0%, transparent 70%)' }}
                                    />

                                    {/* Badge */}
                                    <div className="flex justify-center mt-2 z-10 w-full mb-4">
                                        <div className={`flex items-center gap-2 text-[12px] font-black tracking-[0.4em] uppercase border-2 px-6 py-1.5 rounded-full ${badgeBorderText} ${cardBg}/90 backdrop-blur-md`}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", isUrgent ? "bg-[#A3FF57] shadow-[0_0_10px_#A3FF57] animate-pulse" : "bg-[#4F7FFF] shadow-[0_0_10px_#4F7FFF] animate-pulse")} />
                                            <span className="mt-px">{isUrgent ? 'ATENCIÓN' : 'AVISO OFICIAL'}</span>
                                        </div>
                                    </div>

                                    {/* Title (Mimicking the HUGE time text block) */}
                                    <div className="flex items-end justify-center w-full px-6 text-center z-10 mt-2 mb-5">
                                        <span className={`font-black text-white leading-tight uppercase tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${ann.title.length > 18 ? 'text-base' : 'text-lg md:text-xl'}`}>
                                            {ann.title}
                                        </span>
                                    </div>

                                    {/* Divider with dot */}
                                    <div className="mx-10 flex items-center gap-4 mb-6 z-10 opacity-70">
                                        <div className={cn("flex-1 h-px", isUrgent ? "bg-gradient-to-r from-transparent to-[#10B981]/50" : "bg-gradient-to-r from-transparent to-[#4F7FFF]/50")} />
                                        <div className={cn("w-2 h-2 rounded-full", isUrgent ? "bg-[#A3FF57] shadow-[0_0_10px_#A3FF57]" : "bg-[#4F7FFF] shadow-[0_0_10px_#4F7FFF]")} />
                                        <div className={cn("flex-1 h-px", isUrgent ? "bg-gradient-to-l from-transparent to-[#10B981]/50" : "bg-gradient-to-l from-transparent to-[#4F7FFF]/50")} />
                                    </div>

                                    {/* Content Area */}
                                    <div className="px-6 flex-1 flex flex-col justify-start text-center z-10 mb-2">
                                        <p className="text-[12px] text-white/70 leading-relaxed font-bold tracking-wide uppercase">
                                            {ann.content}
                                        </p>
                                    </div>

                                    {/* Watermark removed */}

                                    {/* LIVE Bottom Glow for Attention Announcements */}
                                    {isUrgent && (
                                        <motion.div
                                            animate={{
                                                boxShadow: [
                                                    "0 -5px 15px rgba(16,185,129,0.3)",
                                                    "0 -5px 25px rgba(16,185,129,0.6)",
                                                    "0 -5px 15px rgba(16,185,129,0.3)"
                                                ]
                                            }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            className="absolute -bottom-[2px] -left-[2px] -right-[2px] h-8 rounded-b-[2.5rem] overflow-hidden z-[60] pointer-events-none bg-gradient-to-r from-[#064e3b] via-[#10b981] to-[#064e3b] border-t border-white/30 backdrop-blur-md flex items-center justify-center"
                                        >
                                            <motion.div
                                                initial={{ y: 15, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
                                                <span className="text-[8px] font-black text-white tracking-[0.4em] uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                                                    ATENCIÓN
                                                </span>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* ── BOTTOM HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 flex flex-col items-center justify-center shrink-0 text-center mt-2"
                >
                    <p className="text-[10px] tracking-[0.5em] text-[#4F7FFF] uppercase font-bold mb-2">Tablón de Información</p>
                    <h1 className="text-2xl uppercase text-white tracking-tight leading-none mb-4">
                        <span className="font-thin opacity-50">ANUNCIOS</span> <span className="font-black text-[#A3FF57]">IMPORTANTES</span>
                    </h1>
                    {/* Glowing Top Badge (now Bottom) */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-3 border border-[#4F7FFF]/40 bg-[#0D1B3E]/80 rounded-full px-6 py-2 shadow-[0_0_20px_rgba(79,127,255,0.15)] backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF57] animate-pulse" />
                            <span className="text-[13px] font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                                <Bell className="w-4 h-4 text-[#A3FF57]" /> EN PANTALLA
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {settings.showMinisterOnDisplay && (
                <div className="w-[480px] shrink-0 flex flex-col px-6 pt-8 pb-8 z-10 justify-center">
                    <motion.div
                        animate={settings.mainChurch?.supervisorName ? {} : { y: [0, -10, 0] }}
                        transition={settings.mainChurch?.supervisorName ? {} : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className={cn(
                            "flex flex-col items-center justify-start rounded-[3.5rem] border-2 border-[#1E3A6E] bg-[#071020] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative transition-all duration-500 hover:border-[#4F7FFF]/50 hover:bg-[#0D1B3E] group w-full",
                            settings.mainChurch?.supervisorName ? "py-8 px-6 gap-4" : "pb-12"
                        )}
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-[#A3FF57] to-transparent rounded-t-[3.5rem] z-20 opacity-80" />

                        {/* Ambient Glow */}
                        <div className="absolute bottom-0 left-0 right-0 h-[250px] opacity-15 mix-blend-screen pointer-events-none rounded-b-[3.5rem]"
                            style={{ background: 'radial-gradient(circle at 50% 120%, #A3FF57 0%, transparent 60%)' }}
                        />

                        {/* Minister Section */}
                        <div className="flex flex-col items-center w-full">
                            {/* Floating Profile Picture */}
                            <div className={cn(
                                "relative z-50 w-full flex justify-center items-end",
                                settings.mainChurch?.supervisorName ? "mb-3" : "-mt-24 mb-10"
                            )}>
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={cn(
                                            "relative rounded-full bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-2xl overflow-hidden",
                                            settings.mainChurch?.supervisorName ? "w-28 h-28" : "w-56 h-56 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(163,255,87,0.25)]"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#A3FF57]/30 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
                                        <div className="absolute inset-0 rounded-full border-2 border-[#4F7FFF]/40 animate-pulse opacity-50 pointer-events-none z-20" />
                                        {minister.avatar ? (
                                            <img src={minister.avatar} className="w-full h-full object-cover relative z-0" alt="" />
                                        ) : (
                                            <Church className={settings.mainChurch?.supervisorName ? "w-10 h-10 text-[#A3FF57]/40 relative z-0 animate-pulse" : "w-24 h-24 text-[#A3FF57]/40 relative z-0 animate-pulse"} />
                                        )}
                                    </motion.div>

                                    <motion.div
                                        className={cn(
                                            "rounded-3xl bg-[#040D21]/95 border-2 border-[#A3FF57]/50 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center",
                                            settings.mainChurch?.supervisorName ? "mt-3 px-6 py-1 min-w-[200px]" : "mt-6 px-10 py-3 min-w-[280px]"
                                        )}
                                    >
                                        <span className={cn(
                                            "font-black text-[#A3FF57] uppercase tracking-[0.3em] opacity-90 drop-shadow-[0_0_8px_rgba(163,255,87,0.5)]",
                                            settings.mainChurch?.supervisorName ? "text-[8px] mb-0.5" : "text-[11px] mb-1"
                                        )}>
                                            {minister.role || 'Responsabilidad Ministerial'}
                                        </span>
                                        <span className={cn(
                                            "font-black uppercase tracking-[0.05em] leading-none text-center",
                                            settings.mainChurch?.supervisorName ? "text-base" : "text-[20px]",
                                            minister.name === 'Por asignar' ? 'text-white/30 italic' : 'text-white'
                                        )}>
                                            {minister.name}
                                        </span>
                                        {!settings.mainChurch?.supervisorName && (
                                            <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                                <Church className="w-3 h-3 text-[#4F7FFF]" />
                                                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{settings.mainChurchName || 'Iglesia Local'}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Contact Info (Inline if supervisor is present) */}
                            <div className={cn(
                                "z-10",
                                settings.mainChurch?.supervisorName 
                                    ? "flex flex-row justify-center gap-3 w-full text-[9px] font-bold text-white/80 tracking-[0.15em] uppercase mt-2" 
                                    : "flex flex-col gap-3 w-full text-[12px] font-bold text-white/80 tracking-[0.2em] uppercase px-6 mt-4"
                            )}>
                                {minister.phone && minister.name !== 'Por asignar' && (
                                    <div className={cn(
                                        "bg-[#040D21]/95 border border-[#1E3A6E]/50 flex items-center gap-2 shadow-md hover:border-[#4F7FFF]/30 transition-colors",
                                        settings.mainChurch?.supervisorName ? "px-3 py-1.5 rounded-xl" : "p-3.5 rounded-2xl gap-4"
                                    )}>
                                        <Phone className={settings.mainChurch?.supervisorName ? "w-3 h-3 text-[#A3FF57]" : "w-4 h-4 text-[#A3FF57]"} />
                                        <span className="truncate">{minister.phone}</span>
                                    </div>
                                )}
                                {minister.email && minister.name !== 'Por asignar' && (
                                    <div className={cn(
                                        "bg-[#040D21]/95 border border-[#1E3A6E]/50 flex items-center gap-2 shadow-md hover:border-[#4F7FFF]/30 transition-colors",
                                        settings.mainChurch?.supervisorName ? "px-3 py-1.5 rounded-xl" : "p-3.5 rounded-2xl gap-4"
                                    )}>
                                        <Mail className={settings.mainChurch?.supervisorName ? "w-3 h-3 text-[#4F7FFF]" : "w-4 h-4 text-[#4F7FFF]"} />
                                        <span className="truncate text-[8px] lowercase">{minister.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="h-[2px] w-full bg-[#1E3A6E]/40 my-2" />
                        )}

                        {/* Supervisor Section */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="flex flex-col items-center w-full">
                                <div className="relative z-50 w-full flex justify-center items-end mb-3">
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative rounded-full bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-2xl overflow-hidden w-28 h-28"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#A3FF57]/30 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
                                            <div className="absolute inset-0 rounded-full border-2 border-[#4F7FFF]/40 animate-pulse opacity-50 pointer-events-none z-20" />
                                            {settings.mainChurch.supervisorAvatar ? (
                                                <img src={settings.mainChurch.supervisorAvatar} className="w-full h-full object-cover relative z-0" alt="" />
                                            ) : (
                                                <Church className="w-10 h-10 text-[#A3FF57]/40 relative z-0 animate-pulse" />
                                            )}
                                        </motion.div>

                                        <motion.div
                                            className="rounded-3xl bg-[#040D21]/95 border-2 border-[#A3FF57]/50 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center mt-3 px-6 py-1 min-w-[200px]"
                                        >
                                            <span className="font-black text-[#A3FF57] uppercase tracking-[0.3em] opacity-90 drop-shadow-[0_0_8px_rgba(163,255,87,0.5)] text-[8px] mb-0.5">
                                                Supervisor de Distrito
                                            </span>
                                            <span className="font-black uppercase tracking-[0.05em] leading-none text-center text-base text-white">
                                                {settings.mainChurch.supervisorName}
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full text-[9px] font-bold text-white/80 tracking-[0.15em] uppercase z-10 mt-2 flex-row justify-center">
                                    {settings.mainChurch.supervisorPhone && (
                                        <div className="bg-[#040D21]/95 rounded-xl border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 shadow-md hover:border-[#4F7FFF]/30 transition-colors">
                                            <Phone className="w-3 h-3 text-[#A3FF57]" />
                                            <span className="truncate">{settings.mainChurch.supervisorPhone}</span>
                                        </div>
                                    )}
                                    {settings.mainChurch.supervisorEmail && (
                                        <div className="bg-[#040D21]/95 rounded-xl border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 shadow-md hover:border-[#4F7FFF]/30 transition-colors">
                                            <Mail className="w-3 h-3 text-[#4F7FFF]" />
                                            <span className="truncate text-[8px] lowercase">{settings.mainChurch.supervisorEmail}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};
