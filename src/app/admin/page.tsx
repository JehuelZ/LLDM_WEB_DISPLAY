'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar, Users, User, FileText, Settings, ExternalLink,
    Sun, Moon, Monitor, Church, Cross, Star, Heart, Flame,
    Upload, X, ChevronDown, ChevronUp, Bell, FilePlus, AlertCircle, Save, Trash2, Plus,
    ChevronLeft, ChevronRight, Shirt, Music2, Baby, Briefcase, Mail, Phone, Camera, Search, Move,
    Languages, CheckCircle, Send, Reply, UserPlus, Edit2, UserCheck, Crown, BadgeCheck,
    Sparkles, CalendarDays, CalendarClock, Megaphone, TrendingUp, Activity, LayoutDashboard, Clock, Target, Contrast,
    Lock, ArrowRight, LogOut, Info, XCircle, Type, ShieldAlert,
    Sunrise, BookOpen, Palette, Layers, Eye
} from "lucide-react";
import Link from 'next/link';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, subDays, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore, AppSettings, UserProfile } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { cn, compressImage, getLocalDateString } from '@/lib/utils';
import { CitySearch } from '@/components/CitySearch';
import { ImageEditor } from '@/components/ImageEditor';
import { CountdownCard } from '@/components/CountdownCard';
import { ALL_THEMES } from '@/themes';
import TactileAdmin from './TactileAdmin';
import LunaAdmin from './LunaAdmin';
import { TactileAreaChart, TactileBarChart, TactilePieChart } from '@/components/ui/Charts';
import PremiumCalendar from '@/components/ui/PremiumCalendar';

