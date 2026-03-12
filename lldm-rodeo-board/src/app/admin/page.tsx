
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar, Users, FileText, Settings, ExternalLink,
    Sun, Moon, Monitor, Church, Cross, Star, Heart, Flame,
    Upload, X, ChevronDown, Bell, FilePlus, AlertCircle, Save, Trash2,
    ChevronLeft, ChevronRight, Shirt, Music2, Baby, Briefcase, Mail, Phone, Camera,
    Languages, TrendingUp, CheckCircle, Send, Reply, UserPlus, Edit2, UserCheck
} from "lucide-react";
import Link from 'next/link';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ImageEditor } from '@/components/ImageEditor';

const MessagesPanel = ({
    messages,
    onMarkRead,
    onReply
}: {
    messages: any[],
    onMarkRead: (id: string) => void,
    onReply: (recipientId: string, content: string) => Promise<void>
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
        <Card className="glass-card border-l-4 border-l-primary">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                    <Mail className="h-5 w-5 text-primary" /> Inbox de Mensajes
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Comunicaciones de los miembros y responsables</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <Mail className="h-12 w-12 opacity-10 mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">No hay mensajes nuevos</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={cn(
                                "p-4 rounded-3xl border transition-all flex flex-col gap-3 relative group overflow-hidden",
                                msg.isRead
                                    ? "bg-foreground/[0.02] border-white/5 opacity-60"
                                    : "bg-foreground/5 border-primary/20 shadow-lg shadow-primary/5"
                            )}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black">
                                            {msg.senderName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                                                {msg.senderName}
                                                {!msg.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                            </h4>
                                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!msg.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onMarkRead(msg.id)}
                                                className="h-8 w-8 text-slate-500 hover:text-primary rounded-xl hover:bg-primary/10"
                                                title="Marcar como leído"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                            className="h-8 w-8 text-slate-500 hover:text-primary rounded-xl hover:bg-primary/10"
                                            title="Responder"
                                        >
                                            <Reply className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-sm text-slate-300 leading-relaxed">{msg.content}</p>
                                </div>

                                {replyingTo === msg.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 space-y-2 p-4 bg-primary/5 rounded-2xl border border-primary/20"
                                    >
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`Responder a ${msg.senderName}...`}
                                            className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase" onClick={() => setReplyingTo(null)}>Cancelar</Button>
                                            <Button size="sm" className="h-8 bg-primary text-black text-[10px] font-black uppercase px-4 rounded-lg" onClick={() => handleSendReply(msg.senderId)}>
                                                <Send className="w-3 h-3 mr-2" /> Enviar Respuesta
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const CustomSelect = ({
    value,
    onChange,
    options
}: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[]
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="premium-select-trigger"
            >
                <span>{selectedOption?.label || 'Seleccionar...'}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
                    <div className="premium-dropdown">
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                className="premium-option"
                                data-selected={value === opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function AdminDashboard() {
    const {
        theme, setTheme,
        announcements, addAnnouncement, removeAnnouncement,
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
        saveAnnouncementToCloud,
        deleteAnnouncementFromCloud,
        saveScheduleDayToCloud,
        saveThemeToCloud,
        loadAnnouncementsFromCloud,
        loadDayScheduleFromCloud,
        loadAllSchedulesFromCloud,
        loadThemeFromCloud,
        loadUniformsFromCloud,
        saveUniformToCloud,
        deleteUniformFromCloud,
        saveUniformForDateToCloud,
        saveKidsAssignmentToCloud,
        loadKidsAssignmentsFromCloud,
        saveSettingsToCloud,
        loadSettingsFromCloud,
        members,
        loadMembersFromCloud,
        addMemberToCloud,
        deleteMemberFromCloud,
        loadCloudMessages,
        sendCloudMessage,
        markMessageAsRead,
        messages,
        currentUser
    } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [newUniform, setNewUniform] = useState({ name: '', category: 'Adulto' as 'Adulto' | 'Niño' });
    const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '', email: '', phone: '', role: 'Miembro', gender: 'Varon', category: 'Varon', member_group: ''
    });
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editingRole, setEditingRole] = useState('Miembro');

    useEffect(() => {
        setMounted(true);
        loadAnnouncementsFromCloud();
        loadDayScheduleFromCloud(currentDate);
        loadAllSchedulesFromCloud();
        loadThemeFromCloud();
        loadUniformsFromCloud();
        loadKidsAssignmentsFromCloud(currentDate);
        loadSettingsFromCloud();
        loadMembersFromCloud();
        loadCloudMessages();
    }, [currentDate, loadAnnouncementsFromCloud, loadDayScheduleFromCloud, loadAllSchedulesFromCloud, loadThemeFromCloud, loadUniformsFromCloud, loadKidsAssignmentsFromCloud, loadSettingsFromCloud, loadMembersFromCloud, loadCloudMessages]);

    const handleThemePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            // In a real app we'd upload to Supabase Storage
            // For now we'll simulate it
            console.log("Uploading PDF:", file.name);
            setTheme({ ...theme, fileUrl: URL.createObjectURL(file) });
        }
    };

    const handleMinisterAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            const publicUrl = await uploadAvatar('minister', file);
            if (publicUrl) {
                setMinister({ ...minister, avatar: publicUrl });
            }
            setIsSaving(false);
        }
    };
    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings({
                    churchIcon: 'custom',
                    customIconUrl: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!mounted) return null;

    const currentDaySchedule = monthlySchedule[currentDate] || {
        date: currentDate,
        slots: {
            '5am': { time: '5:00 AM', type: 'prayer', leaderId: '' },
            '9am': { time: '9:00 AM', type: 'prayer', consecrationLeaderId: '', doctrineLeaderId: '' },
            'evening': { time: '7:00 PM', type: 'regular', leaderIds: [] }
        }
    };

    const updateSlot = (slot: '5am' | '9am' | 'evening', updates: any) => {
        setScheduleForDay(currentDate, {
            ...currentDaySchedule,
            slots: {
                ...currentDaySchedule.slots,
                [slot]: {
                    ...currentDaySchedule.slots[slot],
                    ...updates
                }
            }
        });
    };

    const navigateDay = (direction: number) => {
        const date = new Date(currentDate + 'T12:00:00'); // Midday to avoid TZ issues
        date.setDate(date.getDate() + direction);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

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

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">Dashboard</h2>
                    <p className="text-muted-foreground font-light">Panel de control de LLDM RODEO</p>
                </div>
                <div className="flex items-center gap-6">
                    {/* Selectores Premium */}
                    <div className="flex items-center gap-4 bg-foreground/5 p-1.5 px-3 rounded-2xl border border-border/40 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center">
                                <TrendingUp className="w-3.5 h-3.5 text-primary/70 mr-2" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                        <Languages className="w-3 h-3 text-primary" />
                                    </div>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings({ language: e.target.value as any })}
                                        className="bg-transparent border-none rounded-lg pl-6 pr-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-foreground appearance-none cursor-pointer hover:bg-foreground/5 transition-all outline-none"
                                    >
                                        <option value="es" className="bg-[#0f172a]">ES</option>
                                        <option value="en" className="bg-[#0f172a]">EN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-px h-4 bg-foreground/10" />

                            <div className="relative flex items-center">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                        {settings.themeMode === 'light' ? <Sun className="w-3 h-3 text-amber-500" /> :
                                            settings.themeMode === 'dark' ? <Moon className="w-3 h-3 text-primary" /> :
                                                <Monitor className="w-3 h-3 text-slate-400" />}
                                    </div>
                                    <select
                                        value={settings.themeMode}
                                        onChange={(e) => setSettings({ themeMode: e.target.value as any })}
                                        className="bg-transparent border-none rounded-lg pl-6 pr-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-foreground appearance-none cursor-pointer hover:bg-foreground/5 transition-all outline-none"
                                    >
                                        <option value="light" className="bg-[#0f172a]">Light</option>
                                        <option value="dark" className="bg-[#0f172a]">Dark</option>
                                        <option value="system" className="bg-[#0f172a]">Auto</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-foreground/5 p-1 px-2 rounded-xl border border-border/40 backdrop-blur-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateDay(-1)}
                            className="h-8 w-8 hover:bg-foreground/10 rounded-lg text-slate-400 hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="px-3 py-1 text-xs font-black uppercase tracking-tighter border-x border-white/5 min-w-[120px] text-center">
                            {new Date(currentDate + 'T12:00:00').toLocaleDateString(settings.language === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateDay(1)}
                            className="h-8 w-8 hover:bg-foreground/10 rounded-lg text-slate-400 hover:text-foreground transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-foreground/10 mx-1" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
                            className="text-[10px] font-black uppercase tracking-widest px-3 h-8 hover:bg-foreground/10 rounded-lg text-primary"
                        >
                            HOY
                        </Button>
                    </div>
                    <Link href="/display" target="_blank">
                        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10">
                            <ExternalLink className="h-4 w-4" />
                            Ver Proyección
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Total Miembros</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{members.length}</div>
                        <p className="text-xs text-muted-foreground">Sincronizado con la nube</p>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-secondary/5 border-secondary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary">Tema Activo</CardTitle>
                        <FileText className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground truncate">{theme.title}</div>
                        <p className="text-xs text-muted-foreground">Editar abajo</p>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-accent/5 border-accent/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-accent">Próxima Oración</CardTitle>
                        <Calendar className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {currentDaySchedule?.slots['evening'].time || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                            {currentDaySchedule?.slots['evening'].type || 'Sin datos'}
                        </p>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "glass-card border-l-4",
                    monthStats.percentage === 100 ? "bg-emerald-500/5 border-l-emerald-500" : "bg-amber-500/5 border-l-amber-500"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground/70">Progreso del Mes</CardTitle>
                        {monthStats.percentage === 100 ?
                            <CheckCircle className="h-4 w-4 text-emerald-500" /> :
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                        }
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between mb-2">
                            <div className="text-3xl font-black text-foreground italic">{monthStats.percentage}%</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase">
                                {monthStats.percentage === 100 ? '¡Mes Completo!' : `${monthStats.missingDays.length} días incompletos`}
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${monthStats.percentage}%` }}
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    monthStats.percentage === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Messages Inbox Section */}
            <div className="grid grid-cols-1 gap-8" id="mensajes">
                <MessagesPanel
                    messages={messages}
                    onMarkRead={markMessageAsRead}
                    onReply={async (recipientId, content) => {
                        await sendCloudMessage({
                            senderId: currentUser.id,
                            receiverId: recipientId,
                            content,
                            subject: 'Respuesta de Administración'
                        });
                        alert('Respuesta enviada');
                    }}
                />
            </div>

            {/* Schedule Management */}
            <Card id="horarios" className="glass-card border-l-4 border-l-primary !overflow-visible relative z-20">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Programación: <span className="text-primary italic">{format(parseISO(currentDate), "PPPP", { locale: es })}</span>
                        </CardTitle>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Los cambios se guardan automáticamente
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="!overflow-visible">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* 5 AM Slot */}
                        <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40">
                            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-tighter">
                                <span className="text-2xl">05:00</span>
                                <span className="text-sm font-extralight text-foreground/60">AM</span>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">Hno. Responsable</label>
                                <Input
                                    value={currentDaySchedule?.slots['5am'].leaderId || ''}
                                    onChange={(e) => updateSlot('5am', { leaderId: e.target.value })}
                                    className="bg-foreground/5 border-border/40 text-foreground"
                                    placeholder="Nombre del hermano"
                                />
                            </div>
                        </div>

                        {/* 9 AM Slot */}
                        <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-tighter">
                                <span className="text-2xl">09:00</span>
                                <span className="text-sm font-extralight text-foreground/60">AM</span>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">Consagración</label>
                                    <Input
                                        value={currentDaySchedule?.slots['9am'].consecrationLeaderId || ''}
                                        onChange={(e) => updateSlot('9am', { consecrationLeaderId: e.target.value })}
                                        className="bg-foreground/5 border-border/40 text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">Doctrina</label>
                                    <Input
                                        value={currentDaySchedule?.slots['9am'].doctrineLeaderId || ''}
                                        onChange={(e) => updateSlot('9am', { doctrineLeaderId: e.target.value })}
                                        className="bg-foreground/5 border-border/40 text-foreground"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Evening Slot */}
                        <div className="space-y-4 p-4 rounded-xl bg-foreground/5 border border-border/40 relative">
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-primary text-black text-[10px] font-bold uppercase">
                                Estelar
                            </div>
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-tighter">
                                <span className="text-2xl">{currentDaySchedule?.slots['evening'].time}</span>
                            </div>
                            <div className="grid gap-4">
                                <div className="flex gap-2">
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
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">Tipo de Servicio</label>
                                    <CustomSelect
                                        value={currentDaySchedule?.slots['evening'].type}
                                        onChange={(val) => {
                                            const updates: any = { type: val };
                                            const isMulti = ['special', 'youth', 'praise', 'married', 'children'].includes(val);
                                            if (!isMulti && currentDaySchedule.slots.evening.leaderIds.length > 1) {
                                                updates.leaderIds = [currentDaySchedule.slots.evening.leaderIds[0]];
                                            }
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
                                <div>
                                    {['special', 'youth', 'praise', 'married', 'children'].includes(currentDaySchedule?.slots['evening'].type) ? (
                                        <div className="grid gap-4 mt-2">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Servicio (Titular)</label>
                                                <CustomSelect
                                                    value={currentDaySchedule?.slots['evening'].leaderIds[0] || ''}
                                                    onChange={(val) => {
                                                        const newIds = [...(currentDaySchedule?.slots['evening'].leaderIds || [])];
                                                        newIds[0] = val;
                                                        updateSlot('evening', { leaderIds: newIds });
                                                    }}
                                                    options={memberOptions || []}
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
                                                    options={memberOptions || []}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Responsable</label>
                                            <CustomSelect
                                                value={currentDaySchedule?.slots['evening'].leaderIds[0] || ''}
                                                onChange={(val) => updateSlot('evening', { leaderIds: [val] })}
                                                options={memberOptions || []}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Edit Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card id="temas" className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>Configuración de Contenido y Estilos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Weekly Theme */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">Tema Semanal</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium mb-1 block font-bold uppercase tracking-widest text-slate-500 text-[10px]">Tipo de Tema</label>
                                    <CustomSelect
                                        value={theme.type}
                                        onChange={(val) => setTheme({ ...theme, type: val as any })}
                                        options={[
                                            { value: 'free', label: 'Tema Libre' },
                                            { value: 'orthodoxy', label: 'Ortodoxia' },
                                            { value: 'apostolic_letter', label: 'Carta Apostólica' },
                                            { value: 'history', label: 'Historia' },
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block font-bold uppercase tracking-widest text-slate-500 text-[10px]">Título</label>
                                    <Input
                                        value={theme.title}
                                        onChange={(e) => setTheme({ ...theme, title: e.target.value })}
                                        className="bg-foreground/5 border-border/40 text-foreground"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-sm font-medium mb-1 block font-bold uppercase tracking-widest text-slate-500 text-[10px]">Descripción</label>
                                    <Input
                                        value={theme.description}
                                        onChange={(e) => setTheme({ ...theme, description: e.target.value })}
                                        className="bg-foreground/5 border-border/40 text-foreground"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                    <FilePlus className="w-4 h-4 text-secondary" /> Material de Estudio (PDF)
                                </label>
                                <input
                                    type="file"
                                    id="theme-pdf-upload"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleThemePDFUpload}
                                />
                                <div
                                    onClick={() => document.getElementById('theme-pdf-upload')?.click()}
                                    className="border-2 border-dashed border-border/40 rounded-xl p-6 flex flex-col items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer group"
                                >
                                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-secondary mb-2 transition-colors" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {theme.fileUrl ? "PDF Cargado (Haga clic para cambiar)" : "Arrastra el archivo PDF del tema"}
                                    </p>
                                    <p className="text-[10px] text-slate-600 mt-1">Máximo 10MB • Solo formato PDF</p>
                                </div>
                            </div>
                            <Button
                                onClick={async () => {
                                    setIsSaving(true);
                                    try {
                                        await saveThemeToCloud(theme);
                                        setIsSaving(false);
                                    } catch (e) {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={isSaving}
                                className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-black font-black uppercase italic tracking-widest py-6 shadow-lg active:scale-[0.98] transition-all"
                            >
                                <Save className="w-4 h-4 mr-2" /> Guardar Cambios del Tema
                            </Button>
                        </div>

                        {/* Calendar Highlights */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-bold text-primary border-b border-primary/10 pb-2">Resaltados del Calendario</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium block">Domingos</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={calendarStyles.sundayColor}
                                            onChange={(e) => setCalendarStyles({ sundayColor: e.target.value })}
                                            className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
                                        />
                                        <Input
                                            value={calendarStyles.sundayColor}
                                            onChange={(e) => setCalendarStyles({ sundayColor: e.target.value })}
                                            className="bg-foreground/5 border-border/40 text-xs h-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium block">Jueves</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={calendarStyles.thursdayColor}
                                            onChange={(e) => setCalendarStyles({ thursdayColor: e.target.value })}
                                            className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
                                        />
                                        <Input
                                            value={calendarStyles.thursdayColor}
                                            onChange={(e) => setCalendarStyles({ thursdayColor: e.target.value })}
                                            className="bg-foreground/5 border-border/40 text-xs h-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium block">Día 14 (Recordación)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={calendarStyles.special14thColor}
                                            onChange={(e) => setCalendarStyles({ special14thColor: e.target.value })}
                                            className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
                                        />
                                        <Input
                                            value={calendarStyles.special14thColor}
                                            onChange={(e) => setCalendarStyles({ special14thColor: e.target.value })}
                                            className="bg-foreground/5 border-border/40 text-xs h-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-sm font-medium mb-1 block">Título Día 14</label>
                                <Input
                                    value={specialEventTitle}
                                    onChange={(e) => setSpecialEventTitle(e.target.value)}
                                    className="bg-foreground/5 border-border/40 text-foreground"
                                    placeholder="Ej: Historia Recordación"
                                />
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 border border-border/40 mt-6">
                                <div className="flex-1">
                                    <h4 className="font-bold text-foreground">Efecto de Vidrio (Glassmorphism)</h4>
                                    <p className="text-xs text-muted-foreground">Añade reflejo diagonal y lustre sutil a los días.</p>
                                </div>
                                <Button
                                    variant={calendarStyles.showGlassEffect ? "neon" : "outline"}
                                    onClick={() => setCalendarStyles({ showGlassEffect: !calendarStyles.showGlassEffect })}
                                >
                                    {calendarStyles.showGlassEffect ? "Activado" : "Desactivado"}
                                </Button>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-border/40">
                                <h3 className="text-lg font-bold text-foreground">Tipografía del Sistema</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {['outfit', 'sora', 'inter'].map((font) => (
                                        <Button
                                            key={font}
                                            variant={calendarStyles.fontFamily === font ? "neon" : "outline"}
                                            onClick={() => setCalendarStyles({ fontFamily: font as any })}
                                            className="capitalize"
                                            style={{ fontFamily: font === 'sora' ? 'var(--font-sora)' : font === 'inter' ? 'var(--font-inter)' : 'var(--font-outfit)' }}
                                        >
                                            {font}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Cambia la fuente de toda la aplicación. **Outfit** es geométrica, **Sora** es futurista y **Inter** es clásica.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 glass-card border-t-4 border-t-amber-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" /> Anuncios Dinámicos
                        </CardTitle>
                        <CardDescription>Comunicados que aparecerán en la pantalla principal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {announcements.map((ann) => (
                                <div key={ann.id} className={cn(
                                    "p-3 rounded-xl border relative group transition-all",
                                    ann.priority > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-foreground/5 border-border/40"
                                )}>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => removeAnnouncement(ann.id)}
                                            className="p-1 hover:text-rose-500"
                                            title="Eliminar anuncio"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {ann.priority > 0 && (
                                        <p className="text-[10px] font-black uppercase text-amber-500 mb-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Prioridad Alta
                                        </p>
                                    )}
                                    <h4 className="text-sm font-bold text-foreground uppercase italic">{ann.title}</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-medium mt-1">{ann.content}</p>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <p className="text-center text-xs text-slate-500 py-8 italic uppercase tracking-widest">No hay anuncios activos</p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border/40 space-y-3">
                            <Input
                                value={newAnn.title}
                                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                                placeholder="Título del nuevo anuncio"
                                className="bg-foreground/5 border-border/40 h-8 text-xs font-bold"
                            />
                            <Input
                                value={newAnn.content}
                                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                placeholder="Contenido o descripción corta"
                                className="bg-foreground/5 border-border/40 h-8 text-xs"
                            />
                            <Button
                                onClick={() => {
                                    if (newAnn.title && newAnn.content) {
                                        addAnnouncement({
                                            id: Math.random().toString(36).substr(2, 9),
                                            title: newAnn.title,
                                            content: newAnn.content,
                                            timestamp: new Date().toISOString(),
                                            active: true,
                                            priority: 0
                                        });
                                        setNewAnn({ title: '', content: '', priority: 0 });
                                    }
                                }}
                                variant="outline"
                                className="w-full border-dashed border-white/20 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 text-[10px] font-black uppercase tracking-widest"
                            >
                                + Publicar Anuncio
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gestión de Coros y Uniformes */}
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
                                            <span className="text-sm font-bold text-foreground uppercase italic tracking-tighter">{u.name}</span>
                                            <span className={cn(
                                                "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                                u.category === 'Adulto' ? "bg-secondary/20 text-secondary" : "bg-cyan-500/20 text-cyan-400"
                                            )}>{u.category}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium">{u.description}</p>
                                    </div>
                                    <button
                                        onClick={() => removeUniform(u.id)}
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
                                        onClick={() => {
                                            if (newUniform.name) {
                                                addUniform({
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    name: newUniform.name,
                                                    description: 'Nuevo uniforme añadido.',
                                                    category: newUniform.category
                                                });
                                                setNewUniform({ name: '', category: 'Adulto' });
                                            }
                                        }}
                                        className="h-8 text-[10px] font-black uppercase bg-secondary hover:bg-secondary/80 flex-1"
                                    >
                                        Agregar
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
                        <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-lg border border-white/5">
                            <Calendar className="w-3.5 h-3.5 text-cyan-500 opacity-50" />
                            <span className="text-xs font-bold text-foreground uppercase italic">{format(parseISO(currentDate), "PPP", { locale: es })}</span>
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
                                        onChange={(e) => setUniformForDate(currentDate, e.target.value)}
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
                                <p className="text-[9px] text-slate-500 mt-6 uppercase font-bold text-center border-t border-white/5 pt-4">
                                    Estas asignaciones aparecen automáticamente en el **Panel del Corito** y para el **Responsable de Asistencia**.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card id="configuracion" className="glass-card mt-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-black uppercase">
                            Configuración del Sistema
                        </CardTitle>
                    </div>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-2 h-9 text-[10px]"
                        onClick={async () => {
                            setIsSaving(true);
                            await saveSettingsToCloud(settings);
                            setIsSaving(false);
                        }}
                        disabled={isSaving}
                    >
                        <Save className="w-3.5 h-3.5" /> Guardar Configuración
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Icono de la Iglesia */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Icono de Identidad</h3>
                            <div className="grid grid-cols-6 gap-2">
                                {(['flame', 'church', 'cross', 'star', 'heart'] as const).map((iconKey) => {
                                    const icons = { flame: Flame, church: Church, cross: Cross, star: Star, heart: Heart };
                                    const IconComp = icons[iconKey];
                                    return (
                                        <Button
                                            key={iconKey}
                                            variant={settings.churchIcon === iconKey ? "neon" : "outline"}
                                            className="h-12 w-full"
                                            onClick={() => setSettings({ churchIcon: iconKey })}
                                        >
                                            <IconComp className="h-5 w-5" />
                                        </Button>
                                    );
                                })}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="icon-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleIconUpload}
                                    />
                                    <Button
                                        variant={settings.churchIcon === 'custom' ? "neon" : "outline"}
                                        className="h-12 w-full p-0 overflow-hidden relative group"
                                        onClick={() => document.getElementById('icon-upload')?.click()}
                                    >
                                        {settings.customIconUrl ? (
                                            <>
                                                <img src={settings.customIconUrl} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-4 h-4 text-foreground" />
                                                </div>
                                            </>
                                        ) : (
                                            <Upload className="h-5 w-5" />
                                        )}
                                    </Button>
                                    {settings.customIconUrl && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSettings({ customIconUrl: undefined, churchIcon: 'flame' });
                                            }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="w-3 h-3 text-foreground" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modo de Tema */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Modo de Apariencia</h4>
                            <div className="relative">
                                {settings.themeMode === 'light' ? <Sun className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" /> :
                                    settings.themeMode === 'dark' ? <Moon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" /> :
                                        <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                                <select
                                    value={settings.themeMode}
                                    onChange={(e) => setSettings({ themeMode: e.target.value as any })}
                                    className="w-full bg-foreground/5 border border-border/40 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest text-foreground appearance-none cursor-pointer hover:bg-foreground/10 transition-all outline-none"
                                >
                                    <option value="light" className="bg-[#0f172a]">Modo Claro (Fondo Blanco)</option>
                                    <option value="dark" className="bg-[#0f172a]">Modo Oscuro (Fondo Galaxia)</option>
                                    <option value="system" className="bg-[#0f172a]">Sincronizar con el Sistema</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Ficha del Ministro Responsable */}
                    <div className="pt-8 border-t border-border/40">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-black uppercase text-foreground italic">Ministro Responsable</h3>
                                    </div>
                                    <div className="flex items-center gap-4 bg-foreground/5 px-4 py-2 rounded-xl border border-border/40">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Mostrar en Pantalla</span>
                                        <Button
                                            variant={settings.showMinisterOnDisplay ? "neon" : "outline"}
                                            size="sm"
                                            className="h-7 text-[9px]"
                                            onClick={() => setSettings({ showMinisterOnDisplay: !settings.showMinisterOnDisplay })}
                                        >
                                            {settings.showMinisterOnDisplay ? "ACTIVADO" : "DESACTIVADO"}
                                        </Button>
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-2 h-7 text-[9px]"
                                            onClick={async () => {
                                                setIsSaving(true);
                                                // Minister data is saved via app settings, not profiles
                                                setMinister(minister);
                                                setIsSaving(false);
                                            }}
                                            disabled={isSaving}
                                        >
                                            <Save className="w-3 h-3" /> GUARDAR
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Nombre Completo y Grado</label>
                                            <Input
                                                value={minister.name}
                                                onChange={(e) => setMinister({ name: e.target.value })}
                                                className="bg-foreground/5 border-border/40 text-foreground font-bold"
                                                placeholder="Ej. P.E. Benjamin Rojas"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Teléfono de Contacto</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    value={minister.phone}
                                                    onChange={(e) => setMinister({ phone: e.target.value })}
                                                    className="bg-foreground/5 border-border/40 text-foreground pl-10"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Correo Electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    value={minister.email}
                                                    onChange={(e) => setMinister({ email: e.target.value })}
                                                    className="bg-foreground/5 border-border/40 text-foreground pl-10"
                                                    placeholder="contacto@lldmrodeo.org"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center p-6 bg-foreground/5 rounded-3xl border border-border/40 relative group">
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl relative">
                                            <img src={minister.avatar} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => document.getElementById('minister-photo-upload')?.click()}>
                                                <Camera className="w-8 h-8 text-foreground" />
                                            </div>
                                        </div>
                                        <input
                                            id="minister-photo-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setImageToEdit(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] font-black uppercase text-slate-500 mt-4 tracking-widest">Foto del Ministro</p>
                                        <p className="text-[8px] text-slate-600 mt-1 uppercase italic">Esta foto aparecerá en la cartelera digital</p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:block w-px bg-foreground/5" />
                            <div className="lg:w-1/3 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center">
                                <h4 className="text-xs font-black uppercase text-primary mb-4 text-center">Información de Contacto</h4>
                                <p className="text-xs text-slate-400 leading-relaxed text-center italic">
                                    "Esta información es vital para que la congregación pueda comunicarse con el ministro responsable para consejería, trámites o cualquier necesidad espiritual."
                                </p>
                                <div className="mt-6 p-4 bg-foreground/5 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-foreground">{minister.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-foreground truncate">{minister.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ======= GESTIÓN DE MIEMBROS ======= */}
            <Card id="miembros" className="glass-card mt-8 border-t-4 border-t-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-500" />
                        <CardTitle className="text-xl font-black uppercase">
                            Gestión de Miembros ({members.length})
                        </CardTitle>
                    </div>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-2 h-9 text-[10px]"
                        onClick={() => setShowAddMember(!showAddMember)}
                    >
                        <UserPlus className="w-3.5 h-3.5" /> {showAddMember ? 'Cancelar' : 'Pre-Registrar Miembro'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Formulario de Nuevo Miembro */}
                    {showAddMember && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4"
                        >
                            <h4 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Pre-Registrar Nuevo Miembro
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Al pre-registrar un miembro, este aparecerá en el directorio y podrá ser asignado a servicios.
                                Si agregas su Gmail, cuando esa persona inicie sesión con Google se vinculará automáticamente.
                                Si no tiene correo (ej: un anciano), solo déjalo vacío — quedará registrado de todos modos.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Nombre Completo *</label>
                                    <Input
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="Ej: María López"
                                        className="bg-foreground/5 border-border/40 h-9 text-xs font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Email (Opcional)</label>
                                    <Input
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                        placeholder="ejemplo@gmail.com (si tiene)"
                                        className="bg-foreground/5 border-border/40 h-9 text-xs font-bold"
                                        type="email"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Teléfono</label>
                                    <Input
                                        value={newMember.phone}
                                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                        className="bg-foreground/5 border-border/40 h-9 text-xs font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Rol</label>
                                    <select
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                        className="w-full bg-foreground/5 border border-border/40 rounded-md h-9 px-3 text-xs font-bold text-foreground outline-none"
                                    >
                                        <option value="Miembro" className="bg-[#0f172a]">Miembro</option>
                                        <option value="Responsable" className="bg-[#0f172a]">Responsable</option>
                                        <option value="Administrador" className="bg-[#0f172a]">Administrador</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Categoría</label>
                                    <select
                                        value={newMember.category}
                                        onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                                        className="w-full bg-foreground/5 border border-border/40 rounded-md h-9 px-3 text-xs font-bold text-foreground outline-none"
                                    >
                                        <option value="Varon" className="bg-[#0f172a]">Varón</option>
                                        <option value="Hermana" className="bg-[#0f172a]">Hermana</option>
                                        <option value="Niño" className="bg-[#0f172a]">Niño</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Grupo</label>
                                    <select
                                        value={newMember.member_group}
                                        onChange={(e) => setNewMember({ ...newMember, member_group: e.target.value })}
                                        className="w-full bg-foreground/5 border border-border/40 rounded-md h-9 px-3 text-xs font-bold text-foreground outline-none"
                                    >
                                        <option value="" className="bg-[#0f172a]">Sin grupo</option>
                                        <option value="Casados" className="bg-[#0f172a]">Casados</option>
                                        <option value="Solteros" className="bg-[#0f172a]">Solteros</option>
                                        <option value="Jóvenes" className="bg-[#0f172a]">Jóvenes</option>
                                        <option value="Niños" className="bg-[#0f172a]">Niños</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    className="h-9 text-[10px] font-black uppercase"
                                    onClick={() => {
                                        setShowAddMember(false);
                                        setNewMember({ name: '', email: '', phone: '', role: 'Miembro', gender: 'Varon', category: 'Varon', member_group: '' });
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-2 h-9 text-[10px]"
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
                                    <UserPlus className="w-3.5 h-3.5" /> {isSaving ? 'Registrando...' : 'Registrar Miembro'}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Lista de Miembros */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {members.length === 0 ? (
                            <p className="text-center text-xs text-slate-500 py-12 italic uppercase tracking-widest">No hay miembros registrados</p>
                        ) : (
                            members.map((m) => (
                                <div key={m.id} className={cn(
                                    "p-4 rounded-xl border transition-all group",
                                    m.is_pre_registered
                                        ? "bg-amber-500/5 border-amber-500/20"
                                        : "bg-foreground/5 border-border/40 hover:border-emerald-500/30"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
                                            {m.avatar ? (
                                                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-primary/60" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground truncate">{m.name}</span>
                                                {m.is_pre_registered && (
                                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">Pre-Registrado</span>
                                                )}
                                                {!m.is_pre_registered && (
                                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase flex items-center gap-0.5">
                                                        <UserCheck className="w-2.5 h-2.5" /> Vinculado
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[10px] text-slate-400">{m.email || 'Sin email'}</span>
                                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{m.role}</span>
                                                <span className="text-[8px] text-slate-500 uppercase">{m.category} · {m.member_group || 'Sin grupo'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingMemberId === m.id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={editingRole}
                                                        onChange={(e) => setEditingRole(e.target.value)}
                                                        className="bg-foreground/10 border border-border/40 rounded h-8 px-2 text-[10px] font-bold text-foreground outline-none"
                                                    >
                                                        <option value="Miembro" className="bg-[#0f172a]">Miembro</option>
                                                        <option value="Responsable" className="bg-[#0f172a]">Responsable</option>
                                                        <option value="Administrador" className="bg-[#0f172a]">Administrador</option>
                                                    </select>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 bg-emerald-600 text-white text-[10px] font-black"
                                                        onClick={async () => {
                                                            await updateProfileInCloud(m.id, { role: editingRole as any });
                                                            await loadMembersFromCloud();
                                                            setEditingMemberId(null);
                                                        }}
                                                    >
                                                        <Save className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-[10px]"
                                                        onClick={() => setEditingMemberId(null)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingMemberId(m.id);
                                                            setEditingRole(m.role);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                        title="Cambiar rol"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`¿Eliminar a ${m.name}? Esta acción no se puede deshacer.`)) {
                                                                await deleteMemberFromCloud(m.id);
                                                                await loadMembersFromCloud();
                                                            }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Eliminar miembro"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Nota informativa */}
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[10px] text-blue-300 font-bold uppercase leading-relaxed">
                            💡 <strong>¿Cómo funciona?</strong> Tú pre-registras al miembro con su Gmail. Cuando esa persona abra la app e inicie sesión con Google, su cuenta se vinculará automáticamente al perfil que creaste, con el rol y datos que ya configuraste.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {imageToEdit && (
                <ImageEditor
                    image={imageToEdit}
                    onSave={async (croppedDataUrl) => {
                        setIsSaving(true);
                        try {
                            // Convert dataUrl to File
                            const res = await fetch(croppedDataUrl);
                            const blob = await res.blob();
                            const file = new File([blob], "minister-avatar.jpg", { type: "image/jpeg" });

                            const publicUrl = await uploadAvatar('minister', file);
                            if (publicUrl) {
                                const updatedMinister = { ...minister, avatar: publicUrl };
                                setMinister(updatedMinister);
                            }
                        } catch (err) {
                            console.error("Error saving cropped avatar:", err);
                        } finally {
                            setIsSaving(false);
                            setImageToEdit(null);
                        }
                    }}
                    onCancel={() => setImageToEdit(null)}
                />
            )}
        </div >
    );
}
