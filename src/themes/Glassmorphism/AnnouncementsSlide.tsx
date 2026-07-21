'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Phone, Mail, Church, Megaphone, Info, AlertCircle, Calendar, Users, Heart, BookOpen, Flame, Music, Star, Shield, Smile } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, getActiveAnnouncements } from '@/lib/utils';
import { CountdownCard } from '@/components/CountdownCard';

const AnnouncementIcon = ({ name, className, style, size = 24 }: { name: string; className?: string; style?: any; size?: number }) => {
    const icons: Record<string, any> = {
        bell: Bell,
        megaphone: Megaphone,
        info: Info,
        alert: AlertCircle,
        calendar: Calendar,
        users: Users,
        heart: Heart,
        book: BookOpen,
        flame: Flame,
        music: Music,
        star: Star,
        shield: Shield,
        smile: Smile
    };
    const IconComponent = icons[name] || Bell;
    return <IconComponent className={className} style={style} size={size} />;
};

export const GlassmorphismAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => getActiveAnnouncements(allAnnouncements), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full flex flex-col md:flex-row p-8 pt-10 gap-8 overflow-hidden bg-transparent relative">
            {/* Left Pillar: Announcements */}
            <div className="flex-1 flex flex-col min-w-0">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 mb-6 border-b border-white/5 pb-4"
                >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                        <Bell className="w-8 h-8 text-emerald-500 relative z-10 animate-bounce" />
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
                                        ? "border-emerald-500/40 bg-emerald-500/[0.03] shadow-[0_20px_40px_rgba(245,158,11,0.05)]"
                                        : "border-white/10 bg-white/[0.02]"
                                )}
                            >
                                {ann.priority > 0 && (
                                    <div className="absolute top-0 right-0 bg-emerald-500/20 border-b border-l border-emerald-500/40 px-6 py-2 rounded-bl-3xl z-10">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic text-glow-emerald">Urgente</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-5 mb-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg group-hover/ann:scale-110 transition-transform overflow-hidden flex-shrink-0",
                                        ann.priority > 0 ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" : "bg-white/5 border-white/10 text-white/40"
                                    )}>
                                        {ann.imageUrl ? (
                                            ann.imageUrl.startsWith('icon:') ? (
                                                <AnnouncementIcon name={ann.imageUrl.replace('icon:', '')} className="w-6 h-6 text-white" />
                                            ) : (
                                                <img src={ann.imageUrl} className="w-full h-full object-cover" alt="" />
                                            )
                                        ) : (
                                            <Bell className="w-6 h-6" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-[1.1] truncate flex-1 tracking-tighter">
                                        {ann.title}
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <p className="text-xl text-white/70 leading-relaxed italic border-l-4 border-emerald-500/20 pl-6 font-medium">
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
                <div className="w-[450px] shrink-0 flex flex-col h-full justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-grow flex flex-col items-center justify-center gap-8 py-6 w-full relative"
                    >
                        {/* Minister Section */}
                        <div className="w-full flex flex-col items-center justify-center relative overflow-hidden group/minister">
                            <div className={cn(
                                "relative mb-4",
                                settings.mainChurch?.supervisorName ? "w-36 h-36" : "w-56 h-56"
                            )}>
                                <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-0 group-hover/minister:opacity-100 transition-opacity duration-700" />
                                <div className={cn(
                                    "w-full h-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover/minister:scale-105 aspect-square",
                                    settings.mainChurch?.supervisorName ? "rounded-[1.5rem]" : "rounded-[2rem]"
                                )}>
                                    {minister.avatar ? (
                                        <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Church className={settings.mainChurch?.supervisorName ? "w-10 h-10 text-white/10" : "w-24 h-24 text-white/10"} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={cn(
                                "rounded-full border border-blue-500/30 bg-blue-500/10 font-black uppercase text-blue-400 text-center px-4 py-1 text-[8px] tracking-[0.2em] mb-2"
                            )}>
                                {minister.role || 'MINISTRO LOCAL'}
                            </div>

                            <h2 className={cn(
                                "font-black text-white italic tracking-tight uppercase leading-none text-center px-4",
                                settings.mainChurch?.supervisorName ? "text-xl mb-3" : "text-3xl mb-6"
                            )}>
                                {minister.name}
                            </h2>

                            <div className="w-full border-t border-white/5 space-y-2 pt-3">
                                {minister.phone && (
                                    <div className="flex items-center gap-4 text-white/60 justify-center">
                                        <div className="p-2 bg-white/10 rounded-xl group-hover/minister:bg-blue-500/20 transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="font-black italic tracking-widest text-sm">{minister.phone}</span>
                                    </div>
                                )}
                                {minister.email && (
                                    <div className="flex items-center gap-4 text-white/30 justify-center">
                                        <div className="p-2 bg-white/10 rounded-xl group-hover/minister:bg-blue-500/20 transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold tracking-tight truncate text-xs">{minister.email.toLowerCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="h-[1px] w-full bg-white/[0.05] my-1" />
                        )}

                        {/* Supervisor Section */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="w-full flex flex-col items-center justify-center relative overflow-hidden group/supervisor">
                                <div className="relative w-36 h-36 mb-4">
                                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-0 group-hover/supervisor:opacity-100 transition-opacity duration-700" />
                                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden border-4 border-white/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover/supervisor:scale-105 aspect-square">
                                        {settings.mainChurch.supervisorAvatar ? (
                                            <img src={settings.mainChurch.supervisorAvatar} className="w-full h-full object-cover" alt="Supervisor" />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                <Church className="w-10 h-10 text-white/10" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-2 font-black text-[8px] uppercase tracking-[0.2em] text-blue-400 text-center">
                                    Supervisor
                                </div>

                                <h2 className="text-xl font-black text-white italic tracking-tight uppercase leading-none mb-3 text-center px-4">
                                    {settings.mainChurch.supervisorName}
                                </h2>

                                <div className="w-full space-y-2 pt-3 border-t border-white/5">
                                    {settings.mainChurch.supervisorPhone && (
                                        <div className="flex items-center gap-4 text-white/60 justify-center">
                                            <div className="p-2 bg-white/10 rounded-xl group-hover/supervisor:bg-blue-500/20 transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black italic tracking-widest">{settings.mainChurch.supervisorPhone}</span>
                                        </div>
                                    )}
                                    {settings.mainChurch.supervisorEmail && (
                                        <div className="flex items-center gap-4 text-white/30 justify-center">
                                            <div className="p-2 bg-white/10 rounded-xl group-hover/supervisor:bg-blue-500/20 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold tracking-tight truncate">{settings.mainChurch.supervisorEmail.toLowerCase()}</span>
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