const MessagesPanel = ({
    messages,
    onMarkRead,
    onReply,
    settings
}: {
    messages: any[],
    onMarkRead: (id: string) => void,
    onReply: (recipientId: string, content: string) => Promise<void>,
    settings: AppSettings
}) => {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleSendReply = async (recipientId: string) => {
        if (!replyText.trim()) return;
        await onReply(recipientId, replyText);
        setReplyText('');
        setReplyingTo(null);
    };

    return (
        <Card className={cn(
            "card border-none relative overflow-hidden group transition-all duration-500",
            settings.adminTheme === 'primitivo' 
                ? "bg-[#101420] rounded-[1.5rem] border border-white/[0.03] shadow-none" 
                : "bg-[var(--tactile-panel-bg)] rounded-none glass-card shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        )}>
            <div className={cn(
                "absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 pointer-events-none transition-all duration-700",
                settings.adminTheme === 'primitivo' ? "bg-transparent" : "bg-[var(--tactile-item-hover)]"
            )} />
            <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="relative z-10 flex items-center gap-4 text-2xl font-black uppercase tracking-tighter text-foreground drop-shadow-sm w-full">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 flex items-center justify-center shadow-none transition-all",
                                    settings.adminTheme === 'primitivo' ? "bg-white/5 rounded-2xl border border-white/[0.05]" : "bg-[var(--tactile-item-hover)] rounded-none border border-[var(--tactile-border)]"
                                )}>
                                    <Mail className={cn("h-4 w-4", settings.adminTheme === 'primitivo' ? "text-white/70" : "text-foreground")} />
                                </div>
                                <span className="whitespace-nowrap text-foreground">inbox de <span className={cn("text-foreground underline underline-offset-8", settings.adminTheme === 'primitivo' ? "decoration-foreground/10" : "decoration-primary/30")}>mensajes</span></span>
                            </div>
                            <div className={cn(
                                "flex-1 h-px ml-4",
                                settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" : "bg-gradient-to-r from-[var(--tactile-border-strong)] via-[var(--tactile-border)] to-transparent"
                            )} />
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-3 ml-1">comunicaciones de la congregación</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="grid grid-cols-1 gap-5 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-white/20">
                            <div className={cn(
                                "w-20 h-20 flex items-center justify-center mb-8 border transition-all",
                                settings.adminTheme === 'primitivo' ? "bg-white/[0.03] rounded-[2rem] border-white/[0.03]" : "bg-[var(--tactile-inner-bg-alt)] border-[var(--tactile-border)] rounded-none"
                            )}>
                                <Mail className={cn("h-10 w-10 opacity-5", settings.adminTheme === 'primitivo' ? "text-white" : "text-foreground")} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">bandeja de entrada vacía</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "p-6 border transition-all duration-500 flex flex-col gap-6 relative group overflow-hidden backdrop-blur-xl",
                                    settings.adminTheme === 'primitivo' ? "shadow-none rounded-3xl" : "shadow-2xl rounded-none",
                                    msg.isRead
                                        ? "bg-[var(--tactile-inner-bg)]/50 border-[var(--tactile-border)] opacity-50 hover:opacity-100"
                                        : (settings.adminTheme === 'primitivo' ? "bg-black/40 border-amber-400/20 ring-1 ring-amber-400/10 shadow-none" : "bg-[var(--tactile-panel-bg)] border-[var(--tactile-border-strong)] ring-1 ring-[var(--tactile-border)] shadow-2xl")
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 flex items-center justify-center text-sm font-black transition-all duration-500",
                                            settings.adminTheme === 'primitivo' ? "rounded-2xl" : "rounded-none",
                                            msg.isRead 
                                                ? (settings.adminTheme === 'primitivo' ? "bg-black/60 text-white/30 border border-white/[0.03]" : "bg-[var(--tactile-inner-bg-alt)] text-muted-foreground border border-[var(--tactile-border)]")
                                                : (settings.adminTheme === 'primitivo' ? "bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]" : "bg-foreground text-background shadow-2xl shadow-foreground/10 border border-[var(--tactile-border-strong)]")
                                        )}>
                                            {msg.senderName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={cn(
                                                "font-black text-white text-base flex items-center gap-3 tracking-tighter",
                                                !msg.isRead && settings.adminTheme === 'primitivo' && "text-amber-400"
                                            )}>
                                                {msg.senderName}
                                                {!msg.isRead && <span className={cn(
                                                    "w-2 h-2 animate-pulse",
                                                    settings.adminTheme === 'primitivo' ? "bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
                                                )} />}
                                            </h4>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[9px] text-white uppercase font-black tracking-widest leading-none">
                                                    {(() => {
                                                        try {
                                                            const dateStr = msg.createdAt || msg.created_at;
                                                            if (!dateStr) return 'Reciente';
                                                            const d = new Date(dateStr);
                                                            if (isNaN(d.getTime())) return 'Reciente';
                                                            return format(d, 'dd MMM, HH:mm', { locale: es }).toLowerCase();
                                                        } catch (e) {
                                                            return 'Reciente';
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!msg.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onMarkRead(msg.id)}
                                                className={cn(
                                                    "h-10 w-10 transition-all active:scale-95 border",
                                                    settings.adminTheme === 'primitivo' ? "rounded-xl bg-white/5 text-white/50 border-white/[0.05] hover:bg-white/10 hover:text-white" : "rounded-none bg-[var(--tactile-item-hover)] border-[var(--tactile-border)] text-muted-foreground hover:text-foreground hover:border-[var(--tactile-border-strong)]"
                                                )}
                                                title="Marcar leído"
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                            className={cn(
                                                "h-10 w-10 transition-all active:scale-95 border",
                                                settings.adminTheme === 'primitivo' ? "rounded-xl" : "rounded-none",
                                                replyingTo === msg.id 
                                                    ? (settings.adminTheme === 'primitivo' ? "text-white border-white/[0.1] bg-white/10" : "text-white border-white/[0.15] bg-white/10")
                                                    : (settings.adminTheme === 'primitivo' ? "text-white/30 hover:text-white bg-white/5 border-white/[0.03]" : "text-muted-foreground hover:text-foreground bg-[var(--tactile-item-hover)] border-[var(--tactile-border)]")
                                            )}
                                            title="Responder"
                                        >
                                            <Reply className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-6 border transition-all",
                                    settings.adminTheme === 'primitivo' ? "bg-[#0a0a0a]/40 rounded-2xl border-white/[0.03] shadow-none" : "bg-[var(--tactile-inner-bg)] rounded-none border-[var(--tactile-border)] shadow-inner"
                                )}>
                                    <p className="text-[14px] text-white/80 leading-relaxed font-light ">{msg.content}</p>
                                </div>

                                {replyingTo === msg.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={cn(
                                            "mt-4 space-y-6 p-6 border relative overflow-hidden",
                                            settings.adminTheme === 'primitivo' ? "bg-white/[0.03] rounded-2xl border-white/[0.05] shadow-none" : "bg-[var(--tactile-bg)]/60 rounded-none border-[var(--tactile-border-strong)] shadow-2xl"
                                        )}
                                    >
                                        <div className={cn("absolute top-0 left-0 w-[2px] h-full", settings.adminTheme === 'primitivo' ? "bg-white/20" : "bg-[var(--tactile-border-strong)]")} />
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`escribe tu respuesta a ${msg.senderName.split(' ')[0].toLowerCase()}...`}
                                            className={cn(
                                                "w-full h-32 bg-black/40 p-5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all resize-none font-light",
                                                settings.adminTheme === 'primitivo' ? "rounded-xl border border-white/[0.03] focus:border-white/[0.1]" : "rounded-none border border-[var(--tactile-border)] focus:border-primary/50"
                                            )}
                                        />
                                        <div className="flex justify-end gap-3">
                                            <Button size="sm" variant="ghost" className={cn(
                                                "h-11 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white transition-all",
                                                settings.adminTheme === 'primitivo' ? "rounded-xl text-white/20" : "rounded-none text-white/40"
                                            )} onClick={() => setReplyingTo(null)}>cancelar</Button>
                                            <Button size="sm" className={cn(
                                                "h-11 text-[10px] font-black uppercase tracking-[0.3em] px-10 transition-all hover:translate-y-[-2px] active:translate-y-0 shadow-none",
                                                settings.adminTheme === 'primitivo' ? "bg-[#121523] text-white border border-white/[0.05] hover:bg-slate-800 rounded-xl" : "bg-foreground text-background hover:bg-muted rounded-none shadow-foreground/10 shadow-2xl"
                                            )} onClick={() => handleSendReply(msg.senderId)}>
                                                <Send className="w-4 h-4 mr-3" /> enviar respuesta
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Utility to remove accents/diacritics for easier searching
const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const CustomSelect = ({
    value,
    onChange,
    options,
    searchable = true,
}: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string; isHeader?: boolean }[];
    searchable?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable
        ? options.filter(opt => normalizeText(opt.label).includes(normalizeText(searchQuery)))
        : options;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="premium-select-trigger"
            >
                <span className="truncate">{selectedOption?.label || 'Seleccionar...'}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[120]" onClick={() => {
                        setIsOpen(false);
                        setSearchQuery('');
                    }} />
                    <div className="premium-dropdown flex flex-col max-h-[400px]">
                        {searchable && (
                            <div className="p-2 border-b border-border/10 sticky top-0 bg-popover/95 backdrop-blur-xl z-10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar miembro..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-foreground/5 border border-border/20 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="overflow-y-auto custom-scrollbar p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, i) => (
                                    opt.isHeader ? (
                                        <div key={`header-${i}`} className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-t border-border/5 first:border-0 mt-3 first:mt-1">
                                            {opt.label}
                                        </div>
                                    ) : (
                                        <div
                                            key={opt.value}
                                            className="premium-option"
                                            data-selected={value === opt.value}
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            {opt.label}
                                        </div>
                                    )
                                ))
                            ) : (
                                <div className="py-8 text-center text-xs text-muted-foreground ">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const MiniCountdown = () => {
    const { settings } = useAppStore();
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!settings.showCountdown || !settings.countdownDate) return;

        const calculateTimeLeft = () => {
            try {
                if (!settings.countdownDate) return false;

                const target = parseISO(settings.countdownDate);
                if (isNaN(target.getTime())) return false;

                const now = new Date();
                const diff = target.getTime() - now.getTime();

                if (diff <= 0) {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    return false;
                }

                setTimeLeft({
                    days: differenceInDays(target, now),
                    hours: differenceInHours(target, now) % 24,
                    minutes: differenceInMinutes(target, now) % 60,
                    seconds: differenceInSeconds(target, now) % 60,
                });
                return true;
            } catch (e) {
                console.error("Countdown error:", e);
                return false;
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        const timer = setInterval(() => {
            if (!calculateTimeLeft()) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [settings.showCountdown, settings.countdownDate]);

    if (!settings.showCountdown || !timeLeft) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase ">Desactivado</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Activar en Configuración</div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {settings.countdownLogoUrl && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden shrink-0">
                    <img src={settings.countdownLogoUrl} className="w-full h-full object-contain" alt="Logo Evento" />
                </div>
            )}
            <div className="flex gap-2">
                {[
                    { label: 'D', value: timeLeft.days },
                    { label: 'H', value: timeLeft.hours },
                    { label: 'M', value: timeLeft.minutes }
                ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="text-3xl font-black text-foreground tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                            {unit.value.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[8px] font-black text-primary/60 uppercase">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeeklyAttendanceChart = ({ settings }: { settings: AppSettings }) => {
    const { loadDetailedWeeklyStats, members, authSession } = useAppStore();
    const [weekStart, setWeekStart] = useState<Date | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!weekStart) {
            setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
        }
    }, [weekStart]);

    const weekDays = useMemo(() => {
        if (!weekStart) return [];
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }, [weekStart]);

    const formattedDays = useMemo(() => {
        return weekDays.map(d => format(d, 'yyyy-MM-dd'));
    }, [weekDays]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await loadDetailedWeeklyStats(formattedDays);
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [formattedDays, loadDetailedWeeklyStats, authSession]);

    const changeWeek = (direction: number) => {
        setWeekStart(prev => prev ? addDays(prev, direction * 7) : startOfWeek(new Date(), { weekStartsOn: 0 }));
    };

    return (
        <Card className="glass-card border-none relative overflow-hidden group shadow-sm h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--tactile-item-hover)] rounded-none blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
                <div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3 text-foreground" />
                        distribución semanal de asistencia
                    </CardTitle>
                    <CardDescription className="text-[9px] uppercase font-bold text-muted-foreground mt-1">
                        {weekDays.length > 0 ? `semana del ${format(weekDays[0], 'd MMM', { locale: es })} al ${format(weekDays[6], 'd MMM', { locale: es })}` : 'cargando calendario...'}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-none border-[var(--tactile-border)] bg-[var(--tactile-item-hover)] hover:bg-[var(--tactile-panel-bg)]/20"
                        onClick={() => changeWeek(-1)}
                    >
                        <ChevronLeft className="h-3 w-3 text-white" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[8px] font-black uppercase tracking-widest hover:bg-[var(--tactile-item-hover)] text-foreground"
                        onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
                    >
                        hoy
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-none border-[var(--tactile-border)] bg-[var(--tactile-item-hover)] hover:bg-[var(--tactile-panel-bg)]/20"
                        onClick={() => changeWeek(1)}
                        disabled={!weekStart || weekStart >= startOfWeek(new Date(), { weekStartsOn: 0 })}
                    >
                        <ChevronRight className="h-3 w-3 text-white" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
                <div className="h-64 relative">
                    <TactileBarChart 
                        data={stats} 
                        totalMembers={members.filter(m => m.status === 'Activo').length} 
                    />
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_12px_#3b82f6aa]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">oración 5 am</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 rounded-full bg-[#f43f5e] shadow-[0_0_12px_#f43f5eaa]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">doctrina 9 am</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_12px_#f59e0baa]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">culto de tarde</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const GOOGLE_FONTS = [
    { id: 'outfit', name: 'Outfit', category: 'Modern Geometric Sans' },
    { id: 'sora', name: 'Sora', category: 'High-Tech Sans' },
    { id: 'inter', name: 'Inter', category: 'Professional Sans' },
    { id: 'montserrat', name: 'Montserrat', category: 'Classic Geometric' },
    { id: 'poppins', name: 'Poppins', category: 'Soft Sans Serif' },
    { id: 'lexend', name: 'Lexend', category: 'Readability Focused' },
    { id: 'orbitron', name: 'Orbitron', category: 'Cyberpunk Display' },
    { id: 'black-ops', name: 'Black Ops One', category: 'Military Display' },
    { id: 'syne', name: 'Syne', category: 'Avant-Garde Display' },
    { id: 'playfair', name: 'Playfair Display', category: 'Elegant Serif' },
    { id: 'lora', name: 'Lora', category: 'Classic Serif' },
    { id: 'merriweather', name: 'Merriweather', category: 'Newspaper Serif' },
    { id: 'eb-garamond', name: 'EB Garamond', category: 'Formal Luxury Serif' },
    { id: 'roboto', name: 'Roboto', category: 'Standard Modern' },
    { id: 'open-sans', name: 'Open Sans', category: 'Neutral Universal' },
    { id: 'lato', name: 'Lato', category: 'Humanist Sans' },
    { id: 'bebas-neue', name: 'Bebas Neue', category: 'Condensed Impact' },
    { id: 'anton', name: 'Anton', category: 'Heavy Display' },
    { id: 'righteous', name: 'Righteous', category: 'Art Deco Display' },
    { id: 'cinzel', name: 'Cinzel', category: 'Classical Decorative' },
    { id: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Premium Code' },
    { id: 'source-code-pro', name: 'Source Code Pro', category: 'Professional Monospace' },
    { id: 'archivo-black', name: 'Archivo Black', category: 'Wide Impact' },
    { id: 'dm-serif-display', name: 'DM Serif Display', category: 'Bold Editorial' }
];

function AdminDashboardContent({ hideLayout = false }: { hideLayout?: boolean }) {
    const {
        theme, setTheme,
        monthlySchedule, currentDate,
        specialEventTitle, setSpecialEventTitle,
        calendarStyles, setCalendarStyles,
        setScheduleForDay, setCurrentDate,
        settings, setSettings,
        uniforms, addUniform, removeUniform,
        uniformSchedule, setUniformForDate,
        kidsAssignments, setKidsAssignment,
        minister, setMinister,
        uploadAvatar,
        updateProfileInCloud,
        saveScheduleDayToCloud,
        saveThemeToCloud,
        loadDayScheduleFromCloud,
        loadAllSchedulesFromCloud,
        loadThemeFromCloud,
        saveSettingsToCloud,
        loadSettingsFromCloud,
        loadUniformsFromCloud,
        saveUniformToCloud,
        deleteUniformFromCloud,
        saveUniformForDateToCloud,
        saveKidsAssignmentToCloud,
        loadKidsAssignmentsFromCloud,
        members,
        loadMembersFromCloud,
        addMemberToCloud,
        deleteMemberFromCloud,
        loadCloudMessages,
        sendCloudMessage,
        markMessageAsRead,
        messages,
        currentUser,
        setCurrentUser,
        saveRecurringScheduleToCloud,
        seedMonthSchedule,
        subscribeToMessages,
        authSession,
        signOut,
        loadAttendanceFromCloud,
        attendanceRecords,
        showNotification,
        notification,
        hideNotification,
        subscribeToProfiles,
        loadMonthlyIntelligenceStats
    } = useAppStore();

    const shouldHideLayout = hideLayout || settings.adminTheme === 'luna';

    const [mounted, setMounted] = useState(false);
    const [monthlyStats, setMonthlyStats] = useState<{ label: string, value: number }[]>([]);
    
    const [intelligenceRange, setIntelligenceRange] = useState<'month' | 30 | 15 | 7>(7);
    
    useEffect(() => {
        const loadStats = async () => {
            const stats = await loadMonthlyIntelligenceStats(intelligenceRange);
            setMonthlyStats(stats);
        };
        
        // Cargar estadísticas si está montado y tenemos sesión (o si es localhost sin sesión)
        if (mounted) {
            loadStats();
        }
    }, [mounted, loadMonthlyIntelligenceStats, authSession, intelligenceRange]);

    const displayStats = monthlyStats.length > 0 ? monthlyStats : [
        { label: 'ENE', value: 0 },
        { label: 'FEB', value: 0 },
        { label: 'MAR', value: 0 },
        { label: 'ABR', value: 0 },
        { label: 'MAY', value: 0 },
        { label: 'JUN', value: 0 },
    ];

    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [editingImageTarget, setEditingImageTarget] = useState<{ type: 'minister' | 'member', id?: string } | null>(null);

    const [newUniform, setNewUniform] = useState({ name: '', category: 'Adulto' as 'Adulto' | 'Niño' });
    const [isSaving, setIsSaving] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '', email: '', phone: '', role: 'Miembro', gender: 'Varon', category: 'Varon', member_group: ''
    });
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editingRole, setEditingRole] = useState('Miembro');

    const searchParams = useSearchParams();
    const [fontSearch, setFontSearch] = useState('');
    const [focusedFontIndex, setFocusedFontIndex] = useState(0);

    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
    const [configSubTab, setConfigSubTab] = useState<'general' | 'pantalla' | 'estetica'>('general');
    const [demoMode, setDemoMode] = useState(false);
    const [demoFluctuation, setDemoFluctuation] = useState(0);
    const [recentCheckins, setRecentCheckins] = useState<{name: string, time: string}[]>([]);

    useEffect(() => {
        if (!demoMode) {
            setRecentCheckins([]);
            setDemoFluctuation(0);
            return;
        }

        const names = ['Abraham Diaz', 'Eliab Aguilar', 'Jehuel Zuniga', 'Primitivo G.', 'Moises S.', 'Daniel R.', 'Isaac M.'];
        
        const interval = setInterval(() => {
            // Fluctuate percentage slightly
            setDemoFluctuation(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const next = prev + change;
                return Math.abs(next) > 3 ? prev : next;
            });

            // Add a new checkin every few seconds
            if (Math.random() > 0.7) {
                const name = names[Math.floor(Math.random() * names.length)];
                const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setRecentCheckins(prev => [{name, time}, ...prev].slice(0, 3));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [demoMode]);

    // Sync state with query param
    const queryTab = searchParams.get('tab') || 'dashboard';

    useEffect(() => {
        const aliasMap: Record<string, string> = {
            'mensajes': 'dashboard',
            'anuncios-resumen': 'dashboard',
            'horarios': 'horarios',
            'temas': 'contenido',
            'contenido': 'contenido',
            'ajustes': 'configuracion',
            'configuracion': 'configuracion'
        };

        const mappedTab = aliasMap[queryTab] || queryTab;

        const validTabs = ['dashboard', 'horarios', 'contenido', 'coros', 'configuracion', 'miembros', 'perfil'];

        if (mappedTab && validTabs.includes(mappedTab)) {
            setActiveTab(mappedTab);
        } else {
            setActiveTab('dashboard');
        }
    }, [queryTab]);
    const [memberFilter, setMemberFilter] = useState('all');
    const [memberSearch, setMemberSearch] = useState('');

    useEffect(() => {
        setMounted(true);

        // Ensure we start with TODAY's date for real-time data accuracy
        const todayStr = getLocalDateString(new Date());
        if (currentDate !== todayStr) {
            setCurrentDate(todayStr);
        }

        loadDayScheduleFromCloud(currentDate);
        loadAllSchedulesFromCloud();
        loadThemeFromCloud();
        loadUniformsFromCloud();
        loadKidsAssignmentsFromCloud(currentDate);
        loadSettingsFromCloud();
        loadMembersFromCloud();
        loadCloudMessages();
        loadAttendanceFromCloud(currentDate);

        // Listeners for layout-specific events if any
        // Preload Google Fonts for the Selector Gallery (including weights)
        const fontList = GOOGLE_FONTS.map(f => f.name.replace(/\s+/g, '+')).join('|');
        const linkId = 'admin-font-preloader';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontList}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
            document.head.appendChild(link);
        }

        const handleTabSync = () => {
            // Let the useEffect with queryTab handle it after URL changes or dispatch
        };
        window.addEventListener('tab-change', handleTabSync);

        // Suscribirse a mensajes, ajustes y perfiles en tiempo real
        const unsubMessages = subscribeToMessages();
        const unsubSettings = useAppStore.getState().subscribeToSettings();
        const unsubProfiles = useAppStore.getState().subscribeToProfiles();

        return () => {
            unsubMessages();
            unsubSettings();
            unsubProfiles();
            window.removeEventListener('tab-change', handleTabSync);
        };
    }, [currentDate, loadDayScheduleFromCloud, loadAllSchedulesFromCloud, loadThemeFromCloud, loadUniformsFromCloud, loadKidsAssignmentsFromCloud, loadSettingsFromCloud, loadMembersFromCloud, loadCloudMessages, subscribeToMessages]);

    const handleThemePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setIsSaving(true);
            try {
                // Usamos el cargador genérico para el PDF
                const publicUrl = await uploadAvatar('theme-file', file);
                if (publicUrl) {
                    const updatedTheme = { ...theme, fileUrl: publicUrl };
                    setTheme(updatedTheme);
                    await saveThemeToCloud(updatedTheme);
                    showNotification('✅ PDF del tema subido y guardado.');
                }
            } catch (error) {
                console.error("Error uploading PDF:", error);
                showNotification('❌ Error al subir el PDF.', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleMinisterAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            try {
                const compressedFile = await compressImage(file);
                const publicUrl = await uploadAvatar('minister', compressedFile);
                if (publicUrl) {
                    setMinister({ ...minister, avatar: publicUrl });
                    // Guardar inmediatamente en la nube
                    await saveSettingsToCloud({ ministerAvatar: publicUrl });
                    // Si el ministro tiene un ID real en el sistema, actualizamos su perfil
                    if (minister.id && !minister.id.includes('mock')) {
                        await updateProfileInCloud(minister.id, { avatar: publicUrl });
                    }
                    showNotification('✅ Foto del ministro actualizada y guardada.');
                } else {
                    showNotification('❌ No se pudo subir la imagen. Verifique que el bucket "avatars" existe en Supabase con permisos públicos.', 'error');
                }
            } catch (error) {
                console.error("Error uploading avatar:", error);
                showNotification(`❌ Error al subir imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };
    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            try {
                const compressed = await compressImage(file, 400, 400);
                const publicUrl = await uploadAvatar('church-icon', compressed);
                if (publicUrl) {
                    await saveSettingsToCloud({
                        churchIcon: 'custom',
                        customIconUrl: publicUrl,
                        churchLogoUrl: undefined
                    });
                    showNotification('Escudo de la iglesia actualizado.');
                }
            } catch (error) {
                console.error("Error uploading icon:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleCustomLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            try {
                const compressed = await compressImage(file, 800, 800);
                const publicUrl = await uploadAvatar(`custom-logo-${slot}`, compressed);
                if (publicUrl) {
                    const settingKey = `customLogo${slot}` as keyof AppSettings;
                    await saveSettingsToCloud({
                        [settingKey]: publicUrl
                    });
                    showNotification(`Logo ${slot} actualizado.`);
                }
            } catch (error) {
                console.error(`Error uploading custom logo ${slot}:`, error);
            } finally {
                setIsSaving(false);
            }
        }
    };


    const currentDaySchedule = monthlySchedule[currentDate] || {
        date: currentDate,
        slots: {
            '5am': { time: '5:00 AM', type: 'prayer', leaderId: '' },
            '9am': { time: '9:00 AM', type: 'prayer', consecrationLeaderId: '', doctrineLeaderId: '' },
            'evening': { time: '7:00 PM', type: 'regular', leaderIds: [] }
        }
    };

    type SlotTime = '5am' | '9am' | 'evening';

    const updateSlot = async (slot: SlotTime, updates: any) => {
        if (!currentDaySchedule) return;

        const newSlots = {
            ...currentDaySchedule.slots,
            [slot]: {
                ...currentDaySchedule.slots[slot],
                ...updates
            }
        };

        setScheduleForDay(currentDate, {
            ...currentDaySchedule,
            slots: newSlots
        });

        // Auto-save to cloud
        try {
            await saveScheduleDayToCloud(currentDate, newSlots);
        } catch (error) {
            console.error("Error auto-saving schedule:", error);
        }
    };

    const handleRecurringSave = async (slot: any, leaderIdOrName: string, recurrence: 'month' | 'next') => {
        if (!leaderIdOrName) return;

        // Basic check to see if it's a UUID (names won't have dashes and won't match this length)
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leaderIdOrName);

        if (!isUuid) {
            showNotification("Selecciona un hermano de la lista desplegable antes de usar la repetición. No se pueden repetir nombres escritos manualmente.", 'warning');
            return;
        }

        setIsSaving(true);
        try {
            await saveRecurringScheduleToCloud(currentDate, slot, leaderIdOrName, recurrence);
            showNotification('Programación recurrente guardada con éxito.');
        } catch (e) {
            console.error(e);
            showNotification('Error al guardar la programación.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const memberOptions = useMemo(() => {
        const base = [{ value: '', label: 'Sin asignar' }];

        // Define display groups and their internal IDs (normalized)
        const categories = [
            { id: 'casados', label: 'CASADOS / CASADAS', variants: ['casados', 'casadas'] },
            { id: 'jovenes', label: 'JÓVENES', variants: ['jovenes', 'jóvenes'] },
            { id: 'solos', label: 'SOLOS Y SOLAS', variants: ['solos y solas', 'solos', 'solas', 'soltero', 'solteros', 'soltera', 'solteras'] },
            { id: 'ninos', label: 'NIÑOS / NIÑAS', variants: ['niños', 'niñas', 'niño', 'niña'] },
        ];

        let groupedItems: any[] = [];
        let assignedMemberIds = new Set<string>();

        // Process fixed categories
        categories.forEach(cat => {
            const groupMembers = members.filter(m => {
                const group = m.member_group?.toLowerCase().trim() || '';
                return cat.variants.some(v => group.includes(v)) || cat.variants.includes(group);
            }).sort((a, b) => a.name.localeCompare(b.name));

            if (groupMembers.length > 0) {
                groupedItems.push({ value: `header-${cat.id}`, label: cat.label, isHeader: true });
                groupMembers.forEach(m => {
                    groupedItems.push({ value: m.id, label: m.name });
                    assignedMemberIds.add(m.id);
                });
            }
        });

        // Add remaining members to "OTROS"
        const remainingMembers = members
            .filter(m => !assignedMemberIds.has(m.id))
            .sort((a, b) => a.name.localeCompare(b.name));

        if (remainingMembers.length > 0) {
            groupedItems.push({ value: 'header-other', label: 'OTROS / SIN GRUPO', isHeader: true });
            remainingMembers.forEach(m => {
                groupedItems.push({ value: m.id, label: m.name });
            });
        }

        return [...base, ...groupedItems];
    }, [members]);

    const similarMembers = useMemo(() => {
        if (!newMember.name && !newMember.email) return [];
        const nameQuery = newMember.name.toLowerCase().trim();
        const emailQuery = newMember.email.toLowerCase().trim();

        if (nameQuery.length < 3 && !emailQuery) return [];

        return members.filter(m => {
            const nameMatch = nameQuery.length >= 3 && m.name.toLowerCase().includes(nameQuery);
            const emailMatch = emailQuery && m.email?.toLowerCase().includes(emailQuery);
            return nameMatch || emailMatch;
        }).slice(0, 3);
    }, [members, newMember.name, newMember.email]);

    const navigateDay = (direction: number) => {
        const date = new Date(currentDate + 'T12:00:00'); // Midday to avoid TZ issues
        date.setDate(date.getDate() + direction);
        setCurrentDate(getLocalDateString(date));
    };

    // --- Pre-calculate Statistics ---
    const todayRecords = attendanceRecords[currentDate] || [];
    const attendedCount = demoMode ? (Math.round(members.length * 0.74) + demoFluctuation) : todayRecords.filter(r => r.present).length;
    const totalMembersCount = members.filter(m => m.status === 'Activo').length;
    const attendancePercentage = totalMembersCount > 0 ? Math.round((attendedCount / totalMembersCount) * 100) : 0;
    const pendingCount = totalMembersCount - attendedCount;

    // Monthly Progress Calculation
    const getMonthProgress = () => {
        const today = new Date(currentDate + 'T12:00:00');
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        const days = eachDayOfInterval({ start, end });

        let totalSlots = 0;
        let filledSlots = 0;
        const missingDays: string[] = [];

        days.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const sched = monthlySchedule[dateStr];

            // Primary slots: 5am, 9am Consecration, 9am Doctrine, 7pm Leader
            totalSlots += 4;

            let dayFilled = 0;
            if (sched?.slots['5am']?.leaderId) dayFilled++;
            if (sched?.slots['9am']?.consecrationLeaderId) dayFilled++;
            if (sched?.slots['9am']?.doctrineLeaderId) dayFilled++;
            if (sched?.slots['evening']?.leaderIds?.length > 0) dayFilled++;

            filledSlots += dayFilled;
            if (dayFilled < 4) missingDays.push(dateStr);
        });

        const percentage = Math.round((filledSlots / totalSlots) * 100);
        return { percentage, missingDays, totalDays: days.length };
    };

    const monthStats = getMonthProgress();

    // --- Real Data Calculation for Societies (Monthly Intelligence) ---
    const calculateSocietyStats = () => {
        const groups = [
            { id: 'var', label: 'var', variants: ['varon', 'varón', 'caballero', 'hombres'] },
            { id: 'muj', label: 'muj', variants: ['mujer', 'mujeres', 'dama', 'damas'] },
            { id: 'juv', label: 'juv', variants: ['joven', 'jovenes', 'jóvenes'] },
            { id: 'cor', label: 'cor', variants: ['coro', 'voces'] },
            { id: 'niñ', label: 'niñ', variants: ['niño', 'niña', 'niños', 'niñas', 'infantil'] },
            { id: 'cas', label: 'cas', variants: ['casado', 'casada', 'casados', 'casadas'] },
        ];

        return groups.map(group => {
            const groupMembers = members.filter(m => {
                const mGroup = (m.member_group || '').toLowerCase();
                const mCat = (m.category || '').toLowerCase();
                return group.variants.some(v => mGroup.includes(v) || mCat.includes(v));
            });

            const activeGroupMembers = groupMembers.filter(m => m.status === 'Activo');
            const groupAttended = activeGroupMembers.filter(m => 
                todayRecords.some(r => r.member_id === m.id && r.present)
            ).length;

            const percentage = activeGroupMembers.length > 0 
                ? Math.round((groupAttended / activeGroupMembers.length) * 100) 
                : 0;

            return {
                label: group.label,
                value: percentage,
                count: groupAttended,
                total: activeGroupMembers.length
            };
        });
    };

    const societyStats = calculateSocietyStats();

    if (!mounted) return null;

    // 🔒 PROTECCIÓN: Solo administradores autenticados (o bypass en local)
    const isAuthorized = (authSession?.user && currentUser?.role === 'Administrador') || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
                {/* Fondo Animado */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 dots-pattern opacity-10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md z-10"
                >
                    <Card className="glass-card border-white/[0.03] shadow-2xl overflow-hidden backdrop-blur-2xl">
                        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />
                        <CardHeader className="text-center pt-10 pb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-foreground mb-2">
                                Acceso <span className="text-red-500">Restringido</span>
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium px-4">
                                Esta área es exclusiva para administradores autorizados de LLDM RODEO.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-10 px-8">
                            {!authSession?.user ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 text-center">Debes iniciar sesión con tu cuenta autorizada</p>
                                    <Link href="/login" className="block">
                                        <Button className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 group">
                                            Ir al Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/[0.05] text-center">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Usuario Activo</p>
                                        <p className="text-sm font-bold text-foreground">{authSession.user.email}</p>
                                        <p className="text-[9px] text-red-400 font-black uppercase mt-2 ">Sin permisos de administrador</p>
                                    </div>
                                    <Link href="/" className="block">
                                        <Button variant="outline" className="w-full h-12 border-white/[0.03] bg-white/5 hover:bg-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
                                            Volver al Inicio
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        Si crees que esto es un error, contacta al soporte técnico
                    </p>
                </motion.div>
            </div>
        );
    }



    return (
        <div className="p-4 md:p-8 space-y-8 pb-32 md:pb-8">


            {/* Countdown and Stats Section */}
            <div className={cn("space-y-8", activeTab !== "dashboard" && "hidden")}>

                {/* Stats Cards Section - TOP HORIZONTAL ROW */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-stretch"
                >
                    {/* 1. Monthly Performance Intelligence Dashboard */}
                    <Card className={cn(
                        "glass-card border-none relative overflow-hidden group h-full rounded-none lg:col-span-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                        settings.adminTheme === 'primitivo' && "bg-transparent shadow-none"
                    )}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-none blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                        <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-20">
                            <div className="flex-1">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-4 w-full">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        <span className="whitespace-nowrap">inteligencia mensual</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />
                                    
                                    {/* Dynamically styled Range Selector */}
                                    <div className="flex bg-white/5 p-1 rounded-none border border-white/10 relative z-30 ml-4">
                                        {[
                                            { label: '7 Días', value: 7 },
                                            { label: '15 Días', value: 15 },
                                            { label: '30 Días', value: 30 },
                                            { label: 'Este Mes', value: 'month' }
                                        ].map((r) => (
                                            <button
                                                key={r.label}
                                                onClick={() => setIntelligenceRange(r.value as any)}
                                                className={cn(
                                                    "px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all",
                                                    intelligenceRange === r.value 
                                                        ? "bg-[#dca54e] text-black shadow-[0_0_15px_rgba(220,165,78,0.4)]" 
                                                        : "text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
                                                )}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </CardTitle>
                                <CardDescription className="text-[8px] font-bold uppercase text-muted-foreground mt-1">
                                    {intelligenceRange === 'month' ? 'Rendimiento Este Mes' : `Rendimiento Últimos ${intelligenceRange} Días`}
                                </CardDescription>
                            </div>

                        </CardHeader>
                        <CardContent className="p-0 mt-10">
                             <div className="h-82 relative">
                                 <TactileAreaChart 
                                     data={displayStats} 
                                     color={settings.adminTheme === 'primitivo' ? "#f59e0b" : "#10b981"} 
                                     isSmooth={true} 
                                     showHighlight={true} 
                                     totalMembers={members.filter(m => m.status === 'Activo').length}
                                 />
                             </div>
                        </CardContent>
                    </Card>

                    {/* 2. Integrated Weekly Chart */}
                    <div className="h-full lg:col-span-2">
                        <WeeklyAttendanceChart settings={settings} />
                    </div>

                    {/* 3. Daily Attendance Donut Chart - SQUARE PIECE (CONSTRAINED) */}
                    <div className="lg:col-span-1">
                        <Card className={cn(
                            "glass-card border-none relative overflow-hidden group w-full aspect-square flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                            settings.adminTheme === 'primitivo' ? "bg-muted/30 rounded-[2.5rem]" : "rounded-none"
                        )}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-4 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex items-center justify-center">
                                            <div className={cn("absolute w-3 h-3 rounded-full animate-ping opacity-20", demoMode ? "bg-amber-500" : "bg-white")} />
                                            <div className={cn("w-1.5 h-1.5 rounded-none z-10", demoMode ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-white shadow-[0_0_8px_white]")} />
                                        </div>
                                        <span className="whitespace-nowrap">asistencia en vivo {demoMode && <span className="text-[7px] text-amber-500 ml-1 opacity-70">(simulado)</span>}</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                                    <button 
                                        onClick={() => setDemoMode(!demoMode)}
                                        className={cn("p-1.5 rounded-none transition-all", demoMode ? "text-amber-500 bg-amber-500/10" : "text-white/30 hover:text-white hover:bg-white/5")}
                                        title={demoMode ? "Desactivar Simulación" : "Activar Simulación de Datos"}
                                    >
                                        <Activity className="w-3 h-3" />
                                    </button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center flex-1 py-0 px-2 overflow-hidden">
                                <div className="relative w-full aspect-square max-w-[130px] group/donut transition-transform duration-700 hover:scale-105">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="liveAttendanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor={settings.adminTheme === 'primitivo' ? "#fbbf24" : "#1e3a8a"} />
                                                <stop offset="100%" stopColor={settings.adminTheme === 'primitivo' ? "#fef3c7" : "#60a5fa"} />
                                            </linearGradient>
                                            <filter id="liveAttendanceGlow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>
                                        
                                        {/* Background Track - Brighter Soft Gray */}
                                        <circle 
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.25)" 
                                            strokeWidth="8" 
                                        />

                                        {/* Physical Housing (Softened) */}
                                        <motion.circle
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.05)" 
                                            strokeWidth="10"
                                            strokeDasharray="251.3"
                                            initial={{ strokeDashoffset: 251.3 }}
                                            animate={{ strokeDashoffset: 251.3 - (251.3 * Math.max(0.5, attendancePercentage) / 100) }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round"
                                        />

                                        {/* Main Progress Arc - Neon Core */}
                                        <motion.circle
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="url(#liveAttendanceGrad)" 
                                            strokeWidth="6"
                                            strokeDasharray="251.3"
                                            initial={{ strokeDashoffset: 251.3 }}
                                            animate={{ 
                                                strokeDashoffset: 251.3 - (251.3 * Math.max(0.5, attendancePercentage) / 100)
                                            }}
                                            transition={{ 
                                                duration: 2, ease: "circOut"
                                            }}
                                            strokeLinecap="round"
                                            filter="url(#liveAttendanceGlow)"
                                        />

                                        {/* Sharp Outer Edge Border */}
                                        <motion.circle
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.4)" 
                                            strokeWidth="10"
                                            strokeDasharray="251.3"
                                            initial={{ strokeDashoffset: 251.3 }}
                                            animate={{ 
                                                strokeDashoffset: 251.3 - (251.3 * Math.max(0.5, attendancePercentage) / 100)
                                            }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round"
                                            className="opacity-20"
                                        />
                                        
                                        {/* Inner Glass Highlight */}
                                        <motion.circle
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.2)" 
                                            strokeWidth="1"
                                            strokeDasharray="251.3"
                                            initial={{ strokeDashoffset: 251.3 }}
                                            animate={{ 
                                                strokeDashoffset: 251.3 - (251.3 * Math.max(0.5, attendancePercentage) / 100)
                                            }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round"
                                        />

                                    </svg>
                                    
                                    {/* Radar Scan - New Premium Element */}
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    >
                                        <div className="absolute top-1/2 left-[50%] w-[40%] h-[1px] bg-gradient-to-r from-amber-500/20 to-transparent origin-left" />
                                    </motion.div>

                                    {/* Recent Activity Log (Demo/Live) */}
                                    <AnimatePresence>
                                        {recentCheckins.length > 0 && (
                                            <div className="absolute bottom-2 left-0 right-0 px-2 space-y-1 z-50">
                                                {recentCheckins.map((checkin, i) => (
                                                    <motion.div 
                                                        key={`${checkin.name}-${checkin.time}`}
                                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        className="bg-black/80 backdrop-blur-md border border-amber-500/20 px-2 py-0.5 flex items-center justify-between pointer-events-none"
                                                    >
                                                        <span className="text-[6px] font-black text-amber-500 uppercase truncate max-w-[60px]">{checkin.name}</span>
                                                        <span className="text-[5px] font-bold text-white/40 tabular-nums">{checkin.time}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </AnimatePresence>

                                    {/* Center Percentage Display */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-3xl font-black text-white leading-none tracking-tighter"
                                        >
                                            {attendancePercentage}%
                                        </motion.div>
                                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">estado</span>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-6 pb-4 w-full">
                                <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div className="text-lg font-black text-white leading-none mb-0.5 tabular-nums">{attendedCount}</div>
                                            <p className="text-[6px] font-black uppercase text-white/30 tracking-widest">hermanos</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-5 h-2 rounded-full" 
                                                style={{ 
                                                    background: settings.adminTheme === 'primitivo' 
                                                        ? 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)' 
                                                        : 'linear-gradient(90deg, #1e3a8a 0%, #60a5fa 100%)' 
                                                }}
                                            />
                                            <span className={cn(
                                                "text-[9px] font-black tracking-tighter tabular-nums",
                                                settings.adminTheme === 'primitivo' ? "text-amber-400" : "text-blue-400"
                                            )}>
                                                {100 - attendancePercentage}% faltante
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 px-1.5 py-0.5 border border-white/[0.05] flex items-center gap-1">
                                        <div className="w-1 h-1 bg-white animate-pulse" />
                                        <span className="text-[5px] font-black text-white uppercase tracking-widest">vivo</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* 4. Membership Intelligence Card - CONSOLIDATED PIE CHART */}
                    <Card className={cn(
                        "card glass-card border-none relative overflow-hidden group h-full rounded-none lg:col-span-1 flex flex-col justify-between",
                        settings.adminTheme === 'primitivo' ? "bg-[#101420] shadow-none rounded-[1.5rem]" : "bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    )}>
                        <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-4 w-full">
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-white" />
                                <span className="whitespace-nowrap">inteligencia de membresía</span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center flex-1 py-0 px-2 overflow-hidden">
                            <div className="w-full mt-4">
                                                <TactilePieChart 
                                                    title="Membresía"
                                                    data={[
                                                        { 
                                                            label: 'Casados', 
                                                            value: members.filter(m => (m.member_group || '').includes('Casado')).length, 
                                                            color: '#10b981' 
                                                        },
                                                        { 
                                                            label: 'Jóvenes', 
                                                            value: members.filter(m => (m.member_group || '') === 'Jovenes').length, 
                                                            color: '#fbbf24' 
                                                        },
                                                        { 
                                                            label: 'Solos', 
                                                            value: members.filter(m => (m.member_group || '') === 'Solos y Solas').length, 
                                                            color: '#8b5cf6' 
                                                        },
                                                        { 
                                                            label: 'Niños', 
                                                            value: members.filter(m => (m.category === 'Niño' || (m.member_group || '').startsWith('Niño'))).length, 
                                                            color: '#0ea5e9' 
                                                        },
                                                    ]}
                                                />
                                            </div>
                        </CardContent>
                        <div className="px-6 pb-6 w-full">
                            <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
                                <div>
                                    <p className="text-[7px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">crecimiento</p>
                                    <div className="text-xl font-black text-emerald-500 tabular-nums tracking-tighter italic">+4.2%</div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[7px] font-black uppercase text-white/20 tracking-widest leading-none mb-1">registrados</p>
                                    <div className="text-xl font-black text-white tabular-nums tracking-tighter italic">{members.length}</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    </motion.div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                        <div id="mensajes">
                            <MessagesPanel
                                messages={messages}
                                onMarkRead={markMessageAsRead}
                                onReply={async (recipientId, content) => {
                                    await sendCloudMessage({ senderId: currentUser?.id || '', receiverId: recipientId, content, subject: 'Respuesta de Administración' });
                                    showNotification('Respuesta enviada');
                                }}
                                settings={settings}
                            />
                        </div>
                        <div id="analytics-overview" className="space-y-6">
                            {/* Consolidated into Membership Intelligence */}
                        </div>
                    </div>
                </div>


            {
                activeTab === 'horarios' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <Card id="horarios" className="glass-card border-l-4 border-l-primary !overflow-visible relative z-20">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Programación: <div className="relative inline-block">
                                            <button 
                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                className="text-primary hover:text-primary/80 transition-colors cursor-pointer border-b border-dashed border-primary/30"
                                            >
                                                {(() => {
                                                    try {
                                                        return format(parseISO(currentDate), "PPPP", { locale: es });
                                                    } catch (e) {
                                                        return currentDate;
                                                    }
                                                })()}
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isCalendarOpen && (
                                                    <div className="fixed inset-0 sm:absolute sm:top-full sm:left-0 sm:inset-auto mt-0 sm:mt-4 z-[100] flex items-center justify-center sm:block p-4 sm:p-0 w-full sm:w-[340px]">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="shadow-3xl w-full max-w-[340px] sm:max-w-none"
                                                        >
                                                            <PremiumCalendar 
                                                                selectedDate={currentDate}
                                                                onDateSelect={(date) => {
                                                                    setCurrentDate(date);
                                                                    setIsCalendarOpen(false);
                                                                }}
                                                                theme="classic"
                                                            />
                                                        </motion.div>
                                                        <div 
                                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none z-[-1]" 
                                                            onClick={() => setIsCalendarOpen(false)}
                                                        />
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </CardTitle>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm("¿Estás seguro de que deseas poblar todo el mes actual con datos realistas? Esto sobrescribirá las entradas existentes.")) {
                                                    seedMonthSchedule();
                                                }
                                            }}
                                            className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest gap-2 h-9 px-4 rounded-xl"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Poblar Mes
                                        </Button>
                                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                            Los cambios se guardan automáticamente
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="!overflow-visible">
                                <div className="grid gap-8 md:grid-cols-3">
                                    {/* 5 AM Slot */}
                                    <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40">
                                        <div className="flex items-center gap-4 text-blue-400 font-bold uppercase tracking-tighter justify-between">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/[0.1] px-1 py-0.5 text-2xl text-blue-400 w-28 font-sans focus:outline-none focus:border-blue-400 tracking-normal"
                                                    value={currentDaySchedule?.slots['5am']?.time || '05:00 AM'}
                                                    onChange={(e) => updateSlot('5am', { time: e.target.value })}
                                                />
                                                <span className="text-xs text-blue-400/50 uppercase">al</span>
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/[0.1] px-1 py-0.5 text-lg text-blue-400 w-24 font-sans focus:outline-none focus:border-blue-400 tracking-normal placeholder:text-blue-400/30"
                                                    value={currentDaySchedule?.slots['5am']?.endTime || '05:30 AM'}
                                                    onChange={(e) => updateSlot('5am', { endTime: e.target.value })}
                                                />
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={currentDaySchedule?.slots['5am'].language === 'en' ? 'neon' : 'outline'}
                                                onClick={() => updateSlot('5am', { language: currentDaySchedule?.slots['5am'].language === 'en' ? 'es' : 'en' })}
                                                className={cn("w-12 text-xs font-black tracking-widest transition-colors", currentDaySchedule?.slots['5am'].language === 'en' ? 'bg-blue-400 text-black hover:bg-blue-500 border-none' : 'bg-blue-400/5 text-blue-400 hover:bg-blue-400/10 border-blue-400/20')}
                                            >
                                                EN
                                            </Button>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold uppercase text-muted-foreground block">Hno. Responsable</label>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleRecurringSave('5am', currentDaySchedule?.slots['5am'].leaderId || '', 'next')}
                                                        disabled={isSaving}
                                                        className="p-1 hover:text-blue-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                        title="Repetir el próximo lunes"
                                                    >
                                                        <CalendarClock className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRecurringSave('5am', currentDaySchedule?.slots['5am'].leaderId || '', 'month')}
                                                        disabled={isSaving}
                                                        className="p-1 hover:text-blue-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                        title="Repetir todos los lunes del mes"
                                                    >
                                                        <CalendarDays className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <CustomSelect
                                                value={currentDaySchedule?.slots['5am'].leaderId || ''}
                                                onChange={(val) => updateSlot('5am', { leaderId: val })}
                                                options={memberOptions}
                                            />
                                        </div>
                                    </div>

                                    {/* 9 AM Slot */}
                                    <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40">
                                        <div className="flex items-center gap-4 text-yellow-400 font-bold uppercase tracking-tighter justify-between">
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/[0.1] px-1 py-0.5 text-2xl text-yellow-400 w-28 font-sans focus:outline-none focus:border-yellow-400 tracking-normal"
                                                    value={currentDaySchedule?.slots['9am']?.time || (new Date(currentDate + 'T12:00:00').getDay() === 0 ? '10:00 AM' : '09:00 AM')}
                                                    onChange={(e) => updateSlot('9am', { time: e.target.value })}
                                                />
                                                <span className="text-xs text-yellow-400/50 uppercase">al</span>
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/[0.1] px-1 py-0.5 text-lg text-yellow-400 w-24 font-sans focus:outline-none focus:border-yellow-400 tracking-normal placeholder:text-yellow-400/30"
                                                    value={currentDaySchedule?.slots['9am']?.endTime || (new Date(currentDate + 'T12:00:00').getDay() === 0 ? '12:00 PM' : '10:00 AM')}
                                                    onChange={(e) => updateSlot('9am', { endTime: e.target.value })}
                                                />
                                            </div>
                                            {new Date(currentDate + 'T12:00:00').getDay() === 0 && <span className="text-yellow-600 ml-2 text-[10px] bg-yellow-400/10 px-2 py-0.5 rounded-lg border border-yellow-400/20">DOMINICAL</span>}
                                            <Button
                                                size="sm"
                                                variant={currentDaySchedule?.slots['9am'].language === 'en' ? 'neon' : 'outline'}
                                                onClick={() => updateSlot('9am', { language: currentDaySchedule?.slots['9am'].language === 'en' ? 'es' : 'en' })}
                                                className={cn("w-12 text-xs font-black tracking-widest transition-colors", currentDaySchedule?.slots['9am'].language === 'en' ? 'bg-yellow-400 text-black hover:bg-yellow-500 border-none' : 'bg-yellow-400/5 text-yellow-400 hover:bg-yellow-400/10 border-yellow-400/20')}
                                            >
                                                EN
                                            </Button>
                                        </div>
                                        {new Date(currentDate + 'T12:00:00').getDay() === 0 ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-yellow-500/80 tracking-widest block mb-1">Tipo de Dominical</label>
                                                    <select
                                                        className="w-full bg-black/40 border border-yellow-500/20 text-yellow-400 py-2.5 px-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-yellow-500 transition-colors"
                                                        value={currentDaySchedule?.slots['9am']?.sundayType || 'local'}
                                                        onChange={(e) => updateSlot('9am', { sundayType: e.target.value as any })}
                                                    >
                                                        <option value="local">Ministro Local</option>
                                                        <option value="exchange">Intercambio de Ministros</option>
                                                        <option value="broadcast">Transmisión Internacional (Internet)</option>
                                                        <option value="visitors">Dominical Especial para Visitas</option>
                                                    </select>
                                                </div>

                                                {currentDaySchedule?.slots['9am']?.sundayType === 'exchange' && (
                                                    <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/[0.05]">
                                                        <label className="text-[10px] font-bold uppercase text-purple-400/80 tracking-widest block mb-1">Cuerpo o Iglesia de Procedencia (Opcional)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-black/40 border border-purple-500/20 text-purple-100 py-2.5 px-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-500 placeholder:text-white/20 transition-colors"
                                                            placeholder="Ej. Hermosa Provincia, GDL"
                                                            value={currentDaySchedule?.slots['9am']?.churchOrigin || ''}
                                                            onChange={(e) => updateSlot('9am', { churchOrigin: e.target.value })}
                                                        />
                                                    </div>
                                                )}

                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground block">Consagración</label>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleRecurringSave('9am_consecration', currentDaySchedule?.slots['9am'].consecrationLeaderId || '', 'next')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-yellow-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarClock className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRecurringSave('9am_consecration', currentDaySchedule?.slots['9am'].consecrationLeaderId || '', 'month')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-yellow-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarDays className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <CustomSelect
                                                        value={currentDaySchedule?.slots['9am'].consecrationLeaderId || ''}
                                                        onChange={(val) => updateSlot('9am', { consecrationLeaderId: val })}
                                                        options={memberOptions}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground block">Doctrina</label>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleRecurringSave('9am_doctrine', currentDaySchedule?.slots['9am'].doctrineLeaderId || '', 'next')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-yellow-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarClock className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRecurringSave('9am_doctrine', currentDaySchedule?.slots['9am'].doctrineLeaderId || '', 'month')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-yellow-400 text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarDays className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <CustomSelect
                                                        value={currentDaySchedule?.slots['9am'].doctrineLeaderId || ''}
                                                        onChange={(val) => updateSlot('9am', { doctrineLeaderId: val })}
                                                        options={memberOptions}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Evening Slot */}
                                    <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40 relative">
                                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-primary text-black text-[10px] font-bold uppercase">
                                            Estelar
                                        </div>
                                        <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-tighter justify-between">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-primary/20 px-1 py-0.5 text-2xl text-primary w-28 font-sans focus:outline-none focus:border-primary tracking-normal"
                                                    value={currentDaySchedule?.slots['evening']?.time || '07:00 PM'}
                                                    onChange={(e) => updateSlot('evening', { time: e.target.value })}
                                                />
                                                <span className="text-xs text-primary/50 uppercase">al</span>
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-primary/20 px-1 py-0.5 text-lg text-primary w-24 font-sans focus:outline-none focus:border-primary tracking-normal placeholder:text-primary/30"
                                                    value={currentDaySchedule?.slots['evening']?.endTime || '08:30 PM'}
                                                    onChange={(e) => updateSlot('evening', { endTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant={currentDaySchedule?.slots['evening'].time === '6:00 PM' ? 'neon' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSlot('evening', { time: '6:00 PM' })}
                                                    className="flex-1 text-xs"
                                                >
                                                    18:00
                                                </Button>
                                                <Button
                                                    variant={currentDaySchedule?.slots['evening'].time === '6:30 PM' ? 'neon' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSlot('evening', { time: '6:30 PM' })}
                                                    className="flex-1 text-xs"
                                                >
                                                    18:30
                                                </Button>
                                                <Button
                                                    variant={currentDaySchedule?.slots['evening'].time === '7:00 PM' ? 'neon' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSlot('evening', { time: '7:00 PM' })}
                                                    className="flex-1 text-xs"
                                                >
                                                    19:00
                                                </Button>

                                                {/* English Service Toggle */}
                                                <Button
                                                    variant={currentDaySchedule?.slots['evening'].language === 'en' ? 'neon' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSlot('evening', { language: currentDaySchedule?.slots['evening'].language === 'en' ? 'es' : 'en' })}
                                                    className={cn("w-12 text-xs font-black tracking-widest", currentDaySchedule?.slots['evening'].language === 'en' ? 'bg-primary text-black hover:bg-primary/90' : 'bg-primary/5 text-primary hover:bg-primary/10 border-primary/20')}
                                                    title="Activar icono para Oración en Inglés"
                                                >
                                                    EN
                                                </Button>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">Tipo de Servicio</label>
                                                <CustomSelect
                                                    value={currentDaySchedule?.slots['evening'].type ?? 'regular'}
                                                    searchable={false}
                                                    onChange={(val) => {
                                                        const updates: any = { type: val };
                                                        const isMulti = ['special', 'youth', 'praise', 'married', 'children'].includes(val);
                                                        if (!isMulti && currentDaySchedule?.slots['evening']?.leaderIds?.length > 1) {
                                                            updates.leaderIds = [currentDaySchedule?.slots['evening']?.leaderIds?.[0]];
                                                        }
                                                        // Always persist the type, even when selecting 'regular'
                                                        updateSlot('evening', updates);
                                                    }}
                                                    options={[
                                                        { value: 'regular', label: 'Regular' },
                                                        { value: 'youth', label: 'Jóvenes' },
                                                        { value: 'married', label: 'Casados' },
                                                        { value: 'children', label: 'Niños' },
                                                        { value: 'praise', label: 'Servicio de Alabanza' },
                                                        { value: 'special', label: 'Especial' },
                                                    ]}
                                                />
                                            </div>

                                            {['special', 'youth', 'praise', 'married', 'children'].includes(currentDaySchedule?.slots['evening'].type) ? (
                                                <div className="grid gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Servicio (Titular)</label>
                                                        <CustomSelect
                                                            value={currentDaySchedule?.slots['evening'].leaderIds[0] || ''}
                                                            onChange={(val) => {
                                                                const newIds = [...(currentDaySchedule?.slots['evening'].leaderIds || [])];
                                                                newIds[0] = val;
                                                                updateSlot('evening', { leaderIds: newIds });
                                                            }}
                                                            options={memberOptions}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Doctrina</label>
                                                        <CustomSelect
                                                            value={currentDaySchedule?.slots['evening'].leaderIds[1] || ''}
                                                            onChange={(val) => {
                                                                const newIds = [...(currentDaySchedule?.slots['evening'].leaderIds || [])];
                                                                newIds[1] = val;
                                                                updateSlot('evening', { leaderIds: newIds });
                                                            }}
                                                            options={memberOptions}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground block">Responsable</label>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleRecurringSave('evening', currentDaySchedule?.slots['evening'].leaderIds[0] || '', 'next')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-primary text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarClock className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRecurringSave('evening', currentDaySchedule?.slots['evening'].leaderIds[0] || '', 'month')}
                                                                disabled={isSaving}
                                                                className="p-1 hover:text-primary text-muted-foreground transition-colors disabled:opacity-50"
                                                            >
                                                                <CalendarDays className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <CustomSelect
                                                        value={currentDaySchedule?.slots['evening'].leaderIds[0] || ''}
                                                        onChange={(val) => updateSlot('evening', { leaderIds: [val] })}
                                                        options={memberOptions}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            }
            {
                activeTab === 'coros' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Inventario de Uniformes */}
                            <Card className="glass-card border-t-4 border-t-secondary relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Shirt className="w-24 h-24 text-secondary" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shirt className="w-5 h-5 text-secondary" /> Lista de Uniformes
                                    </CardTitle>
                                    <CardDescription>Defina los uniformes oficiales disponibles</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {uniforms.map(u => (
                                            <div key={u.id} className="p-3 rounded-xl bg-foreground/5 border border-border/40 flex justify-between items-center group">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-foreground uppercase tracking-tighter">{u.name}</span>
                                                        <span className={cn(
                                                            "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                                            u.category === 'Adulto' ? "bg-secondary/20 text-secondary" : "bg-cyan-500/20 text-cyan-400"
                                                        )}>{u.category}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-medium">{u.description}</p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm("¿Eliminar este uniforme?")) {
                                                            await deleteUniformFromCloud(u.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-border/40 space-y-3">
                                        <h4 className="text-xs font-black uppercase text-slate-400">Nuevo Uniforme</h4>
                                        <div className="space-y-2">
                                            <Input
                                                value={newUniform.name}
                                                onChange={(e) => setNewUniform({ ...newUniform, name: e.target.value })}
                                                placeholder="Nombre (ej: Gala Blanco)"
                                                className="bg-foreground/5 border-border/40 h-8 text-xs font-bold"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    value={newUniform.category}
                                                    onChange={(e) => setNewUniform({ ...newUniform, category: e.target.value as any })}
                                                    className="bg-[#0f172a] border border-border/40 rounded-md text-[10px] font-bold text-foreground px-2 outline-none"
                                                >
                                                    <option value="Adulto">Adulto</option>
                                                    <option value="Niño">Niño</option>
                                                </select>
                                                <Button
                                                    onClick={async () => {
                                                        if (newUniform.name) {
                                                            setIsSaving(true);
                                                            try {
                                                                await saveUniformToCloud(newUniform.name, newUniform.category);
                                                                setNewUniform({ name: '', category: 'Adulto' });
                                                            } catch (e) {
                                                                showNotification("Error al guardar uniforme", 'error');
                                                            } finally {
                                                                setIsSaving(false);
                                                            }
                                                        }
                                                    }}
                                                    className="h-8 text-[10px] font-black uppercase bg-secondary hover:bg-secondary/80 flex-1"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? '...' : 'Agregar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Calendario de Uniformes y Asignaciones Infantiles */}
                            <Card className="lg:col-span-2 glass-card border-t-4 border-t-cyan-500">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Music2 className="w-5 h-5 text-cyan-500" /> Planificación de Coros
                                        </CardTitle>
                                        <CardDescription>Asigne uniformes y privilegios infantiles para días específicos</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-lg border border-white/[0.03]">
                                        <Calendar className="w-3.5 h-3.5 text-cyan-500 opacity-50" />
                                        <span className="text-xs font-bold text-foreground uppercase ">{(() => {
                                            try {
                                                return format(parseISO(currentDate), "PPP", { locale: es });
                                            } catch (e) {
                                                return currentDate;
                                            }
                                        })()}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Selector de Uniforme para la fecha actual */}
                                    <div className="p-4 rounded-2xl bg-foreground/5 border border-border/40">
                                        <h4 className="text-xs font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                                            <Shirt className="w-3.5 h-3.5" /> Uniforme del Día
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-500">Para Jueves/Dom (Adultos)</label>
                                                <select
                                                    value={uniformSchedule[currentDate] || ''}
                                                    onChange={async (e) => {
                                                        setIsSaving(true);
                                                        await saveUniformForDateToCloud(currentDate, e.target.value);
                                                        setIsSaving(false);
                                                    }}
                                                    className="w-full bg-foreground/5 border border-border/40 rounded-xl h-10 px-3 text-xs font-bold text-foreground outline-none focus:border-secondary/50 transition-colors"
                                                >
                                                    <option value="" className="bg-[#0f172a]">Sin uniforme asignado</option>
                                                    {uniforms.filter(u => u.category === 'Adulto').map(u => (
                                                        <option key={u.id} value={u.id} className="bg-[#0f172a]">{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-500">Para Sab Presentación (Niños)</label>
                                                <select
                                                    value={kidsAssignments[currentDate]?.uniformId || ''}
                                                    onChange={(e) => {
                                                        const existing = kidsAssignments[currentDate] || { serviceChild: '', doctrineChild: '', uniformId: '' };
                                                        setKidsAssignment(currentDate, { ...existing, uniformId: e.target.value });
                                                    }}
                                                    className="w-full bg-foreground/5 border border-border/40 rounded-xl h-10 px-3 text-xs font-bold text-foreground outline-none focus:border-cyan-500/50 transition-colors"
                                                >
                                                    <option value="" className="bg-[#0f172a]">Sin uniforme asignado</option>
                                                    {uniforms.filter(u => u.category === 'Niño').map(u => (
                                                        <option key={u.id} value={u.id} className="bg-[#0f172a]">{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asignaciones Infantiles (Sólo si es Sábado u autorizado) */}
                                    <div className="p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                                            <Baby className="w-24 h-24 text-cyan-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-xs font-black uppercase text-cyan-400 mb-6 flex items-center gap-2">
                                                <Star className="w-3.5 h-3.5" /> Asignación Servicio de Alabanzas (Niños)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 flex justify-between">
                                                        Primera Parte: Servicio
                                                        <span className="text-[8px] text-cyan-500 font-black">DIRIGENTE</span>
                                                    </label>
                                                    <Input
                                                        value={kidsAssignments[currentDate]?.serviceChild || ''}
                                                        onChange={(e) => {
                                                            const existing = kidsAssignments[currentDate] || {};
                                                            setKidsAssignment(currentDate, { ...existing, serviceChild: e.target.value });
                                                        }}
                                                        placeholder="Nombre del niño/a"
                                                        className="bg-foreground/5 border-border/40 text-xs font-bold focus:border-cyan-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 flex justify-between">
                                                        Segunda Parte: Doctrina
                                                        <span className="text-[8px] text-cyan-500 font-black">EXPOSITOR</span>
                                                    </label>
                                                    <Input
                                                        value={kidsAssignments[currentDate]?.doctrineChild || ''}
                                                        onChange={(e) => {
                                                            const existing = kidsAssignments[currentDate] || {};
                                                            setKidsAssignment(currentDate, { ...existing, doctrineChild: e.target.value });
                                                        }}
                                                        placeholder="Nombre del niño/a"
                                                        className="bg-foreground/5 border-border/40 text-xs font-bold focus:border-cyan-500/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-center">
                                                <Button
                                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest gap-2"
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        await saveKidsAssignmentToCloud(currentDate, kidsAssignments[currentDate]);
                                                        setIsSaving(false);
                                                    }}
                                                    disabled={isSaving}
                                                >
                                                    <Save className="w-4 h-4" /> Guardar Asignaciones
                                                </Button>
                                            </div>
                                            <p className="text-[9px] text-slate-500 mt-6 uppercase font-bold text-center border-t border-white/[0.03] pt-4">
                                                Estas asignaciones aparecen automáticamente en el **Panel del Corito** y para el **Responsable de Asistencia**.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )
            }

            {
                activeTab === 'configuracion' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Unified Header & Sub-Tab Navigation */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-1 bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] px-8 py-4 sticky top-4 z-[40] shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                    <Settings className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Configuración Central</h2>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Gestión Total del Sistema LLDM Rodeo</p>
                                </div>
                            </div>

                            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.03] gap-1">
                                {[
                                    { id: 'general', label: 'General', icon: Layers },
                                    { id: 'pantalla', label: 'Pantalla (TV)', icon: Eye },
                                    { id: 'estetica', label: 'Estética', icon: Palette },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setConfigSubTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                            configSubTab === tab.id 
                                                ? "bg-primary text-black shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] scale-[1.02]" 
                                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                        )}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <Button
                                className={cn(
                                    "text-white font-black uppercase tracking-widest gap-2 h-12 px-8 rounded-2xl border transition-all",
                                    settings.adminTheme === 'primitivo' ? "bg-amber-600 hover:bg-amber-500 border-amber-400/30" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                                )}
                                onClick={async () => {
                                    setIsSaving(true);
                                    await saveSettingsToCloud(settings);
                                    setIsSaving(false);
                                    showNotification("Todos los cambios sincronizados correctamente.", 'success');
                                }}
                                disabled={isSaving}
                            >
                                <Save className="w-4 h-4" /> {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                            </Button>
                        </div>

                        {/* CONTENT: GENERAL (System & Minister) */}
                        {configSubTab === 'general' && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Dashboard Theme Selection */}
                                    <div className="space-y-4 p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Sun className="w-32 h-32 text-indigo-500" />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                                            <Sun className="w-3.5 h-3.5" /> Modo de Apariencia Dashboard
                                        </h4>
                                        <div className="relative z-10">
                                            <select
                                                value={settings.themeMode}
                                                onChange={(e) => setSettings({ themeMode: e.target.value as any })}
                                                className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[1.5rem] px-8 py-5 text-sm font-black uppercase tracking-widest text-foreground appearance-none cursor-pointer hover:bg-slate-900/60 transition-all outline-none"
                                            >
                                                <option value="light" className="bg-[#020617] text-white">Modo Claro (Clásico)</option>
                                                <option value="dark" className="bg-[#020617] text-white">Modo Oscuro (Galactic)</option>
                                                <option value="system" className="bg-[#020617] text-white">Sincronizar Sistema</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Admin Layout Selection */}
                                    <div className="space-y-4 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <LayoutDashboard className="w-32 h-32 text-amber-500" />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2">
                                            <LayoutDashboard className="w-3.5 h-3.5" /> Estructura del Panel Admin
                                        </h4>
                                        <div className="relative z-10">
                                            <select
                                                value={settings.adminTheme || 'classic'}
                                                onChange={(e) => {
                                                    const newValue = e.target.value as any;
                                                    setSettings({ adminTheme: newValue });
                                                    saveSettingsToCloud({ adminTheme: newValue });
                                                }}
                                                className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[1.5rem] px-8 py-5 text-sm font-black uppercase tracking-widest text-foreground appearance-none cursor-pointer hover:bg-slate-900/60 transition-all outline-none"
                                            >
                                                <option value="primitivo" className="bg-[#020617] text-white">Plantilla Primitiva (Producción)</option>
                                                <option value="classic" className="bg-[#020617] text-white">Plantilla Clásica (Tactile)</option>
                                                <option value="luna" className="bg-[#020617] text-white">Plantilla Luna (Premium)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Minister Profile Card (Consolidated) */}
                                <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/[0.05] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="flex flex-col lg:flex-row gap-12 relative z-10 items-center">
                                        <div className="relative group/avatar">
                                            <div className="w-48 h-48 rounded-full border-4 border-primary/20 p-2 relative">
                                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/50 bg-slate-800 shadow-2xl">
                                                    <img src={minister.avatar} className="w-full h-full object-cover" alt="Ministro" />
                                                </div>
                                                <div className="absolute bottom-2 right-2 flex gap-1">
                                                    <Button size="icon" className="w-10 h-10 rounded-xl" onClick={() => document.getElementById('minister-photo-upload')?.click()}><Camera className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <input id="minister-photo-upload" type="file" className="hidden" accept="image/*" onChange={handleMinisterAvatarChange} />
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre del Responsable</label>
                                                <Input value={minister.name || ''} onChange={(e) => setMinister({ name: e.target.value })} className="h-14 bg-foreground/5 rounded-2xl" placeholder="Ej. P.E. Benjamín Rojas" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Teléfono</label>
                                                <Input value={minister.phone || ''} onChange={(e) => setMinister({ phone: e.target.value })} className="h-14 bg-foreground/5 rounded-2xl" />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Correo Institucional</label>
                                                <Input value={minister.email || ''} onChange={(e) => setMinister({ email: e.target.value })} className="h-14 bg-foreground/5 rounded-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* CONTENT: PANTALLA (TV Controls) */}
                        {configSubTab === 'pantalla' && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Display Mode Selection */}
                                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                                            <Monitor className="w-3.5 h-3.5" /> Temas de la Pizarra Gigante
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'iglesia', label: 'Oficial', icon: Church },
                                                { id: 'cristal', label: 'Cristal', icon: Sparkles },
                                                { id: 'minimal', label: 'Minimal', icon: Type },
                                                { id: 'nocturno', label: 'Night', icon: Moon },
                                                { id: 'neon', label: 'Neon', icon: Flame },
                                                { id: 'luna', label: 'Luna', icon: Sunrise },
                                                { id: 'primitivo', label: 'Legacy', icon: BookOpen },
                                            ].map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => setSettings({ displayTemplate: theme.id as any })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                                                        (settings.displayTemplate || 'nocturno') === theme.id 
                                                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                                                            : "bg-slate-900 border-white/[0.05] text-slate-500 hover:border-emerald-500/30"
                                                    )}
                                                >
                                                    <theme.icon className="w-5 h-5" />
                                                    <span className="text-[9px] font-black uppercase">{theme.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Playback Settings */}
                                    <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col gap-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5" /> Efectos & Duración
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-500">Transiciones</label>
                                                <select
                                                    value={settings.transitionsEnabled !== false ? 'true' : 'false'}
                                                    onChange={(e) => setSettings({ transitionsEnabled: e.target.value === 'true' })}
                                                    className="w-full bg-slate-900/40 border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-black uppercase outline-none"
                                                >
                                                    <option value="true">Activas (Moderno)</option>
                                                    <option value="false">Instantáneas</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-500">Tiempo por Slide</label>
                                                <select
                                                    value={settings.displaySlideDuration || 12}
                                                    onChange={(e) => setSettings({ displaySlideDuration: parseInt(e.target.value) })}
                                                    className="w-full bg-slate-900/40 border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-black uppercase outline-none"
                                                >
                                                    <option value="5">Rápido (5s)</option>
                                                    <option value="12">Normal (12s)</option>
                                                    <option value="20">Lento (20s)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TV SCALE & POSITION (The Tactile Grid) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-[2.5rem] bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">Escala del Contenido (%)</h4>
                                            <span className="text-xl font-black text-cyan-400">{Math.round((settings.displayScale || 1.0) * 100)}%</span>
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((sc) => (
                                                <button
                                                    key={sc}
                                                    onClick={() => setSettings({ displayScale: sc })}
                                                    className={cn(
                                                        "h-10 rounded-lg font-black text-[10px] transition-all",
                                                        (settings.displayScale || 1.0) === sc ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-500"
                                                    )}
                                                >
                                                    {Math.round(sc * 100)}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/[0.05] flex flex-col items-center gap-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Centrado Manual del Display</h4>
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant="outline" size="icon" onClick={() => setSettings({ displayOffsetY: (settings.displayOffsetY || 0) - 10 })}><ChevronUp /></Button>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" onClick={() => setSettings({ displayOffsetX: (settings.displayOffsetX || 0) - 10 })}><ChevronLeft /></Button>
                                                <Button variant="neon" className="px-6 h-10" onClick={() => setSettings({ displayOffsetX: 0, displayOffsetY: 0 })}>RESET</Button>
                                                <Button variant="outline" size="icon" onClick={() => setSettings({ displayOffsetX: (settings.displayOffsetX || 0) + 10 })}><ChevronRight /></Button>
                                            </div>
                                            <Button variant="outline" size="icon" onClick={() => setSettings({ displayOffsetY: (settings.displayOffsetY || 0) + 10 })}><ChevronDown /></Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* CONTENT: ESTÉTICA (Logos, Fonts, Colors) - MIGRATED */}
                        {configSubTab === 'estetica' && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* LOGO SELECTION */}
                                    <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                                            <Palette className="w-3.5 h-3.5" /> Logotipo Institucional
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            {[1, 2, 3, 4].map((idx) => {
                                                const url = (settings as any)[`customLogo${idx}`];
                                                return (
                                                    <div key={idx} className="relative group">
                                                        <button 
                                                            onClick={() => url ? setSettings({ churchLogoUrl: url }) : document.getElementById(`logo-up-${idx}`)?.click()}
                                                            className={cn("w-20 h-20 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all", settings.churchLogoUrl === url && url ? "border-primary bg-primary/10" : "border-white/5 bg-black/20")}
                                                        >
                                                            {url ? <img src={url} className="w-full h-full object-contain p-2" /> : <Plus className="text-slate-500" />}
                                                        </button>
                                                        <input id={`logo-up-${idx}`} type="file" className="hidden" onChange={(e) => handleCustomLogoUpload(e, idx as any)} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* COLORS & FONTS */}
                                    <div className="p-8 rounded-[2.5rem] bg-pink-500/5 border border-pink-500/10 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5" /> Colores & Tipografía Global
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: settings.primaryColor }} />
                                            <Input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ primaryColor: e.target.value })} className="flex-1 bg-black/40 border-white/10" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input 
                                                    value={fontSearch} onChange={(e) => setFontSearch(e.target.value)}
                                                    placeholder="Buscar fuente Google..."
                                                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-12 text-[10px] font-black uppercase outline-none focus:border-pink-500/50"
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                                {GOOGLE_FONTS.filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase())).slice(0, 50).map(f => (
                                                    <button 
                                                        key={f.id} 
                                                        onClick={() => setSettings({ fontMain: f.name as any })} 
                                                        className={cn("px-4 py-2 text-[10px] font-black uppercase text-left rounded-lg transition-all", settings.fontMain === f.name ? "bg-pink-500 text-black" : "text-slate-500 hover:bg-white/5")}
                                                    >
                                                        {f.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BACKGROUND SELECTION */}
                                <div className="p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">Imagen de Fondo del Display</h4>
                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={() => setSettings({ displayBgMode: 'none' })}
                                            className={cn("w-32 h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2", settings.displayBgMode === 'none' ? "border-primary bg-primary/10" : "border-white/5")}
                                        >
                                            <XCircle className="w-5 h-5 text-slate-500" />
                                            <span className="text-[8px] font-black uppercase">Limpio</span>
                                        </button>
                                        <button 
                                            onClick={() => document.getElementById('display-bg-up')?.click()}
                                            className={cn("flex-1 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center gap-4 transition-all", settings.displayBgMode === 'custom' ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30")}
                                        >
                                            {settings.displayCustomBgUrl ? (
                                                <img src={settings.displayCustomBgUrl} className="h-full w-full object-cover rounded-2xl opacity-50" />
                                            ) : <Upload className="text-slate-500" />}
                                            <span className="absolute text-[10px] font-black uppercase tracking-widest">{settings.displayCustomBgUrl ? 'CAMBIAR FONDO' : 'SUBIR FONDO PERSONALIZADO'}</span>
                                        </button>
                                        <input id="display-bg-up" type="file" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const compressed = await compressImage(file, 1920, 1080);
                                                const url = await uploadAvatar('display-bg', compressed);
                                                if (url) setSettings({ displayCustomBgUrl: url, displayBgMode: 'custom' });
                                            }
                                        }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )

            }

            {
                activeTab === 'miembros' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className={cn(
                                "p-6 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:scale-105 relative overflow-hidden",
                                settings.adminTheme === 'primitivo' ? "bg-[#101420] border-white/[0.03] shadow-none rounded-[1.5rem]" : "glass-card bg-slate-900/40 border-white/[0.03] shadow-xl"
                            )}>
                                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Users className="w-10 h-10 text-amber-400 mb-3" />
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 leading-none">Membresía Total</p>
                                <h3 className="text-5xl font-black bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent tabular-nums">{members.length}</h3>
                                <div className={cn("absolute bottom-0 left-0 right-0 h-[1.5px] opacity-80", settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" : "bg-gradient-to-r from-transparent via-primary to-transparent")} />
                            </Card>
                            <Card className={cn(
                                "p-6 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:scale-105 relative overflow-hidden",
                                settings.adminTheme === 'primitivo' ? "bg-[#101420] border-white/[0.03] shadow-none rounded-[1.5rem]" : "glass-card bg-slate-900/40 border-white/40 shadow-xl"
                            )}>
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-10 h-10 flex items-center justify-center mb-3">
                                    <User className="w-10 h-10 text-blue-400" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 leading-none">Varones Adultos</p>
                                <h3 className="text-5xl font-black bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent tabular-nums">{members.filter(m => m.gender === 'Varon' && m.category === 'Varon').length}</h3>
                                <div className={cn("absolute bottom-0 left-0 right-0 h-[1.5px] opacity-80", settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" : "bg-gradient-to-r from-transparent via-blue-500 to-transparent")} />
                            </Card>
                            <Card className={cn(
                                "p-6 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:scale-105 relative overflow-hidden",
                                settings.adminTheme === 'primitivo' ? "bg-[#101420] border-white/[0.03] shadow-none rounded-[1.5rem]" : "glass-card bg-slate-900/40 border-white/40 shadow-xl"
                            )}>
                                <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-10 h-10 flex items-center justify-center mb-3">
                                    <User className="w-10 h-10 text-pink-400" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 leading-none">Hermanas Adultas</p>
                                <h3 className="text-5xl font-black bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent tabular-nums">{members.filter(m => m.gender === 'Hermana' && m.category === 'Hermana').length}</h3>
                                <div className={cn("absolute bottom-0 left-0 right-0 h-[1.5px] opacity-80", settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-transparent via-pink-400/20 to-transparent" : "bg-gradient-to-r from-transparent via-pink-500 to-transparent")} />
                            </Card>
                            <Card className={cn(
                                "p-6 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:scale-105 relative overflow-hidden",
                                settings.adminTheme === 'primitivo' ? "bg-[#101420] border-white/[0.03] shadow-none rounded-[1.5rem]" : "glass-card p-6 shadow-2xl bg-slate-900/40 border-white/40"
                            )}>
                                <div className="absolute inset-0 bg-amber-500/10 animate-pulse opacity-30" />
                                <ShieldAlert className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1 leading-none">Auditoría Pendiente</p>
                                <h3 className="text-5xl font-black text-amber-500 tabular-nums">{members.filter(m => m.status === 'Pendiente').length}</h3>
                                <div className={cn("absolute bottom-0 left-0 right-0 h-[1.5px] shadow-[0_0_15px_rgba(251,191,36,0.2)]", settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" : "bg-gradient-to-r from-transparent via-amber-500 to-transparent")} />
                            </Card>
                        </div>

                        {/* 🔒 AUDITORÍA DE SEGURIDAD: REGISTROS PENDIENTES */}
                        {members.filter(m => m.status === 'Pendiente').length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "p-10 rounded-[3rem] bg-gradient-to-br from-amber-500/10 via-[#0a0a0a] to-amber-500/[0.03] border border-amber-500/20 space-y-8 relative overflow-hidden backdrop-blur-3xl group/audit",
                                    settings.adminTheme === 'primitivo' ? "shadow-none" : "shadow-[0_0_50px_rgba(245,158,11,0.05)]"
                                )}
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover/audit:rotate-0 transition-transform duration-700">
                                    <ShieldAlert className="w-48 h-48 text-amber-500" />
                                </div>
                                <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
                                
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center",
                                                settings.adminTheme === 'primitivo' ? "shadow-none" : "shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                            )}>
                                                <ShieldAlert className="w-6 h-6 text-black" />
                                            </div>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter text-amber-500">
                                               Auditoría de <span className="text-white">Seguridad</span>
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.25em] ml-1">Protocolo de aprobación de nuevos perfiles</p>
                                    </div>
                                    <div className={cn(
                                        "bg-amber-500/10 px-8 py-3 rounded-2xl border border-amber-500/30 backdrop-blur-md",
                                        settings.adminTheme === 'primitivo' ? "shadow-none" : "shadow-xl"
                                    )}>
                                        <span className="text-lg font-black text-amber-500 tabular-nums tracking-tighter">{members.filter(m => m.status === 'Pendiente').length} SOLICITUDES ACTIVAS</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                    {members.filter(m => m.status === 'Pendiente').map((pending) => (
                                        <Card key={pending.id} className={cn(
                                            "space-y-6 transition-all duration-500 group/member relative overflow-hidden",
                                            settings.adminTheme === 'primitivo' 
                                                ? "bg-amber-500/[0.03] border border-amber-500/20 hover:border-amber-500/40 rounded-[2rem] p-5 shadow-none" 
                                                : "glass-card bg-[#0a0a0a]/80 border border-white/[0.03] p-6 rounded-[2rem] shadow-2xl hover:border-amber-500/40"
                                        )}>
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover/member:opacity-100 transition-opacity" />
                                            <div className="flex items-center gap-5">
                                                <div className="relative w-16 h-16 shrink-0">
                                                    <div className="absolute inset-0 bg-amber-500/20 rounded-[1.5rem] blur-xl opacity-0 group-hover/member:opacity-100 transition-opacity" />
                                                    <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border-2 border-white/[0.05] group-hover/member:border-amber-500/50 transition-all bg-slate-900">
                                                        {pending.avatar ? <img src={pending.avatar} className="w-full h-full object-cover transition-transform group-hover/member:scale-110" /> : <User className="w-full h-full p-4 text-amber-500/40" />}
                                                    </div>
                                                    {pending.is_pre_registered && (
                                                        <div className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-[9px] font-black px-2 py-0.5 rounded-[6px] border border-[#0b101e] text-black rotate-[5deg] group-hover:rotate-0 transition-transform z-20 tracking-[0.1em]">
                                                            PRE.
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-black text-white truncate uppercase tracking-tighter leading-none mb-1">{pending.name}</p>
                                                    <p className="text-[9px] text-slate-500 truncate font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                                        <Mail className="w-2.5 h-2.5" />
                                                        {pending.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={cn(
                                                            "px-2.5 py-0.5 rounded-[4px] text-[9px] font-black tracking-widest uppercase shadow-none border-0 transition-all",
                                                            pending.role === 'Administrador' || pending.role === 'Ministro a Cargo' 
                                                                ? "bg-amber-900 text-amber-500" 
                                                                : (settings.adminTheme === 'primitivo' 
                                                                    ? "bg-emerald-900 text-emerald-400" 
                                                                    : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400")
                                                        )}>
                                                            {pending.role || 'MIEMBRO'}
                                                        </span>
                                                        {pending.member_group && (
                                                            <span className={cn(
                                                                "border-0 uppercase px-2.5 py-0.5 rounded-[4px] text-[9px] font-black tracking-widest",
                                                                settings.adminTheme === 'primitivo' 
                                                                    ? "bg-slate-800 text-slate-400" 
                                                                    : "bg-[#2A4364]/10 border-[#2A4364]/20 text-[#2A4364]"
                                                            )}>
                                                                {pending.member_group}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex gap-3">
                                                    <Button 
                                                        className={cn(
                                                            "flex-1 h-12 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:translate-y-[-1px] active:translate-y-0",
                                                            settings.adminTheme === 'primitivo' ? "bg-amber-600 hover:bg-amber-500 shadow-none" : "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10"
                                                        )}
                                                        disabled={isSaving}
                                                        onClick={async () => {
                                                            setIsSaving(true);
                                                            await updateProfileInCloud(pending.id, { ...pending, status: 'Activo' } as any);
                                                            await loadMembersFromCloud();
                                                            setIsSaving(false);
                                                            showNotification(`El hermano(a) ${pending.name} ha sido activado.`);
                                                        }}
                                                    >
                                                        APROBAR
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-12 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-[9px] font-black uppercase tracking-widest px-5 rounded-2xl border border-rose-500/10 transition-all"
                                                        onClick={async () => {
                                                            if (confirm(`¿Estás seguro de RECHAZAR a ${pending.name}?`)) {
                                                                setIsSaving(true);
                                                                await supabase.from('profiles').delete().eq('id', pending.id);
                                                                await loadMembersFromCloud();
                                                                setIsSaving(false);
                                                            }
                                                        }}
                                                    >
                                                        RECHAZAR
                                                    </Button>
                                                </div>
                                                <div className="pt-4 border-t border-white/[0.03] space-y-3">
                                                    <p className="text-[7px] font-black uppercase text-slate-400 tracking-[0.2em] text-center opacity-70 ">Vincular con Registro Manual:</p>
                                                    <select 
                                                        className="w-full bg-[#111]/80 border border-white/[0.05] rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-amber-500 outline-none focus:border-amber-500/50 appearance-none cursor-pointer transition-all hover:bg-[#151515]"
                                                        onChange={async (e) => {
                                                            const memberId = e.target.value;
                                                            if (!memberId) return;
                                                            if (confirm(`¿Vincular el Google de ${pending.name} con el registro de ${members.find(m => m.id === memberId)?.name}?`)) {
                                                                setIsSaving(true);
                                                                // @ts-ignore
                                                                const { mergeProfiles } = useAppStore.getState();
                                                                await mergeProfiles(pending.id, pending.email, memberId);
                                                                setIsSaving(false);
                                                            }
                                                        }}
                                                    >
                                                        <option value="">-- Seleccionar Nombre --</option>
                                                        {members
                                                            .filter(m => !m.email && m.status !== 'Pendiente')
                                                            .sort((a,b) => a.name.localeCompare(b.name))
                                                            .map(m => (
                                                                <option key={m.id} value={m.id}>{m.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <Card id="miembros" className={cn("glass-card border-t-4", settings.adminTheme === 'primitivo' ? "border-t-primary" : "border-t-emerald-500")}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className={cn("h-5 w-5", settings.adminTheme === 'primitivo' ? "text-primary" : "text-emerald-500")} />
                                    <CardTitle className="text-xl font-black uppercase">
                                        Gestión de Miembros ({members.length})
                                    </CardTitle>
                                </div>
                                <Button
                                    className={cn(
                                        "text-white font-black uppercase tracking-widest gap-2 h-9 text-[10px]",
                                        settings.adminTheme === 'primitivo' ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
                                    )}
                                    onClick={() => setShowAddMember(!showAddMember)}
                                >
                                    <UserPlus className="w-3.5 h-3.5" /> {showAddMember ? 'Cancelar' : 'Pre-Registrar Miembro'}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Formulario de Nuevo Miembro */}
                                {showAddMember && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className={cn(
                                            "p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden mb-8 shadow-2xl",
                                            settings.adminTheme === 'primitivo' ? "bg-amber-400/[0.03] border border-amber-400/20 shadow-amber-400/5" : "bg-emerald-500/[0.03] border border-emerald-500/20 shadow-emerald-500/5"
                                        )}
                                    >
                                        {/* Background Glow */}
                                        <div className={cn(
                                            "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] pointer-events-none",
                                            settings.adminTheme === 'primitivo' ? "bg-amber-400/10" : "bg-emerald-500/10"
                                        )} />

                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-1">
                                                <h4 className={cn(
                                                    "text-xl font-black uppercase flex items-center gap-3 tracking-tight",
                                                    settings.adminTheme === 'primitivo' ? "text-amber-400" : "text-emerald-400"
                                                )}>
                                                    <div className={cn(
                                                        "p-2 rounded-xl border",
                                                        settings.adminTheme === 'primitivo' ? "bg-amber-400/20 border-amber-400/30" : "bg-emerald-500/20 border-emerald-500/30"
                                                    )}>
                                                        <UserPlus className="w-5 h-5" />
                                                    </div>
                                                    Pre-Registrar Nuevo Miembro
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xl">
                                                    VINCULACIÓN AUTOMÁTICA MEDIANTE GMAIL • GESTIÓN DE ROLES EXTERNA
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    className="h-12 px-6 text-[10px] font-black uppercase hover:bg-white/5 tracking-widest"
                                                    onClick={() => {
                                                        setShowAddMember(false);
                                                        setNewMember({ name: '', email: '', phone: '', role: 'Miembro', gender: 'Varon', category: 'Varon', member_group: '' });
                                                    }}
                                                >
                                                    Descartar
                                                </Button>
                                                <Button
                                                    className={cn(
                                                        "text-white font-black uppercase tracking-[0.15em] gap-3 h-12 px-8 rounded-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]",
                                                        settings.adminTheme === 'primitivo' ? "bg-amber-600 hover:bg-amber-500 shadow-none" : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_15px_30px_rgba(16,185,129,0.3)]"
                                                    )}
                                                    disabled={!newMember.name || isSaving}
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        const success = await addMemberToCloud(newMember);
                                                        if (success) {
                                                            setNewMember({ name: '', email: '', phone: '', role: 'Miembro', gender: 'Varon', category: 'Varon', member_group: '' });
                                                            setShowAddMember(false);
                                                        }
                                                        setIsSaving(false);
                                                    }}
                                                >
                                                    <Save className="w-4 h-4" /> {isSaving ? 'REGISTRANDO...' : 'REGISTRAR MIEMBRO'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                            <div className="space-y-3 relative">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Nombre Completo y Apellido
                                                </label>
                                                <Input
                                                    value={newMember.name || ''}
                                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                                    placeholder="Ej: María López"
                                                    className={cn(
                                                        "bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black transition-all outline-none",
                                                        settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]",
                                                        similarMembers.length > 0 && "border-amber-500/50 bg-amber-500/5"
                                                    )}
                                                />
                                                {similarMembers.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute top-full left-0 right-0 mt-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl z-20 backdrop-blur-xl shadow-2xl"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <AlertCircle className="w-3 h-3 text-amber-500" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">¿Ya está registrado?</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {similarMembers.map(m => (
                                                                <div key={m.id} className="flex items-center justify-between text-[10px] bg-white/5 p-2 rounded-lg border border-white/[0.03]">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-black text-foreground">{m.name}</span>
                                                                        <span className="text-[8px] text-slate-500 truncate max-w-[120px]">{m.email}</span>
                                                                    </div>
                                                                    <span className="text-[7px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full">{m.member_group || 'SIN GRUPO'}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Correo Gmail (Vinculación)
                                                </label>
                                                <Input
                                                    value={newMember.email || ''}
                                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                                    placeholder="ejemplo@gmail.com"
                                                    className={cn(
                                                        "bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black transition-all outline-none",
                                                        settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]",
                                                        similarMembers.some(m => m.email?.toLowerCase().trim() === newMember.email.toLowerCase().trim()) && "border-red-500/50 bg-red-500/5"
                                                    )}
                                                    type="email"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Phone className="w-3 h-3" /> Teléfono de Contacto
                                                </label>
                                                <Input
                                                    value={newMember.phone || ''}
                                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    className={cn(
                                                        "bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black transition-all outline-none",
                                                        settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]"
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Flame className="w-3 h-3" /> Rol en el Sistema
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={newMember.role}
                                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                                        className={cn(
                                                            "w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none transition-all",
                                                            settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]"
                                                        )}
                                                    >
                                                        <option value="Miembro" className="bg-background">MIEMBRO</option>
                                                        <option value="Ministro a Cargo" className="bg-background">MINISTRO A CARGO</option>
                                                        <option value="Administrador" className="bg-background">ADMINISTRADOR</option>
                                                        <option value="Encargado de Jóvenes" className="bg-background">ENCARGADO DE JÓVENES</option>
                                                        <option value="Encargada de Jóvenes" className="bg-background">ENCARGADA DE JÓVENES</option>
                                                        <option value="Dirigente Coro Adultos" className="bg-background">DIRIGENTE CORO ADULTOS</option>
                                                        <option value="Dirigente Coro Niños" className="bg-background">DIRIGENTE CORO NIÑOS</option>
                                                        <option value="Responsable de Asistencia" className="bg-background">RESPONSABLE ASIST.</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Users className="w-3 h-3" /> Categoría
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={newMember.category}
                                                        onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                                                        className={cn(
                                                            "w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none transition-all",
                                                            settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]"
                                                        )}
                                                    >
                                                        <option value="Varon" className="bg-background">VARÓN</option>
                                                        <option value="Hermana" className="bg-background">HERMANA</option>
                                                        <option value="Niño" className="bg-background">NIÑO</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Activity className="w-3 h-3" /> Grupo de Trabajo
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={newMember.member_group}
                                                        onChange={(e) => setNewMember({ ...newMember, member_group: e.target.value })}
                                                        className={cn(
                                                            "w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none transition-all",
                                                            settings.adminTheme === 'primitivo' ? "focus:border-amber-400/50 focus:bg-foreground/[0.05]" : "focus:border-emerald-500/50 focus:bg-foreground/[0.05]"
                                                        )}
                                                    >
                                                        <option value="" className="bg-background">SIN GRUPO</option>
                                                        <option value="Casados" className="bg-background">CASADOS</option>
                                                        <option value="Solos y Solas" className="bg-background">SOLOS Y SOLAS</option>
                                                        <option value="Jóvenes" className="bg-background">JÓVENES</option>
                                                        <option value="Niños" className="bg-background">NIÑOS</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Contenedor Principal Miembros con Sidebar */}
                                <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
                                    {/* Sidebar Vertical Inteligente */}
                                    <div className="lg:w-64 shrink-0 space-y-2 pb-4 border-b lg:border-b-0 lg:border-r border-border/10 pr-0 lg:pr-8">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 pl-2">Filtrar por Grupo</p>
                                        
                                        {/* Search Filter Box */}
                                        <div className="relative mb-8 px-2">
                                            <div className="relative group">
                                                {/* Outer Glow on Focus */}
                                                <div className={cn(
                                                    "absolute -inset-0.5 rounded-2xl blur-md transition-all duration-500",
                                                    settings.adminTheme === 'primitivo' ? "bg-amber-500/0 group-focus-within:bg-amber-500/15" : "bg-emerald-500/0 group-focus-within:bg-emerald-500/15"
                                                )} />
                                                
                                                <div className={cn(
                                                    "relative border overflow-hidden transition-all duration-300 backdrop-blur-md",
                                                    settings.adminTheme === 'primitivo'
                                                        ? "bg-[#0A0D14] border-white/[0.05] rounded-2xl focus-within:border-amber-500/30 focus-within:bg-[#101420] shadow-sm shadow-black"
                                                        : "bg-black/40 border-white/[0.15] rounded-full focus-within:border-emerald-500/60 focus-within:bg-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                                                )}>
                                                    <Search className={cn(
                                                        "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                                        settings.adminTheme === 'primitivo' ? "text-[#2dd4bf]/60 group-focus-within:text-[#2dd4bf]" : "text-slate-400 group-focus-within:text-emerald-400"
                                                    )} />
                                                    <Input 
                                                        value={memberSearch}
                                                        onChange={(e) => setMemberSearch(e.target.value)}
                                                        placeholder="BUSCAR POR NOMBRE O EMAIL"
                                                        className="bg-transparent border-none pl-11 h-11 text-[9px] uppercase font-black tracking-widest text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {[
                                            { id: 'all', label: 'Todos los Miembros', icon: Users, color: 'emerald' },
                                            { id: 'Casados', label: 'Casados', icon: Heart, color: 'rose' },
                                            { id: 'Solos y Solas', label: 'Solos y Solas', icon: User, color: 'blue' },
                                            { id: 'Jóvenes', label: 'Jóvenes', icon: Star, color: 'amber' },
                                            { id: 'Niños', label: 'Niños', icon: Baby, color: 'purple' },
                                            { id: 'other', label: 'Sin Asignar', icon: Flame, color: 'slate' }
                                        ].map((group) => (
                                            <button
                                                key={group.id}
                                                onClick={() => setMemberFilter(group.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 relative group overflow-hidden border",
                                                    memberFilter === group.id
                                                        ? (settings.adminTheme === 'primitivo' 
                                                            ? "bg-amber-400 border-amber-400 text-black font-black shadow-none scale-[1.02] z-20" 
                                                            : "bg-primary border-primary text-primary-foreground font-black shadow-lg shadow-primary/20 scale-[1.05] z-30")
                                                        : (settings.adminTheme === 'primitivo'
                                                            ? "bg-[#101420] border-white/[0.03] text-slate-400 hover:text-white hover:border-white/[0.05]"
                                                            : "bg-white/5 border-white/[0.03] text-slate-400 hover:bg-white/10 hover:text-white")
                                                )}
                                            >
                                                <div className="flex items-center gap-3 z-10">
                                                    <div className={cn(
                                                        "p-2 rounded-lg border transition-all",
                                                        memberFilter === group.id
                                                            ? (settings.adminTheme === 'primitivo' ? "bg-black/20 border-black/10" : `bg-${group.color}-500/20 border-${group.color}-500/30 shadow-lg`)
                                                            : "bg-foreground/5 border-border/10 group-hover:bg-foreground/10"
                                                    )}>
                                                        <group.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest ">{group.label}</span>
                                                </div>

                                                {/* Badge Count */}
                                                <span className={cn(
                                                    "text-[10px] font-black px-2 z-10",
                                                    memberFilter === group.id && settings.adminTheme === 'primitivo' ? "text-black/80" : "opacity-30"
                                                )}>
                                                    {group.id === 'all'
                                                        ? members.length
                                                        : members.filter(m =>
                                                            group.id === 'other'
                                                                ? (!m.member_group || !['Casados', 'Solos y Solas', 'Jóvenes', 'Niños'].includes(m.member_group))
                                                                : m.member_group === group.id
                                                        ).length
                                                    }
                                                </span>

                                                {/* Glow Background for Active */}
                                                {memberFilter === group.id && (
                                                    <motion.div
                                                        layoutId="groupGlow"
                                                        className={cn("absolute inset-0 opacity-20 pointer-events-none blur-xl", `bg-${group.color}-500`)}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Lista de Miembros Dinámica */}
                                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar p-2 self-start align-top">
                                        {members.length === 0 ? (
                                            <div className="col-span-full py-20 text-center space-y-4">
                                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-white/[0.03] opacity-50">
                                                    <Users className="w-10 h-10 text-slate-500" />
                                                </div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">No hay miembros registrados</p>
                                            </div>
                                        ) : (
                                            [
                                                { id: 'Casados', label: 'CASADOS', icon: Heart },
                                                { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', icon: User },
                                                { id: 'Jóvenes', label: 'JÓVENES', icon: Star },
                                                { id: 'Niños', label: 'NIÑOS', icon: Baby },
                                                { id: 'other', label: 'OTROS / SIN GRUPO', icon: Flame }
                                            ].filter(g => memberFilter === 'all' || memberFilter === g.id).map(group => {
                                                const groupMembers = members.filter(m => {
                                                    const matchesGroup = group.id === 'other'
                                                        ? (!m.member_group || !['Casados', 'Solos y Solas', 'Jóvenes', 'Niños'].includes(m.member_group))
                                                        : m.member_group === group.id;

                                                    const searchNorm = normalizeText(memberSearch || '');
                                                    const nameNorm = normalizeText(m.name || '');
                                                    const emailNorm = normalizeText(m.email || '');
                                                    const matchesSearch = !memberSearch || nameNorm.includes(searchNorm) || emailNorm.includes(searchNorm);

                                                    return matchesGroup && matchesSearch;
                                                }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                                                if (groupMembers.length === 0) return null;

                                                return (
                                                    <div key={group.id} className="col-span-full grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4 last:mb-0">
                                                        <div className="col-span-full flex flex-col gap-1 mt-6 first:mt-2 mb-4">
                                                            <div className="flex items-center gap-4 px-4 overflow-hidden">
                                                                 <div className={cn(
                                                                    "p-2.5 rounded-2xl border transition-all",
                                                                    settings.adminTheme === 'primitivo' ? "bg-amber-500/10 border-amber-500/20 shadow-none" : "bg-foreground/[0.03] border-white/[0.03] shadow-2xl"
                                                                )}>
                                                                    <group.icon className={cn("w-4 h-4", settings.adminTheme === 'primitivo' ? "text-amber-400" : "text-emerald-500")} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                                                                        {group.label}
                                                                        <span className="text-[10px] font-bold text-slate-500 not-italic tracking-normal">({groupMembers.length})</span>
                                                                    </h3>
                                                                    <p className="text-[10px] font-bold text-slate-500/60 uppercase tracking-widest leading-none">Gestión de integrantes por grupo</p>
                                                                </div>
                                                                <div className={cn(
                                                                    "flex-1 h-[1px] ml-4 opacity-30",
                                                                    settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-amber-400/20 to-transparent" : "bg-gradient-to-r from-emerald-500/20 to-transparent"
                                                                )} />
                                                            </div>
                                                        </div>
                                                        {groupMembers.map((m) => (
                                                            <motion.div
                                                                layout
                                                                key={m.id}
                                                                whileHover={{ y: -4, scale: 1.01 }}
                                                                 className={cn(
                                                                    "p-5 border transition-all duration-300 group relative overflow-hidden",
                                                                    settings.adminTheme === 'primitivo' 
                                                                        ? "bg-[#101420] border-white/[0.03] hover:border-white/[0.05] rounded-2xl shadow-none" 
                                                                        : (m.is_pre_registered 
                                                                            ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40 rounded-[1.5rem] shadow-none"
                                                                            : "bg-foreground/[0.02] border-border/10 hover:border-primary/30 hover:bg-primary/[0.02] rounded-[1.5rem] shadow-xl")
                                                                )}
                                                            >
                                                                {/* Background Accent / Glow (Aurora) */}
                                                                <div className={cn(
                                                                    "absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-[0.1] pointer-events-none -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:opacity-20 group-hover:scale-110",
                                                                    m.role === 'Administrador' ? "bg-red-500" :
                                                                        m.role === 'Ministro a Cargo' ? "bg-amber-400" : (settings.adminTheme === 'primitivo' ? "bg-[#2dd4bf]" : "bg-emerald-500")
                                                                )} />

                                                                <div className="flex items-start gap-5 relative z-10">
                                                                    {/* Avatar Area */}
                                                                    <div className="relative shrink-0">
                                                                        <div className={cn(
                                                                            "rounded-2xl overflow-hidden relative z-10 transition-all duration-500 group-hover:scale-110",
                                                                            settings.adminTheme === "primitivo" ? "w-16 h-16 border-[3px] border-emerald-500 p-0" : "w-20 h-20 border p-1",
                                                                            m.role === 'Administrador' ? cn("border-red-500/30 bg-red-500/5 shadow-none") :
                                                                                m.role === 'Ministro a Cargo' ? cn("border-amber-400/30 bg-amber-400/10 shadow-none") :
                                                                                    (settings.adminTheme === 'primitivo' 
                                                                                        ? "border-emerald-500/30 bg-emerald-500/5 transition-all duration-700" 
                                                                                        : "border-emerald-500/30 bg-emerald-500/5 transition-all duration-700")
                                                                        )}>
                                                                            {m.avatar ? (
                                                                                <div className="relative w-full h-full group/avatar">
                                                                                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                                                                    
                                                                                    {/* Safe Line Overlay */}
                                                                                    <div className="absolute inset-0 border border-white/[0.05] rounded-2xl pointer-events-none z-20" />
                                                                                    
                                                                                    {/* Rule of Thirds Grid (Subtle) */}
                                                                                    <div className="absolute inset-0 opacity-0 group-hover/avatar:opacity-20 transition-opacity z-20 pointer-events-none">
                                                                                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                                                                                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                                                                                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                                                                                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                                                                                    </div>

                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setEditingImageTarget({ type: 'member', id: m.id });
                                                                                            setImageToEdit(m.avatar!);
                                                                                        }}
                                                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-2xl z-30"
                                                                                        title="Ajustar foto"
                                                                                    >
                                                                                        <Move className="w-6 h-6 text-white" />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center relative">
                                                                                    <User className={cn(
                                                                                        "w-10 h-10",
                                                                                        m.role === 'Administrador' ? "text-red-400" :
                                                                                            m.role === 'Ministro a Cargo' ? "text-[#f5bb24]" : (settings.adminTheme === 'primitivo' ? "text-amber-400" : "text-emerald-400")
                                                                                    )} />
                                                                                    {/* Safe Line even for empty avatar */}
                                                                                    <div className="absolute inset-0 border border-white/[0.03] rounded-2xl pointer-events-none" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {m.role === 'Administrador' && (
                                                                            <div className={cn(
                                                                                "absolute -top-2 -left-2 w-8 h-8 bg-[#EFB722] rounded-full border-2 border-[#101420] flex items-center justify-center -rotate-[12deg] group-hover:rotate-0 transition-transform z-20",
                                                                                "shadow-none"
                                                                            )}>
                                                                                <Crown className="w-4 h-4 text-black" />
                                                                            </div>
                                                                        )}
                                                                        {m.is_pre_registered && (
                                                                            <div className={cn(
                                                                                "absolute z-20 transition-transform group-hover:scale-110",
                                                                                settings.adminTheme === 'primitivo'
                                                                                    ? "-top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-[4px] z-50 flex items-center justify-center leading-none tracking-[0.1em]"
                                                                                    : "-top-1.5 -right-1.5 bg-amber-500 text-[10px] font-black w-11 h-6 flex items-center justify-center rounded-full border-2 border-[#101420] text-black shadow-none"
                                                                            )} style={settings.adminTheme === 'primitivo' ? { backgroundColor: '#EA580C', color: '#FFFFFF' } : {}}>
                                                                                 PRE.
                                                                             </div>
                                                                         )}
                                                                    </div>

                                                                    {/* Info Area */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between">
                                                                            <div>
                                                                                <h4 className={cn(
                                                                                    "font-black text-xl tracking-tight truncate max-w-[200px]",
                                                                                    settings.adminTheme === 'primitivo' ? "text-white" : "text-foreground"
                                                                                )}>{m.name}</h4>
                                                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                                    <span className={cn(
                                                                                        "transition-all uppercase",
                                                                                        settings.adminTheme === 'primitivo' 
                                                                                            ? "text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] " + (m.role === 'Administrador' || m.role === 'Ministro a Cargo' ? "bg-amber-900 text-amber-500" : "bg-emerald-900 text-emerald-400")
                                                                                            : "px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.5px] " + (m.role === 'Administrador' || m.role === 'Ministro a Cargo' ? "bg-[#EFB722] text-black" : ((m.role?.includes('Encargado') || m.status === 'Activo') ? "bg-[#10775F]/10 border-[#10775F]/20 text-[#10775F]" : "bg-slate-400/10 border-slate-400/20 text-slate-400"))
                                                                                    )}>
                                                                                        {m.role === 'Administrador' ? 'ADMINISTRADOR DEL SISTEMA' : m.role}
                                                                                    </span>
                                                                                    {m.member_group && (
                                                                                        <span className={cn(
                                                                                            "uppercase",
                                                                                            settings.adminTheme === 'primitivo'
                                                                                                ? "text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-slate-800 text-slate-300"
                                                                                                : "px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.5px] bg-[#2A4364]/10 text-[#2A4364]"
                                                                                        )}>
                                                                                            {m.member_group}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {editingMemberId === m.id ? (
                                                                                <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                                                                    <select
                                                                                        value={editingRole}
                                                                                        onChange={(e) => setEditingRole(e.target.value)}
                                                                                        className="bg-transparent text-[9px] font-black text-foreground outline-none px-2 cursor-pointer border-b border-white/[0.03] pb-0.5"
                                                                                    >
                                                                                        <option value="Miembro" className="bg-[#0f172a]">MIEMBRO</option>
                                                                                        <option value="Ministro a Cargo" className="bg-[#0f172a]">MINISTRO A CARGO</option>
                                                                                        <option value="Administrador" className="bg-[#0f172a]">ADMINISTRADOR</option>
                                                                                        <option value="Dirigente Coro Adultos" className="bg-[#0f172a]">DIRIGENTE CORO ADULTOS</option>
                                                                                        <option value="Dirigente Coro Niños" className="bg-[#0f172a]">DIRIGENTE CORO NIÑOS</option>
                                                                                        <option value="Responsable de Asistencia" className="bg-[#0f172a]">RESPONSABLE ASIST.</option>
                                                                                    </select>
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <button 
                                                                                            onClick={() => setEditingMemberId(null)} 
                                                                                            className="p-2 text-slate-500 hover:text-white transition-colors rounded-xl bg-transparent hover:bg-white/5"
                                                                                            title="Cancelar"
                                                                                        >
                                                                                            <X className="w-4 h-4" />
                                                                                        </button>
                                                                                        <motion.button
                                                                                            whileHover={{ scale: 1.1 }}
                                                                                            whileTap={{ scale: 0.9 }}
                                                                                            onClick={async () => {
                                                                                                await updateProfileInCloud(m.id, { role: editingRole as any });
                                                                                                await loadMembersFromCloud();
                                                                                                setEditingMemberId(null);
                                                                                            }}
                                                                                            className={cn(
                                                                                                "p-2 text-white rounded-xl transition-colors",
                                                                                                settings.adminTheme === 'primitivo' ? "bg-amber-500 hover:bg-amber-400 shadow-none" : "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                                                            )}
                                                                                            title="Guardar Cambios"
                                                                                        >
                                                                                            <Save className="w-4 h-4" />
                                                                                        </motion.button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={() => {
                                                                                            setEditingMemberId(m.id);
                                                                                            setEditingRole(m.role);
                                                                                        }}
                                                                                        className="p-2 rounded-xl bg-transparent text-muted-foreground hover:text-white transition-colors border border-white/[0.03]"
                                                                                    >
                                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                                    </motion.button>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={async () => {
                                                                                            if (confirm(`¿Eliminar a ${m.name}? Esta acción no se puede deshacer.`)) {
                                                                                                await deleteMemberFromCloud(m.id);
                                                                                                await loadMembersFromCloud();
                                                                                            }
                                                                                        }}
                                                                                        className="p-2 rounded-xl bg-transparent text-muted-foreground hover:text-red-500 transition-colors border border-white/[0.03]"
                                                                                    >
                                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                                    </motion.button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Nota informativa */}
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[10px] text-blue-300 font-bold uppercase leading-relaxed">
                                        💡 <strong>¿Cómo funciona?</strong> Tú pre-registras al miembro con su Gmail. Cuando esa persona abra la app e inicie sesión con Google, su cuenta se vinculará automáticamente al perfil que creaste, con el rol y datos que ya configuraste.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            }

            {
                activeTab === 'perfil' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 max-w-4xl mx-auto"
                    >
                        <Card className="glass-card border-t-4 border-t-amber-500 overflow-hidden">
                            <CardHeader className="relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />
                                <CardTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                                        <User className="w-6 h-6 text-amber-500" />
                                    </div>
                                    Gestión de <span className="text-amber-500">Mi Perfil Personal</span>
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-500">Actualiza tus datos públicos y biografía en el sistema</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-10">
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    {/* Avatar Column */}
                                    <div className="flex flex-col items-center gap-6 shrink-0 w-full md:w-auto">
                                        <div className="relative group">
                                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-amber-500/50 p-2 bg-slate-900 shadow-2xl transition-all duration-500 group-hover:border-amber-500/80">
                                                <img 
                                                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=random`} 
                                                    alt="Admin Avatar" 
                                                    className="w-full h-full object-cover rounded-[2.2rem] group-hover:scale-105 transition-all duration-700" 
                                                />
                                            </div>
                                            <button 
                                                onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-4 border-[#0a0a0a]"
                                            >
                                                <Camera className="w-3.5 h-3.5" /> Cambiar Foto
                                            </button>
                                            <input 
                                                type="file" 
                                                id="admin-avatar-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const compressed = await compressImage(file, 500, 500, 0.8);
                                                        const publicUrl = await uploadAvatar(`admin-avatar-${Date.now()}`, compressed);
                                                        if (publicUrl && currentUser) {
                                                            await updateProfileInCloud(currentUser.id, { avatar: publicUrl } as any);
                                                            setCurrentUser({ ...currentUser, avatar: publicUrl });
                                                            showNotification("Foto actualizada con éxito", 'success');
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-40">Resolución recomendada: 500x500px</p>
                                    </div>

                                    {/* Fields Column */}
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                                                <Input 
                                                    value={currentUser?.name || ''} 
                                                    onChange={(e) => currentUser && setCurrentUser({ ...currentUser, name: e.target.value })}
                                                    className="bg-white/5 border-white/[0.05] h-14 rounded-2xl font-black focus:border-amber-500/50 transition-all font-outfit"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                                                <Input 
                                                    value={currentUser?.email || ''} 
                                                    disabled
                                                    className="bg-white/5 border-white/[0.05] h-14 rounded-2xl font-bold opacity-40 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Versículo Favorito / Lema Personal</label>
                                            <Input 
                                                value={currentUser?.favorite_verse || (currentUser as any)?.favoriteVerse || ''} 
                                                onChange={(e) => currentUser && setCurrentUser({ ...currentUser, favorite_verse: e.target.value })}
                                                placeholder="Ej: Salmos 23:1 - Jehová es mi pastor..."
                                                className="bg-white/5 border-white/[0.05] h-14 rounded-2xl font-medium focus:border-amber-500/50 transition-all "
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Biografía Breve</label>
                                            <textarea 
                                                value={currentUser?.bio || ''} 
                                                onChange={(e) => currentUser && setCurrentUser({ ...currentUser, bio: e.target.value })}
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/[0.05] rounded-2xl p-4 font-medium text-sm focus:border-amber-500/50 transition-all outline-none resize-none"
                                                placeholder="Cuéntanos un poco sobre ti..."
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button 
                                                disabled={isSaving || !currentUser}
                                                onClick={async () => {
                                                    if (!currentUser) return;
                                                    setIsSaving(true);
                                                    const success = await updateProfileInCloud(currentUser.id, {
                                                        name: currentUser.name,
                                                        bio: currentUser.bio,
                                                        favorite_verse: currentUser.favorite_verse
                                                    } as any);
                                                    if (success) {
                                                        showNotification("Perfil guardado correctamente", 'success');
                                                    }
                                                    setIsSaving(false);
                                                }}
                                                className="bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-widest h-14 px-12 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all active:translate-y-0"
                                            >
                                                {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                <Activity className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Estado de la cuenta</h4>
                                <p className="text-xs text-slate-400 font-medium">Logeado como <strong>{currentUser?.email}</strong> • Privilegios: <strong>{currentUser?.role}</strong></p>
                            </div>
                        </div>
                    </motion.div>
                )
            }

            {
                imageToEdit && (
                    <ImageEditor
                        image={imageToEdit}
                        loading={isSaving}
                        onSave={async (croppedDataUrl) => {
                            setIsSaving(true);
                            try {
                                // Convert dataUrl to File
                                const res = await fetch(croppedDataUrl);
                                const blob = await res.blob();
                                const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

                                const targetPath = editingImageTarget?.type === 'minister' ? `minister-${Date.now()}` : `profile-${Date.now()}`;
                                const publicUrl = await uploadAvatar(targetPath, file);

                                if (publicUrl) {
                                    if (editingImageTarget?.type === 'minister') {
                                        setMinister({ avatar: publicUrl });
                                        await saveSettingsToCloud({ ministerAvatar: publicUrl });
                                        if (minister.id && !minister.id.includes('minister-eliab')) {
                                            await updateProfileInCloud(minister.id, { avatar: publicUrl });
                                        }
                                    } else if (editingImageTarget?.type === 'member' && editingImageTarget.id) {
                                        await updateProfileInCloud(editingImageTarget.id, { avatar: publicUrl });
                                        await loadMembersFromCloud(); // Refresh list
                                    }
                                }
                            } catch (err) {
                                console.error("Error saving cropped avatar:", err);
                            } finally {
                                setIsSaving(false);
                                setImageToEdit(null);
                                setEditingImageTarget(null);
                            }
                        }}
                        onCancel={() => {
                            setImageToEdit(null);
                            setEditingImageTarget(null);
                        }}
                    />
                )
            }

        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="p-8 space-y-8">
                <div className="h-48 w-full bg-foreground/5 rounded-3xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-foreground/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
