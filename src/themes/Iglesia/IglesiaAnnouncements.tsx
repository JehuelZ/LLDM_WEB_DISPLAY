'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Megaphone, Calendar, Quote, AlertCircle, Info, Star, Bookmark, Bell, Crown, Sunrise, Sun, Moon, User, Users, Music, Baby, Settings, Phone, Mail, Zap, Heart, Facebook, Instagram, Youtube } from 'lucide-react';
import { BigAcademicTitle, ChurchHeaderBadge } from './BigAcademicTitle';
import { getIglesiaTokens, neuShadow } from './tokens';
import { IglesiaClockInline } from './Clock';
import { getSlideSystemTitle } from '@/lib/display_labels';
import { format, parseISO, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { getActiveAnnouncements } from '@/lib/utils';

// ──────────────────────────────────────────────────────────────────────────────
// Iglesia — Announcements Slide (Stacked Cards)
// ──────────────────────────────────────────────────────────────────────────────

export function IglesiaAnnouncements() {
    const { announcements, minister, settings, members, loadMembersFromCloud, monthlySchedule, currentDate, theme } = useAppStore((s: any) => s);

    useEffect(() => {
        if (loadMembersFromCloud) loadMembersFromCloud();
    }, [loadMembersFromCloud]);
    const iglesiaVariant = settings?.iglesiaVariant || 'light';
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    // --- Automatic Announcements Detection ---
    const autoAnnouncements: any[] = [];
    const todayDate = currentDate ? parseISO(currentDate) : new Date();

    if (monthlySchedule) {
        // 0. Weekly Theme Announcement (Always shown if exists)
        if (theme && theme.title) {
            autoAnnouncements.push({
                id: `auto-theme-${theme.id}`,
                title: `Tema: ${theme.title}`,
                content: theme.description || `Esta semana meditaremos en el tema: "${theme.title}". Les invitamos a profundizar en el estudio de la palabra.`,
                priority: 'normal',
                category: 'important',
                authorName: 'Ministerio LLDM',
                targetGroup: 'Toda la Iglesia',
                timestamp: new Date().toISOString(),
                active: true
            });
        }

        // Look ahead 4 days for immediate special events (contextual and immediate)
        let foundKids = false;
        let foundEnglish = false;

        for (let i = 0; i < 4; i++) {
            const d = addDays(todayDate, i);
            const k = format(d, 'yyyy-MM-dd');
            const daySched = monthlySchedule[k];

            if (daySched) {
                // 1. Immediate Kids Service Detection
                if (!foundKids && daySched.slots.evening?.type === 'children') {
                    autoAnnouncements.push({
                        id: `auto-kids-${k}`,
                        title: 'Servicio de Niños',
                        content: `🎉 ¡Atención! El ${format(d, 'eeee d', { locale: es })} será nuestro próximo Servicio Especial de Niños. ¡Les esperamos!`,
                        priority: 'urgent',
                        category: 'kids',
                        authorName: 'Departamento Infantil',
                        targetGroup: 'Niños y Padres',
                        timestamp: new Date().toISOString(),
                        active: true
                    });
                    foundKids = true;
                }

                // 2. Immediate English Service Detection
                if (!foundEnglish) {
                    const slotsArray = Object.entries(daySched.slots || {});
                    const englishSlot = slotsArray.find(([_, s]: any) => s?.language === 'en');

                    if (englishSlot) {
                        autoAnnouncements.push({
                            id: `auto-en-${k}`,
                            title: 'English Service',
                            content: `🇺🇸 We inform you that the service on ${format(d, 'eeee d', { locale: es })} will be held in English. Join us!`,
                            priority: 'urgent',
                            category: 'general',
                            authorName: 'Church Administration',
                            targetGroup: 'General',
                            timestamp: new Date().toISOString(),
                            active: true
                        });
                        foundEnglish = true;
                    }
                }

                // If both are found, we can stop scanning to keep it immediate
                if (foundKids && foundEnglish) break;
            }
        }
    }

    const activeManual = React.useMemo(() => getActiveAnnouncements(announcements || []), [announcements]);

    let allActive = [...activeManual, ...autoAnnouncements]
        .filter((a, index, self) => self.findIndex(t => t.id === a.id) === index);

    // 3. Absolute Fallback: If nothing exists, show the next immediate service from schedule
    if (allActive.length === 0 && monthlySchedule) {
        for (let i = 0; i < 3; i++) {
            const d = addDays(todayDate, i);
            const k = format(d, 'yyyy-MM-dd');
            const daySched = monthlySchedule[k];
            if (daySched) {
                const nextSrv = daySched.slots.evening || daySched.slots['5am'];
                if (nextSrv) {
                    allActive = [{
                        id: `auto-fallback-${k}`,
                        title: 'Próxima Convocación',
                        content: `Les invitamos a nuestro próximo servicio este ${format(d, 'eeee d', { locale: es })}. La paz de Dios reine en sus corazones.`,
                        priority: 'normal',
                        category: 'general',
                        authorName: 'Administración',
                        targetGroup: 'General',
                        timestamp: new Date().toISOString(),
                        active: true
                    }];
                    break;
                }
            }
        }
    }

    const [page, setPage] = useState(0);
    const pageSize = 3;
    const totalPages = Math.ceil(allActive.length / pageSize);

    useEffect(() => {
        if (totalPages <= 1) return;
        const interval = setInterval(() => {
            setPage(prev => (prev + 1) % totalPages);
        }, 10000); // Cycle every 10 seconds to sync with main display
        return () => clearInterval(interval);
    }, [totalPages]);

    // Current page subset
    const list = allActive.slice(page * pageSize, (page + 1) * pageSize);

    // --- Dynamic Team Logic ---
    const normalize = (val: string) => val?.toLowerCase().trim() || '';

    const isRole = (m: any, term: string) => {
        const r = normalize(m.role);
        return r.includes(term) || r.includes('responsable') || r.includes('encargado') || r.includes('lider') || r.includes('líder');
    };

    const isGroup = (m: any, term: string) => {
        const g = normalize(m.member_group);
        return g.includes(term);
    };

    const isAdmin = (m: any) => {
        const r = normalize(m.role);
        const g = normalize(m.member_group);
        const p = m.privileges || [];
        return r.includes('admin') || r.includes('secretar') || g.includes('admin') || g.includes('oficina') || p.some((priv: string) => normalize(priv).includes('admin'));
    };

    const categories = [
        { label: 'Coro', icon: Music, color: T.accent, criteria: (m: any) => (m.privileges?.includes('choir') || normalize(m.role).includes('coro')) && isRole(m, 'coro'), key: 'coro' },
        { label: 'Jóvenes', icon: Zap, color: T.secondary, criteria: (m: any) => isGroup(m, 'joven') && isRole(m, 'joven'), key: 'jovenes' },
        { label: 'Niños', icon: Baby, color: '#FF9F1C', criteria: (m: any) => (isGroup(m, 'niño') || isGroup(m, 'niña') || m.privileges?.includes('kids_leader')) && isRole(m, 'niño'), key: 'ninos' },
        { label: 'Solos', icon: Heart, color: '#E91E63', criteria: (m: any) => isGroup(m, 'solos') && isRole(m, 'solos'), key: 'solos' },
        { label: 'Administración', icon: Settings, color: T.tertiary, criteria: (m: any) => isAdmin(m), key: 'admin' }
    ];

    const teamData: any[] = [];
    categories.forEach(cat => {
        const found = (members || []).filter(cat.criteria);
        if (found.length > 0) {
            found.forEach((m: any) => {
                teamData.push({ ...cat, member: m });
            });
        } else {
            // Fallback to mock if no real members found for this specific category
            const MOCK_MAP: Record<string, any> = {
                'coro': { name: 'Samuel Hernández', phone: '555-0101', email: 'samuel@lldm.org' },
                'jovenes': { name: 'David Rojas', phone: '555-0202', email: 'david@lldm.org' },
                'ninos': { name: 'María García', phone: '555-0303', email: 'maria@lldm.org' },
                'admin': { name: 'Pedro Morales', phone: '555-0404', email: 'pedro@lldm.org' }
            };
            if (MOCK_MAP[cat.key]) {
                teamData.push({ ...cat, member: MOCK_MAP[cat.key] });
            }
        }
    });

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '200px 30px 180px 30px', gap: 30, background: T.bg, fontFamily: T.fontFamily, overflow: 'hidden' }}>



            {/* Main Content — Centered between header and weather */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, minHeight: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ width: 'fit-content', minWidth: 600 }}>
                        <BigAcademicTitle
                            label={getSlideSystemTitle('announcements', settings?.language)}
                            icon={Bell}
                            T={T}
                            isDark={isDark}
                            small={true}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', gap: 30 }}>
                    {/* Left Column: List of announcements */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <AnimatePresence>
                            {list.length > 0 ? (
                                <motion.div
                                    key={page}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                                >
                                    {list.map((ann: any, idx: number) => (
                                        <motion.div
                                            key={ann.id}
                                            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                            style={{
                                                position: 'relative', padding: '24px 32px', borderRadius: 28,
                                                background: T.surface, border: isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${T.border}`,
                                                boxShadow: neuShadow(T, false, 'md', isDark),
                                                display: 'flex', gap: 24, overflow: 'hidden'
                                            }}
                                        >
                                            {/* Left Accent Bar */}
                                            <div style={{
                                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
                                                background: ann.priority === 'urgent' ? T.accent : T.secondary
                                            }} />

                                            {/* Icon / Image */}
                                            <div style={{
                                                width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                                                background: ann.priority === 'urgent' ? `${T.accent}15` : `${T.secondary}15`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {ann.imageUrl ? (
                                                    <img src={ann.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                                ) : (
                                                    ann.priority === 'urgent' ? <AlertCircle style={{ color: T.accent }} /> : <Info style={{ color: T.secondary }} />
                                                )}
                                            </div>

                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {/* Title in RELIEF (Raised) */}
                                                    <div style={{
                                                        padding: '10px 30px',
                                                        borderRadius: 18,
                                                        background: T.surface,
                                                        boxShadow: neuShadow(T, false, 'sm', isDark),
                                                        width: 'fit-content',
                                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                                    }}>
                                                        <h3 style={{
                                                            fontSize: 22,
                                                            fontWeight: 700,
                                                            color: T.textPrimary,
                                                            fontFamily: T.fontMontserrat,
                                                            letterSpacing: '-0.01em',
                                                            margin: 0
                                                        }}>
                                                            {ann.title}
                                                        </h3>
                                                    </div>

                                                    {ann.priority === 'urgent' && (
                                                        <span style={{
                                                            fontSize: 10, fontWeight: 800, color: '#FFF',
                                                            background: T.accent, padding: '4px 12px', borderRadius: 12,
                                                            textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: T.fontMontserrat
                                                        }}>
                                                            Urgente
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Message in DEPTH (Pressed/Inset) */}
                                                <div style={{
                                                    padding: '20px 24px',
                                                    borderRadius: 20,
                                                    background: T.surface,
                                                    boxShadow: neuShadow(T, true, 'sm', isDark),
                                                    marginTop: 4
                                                }}>

                                                    <p style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                        color: T.textSecondary,
                                                        lineHeight: 1.6,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        fontFamily: T.fontInter,
                                                        margin: 0
                                                    }}>
                                                        {ann.content}
                                                    </p>
                                                </div>

                                                {/* Metadata Footer: Author & Target Group */}
                                                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                        padding: '4px 12px', borderRadius: 10,
                                                        background: T.surface,
                                                        boxShadow: neuShadow(T, false, 'sm', isDark),
                                                        border: isDark ? '1px solid rgba(255,255,255,0.03)' : 'none'
                                                    }}>
                                                        <User size={12} style={{ color: T.accent }} />
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, fontFamily: T.fontMontserrat, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            {ann.authorName || 'Admin'}
                                                        </span>
                                                    </div>

                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                        padding: '4px 12px', borderRadius: 10,
                                                        background: T.surface,
                                                        boxShadow: neuShadow(T, false, 'sm', isDark),
                                                        border: isDark ? '1px solid rgba(255,255,255,0.03)' : 'none'
                                                    }}>
                                                        <Users size={12} style={{ color: T.secondary }} />
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, fontFamily: T.fontMontserrat, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            {ann.targetGroup || 'General'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5 }}>
                                    <Megaphone size={48} />
                                    <p>No hay anuncios recientes</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Minister / Featured Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Blue Highlight Vignette (Sunday Style) */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.4, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute', top: '15%', left: '80%', transform: 'translate(-50%, -50%)',
                                    width: 400, height: 400, borderRadius: '50%',
                                    background: T.accent,
                                    opacity: 0.1,
                                    filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none'
                                }}
                            />

                            {/* Minister Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    padding: 32, borderRadius: 40, background: T.surface,
                                    boxShadow: neuShadow(T, false, 'md', isDark),
                                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${T.border}`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
                                    textAlign: 'center', position: 'relative', zIndex: 1,
                                    width: '100%', maxWidth: 620, alignSelf: 'center'
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    {/* Relief Outer Ring (Pressed Effect) */}
                                    <div style={{
                                        width: 150, height: 150, borderRadius: '50%',
                                        background: T.surface,
                                        boxShadow: neuShadow(T, true, 'sm', isDark),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: 124, height: 124, borderRadius: '50%', overflow: 'hidden',
                                            padding: 4, background: T.surface,
                                            boxShadow: `0 8px 20px ${T.accent}25`,
                                            border: `2px solid ${T.accent}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <img src={minister.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                        </div>

                                        {/* Status Badge */}
                                        <div style={{
                                            position: 'absolute', bottom: 12, right: 12,
                                            background: T.accent, padding: 8, borderRadius: '50%',
                                            color: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            border: `2px solid ${T.surface}`,
                                            zIndex: 2
                                        }}>
                                            <Star size={16} fill="#FFF" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                    {/* Name in RELIEF (Raised Plaque) */}
                                    <div style={{
                                        padding: '8px 28px',
                                        borderRadius: 16,
                                        background: T.surface,
                                        boxShadow: neuShadow(T, false, 'sm', isDark),
                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        width: 'fit-content'
                                    }}>
                                        <h4 style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontMontserrat, margin: 0 }}>{minister.name}</h4>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: T.fontMontserrat, margin: 0 }}>Ministro a Cargo</p>

                                    {/* Minister Contact Info (Added back for completeness) */}
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', opacity: 0.9, marginTop: -4 }}>
                                        {minister.phone && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Phone size={11} style={{ color: T.textMuted }} />
                                                <span style={{ fontSize: 11, fontWeight: 500, color: T.textSecondary, fontFamily: T.fontInter }}>{minister.phone}</span>
                                            </div>
                                        )}
                                        {minister.email && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Mail size={11} style={{ color: T.textMuted }} />
                                                <span style={{ fontSize: 11, fontWeight: 500, color: T.textSecondary, fontFamily: T.fontInter }}>{minister.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Media Row (Neumorphic Style) */}
                                    <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                                        {[
                                            { icon: Facebook, url: settings?.facebookUrl, color: '#1877F2' },
                                            { icon: Instagram, url: settings?.instagramUrl, color: '#E4405F' },
                                            { icon: Youtube, url: settings?.youtubeUrl, color: '#FF0000' },
                                            { icon: Info, url: settings?.customSocialUrl, color: T.accent, label: settings?.customSocialLabel }
                                        ].filter(s => s.url).map((s, idx) => (
                                            <div key={idx} style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: T.surface,
                                                boxShadow: neuShadow(T, false, 'sm', isDark),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                position: 'relative'
                                            }}>
                                                <s.icon size={16} style={{ color: s.color }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Team Directory / Contact Board (Dynamic & Conditional) */}
                            {teamData.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        padding: '30px 32px',
                                        borderRadius: 40,
                                        background: T.surface,
                                        boxShadow: neuShadow(T, false, 'sm', isDark),
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 24,
                                        width: '100%',
                                        maxWidth: 620,
                                        alignSelf: 'center',
                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${T.border}`
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                                        <Settings size={20} style={{ color: T.accent }} />
                                        <h5 style={{ fontSize: 13, fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: T.fontMontserrat, margin: 0 }}>Directorio de Atención</h5>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '24px 30px'
                                    }}>
                                        {teamData.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                                <div style={{
                                                    width: 44, height: 44, borderRadius: 12,
                                                    background: `${item.color}15`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: `1px solid ${item.color}20`,
                                                    marginTop: 2, flexShrink: 0
                                                }}>
                                                    <item.icon size={20} style={{ color: item.color }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: 9, fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: T.fontMontserrat }}>{item.label}</span>
                                                        <span style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontMontserrat, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {item.member.name}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, opacity: 0.8 }}>
                                                        {item.member.phone && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                                <Phone size={10} style={{ color: T.textMuted }} />
                                                                <span style={{ fontSize: 10, fontWeight: 500, color: T.textSecondary, fontFamily: T.fontInter }}>{item.member.phone}</span>
                                                            </div>
                                                        )}
                                                        {item.member.email && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                                <Mail size={10} style={{ color: T.textMuted }} />
                                                                <span style={{ fontSize: 10, fontWeight: 500, color: T.textSecondary, fontFamily: T.fontInter, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.member.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
