'use client';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Phone, Mail, Building2, Megaphone, Info, AlertCircle, Calendar, Users, Heart, BookOpen, Flame, Music, Star, Shield, Smile } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, getActiveAnnouncements } from '@/lib/utils';

const AnnouncementIcon = ({ name, className, style, size = 18 }: { name: string; className?: string; style?: any; size?: number }) => {
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

export const LunaAnnouncements = () => {
    const allAnnouncements = useAppStore((state) => state.announcements);
    const settings = useAppStore((state) => state.settings);
    const announcements = useMemo(() => getActiveAnnouncements(allAnnouncements), [allAnnouncements]);
    const minister = useAppStore((state) => state.minister);

    return (
        <div className="h-full flex flex-col md:flex-row pl-[320px] pr-4 py-8 pt-24 gap-12 overflow-hidden bg-transparent relative" 
             style={{ fontFamily: "'Saira', sans-serif" }}>
            
            {/* 1. LEFT PILLAR: ANNOUNCEMENTS */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex flex-col mb-16">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <h2 className="text-5xl font-[100] lowercase leading-none tracking-tight">
                                anuncios <span className="text-white/20">importantes</span>
                            </h2>
                            {/* Title Flare Underline */}
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-3 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        </div>
                        <div className="px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary text-[10px] font-[500] tracking-[0.3em] uppercase self-end mb-4">
                            comunicación oficial
                        </div>
                    </div>
                </header>

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
                                    <div className="w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
                                        {ann.imageUrl ? (
                                            ann.imageUrl.startsWith('icon:') ? (
                                                <AnnouncementIcon name={ann.imageUrl.replace('icon:', '')} className="w-5 h-5 text-white" />
                                            ) : (
                                                <img src={ann.imageUrl} className="w-full h-full object-cover" alt="" />
                                            )
                                        ) : (
                                            <Bell className="w-5 h-5" />
                                        )}
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

            {/* 2. RIGHT PILLAR: MINISTER & SUPERVISOR */}
            {settings.showMinisterOnDisplay && (
                <div className="w-[480px] shrink-0 flex flex-col h-full justify-center gap-8 py-6 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center justify-center relative overflow-hidden w-full gap-8"
                    >
                        {/* Minister Section */}
                        <div className="flex flex-col items-center w-full">
                            <div className={cn(
                                "relative mb-4",
                                settings.mainChurch?.supervisorName ? "w-36 h-36" : "w-56 h-56"
                            )}>
                                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl grayscale transition-all duration-700 hover:grayscale-0 aspect-square">
                                    {minister.avatar ? (
                                        <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Building2 className={settings.mainChurch?.supervisorName ? "w-12 h-12 text-white/10" : "w-24 h-24 text-white/10"} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={cn(
                                "lowercase font-[300] tracking-[0.4em] text-white/40",
                                settings.mainChurch?.supervisorName ? "text-[8px] mb-0.5" : "text-[10px] mb-2"
                            )}>
                                {minister.role?.toLowerCase() || 'ministro local'}
                            </span>
                            <h2 className={cn(
                                "font-[200] capitalize tracking-tighter text-center text-white",
                                settings.mainChurch?.supervisorName ? "text-2xl mb-3" : "text-4xl mb-6"
                            )}>
                                {minister.name}
                            </h2>
                            <div className={cn(
                                "flex justify-center text-white/30 text-xs gap-6"
                            )}>
                                {minister.phone && (
                                    <div className="flex items-center gap-2 truncate">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="font-[100] tracking-widest">{minister.phone}</span>
                                    </div>
                                )}
                                {minister.email && (
                                    <div className="flex items-center gap-2 truncate text-white/20">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="font-[300] lowercase tracking-wide truncate">{minister.email.toLowerCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="h-[1px] w-full bg-white/10 my-1" />
                        )}

                        {/* Supervisor Section */}
                        {settings.mainChurch?.supervisorName && (
                            <div className="flex flex-col items-center w-full">
                                <div className="relative w-36 h-36 mb-4">
                                    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl grayscale transition-all duration-700 hover:grayscale-0 aspect-square">
                                        {settings.mainChurch.supervisorAvatar ? (
                                            <img src={settings.mainChurch.supervisorAvatar} className="w-full h-full object-cover" alt="Supervisor" />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                <Building2 className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[8px] lowercase font-[300] tracking-[0.4em] text-white/40 mb-1">
                                    supervisor
                                </span>
                                <h2 className="text-2xl font-[200] capitalize tracking-tighter mb-3 text-center text-white">
                                    {settings.mainChurch.supervisorName}
                                </h2>
                                <div className="flex justify-center gap-6 text-white/30 text-xs">
                                    {settings.mainChurch.supervisorPhone && (
                                        <div className="flex items-center gap-2 truncate">
                                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="font-[100] tracking-widest">{settings.mainChurch.supervisorPhone}</span>
                                        </div>
                                    )}
                                    {settings.mainChurch.supervisorEmail && (
                                        <div className="flex items-center gap-2 truncate text-white/20">
                                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="font-[300] lowercase tracking-wide truncate">{settings.mainChurch.supervisorEmail.toLowerCase()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
