'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shield, Church, Cross, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GlassmorphismClock = ({ now, isMounted, settings }: { now: Date, isMounted: boolean, settings: any }) => {
    return (
        <div className="fixed bottom-24 left-16 z-[200] scale-75 origin-bottom-left pointer-events-none font-sora">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-stretch overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.7)] rounded-[2.5rem] border border-white/20 bg-white/[0.03] backdrop-blur-[40px]"
            >
                {/* Brand Identity Module */}
                <div
                    className="w-20 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: settings.primaryColor }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/30 pointer-events-none" />
                    <div className="w-12 h-12 flex items-center justify-center relative z-10">
                        {settings.churchIcon === 'custom' ? (
                            <img
                                src={settings.customIconUrl || settings.churchLogoUrl || "/flama-oficial.svg"}
                                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                                alt="Church"
                            />
                        ) : (
                            <div className="text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
                                {(() => {
                                    const icons = { shield: Shield, church: Church, cross: Cross, star: Star, heart: Heart };
                                    const Icon = (icons as any)[settings.churchIcon] || Shield;
                                    return <Icon className="w-9 h-9" strokeWidth={2.5} />;
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Clock Analytics */}
                <div className="px-16 py-4 flex items-center bg-black/30">
                    <div className="flex items-center gap-10">
                        {/* Time Section */}
                        <div className="flex items-baseline gap-5">
                            <span className="text-[5rem] font-bold text-white leading-none tracking-tighter drop-shadow-2xl">
                                {isMounted ? format(now, 'HH:mm') : '--:--'}
                            </span>
                            <div className="flex flex-col -translate-y-2">
                                <span className="text-2xl font-black text-white/40 mb-1 tabular-nums leading-none">
                                    {isMounted ? format(now, 'ss') : '--'}
                                </span>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] leading-none">
                                    {isMounted ? format(now, 'a') : '--'}
                                </span>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="w-px h-16 bg-white/10" />

                        {/* Date Section */}
                        <div className="flex flex-col justify-center gap-1">
                            <span className="text-3xl font-black text-white/80 uppercase tracking-tight italic leading-none">
                                {isMounted ? format(now, 'EEEE', { locale: es }) : '---'}
                            </span>
                            <span className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase leading-none">
                                {isMounted ? format(now, 'd MMM yyyy', { locale: es }) : '--- --- ---'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
