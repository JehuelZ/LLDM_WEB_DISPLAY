'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, Bell, ChurchIcon, Star, Calendar, Mic2, Music2,
    MessageCircle, BookOpen, Heart, Clock, ChevronRight, Sun,
    User, Shield, Sparkles, Users, Baby, Volume2, FileText
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
    general: 'General',
    choir: 'Coro',
    kids: 'Niños',
    important: 'Importante',
    urgent: 'Urgente',
};

const CATEGORY_COLORS: Record<string, string> = {
    general: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    choir: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    kids: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    important: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    urgent: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const SLOT_LABELS: Record<string, string> = {
    '5am': 'Oración 5 AM',
    '9am_consecration': 'Consagración 9 AM',
    '9am_doctrine': 'Doctrina 9 AM',
    'evening': 'Culto Vespertino',
    '12pm': 'Servicio 12 PM',
};

const ROLE_ICONS: Record<string, React.ElementType> = {
    'Miembro': User,
    'Administrador': Shield,
    'Ministro a Cargo': ChurchIcon,
    'Dirigente Coro Adultos': Music2,
    'Dirigente Coro Niños': Baby,
    'Responsable de Asistencia': Users,
    'Encargado de Jóvenes': Sparkles,
    'Encargada de Jóvenes': Sparkles,
    'Responsable de Niños': Baby,
    'Dirigente del Coro': Music2,
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
    title, icon: Icon, children, accent = 'orange'
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    accent?: 'orange' | 'purple' | 'sky' | 'emerald' | 'rose';
}) {
    const colors = {
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden backdrop-blur-sm"
        >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colors[accent]}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-white/80 font-semibold text-sm tracking-wide">{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </motion.div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <p className="text-white/25 text-sm text-center py-4 italic">{label}</p>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function PortalPage() {
    const router = useRouter();
    const {
        currentUser,
        announcements,
        monthlySchedule,
        members,
        messages,
        signOut,
        loadAnnouncementsFromCloud,
        loadAllSchedulesFromCloud,
        loadThemeFromCloud,
        loadMembersFromCloud,
        loadCloudMessages,
        settings,
        theme,
    } = useAppStore();

    const [mounted, setMounted] = useState(false);
    const [now] = useState(() => new Date());

    useEffect(() => {
        setMounted(true);
        loadAnnouncementsFromCloud();
        loadAllSchedulesFromCloud();
        loadThemeFromCloud();
        loadMembersFromCloud();
        loadCloudMessages();
    }, []);

    // ── Derived data ──────────────────────────────────────────────────────────

    // My responsibilities: next 14 days where I'm assigned a slot
    const myUpcomingServices = useMemo(() => {
        if (!currentUser || !monthlySchedule) return [];
        const results: { date: string; label: string; slot: string }[] = [];
        const today = format(now, 'yyyy-MM-dd');
        const limit = format(addDays(now, 14), 'yyyy-MM-dd');

        Object.entries(monthlySchedule).forEach(([date, schedule]: [string, any]) => {
            if (date < today || date > limit) return;
            const slots = schedule?.slots || {};

            // Check 5am
            if (slots['5am']?.leaderId === currentUser.id) {
                results.push({ date, label: SLOT_LABELS['5am'], slot: '5am' });
            }
            // Check 9am
            if (slots['9am']?.consecrationLeaderId === currentUser.id) {
                results.push({ date, label: SLOT_LABELS['9am_consecration'], slot: '9am' });
            }
            if (slots['9am']?.doctrineLeaderId === currentUser.id) {
                results.push({ date, label: SLOT_LABELS['9am_doctrine'], slot: '9am' });
            }
            // Check 12pm
            if (slots['12pm']?.leaderId === currentUser.id) {
                results.push({ date, label: SLOT_LABELS['12pm'], slot: '12pm' });
            }
            // Check evening
            if (slots['evening']?.leaderIds?.includes(currentUser.id)) {
                results.push({ date, label: SLOT_LABELS['evening'], slot: 'evening' });
            }
            if (slots['evening']?.doctrineLeaderId === currentUser.id) {
                results.push({ date, label: 'Doctrina Vespertina', slot: 'evening' });
            }
            if (slots['evening']?.consecrationLeaderId === currentUser.id) {
                results.push({ date, label: 'Consagración Vespertina', slot: 'evening' });
            }
        });

        return results.sort((a, b) => a.date.localeCompare(b.date));
    }, [currentUser, monthlySchedule, now]);

    // Also check responsibilities[] on the profile
    const myResponsibilities = useMemo(() => {
        return (currentUser?.responsibilities || []).filter(r => r.status === 'pending');
    }, [currentUser]);

    // Relevant announcements: general + category matching user group
    const myAnnouncements = useMemo(() => {
        if (!announcements) return [];
        return announcements
            .filter(a => {
                if (!a.active) return false;
                if (a.expiresAt && isBefore(parseISO(a.expiresAt), now)) return false;
                if (a.category === 'choir' && !currentUser?.privileges?.includes('choir')) return false;
                if (a.category === 'kids' && !currentUser?.privileges?.includes('kids_leader') && !currentUser?.privileges?.includes('kids_helper')) return false;
                return true;
            })
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 5);
    }, [announcements, currentUser, now]);

    // Unread messages for this user
    const myMessages = useMemo(() => {
        return (messages || [])
            .filter(m => !m.read_at || !m.read_at)
            .slice(0, 4);
    }, [messages]);

    // Current weekly theme
    const currentTheme = useMemo(() => {
        if (!theme) return null;
        return theme;
    }, [theme]);

    // Is user in choir?
    const isInChoir = currentUser?.privileges?.includes('choir') || 
                      currentUser?.role === 'Dirigente Coro Adultos' ||
                      currentUser?.role === 'Dirigente del Coro' ||
                      currentUser?.role === 'Dirigente Coro Niños';

    const RoleIcon = ROLE_ICONS[currentUser?.role || 'Miembro'] || User;

    if (!mounted || !currentUser) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-400/40 border-t-orange-400 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange-500/6 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-400/4 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-lg mx-auto px-4 pb-12">
                {/* ── HEADER / HERO ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8 pb-6"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-1.5 text-white/30 text-xs">
                            <ChurchIcon className="w-3.5 h-3.5 text-orange-400" />
                            <span>LLDM Rodeo</span>
                        </div>
                        <button
                            onClick={async () => { await signOut(); router.push('/login'); }}
                            className="flex items-center gap-1.5 text-white/25 hover:text-white/60 text-xs transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Salir
                        </button>
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                                <img
                                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1a1a2e&color=f97316&bold=true`}
                                    alt={currentUser.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white leading-tight">{currentUser.name}</h1>
                            <div className="flex items-center gap-1.5 mt-1">
                                <RoleIcon className="w-3 h-3 text-orange-400" />
                                <span className="text-orange-400/80 text-xs font-medium">{currentUser.role}</span>
                            </div>
                            {currentUser.member_group && (
                                <span className="text-white/30 text-[10px] mt-0.5 block">{currentUser.member_group}</span>
                            )}
                        </div>
                    </div>

                    {/* Quick stat pills */}
                    <div className="flex gap-2 mt-5 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-full px-3 py-1.5">
                            <Calendar className="w-3 h-3 text-orange-400" />
                            <span className="text-white/60 text-xs">{myUpcomingServices.length} servicios próximos</span>
                        </div>
                        {myMessages.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
                                <Bell className="w-3 h-3 text-orange-400" />
                                <span className="text-orange-300 text-xs">{myMessages.length} mensajes</span>
                            </div>
                        )}
                        {isInChoir && (
                            <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1.5">
                                <Music2 className="w-3 h-3 text-purple-400" />
                                <span className="text-purple-300 text-xs">Coro</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── TEMA SEMANAL ──────────────────────────────────────────── */}
                {currentTheme && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="mb-4 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400/70 text-xs font-medium uppercase tracking-wider">Tema de la Semana</span>
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{currentTheme.title}</h3>
                        {currentTheme.description && (
                            <p className="text-white/50 text-sm mt-1 line-clamp-2">{currentTheme.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-white/30">
                            <Clock className="w-3 h-3" />
                            <span>
                                {format(parseISO(currentTheme.startDate), "d 'de' MMMM", { locale: es })} —{' '}
                                {format(parseISO(currentTheme.endDate), "d 'de' MMMM", { locale: es })}
                            </span>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {/* ── MIS SERVICIOS PRÓXIMOS ──────────────────────────── */}
                    <SectionCard title="Mis Servicios Próximos" icon={Calendar} accent="orange">
                        {myUpcomingServices.length === 0 ? (
                            <EmptyState label="No tienes servicios asignados en los próximos 14 días" />
                        ) : (
                            <div className="space-y-2">
                                {myUpcomingServices.map((service, i) => {
                                    const dateObj = parseISO(service.date);
                                    const dayName = format(dateObj, 'EEEE', { locale: es });
                                    const dateStr = format(dateObj, "d 'de' MMMM", { locale: es });
                                    const isToday = format(dateObj, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

                                    return (
                                        <motion.div
                                            key={`${service.date}-${service.slot}-${i}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                                                isToday
                                                    ? 'bg-orange-500/10 border-orange-500/30'
                                                    : 'bg-white/[0.03] border-white/6 hover:border-white/12'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 text-center ${isToday ? 'text-orange-400' : 'text-white/40'}`}>
                                                    <div className="text-[10px] uppercase font-bold">{dayName.slice(0, 3)}</div>
                                                    <div className="text-base font-black leading-none">{format(dateObj, 'd')}</div>
                                                </div>
                                                <div>
                                                    <p className="text-white/80 text-sm font-medium">{service.label}</p>
                                                    <p className="text-white/35 text-xs">{dateStr}</p>
                                                </div>
                                            </div>
                                            {isToday && (
                                                <span className="text-[9px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                                                    Hoy
                                                </span>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </SectionCard>

                    {/* ── MIS RESPONSABILIDADES DEL PERFIL ────────────────── */}
                    {myResponsibilities.length > 0 && (
                        <SectionCard title="Responsabilidades Pendientes" icon={Star} accent="orange">
                            <div className="space-y-2">
                                {myResponsibilities.slice(0, 5).map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/6 rounded-xl">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium">{r.label}</p>
                                            <p className="text-white/35 text-xs">{r.type} · {format(parseISO(r.date), "d MMM", { locale: es })}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20" />
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* ── ANUNCIOS ─────────────────────────────────────────── */}
                    <SectionCard title="Comunicados" icon={Bell} accent="sky">
                        {myAnnouncements.length === 0 ? (
                            <EmptyState label="No hay comunicados activos en este momento" />
                        ) : (
                            <div className="space-y-3">
                                {myAnnouncements.map((ann) => (
                                    <div key={ann.id} className="p-4 bg-white/[0.03] border border-white/6 rounded-xl">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-white/85 font-semibold text-sm leading-tight">{ann.title}</h4>
                                            {ann.category && (
                                                <span className={`text-[9px] border font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${CATEGORY_COLORS[ann.category] || CATEGORY_COLORS.general}`}>
                                                    {CATEGORY_LABELS[ann.category] || ann.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/45 text-xs leading-relaxed line-clamp-3">{ann.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* ── MI CORO (solo si es del coro) ────────────────────── */}
                    {isInChoir && (
                        <SectionCard title="Mi Coro" icon={Music2} accent="purple">
                            <div className="flex items-center gap-3 p-4 bg-purple-500/8 border border-purple-500/20 rounded-xl">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center border border-purple-500/20">
                                    <Music2 className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white/80 font-semibold text-sm">
                                        {currentUser.role.includes('Niños') ? 'Coro de Niños' : 'Coro de Adultos'}
                                    </p>
                                    <p className="text-purple-300/60 text-xs mt-0.5">
                                        {currentUser.role.includes('Dirigente') ? 'Dirigente' : 'Corista'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-white/25 text-xs text-center mt-4 italic">
                                Revisa los ensayos con tu dirigente
                            </p>
                        </SectionCard>
                    )}

                    {/* ── MIS MENSAJES ─────────────────────────────────────── */}
                    <SectionCard title="Mensajes" icon={MessageCircle} accent="emerald">
                        {myMessages.length === 0 ? (
                            <EmptyState label="No tienes mensajes nuevos" />
                        ) : (
                            <div className="space-y-2">
                                {myMessages.map((msg: any) => (
                                    <div key={msg.id} className="p-4 bg-white/[0.03] border border-white/6 rounded-xl">
                                        <div className="flex items-start gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                            <p className="text-white/80 font-semibold text-sm leading-tight">{msg.subject || 'Mensaje'}</p>
                                        </div>
                                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 ml-3.5">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* ── INFORMACIÓN PERSONAL ─────────────────────────────── */}
                    <SectionCard title="Mi Información" icon={User} accent="sky">
                        <div className="space-y-3">
                            {[
                                { label: 'Email', value: currentUser.email },
                                { label: 'Teléfono', value: currentUser.phone || '—' },
                                { label: 'Categoría', value: currentUser.category || '—' },
                                { label: 'Grupo', value: currentUser.member_group || '—' },
                                { label: 'Estado', value: currentUser.status },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/35 text-xs">{label}</span>
                                    <span className="text-white/70 text-xs font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                        {currentUser.bio && (
                            <div className="mt-4 p-3 bg-white/[0.03] rounded-xl border border-white/6">
                                <p className="text-white/40 text-xs italic leading-relaxed">"{currentUser.bio}"</p>
                            </div>
                        )}
                        {currentUser.favorite_verse && (
                            <div className="mt-3 p-3 bg-orange-500/5 rounded-xl border border-orange-500/15">
                                <div className="flex items-center gap-2 mb-1">
                                    <Heart className="w-3 h-3 text-orange-400" />
                                    <span className="text-orange-400/60 text-[10px] uppercase tracking-wider">Versículo Favorito</span>
                                </div>
                                <p className="text-white/60 text-xs italic leading-relaxed">"{currentUser.favorite_verse}"</p>
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* Footer */}
                <div className="text-center mt-10">
                    <p className="text-white/15 text-xs">La Luz del Mundo — Congregación Rodeo</p>
                    <p className="text-white/10 text-[10px] mt-1">Portal del Miembro · {format(now, "d 'de' MMMM yyyy", { locale: es })}</p>
                </div>
            </div>
        </div>
    );
}
