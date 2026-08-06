'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Phone, Mail } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { ChurchIcon as Church } from '@/components/ui/ChurchIcon';
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
                            const isImageIcon = !ann.imageUrl || ann.imageUrl.startsWith('icon:');
                            const cardBg = isUrgent ? 'bg-[#030D08]/95' : 'bg-[#0B152B]/95';
                            const cardBorder = isUrgent ? 'border-[#10B981]/50' : 'border-[#1E3A6E]';
                            const topAccent = isUrgent ? 'bg-gradient-to-r from-transparent via-[#10B981] to-transparent' : 'bg-gradient-to-r from-transparent via-[#4F7FFF] to-transparent';
                            const badgeBorderText = isUrgent ? 'text-[#A3FF57] border-[#A3FF57]/40 bg-[#064E3B]/40' : 'text-[#4F7FFF] border-[#4F7FFF]/40 bg-[#0F285C]/40';
                            const customShadow = isUrgent ? 'shadow-[0_30px_90px_rgba(16,185,129,0.25)]' : 'shadow-[0_30px_90px_rgba(0,0,0,0.8)]';

                            return (
                                <motion.div
                                    key={ann.id}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className={`relative flex flex-col rounded-[2.5rem] border-2 ${cardBorder} ${cardBg} ${customShadow} transition-all duration-500 overflow-hidden group p-6 backdrop-blur-2xl`}
                                >
                                    {/* Top accent glowing line */}
                                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${topAccent}`} />

                                    {/* Ambient Background Glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 opacity-30 mix-blend-screen pointer-events-none blur-2xl"
                                        style={{ background: isUrgent ? 'radial-gradient(circle, #10B981 0%, transparent 70%)' : 'radial-gradient(circle, #4F7FFF 0%, transparent 70%)' }}
                                    />

                                    {/* Top Header Badge */}
                                    <div className="flex items-center justify-between z-10 w-full mb-4 px-2">
                                        <div className={`flex items-center gap-2 text-[11px] font-black tracking-[0.35em] uppercase border px-4 py-1.2 rounded-full ${badgeBorderText} backdrop-blur-md`}>
                                            <div className={cn("w-2 h-2 rounded-full", isUrgent ? "bg-[#A3FF57] shadow-[0_0_12px_#A3FF57] animate-pulse" : "bg-[#4F7FFF] shadow-[0_0_12px_#4F7FFF] animate-pulse")} />
                                            <span>{isUrgent ? 'URGENTE / ATENCIÓN' : 'COMUNICADO OFICIAL'}</span>
                                        </div>

                                        {isImageIcon && ann.imageUrl && (
                                            <div className="w-9 h-9 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center backdrop-blur-md shadow-md">
                                                <DynamicIcon icon={ann.imageUrl.replace('icon:', '')} className="w-5 h-5" style={{ color: isUrgent ? '#A3FF57' : '#4F7FFF' }} fallbackIcon="bell" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Full Width Image Hero Showcase */}
                                    {!isImageIcon && ann.imageUrl && (
                                        <div className="relative w-full h-48 md:h-56 mb-4 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/60 group-hover:scale-[1.01] transition-transform duration-500">
                                            <img 
                                                src={ann.imageUrl} 
                                                className="w-full h-full object-cover" 
                                                alt={ann.title} 
                                            />
                                            {/* Gradient overlay for text legibility */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B152B] via-transparent to-black/20 pointer-events-none" />
                                        </div>
                                    )}

                                    {/* Title Header */}
                                    <div className="z-10 w-full px-2 mb-3">
                                        <h3 className={`font-black text-white leading-snug uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${ann.title.length > 25 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                                            {ann.title}
                                        </h3>
                                    </div>

                                    {/* Subtle Divider */}
                                    <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-4 z-10" />

                                    {/* Message Content */}
                                    <div className="px-2 flex-1 flex flex-col justify-start z-10">
                                        <p className="text-[13px] md:text-[14px] text-white/85 leading-relaxed font-semibold tracking-normal text-left">
                                            {ann.content}
                                        </p>
                                    </div>

                                    {/* Urgent Pulsing Footer Indicator */}
                                    {isUrgent && (
                                        <motion.div
                                            animate={{
                                                boxShadow: [
                                                    "0 -4px 15px rgba(16,185,129,0.3)",
                                                    "0 -4px 25px rgba(16,185,129,0.7)",
                                                    "0 -4px 15px rgba(16,185,129,0.3)"
                                                ]
                                            }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                            className="mt-4 -mx-6 -mb-6 p-2.5 z-[20] bg-gradient-to-r from-[#047857] via-[#10B981] to-[#047857] border-t border-white/30 flex items-center justify-center gap-2"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
                                            <span className="text-[9px] font-black text-white tracking-[0.35em] uppercase">
                                                AVISO DE ALTA PRIORIDAD
                                            </span>
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
                <div className="w-[480px] shrink-0 flex flex-col px-6 pt-8 pb-8 z-10 justify-center gap-8">
                    {/* Minister Section */}
                    <div className="flex flex-col items-center w-full">
                        <div className={cn(
                            "relative mb-4 z-10",
                            settings.mainChurch?.supervisorName ? "w-36 h-36" : "w-56 h-56"
                        )}>
                            <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-[#1E3A6E] bg-[#071020] shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-square">
                                {minister.avatar ? (
                                    <img src={minister.avatar} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-[#040D21] flex items-center justify-center">
                                        <Church className="w-16 h-16 text-[#A3FF57]/40 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cn(
                            "rounded-3xl bg-[#040D21]/95 border-2 border-[#A3FF57]/50 shadow-[0_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center",
                            settings.mainChurch?.supervisorName ? "px-6 py-1.5" : "px-10 py-3"
                        )}>
                            <span className={cn(
                                "font-black text-[#A3FF57] uppercase tracking-[0.3em] opacity-90",
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
                        </div>

                        <div className={cn(
                            "z-10 flex gap-3 text-[9px] font-bold text-white/80 tracking-[0.15em] uppercase mt-4 justify-center",
                            settings.mainChurch?.supervisorName ? "flex-row" : "flex-col w-full px-6"
                        )}>
                            {minister.phone && minister.name !== 'Por asignar' && (
                                <div className="bg-[#040D21]/95 border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-md">
                                    <Phone className="w-3 h-3 text-[#A3FF57]" />
                                    <span className="truncate">{minister.phone}</span>
                                </div>
                            )}
                            {minister.email && minister.name !== 'Por asignar' && (
                                <div className="bg-[#040D21]/95 border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-md">
                                    <Mail className="w-3 h-3 text-[#A3FF57]" />
                                    <span className="truncate text-[8px] lowercase">{minister.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    {settings.mainChurch?.supervisorName && (
                        <div className="h-[2px] w-full bg-[#1E3A6E]/40 my-1" />
                    )}

                    {/* Supervisor Section */}
                    {settings.mainChurch?.supervisorName && (
                        <div className="flex flex-col items-center w-full">
                            <div className="relative w-36 h-36 mb-4 z-10">
                                <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-[#1E3A6E] bg-[#071020] shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-square">
                                    {settings.mainChurch.supervisorAvatar ? (
                                        <img src={settings.mainChurch.supervisorAvatar} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-[#040D21] flex items-center justify-center">
                                            <Church className="w-16 h-16 text-[#A3FF57]/40 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#040D21]/95 border-2 border-[#A3FF57]/50 shadow-[0_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center px-6 py-1.5">
                                <span className="font-black text-[#A3FF57] uppercase tracking-[0.3em] opacity-90 text-[8px] mb-0.5">
                                    Supervisor
                                </span>
                                <span className="font-black uppercase tracking-[0.05em] leading-none text-center text-base text-white">
                                    {settings.mainChurch.supervisorName}
                                </span>
                            </div>

                            <div className="flex gap-3 text-[9px] font-bold text-white/80 tracking-[0.15em] uppercase z-10 mt-4 flex-row justify-center">
                                {settings.mainChurch.supervisorPhone && (
                                    <div className="bg-[#040D21]/95 rounded-xl border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 shadow-md">
                                        <Phone className="w-3 h-3 text-[#A3FF57]" />
                                        <span className="truncate">{settings.mainChurch.supervisorPhone}</span>
                                    </div>
                                )}
                                {settings.mainChurch.supervisorEmail && (
                                    <div className="bg-[#040D21]/95 rounded-xl border border-[#1E3A6E]/50 flex items-center gap-2 px-3 py-1.5 shadow-md">
                                        <Mail className="w-3 h-3 text-[#A3FF57]" />
                                        <span className="truncate text-[8px] lowercase">{settings.mainChurch.supervisorEmail}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
