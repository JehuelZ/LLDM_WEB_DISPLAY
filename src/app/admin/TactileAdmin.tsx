"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, UserProfile } from '@/lib/store'
import {
    LayoutDashboard, CalendarDays, Sparkles, Megaphone,
    Shirt, Settings, Users, UserPlus, CalendarClock,
    ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Save,
    Trash2, Upload, Monitor, Sun, X, Shield, Church,
    Cross, Star, Heart, TrendingUp, Edit2, LogOut, Moon,
    Bell, CheckCircle2, AlertTriangle, MessageSquare, Info,
    Camera, Phone, Mail, User, Globe, Languages, Music2,
    Calendar, TrendingDown, Clock, Search, Filter, Plus, Radio, BookOpen, Lock, Sunrise, MapPin, Palette, RefreshCw, Power
} from 'lucide-react'
import { format, parseISO, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn, compressImage } from '@/lib/utils'
import { ImageEditor } from '@/components/ImageEditor'
import './tactile-admin.css'

// Internal components to replicate functionality with tactile style
const TactileIconBox = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <div className="tactile-icon-box" style={{ backgroundColor: color }}>
        <Icon className="w-6 h-6" />
    </div>
)

const TactileGlassCard = ({ children, title, className, subtitle }: { children: React.ReactNode, title?: string, className?: string, subtitle?: string }) => (
    <div className={cn("tactile-glass-panel", className)}>
        {title && (
            <div className="mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tactile-text-sub mb-1">{title}</h3>
                {subtitle && <p className="text-[9px] font-bold text-tactile-text-sub/60 uppercase tracking-widest">{subtitle}</p>}
            </div>
        )}
        {children}
    </div>
)

// Tactile Input Components
const TactileInput = ({ label, value, onChange, placeholder, icon: Icon, type = "text", disabled }: any) => (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
        {label && <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">{label}</label>}
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

const TactileSelect = ({ label, value, onChange, options, icon: Icon, disabled }: any) => (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
        {label && <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">{label}</label>}
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub group-focus-within:text-primary transition-colors pointer-events-none" />}
            <select
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full bg-black/40 border border-white/5 rounded-2xl h-12 text-sm font-bold px-4 appearance-none cursor-pointer outline-none focus:border-primary/50 focus:bg-black/60",
                    Icon && "pl-12"
                )}
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1c20] text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub rotate-90 pointer-events-none" />
        </div>
    </div>
)

