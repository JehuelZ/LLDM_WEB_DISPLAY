"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, UserProfile, AttendanceRecord } from '@/lib/store'
import {
    LayoutDashboard, CalendarDays, Sparkles, Megaphone,
    Shirt, Settings, Users, UserPlus, CalendarClock,
    ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Save,
    Trash2, Upload, Monitor, Sun, X, Flame, Church, Crown,
    Cross, Star, Heart, TrendingUp, Edit2, LogOut, Moon,
    Bell, CheckCircle2, AlertTriangle, MessageSquare, Info, CheckCircle, Reply, Check, FileText,
    ShieldAlert,
    Camera, Phone, Mail, User, Languages, Music2, ClipboardCheck,
    Calendar, TrendingDown, Clock, Search, Filter, Plus, Radio, BookOpen, Lock, Sunrise, MapPin, Palette, RefreshCw, Power, Thermometer, Type, XCircle,
    ArrowLeft, ArrowRight
} from 'lucide-react'
import { format, parseISO, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn, compressImage, getLocalDateString } from '@/lib/utils'
import { ImageEditor } from '@/components/ImageEditor'
import LunaDonut from '@/components/ui/LunaDonut';
import { TactileAreaChart, TactileBarChart } from '@/components/ui/Charts';
import PremiumCalendar from '@/components/ui/PremiumCalendar';
import './tactile-admin.css'

// Internal components to replicate functionality with tactile style
const TactileIconBox = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <div className="tactile-icon-box" style={{ backgroundColor: color }}>
        <Icon className="w-6 h-6" />
    </div>
)

const TactileBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(
        "bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest inline-flex items-center justify-center transition-all hover:bg-white/10",
        className
    )}>
        {children}
    </div>
)

const TactileGlassCard = ({ children, title, className, subtitle, extra }: { children: React.ReactNode, title?: string, className?: string, subtitle?: string, extra?: React.ReactNode }) => (
    <div className={cn("relative group/card bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl overflow-hidden", className)}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover/card:bg-primary/10 transition-colors duration-700" />
        <div className="relative z-10">
            {title && (
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{title}</h3>
                        {subtitle && <p className="text-[8px] font-bold text-white/20 mt-1 uppercase tracking-[0.2em]">{subtitle}</p>}
                    </div>
                    {extra}
                </div>
            )}
            {children}
        </div>
    </div>
);

// Tactile Input Components
const TactileInput = ({ label, value, onChange, placeholder, icon: Icon, type = "text", disabled }: any) => (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
        {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">{label}</label>}
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub group-focus-within:text-primary transition-colors" />}
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-black/40 border border-white/5 rounded-2xl h-12 text-sm font-bold px-4 transition-all outline-none focus:border-primary/50 focus:bg-black/60",
                    Icon && "pl-12"
                )}
            />
        </div>
    </div>
)

