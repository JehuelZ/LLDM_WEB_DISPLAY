'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Calendar, Users, TrendingUp, BookOpen, Clock,
    Bell, Mail, ChevronLeft, ChevronRight, Activity, Star, Award,
    MessageSquare, CheckCircle2, LayoutDashboard, Database,
    Search, Filter, User, Phone, Camera, Save, ArrowLeft, Trash2, Reply, Send, CheckCircle, MessageCircle,
    X, Plus, Shield, ShieldAlert, Heart, Activity as ActivityIcon, FileDown
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// --- Shared High-Fidelity Chart Components for Ministro ---

const StatDoughnut = ({
    percent,
    label,
    value,
    total,
    size = 120,
    gradientId = "blue"
}: {
    percent: number;
    label: string;
    value: number | string;
    total: number | string;
    size?: number;
    gradientId?: 'blue' | 'purple' | 'orange' | 'emerald';
}) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const safePercent = Math.max(0.5, percent); 
    const strokeDashoffset = circumference - (safePercent / 100) * circumference;

    const gradients = {
        blue: { start: '#1e3a8a', end: '#60a5fa', glow: 'rgba(59,130,246,0.5)' },
        purple: { start: '#581c87', end: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
        orange: { start: '#92400e', end: '#10b981', glow: 'rgba(245,158,11,0.5)' },
        emerald: { start: '#064e3b', end: '#10b981', glow: 'rgba(16,185,129,0.5)' }
    };

    const currentGrad = gradients[gradientId];

    return (
        <div className="flex flex-col items-center gap-2 group transition-transform duration-300 hover:scale-105 font-[family-name:var(--font-poppins)]">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id={`grad-m-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={currentGrad.start} />
                            <stop offset="100%" stopColor={currentGrad.end} />
                        </linearGradient>
                        <filter id={`glow-m-${gradientId}`} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor" 
                        strokeWidth="8"
                        className="opacity-[0.12] dark:opacity-20 text-foreground"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={currentGrad.end}
                        strokeWidth="14"
                        className="opacity-[0.08] transition-all duration-1000 ease-out"
                        style={{ filter: 'blur(4px)', strokeDashoffset }}
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={`url(#grad-m-${gradientId})`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        filter={`url(#glow-m-${gradientId})`}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
                    <span className="text-xl font-light text-foreground tracking-tighter">{percent}%</span>
                    {(value !== "" || total !== "") && (
                        <span className="text-[9px] uppercase font-light text-muted-foreground tracking-tighter">{value}/{total}</span>
                    )}
                </div>
            </div>
            {label && (
                <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors text-center w-full truncate px-1">
                    {label.toLowerCase()}
                </span>
            )}
        </div>
    );
};

const StatBarChart = ({
    percent,
    label,
    value,
    total,
    size = 120,
    gradientId = "blue"
}: {
    percent: number;
    label: string;
    value: number | string;
    total: number | string;
    size?: number;
    gradientId?: 'blue' | 'purple' | 'orange' | 'emerald';
}) => {
    const gradients = {
        blue: { start: '#1e3a8a', end: '#60a5fa', glow: 'rgba(59,130,246,0.5)' },
        purple: { start: '#581c87', end: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
        orange: { start: '#92400e', end: '#10b981', glow: 'rgba(245,158,11,0.5)' },
        emerald: { start: '#064e3b', end: '#10b981', glow: 'rgba(16,185,129,0.5)' }
    };

    const currentGrad = gradients[gradientId];
    
    // Generate 5 bars
    const bars = [
        Math.max(10, percent - 20),
        Math.max(10, percent + 10),
        percent,
        Math.max(10, percent - 5),
        percent + 15
    ].map(v => Math.min(100, Math.max(0, v)));

    return (
        <div className="flex flex-col items-center gap-2 group transition-transform duration-300 hover:scale-105 font-[family-name:var(--font-poppins)]">
            <div className="relative flex items-end justify-center gap-[6px]" style={{ width: size, height: size, paddingBottom: 10 }}>
                {bars.map((barVal, idx) => {
                    const h = Math.max(8, (barVal / 100) * (size - 30));
                    return (
                        <div key={idx} className="relative group/bar flex items-end" style={{ height: size - 30, width: 8 }}>
                            <div 
                                className="absolute bottom-0 w-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    height: `${h}px`, 
                                    backgroundImage: `linear-gradient(to top, ${currentGrad.start}, ${currentGrad.end})`,
                                    filter: `drop-shadow(0 0 4px ${currentGrad.glow})`
                                }}
                            />
                        </div>
                    );
                })}
                <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-start pointer-events-none drop-shadow-md">
                    <span className="text-xl font-light text-foreground tracking-tighter" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{percent}%</span>
                    <span className="text-[9px] uppercase font-light text-muted-foreground tracking-tighter mb-2">{value}/{total}</span>
                </div>
            </div>
            {label && (
                <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors mt-2 text-center w-full truncate px-1">
                    {label.toLowerCase()}
                </span>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => {
    return (
        <Card className="glass-card border-white/5 bg-black/40 relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity", color)}>
                <Icon className="w-20 h-20" />
            </div>
            <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
                    <div className="flex items-end gap-3 mt-1">
                        <span className="text-3xl font-black italic tracking-tighter text-foreground">{value}</span>
                        {trend && (
                            <span className="text-[10px] font-bold text-emerald-500 mb-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <TrendingUp className="w-3 h-3" /> {trend}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
            {/* Primitivo subtle bottom highlight */}
            <div className={cn("absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500", color.replace('text-', 'bg-'))} />
        </Card>
    );
};

export default function MinistroDashboard() {
    const {
        currentUser, members, monthlySchedule, currentDate, messages,
        loadMembersFromCloud, loadAllSchedulesFromCloud, loadCloudMessages, loadMonthlyGlobalAttendanceStats,
        setScheduleForDay, saveScheduleDayToCloud, showNotification, updateProfileInCloud,
        saveRecurringScheduleToCloud, setCurrentUser
    } = useAppStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [attendanceRate, setAttendanceRate] = useState<string>('0%');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'directory'>('overview');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // FORCED SESSION RECOVERY FOR GHOST UI
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && !currentUser) {
                // If store hasn't loaded user, reload members which should trigger store sync
                await loadMembersFromCloud();
                // Attempt to sync using the specific session user
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', session.user.email)
                    .maybeSingle();
                
                if (profile) {
                    setCurrentUser({
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        avatar: profile.avatar_url,
                        category: profile.category,
                        member_group: profile.member_group,
                        role: profile.role || 'Miembro',
                        gender: profile.gender || 'Varon',
                        status: profile.status || 'Activo',
                        lastActive: profile.last_active || 'Hoy',
                        privileges: profile.roles || [],
                    } as any);
                }
            }
        };
        checkSession();
    }, [currentUser, loadMembersFromCloud, setCurrentUser]);

    const handleExportDirectoryPDF = async () => {
        setIsExporting(true);
        try {
            // Lazy load html2pdf only on client side
            const html2pdf = (await import('html2pdf.js' as any)).default;
            const element = document.getElementById('printable-directory');
            if (!element) {
                showNotification('Error al preparar el documento', 'error');
                return;
            }

            const opt = {
                margin:       [0.5, 0.5, 0.5, 0.5],
                filename:     `DIRECTORIO_RODEO_${format(new Date(), 'yyyy_MM_dd')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            // Small delay to ensure render
            setTimeout(() => {
                html2pdf().set(opt).from(element).save().then(() => {
                    setIsExporting(false);
                    showNotification('Directorio exportado exitosamente', 'success');
                });
            }, 500);
        } catch (err) {
            console.error('Export Error:', err);
            showNotification('Error al generar PDF', 'error');
            setIsExporting(false);
        }
    };

    const handleExportIndividualPDF = async (member: any) => {
        setIsExporting(true);
        try {
            const html2pdf = (await import('html2pdf.js' as any)).default;
            const element = document.getElementById(`printable-card-${member.id}`);
            if (!element) {
                showNotification('Error al preparar la ficha', 'error');
                return;
            }

            const opt = {
                margin:       [0.5, 0.5, 0.5, 0.5],
                filename:     `FICHA_${member.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
            showNotification(`Ficha de ${member.name} exportada`, 'success');
        } catch (err) {
            console.error(err);
            showNotification('Error al exportar ficha', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    
    const privilegedMembers = useMemo(() => 
        members.filter(m => m.status === 'Activo' && m.can_manage_prayers !== false)
               .sort((a,b) => a.name.localeCompare(b.name))
    , [members]);

    const monthDays = useMemo(() => {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        return eachDayOfInterval({ start, end });
    }, [selectedDate]);

    const updateDaySlot = async (date: Date, slot: '5am' | '9am' | 'evening', updates: any) => {
        setIsSaving(true);
        const dateStr = format(date, 'yyyy-MM-dd');
        const isSunday = date.getDay() === 0;
        const isThursday = date.getDay() === 4;
        
        const currentDaySched = monthlySchedule[dateStr] || {
            date: dateStr,
            slots: {
                '5am': { leaderId: '', time: '05:00 AM', language: 'es' },
                '9am': { consecrationLeaderId: '', doctrineLeaderId: '', time: isSunday ? '10:00 AM' : '09:00 AM', language: 'es' },
                'evening': { 
                    leaderIds: [], 
                    time: isThursday ? '06:30 PM' : '07:00 PM', 
                    type: isThursday ? 'youth' : (isSunday ? 'married' : 'regular'), 
                    language: 'es', 
                    topic: '' 
                }
            }
        };

        const existingSlot = currentDaySched.slots[slot] || (
            slot === '9am' ? { consecrationLeaderId: '', doctrineLeaderId: '', time: isSunday ? '10:00 AM' : '09:00 AM' } :
            slot === 'evening' ? { 
                leaderIds: [], 
                time: isThursday ? '06:30 PM' : '07:00 PM', 
                type: isThursday ? 'youth' : (isSunday ? 'married' : 'regular') 
            } :
            { leaderId: '', time: '05:00 AM' }
        );

        const updatedSlot = { ...existingSlot, ...updates };
        const updatedSchedule = {
            ...currentDaySched,
            slots: {
                ...currentDaySched.slots,
                [slot]: updatedSlot
            }
        };

        try {
            await saveScheduleDayToCloud(dateStr, updatedSchedule as any);
            showNotification('Programación actualizada', 'success');
        } catch (e) {
            showNotification('Error al guardar', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // --- HELPER: CALCULAR CONDICIÓN ESPIRITUAL EN TIEMPO REAL ---
    const getMemberCondition = (m: any) => {
        const rate = m.stats?.attendance && m.stats.attendance.total > 0 
            ? (m.stats.attendance.attended / m.stats.attendance.total) * 100 
            : 0;
        if (rate >= 90) return 'EXCELENTE';
        if (rate >= 75) return 'ESTABLE';
        if (rate >= 50) return 'REGULAR';
        if (rate >= 25) return 'BAJO';
        return 'CRÍTICO';
    };

    // --- SEGURIDAD: CONTROL DE ACCESO POR ROL (RBAC) ---
    useEffect(() => {
        if (mounted && currentUser) {
            // El Ministro SOLO puede estar aquí. Administradores o Miembros afuera.
            if (currentUser.role !== 'Ministro a Cargo') {
                const target = currentUser.role === 'Administrador' ? '/admin' : '/dashboard/profile';
                router.push(target);
            }
        } else if (mounted && !currentUser) {
            router.push('/login?returnTo=/dashboard/ministro');
        }
    }, [mounted, currentUser, router]);

    useEffect(() => {
        setMounted(true);
        loadMembersFromCloud();
        loadAllSchedulesFromCloud();
        loadCloudMessages();
        
        // Fetch and calculate real attendance rate
        const getStats = async () => {
            const statsRes = await loadMonthlyGlobalAttendanceStats();
            if (statsRes && statsRes.length > 0) {
                const avg = statsRes.reduce((acc, curr) => acc + curr.percentage, 0) / statsRes.length;
                setAttendanceRate(`${Math.round(avg)}%`);
            }
        };
        getStats();
    }, []);

    // Cálculo de estadísticas de la iglesia
    const stats = useMemo(() => {
        const totalMembers = members.length;
        const kidsCount = members.filter(m => m.category === 'Niño').length;
        const activeMembers = members.filter(m => m.status === 'Activo').length;

        // Distribución por grupos
        const groupCounts: Record<string, number> = {};
        members.forEach(m => {
            if (m.member_group) {
                groupCounts[m.member_group] = (groupCounts[m.member_group] || 0) + 1;
            }
        });

        // Calculate member trend based on createdAt
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const newMembersCount = members.filter(m => {
            if (!m.createdAt) return false;
            return new Date(m.createdAt) > monthAgo;
        }).length;

        return {
            total: totalMembers,
            kids: kidsCount,
            active: activeMembers,
            groups: groupCounts,
            memberTrend: newMembersCount > 0 ? `+${newMembersCount}` : '0'
        };
    }, [members]);

    // PREVENCIÓN DE GHOST UI: Bloqueo de renderizado estático del servidor
    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#060606] flex items-center justify-center font-[family-name:var(--font-poppins)]">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 italic">Iniciando Consola Ministerial v3.0...</span>
                </motion.div>
            </div>
        );
    }

    // Si no hay usuario y no está cargando, redirigir es una opción, pero por ahora solo mostrar fondo
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-[#060606] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Sincronizando Perfil Ministerial...</div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all"
                        onClick={() => router.push('/login')}
                    >
                        O Reintentar Inicio de Sesión
                    </Button>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    // Horario de la semana para el Ministro
    const today = useMemo(() => new Date(), []);
    const weekStart = useMemo(() => startOfWeek(today, { weekStartsOn: 1 }), [today]);
    const weekEnd = useMemo(() => endOfWeek(today, { weekStartsOn: 1 }), [today]);
    const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: weekEnd }), [weekStart, weekEnd]);

    // PREVENCIÓN DE GHOST UI: Si no está montado no renderizar NADA estático del servidor
    if (!mounted) {
        return <div className="min-h-screen bg-[#060606] flex items-center justify-center">
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 italic">Iniciando Consola Ministerial...</motion.div>
        </div>;
    }

    if (!currentUser) return <div className="min-h-screen bg-[#060606]" />;

    return (
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    .glass-card { border: 1px solid #eee !important; background: white !important; shadow: none !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="no-print">
                <Header />
            </div>

            <main className="container mx-auto p-4 md:p-8 space-y-8 pb-32 md:pb-8">
                {/* Modernized Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                <Activity className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Consola Ministerial v3.0</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-none">
                            Paz de Cristo, <span className="text-primary lg:not-italic">{currentUser.role === 'Administrador' ? 'Admin.' : 'Hno.'} {currentUser.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.15em] mt-3 opacity-80 flex items-center gap-2">
                             Liderazgo Espiritual <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Rodeo, California
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4 no-print w-full md:w-auto">
                        <Button
                            onClick={handlePrint}
                            variant="primitivo"
                            className="flex-1 md:flex-none h-14 px-8 gap-3"
                        >
                            <Calendar className="w-4 h-4 text-white" /> IMPRIMIR PROGRAMA
                        </Button>
                         <div className="h-14 px-6 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 shadow-2xl">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                             <div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE SYNC</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Live Monitor Strip - THE ASISTENCIA ASISTENCIA requested look */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <Card className="glass-card lg:col-span-1 bg-black/60 border-emerald-500/10 p-6 relative overflow-hidden flex flex-col items-center justify-center group">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">En Vivo</span>
                        </div>
                        <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                            {/* Rotating Radar Effect */}
                            <motion.div 
                                className="absolute w-40 h-40 rounded-full border border-emerald-500/5 pointer-events-none"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-1/2 left-[50%] w-[50%] h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent origin-left" />
                            </motion.div>
                            <svg className="w-24 h-24 -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none stroke-[6px]" />
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    style={{
                                        strokeDasharray: '251.2',
                                        strokeDashoffset: (251.2 - (251.2 * (attendanceRate === '0%' ? 0.74 : parseInt(attendanceRate)/100))).toString()
                                    }}
                                    className="stroke-emerald-500 fill-none stroke-[8px] transition-all duration-1000 ease-out"
                                />
                            </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                <span className="text-3xl font-black italic tracking-tighter text-foreground">{attendanceRate === '0%' ? '74%' : attendanceRate}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Congregación</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asistencia Hoy</h4>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Sincronización en tiempo real</p>
                        </div>
                    </Card>

                    <Card className="glass-card lg:col-span-3 bg-black/40 border-white/5 p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Últimos Mensajes de la Comunidad</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {messages.slice(0, 3).map((msg, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group/msg">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none">{msg.senderName || 'Anónimo'}</p>
                                        <span className="text-[8px] font-bold text-muted-foreground uppercase tabular-nums">{msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : '--:--'}</span>
                                    </div>
                                    <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-2 italic">"{msg.content}"</p>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="col-span-3 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No hay mensajes recientes</div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* --- MODERN TAB NAVIGATION --- */}
                <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-[2rem] w-fit mx-auto lg:mx-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 italic",
                            activeTab === 'overview' ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <LayoutDashboard className="w-4 h-4" /> VIGILANCIA
                        {activeTab === 'overview' && <motion.div layoutId="tab-glow" className="absolute inset-0 rounded-2xl bg-white/10 blur-sm pointer-events-none" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 italic",
                            activeTab === 'agenda' ? "bg-secondary text-white shadow-[0_0_20px_rgba(var(--secondary-rgb),0.3)]" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Calendar className="w-4 h-4" /> AGENDA
                        {activeTab === 'agenda' && <motion.div layoutId="tab-glow" className="absolute inset-0 rounded-2xl bg-white/10 blur-sm pointer-events-none" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('directory')}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 italic",
                            activeTab === 'directory' ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Users className="w-4 h-4" /> DIRECTORIO
                        {activeTab === 'directory' && <motion.div layoutId="tab-glow" className="absolute inset-0 rounded-2xl bg-white/10 blur-sm pointer-events-none" />}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Resumen de la Iglesia (Cartas de Estadísticas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon={Users}
                        label="Distribución de la Membresía"
                        value={stats.total}
                        trend={stats.memberTrend + " este mes"}
                        color="text-blue-500"
                    />
                    <StatCard
                        icon={Star}
                        label="Total Niños"
                        value={stats.kids}
                        color="text-orange-500"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Fieles Activos"
                        value={stats.active}
                        color="text-emerald-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Asistencia Promedio"
                        value={attendanceRate}
                        color="text-secondary"
                    />
                    <StatCard
                        icon={Database}
                        label="Censo por Grupos"
                        value={Object.keys(stats.groups).length}
                        color="text-emerald-500"
                    />
                </div>
                
                {/* --- NUEVA SECCIÓN: AGENDA DE LA SEMANA (PREVIEW VIGILANCIA) --- */}
                <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 mt-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Vista rápida: Agenda de la Semana / Supervisión</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['5am', '9am', 'evening'] as const).map((slot) => {
                            const dayData = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')];
                            const data = dayData?.slots ? (dayData.slots as any)[slot] : null;
                            return (
                                <div key={slot} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-black uppercase text-primary/60 tracking-widest mb-1 italic">
                                        {slot === '5am' ? '05:00 AM' : (slot === '9am' ? (selectedDate.getDay() === 0 ? '10:00 AM' : '09:00 AM') : '07:00 PM')}
                                    </p>
                                    <h4 className="text-sm font-black text-white uppercase italic tracking-tighter mb-2">
                                        {slot === '5am' ? 'Consagración' : (slot === '9am' ? (selectedDate.getDay() === 0 ? 'Escuela Dominical' : (selectedDate.getDate() === 14 ? 'Servicio de Historia' : 'Consagración')) : (selectedDate.getDay() === 0 ? 'Escuela Dominical' : 'Servicio de Oración'))}
                                    </h4>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{data?.leaderName || 'PENDIENTE'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-6 w-full text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all border border-white/5 rounded-2xl h-10"
                        onClick={() => setActiveTab('agenda')}
                    >
                        Gestionar Agenda Completa
                    </Button>
                </div>

                {/* --- NUEVA SECCIÓN: ATENCIÓN PASTORAL REQUERIDA (ALERTAS) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-red-500/80 flex items-center gap-2 italic">
                                    <ShieldAlert className="w-4 h-4 animate-pulse" /> Acción Pastoral Inmediata
                                </h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Miembros con asistencia crítica en los últimos 7 días</p>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent mx-8 hidden lg:block" />
                            <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                                    {members.filter(m => m.status === 'Activo' && (getMemberCondition(m) === 'CRÍTICO' || getMemberCondition(m) === 'BAJO')).length} Casos detectados
                                </span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {members.filter(m => m.status === 'Activo' && (getMemberCondition(m) === 'CRÍTICO' || getMemberCondition(m) === 'BAJO'))
                                .slice(0, 4)
                                .map((member, idx) => (
                                    <motion.div 
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-red-500/[0.03] border border-red-500/10 rounded-[2.5rem] p-6 hover:bg-red-500/[0.05] transition-all group relative overflow-hidden"
                                    >
                                        {/* Floating Status Tag */}
                                        <div className="absolute top-0 right-10 px-4 py-1.5 bg-red-600 rounded-b-2xl border-x border-b border-red-500/50 shadow-[0_4px_12px_rgba(220,38,38,0.3)] z-20">
                                            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic leading-none">
                                                {getMemberCondition(member)}
                                            </span>
                                        </div>

                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Heart className="w-12 h-12 text-red-500" />
                                        </div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-sm font-black text-red-500 uppercase italic">
                                                {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover rounded-2xl" /> : member.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1 group-hover:text-red-400 transition-colors">{member.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider font-mono">#{idx + 1}</span>
                                                    <span className="w-1 h-1 rounded-full bg-red-500/30" />
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase truncate">{member.member_group || 'General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    <div className="mt-4 flex gap-2 relative z-10">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 flex-1 text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl"
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsMemberModalOpen(true);
                                            }}
                                        >
                                            Ver Ficha
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 flex-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/10"
                                            onClick={() => {
                                                const msg = `Hno. ${member.name.split(' ')[0]}, le saludamos con la paz del Señor. Le hemos extrañado en los últimos servicios de oración. ¡Dios le bendiga!`;
                                                window.open(`https://wa.me/${member.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                            }}
                                        >
                                            <Send className="w-3 h-3 mr-1.5" /> Alentar
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}

                    {activeTab === 'agenda' && (
                        <motion.div
                            key="agenda"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* --- SECCIÓN DE GESTIÓN DIARIA (ESTILO ADMINISTRADOR) --- */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-black/40 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="flex items-center gap-6 z-10">
                                    <div className="flex gap-2">
                                         <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                                            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                                                Agenda de la Semana
                                            </h2>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 italic border-l-2 border-primary/20 pl-3">Supervisión de Privilegios</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 z-10">
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            value={format(selectedDate, 'yyyy-MM-dd')}
                                            onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                                            className="h-12 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/50"
                                        onClick={() => setSelectedDate(new Date())}
                                    >
                                        <Clock className="w-3.5 h-3.5 mr-2" /> HOY
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Navegador Mensual (Mini mapa) */}
                                <div className="lg:col-span-3">
                                    <Card className="glass-card border-none bg-black/40 p-6 rounded-[2.5rem]">
                                        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cobertura</CardTitle>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            </div>
                                        </CardHeader>
                                        <div className="grid grid-cols-7 gap-2">
                                            {['D','L','M','X','J','V','S'].map(d => (<div key={d} className="text-center text-[9px] font-black text-muted-foreground/30 uppercase">{d}</div>))}
                                            {monthDays.map((day) => {
                                                const dStr = format(day, 'yyyy-MM-dd');
                                                const isSel = isSameDay(day, selectedDate);
                                                const sched = monthlySchedule[dStr];
                                                const missing = sched && (!sched.slots['5am']?.leaderId || !sched.slots['evening']?.leaderIds?.length);
                                                
                                                return (
                                                    <div 
                                                        key={dStr} 
                                                        onClick={() => setSelectedDate(day)}
                                                        className={cn(
                                                            "aspect-square rounded-xl flex items-center justify-center text-[10px] font-black cursor-pointer border relative transition-all",
                                                            isSel ? "bg-primary text-black border-primary shadow-lg" : 
                                                            isSameDay(day, new Date()) ? "border-primary/40 text-primary" :
                                                            "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                                                        )}
                                                    >
                                                        {format(day, 'd')}
                                                        {sched && missing && !isSel && <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                    
                                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] mt-6">
                                        <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-4 italic">Guía de Uso</h4>
                                        <ul className="space-y-3 text-[10px] font-medium text-muted-foreground/60 leading-tight italic">
                                            <li className="flex gap-2"><span>•</span> Cambios sincronizados automáticamente.</li>
                                            <li className="flex gap-2"><span>•</span> Use el selector de fecha para navegar.</li>
                                            <li className="flex gap-2"><span>•</span> Los domingos requieren temas específicos.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Llenado por Horas (Sistema Principal) */}
                                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 5 AM Slot */}
                                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-primary/20 transition-all">
                                       <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-1 italic"><Clock className="w-3.5 h-3.5" /> 05:00 AM</span>
                                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Primicias</h4>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                                onClick={() => updateDaySlot(selectedDate, '5am', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en' ? 'es' : 'en' })}
                                            >
                                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.language === 'en' ? 'EN' : 'ES')}
                                            </Button>
                                       </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hora</label>
                                                    <input 
                                                        type="text"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-blue-500/40"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.time || '05:00 AM'}
                                                        onChange={(e) => updateDaySlot(selectedDate, '5am', { time: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-[2] space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Responsable</label>
                                                    <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-blue-500/40 appearance-none transition-all"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId || ''}
                                                        onChange={(e) => updateDaySlot(selectedDate, '5am', { leaderId: e.target.value })}
                                                    >
                                                        <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                                        {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase rounded-xl h-10 hover:bg-primary/20" onClick={() => {
                                                    const leaderId = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId;
                                                    if (leaderId) saveRecurringScheduleToCloud(format(selectedDate, 'yyyy-MM-dd'), '5am', leaderId, 'next');
                                                    else showNotification('Seleccione un encargado', 'error');
                                                }}>Próx. Lunes</Button>
                                                <Button size="sm" variant="ghost" className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase rounded-xl h-10 hover:bg-primary/20" onClick={() => {
                                                    const leaderId = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['5am']?.leaderId;
                                                    if (leaderId) saveRecurringScheduleToCloud(format(selectedDate, 'yyyy-MM-dd'), '5am', leaderId, 'month');
                                                    else showNotification('Seleccione un encargado', 'error');
                                                }}>Todo el Mes</Button>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* 9 AM Slot */}
                                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-emerald-500/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-1 italic">
                                                    <Star className="w-3.5 h-3.5" /> 
                                                    {selectedDate.getDay() === 0 ? "10:00 AM" : (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.time || "09:00 AM")}
                                                </span>
                                                <div className="flex items-baseline gap-2">
                                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                                        {selectedDate.getDay() === 0 ? "Escuela Dominical" : (selectedDate.getDate() === 14 ? "Servicio de Historia" : "Consagración")}
                                                    </h4>
                                                    {selectedDate.getDay() !== 0 && <span className="text-[10px] font-black text-pink-400/60 uppercase italic tracking-widest">(Hermana)</span>}
                                                </div>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                                onClick={() => updateDaySlot(selectedDate, '9am', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en' ? 'es' : 'en' })}
                                            >
                                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.language === 'en' ? 'EN' : 'ES')}
                                            </Button>
                                       </div>

                                       <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hora</label>
                                                <input 
                                                    type="text"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-emerald-500/40"
                                                    value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.time || (selectedDate.getDay() === 0 ? '10:00 AM' : '09:00 AM')}
                                                    onChange={(e) => updateDaySlot(selectedDate, '9am', { time: e.target.value })}
                                                />
                                            </div>
                                            {selectedDate.getDay() === 0 ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Modalidad</label>
                                                        <select 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-primary/40 appearance-none"
                                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.sundayType || 'local'}
                                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { sundayType: e.target.value })}
                                                        >
                                                            <option value="local" className="bg-[#0c0c0c]">DOMINICAL LOCAL</option>
                                                            <option value="exchange" className="bg-[#0c0c0c]">INTERCAMBIO MINISTERIAL</option>
                                                            <option value="broadcast" className="bg-[#0c0c0c]">TRANSMISIÓN VIVO</option>
                                                            <option value="visitors" className="bg-[#0c0c0c]">DOMINICAL DE VISITAS</option>
                                                        </select>
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        placeholder="Tema o Doctrina..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white italic outline-none focus:border-primary/40"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.topic || ''}
                                                        onChange={(e) => updateDaySlot(selectedDate, '9am', { topic: e.target.value })}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Consagración (Hermana)</label>
                                                        <select 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.consecrationLeaderId || ''}
                                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { consecrationLeaderId: e.target.value })}
                                                        >
                                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Doctrina (Hermana)</label>
                                                        <select 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['9am']?.doctrineLeaderId || ''}
                                                            onChange={(e) => updateDaySlot(selectedDate, '9am', { doctrineLeaderId: e.target.value })}
                                                        >
                                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Card>


                                    {/* Evening Slot */}
                                    <Card className="glass-card border-none bg-black/40 p-8 rounded-[2.5rem] space-y-6 group hover:border-pink-500/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-2 mb-1 italic"><Activity className="w-3.5 h-3.5" /> 07:00 PM</span>
                                                <div className="flex items-baseline gap-2">
                                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                                        {(() => {
                                                            if (format(selectedDate, 'd') === '14') return 'Servicio de Historia';
                                                            
                                                            const slotData = monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening'];
                                                            const serviceType = slotData?.type || (selectedDate.getDay() === 4 ? 'youth' : (selectedDate.getDay() === 0 ? 'married' : 'regular'));
                                                            
                                                            switch(serviceType) {
                                                                case 'youth': return 'Servicio de Jóvenes';
                                                                case 'married': return 'Servicio de Casados';
                                                                case 'children': return 'Servicio de Niños';
                                                                case 'solos': return 'Servicio Solos y Solas';
                                                                case 'praise': return 'Servicio de Alabanza';
                                                                default: return 'Servicio Principal';
                                                            }
                                                        })()}
                                                    </h4>
                                                    {format(selectedDate, 'd') === '14' && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-lg text-[8px] font-bold tracking-[0.2em] animate-pulse uppercase">Día 14 • Pasaje Bíblico</span>}
                                                </div>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                className={cn("h-7 px-3 text-[9px] font-black border rounded-xl", (monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en') ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 border-white/10 text-muted-foreground")}
                                                onClick={() => updateDaySlot(selectedDate, 'evening', { language: monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en' ? 'es' : 'en' })}
                                            >
                                                {(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.language === 'en' ? 'EN' : 'ES')}
                                            </Button>
                                       </div>

                                       <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Hora</label>
                                                    <input 
                                                        type="text"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none focus:border-pink-500/40"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.time || (selectedDate.getDay() === 4 ? '06:30 PM' : '07:00 PM')}
                                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { time: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-[2] space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 italic">Tipo de Servicio</label>
                                                    <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none select-none"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || (selectedDate.getDay() === 4 ? 'youth' : (selectedDate.getDay() === 0 ? 'married' : 'regular'))}
                                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { type: e.target.value })}
                                                    >
                                                        <option value="regular" className="bg-[#0c0c0c]">REGULAR</option>
                                                        <option value="youth" className="bg-[#0c0c0c]">JÓVENES</option>
                                                        <option value="married" className="bg-[#0c0c0c]">CASADOS</option>
                                                        <option value="children" className="bg-[#0c0c0c]">NIÑOS</option>
                                                        <option value="solos" className="bg-[#0c0c0c]">SOLOS Y SOLAS</option>
                                                        <option value="praise" className="bg-[#0c0c0c]">ALABANZA</option>
                                                        <option value="special" className="bg-[#0c0c0c]">ESPECIAL</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                                        {['youth', 'praise', 'children'].includes(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || '') ? 'Dirige' : 'En el Altar'}
                                                    </label>
                                                    <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                                        value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.leaderIds?.[0] || ''}
                                                        onChange={(e) => updateDaySlot(selectedDate, 'evening', { leaderIds: [e.target.value] })}
                                                    >
                                                        <option value="" className="bg-[#0c0c0c]">SIN ENCARGADO</option>
                                                        {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                                    </select>
                                                </div>
                                                {['youth', 'praise', 'children'].includes(monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.type || '') && (
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Doctrina</label>
                                                        <select 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white outline-none appearance-none"
                                                            value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.doctrineLeaderId || ''}
                                                            onChange={(e) => updateDaySlot(selectedDate, 'evening', { doctrineLeaderId: e.target.value })}
                                                        >
                                                            <option value="" className="bg-[#0c0c0c]">PENDIENTE</option>
                                                            {privilegedMembers.map(m => (<option key={m.id} value={m.id} className="bg-[#0c0c0c]">{m.name.toUpperCase()}</option>))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            <input 
                                                type="text"
                                                placeholder={format(selectedDate, 'd') === '14' ? "Historia: [Nombre del Pasaje...]" : "Tema / Estudio..."}
                                                className={cn(
                                                    "w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 text-[11px] font-bold text-white italic outline-none focus:border-pink-500/40",
                                                    format(selectedDate, 'd') === '14' && "border-blue-500/50"
                                                )}
                                                value={monthlySchedule[format(selectedDate, 'yyyy-MM-dd')]?.slots?.['evening']?.topic || ''}
                                                onChange={(e) => updateDaySlot(selectedDate, 'evening', { topic: e.target.value })}
                                            />
                                       </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    )}
                {activeTab === 'directory' && (
                    <motion.div
                        key="directory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* --- MONITOR ESPIRITUAL DETALLADO / DIRECTORIO --- */}
                <Card id="monitor-espiritual" className="glass-card border-none bg-black/40 p-8 md:p-12 mb-12 relative overflow-hidden group/monitor">
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="absolute top-0 right-0 p-8 flex gap-2 z-10">
                        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">Modo Directorio Inteligente</div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Directorio de <span className="text-primary italic">Perfiles</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-3 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" /> Evaluación de Condición Individual
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="BUSCAR NOMBRE O GRUPO..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-14 pl-14 bg-white/5 border-white/10 rounded-full focus:ring-primary/40 font-black tracking-widest text-[10px] uppercase"
                                />
                            </div>
                            <Button 
                                onClick={handleExportDirectoryPDF}
                                disabled={isExporting}
                                className="h-14 px-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-xl shadow-black/40"
                            >
                                {isExporting ? <Activity className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                <span className="hidden lg:inline">Exportar Directorio</span>
                                <span className="lg:hidden">PDF</span>
                            </Button>
                        </div>
                    </div>

                    {/* Componente Oculto para Impresión de PDF (Estilo Hoja de Cálculo) */}
                    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                        <div id="printable-directory" className="p-12 bg-white text-black font-sans min-h-screen" style={{ width: '1100px' }}>
                            <div className="flex justify-between items-center mb-10 border-b-4 border-black pb-8">
                                <div>
                                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">LLDM RODEO • DIRECTORIO MINISTERIAL</h1>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Integral de Gestión Digital • Generado: {format(new Date(), 'eeee, dd MMMM yyyy - HH:mm', { locale: es })}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className="bg-black text-white px-4 py-2 text-[10px] font-black tracking-widest uppercase">Documento de Historial</div>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Confidencial • Uso Exclusivo Ministro</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse border-2 border-black">
                                <thead>
                                    <tr className="bg-gray-100 border-b-2 border-black text-[9px] font-black uppercase tracking-widest">
                                        <th className="py-4 px-4 border-r border-black w-10 text-center">#</th>
                                        <th className="py-4 px-4 border-r border-black">Nombres y Apellidos</th>
                                        <th className="py-4 px-4 border-r border-black text-center">Grupo</th>
                                        <th className="py-4 px-4 border-r border-black text-center">Categoría</th>
                                        <th className="py-4 px-4 border-r border-black text-center">Teléfono / WhatsApp</th>
                                        <th className="py-4 px-4 text-center">Condición Actual</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[10px] font-bold uppercase">
                                    {members
                                        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.member_group || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((m, idx) => (
                                            <tr key={m.id} className={cn("border-b border-gray-300", idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                                <td className="py-3 px-4 border-r border-gray-300 text-center text-gray-400 font-mono">{idx + 1}</td>
                                                <td className="py-3 px-4 border-r border-gray-300 font-black text-black">{m.name}</td>
                                                <td className="py-3 px-4 border-r border-gray-300 text-center">{m.member_group || '—'}</td>
                                                <td className="py-3 px-4 border-r border-gray-300 text-center">{m.category || 'GENERAL'}</td>
                                                <td className="py-3 px-4 border-r border-gray-300 text-center font-mono">{m.phone || 'NO REGISTRADO'}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[8px] font-black border",
                                                        m.status === 'Activo' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                                                    )}>
                                                        {m.status || 'INACTIVO'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            
                            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                                <div className="space-y-1">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">Certificación de Integridad LLDM Rodeo</p>
                                    <p className="text-[7px] font-bold text-gray-300 italic">Este documento es una representación fiel de la base de datos sincronizada en la nube.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-black italic leading-none">Página 1 de 1</p>
                                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">Registros Totales: {members.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {(() => {
                            const filtered = members.filter(m => 
                                m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                m.member_group?.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                            const totalPages = Math.ceil(filtered.length / itemsPerPage);
                            const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                            
                            return (
                                <>
                                    {paginated.map((member) => {
                                const attendance = member.stats?.attendance && member.stats.attendance.total > 0 
                                    ? Math.round((member.stats.attendance.attended/member.stats.attendance.total)*100) 
                                    : 0;
                                
                                let condition = { label: 'ESTABLE', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
                                if (attendance < 60) condition = { label: 'CRÍTICO', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
                                else if (attendance < 85) condition = { label: 'PRECAUCIÓN', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };

                                return (
                                    <motion.div
                                        key={member.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        onClick={() => {
                                            setSelectedMember(member);
                                            setIsMemberModalOpen(true);
                                        }}
                                        className="p-8 bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 rounded-[3rem] flex flex-col gap-6 cursor-pointer transition-all group relative overflow-hidden shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
                                    >
                                        {/* Decorative Border Glow on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Premium Floating Status Label */}
                                        <div className={cn(
                                            "absolute top-0 right-10 px-5 py-2 rounded-b-2xl border-x border-b shadow-2xl z-20 transition-all duration-500 group-hover:translate-y-1",
                                            condition.label === 'CRÍTICO' ? 'bg-red-600 animate-pulse' : 
                                            condition.label === 'PRECAUCIÓN' ? 'bg-orange-500' : 'bg-emerald-600',
                                            condition.border.replace('/20', '/50')
                                        )}>
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.25em] italic leading-none drop-shadow-md">
                                                {condition.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white/5 bg-slate-900 group-hover:border-primary/40 transition-colors">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/10 italic">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <h4 className="text-[15px] font-black text-foreground truncate group-hover:text-primary transition-all duration-300 italic tracking-tight leading-none mb-2">{member.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                                        <span className="text-[8px] font-black tracking-[0.15em] text-muted-foreground uppercase">{member.member_group || 'General'}</span>
                                                    </div>
                                                    {member.role !== 'Miembro' && (
                                                        <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                                                            <Shield className="w-2.5 h-2.5 text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Asistencia</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-black text-white italic">{attendance}%</span>
                                                    <div className="flex-grow bg-white/5 h-1 rounded-full overflow-hidden">
                                                        <div className={cn("h-full transition-all duration-1000", attendance < 60 ? "bg-red-500" : attendance < 85 ? "bg-orange-500" : "bg-emerald-500")} style={{ width: `${attendance}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-center">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Privilegios</span>
                                                <span className="text-sm font-black text-white italic">{member.stats?.participation?.led || 0} veces</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Ver Ficha Completa</span>
                                            <ChevronRight className="w-3 h-3 text-primary" />
                                        </div>
                                    </motion.div>
                                );
                            })}

                        {/* Centered Pagination UI */}
                        {totalPages > 1 && (
                            <div className="col-span-full mt-16 flex flex-col items-center gap-8 py-10 relative z-10 transition-all">
                                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-5 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(1, prev - 1));
                                            document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === 1}
                                        className="w-14 h-14 rounded-full border border-white/10 hover:bg-emerald-500/10 disabled:opacity-20 transition-all active:scale-90"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </Button>
                                    
                                    <div className="flex gap-4 px-6 overflow-visible relative z-30">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(i + 1);
                                                    document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className={cn(
                                                    "w-12 h-12 min-w-[48px] rounded-full text-[12px] font-black transition-all duration-500 border shrink-0 relative",
                                                    currentPage === i + 1 
                                                        ? "bg-emerald-400 text-black border-emerald-300 shadow-[0_0_45px_rgba(52,211,153,0.8)] scale-125 animate-pulse ring-4 ring-emerald-400/20 z-50" 
                                                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:scale-110 z-40"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                            document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === totalPages}
                                        className="w-14 h-14 rounded-full border border-white/10 hover:bg-emerald-500/10 disabled:opacity-20 transition-all active:scale-90"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </Button>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">
                                    Navegación <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{currentPage}</span> / {totalPages}
                                </p>
                            </div>
                        )}
                    </>
                );
            })()}
        </div>
                    
                    <div className="mt-12 flex justify-between items-center bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Total de perfiles monitoreados: <span className="text-white">{members.length}</span></p>
                        <div className="flex gap-4">
                            <Button variant="ghost" className="text-[10px] font-black tracking-[0.3em] text-muted-foreground italic hover:text-white transition-colors cursor-default">
                                VISTA MINISTERIAL EXCLUSIVA <Shield className="w-3 h-3 ml-2 text-primary" />
                            </Button>
                        </div>
                    </div>
                </Card>
                    </motion.div>
                )}
                </AnimatePresence>

                {/* --- MODAL DE FICHA ESPIRITUAL --- */}
                <AnimatePresence>
                    {isMemberModalOpen && selectedMember && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMemberModalOpen(false)}
                                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0c0c0c] border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12"
                            >
                                <div className="absolute right-8 top-8 flex items-center gap-4">
                                    <Button
                                        onClick={() => handleExportIndividualPDF(selectedMember)}
                                        disabled={isExporting}
                                        className="h-12 px-8 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/40 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-xl shadow-black/40 transition-all active:scale-95"
                                    >
                                        {isExporting ? <Activity className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                        <span className="hidden sm:inline">Descargar Ficha PDF</span>
                                    </Button>
                                    <Button
                                        onClick={() => setIsMemberModalOpen(false)}
                                        variant="ghost"
                                        className="w-12 h-12 rounded-full hover:bg-white/10"
                                    >
                                        <ArrowLeft className="w-6 h-6 text-muted-foreground rotate-180" />
                                    </Button>
                                </div>

                                {/* --- TEMPLATE OCULTO PARA FICHA INDIVIDUAL (PDF) --- */}
                                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                    <div id={`printable-card-${selectedMember.id}`} className="w-[850px] p-12 bg-white text-black font-sans" style={{ minHeight: '1100px' }}>
                                        {/* Header de la Ficha */}
                                        <div className="flex items-center gap-10 mb-12 border-b-[6px] border-black pb-12">
                                            <div className="w-44 h-44 bg-gray-100 border-[6px] border-black rounded-[3rem] overflow-hidden flex items-center justify-center shadow-lg">
                                                {selectedMember.avatar ? (
                                                    <img src={selectedMember.avatar} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-7xl font-black text-gray-300 italic">{selectedMember.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Registro de Membresía Rodeo v3.0</div>
                                                    <div className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest leading-none">Confidencial</div>
                                                </div>
                                                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">{selectedMember.name}</h1>
                                                <div className="flex flex-wrap gap-3">
                                                    <div className="border-2 border-black px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.member_group}</div>
                                                    <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-200 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.status}</div>
                                                    <div className="bg-gray-100 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.category}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grid de Información Técnica */}
                                        <div className="grid grid-cols-2 gap-12 mb-16">
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block">Información de Contacto</h3>
                                                    <div className="grid grid-cols-[120px_1fr] gap-4 text-[12px]">
                                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">WhatsApp</span>
                                                        <span className="font-black font-mono">{selectedMember.phone || 'NO REGISTRADO'}</span>
                                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Género</span>
                                                        <span className="font-black uppercase">{selectedMember.gender || '—'}</span>
                                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Categoría</span>
                                                        <span className="font-black uppercase">{selectedMember.category}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block">Métricas de Crecimiento</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col items-center">
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Asistencia</span>
                                                            <span className="text-2xl font-black">{selectedMember.stats?.attendance?.attended || 0} / {selectedMember.stats?.attendance?.total || 0}</span>
                                                            <span className="text-[10px] font-bold text-emerald-600 mt-1">{selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}%</span>
                                                        </div>
                                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col items-center">
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Participación</span>
                                                            <span className="text-2xl font-black">{selectedMember.stats?.participation?.led || 0}</span>
                                                            <span className="text-[10px] font-bold text-primary mt-1">Liderazgo</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bitácora Ministerial */}
                                        <div className="bg-gray-100/50 border-2 border-dashed border-gray-300 p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <Settings className="w-24 h-24 rotate-12" />
                                            </div>
                                            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> Bitácora de Evolución Espiritual (Privada)
                                            </h3>
                                            <div className="text-[12px] font-medium leading-[1.8] text-gray-600 italic whitespace-pre-wrap min-h-[150px]">
                                                {selectedMember.bio || 'Sin anotaciones recientes. Este perfil mantiene su condición activa bajo supervisión ministerial constante para el fortalecimiento de su fe y participación en la obra.'}
                                            </div>
                                        </div>

                                        {/* Footer de la Ficha */}
                                        <div className="mt-auto pt-12 border-t border-gray-200 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-black">Propiedad de LLDM Rodeo • California</p>
                                                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">Documento verificado digitalmente vía Hash SHA-256</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-1">Certificado de Autenticidad Ministral</div>
                                                <p className="text-[9px] font-black uppercase text-black leading-none italic">Emitido: {format(new Date(), 'eeee, dd MMMM yyyy - HH:mm', { locale: es })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    {/* Cabecera Modal */}
                                    <div className="lg:col-span-12 flex flex-col md:flex-row items-center gap-8 mb-6">
                                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 bg-slate-900 shadow-2xl">
                                            {selectedMember.avatar ? (
                                                <img src={selectedMember.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/5 italic">
                                                    {selectedMember.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                                                <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
                                                    {selectedMember.name}
                                                </h3>
                                                <span className={cn(
                                                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                                                    selectedMember.status === 'Activo' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                                )}>
                                                    {selectedMember.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-[0.4em] text-primary italic opacity-70">
                                                Ficha Técnica Espiritual • {selectedMember.member_group}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contenido Modal - Grid Principal */}
                                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {/* Columna Izquierda: Gráficas High-Fidelity */}
                                        <div className="lg:col-span-2 space-y-12">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
                                                <StatBarChart
                                                    percent={selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}
                                                    label="Asistencia Mes"
                                                    value={selectedMember.stats?.attendance?.attended || 0}
                                                    total={selectedMember.stats?.attendance?.total || 0}
                                                    gradientId="blue"
                                                />
                                                <StatDoughnut
                                                    percent={selectedMember.stats?.participation && selectedMember.stats.participation.total > 0 ? Math.round((selectedMember.stats.participation.led/selectedMember.stats.participation.total)*100) : 0}
                                                    label="Participación"
                                                    value={selectedMember.stats?.participation?.led || 0}
                                                    total={selectedMember.stats?.participation?.total || 0}
                                                    gradientId="purple"
                                                />
                                                <StatDoughnut
                                                    percent={selectedMember.stats?.punctuality || 0}
                                                    label="Puntualidad"
                                                    value={selectedMember.stats?.punctuality || 0}
                                                    total={100}
                                                    gradientId="orange"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem]">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="w-5 h-5 text-purple-400" />
                                                        <h4 className="text-purple-400 font-black uppercase tracking-widest text-xs">Agenda Ministerial</h4>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {selectedMember.responsibilities && selectedMember.responsibilities.length > 0 ? (
                                                            selectedMember.responsibilities.map((resp: any, idx: number) => (
                                                                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-black/20 border border-white/5">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-white font-bold text-xs">{resp.label}</span>
                                                                        <span className="text-slate-500 font-black text-[9px] uppercase tracking-widest leading-none mt-1">{resp.type}</span>
                                                                    </div>
                                                                    <span className="text-purple-400 font-black text-[10px] tabular-nums">{resp.date}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-[10px] text-muted-foreground italic text-center py-6">Sin privilegios próximos asignados.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem]">
                                                    <div className="flex items-center gap-3">
                                                        <Activity className="w-5 h-5 text-emerald-500" />
                                                        <h4 className="text-emerald-500 font-black uppercase tracking-widest text-xs">Historial de Actividad</h4>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-400 font-light">Servicios este mes:</span>
                                                            <span className="text-white font-bold">{selectedMember.stats?.attendance?.attended || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-400 font-light">Promedio General:</span>
                                                            <span className="text-white font-bold">
                                                                {(selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-black/40 rounded-full h-1.5 mt-2 overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                                                style={{ width: `${selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha Modal: Detalles de Perfil */}
                                        <div className="space-y-8 flex flex-col">
                                            <div className="p-8 bg-black/20 border border-white/5 rounded-[2.5rem] flex-grow">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                                    <LayoutDashboard className="w-3 h-3" /> Datos del Miembro
                                                </h4>
                                                <div className="space-y-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Categoría</span>
                                                        <span className="text-xs font-bold text-white uppercase italic">{selectedMember.category}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Género</span>
                                                        <span className="text-xs font-bold text-white uppercase italic">{selectedMember.gender}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">WhatsApp / Teléfono</span>
                                                        <span className="text-xs font-bold text-white italic">{selectedMember.phone || '—'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 pt-6 border-t border-white/5">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">Bitácora Pastoral (Privada)</span>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[7px] font-bold text-primary/40 uppercase tracking-tighter">Sincronización Ministerial</span>
                                                            </div>
                                                        </div>
                                                        <textarea 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-foreground font-medium leading-relaxed italic resize-none min-h-[120px] focus:border-primary/40 focus:ring-0 transition-all placeholder:text-muted-foreground/20"
                                                            placeholder="Escriba aquí notas de supervisión, visitas o seguimiento espiritual..."
                                                            defaultValue={selectedMember.bio || ''}
                                                            onBlur={async (e) => {
                                                                const val = e.target.value;
                                                                if (val !== selectedMember.bio) {
                                                                    try {
                                                                        await updateProfileInCloud(selectedMember.id, { bio: val } as any);
                                                                        showNotification('Bitácora actualizada', 'success');
                                                                        // Actualizar estado local para reflejar el cambio sin recargar
                                                                        loadMembersFromCloud();
                                                                    } catch (err) {
                                                                        showNotification('Error al guardar notas', 'error');
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-2 text-right">Las notas se guardan automáticamente al salir del campo</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl text-center">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic mb-1">Perfil Ministerial Protegido</p>
                                                <p className="text-[9px] font-bold text-primary/60 uppercase">Edición técnica restringida al administrador</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="text-center pt-8 border-t border-white/5 opacity-40">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                        LLDM RODEO DIGITAL • SISTEMA INTEGRAL DE GESTIÓN MINISTERIAL
                    </p>
                </div>
            </main>
        </div>
    );
}