export default function TactileAdmin() {
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
        uploadAvatar,
        theme, saveThemeToCloud, loadThemeFromCloud,
        uniforms, uniformSchedule, loadUniformsFromCloud,
        saveUniformToCloud, deleteUniformFromCloud,
        saveUniformForDateToCloud, rehearsals,
        loadRehearsalsFromCloud, saveRehearsalToCloud, deleteRehearsalFromCloud,
        minister, setMinister, signOut,
        createTestAccounts, simulateUser
    } = useAppStore()

    const currentDaySchedule = monthlySchedule[currentDate] || {
        slots: {
            '5am': { leaderId: '', time: '05:00 AM', endTime: '05:30 AM', language: 'es' },
            '9am': { consecrationLeaderId: '', doctrineLeaderId: '', time: '09:00 AM', endTime: '10:00 AM', language: 'es' },
            '12pm': { leaderId: '', time: '12:00 PM', endTime: '01:00 PM', language: 'es' },
            'evening': { leaderIds: [], time: '07:00 PM', endTime: '08:00 PM', type: 'regular', language: 'es' }
        }
    };

    const [activeTab, setActiveTab] = useState('dashboard')
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const tabs = [
        { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
        { id: 'horarios', label: 'Programación', icon: CalendarDays },
        { id: 'contenido', label: 'Contenido', icon: Sparkles },
        { id: 'anuncios', label: 'Comunicados', icon: Bell },
        { id: 'estilos', label: 'Temas TV', icon: Palette },
        { id: 'coros', label: 'Coros', icon: Music2 },
        { id: 'miembros', label: 'Miembros', icon: Users },
        { id: 'ajustes', label: 'Ajustes', icon: Settings },
    ]
    const [newAnn, setNewAnn] = useState<any>({ title: '', content: '', priority: 0, expiresAt: '' })
    const [editingAnnId, setEditingAnnId] = useState<string | null>(null)
    const [memberFilter, setMemberFilter] = useState('all')
    const [showAddMember, setShowAddMember] = useState(false)
    const [editingMember, setEditingMember] = useState<UserProfile | null>(null)
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

    const [showRehearsalModal, setShowRehearsalModal] = useState(false)
    const [editingRehearsal, setEditingRehearsal] = useState<any>(null)

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
        useAppStore.getState().loadAllSchedulesFromCloud();
        useAppStore.getState().loadAnnouncementsFromCloud();
        useAppStore.getState().loadThemeFromCloud();
        loadRehearsalsFromCloud();

        const unsubSettings = useAppStore.getState().subscribeToSettings();
        return () => unsubSettings();
    }, [loadMembersFromCloud, loadSettingsFromCloud, loadRehearsalsFromCloud]);

    useEffect(() => {
        loadDayScheduleFromCloud(currentDate)
    }, [currentDate, loadDayScheduleFromCloud])
    const navigateDay = (days: number) => {
        const date = new Date(currentDate + 'T12:00:00')
        date.setDate(date.getDate() + days)
        const newDate = date.toISOString().split('T')[0]
        setCurrentDate(newDate)
    }

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
            alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const ministerMember = members.find(m => m.name === settings.ministerName);
    const otherMembers = members
        .filter(m => m.id !== ministerMember?.id)
        .sort((a, b) => a.name.localeCompare(b.name));

    const memberOptions = [
        { value: '', label: 'Seleccionar...' },
        ...(ministerMember ? [{ value: ministerMember.id, label: `⭐ EL MINISTRO (${ministerMember.name})` }] : []),
        ...otherMembers.map(m => ({ value: m.id, label: m.name }))
    ];

    return (
        <div className="tactile-admin-root">
            {/* Background Backlighting Glow */}
            <div className="base-glow" />

            <div className="tactile-main-container">
                {/* Neon Side Border */}
                <div className="tactile-neon-sidebar">
                    <div className="neon-segment neon-orange" />
                    <div className="neon-segment neon-blue" />
                    <div className="neon-segment neon-pink" />
                    <div className="neon-segment neon-purple" />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header / Tabs */}
                    <div className="tactile-tabs">
                        <div className="flex-1 flex gap-4 md:gap-8 items-center overflow-x-auto no-scrollbar py-2">
                            {/* User Profile Avatar Section */}
                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/5 mr-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
                                    <img
                                        src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`}
                                        alt={currentUser.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-white leading-none mb-0.5">{currentUser.name}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-primary leading-none opacity-70">{currentUser.role}</p>
                                </div>
                            </div>

                            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter mr-4 md:mr-8 whitespace-nowrap">
                                RODEO <span className="text-tactile-text-sub">ADMIN</span>
                            </h1>
                            <div className="flex gap-3 md:gap-6">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "tactile-btn tactile-btn-glass whitespace-nowrap flex-shrink-0",
                                            activeTab === tab.id && "active"
                                        )}
                                    >
                                        <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden xs:inline">{tab.label}</span>
                                        <span className="xs:hidden">{tab.label.slice(0, 3)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                            <button
                                onClick={() => window.open('/display', '_blank')}
                                className="tactile-btn tactile-btn-glass text-[9px] md:text-[10px] text-primary border-primary/20 hover:border-primary/50 group flex-1 md:flex-none justify-center"
                            >
                                <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">PROYECTAR</span>
                                <span className="sm:hidden text-[8px]">LIVE</span>
                            </button>
                            <button
                                onClick={() => saveSettingsToCloud({ adminTheme: 'classic' })}
                                className="tactile-btn tactile-btn-glass text-[9px] md:text-[10px] flex-1 md:flex-none justify-center"
                            >
                                <Monitor className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">Classic UI</span>
                                <span className="sm:hidden">Classic</span>
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="tactile-btn tactile-btn-orange text-[9px] md:text-[10px] flex-1 md:flex-none justify-center"
                            >
                                <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Cerrar Sesión</span>
                                <span className="sm:hidden text-[8px]">SALIR</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1 p-8 tactile-scroll">
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
                                            <h2 className="text-4xl font-black italic" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Resumen del Sistema</h2>
                                            {isSaving && (
                                                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sincronizando...</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-6 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                                <TactileIconBox icon={CheckCircle2} color="#3b82f6" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">Asistencia de Hoy</h4>
                                                    <p className="text-tactile-text-sub text-sm">Registro de asistencia en curso</p>
                                                </div>
                                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Normal</div>
                                            </div>

                                            <div className="flex items-center gap-6 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                                <TactileIconBox icon={AlertTriangle} color="#f97316" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">Programación de Domingo</h4>
                                                    <p className="text-tactile-text-sub text-sm">Requiere definir tipo de servicio dominical</p>
                                                </div>
                                                <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Atención</div>
                                            </div>

                                            <div className="flex items-center gap-6 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                                <TactileIconBox icon={Shirt} color="#db2777" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">Coros y Uniformes</h4>
                                                    <p className="text-tactile-text-sub text-sm">Uniformes de la semana seleccionados correctamente</p>
                                                </div>
                                                <div className="text-[10px] font-black text-tactile-text-sub uppercase tracking-widest">Ok</div>
                                            </div>

                                            <div className="flex items-center gap-6 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                                <TactileIconBox icon={Monitor} color="#6366f1" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">Estado de Pizarra</h4>
                                                    <p className="text-tactile-text-sub text-sm">Tema "{calendarStyles.template}" activo en el display</p>
                                                </div>
                                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Online</div>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex gap-4">
                                            <button className="tactile-btn tactile-btn-orange text-xs px-8">ACTUALIZAR NUBE</button>
                                            <button className="tactile-btn tactile-btn-glass text-xs px-8">HISTORIAL</button>
                                        </div>
                                    </div>

                                    {/* Right Column - Controls */}
                                    <div className="col-span-1 md:col-span-4 space-y-8 flex flex-col items-center">
                                        <TactileGlassCard title="MASTER CONTROL" className="w-full">
                                            <div className="flex flex-col items-center gap-8 py-8">
                                                <div className="tactile-circular-control">
                                                    <div className="tactile-circular-line" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-tactile-text-sub uppercase tracking-[0.3em]">Brillo Display</p>
                                                    <div className="text-3xl font-black italic mt-2 text-primary">100%</div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="MÉTRICAS" className="w-full">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-tactile-text-sub uppercase">Miembros</span>
                                                    <span className="text-xl font-black italic">{members.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-tactile-text-sub uppercase">Racha</span>
                                                    <span className="text-xl font-black italic text-orange-400">0 Días</span>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
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
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex items-center gap-4 bg-black/30 p-2 rounded-[2.5rem] border border-white/5 shadow-inner">
                                            <button onClick={() => navigateDay(-1)} className="tactile-btn tactile-btn-glass !rounded-full w-12 h-12 flex items-center justify-center p-0"><ChevronLeft /></button>
                                            <div className="text-2xl font-black italic uppercase tracking-tighter min-w-[300px] text-center px-4">
                                                {format(parseISO(currentDate), "PPPP", { locale: es })}
                                            </div>
                                            <button onClick={() => navigateDay(1)} className="tactile-btn tactile-btn-glass !rounded-full w-12 h-12 flex items-center justify-center p-0"><ChevronRight /></button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {isSaving && <div className="text-[9px] font-black text-primary animate-pulse uppercase tracking-widest mr-4">Sincronizando...</div>}
                                            <button
                                                onClick={() => {
                                                    if (confirm("¿Poblar mes con datos aleatorios?")) seedMonthSchedule();
                                                }}
                                                className="tactile-btn tactile-btn-glass text-[10px]"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" /> Poblar Mes
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
                                            title="09:00 AM"
                                            subtitle="Consagración / Doctrina"
                                            className="border-t-2 border-t-yellow-500/30"
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
                                                    icon={Shield}
                                                />

                                                <button
                                                    onClick={() => updateSlot('9am', {})}
                                                    className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                                                >
                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR CAMBIOS
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
                                                <button
                                                    onClick={() => updateSlot('evening', {})}
                                                    className="tactile-btn tactile-btn-orange w-full justify-center h-10 mt-2"
                                                >
                                                    <Save className="w-3.5 h-3.5 mr-2" /> GUARDAR SERVICIO
                                                </button>
                                            </div>
                                        </TactileGlassCard>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'anuncios' && (
                                <motion.div
                                    key="anuncios"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-4 space-y-6">
                                        <TactileGlassCard title={editingAnnId ? "EDITAR COMUNICADO" : "NUEVO COMUNICADO"}>
                                            <div className="space-y-4">
                                                <TactileInput
                                                    label="TÍTULO"
                                                    placeholder="Ej. Estudio Bíblico..."
                                                    value={newAnn.title}
                                                    onChange={(e: any) => setNewAnn({ ...newAnn, title: e.target.value })}
                                                />
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">CONTENIDO</label>
                                                    <textarea
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold min-h-[120px] outline-none focus:border-primary/50"
                                                        placeholder="Detalles del anuncio..."
                                                        value={newAnn.content}
                                                        onChange={(e: any) => setNewAnn({ ...newAnn, content: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TactileSelect
                                                        label="PRIORIDAD"
                                                        value={newAnn.priority}
                                                        onChange={(val: string) => setNewAnn({ ...newAnn, priority: parseInt(val) })}
                                                        options={[
                                                            { value: 0, label: 'Normal' },
                                                            { value: 1, label: 'Importante' },
                                                            { value: 2, label: 'Urgente' },
                                                        ]}
                                                        icon={Bell}
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <TactileInput
                                                            label="EXPIRA EL"
                                                            type="date"
                                                            value={newAnn.expiresAt?.split('T')[0] || ''}
                                                            onChange={(e: any) => {
                                                                const time = newAnn.expiresAt?.includes('T') ? newAnn.expiresAt?.split('T')[1]?.slice(0, 5) : '23:59';
                                                                setNewAnn({ ...newAnn, expiresAt: `${e.target.value}T${time}` });
                                                            }}
                                                            icon={CalendarClock}
                                                        />
                                                        <TactileInput
                                                            label="HORA"
                                                            type="time"
                                                            value={newAnn.expiresAt?.includes('T') ? newAnn.expiresAt?.split('T')[1]?.slice(0, 5) : '23:59'}
                                                            onChange={(e: any) => {
                                                                const date = newAnn.expiresAt?.split('T')[0] || format(new Date(), 'yyyy-MM-dd');
                                                                setNewAnn({ ...newAnn, expiresAt: `${date}T${e.target.value}` });
                                                            }}
                                                            icon={Clock}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {editingAnnId && (
                                                        <button
                                                            onClick={() => {
                                                                setEditingAnnId(null);
                                                                setNewAnn({ title: '', content: '', priority: 0, expiresAt: '' });
                                                            }}
                                                            className="tactile-btn tactile-btn-glass flex-1 justify-center h-12"
                                                        >
                                                            CANCELAR
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            if (!newAnn.title || !newAnn.content) return;
                                                            setIsSaving(true);
                                                            await saveAnnouncementToCloud({
                                                                ...newAnn,
                                                                id: editingAnnId || undefined,
                                                                timestamp: newAnn.timestamp || new Date().toISOString()
                                                            });
                                                            setNewAnn({ title: '', content: '', priority: 0, expiresAt: '' });
                                                            setEditingAnnId(null);
                                                            setIsSaving(false);
                                                        }}
                                                        disabled={isSaving}
                                                        className="tactile-btn tactile-btn-orange flex-[2] justify-center h-12"
                                                    >
                                                        {isSaving ? 'GUARDANDO...' : (editingAnnId ? 'ACTUALIZAR' : 'PUBLICAR AHORA')}
                                                    </button>
                                                </div>
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-8 space-y-4">
                                        <h3 className="text-xl font-black italic uppercase tracking-widest mb-4">Comunicados Activos</h3>
                                        {announcements.length === 0 ? (
                                            <div className="p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center">
                                                <p className="text-tactile-text-sub font-bold uppercase tracking-widest">No hay anuncios activos</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {announcements.map((ann) => (
                                                    <div key={ann.id} className="tactile-glass-panel flex items-center gap-6 group hover:bg-white/[0.05] transition-colors p-6">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-full flex items-center justify-center border shadow-lg",
                                                            ann.priority === 2 ? "bg-red-500/20 border-red-500/40 text-red-500" :
                                                                ann.priority === 1 ? "bg-orange-500/20 border-orange-500/40 text-orange-500" :
                                                                    "bg-blue-500/20 border-blue-500/40 text-blue-500"
                                                        )}>
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="font-bold text-lg">{ann.title}</h4>
                                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 py-0.5 border border-white/10 rounded-full">
                                                                    {format(parseISO(ann.timestamp), "d MMM")}
                                                                </span>
                                                            </div>
                                                            <p className="text-tactile-text-sub text-sm line-clamp-1">{ann.content}</p>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingAnnId(ann.id);
                                                                    setNewAnn({ ...ann });
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className="tactile-btn tactile-btn-glass !rounded-full w-10 h-10 p-0 items-center justify-center hover:text-primary transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('¿Eliminar este comunicado?')) {
                                                                        await deleteAnnouncementFromCloud(ann.id);
                                                                    }
                                                                }}
                                                                className="tactile-btn tactile-btn-glass !rounded-full w-10 h-10 p-0 items-center justify-center hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'miembros' && (
                                <motion.div
                                    key="miembros"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                                >
                                    <div className="col-span-1 md:col-span-12 flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-6">
                                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Directorio <span className="text-tactile-text-sub">Local</span></h2>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tactile-text-sub" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar miembro..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="bg-black/30 border border-white/5 rounded-2xl h-11 pl-12 pr-6 text-sm font-bold min-w-[300px] outline-none focus:border-primary/50"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowAddMember(true)}
                                            className="tactile-btn tactile-btn-orange"
                                        >
                                            <Plus className="w-4 h-4" /> Agregar Miembro
                                        </button>
                                    </div>

                                    {/* Sidebar Filters */}
                                    <div className="col-span-1 md:col-span-3 space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-tactile-text-sub mb-4 ml-2">Filtrar por Grupo</h4>
                                        {[
                                            { id: 'all', label: 'Todos', count: members.length },
                                            { id: 'Administración', label: 'Siervos de Dios', count: members.filter(m => m.role === 'Administrador' || m.member_group === 'Administración').length },
                                            { id: 'Casados', label: 'Matrimonios', count: members.filter(m => m.member_group === 'Casados' || m.member_group === 'Casadas').length },
                                            { id: 'Solos y Solas', label: 'Solos y Solas', count: members.filter(m => m.member_group === 'Solos y Solas').length },
                                            { id: 'Jovenes', label: 'Jóvenes', count: members.filter(m => m.member_group === 'Jovenes').length },
                                            { id: 'Niños', label: 'Niños / Niñas', count: members.filter(m => m.member_group === 'Niños' || m.member_group === 'Niñas').length },
                                        ].map(group => (
                                            <button
                                                key={group.id}
                                                onClick={() => setMemberFilter(group.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border",
                                                    memberFilter === group.id ? "bg-primary/20 border-primary/40 text-primary shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.2)]" : "bg-black/20 border-white/5 text-tactile-text-sub hover:bg-white/5"
                                                )}
                                            >
                                                <span className="font-black text-xs uppercase tracking-widest">{group.label}</span>
                                                <span className="text-[10px] font-bold opacity-50">{group.count}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Members Grid */}
                                    <div className="col-span-1 md:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {members
                                            .filter(m => {
                                                const searchLower = searchTerm.toLowerCase();
                                                const nameMatch = (m.name || '').toLowerCase().includes(searchLower);
                                                const emailMatch = (m.email || '').toLowerCase().includes(searchLower);
                                                const matchesSearch = nameMatch || emailMatch;

                                                if (!matchesSearch) return false;

                                                if (memberFilter === 'all') return true;
                                                if (memberFilter === 'Administración') return m.role === 'Administrador' || m.member_group === 'Administración';
                                                if (memberFilter === 'Casados') return m.member_group === 'Casados' || m.member_group === 'Casadas';
                                                if (memberFilter === 'Niños') return m.member_group === 'Niños' || m.member_group === 'Niñas';
                                                return m.member_group === memberFilter;
                                            })
                                            .map(member => (
                                                <div key={member.id} className="tactile-glass-panel p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/[0.03] transition-colors relative">
                                                    <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden relative">
                                                        <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} className="w-full h-full object-cover" alt={member.name} />
                                                        {member.role === 'Administrador' && (
                                                            <div className="absolute inset-0 border-2 border-primary rounded-full pointer-events-none" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-base truncate italic">{member.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-tactile-text-sub">
                                                                {member.role}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                                                {member.member_group}
                                                            </span>
                                                            <span className={cn(
                                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                                member.status === 'Activo' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-500"
                                                            )}>
                                                                {member.status || 'Activo'}
                                                            </span>
                                                            {(member.privileges || []).map((p: string) => (
                                                                <span key={p} className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-500/70">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={async () => {
                                                                const newStatus = member.status === 'Activo' ? 'Inactivo' : 'Activo';
                                                                const success = await updateProfileInCloud(member.id, { ...member, status: newStatus as any });
                                                                if (success) {
                                                                    await loadMembersFromCloud();
                                                                }
                                                            }}
                                                            title={member.status === 'Activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                                                            className={cn(
                                                                "tactile-btn tactile-btn-glass !rounded-full w-9 h-9 p-0 items-center justify-center transition-all",
                                                                member.status === 'Activo' ? "hover:text-red-500" : "hover:text-emerald-500"
                                                            )}
                                                        >
                                                            <Power className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMember(member);
                                                                setNewMemberData({ ...member });
                                                                setShowAddMember(true);
                                                            }}
                                                            className="tactile-btn tactile-btn-glass !rounded-full w-9 h-9 p-0 items-center justify-center"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`¿Estás seguro de eliminar a ${member.name}?`)) {
                                                                    deleteMemberFromCloud(member.id);
                                                                }
                                                            }}
                                                            className="tactile-btn tactile-btn-glass !rounded-full w-9 h-9 p-0 items-center justify-center hover:text-red-500"
                                                        ><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>

                                                </div>
                                            ))}
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
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Preferencias del <span className="text-tactile-text-sub">Sistema</span></h2>
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
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">COLOR PRIMARIO</label>
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

                                                <TactileSelect
                                                    label="ICONO DE IDENTIDAD"
                                                    value={settings.churchIcon}
                                                    onChange={(val: any) => saveSettingsToCloud({ churchIcon: val })}
                                                    options={[
                                                        { value: 'shield', label: 'Escudo' },
                                                        { value: 'church', label: 'Iglesia' },
                                                        { value: 'cross', label: 'Cruz' },
                                                    ]}
                                                    icon={Shield}
                                                />

                                                <div className="py-4 border-t border-white/5 space-y-4">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2 flex justify-between">
                                                        <span>OPTIMIZACIÓN DE TV (OVERSCAN / ESCALA)</span>
                                                        <span className="text-primary">{Math.round((settings.displayScale || 1.0) * 100)}%</span>
                                                    </label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((sc) => (
                                                            <button
                                                                key={sc}
                                                                onClick={() => {
                                                                    setSettings({ displayScale: sc });
                                                                    saveSettingsToCloud({ displayScale: sc });
                                                                }}
                                                                className={cn(
                                                                    "tactile-btn flex-1 text-[10px] py-2",
                                                                    (settings.displayScale || 1.0) === sc ? "tactile-btn-orange" : "tactile-btn-glass"
                                                                )}
                                                            >
                                                                {Math.round(sc * 100)}%
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-[8px] text-tactile-text-sub ml-2 italic leading-relaxed">
                                                        * Si el contenido se ve cortado en los bordes de la TV, baje la escala al 90%, 80% o 70%.
                                                    </p>
                                                </div>

                                                <div className="py-4 border-t border-white/5 space-y-4">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">
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
                                                        className="text-[10px] font-black uppercase text-primary mt-4 tracking-widest hover:underline"
                                                    >
                                                        Cambiar Fotografía
                                                    </button>
                                                    <input
                                                        type="file"
                                                        id="minister-avatar-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
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
                                                    className="tactile-btn tactile-btn-orange w-full h-12 justify-center mt-4 font-black uppercase tracking-widest"
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
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">EMAILS AUTORIZADOS</label>
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
                                                    <p className="text-[8px] font-bold text-tactile-text-sub/50 uppercase tracking-widest mt-4">Los administradores siempre tienen acceso.</p>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="ENTORNO DE PRUEBAS">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-orange-200 uppercase leading-relaxed">
                                                        PARA VERIFICAR LOS ROLES, PUEDE CREAR CUENTAS DE PRUEBA CON EMAILS PREDEFINIDOS.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('¿Crear cuentas de prueba para cada rol ministerial?')) {
                                                            await createTestAccounts();
                                                        }
                                                    }}
                                                    className="tactile-btn tactile-btn-glass w-full h-12 justify-center gap-3 font-black uppercase tracking-widest"
                                                >
                                                    <UserPlus className="w-4 h-4 text-primary" /> GENERAR CUENTAS DE TEST
                                                </button>

                                                <div className="mt-8 space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-tactile-text-sub ml-2">SIMULADOR DE ROLES</h4>
                                                    <div className="overflow-hidden rounded-2xl border border-white/5">
                                                        <table className="w-full text-left text-[10px] border-collapse">
                                                            <thead className="bg-white/5 uppercase tracking-widest font-black text-tactile-text-sub">
                                                                <tr>
                                                                    <th className="px-4 py-3">ROL</th>
                                                                    <th className="px-4 py-3">EMAIL</th>
                                                                    <th className="px-4 py-3 text-right">ACCESOS</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5 bg-black/20">
                                                                {[
                                                                    { role: 'Ministro', email: 'ministro_test@lldmrodeo.org', icon: Shield },
                                                                    { role: 'Asistencia', email: 'asistencia_test@lldmrodeo.org', icon: CheckCircle2 },
                                                                    { role: 'Coro', email: 'coro_test@lldmrodeo.org', icon: Music2 },
                                                                    { role: 'Jóvenes', email: 'jovenes_test@lldmrodeo.org', icon: Star },
                                                                    { role: 'Miembro', email: 'miembro_test@lldmrodeo.org', icon: User },
                                                                ].map((testUser) => (
                                                                    <tr key={testUser.email} className="group hover:bg-white/5 transition-colors">
                                                                        <td className="px-4 py-3 font-black italic uppercase flex items-center gap-2">
                                                                            <testUser.icon className="w-3 h-3 text-primary" />
                                                                            {testUser.role}
                                                                        </td>
                                                                        <td className="px-4 py-3 font-medium opacity-60 lowercase">{testUser.email}</td>
                                                                        <td className="px-4 py-3 text-right">
                                                                            <button
                                                                                onClick={async () => {
                                                                                    const success = await simulateUser(testUser.email);
                                                                                    if (success) {
                                                                                        alert(`Simulando sesión como: ${testUser.role}`);
                                                                                        window.location.href = '/dashboard';
                                                                                    } else {
                                                                                        alert('La cuenta aún no existe. Pulsa "GENERAR CUENTAS" primero.');
                                                                                    }
                                                                                }}
                                                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter transition-all"
                                                                            >
                                                                                ENTRAR
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-tactile-text-sub/40 uppercase tracking-widest text-center">Esto solo simula la sesión localmente para pruebas rápidas.</p>
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
                                                    onChange={(e: any) => saveThemeToCloud({ ...theme, title: e.target.value })}
                                                    icon={Sparkles}
                                                />
                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">CONTENIDO VISUAL (URL)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            className="flex-1 bg-black/40 border border-white/5 rounded-2xl h-12 px-4 text-xs font-bold outline-none"
                                                            value={theme.fileUrl || ''}
                                                            onChange={(e) => saveThemeToCloud({ ...theme, fileUrl: e.target.value })}
                                                            placeholder="https://..."
                                                        />
                                                        <button className="tactile-btn tactile-btn-glass p-0 w-12 justify-center"><Upload className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TactileGlassCard>

                                        <TactileGlassCard title="EVENTO MEMORABLE (COUNTDOWN)">
                                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-sm">Contador Regresivo</h4>
                                                    <p className="text-[10px] text-tactile-text-sub uppercase tracking-widest font-black">Activar en el Display</p>
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
                                                        <span className="font-black text-xs uppercase tracking-[0.3em]">Sin Contenido</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                                                    <h3 className="text-2xl font-black italic">{theme.title || 'Título del Tema'}</h3>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mt-2">Tema de la Semana</p>
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
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black italic text-xs">
                                                            {['D', 'L', 'M', 'X', 'J', 'V', 'S'][reh.dayOfWeek]}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-black text-sm uppercase italic">{reh.location}</h4>
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
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Agregar Ensayos</span>
                                                </button>
                                            </div>
                                        </TactileGlassCard>
                                    </div>

                                    <div className="col-span-1 md:col-span-6 space-y-6">
                                        <TactileGlassCard title="UNIFORMES DE LA SEMANA">
                                            <div className="space-y-4">
                                                {Object.entries(uniformSchedule).map(([date, uniformId]) => {
                                                    const uniform = uniforms.find(u => u.id === uniformId);
                                                    return (
                                                        <div key={date} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-tactile-text-sub uppercase tracking-widest mb-1">{format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })}</span>
                                                                <span className="font-black italic text-primary">{uniform?.name || 'No definido'}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button className="tactile-btn tactile-btn-glass h-9 text-[9px]">CAMBIAR</button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </TactileGlassCard>
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
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Temas del <span className="text-tactile-text-sub">Display</span></h2>
                                    </div>

                                    <div className="col-span-1 md:col-span-4 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-tactile-text-sub mb-4 ml-2">Plantillas Disponibles</h4>
                                        {[
                                            { id: 'cristal', label: 'Cristal Forge', icon: Sparkles, desc: 'Neo-Glassmorphism Premium' },
                                            { id: 'neon', label: 'Neon Forge', icon: Radio, desc: 'Retro-Futurista Vibrante' },
                                            { id: 'minimal', label: 'Dark Minimal', icon: Monitor, desc: 'Elegancia y Simplicidad' },
                                            { id: 'iglesia', label: 'Iglesia', icon: Church, desc: 'Académico y Tradicional' },
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
                                                    (settings.displayTemplate || calendarStyles.template) === themeOpt.id ? "bg-primary/20 border-primary/40 text-primary shadow-lg" : "bg-black/20 border-white/5 text-tactile-text-sub hover:bg-white/5"
                                                )}
                                            >
                                                <themeOpt.icon className="w-6 h-6" />
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-widest block">{themeOpt.label}</span>
                                                    <span className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">{themeOpt.desc}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="col-span-1 md:col-span-8 space-y-8">
                                        <TactileGlassCard title="CONFIGURACIÓN DEL TEMA">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <TactileSelect
                                                        label="TIPOGRAFÍA PRINCIPAL"
                                                        value={calendarStyles.fontFamily || 'outfit'}
                                                        onChange={(val: any) => setCalendarStyles({ fontFamily: val })}
                                                        options={[
                                                            { value: 'outfit', label: 'Outfit (Modern)' },
                                                            { value: 'sora', label: 'Sora (Tech)' },
                                                            { value: 'inter', label: 'Inter (Clean)' },
                                                        ]}
                                                        icon={Edit2}
                                                    />

                                                    {calendarStyles.template === 'iglesia' && (
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">ESTILO DE CÁTEDRA</label>
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

                                                    {calendarStyles.template === 'iglesia' && (
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">TRANSICIÓN DE PANTALLA</label>
                                                            <div className="flex flex-col gap-3">
                                                                <button
                                                                    onClick={() => setSettings({ iglesiaAnimation: 'metro' })}
                                                                    className={cn(
                                                                        "tactile-btn justify-center gap-3",
                                                                        settings.iglesiaAnimation === 'metro' || !settings.iglesiaAnimation ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <Radio className="w-4 h-4" />
                                                                    ESTILO METRO (LÍNEA CONTINUA)
                                                                </button>
                                                                <button
                                                                    onClick={() => setSettings({ iglesiaAnimation: 'breathing' })}
                                                                    className={cn(
                                                                        "tactile-btn justify-center gap-3",
                                                                        settings.iglesiaAnimation === 'breathing' ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <Sunrise className="w-4 h-4" />
                                                                    RESPIRACIÓN (SUAVE)
                                                                </button>
                                                                <button
                                                                    onClick={() => setSettings({ iglesiaAnimation: 'fade' })}
                                                                    className={cn(
                                                                        "tactile-btn justify-center gap-3",
                                                                        settings.iglesiaAnimation === 'fade' ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    <Monitor className="w-4 h-4" />
                                                                    FADE CLÁSICO
                                                                </button>
                                                            </div>

                                                            <div className="mt-6 space-y-4">
                                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">VELOCIDAD DE TRANSICIÓN</label>
                                                                <div className="flex gap-2">
                                                                    {[1.2, 2.4, 4.0].map((speed) => (
                                                                        <button
                                                                            key={speed}
                                                                            onClick={() => setSettings({ iglesiaAnimationSpeed: speed })}
                                                                            className={cn(
                                                                                "tactile-btn flex-1 text-[10px] py-2",
                                                                                settings.iglesiaAnimationSpeed === speed || (!settings.iglesiaAnimationSpeed && speed === 2.4) ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                            )}
                                                                        >
                                                                            {speed === 1.2 ? 'RÁPIDO' : speed === 2.4 ? 'NORMAL' : 'LENTO'}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 space-y-4">
                                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">TIEMPO ENTRE PANTALLAS</label>
                                                                <div className="flex gap-2">
                                                                    {[8, 12, 20, 30].map((sec) => (
                                                                        <button
                                                                            key={sec}
                                                                            onClick={() => setSettings({ iglesiaSlideDuration: sec })}
                                                                            className={cn(
                                                                                "tactile-btn flex-1 text-[10px] py-2",
                                                                                settings.iglesiaSlideDuration === sec || (!settings.iglesiaSlideDuration && sec === 12) ? "tactile-btn-primary" : "tactile-btn-glass"
                                                                            )}
                                                                        >
                                                                            {sec}s
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}



                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">EFECTOS ESPECIALES</label>
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
                                                                MODO SMART TV
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center">
                                                        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
                                                            <Monitor className="w-10 h-10 text-primary" />
                                                        </div>
                                                        <h4 className="font-black text-sm uppercase italic">Vista Previa</h4>
                                                        <p className="text-[10px] text-tactile-text-sub mt-2 leading-relaxed">El tema se aplicará instantáneamente a todas las pantallas conectadas.</p>
                                                    </div>

                                                    <div className="mt-8 space-y-4">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2 flex justify-between">
                                                            <span>ESCALA DE DISPLAY (TV OPTIMIZACIÓN)</span>
                                                            <span className="text-primary">{Math.round((settings.displayScale || 1.0) * 100)}%</span>
                                                        </label>
                                                        <div className="flex gap-2">
                                                            {[0.7, 0.8, 0.9, 1.0].map((sc) => (
                                                                <button
                                                                    key={sc}
                                                                    onClick={() => setSettings({ displayScale: sc })}
                                                                    className={cn(
                                                                        "tactile-btn flex-1 text-[10px] py-2",
                                                                        (settings.displayScale || 1.0) === sc ? "tactile-btn-orange" : "tactile-btn-glass"
                                                                    )}
                                                                >
                                                                    {sc * 100}%
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <p className="text-[8px] text-tactile-text-sub ml-2 italic leading-relaxed">
                                                            * Si el contenido se ve cortado en su TV (Overscan), baje la escala al 90% o 80%.
                                                        </p>
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
                                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
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
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setImageToEdit({ source: reader.result as string, target: 'member' });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mt-4">Foto de Perfil</p>
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
                                                value={newMemberData.member_group || 'Casados'}
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
                                                    // Auto-assign logical privileges when role changes
                                                    const newPrivileges = [...(newMemberData.privileges || [])];
                                                    if (val === 'Responsable de Asistencia' && !newPrivileges.includes('monitor')) {
                                                        newPrivileges.push('monitor');
                                                    }
                                                    if (val === 'Dirigente Coro Adultos' && !newPrivileges.includes('choir')) {
                                                        newPrivileges.push('choir');
                                                    }
                                                    if (val === 'Administrador' && !newPrivileges.includes('admin')) {
                                                        newPrivileges.push('admin');
                                                    }
                                                    if (val === 'Encargado de Jóvenes' && !newPrivileges.includes('youth_leader')) {
                                                        newPrivileges.push('youth_leader');
                                                    }
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
                                                icon={Shield}
                                            />
                                            <div className="col-span-2 space-y-4">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-tactile-text-sub ml-2">PRIVILEGIOS / ACCESOS</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { id: 'admin', label: 'Administrador' },
                                                        { id: 'monitor', label: 'Pase de Lista' },
                                                        { id: 'leader', label: 'Director' },
                                                        { id: 'choir', label: 'Gestión Coro' },
                                                        { id: 'kids_leader', label: 'Esc. Dominical' },
                                                        { id: 'youth_leader', label: 'Líder Juvenil' }
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
                                                                "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                                (newMemberData.privileges || []).includes(priv.id as any)
                                                                    ? "bg-primary/20 border-primary/40 text-primary"
                                                                    : "bg-black/20 border-white/5 text-tactile-text-sub hover:bg-white/5"
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
                                                className="tactile-btn tactile-btn-glass flex-1 justify-center h-14 font-black uppercase tracking-widest"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!newMemberData.name) {
                                                        alert("El nombre es obligatorio");
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
                                                            avatar: newMemberData.avatar
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
                                                            avatar: undefined
                                                        });
                                                    }
                                                    setIsSaving(false);
                                                }}
                                                disabled={isSaving}
                                                className={cn(
                                                    "tactile-btn tactile-btn-orange flex-1 justify-center h-14 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
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
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Gestionar <span className="text-primary truncate">Ensayos</span></h3>
                                            <p className="text-[10px] font-bold text-tactile-text-sub uppercase tracking-widest mt-1">Configuración del Coro</p>
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