const normalizeText = (text: string) => {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const TactileSelect = ({ label, value, onChange, options, icon: Icon, disabled, searchable = true }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedOption = options.find((opt: any) => opt.value === value);

    const filteredOptions = searchable
        ? options.filter((opt: any) => opt.isHeader || normalizeText(opt.label).includes(normalizeText(searchQuery)))
        : options;

    return (
        <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
            {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">{label}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-black/40 border border-white/5 rounded-2xl h-12 text-sm font-bold px-4 flex items-center justify-between group-focus-within:border-primary/50 transition-all text-left",
                        isOpen && "border-primary/50 bg-black/60",
                        Icon && "pl-12"
                    )}
                >
                    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub group-hover:text-primary transition-colors" />}
                    <span className="truncate flex-1">
                        {selectedOption ? selectedOption.label : 'Seleccionar...'}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-tactile-text-sub transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100]" 
                                onClick={() => { setIsOpen(false); setSearchQuery(''); }} 
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-[#1a1c20]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden flex flex-col max-h-[350px]"
                            >
                                {searchable && (
                                    <div className="p-2 border-b border-white/5 sticky top-0 bg-transparent z-10">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tactile-text-sub" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Buscar..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="overflow-y-auto custom-scrollbar p-1">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt: any, i: number) => (
                                            opt.isHeader ? (
                                                <div 
                                                    key={`header-${i}`} 
                                                    className="px-4 py-2 text-[8px] font-black capitalize tracking-[0.2em] text-primary/60 border-t border-white/5 first:border-0 mt-3 first:mt-1 bg-white/5 rounded-lg mb-1"
                                                >
                                                    {opt.label}
                                                </div>
                                            ) : (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    className={cn(
                                                        "w-full px-4 py-2.5 text-xs font-bold text-left rounded-xl transition-all flex items-center gap-3 group/opt",
                                                        value === opt.value ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-white/5 hover:text-white"
                                                    )}
                                                    onClick={() => {
                                                        onChange(opt.value);
                                                        setIsOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {opt.avatar ? (
                                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                                <img src={opt.avatar} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ) : (
                                                            !opt.isHeader && <div className="w-6 h-6 rounded-full bg-white/5 border border-white/5 shrink-0 flex items-center justify-center text-[8px] text-white/40">{opt.label?.charAt(0)}</div>
                                                        )}
                                                        <span className="truncate">{opt.label}</span>
                                                    </div>
                                                    {value === opt.value && <Check className="w-3.5 h-3.5" />}
                                                </button>
                                            )
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-[10px] font-black capitalize tracking-widest text-tactile-text-sub ">
                                            Sin resultados
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const GOOGLE_FONTS_COLLECTION = [
    { isHeader: true, label: 'Modern Sans (Limpias)' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Sora', label: 'Sora' },
    { value: 'Lexend', label: 'Lexend' },
    { value: 'Urbanist', label: 'Urbanist' },
    { value: 'Rubik', label: 'Rubik' },
    { value: 'Work Sans', label: 'Work Sans' },
    { value: 'Manrope', label: 'Manrope' },
    { value: 'Jost', label: 'Jost' },
    { isHeader: true, label: 'Elegant Serif (Distinción)' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Lora', label: 'Lora' },
    { value: 'EB Garamond', label: 'EB Garamond' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
    { value: 'Cinzel', label: 'Cinzel' },
    { value: 'Frank Ruhl Libre', label: 'Frank Ruhl Libre' },
    { isHeader: true, label: 'Visual Display (Alto Impacto)' },
    { value: 'Orbitron', label: 'Orbitron' },
    { value: 'Black Ops One', label: 'Black Ops One' },
    { value: 'Syne', label: 'Syne' },
    { value: 'Righteous', label: 'Righteous' },
    { value: 'Unbounded', label: 'Unbounded' },
    { value: 'Bungee', label: 'Bungee' },
    { value: 'Passion One', label: 'Passion One' },
    { value: 'Syncopate', label: 'Syncopate' },
    { value: 'Chakra Petch', label: 'Chakra Petch' },
    { value: 'Space Grotesk', label: 'Space Grotesk' },
    { value: 'Bruno Ace', label: 'Bruno Ace' },
    { value: 'Michroma', label: 'Michroma' },
];

const TactileFontSelect = ({ label, value, onChange, icon: Icon, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const options = GOOGLE_FONTS_COLLECTION;
    const selectedOption = options.find((opt: any) => opt.value === value);

    const filteredOptions = options.filter((opt: any) => 
        opt.isHeader || normalizeText(opt.label).includes(normalizeText(searchQuery))
    );

    const loadFont = (fontName: string) => {
        const id = `font-preview-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;
        document.head.appendChild(link);
    };

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(-1);
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => {
                    let next = prev + 1;
                    while (next < filteredOptions.length && filteredOptions[next].isHeader) next++;
                    return next < filteredOptions.length ? next : prev;
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => {
                    let next = prev - 1;
                    while (next >= 0 && filteredOptions[next].isHeader) next--;
                    return next >= 0 ? next : prev;
                });
            } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                const opt = filteredOptions[activeIndex];
                if (!opt.isHeader) {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchQuery('');
                }
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, filteredOptions, onChange]);

    useEffect(() => {
        if (isOpen) {
            if (selectedOption?.value) loadFont(selectedOption.value);
            filteredOptions.slice(0, 15).forEach(opt => {
                if (!opt.isHeader && opt.value) loadFont(opt.value);
            });
        }
    }, [isOpen, filteredOptions, selectedOption]);

    return (
        <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
            {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">{label}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-black/40 border border-white/5 rounded-2xl h-16 text-sm font-bold px-4 flex items-center justify-between group-focus-within:border-primary/50 transition-all text-left",
                        isOpen && "border-primary/50 bg-black/60",
                        Icon && "pl-12"
                    )}
                >
                    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub group-hover:text-primary transition-colors" />}
                    <div className="flex flex-col flex-1 truncate">
                        <span className="text-[8px] opacity-40 capitalize tracking-widest font-black mb-0.5">Tipografía Activa</span>
                        <span className="truncate text-xl lg:text-2xl leading-tight" style={{ fontFamily: selectedOption?.value || 'inherit' }}>
                            {selectedOption ? selectedOption.label : 'Seleccionar Fuente...'}
                        </span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-tactile-text-sub transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100]" 
                                onClick={() => { setIsOpen(false); setSearchQuery(''); }} 
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-[#1a1c20]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden flex flex-col max-h-[450px]"
                            >
                                <div className="p-3 border-b border-white/10 sticky top-0 bg-transparent z-10 backdrop-blur-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tactile-text-sub" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Buscar fuente... (↑ ↓ Enter)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-y-auto custom-scrollbar p-1">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt: any, i: number) => (
                                            opt.isHeader ? (
                                                <div 
                                                    key={`header-${i}`} 
                                                    className="px-4 py-2 text-[8px] font-black capitalize tracking-[0.2em] text-primary/60 border-t border-white/5 first:border-0 mt-3 first:mt-1 bg-white/5 rounded-lg mb-1"
                                                >
                                                    {opt.label}
                                                </div>
                                            ) : (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onMouseEnter={() => {
                                                        loadFont(opt.value);
                                                        setActiveIndex(i);
                                                    }}
                                                    className={cn(
                                                        "w-full px-4 py-4 text-left rounded-xl transition-all flex items-center justify-between group/opt",
                                                        (value === opt.value || activeIndex === i) ? "bg-primary/20 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                                    )}
                                                    onClick={() => {
                                                        onChange(opt.value);
                                                        setIsOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="text-[10px] opacity-40 font-mono tracking-tighter mb-1">Muestra Técnica</span>
                                                        <span style={{ fontFamily: opt.value }} className="text-2xl leading-none truncate pr-4">
                                                            {opt.label}
                                                        </span>
                                                    </div>
                                                    {(value === opt.value) && (
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-tactile-text-sub font-black capitalize tracking-widest text-[10px]">
                                            Sin resultados
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function TactileAdmin({ propTab, children }: { propTab?: string, children?: React.ReactNode }) {
    const {
        settings, setSettings,
        calendarStyles, setCalendarStyles,
        members, currentDate, setCurrentDate,
        monthlySchedule, setScheduleForDay,
        saveSettingsToCloud, loadSettingsFromCloud,
        loadMembersFromCloud, loadDayScheduleFromCloud,
        saveScheduleDayToCloud, saveRecurringScheduleToCloud,
        seedMonthSchedule, announcements, saveAnnouncementToCloud,
        deleteAnnouncementFromCloud, currentUser, deleteMemberFromCloud,
        addMemberToCloud, updateProfileInCloud,
        uploadAvatar, setCurrentUser,
        theme, saveThemeToCloud, loadThemeFromCloud,
        uniforms, uniformSchedule, loadUniformsFromCloud,
        saveUniformToCloud, deleteUniformFromCloud,
        saveUniformForDateToCloud, rehearsals,
        loadRehearsalsFromCloud, saveRehearsalToCloud, deleteRehearsalFromCloud,
        minister, setMinister, signOut,
        createTestAccounts, simulateUser,
        messages, loadCloudMessages, markMessageAsRead,
        sendCloudMessage, subscribeToMessages,
        loadAllSchedulesFromCloud, loadAnnouncementsFromCloud,
        attendanceRecords, loadAttendanceFromCloud, saveAttendanceToCloud,
        loadWeeklyAttendanceStats,
        loadMonthlyGlobalAttendanceStats,
        loadMemberAttendanceHistory,
        loadMonthlyIntelligenceStats,
        showNotification
    } = useAppStore()

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    if (!currentUser) return null;

    const isSun = parseISO(currentDate).getDay() === 0;

    const currentDaySchedule = monthlySchedule[currentDate] || {
        slots: {
            '5am': { leaderId: '', time: '05:00 AM', endTime: '05:30 AM', language: 'es' },
            '9am': { consecrationLeaderId: '', doctrineLeaderId: '', time: '09:00 AM', endTime: '10:00 AM', language: 'es' },
            '12pm': { leaderId: '', time: '12:00 PM', endTime: '01:00 PM', language: 'es' },
            'evening': { leaderIds: [], time: '07:00 PM', endTime: '08:00 PM', type: 'regular', language: 'es' }
        }
    };

    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [monthlyIntelligence, setMonthlyIntelligence] = useState<{ label: string, value: number }[]>([]);
    const [attendanceTrend, setAttendanceTrend] = useState({ value: 0, isPos: true });
    const [intelligenceRange, setIntelligenceRange] = useState<7 | 15 | 30>(30);

    useEffect(() => {
        setMounted(true);
        loadMonthlyIntelligenceStats().then(setMonthlyIntelligence);

        // Calculate dynamic trend for better Intelligence
        loadMonthlyGlobalAttendanceStats().then(stats => {
            if (stats.length >= 30) {
                const currentMonth = stats.slice(-15).reduce((acc, s) => acc + s.percentage, 0) / 15;
                const prevMonth = stats.slice(-30, -15).reduce((acc, s) => acc + s.percentage, 0) / 15;
                const diff = currentMonth - prevMonth;
                setAttendanceTrend({
                    value: Math.abs(Math.round(diff * 10) / 10),
                    isPos: diff >= 0
                });
            }
        });

        loadWeeklyAttendanceStats().then(setWeeklyStats);
        // Sync initial tab from URL on mount
        const params = new URLSearchParams(window.location.search);
        const queryTab = params.get('tab');
        if (queryTab) {
            const aliasMap: Record<string, string> = {
                'configuracion': 'ajustes',
                'temas': 'contenido',
                'mensajes': 'dashboard',
                'ajustes': 'ajustes'
            };
            const finalTab = aliasMap[queryTab] || queryTab;
            const validTabIds = tabs.map(t => t.id);
            if (validTabIds.includes(finalTab)) {
                setActiveTab(finalTab);
            }
        }
    }, []);

    useEffect(() => {
        const handleLocationChange = () => {
            const currentParams = new URLSearchParams(window.location.search);
            const queryTab = currentParams.get('tab');
            const hash = window.location.hash.replace('#', '');

            const targetTab = queryTab || hash;

            // Map aliases (especially for layout.tsx compatibility)
            const aliasMap: Record<string, string> = {
                'configuracion': 'ajustes',
                'temas': 'contenido',
                'mensajes': 'dashboard',
                'ajustes': 'ajustes'
            };

            const finalTab = (targetTab && aliasMap[targetTab]) || targetTab;

            if (finalTab) {
                const validTabIds = tabs.map(t => t.id);
                if (validTabIds.includes(finalTab) && finalTab !== activeTab) {
                    setActiveTab(finalTab);
                }
            } else if (activeTab !== 'dashboard') {
                setActiveTab('dashboard');
            }
        };

        // Sync with prop if it changes (provided by parent page.tsx)
        if (propTab && propTab !== activeTab) {
            setActiveTab(propTab);
        }

        // Listen for standard popstate and custom hashchange events
        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('hashchange', handleLocationChange);
        window.addEventListener('tab-change', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('hashchange', handleLocationChange);
            window.removeEventListener('tab-change', handleLocationChange);
        };
    }, [activeTab, propTab]);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const tabs = [
        { id: 'dashboard', label: 'RESUMEN', icon: LayoutDashboard },
        { id: 'asistencia', label: 'ASISTENCIA', icon: ClipboardCheck },
        { id: 'horarios', label: 'HORARIOS', icon: CalendarDays },
        { id: 'miembros', label: 'MIEMBROS', icon: Users },
        { id: 'coros', label: 'COROS Y UNIFORMES', icon: Music2 },
        { id: 'contenido', label: 'TEMA SEMANAL', icon: Sparkles },
        { id: 'estilos', label: 'DISEÑO Y VISUAL', icon: Palette },
        { id: 'ajustes', label: 'CONFIGURACIÓN', icon: Settings },
        { id: 'mensajes', label: 'MENSAJES', icon: MessageSquare },
        { id: 'perfil', label: 'MI PERFIL', icon: User },
    ]
    const [newAnn, setNewAnn] = useState<any>({ title: '', content: '', priority: 0, expiresAt: '' })
    const [editingAnnId, setEditingAnnId] = useState<string | null>(null)
    const [memberFilter, setMemberFilter] = useState('all')
    const [showAddMember, setShowAddMember] = useState(false)
    const [editingMember, setEditingMember] = useState<UserProfile | null>(null)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')
    const [newMemberData, setNewMemberData] = useState<Partial<UserProfile>>({
        name: '',
        email: '',
        phone: '',
        role: 'Miembro',
        gender: 'Varon',
        category: 'Varon',
        member_group: 'Casados',
        status: 'Activo'
    })

    const [selectedMemberForHistory, setSelectedMemberForHistory] = useState<UserProfile | null>(null)
    const [memberHistory, setMemberHistory] = useState<AttendanceRecord[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    const [showRehearsalModal, setShowRehearsalModal] = useState(false)
    const [editingRehearsal, setEditingRehearsal] = useState<any>(null)
    const [currentAttendanceSession, setCurrentAttendanceSession] = useState<'5am' | '9am' | 'evening'>('5am')

    // Automatic Session Selection based on time
    useEffect(() => {
        const updateSession = () => {
            const now = new Date();
            const hrs = now.getHours();
            if (hrs < 8) setCurrentAttendanceSession('5am');
            else if (hrs < 15) setCurrentAttendanceSession('9am');
            else setCurrentAttendanceSession('evening');
        };
        updateSession();
        // Periodically check (every 5 mins)
        const timer = setInterval(updateSession, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);
    const [optimisticAttendance, setOptimisticAttendance] = useState<Record<string, Record<string, boolean>>>({})
    const [processingToggles, setProcessingToggles] = useState<Record<string, boolean>>({})
    const [weeklyStats, setWeeklyStats] = useState<any[]>([])
    const [monthlyGlobalStats, setMonthlyGlobalStats] = useState<any[]>([])

    const [newRehearsal, setNewRehearsal] = useState({ dayOfWeek: 1, time: '06:00 PM', location: 'Templo' })
    const [imageToEdit, setImageToEdit] = useState<{ source: string, target: 'member' | 'minister' } | null>(null)

    const dataURLtoFile = (dataurl: string, filename: string) => {
        let arr = dataurl.split(','),
            match = arr[0].match(/:(.*?);/),
            mime = match ? match[1] : 'image/jpeg',
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    useEffect(() => {
        loadMembersFromCloud();
        loadSettingsFromCloud();
        loadUniformsFromCloud();
        useAppStore.getState().loadAllSchedulesFromCloud();
        useAppStore.getState().loadAnnouncementsFromCloud();
        useAppStore.getState().loadThemeFromCloud();
        loadRehearsalsFromCloud();

        const unsubSettings = useAppStore.getState().subscribeToSettings();
        return () => unsubSettings();
    }, [loadMembersFromCloud, loadSettingsFromCloud, loadUniformsFromCloud, loadRehearsalsFromCloud]);

    useEffect(() => {
        loadCloudMessages();
        const unsubMessages = subscribeToMessages();
        return () => unsubMessages();
    }, [loadCloudMessages, subscribeToMessages]);

    useEffect(() => {
        loadDayScheduleFromCloud(currentDate)
        loadAttendanceFromCloud(currentDate)
    }, [currentDate, loadDayScheduleFromCloud, loadAttendanceFromCloud])

    useEffect(() => {
        if (activeTab === 'asistencia' || activeTab === 'dashboard') {
            const fetchStats = async () => {
                const [wData, mData] = await Promise.all([
                    loadWeeklyAttendanceStats(),
                    loadMonthlyGlobalAttendanceStats()
                ]);
                setWeeklyStats(wData);
                setMonthlyGlobalStats(mData);
            };
            fetchStats();
        }
    }, [activeTab, loadWeeklyAttendanceStats, loadMonthlyGlobalAttendanceStats]);
    const navigateDay = (days: number) => {
        const date = new Date(currentDate + 'T12:00:00')
        date.setDate(date.getDate() + days)
        const newDate = getLocalDateString(date)
        setCurrentDate(newDate)
    }

    const handleViewHistory = async (member: UserProfile) => {
        setSelectedMemberForHistory(member);
        setIsLoadingHistory(true);
        try {
            const history = await loadMemberAttendanceHistory(member.id);
            setMemberHistory(history);
        } catch (error) {
            console.error("Error loading member history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const toggleAttendance = async (memberId: string, session: string) => {
        if (processingToggles[memberId]) return;

        const date = currentDate;
        const currentRecords = attendanceRecords[date] || [];
        const record = currentRecords.find(r => r.member_id === memberId && r.session_type === session);
        const willBePresent = !record?.present;

        // Optimistic UI
        setOptimisticAttendance(prev => ({
            ...prev,
            [memberId]: {
                ...(prev[memberId] || {}),
                [session]: willBePresent
            }
        }));

        setProcessingToggles(prev => ({ ...prev, [memberId]: true }));

        try {
            await saveAttendanceToCloud([{
                member_id: memberId,
                date: date,
                session_type: session as any,
                present: willBePresent,
                time: new Date().toLocaleTimeString('en-US', { hour12: false })
            }]);
        } catch (error) {
            console.error("Error toggling attendance:", error);
            showNotification(`Error al guardar asistencia: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
            setOptimisticAttendance(prev => ({
                ...prev,
                [memberId]: {
                    ...(prev[memberId] || {}),
                    [session]: !willBePresent
                }
            }));
        } finally {
            setProcessingToggles(prev => ({ ...prev, [memberId]: false }));
            setTimeout(() => {
                setOptimisticAttendance(prev => {
                    const next = { ...prev };
                    if (next[memberId]) {
                        delete next[memberId][session];
                        if (Object.keys(next[memberId]).length === 0) delete next[memberId];
                    }
                    return next;
                });
            }, 1000);
        }
    };

    const updateSlot = async (slot: '5am' | '9am' | 'evening' | '12pm', updates: any) => {
        const previousState = { ...currentDaySchedule };
        const newSlots = {
            ...currentDaySchedule.slots,
            [slot]: {
                ...currentDaySchedule.slots[slot],
                ...updates
            }
        };

        // Optimistic local update
        setScheduleForDay(currentDate, {
            ...currentDaySchedule,
            slots: newSlots
        });

        setIsSaving(true);
        try {
            await saveScheduleDayToCloud(currentDate, newSlots);
        } catch (error: any) {
            console.error("Error updating slot:", error);
            // Revert on failure
            setScheduleForDay(currentDate, previousState);
            showNotification(`Error al guardar: ${error.message || 'Error desconocido'}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCustomLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            try {
                const compressed = await compressImage(file, 800, 800);
                console.log(`Uploading file ${file.name} to slot ${slot}...`, { type: file.type, size: file.size });

                const publicUrl = await uploadAvatar(`custom-logo-${slot}`, compressed);

                if (publicUrl) {
                    const settingKey = `customLogo${slot}` as any;
                    await saveSettingsToCloud({
                        [settingKey]: publicUrl,
                        churchLogoUrl: publicUrl
                    });
                    showNotification(`Logo ${slot} actualizado y aplicado exitosamente.`, 'success');
                } else {
                    console.warn(`Upload returned no URL for slot ${slot}`);
                }
            } catch (error: any) {
                console.error(`Error uploading custom logo ${slot}:`, error);
                showNotification(`Falla al subir logo: ${error.message || 'Error de conexión'}`, 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const ministerMember = members.find(m => m.name === settings.ministerName);

    const memberOptions = React.useMemo(() => {
        const base = [{ value: '', label: 'Seleccionar...' }];

        const categories = [
            { id: 'casados', label: 'CASADOS / CASADAS', variants: ['casados', 'casadas'] },
            { id: 'jovenes', label: 'JÓVENES', variants: ['jovenes', 'jóvenes'] },
            { id: 'solos', label: 'SOLOS Y SOLAS', variants: ['solos y solas', 'solos', 'solas', 'soltero', 'solteros', 'soltera', 'solteras'] },
            { id: 'ninos', label: 'NIÑOS / NIÑAS', variants: ['niños', 'niñas', 'niño', 'niña'] },
        ];

        let groupedItems: any[] = [];
        let assignedMemberIds = new Set<string>();

        // Ministro primero si existe
        if (ministerMember) {
            groupedItems.push({ value: 'header-minister', label: 'MINISTERIO', isHeader: true });
            groupedItems.push({
                value: ministerMember.id,
                label: `⭐ EL MINISTRO (${ministerMember.name})`,
                avatar: ministerMember.avatar
            });
            assignedMemberIds.add(ministerMember.id);
        }

        // Procesar categorías
        categories.forEach(cat => {
            const groupMembers = members.filter(m => {
                const group = m.member_group?.toLowerCase().trim() || '';
                return cat.variants.some(v => group.includes(v)) || cat.variants.includes(group);
            }).sort((a, b) => a.name.localeCompare(b.name));

            if (groupMembers.length > 0) {
                groupedItems.push({ value: `header-${cat.id}`, label: cat.label, isHeader: true });
                groupMembers.forEach(m => {
                    if (m.id !== ministerMember?.id) {
                        groupedItems.push({
                            value: m.id,
                            label: m.name,
                            avatar: m.avatar
                        });
                        assignedMemberIds.add(m.id);
                    }
                });
            }
        });

        // Otros miembros
        const remainingMembers = members
            .filter(m => !assignedMemberIds.has(m.id))
            .sort((a, b) => a.name.localeCompare(b.name));

        if (remainingMembers.length > 0) {
            groupedItems.push({ value: 'header-other', label: 'OTROS / SIN GRUPO', isHeader: true });
            remainingMembers.forEach(m => {
                groupedItems.push({
                    value: m.id,
                    label: m.name,
                    avatar: m.avatar
                });
            });
        }

        return [...base, ...groupedItems];
    }, [members, ministerMember]);

    return (
        <div className="tactile-admin-root">
            {/* Background Backlighting Glow */}
            <div className="base-glow" />

            <div className="tactile-main-container">
                {/* Actual Side Menu */}
                <aside
                    className={cn(
                        "relative z-30 flex flex-col bg-white/[0.02] border-r border-white/5 transition-all duration-500 ease-in-out h-full admin-sidebar-v2",
                        isSidebarCollapsed ? "w-14" : "w-56"
                    )}
                >
                    {/* Floating Toggle Button (Alair Style - Orange Version) */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="absolute -right-3.5 top-20 w-7 h-7 bg-[#f59e0b] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] z-50 text-white hover:scale-110 transition-transform border-none active:scale-95"
                    >
                        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <div
                        onClick={() => setActiveTab('dashboard')}
                        className={cn(
                            "flex items-center transition-all duration-300 group cursor-pointer overflow-hidden",
                            isSidebarCollapsed ? "p-3 justify-center" : "p-4 justify-start gap-3"
                        )}
                    >
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center border border-[#f59e0b]/20 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-transform group-hover:scale-110">
                                <img
                                    src={settings.churchLogoUrl || "/flama-oficial.svg"}
                                    className="w-6 h-6 object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all"
                                    alt="Logo"
                                />
                            </div>
                            <div className="absolute inset-0 rounded-xl border border-white/20 ring-1 ring-white/5" />
                        </div>

                        {!isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <h1 className="text-xl font-bold tracking-tighter leading-none text-foreground whitespace-nowrap">
                                    Rodeo <span className="text-[#f59e0b]">Admin</span>
                                </h1>

                            </motion.div>
                        )}
                    </div>

                    {/* Search Bar (Alair Style) */}
                    {!isSidebarCollapsed && (
                        <div className="px-3 mb-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-[#f59e0b] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full bg-white/5 border border-white/5 rounded-lg h-9 pl-9 pr-3 text-[12px] font-semibold outline-none focus:bg-white/10 transition-all text-foreground placeholder:text-muted-foreground/30"
                                />
                            </div>
                        </div>
                    )}
                    {isSidebarCollapsed && (
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white transition-colors cursor-pointer">
                                <Search className="w-5 h-5" />
                            </div>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar py-4">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        const url = new URL(window.location.href);
                                        url.searchParams.set('tab', tab.id);
                                        window.history.pushState({}, '', url.toString());
                                    }}
                                    className={cn(
                                        "transition-all duration-300 group relative flex items-center outline-none mb-1 w-full",
                                        isSidebarCollapsed
                                            ? "h-11 justify-center"
                                            : "px-3 py-2.5 gap-3 rounded-lg mx-1 w-auto",
                                        isActive
                                            ? "bg-tactile-orange-pill text-white font-bold"
                                            : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                                    )}
                                >
                                    {/* Active Indicator Bar (Orange/Primary) */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#f59e0b] rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                    )}

                                    <div className={cn(
                                        "transition-transform group-hover:scale-110 shrink-0",
                                        isActive ? "text-primary" : "text-white/40 group-hover:text-white"
                                    )}>
                                        <tab.icon className="w-5 h-5" />
                                    </div>

                                    {!isSidebarCollapsed && (
                                        <span className="text-[12px] font-semibold capitalize tracking-wide whitespace-nowrap">
                                            {tab.label}
                                        </span>
                                    )}

                                    {/* Tooltip on Collapsed Mode */}
                                    {isSidebarCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1 bg-black/80 border border-white/10 rounded-lg text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50">
                                            {tab.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 space-y-4 border-t border-white/5">
                        {/* Theme Switcher (Alair Style) */}
                        {!isSidebarCollapsed && (
                            <div className="flex bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => saveSettingsToCloud({ themeMode: 'light' })}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 h-9 text-[12px] font-semibold rounded-lg transition-all",
                                        settings.themeMode === 'light' ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white"
                                    )}
                                >
                                    <Sun className="w-3.5 h-3.5" />
                                    <span>Light</span>
                                </button>
                                <button
                                    onClick={() => saveSettingsToCloud({ themeMode: 'dark' })}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 h-9 text-[12px] font-semibold rounded-lg transition-all",
                                        settings.themeMode === 'dark' ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white"
                                    )}
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                    <span>Dark</span>
                                </button>
                            </div>
                        )}
                        {isSidebarCollapsed && (
                            <button
                                onClick={() => saveSettingsToCloud({ themeMode: settings.themeMode === 'light' ? 'dark' : 'light' })}
                                className="w-10 h-10 mx-auto flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
                            >
                                {settings.themeMode === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        {/* User Profile Footer (Alair Style) */}
                        {!isSidebarCollapsed && (
                            <div className="flex items-center gap-3 p-1.5 bg-white/5 rounded-lg group border border-transparent hover:border-white/5 transition-all">
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg">
                                    <img
                                        src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=random`}
                                        alt={currentUser?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-[12px] font-semibold text-foreground truncate leading-none mb-1">{currentUser?.name || 'Admin'}</p>
                                    <p className="text-[11px] text-muted-foreground truncate leading-none">{currentUser?.email || 'admin@lldmrodeo.org'}</p>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="p-1 text-white/20 hover:text-primary transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                        {isSidebarCollapsed && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                    <img
                                        src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=random`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Global Primitivo Header (Horizontal Nav + Utils) */}
                    <div className="px-8 pt-6 pb-2 flex flex-col gap-4">
                        <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                            {tabs.filter(t => !['mensajes', 'perfil'].includes(t.id)).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                        activeTab === tab.id
                                            ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}

                            <div className="flex-1 min-w-[20px]" />

                            <div className="flex items-center gap-2 pr-1">
                                <button
                                    onClick={() => (document.getElementById('global-sync-btn') as HTMLElement)?.click()}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all text-white/40 hover:text-primary group"
                                    title="Sincronizar Datos"
                                >
                                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                </button>
                                <button
                                    onClick={() => window.open('/display', '_blank')}
                                    className="tactile-btn tactile-btn-glass text-[9px] font-black tracking-widest h-10 border-white/5 group"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-primary" />
                                    PROYECTAR
                                </button>
                                <button
                                    onClick={() => saveSettingsToCloud({ adminTheme: 'primitivo' })}
                                    className="tactile-btn tactile-btn-glass text-[9px] font-black tracking-widest h-10 border-[#fbbf24]/20 bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all"
                                    title="Activar Espejo Primitivo"
                                >
                                    PRIMITIVO
                                </button>
                                <button
                                    onClick={() => saveSettingsToCloud({ adminTheme: 'classic' })}
                                    className="tactile-btn tactile-btn-glass text-[9px] font-black tracking-widest h-10 border-white/5"
                                    title="Volver a la UI Clásica"
                                >
                                    CLASSIC
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="tactile-btn tactile-btn-orange text-[9px] font-black tracking-widest h-10 px-4"
                                >
                                    SALIR
                                </button>

                                <div className="w-px h-6 bg-white/10 mx-2" />

                                <button
                                    onClick={() => setActiveTab('perfil')}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all",
                                        activeTab === 'perfil' ? "bg-[#576983]/20 border border-[#576983]/30" : "bg-white/5 border border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-primary/30">
                                        <img
                                            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=random`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest hidden lg:inline",
                                        activeTab === 'perfil' ? "text-white" : "text-white/40"
                                    )}>
                                        {currentUser?.name || 'ADMIN'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Global Date & Status Header */}
                    <div className="px-8 pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-6">

                        <div className="flex items-center gap-4">
                            {/* Service Status Indicator */}
                            {(() => {
                                const now = new Date();
                                const isToday = currentDate === getLocalDateString(now);
                                const isSun = parseISO(currentDate).getDay() === 0;
                                const hrs = now.getHours();
                                const mins = now.getMinutes();
                                const curMin = hrs * 60 + mins;

                                // Sunday School Detection (10:00 AM - 12:00 PM)
                                const isDominical = isSun && curMin >= 600 && curMin <= 720;
                                const is5am = curMin >= 300 && curMin <= 345;
                                const is9am = !isSun && curMin >= 540 && curMin <= 600;
                                const is7pm = curMin >= 1140 && curMin <= 1230;

                                if (isToday) {
                                    if (isDominical) return (
                                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-orange-500/20 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
                                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                                            <span className="text-[11px] font-black capitalize tracking-[0.2em] text-orange-500">Dominical en Curso</span>
                                        </div>
                                    );
                                    if (is5am) return (
                                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] animate-pulse">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
                                            <span className="text-[11px] font-black capitalize tracking-[0.2em] text-primary">5:00 AM en Curso</span>
                                        </div>
                                    );
                                    if (is9am) return (
                                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] animate-pulse">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
                                            <span className="text-[11px] font-black capitalize tracking-[0.2em] text-primary">9:00 AM en Curso</span>
                                        </div>
                                    );
                                    if (is7pm) return (
                                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] animate-pulse">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
                                            <span className="text-[11px] font-black capitalize tracking-[0.2em] text-primary">7:00 PM en Curso</span>
                                        </div>
                                    );
                                }

                                return null;
                            })()}

                            {isSaving && (
                                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20">
                                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                                    <span className="text-[10px] font-black capitalize tracking-widest text-primary">Sincronizando...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1 p-8 tactile-scroll">
                        {/* Secondary Horizontal Navigation Bar (Primitivo Tab Style) */}
                        <div className="mb-8">
                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                                {[
                                    { id: 'dashboard', label: 'RESUMEN', icon: LayoutDashboard },
                                    { id: 'horarios', label: 'HORARIOS', icon: CalendarDays },
                                    { id: 'estilos', label: 'DISEÑO Y VISUAL', icon: Palette },
                                    { id: 'coros', label: 'COROS Y UNIFORMES', icon: Music2 },
                                    { id: 'ajustes', label: 'CONFIGURACIÓN', icon: Settings },
                                    { id: 'miembros', label: 'MIEMBROS', icon: Users },
                                    { id: 'perfil', label: 'MI PERFIL', icon: User }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            const url = new URL(window.location.href);
                                            url.searchParams.set('tab', tab.id);
                                            window.history.pushState({}, '', url.toString());
                                        }}
                                        className={cn(
                                            "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                            activeTab === tab.id
                                                ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'dashboard' && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    {/* Left Column - System Summary */}
                                    <div className="col-span-1 md:col-span-8 space-y-6">
                                        <div className="flex items-end justify-between mb-8">
                                            <h2 className="text-4xl font-black text-foreground" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>Resumen del Sistema</h2>
                                            {isSaving && (
                                                <TactileBadge className="border-primary/20 bg-primary/10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                                                    <span className="text-primary">Sincronizando...</span>
                                                </TactileBadge>
                                            )}

                                        </div>
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setActiveTab('asistencia')}
                                                className="w-full flex items-center gap-6 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group text-left"
                                            >
                                                <TactileIconBox icon={CheckCircle2} color="#3b82f6" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">Asistencia de Hoy</h4>
                                                    <p className="text-muted-foreground text-sm">Registro de asistencia en curso</p>
                                                </div>
                                                <TactileBadge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                                    Normal
                                                </TactileBadge>

                                            </button>

                                            {/* Redundant nav rows removed as they are now in the Sidemenu */}
                                        </div>

                                        <div className="mt-12 flex gap-4">
                                            <button
                                                onClick={async () => {
                                                    setIsSaving(true);
                                                    await Promise.all([
                                                        loadAllSchedulesFromCloud(),
                                                        loadAnnouncementsFromCloud(),
                                                        loadSettingsFromCloud(),
                                                        loadMembersFromCloud(),
                                                        loadUniformsFromCloud()
                                                    ]);
                                                    setIsSaving(false);
                                                    showNotification('Datos sincronizados con la nube', 'success');
                                                }}
                                                className="tactile-btn tactile-btn-orange text-xs px-8"
                                            >
                                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                                                Sincronizar Ahora
                                            </button>
                                            <button className="tactile-btn tactile-btn-glass text-xs px-8">Historial</button>
                                        </div>
                                    </div>
                                    {/* Right Column - Intelligence */}
                                    <div className="col-span-1 md:col-span-4 space-y-8">
                                        <TactileGlassCard 
                                            title="INTELIGENCIA MENSUAL" 
                                            className="w-full"
                                            extra={
                                                <div className="flex bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                                                    {[7, 15, 30].map(r => (
                                                        <button
                                                            key={r}
                                                            onClick={() => setIntelligenceRange(r as 7 | 15 | 30)}
                                                            className={cn(
                                                                "px-4 py-1.5 rounded-full text-[9px] font-black transition-all duration-300 tracking-widest",
                                                                intelligenceRange === r 
                                                                    ? "bg-primary text-black shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105" 
                                                                    : "text-white/30 hover:text-white/60"
                                                            )}
                                                        >
                                                            {r}D
                                                        </button>
                                                    ))}
                                                </div>
                                            }
                                        >
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black capitalize text-primary tracking-[0.2em]">Rendimiento {intelligenceRange} Días</p>
                                                    <TactileBadge className={cn(
                                                        "gap-1.5",
                                                        attendanceTrend.isPos ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                                    )}>
                                                        {attendanceTrend.isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        <span>{attendanceTrend.isPos ? '+' : '-'}{attendanceTrend.value}%</span>
                                                    </TactileBadge>

                                                </div>

                                                <div className="flex flex-col items-center py-4 relative overflow-hidden group">
                                                    
                                                    {/* Premium Statistics Spline Chart */}
                                                    <div className="w-full h-80 relative mt-4">
                                                        <TactileAreaChart 
                                                            data={monthlyIntelligence.slice(-intelligenceRange)} 
                                                            color="#f59e0b" 
                                                            isSmooth={true} 
                                                            showHighlight={true}
                                                            totalMembers={members.filter(m => m.status === 'Activo').length}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-8 w-full px-8 pb-4 border-t border-white/5 pt-6 mt-4">
                                                        <div className="text-center">
                                                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">PROMEDIO {intelligenceRange}D</p>
                                                            <div className="text-xl font-black text-primary italic">
                                                                {(() => {
                                                                    const sliced = monthlyIntelligence.slice(-intelligenceRange);
                                                                    return sliced.length > 0 
                                                                        ? Math.round(sliced.reduce((acc, m) => acc + m.value, 0) / sliced.length) 
                                                                        : 0;
                                                                })()}%
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">PICO MÁXIMO</p>
                                                            <div className="text-xl font-black text-emerald-500 italic">
                                                                {(() => {
                                                                    const sliced = monthlyIntelligence.slice(-intelligenceRange);
                                                                    return sliced.length > 0 ? Math.max(...sliced.map(m => m.value)) : 0;
                                                                })()}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                                    <div>
                                                        <TactileBadge className="mb-2 bg-primary/10 border-primary/20 text-primary">
                                                            Membresía Activa
                                                        </TactileBadge>
                                                        <div className="text-2xl font-black ">{members.filter(m => m.status === 'Activo').length}</div>
                                                    </div>

                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => setActiveTab('miembros')}
                                                    className={cn(
                                                        "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02]",
                                                        members.filter(m => m.status === 'Pendiente').length > 0
                                                            ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                                                            : "bg-white/[0.03] border-white/5 opacity-50"
                                                    )}
                                                >
                                                    <div>
                                                        <TactileBadge className="mb-2 bg-amber-500/10 border-amber-500/20 text-amber-500">
                                                            Auditoría Pendiente
                                                        </TactileBadge>
                                                        <div className={cn("text-2xl font-black", members.filter(m => m.status === 'Pendiente').length > 0 ? "text-amber-500" : "text-white")}>
                                                            {members.filter(m => m.status === 'Pendiente').length}
                                                        </div>
                                                    </div>

                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        members.filter(m => m.status === 'Pendiente').length > 0 ? "bg-amber-500/20" : "bg-white/5"
                                                    )}>
                                                        <ShieldAlert className={cn("w-5 h-5", members.filter(m => m.status === 'Pendiente').length > 0 ? "text-amber-500" : "text-white/20")} />
                                                    </div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="Tema Semanal" className="w-full">
                                            <div className="space-y-5">
                                                <TactileInput
                                                    label="Título"
                                                    value={theme.title || ''}
                                                    onChange={(e: any) => useAppStore.getState().setTheme({ ...theme, title: e.target.value })}
                                                    icon={Sparkles}
                                                />
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">Tipo</label>
                                                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                                        {['orthodoxy', 'apostolic_letter'].map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => useAppStore.getState().setTheme({ ...theme, type: type as any })}
                                                                className={cn(
                                                                    "flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                                    theme.type === type
                                                                        ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                                )}
                                                            >
                                                                {type === 'orthodoxy' ? 'Ortodoxia' : 'Carta de Apostolado'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        try {
                                                            await saveThemeToCloud(theme);
                                                            showNotification('Tema de la semana actualizado', 'success');
                                                        } catch (err) {
                                                            showNotification('Error al guardar el tema', 'error');
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    disabled={isSaving}
                                                    className="tactile-btn tactile-btn-orange w-full h-10 justify-center text-[10px]"
                                                >
                                                    {isSaving ? (
                                                        <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                                                    ) : (
                                                        <Save className="w-3.5 h-3.5 mr-2" />
                                                    )}
                                                    {isSaving ? 'GUARDANDO...' : 'ACTUALIZAR TEMA'}
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('contenido')}
                                                    className="tactile-btn tactile-btn-glass w-full h-10 justify-center text-[9px] border-white/5"
                                                >
                                                    VER DETALLES COMPLETOS
                                                </button>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'asistencia' && (
                                <motion.div
                                    key="asistencia"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-8"
                                >
                                    {/* Attendance Header & Controls */}
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                                        <div className="flex flex-col gap-2 text-center md:text-left">
                                            <h2 className="text-3xl font-black  capitalize tracking-tighter text-foreground">
                                                Control de <span className="text-amber-400">Asistencia</span>
                                            </h2>
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-[10px] font-black capitalize text-primary">
                                                        {(() => {
                                                            try {
                                                                return format(parseISO(currentDate), "EEEE, d 'de' MMMM", { locale: es });
                                                            } catch (e) {
                                                                return currentDate;
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                <span className="text-[10px] font-bold text-muted-foreground capitalize tracking-widest leading-none">
                                                    {members.length} Miembros Registrados
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-3">
                                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                                {(['5am', '9am', 'evening'] as const).map(session => (
                                                    <button
                                                        key={session}
                                                        onClick={() => setCurrentAttendanceSession(session)}
                                                        className={cn(
                                                            "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                            currentAttendanceSession === session
                                                                ? "bg-[#576983] text-black transform scale-[1.02]"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                        )}
                                                    >
                                                        {session === '5am' ? '5:00 AM' : session === '9am' ? '9:00 AM' : '7:00 PM'}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="w-px h-10 bg-white/10 mx-2" />
                                            <button
                                                onClick={() => (document.getElementById('global-date-picker') as HTMLInputElement)?.showPicker()}
                                                className="tactile-btn tactile-btn-glass text-[10px] px-6 h-12 border-white/10"
                                            >
                                                <CalendarClock className="w-4 h-4 mr-2 text-primary" />
                                                OTRA FECHA
                                            </button>
                                        </div>
                                    </div>

                                    {/* Horizontal Filter Bar & Search for Attendance Groups */}
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="admin-member-filters-bar flex-1 flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                            {[
                                                { id: 'all', label: 'TODOS', count: members.length },
                                                { id: 'Administración', label: 'SIERVOS', count: members.filter(m => m.role === 'Administrador' || m.member_group === 'Administración').length },
                                                { id: 'Casados', label: 'MATRIMONIOS', count: members.filter(m => m.member_group === 'Casados' || m.member_group === 'Casadas').length },
                                                { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', count: members.filter(m => m.member_group === 'Solos y Solas').length },
                                                { id: 'Jovenes', label: 'JÓVENES', count: members.filter(m => m.member_group === 'Jovenes').length },
                                                { id: 'Niños', label: 'NIÑOS', count: members.filter(m => m.member_group === 'Niños' || m.member_group === 'Niñas').length },
                                            ].map(group => (
                                                <button
                                                    key={group.id}
                                                    onClick={() => setMemberFilter(group.id)}
                                                    className={cn(
                                                        "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                        memberFilter === group.id
                                                            ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                    )}
                                                >
                                                    {group.label} <span className="opacity-40 text-[8px] ml-1">{group.count}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative w-full md:w-64 bg-[#121523] border border-white/5 rounded-2xl p-1 shadow-inner group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="BUSCAR..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-transparent h-9 pl-10 pr-4 text-[10px] font-black tracking-[0.15em] text-foreground outline-none placeholder:text-muted-foreground/30"
                                            />
                                        </div>
                                        {/* Weekly Quick Graph - Upgraded to Pill Bar Chart */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            <TactileGlassCard className="md:col-span-3">
                                                <div className="flex flex-col h-full">
                                                    <div className="mb-6">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Total de Asistencias</p>
                                                        <div className="text-3xl font-black text-foreground tabular-nums">
                                                            {weeklyStats.reduce((acc, s) => {
                                                                const dayTotal = s.sessions ? Object.values(s.sessions).reduce((a: any, b: any) => a + b, 0) : 0;
                                                                return acc + (dayTotal as number);
                                                            }, 0).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-h-[150px] relative">
                                                        <TactileBarChart data={weeklyStats} totalMembers={members.filter(m => m.status === 'Activo').length} />
                                                    </div>
                                                </div>
                                            </TactileGlassCard>

                                            <TactileGlassCard title="Sesión Actual" className="md:col-span-1">
                                                <div className="flex flex-col items-center justify-center h-48 gap-4 py-4">
                                                    {(() => {
                                                        const date = currentDate;
                                                        const session = currentAttendanceSession;
                                                        const count = (attendanceRecords[date] || []).filter(r => r.session_type === session && r.present).length;
                                                        const percent = Math.round((count / (members.length || 1)) * 100);
                                                        const displayPercent = Math.max(percent, 0.5);

                                                        return (
                                                            <>
                                                                <div className="relative w-32 h-32">
                                                                    <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                                                    <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]" viewBox="0 0 100 100">
                                                                        <defs>
                                                                            <linearGradient id="globalProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                                <stop offset="0%" stopColor="#cc9900" />
                                                                                <stop offset="100%" stopColor="#f59e0b" />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                                                        <motion.circle
                                                                            cx="50" cy="50" r="44" fill="none" stroke="url(#globalProgressGrad)" strokeWidth="10" strokeDasharray="276.46"
                                                                            initial={{ strokeDashoffset: 276.46 }}
                                                                            animate={{ strokeDashoffset: 276.46 - (276.46 * displayPercent / 100) }}
                                                                            transition={{ duration: 1.5, ease: "backOut" }}
                                                                            className="drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0 z-10">
                                                                        <span className="text-3xl font-black  text-foreground drop-shadow-md">{percent}%</span>
                                                                        <div className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                                                                            <span className="text-[8px] font-black text-muted-foreground/70">{count}</span>
                                                                            <span className="text-[7px] font-bold text-muted-foreground/30">/</span>
                                                                            <span className="text-[8px] font-black text-muted-foreground/70">{members.length}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-center gap-1 mt-4">
                                                                    <p className="text-[10px] font-black capitalize text-primary tracking-[0.3em] ">Asistencia en Vivo</p>
                                                                    <div className="flex gap-1">
                                                                        <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                        <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                        <motion.div animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </TactileGlassCard>
                                        </div>
                                    </div>

                                    {/* Member List Grid */}
                                    <TactileGlassCard title="LISTADO DE MIEMBROS" subtitle="TOQUE PARA MARCAR ASISTENCIA">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                                            {members.filter(m => {
                                                const normalize = (text: string) => (text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                                                const searchNormalized = normalize(searchTerm);
                                                const nameMatch = normalize(m.name).includes(searchNormalized);
                                                const groupMatch = normalize(m.member_group || '').includes(searchNormalized);
                                                const matchesSearch = nameMatch || groupMatch;

                                                if (!matchesSearch) return false;

                                                if (memberFilter === 'all') return true;
                                                if (memberFilter === 'Administración') return m.role === 'Administrador' || m.member_group === 'Administración';
                                                if (memberFilter === 'Casados') return m.member_group === 'Casados' || m.member_group === 'Casadas';
                                                if (memberFilter === 'Niños') return m.member_group === 'Niños' || m.member_group === 'Niñas';
                                                if (memberFilter === 'Solos y Solas') return m.member_group === 'Solos y Solas';
                                                if (memberFilter === 'Jovenes') return m.member_group === 'Jovenes';
                                                
                                                return m.member_group === memberFilter;
                                            }).sort((a,b) => a.name.localeCompare(b.name)).map(member => {
                                                const date = currentDate;
                                                const session = currentAttendanceSession;
                                                
                                                // Real state + optimistic overlay
                                                const record = (attendanceRecords[date] || []).find(r => r.member_id === member.id && r.session_type === session);
                                                const isOptimistic = optimisticAttendance[member.id]?.[session] !== undefined;
                                                const isPresent = isOptimistic ? optimisticAttendance[member.id][session] : !!record?.present;
                                                const isProcessing = processingToggles[member.id];

                                                return (
                                                    <motion.div
                                                        key={member.id}
                                                        layoutId={member.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className={cn(
                                                            "relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 text-left overflow-hidden group",
                                                            isPresent 
                                                                ? "bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                                                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                                        )}
                                                    >
                                                        {/* Status Glow Background */}
                                                        {isPresent && (
                                                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                                        )}

                                                        {/* Avatar - Clickable for history */}
                                                        <div className="relative shrink-0 cursor-pointer hover:scale-110 transition-transform z-10"
                                                             onClick={(e) => { e.stopPropagation(); handleViewHistory(member); }}>
                                                            <div className={cn(
                                                                "w-12 h-12 rounded-2xl border-2 overflow-hidden transition-all duration-500",
                                                                isPresent ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-white/10"
                                                            )}>
                                                                {member.avatar ? (
                                                                    <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                                        <User className="w-6 h-6 text-muted-foreground/20" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isPresent && (
                                                                <div className="absolute -right-1 -bottom-1 bg-primary text-black rounded-full p-0.5 border-2 border-[#050510]">
                                                                    <Check className="w-3 h-3 font-bold" />
                                                                </div>
                                                            )}
                                                            {/* VIP Badge */}
                                                            {member.role === 'Administrador' && (
                                                                <div className="absolute -top-1.5 -left-1.5 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full p-1 border border-white/20 shadow-lg rotate-[-15deg] z-20">
                                                                    <Crown className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                                                                </div>
                                                            )}
                                                            {/* PRE Badge */}
                                                                {member.is_pre_registered && (
                                                                    <div className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-[8px] font-black w-9 h-6 flex items-center justify-center rounded-lg border-2 border-[#0b101e] text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-[5deg] group-hover:rotate-0 transition-transform z-20">
                                                                        PRE
                                                                    </div>
                                                                )}
                                                        </div>

                                                        {/* Member Info - Clickable for attendance toggle */}
                                                        <div className="flex-1 min-w-0 pr-4 cursor-pointer" onClick={() => toggleAttendance(member.id, session)}>
                                                            <h4 className={cn(
                                                                "font-black text-sm capitalize tracking-tight truncate",
                                                                isPresent ? "text-primary" : "text-foreground"
                                                            )}>
                                                                {member.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[9px] font-bold text-muted-foreground/30 capitalize tracking-widest">{member.member_group}</span>
                                                                {record?.time && !isOptimistic && (
                                                                    <span className="text-[9px] font-medium text-primary/50 tabular-nums">{record.time.slice(0, 5)}</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Processing Loader */}
                                                        {isProcessing && (
                                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                                                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </TactileGlassCard>
                                </motion.div>
                            )}

                            {activeTab === 'horarios' && (
                                <motion.div
                                    key="horarios"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {(() => {
                                        const isSun = parseISO(currentDate).getDay() === 0;
                                        return (
                                            <>
                                                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                                    <div className="flex flex-col md:flex-row items-baseline gap-3">
                                                        <h2 className="text-2xl font-black text-foreground capitalize tracking-tighter">Programación</h2>
                                                        <span className="text-lg font-bold text-muted-foreground capitalize tracking-tight opacity-70">
                                                            {(() => {
                                                                try {
                                                                    return format(parseISO(currentDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
                                                                } catch (e) {
                                                                    return currentDate;
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                                className="tactile-btn tactile-btn-glass text-[10px] px-6 h-10 group border-primary/20 hover:border-primary/50 relative z-20"
                                                            >
                                                                <CalendarClock className="w-3.5 h-3.5 mr-2 text-primary" />
                                                                {isCalendarOpen ? 'CERRAR CALENDARIO' : 'CAMBIAR FECHA'}
                                                            </button>
                                                            
                                                            <AnimatePresence>
                                                                {isCalendarOpen && (
                                                                    <div className="fixed inset-0 sm:absolute sm:top-full sm:right-0 sm:inset-auto mt-0 sm:mt-4 z-[100] flex items-center justify-center sm:block p-4 sm:p-0 w-full sm:w-[340px]">
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                            className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-[340px] sm:max-w-none"
                                                                        >
                                                                            <PremiumCalendar 
                                                                                selectedDate={currentDate}
                                                                                onDateSelect={(date) => {
                                                                                    setCurrentDate(date);
                                                                                    setIsCalendarOpen(false);
                                                                                }}
                                                                                theme="primitivo"
                                                                            />
                                                                        </motion.div>
                                                                        <div 
                                                                            className="fixed inset-0 bg-black/80 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none z-[-1]" 
                                                                            onClick={() => setIsCalendarOpen(false)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("¿Poblar el mes actual con datos de prueba?")) seedMonthSchedule();
                                                            }}
                                                            className="tactile-btn tactile-btn-glass text-[10px] px-6 h-10 group"
                                                        >
                                                            <Sparkles className="w-3.5 h-3.5 mr-2 group-hover:text-amber-400 transition-colors" />
                                                            POBLAR MES
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {/* 5 AM Slot */}
                                                    <TactileGlassCard
                                                        title="05:00 AM"
                                                        subtitle="Oración de Primicias"
                                                        className="border-t-2 border-t-blue-500/30"
                                                    >
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={currentDaySchedule.slots['5am'].time}
                                                                        onChange={(e) => updateSlot('5am', { time: e.target.value })}
                                                                        className="bg-transparent border-b border-white/10 text-xl font-bold w-20 focus:outline-none"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => updateSlot('5am', { language: currentDaySchedule.slots['5am'].language === 'en' ? 'es' : 'en' })}
                                                                    disabled={isSaving}
                                                                    className={cn(
                                                                        "tactile-btn text-[10px] w-12 h-8 justify-center",
                                                                        currentDaySchedule.slots['5am'].language === 'en' ? "tactile-btn-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "tactile-btn-glass",
                                                                        isSaving && "opacity-50 cursor-wait"
                                                                    )}
                                                                    title="Alternar Idioma (Inglés/Español)"
                                                                >
                                                                    {currentDaySchedule.slots['5am'].language === 'en' ? 'EN' : 'ES'}
                                                                </button>
                                                            </div>

                                                            <TactileSelect
                                                                label="RESPONSABLE"
                                                                value={currentDaySchedule.slots['5am'].leaderId}
                                                                onChange={(val: string) => updateSlot('5am', { leaderId: val })}
                                                                disabled={isSaving}
                                                                options={memberOptions}
                                                                icon={User}
                                                            />

                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => updateSlot('5am', { leaderId: currentDaySchedule.slots['5am'].leaderId })}
                                                                    className="tactile-btn tactile-btn-orange flex-1 justify-center h-10"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR
                                                                </button>
                                                            </div>

                                                            <div className="flex gap-3 pt-2 border-t border-white/5">
                                                                <button
                                                                    onClick={() => saveRecurringScheduleToCloud(currentDate, '5am', currentDaySchedule.slots['5am'].leaderId, 'next')}
                                                                    disabled={isSaving}
                                                                    className="tactile-btn tactile-btn-glass text-[9px] flex-1 justify-center disabled:opacity-50"
                                                                >
                                                                    PRÓX. LUNES
                                                                </button>
                                                                <button
                                                                    onClick={() => saveRecurringScheduleToCloud(currentDate, '5am', currentDaySchedule.slots['5am'].leaderId, 'month')}
                                                                    disabled={isSaving}
                                                                    className="tactile-btn tactile-btn-glass text-[9px] flex-1 justify-center disabled:opacity-50"
                                                                >
                                                                    TODO EL MES
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </TactileGlassCard>

                                                    {/* 9 AM Slot */}
                                                    <TactileGlassCard
                                                        title={isSun ? "10:00 AM" : "09:00 AM"}
                                                        subtitle={isSun ? "Escuela Dominical" : "Consagración / Doctrina"}
                                                        className={cn("border-t-2", isSun ? "border-t-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]" : "border-t-yellow-500/30")}
                                                    >
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <input
                                                                    type="text"
                                                                    value={currentDaySchedule.slots['9am'].time}
                                                                    disabled={isSaving}
                                                                    onChange={(e) => updateSlot('9am', { time: e.target.value })}
                                                                    className="bg-transparent border-b border-white/10 text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                                                                />
                                                                <button
                                                                    onClick={() => updateSlot('9am', { language: currentDaySchedule.slots['9am'].language === 'en' ? 'es' : 'en' })}
                                                                    disabled={isSaving}
                                                                    className={cn(
                                                                        "tactile-btn text-[10px] w-12 h-8 justify-center",
                                                                        currentDaySchedule.slots['9am'].language === 'en' ? "tactile-btn-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "tactile-btn-glass",
                                                                        isSaving && "opacity-50 cursor-wait"
                                                                    )}
                                                                    title="Alternar Idioma (Inglés/Español)"
                                                                >
                                                                    {currentDaySchedule.slots['9am'].language === 'en' ? 'EN' : 'ES'}
                                                                </button>
                                                            </div>

                                                            {isSun ? (
                                                                    <div className="space-y-4">
                                                                        <TactileSelect
                                                                            label="TIPO DE DOMINICAL"
                                                                            value={currentDaySchedule.slots['9am'].sundayType || 'local'}
                                                                            onChange={(val: string) => updateSlot('9am', { sundayType: val })}
                                                                            disabled={isSaving}
                                                                            searchable={false}
                                                                            options={[
                                                                                { value: 'local', label: 'Dominical Local' },
                                                                                { value: 'exchange', label: 'Intercambio Ministerial' },
                                                                                { value: 'broadcast', label: 'Transmisión Dominical' },
                                                                                { value: 'visitors', label: 'Dominical de Visitas' },
                                                                            ]}
                                                                            icon={Crown}
                                                                        />
                                                                        <TactileInput
                                                                            label="TEMA / DETALLES (OPCIONAL)"
                                                                            placeholder="Ej. Estudio de la Fe o Nombre del Ministro..."
                                                                            value={(currentDaySchedule.slots['9am'] as any).topic || ''}
                                                                            onChange={(e: any) => updateSlot('9am', { topic: e.target.value })}
                                                                            disabled={isSaving}
                                                                            icon={Sparkles}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <TactileSelect
                                                                            label="CONSAGRACIÓN"
                                                                            value={currentDaySchedule.slots['9am'].consecrationLeaderId}
                                                                            onChange={(val: string) => updateSlot('9am', { consecrationLeaderId: val })}
                                                                            disabled={isSaving}
                                                                            options={memberOptions}
                                                                            icon={User}
                                                                        />

                                                                        <TactileSelect
                                                                            label="DOCTRINA"
                                                                            value={currentDaySchedule.slots['9am'].doctrineLeaderId}
                                                                            onChange={(val: string) => updateSlot('9am', { doctrineLeaderId: val })}
                                                                            disabled={isSaving}
                                                                            options={memberOptions}
                                                                            icon={Flame}
                                                                        />
                                                                    </>
                                                                )}

                                                                <button
                                                                    onClick={() => updateSlot('9am', {})}
                                                                    className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR {isSun ? 'DOMINICAL' : 'PROGRAMA'}
                                                                </button>
                                                            </div>
                                                        </TactileGlassCard>

                                                        {/* 12 PM Slot */}
                                                        <TactileGlassCard
                                                            title="12:00 PM"
                                                            subtitle="Oración de mediodía"
                                                            className="border-t-2 border-t-emerald-500/30"
                                                        >
                                                            <div className="space-y-6">
                                                                <div className="flex items-center justify-between">
                                                                    <input
                                                                        type="text"
                                                                        value={currentDaySchedule?.slots?.['12pm']?.time || '12:00 PM'}
                                                                        disabled={isSaving}
                                                                        onChange={(e) => updateSlot('12pm', { time: e.target.value })}
                                                                        className="bg-transparent border-b border-white/10 text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                                                                    />
                                                                    <button
                                                                        onClick={() => updateSlot('12pm', { language: currentDaySchedule?.slots?.['12pm']?.language === 'en' ? 'es' : 'en' })}
                                                                        disabled={isSaving}
                                                                        className={cn(
                                                                            "tactile-btn text-[10px] w-12 h-8 justify-center",
                                                                            currentDaySchedule?.slots?.['12pm']?.language === 'en' ? "tactile-btn-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "tactile-btn-glass",
                                                                            isSaving && "opacity-50 cursor-wait"
                                                                        )}
                                                                    >
                                                                        {currentDaySchedule?.slots?.['12pm']?.language === 'en' ? 'EN' : 'ES'}
                                                                    </button>
                                                                </div>
                                                                <TactileSelect
                                                                    label="RESPONSABLE"
                                                                    value={currentDaySchedule?.slots?.['12pm']?.leaderId || ''}
                                                                    onChange={(val: string) => updateSlot('12pm', { leaderId: val })}
                                                                    disabled={isSaving}
                                                                    options={memberOptions}
                                                                    icon={User}
                                                                />
                                                                <button
                                                                    onClick={() => updateSlot('12pm', {})}
                                                                    className="tactile-btn tactile-btn-orange w-full justify-center h-10"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR
                                                                </button>
                                                            </div>
                                                        </TactileGlassCard>

                                                        {/* Evening Slot */}
                                                        <TactileGlassCard
                                                            title="07:00 PM"
                                                            subtitle="Servicio de Oración"
                                                            className="border-t-2 border-t-tactile-neon-pink/30"
                                                        >
                                                            <div className="space-y-6">
                                                                <div className="flex items-center justify-between">
                                                                    <input
                                                                        type="text"
                                                                        value={currentDaySchedule.slots['evening'].time}
                                                                        disabled={isSaving}
                                                                        onChange={(e) => updateSlot('evening', { time: e.target.value })}
                                                                        className="bg-transparent border-b border-white/10 text-xl font-bold w-20 focus:outline-none disabled:opacity-50"
                                                                    />
                                                                    <button
                                                                        onClick={() => updateSlot('evening', { language: currentDaySchedule.slots['evening'].language === 'en' ? 'es' : 'en' })}
                                                                        disabled={isSaving}
                                                                        className={cn(
                                                                            "tactile-btn text-[10px] w-12 h-8 justify-center",
                                                                            currentDaySchedule.slots['evening'].language === 'en' ? "tactile-btn-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "tactile-btn-glass",
                                                                            isSaving && "opacity-50 cursor-wait"
                                                                        )}
                                                                        title="Alternar Idioma (Inglés/Español)"
                                                                    >
                                                                        {currentDaySchedule.slots['evening'].language === 'en' ? 'EN' : 'ES'}
                                                                    </button>
                                                                </div>

                                                                <TactileSelect
                                                                    label="TIPO DE SERVICIO"
                                                                    value={currentDaySchedule.slots['evening'].type || 'regular'}
                                                                    disabled={isSaving}
                                                                    searchable={false}
                                                                    onChange={(val: string) => {
                                                                        const updates: any = { type: val };
                                                                        const isMulti = ['special', 'youth', 'praise', 'married', 'children'].includes(val);
                                                                        if (!isMulti && currentDaySchedule.slots['evening'].leaderIds.length > 1) {
                                                                            updates.leaderIds = [currentDaySchedule.slots['evening'].leaderIds[0]];
                                                                        }
                                                                        updateSlot('evening', updates);
                                                                    }}
                                                                    options={[
                                                                        { value: 'regular', label: 'Regular' },
                                                                        { value: 'youth', label: 'Jóvenes' },
                                                                        { value: 'married', label: 'Casados' },
                                                                        { value: 'children', label: 'Niños' },
                                                                        { value: 'solos', label: 'Solos y Solas' },
                                                                        { value: 'praise', label: 'Servicio de Alabanza' },
                                                                        { value: 'special', label: 'Especial' },
                                                                    ]}
                                                                    icon={Sparkles}
                                                                />

                                                                {['youth', 'praise', 'children'].includes(currentDaySchedule.slots['evening'].type) ? (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <TactileSelect
                                                                            label="DIRIGE"
                                                                            value={currentDaySchedule.slots['evening'].leaderIds[0] || ''}
                                                                            onChange={(val: string) => updateSlot('evening', { leaderIds: [val] })}
                                                                            disabled={isSaving}
                                                                            options={memberOptions}
                                                                            icon={User}
                                                                        />
                                                                        <TactileSelect
                                                                            label="DOCTRINA"
                                                                            value={currentDaySchedule.slots['evening'].doctrineLeaderId || ''}
                                                                            onChange={(val: string) => updateSlot('evening', { doctrineLeaderId: val })}
                                                                            disabled={isSaving}
                                                                            options={memberOptions}
                                                                            icon={BookOpen}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <TactileSelect
                                                                        label="ENCARGADO"
                                                                        value={currentDaySchedule.slots['evening'].leaderIds[0] || ''}
                                                                        onChange={(val: string) => updateSlot('evening', { leaderIds: [val] })}
                                                                        disabled={isSaving}
                                                                        options={memberOptions}
                                                                        icon={User}
                                                                    />
                                                                )}
                                                                <TactileInput
                                                                    label="TEMA / ESTUDIO (OPCIONAL)"
                                                                    placeholder="Ej. El Arrepentimiento..."
                                                                    value={currentDaySchedule.slots['evening'].topic || ''}
                                                                    onChange={(e: any) => updateSlot('evening', { topic: e.target.value })}
                                                                    disabled={isSaving}
                                                                    icon={Sparkles}
                                                                />
                                                                <button
                                                                    onClick={() => updateSlot('evening', {})}
                                                                    className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR SERVICIO
                                                                </button>
                                                            </div>
                                                        </TactileGlassCard>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </motion.div>
                                )}



                            {activeTab === 'miembros' && (
                                <motion.div
                                    key="miembros"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Header Summary */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'MEMBRESÍA TOTAL', value: members.length, color: 'text-white' },
                                            { label: 'VARONES ADULTOS', value: members.filter(m => m.gender === 'Varon' && m.category === 'Varon').length, color: 'text-blue-400', border: 'border-l-blue-500' },
                                            { label: 'HERMANAS ADULTAS', value: members.filter(m => m.gender === 'Hermana' && m.category === 'Hermana').length, color: 'text-pink-400', border: 'border-l-pink-500' },
                                            { label: 'NIÑOS / NIÑAS', value: members.filter(m => m.category === 'Niño').length, color: 'text-orange-400', border: 'border-l-orange-500' },
                                        ].map((stat, i) => (
                                            <div key={i} className={cn("bg-[#121523] p-4 rounded-2xl border border-white/5", stat.border && `border-l-2 ${stat.border}`)}>
                                                <TactileBadge className="mb-2 bg-white/5 border-white/10 opacity-60">
                                                    {stat.label}
                                                </TactileBadge>
                                                <div className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.value}</div>
                                            </div>
                                        ))}

                                    </div>

                                    {/* 🔒 AUDITORÍA DE SEGURIDAD: SOLICITUDES ACTIVAS */}
                                    {members.filter(m => m.status === 'Pendiente').length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-[#121523]/80 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                                        >
                                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                                <ShieldAlert className="w-32 h-32 text-amber-500" />
                                            </div>
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                                                        <ShieldAlert className="w-6 h-6 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black tracking-tighter text-amber-500 uppercase">AUDITORÍA DE SEGURIDAD</h3>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">PROTOCOLO DE APROBACIÓN DE NUEVOS PERFILES</p>
                                                    </div>
                                                </div>
                                                <TactileBadge className="bg-amber-500/10 border-amber-500/30 text-amber-500 px-6 py-2">
                                                    {members.filter(m => m.status === 'Pendiente').length} SOLICITUDES ACTIVAS
                                                </TactileBadge>

                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                                {members.filter(m => m.status === 'Pendiente').map((pending) => (
                                                    <div key={pending.id} className="bg-[#0b101e] border border-white/5 p-5 rounded-[1.75rem] space-y-4 hover:border-amber-500/40 transition-all duration-300 group/audit-card relative overflow-hidden flex flex-col justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-14 h-14 shrink-0">
                                                                <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-lg opacity-0 group-hover/audit-card:opacity-100 transition-opacity" />
                                                                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 group-hover/audit-card:border-amber-500/50 transition-all bg-[#121523]">
                                                                    {pending.avatar ? <img src={pending.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-amber-500/40" />}
                                                                </div>
                                                                <div className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-[8px] font-black w-9 h-6 flex items-center justify-center rounded-lg border-2 border-[#0b101e] text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-[5deg] group-hover:rotate-0 transition-transform z-20">PRE</div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-black text-white truncate uppercase tracking-tight leading-none mb-1">{pending.name}</p>
                                                                <p className="text-[8px] text-white/20 truncate font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                                                    <Mail className="w-2.5 h-2.5" />
                                                                    {pending.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-2">
                                                            <button 
                                                                className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
                                                                disabled={isSaving}
                                                                onClick={async () => {
                                                                    const { updateProfileInCloud, loadMembersFromCloud } = useAppStore.getState();
                                                                    setIsSaving(true);
                                                                    await updateProfileInCloud(pending.id, { ...pending, status: 'Activo' } as any);
                                                                    await loadMembersFromCloud();
                                                                    setIsSaving(false);
                                                                }}
                                                            >
                                                                APROBAR
                                                            </button>
                                                            <button 
                                                                className="px-4 h-9 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-[8px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                                onClick={async () => {
                                                                    if (confirm(`¿ELIMINAR SOLICITUD DE ${pending.name.toUpperCase()}?`)) {
                                                                        const { deleteMemberFromCloud, loadMembersFromCloud } = useAppStore.getState();
                                                                        setIsSaving(true);
                                                                        await deleteMemberFromCloud(pending.id);
                                                                        await loadMembersFromCloud();
                                                                        setIsSaving(false);
                                                                    }
                                                                }}
                                                            >
                                                                RECHAZAR
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Search & Actions Bar */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
                                        <div className="w-full md:w-auto flex items-center gap-6">
                                            <h2 className="text-4xl font-black tracking-tighter shrink-0">MIEMBROS <span className="text-muted-foreground/40">LOCALES</span></h2>

                                            <div className="relative w-full max-w-md bg-[#121523] border border-white/10 rounded-2xl p-1 shadow-2xl backdrop-blur-xl group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-amber-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="BUSCAR HERMANA O HERMANO..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full bg-transparent h-10 pl-12 pr-6 text-[10px] font-black tracking-[0.15em] text-white outline-none placeholder:text-white/20"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowAddMember(true)}
                                            className="w-full md:w-auto bg-[#576983] text-black h-11 px-8 rounded-2xl text-[10px] font-black tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-black/40"
                                        >
                                            AGREGAR MIEMBRO
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                        <Filter className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-0.5">FILTRAR POR GRUPO</span>
                                    </div>

                                    {/* Primitivo Horizontal Filter Bar (Standard Style) */}
                                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                        {[
                                            { id: 'all', label: 'TODOS LOS MIEMBROS', count: members.length },
                                            { id: 'Administración', label: 'SIERVOS DE DIOS', count: members.filter(m => m.role === 'Administrador' || m.member_group === 'Administración').length },
                                            { id: 'Casados', label: 'MATRIMONIOS', count: members.filter(m => m.member_group === 'Casados' || m.member_group === 'Casadas').length },
                                            { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', count: members.filter(m => m.member_group === 'Solos y Solas').length },
                                            { id: 'Jovenes', label: 'JÓVENES', count: members.filter(m => m.member_group === 'Jovenes').length },
                                            { id: 'Niños', label: 'NIÑOS / NIÑAS', count: members.filter(m => m.member_group === 'Niños' || m.member_group === 'Niñas').length },
                                        ].map(group => (
                                            <button
                                                key={group.id}
                                                onClick={() => setMemberFilter(group.id)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                    memberFilter === group.id 
                                                        ? "bg-amber-400 text-black shadow-none scale-[1.02]" 
                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {group.label} <span className="opacity-40 text-[8px] ml-1">{group.count}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Members Grid (Primitivo Style) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {members
                                                .filter(m => {
                                                    const normalize = (text: string) => (text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                                                    const searchNormalized = normalize(searchTerm);
                                                    const nameMatch = normalize(m.name).includes(searchNormalized);
                                                    const emailMatch = normalize(m.email).includes(searchNormalized);
                                                    const matchesSearch = nameMatch || emailMatch;

                                                    if (!matchesSearch) return false;

                                                    if (memberFilter === 'all') return true;
                                                    if (memberFilter === 'Administración') return m.role === 'Administrador' || m.member_group === 'Administración';
                                                    if (memberFilter === 'Casados') return m.member_group === 'Casados' || m.member_group === 'Casadas';
                                                    if (memberFilter === 'Niños') return m.member_group === 'Niños' || m.member_group === 'Niñas';
                                                    return m.member_group === memberFilter;
                                                })
                                                .map(member => (
                                                    <div 
                                                        key={member.id} 
                                                        className="group bg-[#101420] border border-white/5 p-6 rounded-[1.5rem] flex items-center gap-6 hover:border-amber-400/30 transition-all duration-500 shadow-none relative overflow-hidden"
                                                    >
                                                        {/* Animated Hover Background (Subtle Aurora) */}
                                                        <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                                        
                                                        <div className="relative shrink-0 z-10">
                                                            <div className={cn(
                                                                "w-20 h-20 rounded-2xl border transition-all duration-500 group-hover:scale-105 bg-[#121523] p-1 shadow-none overflow-hidden",
                                                                member.status === 'Activo' ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"
                                                            )}>
                                                                <img 
                                                                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                                                                    className="w-full h-full object-cover rounded-[1.4rem]" 
                                                                    alt={member.name} 
                                                                />
                                                            </div>
                                                            {member.role === 'Administrador' && (
                                                                <div className="absolute -top-1 -left-1 w-8 h-8 bg-[#EFB722] rounded-full border-2 border-[#101420] flex items-center justify-center shadow-none z-20">
                                                                    <Crown className="w-4 h-4 text-black" />
                                                                </div>
                                                            )}
                                                            {member.is_pre_registered && (
                                                                <div className="absolute -top-1.5 -right-1.5 bg-[#FBBF24] text-[9px] font-black px-2 py-0.5 rounded-[6px] border border-[#101420] text-black shadow-none z-20 transition-transform group-hover:scale-110 tracking-[0.1em]">
                                                                    PRE.
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Basic Info */}
                                                        <div className="flex-1 min-w-0 z-10">
                                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                    <TactileBadge className={cn(
                                                                        "px-2.5 py-0.5 shadow-none border trans",
                                                                        (member.role === 'Administrador' || member.role === 'Ministro a Cargo')
                                                                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                                                                            : ((member.role?.includes('Encargado') || member.role?.includes('Responsable') || member.status === 'Activo') ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-400/10 border-slate-400/20 text-slate-400")
                                                                    )}>
                                                                        {member.role === 'Administrador' ? 'ADMINISTRADOR DEL SISTEMA' : member.role}
                                                                    </TactileBadge>
                                                                    {member.member_group && (
                                                                        <TactileBadge className="bg-[#2A4364]/40 border-[#2A4364]/60 text-gray-300">
                                                                            {member.member_group}
                                                                        </TactileBadge>
                                                                    )}
                                                                </div>

                                                        </div>

                                                        {/* Actions Overlay */}
                                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                            <button 
                                                                onClick={() => { setEditingMember(member); setShowAddMember(true); }}
                                                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    const { updateProfileInCloud, loadMembersFromCloud } = useAppStore.getState();
                                                                    setIsSaving(true);
                                                                    await updateProfileInCloud(member.id, { 
                                                                        status: member.status === 'Activo' ? 'Inactivo' : 'Activo' 
                                                                    });
                                                                    await loadMembersFromCloud();
                                                                    setIsSaving(false);
                                                                }}
                                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-500 transition-all"
                                                                title={member.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                                            >
                                                                <Power className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm(`¿ELIMINAR A ${member.name.toUpperCase()}?`)) {
                                                                        const { deleteMemberFromCloud, loadMembersFromCloud } = useAppStore.getState();
                                                                        setIsSaving(true);
                                                                        deleteMemberFromCloud(member.id);
                                                                    }
                                                                }}
                                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-red-600 hover:text-white transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                </motion.div>
                            )}

                            {activeTab === 'ajustes' && (
                                <motion.div
                                    key="ajustes"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-12">
                                        <h2 className="text-4xl font-black  capitalize tracking-tighter mb-8">Preferencias del <span className="text-tactile-text-sub">Sistema</span></h2>
                                    </div>

                                    <div className="col-span-1 md:col-span-6 space-y-8">
                                        <TactileGlassCard title="APARIENCIA VISUAL">
                                            <div className="space-y-6">
                                                <TactileSelect
                                                    label="MODO DE INTERFAZ"
                                                    value={settings.themeMode}
                                                    onChange={(val: any) => saveSettingsToCloud({ themeMode: val })}
                                                    options={[
                                                        { value: 'light', label: 'Modo Claro' },
                                                        { value: 'dark', label: 'Modo Oscuro' },
                                                        { value: 'system', label: 'Sincronizar con Sistema' },
                                                    ]}
                                                    icon={Sun}
                                                />

                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">COLOR PRIMARIO</label>
                                                    <div className="grid grid-cols-5 gap-3">
                                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                                                            <button
                                                                key={color}
                                                                onClick={() => saveSettingsToCloud({ primaryColor: color })}
                                                                className={cn(
                                                                    "aspect-square rounded-2xl border-4 transition-all scale-90 hover:scale-100 shadow-lg",
                                                                    settings.primaryColor === color ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-100" : "border-transparent"
                                                                )}
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <TactileFontSelect
                                                    label="TIPOGRAFÍA DEL SISTEMA (GOOGLE FONTS PREVIEW)"
                                                    value={settings.fontMain || calendarStyles.fontFamily || 'Poppins'}
                                                    onChange={(val: any) => {
                                                        setSettings({ fontMain: val });
                                                        setCalendarStyles({ fontFamily: val });
                                                        saveSettingsToCloud({ fontMain: val });
                                                    }}
                                                    icon={Type}
                                                />

                                                <div className="space-y-4 pt-2">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">PESO Y GROSOR</label>
                                                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                                        {[
                                                            { label: 'THIN', weight: '300' },
                                                            { label: 'NORM', weight: '400' },
                                                            { label: 'MED', weight: '500' },
                                                            { label: 'BOLD', weight: '700' },
                                                            { label: 'MAX', weight: '900' },
                                                        ].map((w) => (
                                                            <button
                                                                key={w.weight}
                                                                onClick={() => {
                                                                    setSettings({ fontWeight: w.weight });
                                                                    saveSettingsToCloud({ fontWeight: w.weight });
                                                                }}
                                                                className={cn(
                                                                    "flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                                                    (settings.fontWeight || '400') === w.weight 
                                                                        ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]" 
                                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                                )}
                                                            >
                                                                {w.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>



                                                <div className="py-4 border-t border-white/5 space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2 flex justify-between">
                                                        <span>OPTIMIZACIÓN DE TV (OVERSCAN / ESCALA)</span>
                                                        <span className="text-primary">{Math.round((settings.displayScale || 1.0) * 100)}%</span>
                                                    </label>
                                                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                                        {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((sc) => (
                                                            <button
                                                                key={sc}
                                                                onClick={() => {
                                                                    setSettings({ displayScale: sc });
                                                                    saveSettingsToCloud({ displayScale: sc });
                                                                }}
                                                                className={cn(
                                                                    "flex-1 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                                    (settings.displayScale || 1.0) === sc 
                                                                        ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]" 
                                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                                )}
                                                            >
                                                                {Math.round(sc * 100)}%
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-[8px] text-tactile-text-sub ml-2  leading-relaxed">
                                                        * Si el contenido se ve cortado en los bordes de la TV, baje la escala al 90%, 80% o 70%.
                                                    </p>
                                                </div>

                                                <div className="py-4 border-t border-white/5 space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">
                                                        AJUSTE MANUAL DE POSICIÓN (CENTRAR)
                                                    </label>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const val = (settings.displayOffsetY || 0) - 20;
                                                                setSettings({ displayOffsetY: val });
                                                                saveSettingsToCloud({ displayOffsetY: val });
                                                            }}
                                                            className="tactile-btn p-3 bg-white/5 hover:bg-white/10"
                                                        >
                                                            <ChevronUp className="w-5 h-5" />
                                                        </button>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    const val = (settings.displayOffsetX || 0) - 20;
                                                                    setSettings({ displayOffsetX: val });
                                                                    saveSettingsToCloud({ displayOffsetX: val });
                                                                }}
                                                                className="tactile-btn p-3 bg-white/5 hover:bg-white/10"
                                                            >
                                                                <ChevronLeft className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSettings({ displayOffsetX: 0, displayOffsetY: 0 });
                                                                    saveSettingsToCloud({ displayOffsetX: 0, displayOffsetY: 0 });
                                                                }}
                                                                className="tactile-btn px-4 bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 font-bold text-[10px]"
                                                            >
                                                                RESET
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const val = (settings.displayOffsetX || 0) + 20;
                                                                    setSettings({ displayOffsetX: val });
                                                                    saveSettingsToCloud({ displayOffsetX: val });
                                                                }}
                                                                className="tactile-btn p-3 bg-white/5 hover:bg-white/10"
                                                            >
                                                                <ChevronRight className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const val = (settings.displayOffsetY || 0) + 20;
                                                                setSettings({ displayOffsetY: val });
                                                                saveSettingsToCloud({ displayOffsetY: val });
                                                            }}
                                                            className="tactile-btn p-3 bg-white/5 hover:bg-white/10"
                                                        >
                                                            <ChevronDown className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="FONDO DE PROYECCIÓN">
                                            <div className="space-y-6">
                                                <TactileSelect
                                                    label="MODO DE LOGO / FONDO"
                                                    value={settings.displayBgMode}
                                                    onChange={(val: any) => saveSettingsToCloud({ displayBgMode: val })}
                                                    options={[
                                                        { value: 'custom', label: 'Personalizado (SVG/Imagen)' },
                                                        { value: 'none', label: 'Sin Logo de Fondo' },
                                                    ]}
                                                    icon={Monitor}
                                                />

                                                {settings.displayBgMode === 'custom' && (
                                                    <div className="space-y-4">
                                                        <div 
                                                            onClick={() => document.getElementById('tactile-bg-upload')?.click()}
                                                            className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-black/40 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden transition-all group"
                                                        >
                                                            {settings.displayCustomBgUrl ? (
                                                                <div className="relative w-full h-full">
                                                                    <img src={settings.displayCustomBgUrl} className="w-full h-full object-cover" alt="Custom background" />
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Upload className="w-8 h-8 text-white" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                        <Upload className="w-6 h-6 text-tactile-text-sub" />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-black capitalize tracking-widest">Subir Fondo Personalizado</p>
                                                                        <p className="text-[8px] text-tactile-text-sub mt-2">Formatos aceptados: SVG, JPG, PNG, WEBP</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            id="tactile-bg-upload"
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*,.svg"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setIsSaving(true);
                                                                    const publicUrl = await uploadAvatar('display-bg', file);
                                                                    if (publicUrl) {
                                                                        await saveSettingsToCloud({
                                                                            displayCustomBgUrl: publicUrl,
                                                                            displayBgMode: 'custom',
                                                                            churchLogoUrl: publicUrl, // Sincronizar también como logo principal
                                                                            churchIcon: 'custom'
                                                                        });
                                                                        showNotification('Fondo actualizado exitosamente.', 'success');
                                                                    }
                                                                    setIsSaving(false);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                
                                                <div className="py-4 border-t border-white/5 space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">ESTILO DE PUNTOS / ANIMACIÓN</label>
                                                    <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                                                        <button
                                                            onClick={() => saveSettingsToCloud({ displayBgStyle: 'static' })}
                                                            className={cn(
                                                                "flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                                settings.displayBgStyle === 'static' 
                                                                    ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]" 
                                                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            ESTÁTICO
                                                        </button>
                                                        <button
                                                            onClick={() => saveSettingsToCloud({ displayBgStyle: 'dynamic' })}
                                                            className={cn(
                                                                "flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                                settings.displayBgStyle === 'dynamic' 
                                                                    ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]" 
                                                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            DINÁMICO
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <button
                                            onClick={async () => {
                                                setIsSaving(true);
                                                await saveSettingsToCloud(settings);
                                                setIsSaving(false);
                                            }}
                                            className="tactile-btn tactile-btn-orange w-full h-14 justify-center text-sm font-black tracking-widest gap-3"
                                        >
                                            <Save className="w-5 h-5" /> GUARDAR PREFERENCIAS
                                        </button>
                                    </div>

                                    <div className="col-span-1 md:col-span-6 space-y-6">
                                        <TactileGlassCard title="MINISTRO RESPONSABLE">
                                            <div className="space-y-6">
                                                <div className="flex flex-col items-center py-4">
                                                    <div
                                                        className="w-32 h-32 rounded-full border-4 border-primary/30 p-1 relative group cursor-pointer"
                                                        onClick={() => document.getElementById('minister-avatar-upload')?.click()}
                                                    >
                                                        <img src={settings.ministerAvatar || `https://ui-avatars.com/api/?name=${settings.ministerName || 'Ministro'}&background=random`} className="w-full h-full object-cover rounded-full" alt="Ministro" />
                                                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Camera className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => document.getElementById('minister-avatar-upload')?.click()}
                                                        className="text-[10px] font-black capitalize text-primary mt-4 tracking-widest hover:underline"
                                                    >
                                                        Cambiar Fotografía
                                                    </button>
                                                    <input
                                                        type="file"
                                                        id="minister-avatar-upload"
                                                        className="hidden"
                                                        accept="image/*,.svg"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // If SVG, skip editor and upload directly
                                                                if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
                                                                    setIsSaving(true);
                                                                    const url = await uploadAvatar(`minister-${Date.now()}`, file);
                                                                    if (url) {
                                                                        await saveSettingsToCloud({ ministerAvatar: url });
                                                                        setMinister({ avatar: url });
                                                                        showNotification("SVG ministerial actualizado exitosamente.", 'success');
                                                                    }
                                                                    setIsSaving(false);
                                                                    return;
                                                                }

                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setImageToEdit({ source: reader.result as string, target: 'minister' });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <TactileInput
                                                    label="NOMBRE DEL MINISTRO"
                                                    value={settings.ministerName || ''}
                                                    onChange={(e: any) => setSettings({ ministerName: e.target.value })}
                                                    icon={User}
                                                />
                                                <TactileInput
                                                    label="EMAIL DE CONTACTO"
                                                    value={settings.ministerEmail || ''}
                                                    onChange={(e: any) => setSettings({ ministerEmail: e.target.value })}
                                                    icon={Mail}
                                                />
                                                <TactileInput
                                                    label="TELÉFONO"
                                                    value={settings.ministerPhone || ''}
                                                    onChange={(e: any) => setSettings({ ministerPhone: e.target.value })}
                                                    icon={Phone}
                                                />

                                                <button
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        await saveSettingsToCloud({
                                                            ministerName: settings.ministerName,
                                                            ministerEmail: settings.ministerEmail,
                                                            ministerPhone: settings.ministerPhone
                                                        });
                                                        // Sync current minister global state
                                                        setMinister({
                                                            name: settings.ministerName,
                                                            email: settings.ministerEmail,
                                                            phone: settings.ministerPhone
                                                        });
                                                        // Sync profile if exists
                                                        if (minister.id && !minister.id.includes('minister-eliab')) {
                                                            await updateProfileInCloud(minister.id, {
                                                                name: settings.ministerName,
                                                                email: settings.ministerEmail,
                                                                phone: settings.ministerPhone
                                                            });
                                                        }
                                                        setIsSaving(false);
                                                    }}
                                                    className="tactile-btn tactile-btn-orange w-full h-12 justify-center mt-4 font-black capitalize tracking-widest"
                                                >
                                                    <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Datos'}
                                                </button>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="SEGURIDAD DEL DISPLAY">
                                            <div className="space-y-8">
                                                <TactileInput
                                                    label="CÓDIGO PIN DE ACCESO"
                                                    placeholder="0000"
                                                    value={settings.displayPin || ''}
                                                    onChange={(e: any) => setSettings({ displayPin: e.target.value.slice(0, 4) })}
                                                    icon={Lock}
                                                />

                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">EMAILS AUTORIZADOS</label>
                                                    <div className="space-y-3">
                                                        {(settings.displayAuthorizedEmails || []).map((email, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                                                                <Mail className="w-4 h-4 text-primary" />
                                                                <span className="flex-1 text-xs font-bold">{email}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const newList = (settings.displayAuthorizedEmails || []).filter((_, i) => i !== idx);
                                                                        setSettings({ displayAuthorizedEmails: newList });
                                                                    }}
                                                                    className="p-2 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="email"
                                                                placeholder="nuevo@correo.com"
                                                                className="flex-1 bg-black/40 border border-white/5 rounded-2xl h-12 text-sm font-bold px-4 outline-none focus:border-primary/50"
                                                                onKeyDown={(e: any) => {
                                                                    if (e.key === 'Enter' && e.target.value) {
                                                                        const newList = [...(settings.displayAuthorizedEmails || []), e.target.value];
                                                                        setSettings({ displayAuthorizedEmails: newList });
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                onClick={(e: any) => {
                                                                    const input = e.currentTarget.previousSibling;
                                                                    if (input.value) {
                                                                        const newList = [...(settings.displayAuthorizedEmails || []), input.value];
                                                                        setSettings({ displayAuthorizedEmails: newList });
                                                                        input.value = '';
                                                                    }
                                                                }}
                                                                className="tactile-btn tactile-btn-glass w-12 h-12 justify-center p-0"
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-tactile-text-sub/50 capitalize tracking-widest mt-4">Los administradores siempre tienen acceso.</p>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="ENTORNO DE PRUEBAS">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-orange-200 capitalize leading-relaxed">
                                                        PARA VERIFICAR LOS ROLES, PUEDE CREAR CUENTAS DE PRUEBA CON EMAILS PREDEFINIDOS.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('¿Crear cuentas de prueba para cada rol ministerial?')) {
                                                            await createTestAccounts();
                                                        }
                                                    }}
                                                    className="tactile-btn tactile-btn-glass w-full h-12 justify-center gap-3 font-black capitalize tracking-widest"
                                                >
                                                    <UserPlus className="w-4 h-4 text-primary" /> GENERAR CUENTAS DE TEST
                                                </button>

                                                <div className="mt-8 space-y-4">
                                                    <h4 className="text-[10px] font-black capitalize tracking-widest text-tactile-text-sub ml-2">SIMULADOR DE ROLES</h4>
                                                    <div className="overflow-hidden rounded-2xl border border-white/5">
                                                        <table className="w-full text-left text-[10px] border-collapse">
                                                            <thead className="bg-white/5 capitalize tracking-widest font-black text-tactile-text-sub">
                                                                <tr>
                                                                    <th className="px-4 py-3">ROL</th>
                                                                    <th className="px-4 py-3">EMAIL</th>
                                                                    <th className="px-4 py-3 text-right">ACCESOS</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5 bg-black/20">
                                                                {[
                                                                    { role: 'Ministro', email: 'ministro_test@lldmrodeo.org', icon: Flame },
                                                                    { role: 'Asistencia', email: 'asistencia_test@lldmrodeo.org', icon: CheckCircle2 },
                                                                    { role: 'Coro', email: 'coro_test@lldmrodeo.org', icon: Music2 },
                                                                    { role: 'Jóvenes', email: 'jovenes_test@lldmrodeo.org', icon: Star },
                                                                    { role: 'Miembro', email: 'miembro_test@lldmrodeo.org', icon: User },
                                                                ].map((testUser) => (
                                                                    <tr key={testUser.email} className="group hover:bg-white/5 transition-colors">
                                                                        <td className="px-4 py-3 font-black  capitalize flex items-center gap-2">
                                                                            <testUser.icon className="w-3 h-3 text-primary" />
                                                                            {testUser.role}
                                                                        </td>
                                                                        <td className="px-4 py-3 font-medium opacity-60 ">{testUser.email}</td>
                                                                        <td className="px-4 py-3 text-right">
                                                                            <button
                                                                                onClick={async () => {
                                                                                    const success = await simulateUser(testUser.email);
                                                                                    if (success) {
                                                                                        showNotification(`Simulando sesión como: ${testUser.role}`, 'info');
                                                                                        window.location.href = '/dashboard';
                                                                                    } else {
                                                                                        showNotification('La cuenta aún no existe. Pulsa "GENERAR CUENTAS" primero.', 'warning');
                                                                                    }
                                                                                }}
                                                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-full font-black capitalize tracking-tighter transition-all"
                                                                            >
                                                                                ENTRAR
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-tactile-text-sub/40 capitalize tracking-widest text-center">Esto solo simula la sesión localmente para pruebas rápidas.</p>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'mensajes' && (
                                <motion.div
                                    key="mensajes"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-12 px-4">
                                        <h2 className="text-4xl font-black  capitalize tracking-tighter mb-8 group">Buzón de <span className="text-primary group-hover:text-tactile-text-sub transition-colors">Mensajes Admin</span></h2>
                                    </div>

                                    <div className="col-span-1 md:col-span-12 space-y-4">
                                        {messages.filter(m => m.targetRole === 'Administrador' || m.receiverId === currentUser?.id).length === 0 ? (
                                            <TactileGlassCard className="py-20 flex flex-col items-center justify-center opacity-40">
                                                <MessageSquare className="w-20 h-20 mb-6" />
                                                <p className="text-sm font-black capitalize tracking-[0.3em]">No hay mensajes para el administrador</p>
                                            </TactileGlassCard>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {messages
                                                    .filter(m => m.targetRole === 'Administrador' || m.receiverId === currentUser?.id)
                                                    .map(msg => (
                                                        <div key={msg.id} className={cn(
                                                            "tactile-glass-panel p-6 border-l-4 transition-all",
                                                            msg.isRead ? "border-l-white/10 opacity-70" : "border-l-primary bg-primary/5 active:scale-[0.99]"
                                                        )}>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-sm font-black capitalize shadow-inner">
                                                                        {msg.senderName?.charAt(0) || 'U'}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-black text-white text-lg  flex items-center gap-2">
                                                                            {msg.senderName || 'Usuario'}
                                                                            {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                                                        </h4>
                                                                        <span className="text-[10px] text-tactile-text-sub capitalize font-bold tracking-widest">{format(parseISO(msg.createdAt), "d MMM, h:mm a")}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {!msg.isRead && (
                                                                        <button
                                                                            onClick={() => markMessageAsRead(msg.id)}
                                                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                                                            title="Marcar como leído"
                                                                        >
                                                                            <CheckCircle className="w-5 h-5" />
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                                                                        title="Responder"
                                                                    >
                                                                        <Reply className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner mb-4">
                                                                <p className="text-sm font-medium text-tactile-text-sub leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                            </div>

                                                            <AnimatePresence>
                                                                {replyingTo === msg.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="pt-4 space-y-4">
                                                                            <textarea
                                                                                value={replyText}
                                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                                placeholder={`Escribe tu respuesta para ${msg.senderName}...`}
                                                                                className="w-full h-32 bg-black/60 border border-primary/20 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                                                                            />
                                                                            <div className="flex justify-end gap-3">
                                                                                <button
                                                                                    onClick={() => setReplyingTo(null)}
                                                                                    className="px-6 h-12 rounded-xl text-[10px] font-black capitalize tracking-widest text-tactile-text-sub hover:text-white"
                                                                                >
                                                                                    CANCELAR
                                                                                </button>
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        if (!replyText.trim()) return;
                                                                                        await sendCloudMessage({
                                                                                            senderId: currentUser.id,
                                                                                            receiverId: msg.senderId,
                                                                                            content: replyText,
                                                                                            isRead: false
                                                                                        });
                                                                                        setReplyText('');
                                                                                        setReplyingTo(null);
                                                                                        showNotification('Respuesta enviada.', 'success');
                                                                                    }}
                                                                                    className="px-8 h-12 bg-amber-500 text-black rounded-xl text-[10px] font-black capitalize tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                                                                                >
                                                                                    ENVIAR RESPUESTA
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'perfil' && (
                                <motion.div
                                    key="perfil"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-12 px-4">
                                        <h2 className="text-4xl font-black  capitalize tracking-tighter mb-8 group">Configuración de <span className="text-primary group-hover:text-tactile-text-sub transition-colors">Mi Perfil</span></h2>
                                    </div>

                                    <div className="col-span-1 md:col-span-5 flex flex-col items-center">
                                        <TactileGlassCard className="w-full h-full flex flex-col items-center justify-center py-12">
                                            <div
                                                className="w-48 h-48 rounded-3xl border-8 border-primary/20 p-2 relative group cursor-pointer overflow-hidden shadow-2xl"
                                                onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                                            >
                                                {currentUser.avatar ? (
                                                    <img src={currentUser.avatar} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" alt="Avatar" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-2xl">
                                                        <User className="w-20 h-20 text-primary opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="w-10 h-10 text-white mb-2" />
                                                    <span className="text-[10px] font-black capitalize tracking-widest text-white">Cambiar Foto</span>
                                                </div>
                                            </div>

                                            <input
                                                type="file"
                                                id="admin-avatar-upload"
                                                className="hidden"
                                                accept="image/*,.svg"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setIsSaving(true);
                                                        const publicUrl = await uploadAvatar(currentUser?.id || '', file);
                                                        if (publicUrl && currentUser) {
                                                            const updatedUser = { ...currentUser, avatar: publicUrl };
                                                            await updateProfileInCloud(currentUser.id, updatedUser);
                                                            setCurrentUser(updatedUser);
                                                        }
                                                        setIsSaving(false);
                                                    }
                                                }}
                                            />

                                            <div className="mt-8 text-center">
                                                <h3 className="text-2xl font-black capitalize tracking-tighter">{currentUser?.name || 'Admin'}</h3>
                                                <div className="flex items-center gap-2 justify-center mt-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-black capitalize tracking-[0.2em] text-emerald-500">Super Administrador</span>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-7 space-y-6">
                                        <TactileGlassCard title="Datos Personales y Contacto">
                                            <div className="grid grid-cols-1 gap-6">
                                                <TactileInput
                                                    label="Nombre Completo"
                                                    value={currentUser?.name || ''}
                                                    onChange={(e: any) => currentUser && setCurrentUser({ ...currentUser, name: e.target.value })}
                                                    icon={User}
                                                />
                                                <TactileInput
                                                    label="Correo Electrónico (Solo Lectura)"
                                                    value={currentUser?.email || ''}
                                                    disabled={true}
                                                    icon={Mail}
                                                />
                                                <TactileInput
                                                    label="TELÉFONO"
                                                    value={currentUser?.phone || ''}
                                                    onChange={(e: any) => currentUser && setCurrentUser({ ...currentUser, phone: e.target.value })}
                                                    icon={Phone}
                                                />
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2 flex items-center gap-2">
                                                        <FileText className="w-3 h-3" /> Acerca de Mí / Biografía
                                                    </label>
                                                    <textarea
                                                        value={currentUser?.bio || ''}
                                                        onChange={(e) => currentUser && setCurrentUser({ ...currentUser, bio: e.target.value })}
                                                        placeholder="Escribe algo sobre ti para que los miembros te conozcan..."
                                                        className="w-full h-32 bg-black/40 border border-white/10 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-white/5">
                                                <button
                                                    onClick={async () => {
                                                        if (!currentUser?.name || !currentUser?.email) return;
                                                        setIsSaving(true);
                                                        const success = await updateProfileInCloud(currentUser.id, currentUser);
                                                        if (success) {
                                                            showNotification('Perfil actualizado correctamente en la nube', 'success');
                                                        }
                                                        setIsSaving(false);
                                                    }}
                                                    className="tactile-btn tactile-btn-orange w-full h-14 justify-center text-sm font-black tracking-widest gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                                                >
                                                    {isSaving ? (
                                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Save className="w-5 h-5" />
                                                    )}
                                                    {isSaving ? 'Guardando...' : 'Guardar Cambios en Mi Perfil'}
                                                </button>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="NIVEL DE PRIVILEGIOS">
                                            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                                    <Flame className="w-24 h-24" />
                                                </div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
                                                        <Flame className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black capitalize tracking-widest text-primary">Acceso Maestro</p>
                                                        <p className="text-[10px] text-tactile-text-sub/70 font-bold capitalize tracking-widest">Control total sobre el sistema y miembros</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-1.5 bg-primary text-black rounded-lg text-[10px] font-black capitalize tracking-tighter shadow-lg shadow-primary/20 relative z-10">
                                                    VERIFICADO
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'contenido' && (
                                <motion.div
                                    key="contenido"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-6 space-y-6">
                                        <TactileGlassCard title="TEMA SEMANAL">
                                            <div className="space-y-6">
                                                <TactileInput
                                                    label="TÍTULO DEL TEMA"
                                                    value={theme.title || ''}
                                                    onChange={(e: any) => useAppStore.getState().setTheme({ ...theme, title: e.target.value })}
                                                    icon={Sparkles}
                                                />
                                                <TactileSelect
                                                    label="CATEGORÍA / TIPO DE TEMA"
                                                    value={theme.type || 'orthodoxy'}
                                                    onChange={(val: any) => useAppStore.getState().setTheme({ ...theme, type: val })}
                                                    options={[
                                                        { value: 'orthodoxy', label: 'Estudio de Ortodoxia' },
                                                        { value: 'apostolic_letter', label: 'Carta Apostólica' },
                                                        { value: 'history', label: 'Relato Histórico' },
                                                        { value: 'free', label: 'Tema de Edificación' }
                                                    ]}
                                                    icon={BookOpen}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <TactileInput
                                                        label="FECHA INICIO"
                                                        type="date"
                                                        value={theme.startDate || ''}
                                                        onChange={(e: any) => useAppStore.getState().setTheme({ ...theme, startDate: e.target.value })}
                                                        icon={Calendar}
                                                    />
                                                    <TactileInput
                                                        label="FECHA FIN"
                                                        type="date"
                                                        value={theme.endDate || ''}
                                                        onChange={(e: any) => useAppStore.getState().setTheme({ ...theme, endDate: e.target.value })}
                                                        icon={Calendar}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">RESUMEN / DESCRIPCIÓN</label>
                                                    <textarea
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold outline-none min-h-[100px] focus:border-primary/50 transition-all"
                                                        value={theme.description || ''}
                                                        onChange={(e) => useAppStore.getState().setTheme({ ...theme, description: e.target.value })}
                                                        placeholder="Breve resumen del tema..."
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">CONTENIDO VISUAL (URL)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            className="flex-1 bg-black/40 border border-white/5 rounded-2xl h-12 px-4 text-xs font-bold outline-none"
                                                            value={theme.fileUrl || ''}
                                                            onChange={(e) => useAppStore.getState().setTheme({ ...theme, fileUrl: e.target.value })}
                                                            placeholder="https://..."
                                                        />
                                                        <button
                                                            onClick={async () => {
                                                                const fileInput = document.createElement('input');
                                                                fileInput.type = 'file';
                                                                fileInput.accept = 'image/*';
                                                                fileInput.onchange = async (e: any) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        setIsSaving(true);
                                                                        const url = await uploadAvatar(`theme-${Date.now()}`, file);
                                                                        if (url) {
                                                                            useAppStore.getState().setTheme({ ...theme, fileUrl: url });
                                                                            showNotification('Imagen subida. No olvides guardar.', 'info');
                                                                        }
                                                                        setIsSaving(false);
                                                                    }
                                                                };
                                                                fileInput.click();
                                                            }}
                                                            className="tactile-btn tactile-btn-glass p-0 w-12 justify-center"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        try {
                                                            await saveThemeToCloud(theme);
                                                            showNotification('Tema guardado en la nube.', 'success');
                                                        } catch (err) {
                                                            showNotification('Error al guardar el tema', 'error');
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    disabled={isSaving}
                                                    className="tactile-btn tactile-btn-orange w-full h-12 justify-center"
                                                >
                                                    {isSaving ? (
                                                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Save className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isSaving ? 'GUARDANDO...' : 'GUARDAR TEMA'}
                                                </button>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="EVENTO MEMORABLE (COUNTDOWN)">
                                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-sm">Contador Regresivo</h4>
                                                    <p className="text-[10px] text-tactile-text-sub capitalize tracking-widest font-black">Activar en el Display</p>
                                                </div>
                                                <button
                                                    onClick={() => setSettings({ showCountdown: !settings.showCountdown })}
                                                    className={cn("w-14 h-8 rounded-full p-1 transition-colors", settings.showCountdown ? "bg-primary" : "bg-white/10")}
                                                >
                                                    <div className={cn("w-6 h-6 bg-white rounded-full shadow-lg transition-transform", settings.showCountdown && "translate-x-6")} />
                                                </button>
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-6">
                                        <TactileGlassCard title="VISTA PREVIA DEL CONTENIDO">
                                            <div className="aspect-video rounded-3xl bg-black/60 border-4 border-white/5 overflow-hidden relative group">
                                                {theme.fileUrl ? (
                                                    <img src={theme.fileUrl} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-tactile-text-sub/20">
                                                        <Sparkles className="w-20 h-20 mb-4" />
                                                        <span className="font-black text-xs capitalize tracking-[0.3em]">Sin Contenido</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                                                    <h3 className="text-2xl font-black ">{theme.title || 'Título del Tema'}</h3>
                                                    <p className="text-[10px] capitalize font-black tracking-widest text-primary mt-2">Tema de la Semana</p>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'coros' && (
                                <motion.div
                                    key="coros"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-6 space-y-6">
                                        <TactileGlassCard title="ENSAYOS DE CORO">
                                            <div className="space-y-4">
                                                {rehearsals.map(reh => (
                                                    <div key={reh.id} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 group">
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black  text-xs">
                                                            {['D', 'L', 'M', 'X', 'J', 'V', 'S'][reh.dayOfWeek]}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-black text-sm capitalize ">{reh.location}</h4>
                                                            <p className="text-[10px] font-bold text-tactile-text-sub">{reh.time}</p>
                                                        </div>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('¿Eliminar este ensayo?')) {
                                                                    await deleteRehearsalFromCloud(reh.id);
                                                                }
                                                            }}
                                                            className="tactile-btn tactile-btn-glass !rounded-full w-8 h-8 p-0 items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setShowRehearsalModal(true)}
                                                    className="tactile-btn tactile-btn-glass w-full justify-start gap-4 h-12 px-6"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span className="text-[10px] font-black capitalize tracking-widest">Agregar Ensayos</span>
                                                </button>
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-6 space-y-6">
                                        <TactileGlassCard title="UNIFORMES DE LA SEMANA">
                                            <div className="space-y-4">
                                                {(() => {
                                                    const today = new Date(currentDate + 'T12:00:00');
                                                    const start = new Date(today);
                                                    const dayOfWeek = today.getDay();
                                                    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                                                    start.setDate(today.getDate() + offset);

                                                    const weekDays = Array.from({ length: 7 }, (_, i) => {
                                                        const d = new Date(start);
                                                        d.setDate(start.getDate() + i);
                                                        return format(d, 'yyyy-MM-dd');
                                                    });

                                                    return weekDays.map((date) => {
                                                        const uniformId = uniformSchedule[date];
                                                        const uniform = uniforms.find(u => u.id === uniformId);
                                                        return (
                                                            <div key={date} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 relative group/row">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-tactile-text-sub capitalize font-black tracking-widest mb-1 truncate">
                                                                        {format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })}
                                                                    </span>
                                                                    <span className={cn("font-black  px-4 py-1.5 rounded-xl border border-white/5 bg-black/40 text-xs", uniform ? "text-primary border-primary/20" : "text-white/20")}>
                                                                        {uniform?.name || 'VESTUARIO NO DEFINIDO'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2 relative">
                                                                    <select
                                                                        value={uniformId || ''}
                                                                        onChange={(e) => saveUniformForDateToCloud(date, e.target.value)}
                                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                                                    >
                                                                        <option value="">(Sin Uniforme)</option>
                                                                        {uniforms.map(u => (
                                                                            <option key={u.id} value={u.id}>{u.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    <button className="tactile-btn tactile-btn-glass h-9 text-[9px] pointer-events-none group-hover/row:bg-[#576983] group-hover/row:text-black transition-all">CAMBIAR</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    });
                                                })()}
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-12 space-y-6 mt-12">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-black  capitalize tracking-widest text-white">Avisos del Coro</h3>
                                            <button
                                                onClick={() => { setActiveTab('anuncios'); setNewAnn({ ...newAnn, category: 'choir' }); }}
                                                className="tactile-btn tactile-btn-glass text-[9px] px-4 font-black"
                                            >
                                                <Plus className="w-3 h-3 mr-2" /> NUEVO AVISO
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {announcements.filter(a => a.category === 'choir' || a.title.toLowerCase().includes('coro')).length === 0 ? (
                                                <div className="p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center bg-black/20">
                                                    <p className="text-tactile-text-sub font-bold capitalize tracking-widest text-xs">No hay avisos específicos para el coro</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {announcements.filter(a => a.category === 'choir' || a.title.toLowerCase().includes('coro')).map((ann) => (
                                                        <div key={ann.id} className="tactile-glass-panel p-6 flex items-start gap-4 group hover:bg-white/5 transition-colors">
                                                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 border border-pink-500/20">
                                                                <Bell className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-black text-sm capitalize  truncate">{ann.title}</h4>
                                                                <p className="text-[11px] text-tactile-text-sub line-clamp-2 mt-1">{ann.content}</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingAnnId(ann.id);
                                                                        setNewAnn({ ...ann });
                                                                        setActiveTab('anuncios');
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }}
                                                                    className="tactile-btn tactile-btn-glass !rounded-full w-8 h-8 p-0 items-center justify-center hover:text-primary transition-all"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm('¿Eliminar este aviso de coro?')) {
                                                                            await deleteAnnouncementFromCloud(ann.id);
                                                                        }
                                                                    }}
                                                                    className="tactile-btn tactile-btn-glass !rounded-full w-8 h-8 p-0 items-center justify-center hover:text-red-500 transition-all"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'estilos' && (
                                <motion.div
                                    key="estilos"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-12">
                                        <h2 className="text-4xl font-black  capitalize tracking-tighter mb-8">Temas del <span className="text-tactile-text-sub">Display</span></h2>
                                    </div>

                                    <div className="col-span-1 md:col-span-12">
                                        <TactileGlassCard title="IDENTIDAD VISUAL" subtitle="Logos e Imagotipos de la Iglesia">
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                                {/* Logo Oficial: Flama */}
                                                {/* Sin Logotipo */}
                                            <button
                                                onClick={() => saveSettingsToCloud({ churchLogoUrl: '' })}
                                                className={cn(
                                                    "flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300",
                                                    (settings.churchLogoUrl === '') ? "bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "bg-black/40 border-white/5 hover:bg-white/5"
                                                )}
                                            >
                                                <div className="w-16 h-16 flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 text-slate-500">
                                                    <XCircle className="w-10 h-10" />
                                                </div>
                                                <span className={cn("text-[10px] font-black capitalize tracking-widest", (settings.churchLogoUrl === '') ? "text-primary" : "text-tactile-text-sub")}>
                                                    Sin Logotipo
                                                </span>
                                            </button>



                                                {/* 4 Slots Personalizados */}
                                                {[1, 2, 3, 4].map((slotIndex) => {
                                                    const slotKey = `customLogo${slotIndex}` as any;
                                                    const slotUrl = (settings as any)[slotKey] as string;
                                                    const isActive = settings.churchLogoUrl === slotUrl && slotUrl;

                                                    return (
                                                        <div key={slotIndex} className="relative group/slot h-full">
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={() => {
                                                                    if (slotUrl) {
                                                                        saveSettingsToCloud({ churchLogoUrl: slotUrl });
                                                                    } else {
                                                                        document.getElementById(`tactile-custom-logo-${slotIndex}`)?.click();
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        if (slotUrl) {
                                                                            saveSettingsToCloud({ churchLogoUrl: slotUrl });
                                                                        } else {
                                                                            document.getElementById(`tactile-custom-logo-${slotIndex}`)?.click();
                                                                        }
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "w-full flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 border-dashed transition-all h-full cursor-pointer",
                                                                    isActive ? "bg-primary/20 border-primary/40 border-solid shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "bg-black/20 border-white/10 hover:border-white/20"
                                                                )}
                                                            >
                                                                {slotUrl ? (
                                                                    <>
                                                                        <div className="w-20 h-20 flex items-center justify-center p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                                                                            <img src={slotUrl} className="w-full h-full object-contain" alt={`Custom ${slotIndex}`} />
                                                                        </div>
                                                                        <span className={cn("text-[10px] font-black capitalize tracking-widest", isActive ? "text-primary" : "text-tactile-text-sub")}>
                                                                            Logo {slotIndex}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                document.getElementById(`tactile-custom-logo-${slotIndex}`)?.click();
                                                                            }}
                                                                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full opacity-0 group-hover/slot:opacity-100 transition-opacity hover:bg-primary/20"
                                                                        >
                                                                            <Upload className="w-3 h-3 text-white" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center gap-3 py-4 h-full">
                                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/slot:border-primary/50 transition-colors">
                                                                            <Plus className="w-6 h-6 text-white/30 group-hover/slot:text-primary transition-colors" />
                                                                        </div>
                                                                        <span className="text-[9px] font-black capitalize text-tactile-text-sub/40 tracking-widest">Logo {slotIndex}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                id={`tactile-custom-logo-${slotIndex}`}
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png,.svg,.webp"
                                                                onChange={(e) => {
                                                                    console.log(`Starting upload for slot ${slotIndex}...`);
                                                                    handleCustomLogoUpload(e, slotIndex as any);
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-4 space-y-4">
                                        <h4 className="text-[10px] font-black capitalize tracking-[0.3em] text-tactile-text-sub mb-4 ml-2">Plantillas Disponibles</h4>
                                        {[
                                            { id: 'cristal', label: 'Cristal Forge', icon: Sparkles, desc: 'Neo-Glassmorphism Premium' },
                                            { id: 'neon', label: 'Neon Forge', icon: Radio, desc: 'Retro-Futurista Vibrante' },
                                            { id: 'minimal', label: 'Dark Minimal', icon: Monitor, desc: 'Elegancia y Simplicidad' },
                                            { id: 'iglesia', label: 'Iglesia', icon: Flame, desc: 'Académico y Tradicional' },
                                            { id: 'nocturno', label: 'Midnight Glow', icon: Moon, desc: 'Atmosférico y Profundo' }
                                        ].map(themeOpt => (
                                            <button
                                                key={themeOpt.id}
                                                onClick={() => {
                                                    setCalendarStyles({ template: themeOpt.id as any });
                                                    saveSettingsToCloud({ displayTemplate: themeOpt.id as any });
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all border text-left",
                                                    calendarStyles.template === themeOpt.id ? "bg-primary/20 border-primary/40 text-primary shadow-lg" : "bg-black/20 border-white/5 text-tactile-text-sub hover:bg-white/5"
                                                )}
                                            >
                                                <themeOpt.icon className="w-6 h-6" />
                                                <div>
                                                    <span className="font-black text-xs capitalize tracking-widest block">{themeOpt.label}</span>
                                                    <span className="text-[9px] font-bold opacity-50 capitalize tracking-tighter">{themeOpt.desc}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="col-span-1 md:col-span-8 space-y-8">
                                        <TactileGlassCard title="CONFIGURACIÓN DEL TEMA">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <TactileFontSelect
                                                        label="TIPOGRAFÍA PRINCIPAL"
                                                        value={settings.fontMain || calendarStyles.fontFamily || 'Poppins'}
                                                        onChange={(val: any) => {
                                                            setSettings({ fontMain: val });
                                                            setCalendarStyles({ fontFamily: val });
                                                            saveSettingsToCloud({ fontMain: val });
                                                        }}
                                                        icon={Edit2}
                                                    />

                                                    <div className="space-y-4 pt-2">
                                                        <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">PESO Y GROSOR</label>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {[
                                                                { label: 'THIN', weight: '300' },
                                                                { label: 'NORM', weight: '400' },
                                                                { label: 'MED', weight: '500' },
                                                                { label: 'BOLD', weight: '700' },
                                                                { label: 'MAX', weight: '900' },
                                                            ].map((w) => (
                                                                <button
                                                                    key={w.weight}
                                                                    onClick={() => {
                                                                        setSettings({ fontWeight: w.weight });
                                                                        saveSettingsToCloud({ fontWeight: w.weight });
                                                                    }}
                                                                    className={cn(
                                                                        "tactile-btn justify-center text-[8px] font-black py-2",
                                                                        (settings.fontWeight || '400') === w.weight ? "tactile-btn-primary" : "tactile-btn-orange"
                                                                    )}
                                                                >
                                                                    {w.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between ml-2">
                                                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub">TRANSICIONES ANIMADAS</label>
                                                            <button
                                                                onClick={() => {
                                                                    const newValue = settings.transitionsEnabled === false;
                                                                    setSettings({ transitionsEnabled: newValue });
                                                                    saveSettingsToCloud({ transitionsEnabled: newValue });
                                                                }}
                                                                className={cn(
                                                                    "w-12 h-6 rounded-full relative transition-colors border",
                                                                    settings.transitionsEnabled !== false ? "bg-primary/40 border-primary/40" : "bg-black/40 border-white/10"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "absolute top-1 w-4 h-4 rounded-full transition-all shadow-lg",
                                                                    settings.transitionsEnabled !== false ? "right-1 bg-white" : "left-1 bg-tactile-text-sub"
                                                                )} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[8px] font-bold text-tactile-text-sub/40 capitalize tracking-widest ml-2">¿ACTUAR CON EFECTOS DE MOVIMIENTO?</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">TIEMPO DE CADA SLIDE (SEGUNDOS)</label>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {[5, 12, 20, 30].map((sec) => {
                                                                const themeId = calendarStyles.template || 'nocturno';
                                                                const durationKey = `${themeId}SlideDuration` as any;
                                                                const currentDuration = settings[durationKey as keyof typeof settings] || 12;
                                                                const isActive = currentDuration === sec;

                                                                return (
                                                                    <button
                                                                        key={sec}
                                                                        onClick={() => {
                                                                            setSettings({ [durationKey]: sec });
                                                                            saveSettingsToCloud({ [durationKey]: sec });
                                                                        }}
                                                                        className={cn(
                                                                            "tactile-btn justify-center font-black ",
                                                                            isActive ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                        )}
                                                                    >
                                                                        {sec}s
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <p className="text-[8px] font-bold text-primary/60 capitalize tracking-widest ml-2">GUARDADO POR TEMA: {calendarStyles.template?.toUpperCase()}</p>
                                                    </div>

                                                    {calendarStyles.template === 'iglesia' && (
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">ESTILO DE CÁTEDRA</label>
                                                            <div className="flex gap-4">
                                                                <button
                                                                    onClick={() => setSettings({ iglesiaVariant: 'light' })}
                                                                    className={cn(
                                                                        "tactile-btn flex-1 justify-center gap-3",
                                                                        settings.iglesiaVariant === 'light' ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <Sun className="w-4 h-4" />
                                                                    CLARO
                                                                </button>
                                                                <button
                                                                    onClick={() => setSettings({ iglesiaVariant: 'dark' })}
                                                                    className={cn(
                                                                        "tactile-btn flex-1 justify-center gap-3",
                                                                        settings.iglesiaVariant === 'dark' ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <Moon className="w-4 h-4" />
                                                                    OSCURO
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">TRANSICIÓN DE PANTALLA</label>
                                                        <div className="flex flex-col gap-3">
                                                            {[
                                                                { id: 'metro', label: 'ESTILO METRO (LÍNEA CONTINUA)', icon: Radio },
                                                                { id: 'breathing', label: 'RESPIRACIÓN (SUAVE)', icon: Sunrise },
                                                                { id: 'fade', label: 'FADE CLÁSICO', icon: Monitor }
                                                            ].map((anim) => (
                                                                <button
                                                                    key={anim.id}
                                                                    onClick={() => {
                                                                        setSettings({ animationType: anim.id as any });
                                                                        saveSettingsToCloud({ animationType: anim.id as any });
                                                                    }}
                                                                    className={cn(
                                                                        "tactile-btn justify-center gap-3",
                                                                        (settings.animationType === anim.id || (!settings.animationType && anim.id === 'metro')) ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <anim.icon className="w-4 h-4" />
                                                                    {anim.label}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        <div className="mt-6 space-y-4">
                                                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">VELOCIDAD DE TRANSICIÓN</label>
                                                            <div className="flex gap-2">
                                                                {[1.2, 2.4, 4.0].map((speed) => (
                                                                    <button
                                                                        key={speed}
                                                                        onClick={() => {
                                                                            setSettings({ animationSpeed: speed });
                                                                            saveSettingsToCloud({ animationSpeed: speed });
                                                                        }}
                                                                        className={cn(
                                                                            "tactile-btn flex-1 text-[10px] py-2",
                                                                            (settings.animationSpeed === speed || (!settings.animationSpeed && speed === 2.4)) ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                        )}
                                                                    >
                                                                        {speed === 1.2 ? 'RÁPIDO' : speed === 2.4 ? 'NORMAL' : 'LENTO'}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>




                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">EFECTOS ESPECIALES</label>
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => setCalendarStyles({ showGlassEffect: !calendarStyles.showGlassEffect })}
                                                                className={cn(
                                                                    "tactile-btn flex-1 justify-center",
                                                                    calendarStyles.showGlassEffect ? "tactile-btn-orange" : "tactile-btn-glass"
                                                                )}
                                                            >
                                                                EFECTO CRISTAL
                                                            </button>
                                                            <button
                                                                onClick={() => setSettings({ lowPerformanceMode: !settings.lowPerformanceMode })}
                                                                className={cn(
                                                                    "tactile-btn flex-1 justify-center",
                                                                    settings.lowPerformanceMode ? "tactile-btn-orange" : "tactile-btn-glass"
                                                                )}
                                                            >
                                                                {settings.lowPerformanceMode ? "TRANSICIONES: SIMPLES" : "TRANSICIONES: FLUIDAS"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center">
                                                        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
                                                            <Monitor className="w-10 h-10 text-primary" />
                                                        </div>
                                                        <h4 className="font-black text-sm capitalize ">Vista Previa</h4>
                                                        <p className="text-[10px] text-tactile-text-sub mt-2 leading-relaxed">El tema se aplicará instantáneamente a todas las pantallas conectadas.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Retro-Light Glow (Behind everything) */}
                        <div className="fixed bottom-0 left-0 right-0 h-2 bg-orange-600 blur-xl opacity-20 pointer-events-none" />

                        {/* Add Member Modal */}
                        <AnimatePresence>
                            {showAddMember && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowAddMember(false)}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="relative w-full max-w-2xl bg-[#212327] rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                            <h2 className="text-2xl font-black  capitalize tracking-tighter">
                                                {editingMember ? 'Editar' : 'Nuevo'} <span className="text-primary">Miembro</span>
                                            </h2>
                                            <button
                                                onClick={() => setShowAddMember(false)}
                                                className="tactile-btn tactile-btn-glass !rounded-full w-10 h-10 p-0 items-center justify-center"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="p-8 flex flex-col items-center border-b border-white/5 bg-white/5">
                                            <div className="relative group/avatar">
                                                <div className="w-40 h-40 rounded-full border-4 border-primary/20 p-2 relative">
                                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/50 shadow-2xl bg-black/40">
                                                        <img
                                                            src={newMemberData.avatar || 'https://via.placeholder.com/150'}
                                                            className={cn("w-full h-full object-cover", isSaving && "opacity-40 grayscale")}
                                                            alt="Avatar"
                                                        />
                                                        {isSaving && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => document.getElementById('member-avatar-upload')?.click()}
                                                        className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-transform"
                                                    >
                                                        <Camera className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="member-avatar-upload"
                                                    className="hidden"
                                                    accept="image/*,.svg"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            // If SVG, skip editor and upload directly or show it in the form
                                                            if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
                                                                setIsSaving(true);
                                                                const url = await uploadAvatar(`member-svg-${Date.now()}`, file);
                                                                if (url) {
                                                                    setNewMemberData({ ...newMemberData, avatar: url });
                                                                    showNotification("SVG del miembro subido exitosamente.", 'success');
                                                                }
                                                                setIsSaving(false);
                                                                return;
                                                            }

                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setImageToEdit({ source: reader.result as string, target: 'member' });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-black capitalize tracking-[0.2em] text-primary mt-4">Foto de Perfil</p>
                                        </div>

                                        <div className="p-8 grid grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto no-scrollbar">
                                            <TactileInput
                                                label="NOMBRE COMPLETO"
                                                placeholder="Ej. Juan Pérez"
                                                value={newMemberData.name || ''}
                                                onChange={(e: any) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                                                icon={User}
                                            />
                                            <TactileInput
                                                label="CORREO ELECTRÓNICO"
                                                placeholder="juan@ejemplo.com"
                                                value={newMemberData.email || ''}
                                                onChange={(e: any) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                                                icon={Mail}
                                            />
                                            <TactileInput
                                                label="TELÉFONO"
                                                placeholder="555-0000"
                                                value={newMemberData.phone || ''}
                                                onChange={(e: any) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                                                icon={Phone}
                                            />
                                            <TactileSelect
                                                label="GÉNERO"
                                                value={newMemberData.gender || 'Varon'}
                                                onChange={(val: any) => setNewMemberData({ ...newMemberData, gender: val, category: val === 'Varon' ? 'Varon' : 'Hermana' })}
                                                options={[
                                                    { value: 'Varon', label: 'Varón' },
                                                    { value: 'Hermana', label: 'Hermana' },
                                                ]}
                                                icon={User}
                                            />
                                            <TactileSelect
                                                label="GRUPO / CLASIFICACIÓN"
                                                value={newMemberData.member_group || 'Hermanos'}
                                                onChange={(val: any) => setNewMemberData({ ...newMemberData, member_group: val })}
                                                options={[
                                                    { value: 'Administración', label: 'Administración' },
                                                    { value: 'Casados', label: 'Casados' },
                                                    { value: 'Casadas', label: 'Casadas' },
                                                    { value: 'Solos y Solas', label: 'Solos y Solas' },
                                                    { value: 'Jovenes', label: 'Jóvenes' },
                                                    { value: 'Niños', label: 'Niños' },
                                                    { value: 'Niñas', label: 'Niñas' },
                                                ]}
                                                icon={Users}
                                            />
                                            <TactileSelect
                                                label="ROL EN EL SISTEMA"
                                                value={newMemberData.role || 'Miembro'}
                                                onChange={(val: any) => {
                                                    const newPrivileges = [...(newMemberData.privileges || [])];
                                                    if (val === 'Responsable de Asistencia' && !newPrivileges.includes('monitor')) newPrivileges.push('monitor');
                                                    if (val === 'Dirigente Coro Adultos' && !newPrivileges.includes('choir')) newPrivileges.push('choir');
                                                    if (val === 'Administrador' && !newPrivileges.includes('admin')) newPrivileges.push('admin');
                                                    if (val === 'Encargado de Jóvenes' && !newPrivileges.includes('youth_leader')) newPrivileges.push('youth_leader');
                                                    setNewMemberData({ ...newMemberData, role: val, privileges: [...new Set(newPrivileges)] as any });
                                                }}
                                                options={[
                                                    { value: 'Miembro', label: 'Miembro' },
                                                    { value: 'Administrador', label: 'Administrador' },
                                                    { value: 'Ministro a Cargo', label: 'Ministro a Cargo' },
                                                    { value: 'Dirigente Coro Adultos', label: 'Dirigente Coro Adultos' },
                                                    { value: 'Dirigente Coro Niños', label: 'Dirigente Coro Niños' },
                                                    { value: 'Responsable de Asistencia', label: 'Responsable de Asistencia' },
                                                    { value: 'Encargado de Jóvenes', label: 'Encargado de Jóvenes' },
                                                ]}
                                                icon={Flame}
                                            />
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">ACERCA DE / BIOGRAFÍA</label>
                                                <textarea
                                                    value={newMemberData.bio || ''}
                                                    onChange={(e) => setNewMemberData({ ...newMemberData, bio: e.target.value })}
                                                    placeholder="Biografía o notas sobre el miembro..."
                                                    className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold outline-none focus:border-primary/50 transition-all resize-none"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-4">
                                                <label className="text-[9px] font-black capitalize tracking-[0.2em] text-tactile-text-sub ml-2">PRIVILEGIOS / ACCESOS</label>
                                                <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[#121523] border border-white/5 rounded-2xl shadow-2xl">
                                                    {[
                                                        { id: 'admin', label: 'ADMIN' },
                                                        { id: 'monitor', label: 'PASE LISTA' },
                                                        { id: 'leader', label: 'DIRECTOR' },
                                                        { id: 'choir', label: 'CORO' },
                                                        { id: 'kids_leader', label: 'DOMINICAL' },
                                                        { id: 'youth_leader', label: 'JUVENIL' }
                                                    ].map(priv => (
                                                        <button
                                                            key={priv.id}
                                                            onClick={() => {
                                                                const current = newMemberData.privileges || [];
                                                                const next = current.includes(priv.id as any)
                                                                    ? current.filter((p: string) => p !== priv.id)
                                                                    : [...current, priv.id];
                                                                setNewMemberData({ ...newMemberData, privileges: next as any });
                                                            }}
                                                            className={cn(
                                                                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                                                (newMemberData.privileges || []).includes(priv.id as any)
                                                                    ? "bg-[#576983] text-black shadow-lg transform scale-[1.02]"
                                                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            {priv.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 border-t border-white/5 flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setShowAddMember(false);
                                                    setEditingMember(null);
                                                }}
                                                className="tactile-btn tactile-btn-glass flex-1 justify-center h-14 font-black capitalize tracking-widest"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!newMemberData.name) {
                                                        showNotification("El nombre es obligatorio", 'error');
                                                        return;
                                                    }
                                                    setIsSaving(true);
                                                    let success = false;
                                                    if (editingMember) {
                                                        success = await updateProfileInCloud(editingMember.id, newMemberData);
                                                    } else {
                                                        // Convert data to match addMemberToCloud signature
                                                        success = await addMemberToCloud({
                                                            name: newMemberData.name || '',
                                                            email: newMemberData.email || '',
                                                            phone: newMemberData.phone,
                                                            role: newMemberData.role || 'Miembro',
                                                            gender: newMemberData.gender || 'Varon',
                                                            category: newMemberData.category || 'Varon',
                                                            member_group: newMemberData.member_group,
                                                            privileges: newMemberData.privileges as any,
                                                            avatar: newMemberData.avatar,
                                                            bio: newMemberData.bio
                                                        });
                                                    }

                                                    if (success) {
                                                        await loadMembersFromCloud();
                                                        setShowAddMember(false);
                                                        setEditingMember(null);
                                                        setNewMemberData({
                                                            name: '',
                                                            email: '',
                                                            phone: '',
                                                            gender: 'Varon',
                                                            member_group: 'Casados',
                                                            role: 'Miembro',
                                                            category: 'Varon',
                                                            status: 'Activo',
                                                            avatar: undefined,
                                                            bio: ''
                                                        });
                                                    }
                                                    setIsSaving(false);
                                                }}
                                                disabled={isSaving}
                                                className={cn(
                                                    "tactile-btn tactile-btn-orange flex-1 justify-center h-14 font-black capitalize tracking-widest shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
                                                    isSaving && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {isSaving ? 'Guardando...' : 'Guardar Miembro'}
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Rehearsal Modal */}
                        {showRehearsalModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="bg-tactile-bg border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                                >
                                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black  capitalize tracking-tighter">Gestionar <span className="text-primary truncate">Ensayos</span></h3>
                                            <p className="text-[10px] font-bold text-tactile-text-sub capitalize tracking-widest mt-1">Configuración del Coro</p>
                                        </div>
                                        <button onClick={() => setShowRehearsalModal(false)} className="tactile-btn tactile-btn-glass !rounded-full w-10 h-10 p-0 items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <TactileSelect
                                            label="DÍA DE LA SEMANA"
                                            value={newRehearsal.dayOfWeek}
                                            onChange={(val: any) => setNewRehearsal({ ...newRehearsal, dayOfWeek: parseInt(val) })}
                                            options={[
                                                { value: 0, label: 'Domingo' },
                                                { value: 1, label: 'Lunes' },
                                                { value: 2, label: 'Martes' },
                                                { value: 3, label: 'Miércoles' },
                                                { value: 4, label: 'Jueves' },
                                                { value: 5, label: 'Viernes' },
                                                { value: 6, label: 'Sábado' },
                                            ]}
                                            icon={CalendarDays}
                                        />
                                        <TactileInput
                                            label="HORA DEL ENSAYO"
                                            placeholder="07:00 PM"
                                            value={newRehearsal.time}
                                            onChange={(e: any) => setNewRehearsal({ ...newRehearsal, time: e.target.value })}
                                            icon={Clock}
                                        />
                                        <TactileInput
                                            label="LUGAR"
                                            placeholder="Salón de Actos"
                                            value={newRehearsal.location}
                                            onChange={(e: any) => setNewRehearsal({ ...newRehearsal, location: e.target.value })}
                                            icon={MapPin}
                                        />
                                    </div>

                                    <div className="p-8 border-t border-white/5 flex gap-4">
                                        <button
                                            onClick={() => setShowRehearsalModal(false)}
                                            className="tactile-btn tactile-btn-glass flex-1 justify-center h-14 font-black"
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setIsSaving(true);
                                                await saveRehearsalToCloud(newRehearsal);
                                                setShowRehearsalModal(false);
                                                setIsSaving(false);
                                            }}
                                            className="tactile-btn tactile-btn-orange flex-1 justify-center h-14 font-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                                        >
                                            {isSaving ? 'GUARDANDO...' : 'GUARDAR ENSAYO'}
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {selectedMemberForHistory && (
                            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedMemberForHistory(null)}
                                    className="absolute inset-0 bg-[#050510]/95 backdrop-blur-xl"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                                >
                                    {/* Header / Banner */}
                                    <div className="relative h-48 bg-gradient-to-br from-primary/30 to-purple-500/20">
                                        <button 
                                            onClick={() => setSelectedMemberForHistory(null)}
                                            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>

                                        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
                                            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-[#050510] overflow-hidden shadow-2xl bg-[#1a1a1a]">
                                                <img 
                                                    src={selectedMemberForHistory.avatar || `https://ui-avatars.com/api/?name=${selectedMemberForHistory.name}&background=random`} 
                                                    className="w-full h-full object-cover" 
                                                    alt="" 
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <h2 className="text-3xl font-black  capitalize tracking-tighter text-white">{selectedMemberForHistory.name}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black capitalize tracking-widest px-3 py-1 rounded-full bg-primary text-black">
                                                        {selectedMemberForHistory.member_group}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-white/40 capitalize tracking-widest ">{selectedMemberForHistory.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pt-16 p-10 space-y-8">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: 'ORACIONES ASISTIDAS', value: memberHistory.filter(r => r.present).length, icon: CheckCircle, color: 'text-emerald-400' },
                                                { label: 'PUNTUALIDAD', value: `${selectedMemberForHistory.stats?.punctuality || 95}%`, icon: Clock, color: 'text-primary' },
                                                { label: 'TOTAL REGISTROS', value: memberHistory.length, icon: Calendar, color: 'text-white/40' }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center text-center">
                                                    <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
                                                    <div className="text-xl font-black ">{stat.value}</div>
                                                    <p className="text-[8px] font-black capitalize text-white/30 tracking-widest mt-1">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <h4 className="text-[10px] font-black capitalize tracking-[0.2em] text-white/50">HISTORIAL RECIENTE</h4>
                                                <span className="text-[9px] font-bold text-primary  capitalize tracking-widest">Últimos 30 días</span>
                                            </div>
                                            
                                            <div className="bg-black/20 border border-white/5 rounded-[2rem] p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {isLoadingHistory ? (
                                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                                                        <p className="text-[10px] font-black capitalize tracking-widest text-white/30 ">Cargando historial...</p>
                                                    </div>
                                                ) : memberHistory.length === 0 ? (
                                                    <div className="py-12 text-center">
                                                        <Info className="w-8 h-8 text-white/10 mx-auto mb-4" />
                                                        <p className="text-[10px] font-black capitalize tracking-widest text-white/20 ">No hay registros previos</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {(() => {
                                                            // Group by individual day for clearer view
                                                            const byDate: Record<string, AttendanceRecord[]> = {};
                                                            memberHistory.forEach(r => {
                                                                if (!byDate[r.date]) byDate[r.date] = [];
                                                                byDate[r.date].push(r);
                                                            });

                                                            return Object.entries(byDate).slice(0, 14).map(([date, records]) => (
                                                                <div key={date} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-black capitalize  text-white/80">{format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es })}</span>
                                                                        <div className="flex gap-1 mt-1">
                                                                            {['5am', '9am', 'evening'].map(type => {
                                                                                const rec = records.find(r => r.session_type === type);
                                                                                const present = rec?.present;
                                                                                return (
                                                                                    <div key={type} className={cn(
                                                                                        "px-2 py-0.5 rounded text-[7px] font-black capitalize tracking-tighter transition-all",
                                                                                        present ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-white/20 border border-white/5"
                                                                                    )}>
                                                                                        {type === '5am' ? '5 AM' : type === '9am' ? '9 AM' : 'TARDE'}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-[8px] font-bold text-white/20 capitalize tracking-widest">{records.some(r => r.present) ? 'ASISTIÓ' : 'FALTA'}</span>
                                                                        {records.some(r => r.present) && (
                                                                            <span className="text-[9px] font-black text-emerald-400 mt-1 ">✓ Visto</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => setSelectedMemberForHistory(null)}
                                            className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black capitalize tracking-[0.2em] hover:bg-white/10 transition-all active:scale-[0.98]"
                                        >
                                            CERRAR DETALLE
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {imageToEdit && (
                            <ImageEditor
                                image={imageToEdit.source}
                                loading={isSaving}
                                onSave={async (cropped) => {
                                    setIsSaving(true);
                                    try {
                                        if (imageToEdit.target === 'member') {
                                            const idForUpload = editingMember?.id || `new_${Date.now()}`;
                                            const file = dataURLtoFile(cropped, `member-${idForUpload}.jpg`);
                                            const url = await uploadAvatar(idForUpload, file);
                                            if (url) {
                                                setNewMemberData({ ...newMemberData, avatar: url });
                                                // Persistencia inmediata para miembros existentes para mejorar la experiencia de usuario
                                                if (editingMember) {
                                                    await updateProfileInCloud(editingMember.id, { avatar: url });
                                                    await loadMembersFromCloud(); // Recargar para sincronizar lista
                                                }
                                            }
                                        } else {
                                            const file = dataURLtoFile(cropped, `minister-responsible.jpg`);
                                            // Usar un ID único para evitar cache agresivo de navegadores
                                            const url = await uploadAvatar(`minister-${Date.now()}`, file);
                                            if (url) {
                                                // 1. Sincronizar Settings
                                                await saveSettingsToCloud({ ministerAvatar: url });

                                                // 2. Sincronizar estado global del Ministro
                                                setMinister({ avatar: url });

                                                // 3. Sincronizar Perfil en DB si no es un mock
                                                if (minister.id && !minister.id.includes('minister-eliab')) {
                                                    await updateProfileInCloud(minister.id, { avatar: url });
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        console.error("Error saving photo:", err);
                                    } finally {
                                        setIsSaving(false);
                                        setImageToEdit(null);
                                    }
                                }}
                                onCancel={() => setImageToEdit(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
