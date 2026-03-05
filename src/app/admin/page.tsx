'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar, Users, User, FileText, Settings, ExternalLink,
    Sun, Moon, Monitor, Church, Cross, Star, Heart, Shield,
    Upload, X, ChevronDown, Bell, FilePlus, AlertCircle, Save, Trash2,
    ChevronLeft, ChevronRight, Shirt, Music2, Baby, Briefcase, Mail, Phone, Camera, Search,
    Languages, Globe, CheckCircle, Send, Reply, UserPlus, Edit2, UserCheck, Crown, BadgeCheck,
    Sparkles, CalendarDays, CalendarClock, Megaphone, TrendingUp, Activity, LayoutDashboard, Clock, Target,
    Lock, ArrowRight
} from "lucide-react";
import Link from 'next/link';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CitySearch } from '@/components/CitySearch';
import { ImageEditor } from '@/components/ImageEditor';
import { CountdownCard } from '@/components/CountdownCard';
import { ALL_THEMES } from '@/themes';
import TactileAdmin from './TactileAdmin';

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
        ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
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
                                <div className="py-8 text-center text-xs text-muted-foreground italic">
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
                const target = parseISO(settings.countdownDate!);
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
                <div className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase italic">Desactivado</div>
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
        saveRecurringScheduleToCloud,
        seedMonthSchedule,
        subscribeToMessages,
        authSession
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
    const [activeTab, setActiveTab] = useState('dashboard');
    const [memberFilter, setMemberFilter] = useState('all');

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

        // Handle URL Hash for Tabs
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validTabs = ['dashboard', 'horarios', 'contenido', 'anuncios', 'coros', 'configuracion', 'miembros'];

            // Map specific element IDs to their parent tabs if necessary
            const idToTabMap: Record<string, string> = {
                'mensajes': 'dashboard',
                'anuncios-resumen': 'dashboard',
                'horarios': 'horarios'
            };

            if (hash && validTabs.includes(hash)) {
                setActiveTab(hash);
            } else if (hash && idToTabMap[hash]) {
                setActiveTab(idToTabMap[hash]);
            } else if (!hash) {
                setActiveTab('dashboard');
            }
        };

        handleHashChange(); // Initial check
        window.addEventListener('hashchange', handleHashChange);

        // Suscribirse a mensajes nuevos en tiempo real
        const unsubscribe = subscribeToMessages();
        return () => {
            unsubscribe();
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [currentDate, loadAnnouncementsFromCloud, loadDayScheduleFromCloud, loadAllSchedulesFromCloud, loadThemeFromCloud, loadUniformsFromCloud, loadKidsAssignmentsFromCloud, loadSettingsFromCloud, loadMembersFromCloud, loadCloudMessages, subscribeToMessages]);

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
                    alert('✅ PDF del tema subido y guardado.');
                }
            } catch (error) {
                console.error("Error uploading PDF:", error);
                alert('❌ Error al subir el PDF.');
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
                const publicUrl = await uploadAvatar('minister', file);
                if (publicUrl) {
                    setMinister({ ...minister, avatar: publicUrl });
                    // Si el ministro tiene un ID real en el sistema, actualizamos su perfil
                    if (minister.id && !minister.id.includes('mock')) {
                        await updateProfileInCloud(minister.id, { avatar: publicUrl });
                    }
                    alert('✅ Foto del ministro actualizada.');
                }
            } catch (error) {
                console.error("Error uploading avatar:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };
    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings({
                    churchIcon: 'custom',
                    customIconUrl: reader.result as string,
                    churchLogoUrl: undefined
                });
            };
            reader.readAsDataURL(file);
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
            alert("⚠️ Selecciona un hermano de la lista desplegable antes de usar la repetición. No se pueden repetir nombres escritos manualmente.");
            return;
        }

        setIsSaving(true);
        try {
            await saveRecurringScheduleToCloud(currentDate, slot, leaderIdOrName, recurrence);
            alert('✅ Programación recurrente guardada con éxito.');
        } catch (e) {
            console.error(e);
            alert('❌ Error al guardar la programación.');
        } finally {
            setIsSaving(false);
        }
    };

    const memberOptions = useMemo(() => {
        const base = [{ value: '', label: 'Sin asignar' }];
        const groups = [
            { id: 'Casados', label: 'CASADOS' },
            { id: 'Solos y Solas', label: 'SOLOS Y SOLAS' },
            { id: 'Jóvenes', label: 'JÓVENES' },
            { id: 'Niños', label: 'NIÑOS' },
            { id: 'other', label: 'OTROS / SIN GRUPO' }
        ];

        let groupedItems: any[] = [];

        groups.forEach(group => {
            const groupMembers = members.filter(m =>
                group.id === 'other'
                    ? (!m.member_group || !groups.map(g => g.id).includes(m.member_group))
                    : m.member_group === group.id
            ).sort((a, b) => a.name.localeCompare(b.name));

            if (groupMembers.length > 0) {
                groupedItems.push({ value: `header-${group.id}`, label: group.label, isHeader: true });
                groupMembers.forEach(m => {
                    groupedItems.push({ value: m.id, label: m.name });
                });
            }
        });

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

    if (!mounted) return null;

    // 🔒 PROTECCIÓN: Solo administradores autenticados
    const isAuthorized = authSession?.user && currentUser.role === 'Administrador';

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
                    <Card className="glass-card border-white/5 shadow-2xl overflow-hidden backdrop-blur-2xl">
                        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />
                        <CardHeader className="text-center pt-10 pb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/5">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic text-foreground mb-2">
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
                                        <Button className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 group shadow-xl shadow-primary/20">
                                            Ir al Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Usuario Activo</p>
                                        <p className="text-sm font-bold text-foreground">{authSession.user.email}</p>
                                        <p className="text-[9px] text-red-400 font-black uppercase mt-2 italic">Sin permisos de administrador</p>
                                    </div>
                                    <Link href="/" className="block">
                                        <Button variant="outline" className="w-full h-12 border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
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

    if (settings.adminTheme === 'tactile') {
        return <TactileAdmin />;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-start pt-4">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-foreground">Panel <span className="text-primary italic">General</span></h1>
                    <p className="text-slate-400 font-medium tracking-tight">Gestión administrativa y métricas en tiempo real</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language and Theme Selectors - Moved here */}
                    <div className="flex items-center gap-4 bg-foreground/[0.03] p-1.5 px-3 rounded-2xl border border-border/10 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-4 px-2">
                            <div className="flex items-center gap-2">
                                <Languages className="w-3.5 h-3.5 text-primary/70" />
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ language: e.target.value as any })}
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-muted-foreground appearance-none cursor-pointer outline-none hover:text-primary transition-colors"
                                >
                                    <option value="es" className="bg-background">ES</option>
                                    <option value="en" className="bg-background">EN</option>
                                </select>
                            </div>
                            <div className="w-px h-4 bg-border/20" />
                            <div className="flex items-center gap-2">
                                {settings.themeMode === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-primary" />}
                                <select
                                    value={settings.themeMode}
                                    onChange={(e) => setSettings({ themeMode: e.target.value as any })}
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-400 appearance-none cursor-pointer outline-none hover:text-primary transition-colors"
                                >
                                    <option value="light" className="bg-[#020617]">Modo Claro</option>
                                    <option value="dark" className="bg-[#020617]">Modo Oscuro</option>
                                    <option value="system" className="bg-[#020617]">Sistema</option>
                                </select>
                            </div>
                            <div className="w-px h-4 bg-border/20" />
                            <button
                                onClick={() => setSettings({ adminTheme: 'tactile' })}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors pr-2"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-foreground/[0.03] backdrop-blur-xl p-2 px-4 rounded-2xl border border-border/10 shadow-2xl">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping" />
                        </div>
                        <div className="w-px h-6 bg-border/20 mx-2" />
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('configuracion')}>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrador</p>
                                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">LLDM Rodeo</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden group-hover:border-primary transition-all">
                                <img src={minister.avatar} className="w-full h-full object-cover rounded-full" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-foreground/[0.03] p-1 px-2 rounded-2xl border border-border/10 backdrop-blur-md">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDay(-1)}
                        className="h-9 w-9 hover:bg-white/5 rounded-xl text-slate-400 hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="px-6 py-1 text-xs font-black uppercase tracking-[0.2em] border-x border-white/5 min-w-[160px] text-center text-slate-300">
                        {new Date(currentDate + 'T12:00:00').toLocaleDateString(settings.language === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDay(1)}
                        className="h-9 w-9 hover:bg-white/5 rounded-xl text-slate-400 hover:text-foreground transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                <Link href="/display" target="_blank">
                    <Button className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest">
                        <ExternalLink className="h-4 w-4" />
                        Abrir Pizarra
                    </Button>
                </Link>
            </div>

            {/* Countdown and Stats Section */}
            <div className="space-y-8">

                {/* Stats Cards Section - Always Visible */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                >
                    {/* Daily Attendance Donut Chart */}
                    <Card className="glass-card bg-slate-900/40 dark:bg-slate-900/40 light:bg-white border-white/5 light:border-slate-200 relative overflow-hidden group shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Asistencia Diaria
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-8">
                                <div className="relative w-32 h-32 shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-800" />
                                        <motion.circle
                                            cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="10"
                                            strokeDasharray="251.2"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 - (251.2 * 0.57) }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                                        <span className="text-3xl font-black text-foreground italic drop-shadow-sm">57%</span>
                                    </div>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <div className="text-2xl font-black text-foreground italic">4/7 <span className="text-xs font-bold text-slate-500 not-italic uppercase ml-1">tareas</span></div>
                                        <p className="text-[11px] text-slate-400 font-medium leading-tight">400/700 Miembros<br />confirmados para hoy</p>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "57%" }} className="h-full bg-primary" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Member Growth Mountain Chart */}
                    <Card className="glass-card bg-slate-900/40 dark:bg-slate-900/40 light:bg-white border-white/5 light:border-slate-200 relative overflow-hidden group shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-secondary" />
                                Crecimiento de Miembros
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 flex flex-col h-full">
                            <div className="flex-1 min-h-[100px] relative mb-4">
                                <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="mountGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <motion.path d="M0,80 Q50,40 100,70 T200,80 T300,50 T400,30 V120 H0 Z" fill="url(#mountGrad)" />
                                    <motion.path d="M0,80 Q50,40 100,70 T200,80 T300,50 T400,30" fill="none" stroke="var(--secondary)" strokeWidth="3" />
                                </svg>
                            </div>
                            <div className="flex items-end justify-between relative z-10 mt-auto pt-2">
                                <div>
                                    <div className="text-4xl font-black text-foreground italic">+{members.length > 0 ? members.length : 128}</div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 italic">Este mes</p>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black italic border border-emerald-500/30 backdrop-blur-md shadow-lg">+12.5%</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consistency Streak */}
                    <Card className="glass-card bg-slate-900/40 dark:bg-slate-900/40 light:bg-white border-white/5 light:border-slate-200 relative overflow-hidden group shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Consistencia</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 flex flex-col items-center justify-center text-center h-full relative z-10">
                            <div className="text-8xl font-black tracking-tighter bg-gradient-to-b from-orange-400 via-amber-500 to-orange-600 dark:from-white dark:via-amber-100 dark:to-amber-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(245,158,11,0.2)]">12</div>
                            <div className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-orange-500 italic">Días de Racha</div>
                            <div className="flex gap-2 mt-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={cn("w-2.5 h-2.5 rounded-full", i <= 4 ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "bg-white/5")} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* New Mini Countdown Card - Integrated into Grid */}
                    <Card className="glass-card bg-slate-900/40 border-white/5 light:border-slate-200 relative overflow-hidden group shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                {settings.countdownTitle || 'Evento'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 h-full">
                            <div className="flex flex-col items-center justify-center text-center">
                                <MiniCountdown />
                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                    {settings.countdownDate ? format(parseISO(settings.countdownDate), 'd MMM, yyyy', { locale: es }) : '---'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Announcements Stat */}
                    <Card className="glass-card bg-slate-900/40 dark:bg-slate-900/40 light:bg-white border-white/5 light:border-slate-200 relative overflow-hidden group shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Comunicados</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 flex flex-col items-center justify-center text-center h-full relative z-10">
                            <div className="text-6xl font-black text-orange-500 italic tabular-nums drop-shadow-sm">{announcements.length}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 italic">Anuncios Activos</div>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-foreground/5 rounded-3xl border border-white/5 overflow-x-auto no-scrollbar backdrop-blur-md sticky top-4 z-40">
                {[
                    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, color: 'text-primary' },
                    { id: 'horarios', label: 'Horarios', icon: CalendarDays, color: 'text-emerald-500' },
                    { id: 'contenido', label: 'Temas y Estilos', icon: Sparkles, color: 'text-amber-500' },
                    { id: 'anuncios', label: 'Anuncios', icon: Megaphone, color: 'text-orange-500' },
                    { id: 'coros', label: 'Coros y Uniformes', icon: Shirt, color: 'text-secondary' },
                    { id: 'configuracion', label: 'Configuración', icon: Settings, color: 'text-slate-400' },
                    { id: 'miembros', label: 'Miembros', icon: Users, color: 'text-emerald-400' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap group",
                            activeTab === tab.id ? "text-foreground bg-foreground/10 shadow-lg" : "text-slate-500 hover:text-slate-300 hover:bg-foreground/5"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === tab.id ? tab.color : "text-slate-500")} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTabGlow" className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                        )}
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTabUnderline" className={cn("absolute -bottom-1.5 left-4 right-4 h-1 rounded-full", tab.color.replace('text-', 'bg-'))} />
                        )}
                    </button>
                ))}
            </div>

            {
                activeTab === 'dashboard' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div id="mensajes">
                                <MessagesPanel
                                    messages={messages}
                                    onMarkRead={markMessageAsRead}
                                    onReply={async (recipientId, content) => {
                                        await sendCloudMessage({ senderId: currentUser.id, receiverId: recipientId, content, subject: 'Respuesta de Administración' });
                                        alert('Respuesta enviada');
                                    }}
                                />
                            </div>
                            <div id="anuncios-resumen" className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black uppercase text-orange-500 italic flex items-center gap-2">
                                            <Megaphone className="w-5 h-5" /> Anuncios Activos
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('anuncios')} className="text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 text-orange-500">
                                            Ver Todos
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {announcements.filter(a => a.active).slice(0, 3).map(ann => (
                                            <div key={ann.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                                                <h4 className="text-xs font-black uppercase text-foreground italic">{ann.title}</h4>
                                                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{ann.content}</p>
                                            </div>
                                        ))}
                                        {announcements.length === 0 && (
                                            <div className="py-8 text-center text-xs text-slate-500 italic uppercase">No hay anuncios activos</div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => setActiveTab('anuncios')}
                                        className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-xl py-6 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        + Crear Nuevo Anuncio
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }

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
                                        Programación: <span className="text-primary italic">{format(parseISO(currentDate), "PPPP", { locale: es })}</span>
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
                                                    className="bg-transparent border-b border-white/20 px-1 py-0.5 text-2xl text-blue-400 w-28 font-sans focus:outline-none focus:border-blue-400 tracking-normal"
                                                    value={currentDaySchedule?.slots['5am']?.time || '05:00 AM'}
                                                    onChange={(e) => updateSlot('5am', { time: e.target.value })}
                                                />
                                                <span className="text-xs text-blue-400/50 uppercase">al</span>
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/20 px-1 py-0.5 text-lg text-blue-400 w-24 font-sans focus:outline-none focus:border-blue-400 tracking-normal placeholder:text-blue-400/30"
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
                                                    className="bg-transparent border-b border-white/20 px-1 py-0.5 text-2xl text-yellow-400 w-28 font-sans focus:outline-none focus:border-yellow-400 tracking-normal"
                                                    value={currentDaySchedule?.slots['9am']?.time || (new Date(currentDate + 'T12:00:00').getDay() === 0 ? '10:00 AM' : '09:00 AM')}
                                                    onChange={(e) => updateSlot('9am', { time: e.target.value })}
                                                />
                                                <span className="text-xs text-yellow-400/50 uppercase">al</span>
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-b border-white/20 px-1 py-0.5 text-lg text-yellow-400 w-24 font-sans focus:outline-none focus:border-yellow-400 tracking-normal placeholder:text-yellow-400/30"
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
                                                    <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
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
                activeTab === 'contenido' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* 1. SECCIÓN: CUENTA REGRESIVA (EVENTO) */}
                        <div className="p-8 rounded-[2.5rem] bg-amber-500/[0.03] border border-amber-500/20 space-y-8 relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CalendarClock className="w-32 h-32 text-amber-500" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase text-amber-500 flex items-center gap-3 italic tracking-tight">
                                        <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30">
                                            <CalendarClock className="w-6 h-6" />
                                        </div>
                                        Evento Memorable (Countdown)
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configura la visibilidad del contador regresivo en la pizarra</p>
                                </div>
                                <div
                                    onClick={() => setSettings({ showCountdown: !settings.showCountdown })}
                                    className={cn(
                                        "w-20 h-10 rounded-2xl p-1.5 cursor-pointer transition-all duration-500 relative shadow-inner",
                                        settings.showCountdown ? "bg-amber-500" : "bg-slate-800"
                                    )}
                                >
                                    <motion.div
                                        animate={{ x: settings.showCountdown ? 40 : 0 }}
                                        className="w-7 h-7 bg-white rounded-xl shadow-lg flex items-center justify-center text-[10px]"
                                    >
                                        {settings.showCountdown ? 'ON' : 'OFF'}
                                    </motion.div>
                                </div>
                            </div>

                            {settings.showCountdown && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4"
                                >
                                    <div className="lg:col-span-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Título del Evento</label>
                                                <Input
                                                    value={settings.countdownTitle || ''}
                                                    onChange={(e) => setSettings({ countdownTitle: e.target.value })}
                                                    placeholder="Ej: 100 Años de Misericordia"
                                                    className="h-14 bg-black/40 border-white/10 rounded-2xl text-sm font-black focus:border-amber-500/50"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha Memorable</label>
                                                <div className="relative group">
                                                    <Input
                                                        type="datetime-local"
                                                        value={settings.countdownDate || ''}
                                                        onChange={(e) => setSettings({ countdownDate: e.target.value })}
                                                        className="h-14 bg-black/40 border-white/10 rounded-2xl text-sm font-black focus:border-amber-500/50 pr-12 appearance-none"
                                                    />
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                                                        <CalendarDays className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Logo del Evento (Opcional)</label>
                                                <div className="flex gap-4">
                                                    <Input
                                                        value={settings.countdownLogoUrl || ''}
                                                        onChange={(e) => setSettings({ countdownLogoUrl: e.target.value })}
                                                        placeholder="URL de la imagen o subir..."
                                                        className="h-12 flex-1 bg-black/40 border-white/10 rounded-xl text-[10px] font-black"
                                                    />
                                                    <input
                                                        type="file"
                                                        id="countdown-logo-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const url = await uploadAvatar('countdown-logo', file);
                                                                if (url) setSettings({ countdownLogoUrl: url });
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        className="h-12 bg-amber-500/10 border-amber-500/30 text-amber-500 rounded-xl px-4 font-black uppercase text-[10px]"
                                                        onClick={() => document.getElementById('countdown-logo-upload')?.click()}
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" /> Subir
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fondo Anuncio</label>
                                                    <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-2xl">
                                                        <input
                                                            type="color"
                                                            value={settings.countdownBgColor || '#ffffff'}
                                                            onChange={(e) => setSettings({ countdownBgColor: e.target.value })}
                                                            className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                                                        />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter tabular-nums">{settings.countdownBgColor || '#FFFFFF'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Color Acento (Oro)</label>
                                                    <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-2xl">
                                                        <input
                                                            type="color"
                                                            value={settings.countdownAccentColor || '#d4af37'}
                                                            onChange={(e) => setSettings({ countdownAccentColor: e.target.value })}
                                                            className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                                                        />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter tabular-nums">{settings.countdownAccentColor || '#D4AF37'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Background Image Upload for Countdown */}
                                        <div className="space-y-6 pt-4 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Imagen de Fondo Ceremonial (Opcional)</label>
                                                    <p className="text-[9px] text-slate-400 italic">Si se sube una imagen, se usará en lugar del color sólido.</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-400 uppercase">1920 x 1080 px</div>
                                                    <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[9px] font-black text-purple-400 uppercase">JPG / PNG / WEBP</div>
                                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black text-emerald-400 uppercase">&lt; 2 MB</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Input
                                                    value={settings.countdownBgImageUrl || ''}
                                                    onChange={(e) => setSettings({ countdownBgImageUrl: e.target.value })}
                                                    placeholder="URL de fondo personalizado..."
                                                    className="h-12 flex-1 bg-black/40 border-white/10 rounded-xl text-[10px] font-black"
                                                />
                                                <input
                                                    type="file"
                                                    id="countdown-bg-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await uploadAvatar('countdown-bg', file);
                                                            if (url) setSettings({ countdownBgImageUrl: url });
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="outline"
                                                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-4 font-black uppercase text-[10px] hover:bg-white/10"
                                                    onClick={() => document.getElementById('countdown-bg-upload')?.click()}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" /> Subir Fondo
                                                </Button>
                                                {settings.countdownBgImageUrl && (
                                                    <Button
                                                        variant="ghost"
                                                        className="h-12 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 px-4 rounded-xl font-black uppercase text-[10px]"
                                                        onClick={() => setSettings({ countdownBgImageUrl: '' })}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 bg-black/20 rounded-[2rem] p-8 border border-white/5 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Previsualización Panel</p>
                                            <div className="scale-125 transform transition-transform">
                                                <MiniCountdown />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 2. SECCIÓN: IDENTIDAD VISUAL (LOGOS CENTRALES) */}
                        <Card className="glass-card border-t-4 border-t-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                    <LayoutDashboard className="h-5 w-5 text-blue-500" /> Identidad Visual
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    Define el imagotipo principal que representa a la iglesia en la pizarra
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { id: 'rodeo', url: '/lldm_rodeo_logo.svg', label: 'Rodeo Oficial', color: 'from-blue-500/10' },
                                        { id: 'santa-cena', url: '/lldm_santa_cena.svg', label: 'Santa Cena', color: 'from-red-500/10' },
                                        { id: 'aniversario', url: '/lldm_aniversario.svg', label: '100 Aniversario', color: 'from-amber-500/10' },
                                        { id: 'oficial', url: '/flama-oficial.svg', label: 'Flama LLDM', color: 'from-slate-500/10' }
                                    ].map((logo) => (
                                        <motion.button
                                            key={logo.id}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSettings({ churchLogoUrl: logo.url, churchIcon: 'custom', customIconUrl: undefined })}
                                            className={cn(
                                                "group relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden",
                                                (settings.churchLogoUrl === logo.url || (logo.id === 'oficial' && settings.churchLogoUrl === '/flama-oficial.svg')) ? "border-primary bg-primary/10 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.2)]" : "border-white/5 bg-foreground/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className={cn("absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500", logo.color, "to-transparent")} />
                                            <div className="relative z-10 w-20 h-20 flex items-center justify-center p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 group-hover:border-white/10 transition-all">
                                                <img src={logo.url} className="w-full h-full object-contain filter drop-shadow-2xl" alt={logo.label} />
                                            </div>
                                            <span className={cn("relative z-10 text-[10px] font-black uppercase tracking-widest transition-colors", (settings.churchLogoUrl === logo.url) ? "text-primary" : "text-slate-500")}>
                                                {logo.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-6 items-center p-6 rounded-3xl bg-foreground/5 border border-white/5">
                                    <div className="flex-1 space-y-4 w-full">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Iconos Rápidos</label>
                                        <div className="flex gap-2 justify-center lg:justify-start">
                                            {(['shield', 'church', 'cross', 'star', 'heart'] as const).map((iconKey) => {
                                                const icons = { shield: Shield, church: Church, cross: Cross, star: Star, heart: Heart };
                                                const IconComp = icons[iconKey];
                                                return (
                                                    <Button
                                                        key={iconKey}
                                                        variant={settings.churchIcon === iconKey ? "neon" : "outline"}
                                                        className="h-10 w-10 p-0 rounded-xl"
                                                        size="icon"
                                                        onClick={() => setSettings({ churchIcon: iconKey, churchLogoUrl: undefined })}
                                                    >
                                                        <IconComp className="h-4 w-4" />
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="hidden lg:block w-px h-12 bg-white/10 mx-4" />
                                    <div className="flex-1 w-full">
                                        <input
                                            type="file"
                                            id="main-logo-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleIconUpload}
                                        />
                                        <Button
                                            variant={settings.churchIcon === 'custom' && !['/lldm_rodeo_logo.svg', '/flama-oficial.svg', '/lldm_aniversario.svg', '/lldm_santa_cena.svg'].includes(settings.churchLogoUrl || '') ? "neon" : "outline"}
                                            className="w-full h-14 gap-3 border-dashed border-primary/30 group px-6 rounded-2xl"
                                            onClick={() => document.getElementById('main-logo-upload')?.click()}
                                        >
                                            {settings.customIconUrl ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border border-white/10 overflow-hidden">
                                                        <img src={settings.customIconUrl} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase">Logo Personalizado</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Upload className="w-5 h-5 text-primary group-hover:animate-bounce" />
                                                    <span className="text-[10px] font-black uppercase">Subir Logo Local</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. SECCIÓN: FONDO Y EFECTOS DEL DISPLAY */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="glass-card border-t-4 border-t-purple-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                        <Monitor className="h-5 w-5 text-purple-500" /> Fondo de Proyección
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Logo de fondo para la pantalla gigante</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { mode: 'official', label: 'Oficial', icon: <img src="/flama-oficial.svg" className="w-8 h-8 invert brightness-150" /> },
                                            { mode: 'custom', label: 'Custom', icon: <Upload className="w-5 h-5" /> },
                                            { mode: 'none', label: 'Limpio', icon: <X className="w-5 h-5" /> }
                                        ].map((bg) => (
                                            <button
                                                key={bg.mode}
                                                onClick={() => {
                                                    if (bg.mode === 'custom' && settings.displayBgMode === 'custom') {
                                                        document.getElementById('display-bg-upload-styling')?.click();
                                                    } else {
                                                        setSettings({ displayBgMode: bg.mode as any });
                                                    }
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all relative group overflow-hidden",
                                                    settings.displayBgMode === bg.mode ? "border-primary bg-primary/10 shadow-lg" : "border-white/5 bg-foreground/5"
                                                )}
                                            >
                                                {bg.mode === 'custom' && settings.displayCustomBgUrl && settings.displayBgMode === 'custom' ? (
                                                    <img src={settings.displayCustomBgUrl} className="w-12 h-12 object-cover rounded-xl border border-white/20" />
                                                ) : (
                                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 border border-white/5">{bg.icon}</div>
                                                )}
                                                <span className="text-[9px] font-black uppercase tracking-widest">{bg.label}</span>
                                                {bg.mode === 'custom' && (
                                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit2 className="w-3 h-3 text-primary" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {settings.displayBgMode === 'custom' && settings.displayCustomBgUrl && (
                                        <div className="flex items-center gap-4 p-3 bg-black/40 border border-white/5 rounded-2xl">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10">
                                                <img src={settings.displayCustomBgUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black uppercase text-slate-400">Imagen Activa</p>
                                                <p className="text-[10px] font-bold text-primary truncate max-w-[150px]">Fondo Personalizado</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-rose-500 hover:bg-rose-500/10"
                                                onClick={() => setSettings({ displayCustomBgUrl: '', displayBgMode: 'official' })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}

                                    <input
                                        id="display-bg-upload-styling"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const publicUrl = await uploadAvatar('display-bg', file);
                                                if (publicUrl) {
                                                    setSettings({
                                                        displayCustomBgUrl: publicUrl,
                                                        displayBgMode: 'custom',
                                                        // Also sync as the main church logo if it's a custom upload
                                                        churchLogoUrl: publicUrl,
                                                        churchIcon: 'custom'
                                                    });
                                                }
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-t-4 border-t-emerald-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                        <Sparkles className="h-5 w-5 text-emerald-500" /> Partículas y Efectos
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dinámica visual del display</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
                                        <Button
                                            variant={settings.displayBgStyle === 'static' ? "neon" : "ghost"}
                                            className="flex-1 h-10 text-[9px] font-black uppercase rounded-xl"
                                            onClick={() => setSettings({ displayBgStyle: 'static' })}
                                        >
                                            Puntos Estáticos
                                        </Button>
                                        <Button
                                            variant={settings.displayBgStyle === 'dynamic' ? "neon" : "ghost"}
                                            className="flex-1 h-10 text-[9px] font-black uppercase rounded-xl"
                                            onClick={() => setSettings({ displayBgStyle: 'dynamic' })}
                                        >
                                            Partículas Animadas
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-white/5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Efecto Cristal (Glassmorphism)</label>
                                            <p className="text-[8px] text-slate-500 font-bold uppercase">Agrega profundidad y reflejos</p>
                                        </div>
                                        <div
                                            onClick={() => setCalendarStyles({ showGlassEffect: !calendarStyles.showGlassEffect })}
                                            className={cn(
                                                "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative",
                                                calendarStyles.showGlassEffect ? "bg-primary" : "bg-slate-700"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: calendarStyles.showGlassEffect ? 24 : 0 }}
                                                className="w-4 h-4 bg-white rounded-full shadow-lg"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 4. SECCIÓN: COLORES Y TIPOGRAFÍA */}
                        <Card className="glass-card border-t-4 border-t-pink-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                    <Sun className="h-5 w-5 text-pink-500" /> Colores y Tipografía Global
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Paleta cromática y fuentes de toda la plataforma</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Color de Marca (Sistema y Display)</label>
                                        <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-2xl border border-white/5">
                                            <div
                                                className="w-14 h-14 rounded-xl border-2 border-white/20 shadow-lg"
                                                style={{ backgroundColor: settings.primaryColor }}
                                            />
                                            <div className="flex-1 flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => setSettings({ primaryColor: e.target.value })}
                                                    className="h-12 w-16 bg-black/40 border-white/10 rounded-xl cursor-pointer p-1"
                                                />
                                                <Input
                                                    value={settings.primaryColor}
                                                    onChange={(e) => setSettings({ primaryColor: e.target.value })}
                                                    className="h-12 flex-1 bg-black/20 border-white/10 rounded-xl text-xs font-black uppercase font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Plantilla Visual Global</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'iglesia', label: '🏛️ Cátedra (Neumórfico)' },
                                                    { id: 'cristal', label: '💎 Cristal (Moderno)' },
                                                    { id: 'minimal', label: '🌑 Minimal (SaaS)' },
                                                    { id: 'nocturno', label: '🌌 Nocturno (Estelar)' },
                                                    { id: 'neon', label: '⚡ Neon (Dinámico)' }
                                                ].map((tmpl) => (
                                                    <button
                                                        key={tmpl.id}
                                                        onClick={() => setCalendarStyles({ template: tmpl.id as any })}
                                                        className={cn(
                                                            "h-12 rounded-xl border-2 font-black uppercase text-[10px] transition-all",
                                                            calendarStyles.template === tmpl.id ? "bg-primary/20 border-primary text-primary" : "bg-foreground/5 border-white/5 text-slate-500"
                                                        )}
                                                    >
                                                        {tmpl.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identidad de Tipografía ({ALL_THEMES[calendarStyles.template]?.name})</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {(ALL_THEMES[calendarStyles.template]?.fontOptions || [
                                                    { primary: 'Outfit', secondary: 'Inter', accent: 'Outfit' }
                                                ]).map((fonts, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCalendarStyles({ fontSetIndex: idx })}
                                                        className={cn(
                                                            "flex flex-col p-3 rounded-xl border-2 transition-all text-left",
                                                            calendarStyles.fontSetIndex === idx || (calendarStyles.fontSetIndex === undefined && idx === 0)
                                                                ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                                                                : "bg-foreground/5 border-white/5 opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[9px] font-black uppercase text-primary">Opción {idx + 1}</span>
                                                            <div className="flex gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                            </div>
                                                        </div>
                                                        <span className={cn("text-sm font-bold truncate", fonts.primary)}>Aa Bb Cc — {fonts.primary.replace('font-', '')}</span>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className={cn("text-[8px] uppercase tracking-tighter opacity-50", fonts.secondary)}>Secondary: {fonts.secondary.replace('font-', '')}</span>
                                                            <span className={cn("text-[8px] uppercase tracking-tighter opacity-50", fonts.accent)}>Accent: {fonts.accent.replace('font-', '')}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── NEON FORGE EXCLUSIVE CONTROLS ── */}
                                {calendarStyles.template === 'neon' && (
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                                                <span>⚡</span> Neon Forge — Variante de Color
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 mt-3">
                                                {[
                                                    { id: 'lime', label: '⚡ Lima', desc: 'Verde Eléctrico + Violeta', accent: '#BBFF00' },
                                                    { id: 'cyan', label: '💠 Cian', desc: 'Azul Neón + Índigo', accent: '#00E5FF' },
                                                    { id: 'amber', label: '🔥 Ámbar', desc: 'Naranja + Rojo', accent: '#FFB800' },
                                                ].map((v) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => setSettings({ neonForgeVariant: v.id as any })}
                                                        className={cn(
                                                            "flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left gap-1",
                                                            (settings.neonForgeVariant || 'lime') === v.id
                                                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                                                                : "border-white/5 bg-foreground/5 opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className="w-6 h-6 rounded-lg mb-1" style={{ background: v.accent }} />
                                                        <span className="text-[11px] font-black uppercase tracking-wide text-foreground">{v.label}</span>
                                                        <span className="text-[9px] text-slate-500">{v.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2 mb-3">
                                                <span>🌤</span> Ciudad para el Clima
                                            </label>
                                            <CitySearch
                                                value={settings.neonForgeCityData || null}
                                                onChange={(city) => setSettings({ neonForgeCityData: city })}
                                                accentColor={
                                                    (settings.neonForgeVariant || 'lime') === 'lime' ? '#BBFF00' :
                                                        (settings.neonForgeVariant || 'lime') === 'cyan' ? '#00E5FF' : '#FFB800'
                                                }
                                            />
                                            <p className="text-[9px] text-slate-600 mt-2 ml-1">
                                                Busca por nombre de ciudad, estado o código postal · Powered by Open-Meteo Geocoding
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* ── AQUA EXCLUSIVE CONTROLS ── */}
                                {calendarStyles.template === 'cristal' && (
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                                                <span>💎</span> Cristal — Variante de Color
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 mt-3">
                                                {[
                                                    { id: 'teal', label: '💠 Zafiro', desc: 'Teal/Cian + Violeta', accent: '#00D4FF' },
                                                    { id: 'violet', label: '💜 Amatista', desc: 'Violeta + Cian', accent: '#A78BFA' },
                                                    { id: 'emerald', label: '💚 Esmeralda', desc: 'Verde + Índigo', accent: '#10B981' },
                                                ].map((v) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => setSettings({ aquaVariant: v.id as any })}
                                                        className={cn(
                                                            "flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left gap-1",
                                                            (settings.aquaVariant || 'teal') === v.id
                                                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                                                                : "border-white/5 bg-foreground/5 opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className="w-6 h-6 rounded-lg mb-1" style={{ background: v.accent }} />
                                                        <span className="text-[11px] font-black uppercase tracking-wide text-foreground">{v.label}</span>
                                                        <span className="text-[9px] text-slate-500">{v.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2 mb-3">
                                                <span>🌤</span> Ciudad para el Clima (Cristal)
                                            </label>
                                            <CitySearch
                                                value={settings.neonForgeCityData || null}
                                                onChange={(city) => setSettings({ neonForgeCityData: city })}
                                                accentColor={(settings.aquaVariant || 'teal') === 'teal' ? '#00D4FF' : (settings.aquaVariant || 'teal') === 'violet' ? '#A78BFA' : '#10B981'}
                                            />
                                            <p className="text-[9px] text-slate-600 mt-2 ml-1">
                                                Busca por nombre de ciudad, estado o código postal · Powered by Open-Meteo Geocoding
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* ── IGLESIA EXCLUSIVE CONTROLS ── */}
                                {calendarStyles.template === 'iglesia' && (
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                                                <span>🏛️</span> Cátedra — Tono de Apariencia
                                            </label>
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                {[
                                                    { id: 'light', label: '☀️ Claro', desc: 'Neumórfico Blanco/Crema', accent: '#EA2A33' },
                                                    { id: 'dark', label: '🌙 Oscuro', desc: 'Neumórfico Carbón/Noche', accent: '#EA2A1F' },
                                                ].map((v) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => setSettings({ iglesiaVariant: v.id as any })}
                                                        className={cn(
                                                            "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left gap-1",
                                                            (settings.iglesiaVariant || 'light') === v.id
                                                                ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(234,42,51,0.15)]"
                                                                : "border-white/5 bg-foreground/5 opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className="w-8 h-8 rounded-xl mb-1 flex items-center justify-center shadow-lg" style={{ background: v.id === 'light' ? '#F8F9FA' : '#1A1B1E' }}>
                                                            <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                                                        </div>
                                                        <span className="text-[12px] font-black uppercase tracking-wide text-foreground">{v.label}</span>
                                                        <span className="text-[10px] text-slate-500">{v.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2 mb-3">
                                                <span>🗺</span> Ubicación del Tablero (Cátedra)
                                            </label>
                                            <CitySearch
                                                value={settings.neonForgeCityData || null}
                                                onChange={(city) => setSettings({ neonForgeCityData: city })}
                                                accentColor="#EA2A33"
                                            />
                                            <p className="text-[9px] text-slate-600 mt-2 ml-1">
                                                Permite mostrar la información meteorológica local en el tema Iglesia.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Colores Calendario */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                    {[
                                        { id: 'sundayColor', label: 'Domingos - Día del Señor', color: calendarStyles.sundayColor },
                                        { id: 'thursdayColor', label: 'Jueves - Oración Especial', color: calendarStyles.thursdayColor },
                                        { id: 'special14thColor', label: 'Días 14 - Recordación', color: calendarStyles.special14thColor }
                                    ].map((field) => (
                                        <div key={field.id} className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{field.label}</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={field.color}
                                                    onChange={(e) => setCalendarStyles({ [field.id]: e.target.value })}
                                                    className="h-10 w-12 bg-black/40 border-white/10 rounded-xl cursor-pointer p-1"
                                                />
                                                <Input
                                                    value={field.color}
                                                    onChange={(e) => setCalendarStyles({ [field.id]: e.target.value })}
                                                    className="h-10 flex-1 bg-black/20 border-white/10 rounded-xl text-[10px] font-black uppercase"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botón de Guardado Unificado */}
                        <div className="flex justify-center pt-8">
                            <Button
                                size="lg"
                                className="h-16 px-16 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all gap-4"
                                onClick={async () => {
                                    setIsSaving(true);
                                    try {
                                        await saveSettingsToCloud(settings);
                                        alert("✅ Todos los temas, estilos y cuenta regresiva han sido guardados correctamente.");
                                    } catch (e) {
                                        alert("❌ Error al persistir los cambios.");
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={isSaving}
                            >
                                <Save className="w-6 h-6" /> {isSaving ? 'GUARDANDO...' : 'APLICAR Y GUARDAR TODO'}
                            </Button>
                        </div>
                    </motion.div>
                )
            }
            {
                activeTab === 'anuncios' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >

                        <Card id="anuncios" className="glass-card border-t-4 border-t-amber-500">

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                    <Megaphone className="h-5 w-5 text-amber-500" /> Panel de Anuncios
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gestión de comunicados para la pantalla principal</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {announcements.map((ann) => (
                                        <div key={ann.id} className={cn(
                                            "p-4 rounded-xl border relative group transition-all",
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
                                        <p className="text-center text-xs text-slate-500 py-12 italic uppercase tracking-widest">No hay anuncios activos</p>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-border/40 space-y-4">
                                    <h4 className="text-xs font-black uppercase text-slate-400">Nuevo Anuncio</h4>
                                    <div className="space-y-3">
                                        <Input
                                            value={newAnn.title}
                                            onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                                            placeholder="Título del nuevo anuncio"
                                            className="bg-foreground/5 border-border/40 h-10 text-xs font-bold"
                                        />
                                        <Input
                                            value={newAnn.content}
                                            onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                            placeholder="Contenido o descripción corta"
                                            className="bg-foreground/5 border-border/40 h-10 text-xs"
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
                                            className="w-full border-dashed border-white/20 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 text-[10px] font-black uppercase tracking-widest h-10"
                                        >
                                            + Publicar Anuncio
                                        </Button>
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
                    </motion.div>
                )
            }

            {
                activeTab === 'configuracion' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <Card id="configuracion" className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter">
                                        Ajustes de Interfaz y Perfil
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
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Modo de Apariencia */}
                                    <div className="space-y-4 p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Sparkles className="w-32 h-32 text-indigo-500" />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-1 flex items-center gap-2">
                                            <Sun className="w-3.5 h-3.5" /> Estilo Visual del Dashboard
                                        </h4>
                                        <div className="relative z-10">
                                            {settings.themeMode === 'light' ? <Sun className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" /> :
                                                settings.themeMode === 'dark' ? <Moon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" /> :
                                                    <Monitor className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
                                            <select
                                                value={settings.themeMode}
                                                onChange={(e) => setSettings({ themeMode: e.target.value as any })}
                                                className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] pl-16 pr-8 py-5 text-sm font-black uppercase tracking-widest text-foreground appearance-none cursor-pointer hover:bg-slate-900/60 transition-all outline-none shadow-xl focus:border-primary/50"
                                            >
                                                <option value="light" className="bg-[#020617] text-white">Modo Claro (Fondo Blanco)</option>
                                                <option value="dark" className="bg-[#020617] text-white">Modo Oscuro (Fondo Galaxia)</option>
                                                <option value="system" className="bg-[#020617] text-white">Sincronizar con el Sistema</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-5 h-5 text-slate-500 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Ministro Responsable */}
                                <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/10 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                                        {/* Profile Card Sidebar */}
                                        <div className="lg:w-80 flex flex-col items-center">
                                            <div className="relative group/avatar">
                                                <div className="w-56 h-56 rounded-full border-4 border-primary/20 p-2 relative">
                                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] bg-slate-800">
                                                        <img
                                                            src={minister.avatar}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                                            alt="Ministro"
                                                        />
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => document.getElementById('minister-photo-upload')?.click()}
                                                        className="absolute bottom-4 right-4 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20 hover:bg-primary/90 transition-all z-20"
                                                    >
                                                        <Camera className="w-7 h-7" />
                                                    </motion.button>
                                                </div>
                                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-primary px-8 py-2.5 rounded-full shadow-[0_10px_30px_rgba(var(--primary-rgb),0.5)] border border-white/20 whitespace-nowrap">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Siervo de Dios</span>
                                                </div>
                                            </div>

                                            <div className="mt-14 text-center space-y-3">
                                                <h4 className="text-3xl font-black uppercase text-foreground italic drop-shadow-md tracking-tighter">{minister.name || 'Sin Nombre'}</h4>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-4 py-1.5 rounded-full inline-block">Responsable</p>
                                            </div>

                                            <div className="mt-10 w-full p-6 rounded-[2rem] bg-foreground/5 border border-white/5 backdrop-blur-md flex justify-around">
                                                <div className="text-center">
                                                    <div className="text-xl font-black text-foreground italic">100%</div>
                                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Fidelidad</div>
                                                </div>
                                                <div className="w-px h-10 bg-white/10" />
                                                <div className="text-center">
                                                    <div className="text-xl font-black text-primary italic">Activo</div>
                                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Estado</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Edit Fields */}
                                        <div className="flex-1 space-y-10">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3.5 bg-primary/20 rounded-2xl border border-primary/30 shadow-lg">
                                                        <User className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black uppercase text-foreground italic tracking-tight">Detalles del Ministro</h3>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Información oficial para visualización pública</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-4 bg-foreground/5 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                        <span className="text-[9px] font-black uppercase text-slate-400">Pantalla</span>
                                                        <Button
                                                            variant={settings.showMinisterOnDisplay ? "neon" : "outline"}
                                                            size="sm"
                                                            className="h-9 px-4 text-[10px] font-black"
                                                            onClick={() => setSettings({ showMinisterOnDisplay: !settings.showMinisterOnDisplay })}
                                                        >
                                                            {settings.showMinisterOnDisplay ? "VISIBLE" : "OCULTO"}
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-2 h-12 px-10 rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
                                                        onClick={async () => {
                                                            setIsSaving(true);
                                                            await saveSettingsToCloud({
                                                                ministerName: minister.name,
                                                                ministerPhone: minister.phone,
                                                                ministerEmail: minister.email,
                                                                ministerAvatar: minister.avatar
                                                            });
                                                            setIsSaving(false);
                                                            alert("✅ Información del Ministro guardada correctamente.");
                                                        }}
                                                        disabled={isSaving}
                                                    >
                                                        <Save className="w-5 h-5" /> GUARDAR
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre Completo y Grado</label>
                                                    <div className="relative group/input">
                                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within/input:text-primary transition-colors" />
                                                        <Input
                                                            value={minister.name}
                                                            onChange={(e) => setMinister({ name: e.target.value })}
                                                            className="h-16 bg-foreground/5 border-white/10 pl-14 rounded-[1.25rem] text-sm font-black focus:border-primary/50 focus:bg-foreground/10 transition-all outline-none"
                                                            placeholder="Ej. P.E. Benjamin Rojas"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Teléfono de Contacto</label>
                                                    <div className="relative group/input">
                                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within/input:text-primary transition-colors" />
                                                        <Input
                                                            value={minister.phone}
                                                            onChange={(e) => setMinister({ phone: e.target.value })}
                                                            className="h-16 bg-foreground/5 border-white/10 pl-14 rounded-[1.25rem] text-sm font-black focus:border-primary/50 focus:bg-foreground/10 transition-all outline-none"
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4 md:col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Correo Electrónico</label>
                                                    <div className="relative group/input">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within/input:text-primary transition-colors" />
                                                        <Input
                                                            value={minister.email}
                                                            onChange={(e) => setMinister({ email: e.target.value })}
                                                            className="h-16 bg-foreground/5 border-white/10 pl-14 rounded-[1.25rem] text-sm font-black focus:border-primary/50 focus:bg-foreground/10 transition-all outline-none"
                                                            placeholder="contacto@lldmrodeo.org"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <input
                                            id="minister-photo-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleMinisterAvatarChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                        <Card id="miembros" className="glass-card border-t-4 border-t-emerald-500">
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
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="p-8 rounded-[2.5rem] bg-emerald-500/[0.03] border border-emerald-500/20 space-y-8 relative overflow-hidden mb-8 shadow-2xl shadow-emerald-500/5"
                                    >
                                        {/* Background Glow */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] pointer-events-none" />

                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black uppercase text-emerald-400 flex items-center gap-3 italic tracking-tight">
                                                    <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
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
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.15em] gap-3 h-12 px-8 rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
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
                                                    value={newMember.name}
                                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                                    placeholder="Ej: María López"
                                                    className={cn(
                                                        "bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all outline-none",
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
                                                                <div key={m.id} className="flex items-center justify-between text-[10px] bg-white/5 p-2 rounded-lg border border-white/5">
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
                                                    value={newMember.email}
                                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                                    placeholder="ejemplo@gmail.com"
                                                    className={cn(
                                                        "bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all outline-none",
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
                                                    value={newMember.phone}
                                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="bg-foreground/[0.03] border-border/10 h-14 rounded-2xl text-sm font-black focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all outline-none"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Shield className="w-3 h-3" /> Rol en el Sistema
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={newMember.role}
                                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                                        className="w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all"
                                                    >
                                                        <option value="Miembro" className="bg-background">MIEMBRO</option>
                                                        <option value="Responsable" className="bg-background">RESPONSABLE</option>
                                                        <option value="Administrador" className="bg-background">ADMINISTRADOR</option>
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
                                                        className="w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all"
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
                                                        className="w-full bg-foreground/[0.03] border border-border/10 rounded-2xl h-14 px-4 text-sm font-black text-foreground outline-none appearance-none focus:border-emerald-500/50 focus:bg-foreground/[0.05] transition-all"
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
                                        {[
                                            { id: 'all', label: 'Todos los Miembros', icon: Users, color: 'emerald' },
                                            { id: 'Casados', label: 'Casados', icon: Heart, color: 'rose' },
                                            { id: 'Solos y Solas', label: 'Solos y Solas', icon: User, color: 'blue' },
                                            { id: 'Jóvenes', label: 'Jóvenes', icon: Star, color: 'amber' },
                                            { id: 'Niños', label: 'Niños', icon: Baby, color: 'purple' },
                                            { id: 'other', label: 'Sin Asignar', icon: Shield, color: 'slate' }
                                        ].map((group) => (
                                            <button
                                                key={group.id}
                                                onClick={() => setMemberFilter(group.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 relative group overflow-hidden border",
                                                    memberFilter === group.id
                                                        ? `bg-${group.color}-500/10 border-${group.color}-500/30 text-${group.color}-400 shadow-[0_4px_20px_rgba(0,0,0,0.2)]`
                                                        : "bg-foreground/[0.02] border-border/10 text-muted-foreground hover:bg-foreground/[0.04] hover:border-border/30"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 z-10">
                                                    <div className={cn(
                                                        "p-2 rounded-xl border transition-all",
                                                        memberFilter === group.id
                                                            ? `bg-${group.color}-500/20 border-${group.color}-500/30 shadow-lg`
                                                            : "bg-foreground/5 border-border/10 group-hover:bg-foreground/10"
                                                    )}>
                                                        <group.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest italic">{group.label}</span>
                                                </div>

                                                {/* Badge Count */}
                                                <span className="text-[9px] font-bold opacity-30 px-2 italic z-10">
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
                                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-50">
                                                    <Users className="w-10 h-10 text-slate-500" />
                                                </div>
                                                <p className="text-xs text-slate-500 italic uppercase tracking-widest font-black">No hay miembros registrados</p>
                                            </div>
                                        ) : (
                                            [
                                                { id: 'Casados', label: 'CASADOS', icon: Heart },
                                                { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', icon: User },
                                                { id: 'Jóvenes', label: 'JÓVENES', icon: Star },
                                                { id: 'Niños', label: 'NIÑOS', icon: Baby },
                                                { id: 'other', label: 'OTROS / SIN GRUPO', icon: Shield }
                                            ].filter(g => memberFilter === 'all' || memberFilter === g.id).map(group => {
                                                const groupMembers = members.filter(m =>
                                                    group.id === 'other'
                                                        ? (!m.member_group || !['Casados', 'Solos y Solas', 'Jóvenes', 'Niños'].includes(m.member_group))
                                                        : m.member_group === group.id
                                                ).sort((a, b) => a.name.localeCompare(b.name));

                                                if (groupMembers.length === 0) return null;

                                                return (
                                                    <div key={group.id} className="col-span-full grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4 last:mb-0">
                                                        <div className="col-span-full flex flex-col gap-1 mt-6 first:mt-2 mb-4">
                                                            <div className="flex items-center gap-4 px-4 overflow-hidden">
                                                                <div className="p-2.5 rounded-2xl bg-foreground/[0.03] border border-white/5 shadow-2xl">
                                                                    <group.icon className="w-4 h-4 text-emerald-500" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <h3 className="text-sm font-black uppercase italic tracking-[0.2em] text-foreground flex items-center gap-2">
                                                                        {group.label}
                                                                        <span className="text-[10px] font-bold text-slate-500 not-italic tracking-normal">({groupMembers.length})</span>
                                                                    </h3>
                                                                    <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest opacity-60 italic">Gestión de integrantes por grupo</p>
                                                                </div>
                                                                <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 via-emerald-500/5 to-transparent ml-2" />
                                                            </div>
                                                        </div>
                                                        {groupMembers.map((m) => (
                                                            <motion.div
                                                                layout
                                                                key={m.id}
                                                                whileHover={{ y: -4, scale: 1.01 }}
                                                                className={cn(
                                                                    "p-5 rounded-[2rem] border transition-all duration-300 group relative overflow-hidden",
                                                                    m.is_pre_registered
                                                                        ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40"
                                                                        : "bg-foreground/[0.02] border-border/10 hover:border-primary/30 hover:bg-primary/[0.02] shadow-xl"
                                                                )}
                                                            >
                                                                {/* Background Accent */}
                                                                <div className={cn(
                                                                    "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2",
                                                                    m.role === 'Administrador' ? "bg-red-500" :
                                                                        m.role === 'Ministro' ? "bg-primary" : "bg-emerald-500"
                                                                )} />

                                                                <div className="flex items-start gap-5 relative z-10">
                                                                    {/* Avatar Area */}
                                                                    <div className="relative shrink-0">
                                                                        <div className={cn(
                                                                            "w-16 h-16 rounded-2xl overflow-hidden border-2 p-1 relative z-10",
                                                                            m.role === 'Administrador' ? "border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]" :
                                                                                m.role === 'Ministro' ? "border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" :
                                                                                    "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                                        )}>
                                                                            {m.avatar ? (
                                                                                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover rounded-xl" />
                                                                            ) : (
                                                                                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                                                                                    <User className={cn(
                                                                                        "w-8 h-8",
                                                                                        m.role === 'Administrador' ? "text-red-400" :
                                                                                            m.role === 'Ministro' ? "text-primary" : "text-emerald-400"
                                                                                    )} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {m.is_pre_registered && (
                                                                            <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded-full z-20 shadow-lg border border-amber-400/50 text-white animate-pulse">
                                                                                PRE
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Info Area */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between">
                                                                            <div>
                                                                                <h4 className="font-black text-lg italic text-foreground tracking-tight truncate max-w-[150px]">{m.name}</h4>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className={cn(
                                                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                                                                        m.role === 'Administrador' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                                                            m.role === 'Ministro' ? "bg-primary/10 text-primary border-primary/20" :
                                                                                                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                                    )}>
                                                                                        {m.role}
                                                                                    </span>
                                                                                    {m.member_group && (
                                                                                        <span className="text-[9px] font-black uppercase tracking-widest bg-foreground/5 text-muted-foreground/60 px-2 py-0.5 rounded-lg border border-border/10 italic">
                                                                                            {m.member_group}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {editingMemberId === m.id ? (
                                                                                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                                                                    <select
                                                                                        value={editingRole}
                                                                                        onChange={(e) => setEditingRole(e.target.value)}
                                                                                        className="bg-transparent text-[9px] font-black text-foreground outline-none px-2 cursor-pointer"
                                                                                    >
                                                                                        <option value="Miembro" className="bg-[#0f172a]">MIEMBRO</option>
                                                                                        <option value="Responsable" className="bg-[#0f172a]">RESPON</option>
                                                                                        <option value="Administrador" className="bg-[#0f172a]">ADMIN</option>
                                                                                    </select>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1 }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={async () => {
                                                                                            await updateProfileInCloud(m.id, { role: editingRole as any });
                                                                                            await loadMembersFromCloud();
                                                                                            setEditingMemberId(null);
                                                                                        }}
                                                                                        className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-lg"
                                                                                    >
                                                                                        <Save className="w-3 h-3" />
                                                                                    </motion.button>
                                                                                    <button onClick={() => setEditingMemberId(null)} className="p-1.5 text-slate-400"><X className="w-3 h-3" /></button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-rgb), 0.2)' }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={() => {
                                                                                            setEditingMemberId(m.id);
                                                                                            setEditingRole(m.role);
                                                                                        }}
                                                                                        className="p-2 rounded-xl bg-foreground/5 text-muted-foreground hover:text-primary transition-colors border border-border/10"
                                                                                    >
                                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                                    </motion.button>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={async () => {
                                                                                            if (confirm(`¿Eliminar a ${m.name}? Esta acción no se puede deshacer.`)) {
                                                                                                await deleteMemberFromCloud(m.id);
                                                                                                await loadMembersFromCloud();
                                                                                            }
                                                                                        }}
                                                                                        className="p-2 rounded-xl bg-foreground/5 text-muted-foreground hover:text-red-500 transition-colors border border-border/10"
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
                imageToEdit && (
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
                )
            }
        </div>
    );
}
