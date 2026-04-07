'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Play, Pause, ChevronRight, ChevronLeft, 
    Monitor, Zap, ZapOff, Settings, RefreshCw,
    Layers, Clock, BarChart3, LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface AdministrativeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    slides: { id: string; component: React.ReactNode; enabled?: boolean }[];
    currentSlide: number;
    onSlideChange: (index: number) => void;
    isPaused: boolean;
    onTogglePause: () => void;
    settings: any;
}

export function AdministrativeOverlay({
    isOpen,
    onClose,
    slides,
    currentSlide,
    onSlideChange,
    isPaused,
    onTogglePause,
    settings
}: AdministrativeOverlayProps) {
    const { saveSettingsToCloud, setSettings, loadSettingsFromCloud } = useAppStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([
            loadSettingsFromCloud(),
            useAppStore.getState().loadAllSchedulesFromCloud(),
            useAppStore.getState().loadAnnouncementsFromCloud(),
            useAppStore.getState().loadThemeFromCloud()
        ]);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const togglePerf = async () => {
        const newValue = !settings?.lowPerformanceMode;
        setSettings({ lowPerformanceMode: newValue });
        await saveSettingsToCloud({ lowPerformanceMode: newValue });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-8 backdrop-blur-2xl bg-black/40"
            >
                {/* Backdrop Close Click */}
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative w-full max-w-4xl bg-[#0f172a]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                                <LayoutDashboard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Consola de Control <span className="text-primary/60 italic">Display</span></h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Gestión Táctica de Reproducción y Estado</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            
                            {/* Slide Control Section */}
                            <div className="md:col-span-12 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                        <Layers className="w-4 h-4" /> Carrusel de Contenido
                                    </h3>
                                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                        <span className="text-[10px] font-black uppercase text-slate-500">{currentSlide + 1} / {slides.length}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {slides.map((slide, idx) => (
                                        <button
                                            key={slide.id}
                                            onClick={() => onSlideChange(idx)}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 group overflow-hidden",
                                                currentSlide === idx 
                                                    ? "bg-primary border-primary text-black shadow-lg shadow-primary/20" 
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                                            )}
                                        >
                                            {currentSlide === idx && (
                                                <motion.div 
                                                    layoutId="slide-indicator"
                                                    className="absolute inset-0 bg-white opacity-10"
                                                />
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full z-10">
                                                {slide.id.replace('_', ' ')}
                                            </span>
                                            {currentSlide === idx && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black/60 animate-pulse" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={onTogglePause}
                                        className={cn(
                                            "flex-1 h-16 flex items-center justify-center gap-3 rounded-xl border transition-all text-sm font-black uppercase tracking-widest",
                                            isPaused 
                                                ? "bg-amber-500/20 border-amber-500/40 text-amber-500 hover:bg-amber-500/30" 
                                                : "bg-emerald-500/20 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/30"
                                        )}
                                    >
                                        {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                                        {isPaused ? 'Reanudar Rotación' : 'Pausar Rotación'}
                                    </button>
                                    <button
                                        onClick={() => onSlideChange((currentSlide + 1) % slides.length)}
                                        className="w-20 h-16 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="md:col-span-12 h-px bg-white/5 my-2" />

                            {/* System Settings Section */}
                            <div className="md:col-span-6 space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Rendimiento de Renderizado
                                </h3>
                                <button
                                    onClick={togglePerf}
                                    className={cn(
                                        "w-full p-6 rounded-xl border transition-all flex items-center gap-4 text-left group",
                                        settings?.lowPerformanceMode 
                                            ? "bg-emerald-500/20 border-emerald-500/40" 
                                            : "bg-blue-500/20 border-blue-500/40"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-lg flex items-center justify-center transition-transform group-active:scale-95",
                                        settings?.lowPerformanceMode ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                                    )}>
                                        {settings?.lowPerformanceMode ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-xs font-black uppercase tracking-widest", settings?.lowPerformanceMode ? "text-emerald-400" : "text-blue-400")}>
                                            Modo: {settings?.lowPerformanceMode ? 'Optimizado (Bajo Consumo)' : 'Fluido (Efectos Completos)'}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 opacity-60">
                                            {settings?.lowPerformanceMode ? 'Framer-motion limitado, filtros CSS desactivados' : 'Animaciones de 60fps y efectos de desenfoque activos'}
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className="md:col-span-6 space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Mantenimiento de Datos
                                </h3>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className={cn(
                                        "w-full p-6 rounded-xl border border-white/5 bg-white/5 transition-all flex items-center gap-4 text-left group",
                                        isRefreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className={cn("p-3 rounded-lg bg-slate-700 text-white", isRefreshing && "animate-spin")}>
                                        <RefreshCw className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-300">Sincronización Manual</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 opacity-60">Recargar horarios, avisos y temas desde la nube ahora mismo</p>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Footer / Status Bar */}
                    <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sincronización: En Tiempo Real</span>
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Tiempo de Slide: {settings?.iglesiaSlideDuration || 12}s</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-primary italic">Powered by Antigravity LLDM</span>
                            <span className="text-white/20">V3.6.1 Master</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
