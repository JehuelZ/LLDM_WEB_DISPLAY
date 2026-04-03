'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Crown, Sunrise, Sun, Moon, Calendar, Clock, Video, Zap, Info, BookOpen } from 'lucide-react';
import { BigAcademicTitle, ChurchHeaderBadge } from './BigAcademicTitle';
import { getIglesiaTokens, neuShadow } from './tokens';
import { IglesiaClockInline } from './Clock';
import { getSlideSystemTitle, getSlotLabel } from '@/lib/display_labels';

// ──────────────────────────────────────────────────────────────────────────────
// Componentes de Estilo — Academic Buttons (Copied from Agenda)
// ──────────────────────────────────────────────────────────────────────────────

function AcademicButton({ label, icon: Icon, primary = false, variant, T, isDark, isLive = false, isTomorrow = false }: { label: string; icon: any; primary?: boolean; variant?: 'reliefMinimal' | 'reliefAccent' | 'reliefAura'; T: any; isDark: boolean; isLive?: boolean; isTomorrow?: boolean }) {
    const isReliefMinimal = variant === 'reliefMinimal';
    const isReliefAccent = variant === 'reliefAccent';
    const isReliefAura = variant === 'reliefAura';
    const isRelief = isReliefMinimal || isReliefAccent || isReliefAura;

    let shadow = '';
    if (primary) {
        shadow = `0 10px 25px ${T.secondary}60, ${neuShadow(T, false, 'sm', isDark)}`;
    } else if (isReliefAura) {
        shadow = isDark
            ? `0 0 20px ${T.secondary}30, 5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 15px rgba(255, 255, 255, 0.04)`
            : `0 0 15px ${T.secondary}20, 4px 4px 10px rgba(0, 0, 0, 0.04), -4px -4px 12px #FFFFFF`;
    } else if (isRelief) {
        shadow = isDark
            ? `5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 15px rgba(255, 255, 255, 0.04)`
            : `4px 4px 10px rgba(0, 0, 0, 0.04), -4px -4px 12px #FFFFFF`;
    } else {
        shadow = isDark ? neuShadow(T, true, 'md', isDark) : neuShadow(T, false, 'sm', isDark);
    }

    if (isLive) shadow = `0 0 25px ${T.accent}70, ${shadow}`;

    let contentColor = T.textPrimary;
    if (primary) contentColor = '#FFFFFF';
    else if (isReliefMinimal) contentColor = '#94a3b8';
    else if (isReliefAccent || isReliefAura) contentColor = T.secondary;
    else if (isDark) contentColor = '#FFFFFF';

    return (
        <div style={{
            width: '100%', height: 38, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: primary ? T.secondary : T.surface,
            boxShadow: shadow,
            border: primary ? 'none' : (isReliefAura ? `1px solid ${T.secondary}15` : 'none'),
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: primary ? 2 : 1
        }}>
            <Icon style={{ width: 14, height: 14, color: contentColor }} />
            <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: contentColor,
                fontFamily: T.fontMontserrat,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                paddingRight: 8
            }}>
                {label}
            </span>
        </div>
    );
}

function TimeBadge({ time, T, isDark }: { time: string; T: any; isDark: boolean }) {
    if (!time) return null;
    return (
        <div style={{
            padding: '4px 12px', borderRadius: 12,
            background: T.surface,
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: isDark ? `inset 3px 3px 6px rgba(0,0,0,0.6), inset -2px -2px 4px rgba(255,255,255,0.04)` : 'none',
            border: 'none',
            width: 'fit-content',
            marginBottom: 8
        }}>
            <Clock style={{ width: 11, height: 11, color: T.textMuted }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: T.textSecondary, letterSpacing: '0.05em', fontFamily: T.fontInter }}>
                {time.split('-')[0].trim()}
            </span>
        </div>
    );
}

function RoleBadge({ label, icon: Icon, T, isDark }: { label: string; icon?: any; T: any; isDark: boolean }) {
    if (!label) return null;
    return (
        <div style={{
            padding: '4px 10px', borderRadius: 12,
            background: T.surface,
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: isDark ? `inset 3px 3px 6px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)` : 'inset 2px 2px 4px rgba(0,0,0,0.05)',
            border: 'none',
            marginTop: 4,
            width: 'fit-content'
        }}>
            {Icon && <Icon style={{ width: 10, height: 10, color: T.accent }} />}
            <span style={{
                fontSize: 8,
                fontWeight: 800,
                color: T.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: T.fontInter
            }}>
                {label}
            </span>
        </div>
    );
}

function Avatar({ src, size, T, isDark, border, relief }: { src?: string | null; size: number; T: any; isDark: boolean; border?: string; relief?: boolean }) {
    const reliefShadow = isDark
        ? `10px 10px 25px rgba(0, 0, 0, 0.6), -8px -8px 25px rgba(255, 255, 255, 0.03)`
        : `10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px #FFFFFF`;

    return (
        <div style={{
            width: size, height: size, flexShrink: 0,
            borderRadius: '50%', overflow: 'hidden',
            background: T.avatarStyle.background,
            boxShadow: relief ? reliefShadow : T.avatarStyle.boxShadow,
            border: border || (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            padding: 2
        }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                {src ? (
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                    <User style={{ width: size * 0.45, height: size * 0.45, color: T.textMuted }} />
                )}
            </div>
        </div>
    );
}

function SlotBox({ label, color, leader, role, size = 32, T, isDark, isToday, border, useButton, stacked, depth, ribbon }: { label: string; color: string; leader?: any; role: string; size?: number; T: any; isDark: boolean; isToday?: boolean; border?: string; useButton?: boolean; stacked?: boolean; depth?: boolean; ribbon?: boolean }) {
    if (!leader) return null;
    if (stacked) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                width: '100%',
                padding: ribbon ? '12px 0 12px 14px' : '12px 0',
                borderBottom: depth ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                background: depth ? T.surface : 'transparent',
                borderRadius: depth ? 24 : 0,
                boxShadow: depth ? neuShadow(T, true, 'sm', isDark) : 'none',
                marginBottom: 4,
                position: 'relative'
            }}>
                {ribbon && (
                    <div style={{
                        position: 'absolute', left: 0, top: 10, bottom: 10, width: 14,
                        background: color, borderRadius: '12px 0 0 12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2
                    }}>
                        <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', color: '#FFF', fontSize: 7, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {label}
                        </span>
                    </div>
                )}
                <div style={{ position: 'relative' }}>
                    {color === T.accent && (
                        <div style={{
                            position: 'absolute', inset: -10, borderRadius: '50%',
                            background: color, opacity: 0.3, filter: 'blur(10px)',
                            zIndex: -1
                        }} />
                    )}
                    <Avatar src={leader.avatar} size={size} T={T} isDark={isDark} border={border} />
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
                    {!ribbon && (
                        <p style={{ fontSize: 7, fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: T.fontInter }}>
                            {label}
                        </p>
                    )}
                    {useButton ? (
                        <div style={{ width: '90%', margin: '0 auto' }}>
                            <AcademicButton
                                label={leader.name}
                                icon={User}
                                variant={depth ? undefined : 'reliefAura'}
                                T={T}
                                isDark={isDark}
                            />
                        </div>
                    ) : (
                        <p style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#FFFFFF' : T.textPrimary, fontFamily: T.fontMontserrat, lineHeight: 1.2 }}>
                            {leader.name}
                        </p>
                    )}
                    <RoleBadge label={role} icon={role === 'Consagración' ? Sunrise : (role.includes('Doctrina') ? BookOpen : (role.includes('Director') ? User : Sunrise))} T={T} isDark={isDark} />
                </div>
            </div>
        );
    }
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            width: '100%',
            padding: '6px 0'
        }}>
            <Avatar src={leader.avatar} size={size} T={T} isDark={isDark} border={border} />
            <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 7.5, fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: T.fontInter, marginBottom: 3 }}>
                    {label}
                </p>
                {useButton ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <AcademicButton
                            label={leader.name}
                            icon={User}
                            variant="reliefAura"
                            T={T}
                            isDark={isDark}
                        />
                        <RoleBadge label={role} icon={role === 'Consagración' ? Sunrise : BookOpen} T={T} isDark={isDark} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: (isDark || isToday) ? '#FFFFFF' : T.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: T.fontMontserrat }}>
                            {leader.name}
                        </p>
                        <RoleBadge label={role} icon={role === 'Consagración' ? Sunrise : BookOpen} T={T} isDark={isDark} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function IglesiaWeekly() {
    const { monthlySchedule, members, settings } = useAppStore((s: any) => s);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const iglesiaVariant = settings?.iglesiaVariant || 'light';
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    const isSlotActive = (dateKey: string, slotId: '5am' | '9am' | 'evening' | '12pm') => {
        const todayKey = format(currentTime, 'yyyy-MM-dd');
        if (dateKey !== todayKey) return false;

        const curMin = currentTime.getHours() * 60 + currentTime.getMinutes();
        const isSunday = currentTime.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
            '12pm': { start: '12:00', end: '13:00' },
            'evening': { start: '18:30', end: '20:30' },
        };

        const parseTimeStr = (t?: string) => {
            if (!t) return null;
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (!match) return null;
            let [_, hStr, mStr, period] = match;
            let h = parseInt(hStr, 10);
            let m = parseInt(mStr, 10);
            if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
            if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        const sched = monthlySchedule[dateKey];
        const slot = (sched?.slots as any)?.[slotId];
        let start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        let end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;

        // Special handling for Sunday Dominical (the 9am slot is used for the morning service)
        if (slotId === '9am' && isSunday) {
            // If the DB record exists but has default weekday times (9-10 AM)
            // we override it to Dominical times (10-12 PM) unless explicitly changed
            if (slot?.time === '09:00 AM' || !slot?.time) start = 600; // 10:00 AM
            if (slot?.endTime === '10:00 AM' || !slot?.endTime) end = 720; // 12:00 PM
        }

        return curMin >= start && curMin <= end;
    };

    const getMember = (id?: string) => {
        if (!id) return null;
        const m = members?.find((x: any) => x.id?.toString().toLowerCase() === id.trim().toLowerCase());
        return m ? { name: m.name, avatar: m.avatar || m.avatarUrl } : { name: id.length > 20 ? 'Asig.' : id, avatar: null };
    };

    const week = [...Array(7)].map((_, i) => {
        const date = addDays(new Date(), i);
        const key = format(date, 'yyyy-MM-dd');
        const sched = monthlySchedule?.[key];
        const isSun = date.getDay() === 0;
        const isToday = key === format(currentTime, 'yyyy-MM-dd');
        const color = isToday ? T.accent : (isSun ? T.secondary : T.textMuted);

        const leader5am = getMember(sched?.slots?.['5am']?.leaderId);
        const consec9am = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
        const doctrine9am = getMember(sched?.slots?.['9am']?.doctrineLeaderId);
        
        const evLeader1 = getMember(sched?.slots?.['evening']?.leaderIds?.[0]);
        const evLeader2 = getMember(sched?.slots?.['evening']?.doctrineLeaderId) || getMember(sched?.slots?.['evening']?.leaderIds?.[1]);
        const evLeaders = [evLeader1, evLeader2].filter(Boolean);

        return { date, key, isSun, isToday, color, leader5am, consec9am, doctrine9am, evLeaders, sched };
    });

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '24px 30px 180px 30px', gap: 20, fontFamily: T.fontFamily }}>


            {/* Title & Columns Section — Centered vertically between header & weather */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, minHeight: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 'fit-content', minWidth: 600 }}>
                        <BigAcademicTitle
                            label={getSlideSystemTitle('weekly_program', settings?.language)}
                            icon={Calendar}
                            T={T}
                            isDark={isDark}
                            small={true}
                        />
                    </div>
                </div>

                {/* 7 Columns */}
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', minHeight: 0 }}>
                    {week.map(({ date, key, isToday, isSun, color, leader5am, consec9am, doctrine9am, evLeaders, sched }, ci) => {
                        return (
                            <div
                                key={ci}
                                style={{
                                    flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 40,
                                    background: T.surface,
                                    boxShadow: isToday
                                        ? `0 0 60px ${T.accent}40, ${neuShadow(T, false, 'lg', isDark)}`
                                        : neuShadow(T, false, 'lg', isDark),
                                    overflow: 'hidden',
                                    border: isToday ? `3px solid ${T.accent}` : 'none',
                                    position: 'relative',
                                    scale: isToday ? 1.02 : 1,
                                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                {/* Day Header - Academic Tag Style */}
                                <div style={{
                                    background: isToday ? T.accent : T.surface,
                                    padding: '12px 10px',
                                    textAlign: 'center',
                                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)'
                                }}>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: isToday ? '#FFFFFF' : T.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: T.fontMontserrat }}>
                                        {format(date, 'EEEE', { locale: es }).split('-')[0].slice(0, 3)}
                                    </p>
                                    <p style={{ fontSize: 36, fontWeight: 900, color: isToday ? '#FFFFFF' : T.textPrimary, lineHeight: 1, marginTop: 6, fontFamily: T.fontMontserrat }}>
                                        {format(date, 'd')}
                                    </p>
                                </div>

                                {/* Slots Container */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px' }}>
                                    {leader5am && (() => {
                                        const isActive = isSlotActive(key, '5am');
                                        return (
                                            <>
                                                {/* 5 AM Header */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    borderTop: `1px solid ${isActive ? T.accent + '60' : (isToday ? T.tertiary + '40' : T.textMuted + '20')}`,
                                                    paddingTop: 6, marginTop: 4, marginBottom: 4, position: 'relative'
                                                }}>
                                                    <TimeBadge time={sched?.slots?.['5am']?.time || "05:00 AM"} T={T} isDark={isDark} />
                                                    {isActive && (
                                                        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', right: 0, top: 4, background: T.accent, padding: '2px 6px', borderRadius: 4, fontSize: 7, fontWeight: 900, color: '#FFF' }}>
                                                            EN CURSO
                                                        </motion.div>
                                                    )}
                                                    <p style={{ fontSize: 7, fontWeight: 900, color: isActive ? T.accent : T.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontInter, textAlign: 'right' }}>
                                                        {sched?.slots?.['5am']?.customLabel || getSlotLabel('5am', settings?.language)}
                                                    </p>
                                                </div>

                                                <motion.div
                                                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{
                                                        padding: '8px 10px',
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        background: T.surface,
                                                        borderRadius: 20,
                                                        boxShadow: isActive ? `0 0 20px ${T.accent}30, ${neuShadow(T, true, 'sm', isDark)}` : neuShadow(T, true, 'sm', isDark),
                                                        border: isActive ? `1.5px solid ${T.accent}` : 'none',
                                                        marginBottom: 4,
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Avatar src={leader5am.avatar} size={60} T={T} isDark={isDark} relief={true} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />

                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 800, color: isActive ? T.accent : (isDark ? '#FFFFFF' : T.textPrimary), fontFamily: T.fontMontserrat, lineHeight: 1.1, marginBottom: 4 }}>
                                                            {leader5am.name}
                                                        </p>
                                                        <RoleBadge label="Consagración" icon={Sunrise} T={T} isDark={isDark} />
                                                    </div>
                                                </motion.div>
                                            </>
                                        );
                                    })()}

                                    {isSun ? (
                                        (() => {
                                            const isActive = isSlotActive(key, '9am');
                                            const type = sched?.slots?.['9am']?.sundayType || 'local';
                                            const minister = useAppStore.getState().minister;
                                            const types: Record<string, { label: string; icon: any }> = {
                                                local: { label: 'Min. Local', icon: Crown },
                                                exchange: { label: 'Intercambio', icon: Zap },
                                                broadcast: { label: 'Transmisión', icon: Video },
                                                visitors: { label: 'Visitas', icon: User }
                                            };
                                            const current = types[type] || types.local;

                                            if (type === 'local' && minister?.name) {
                                                const consL = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                                                const docL = getMember(sched?.slots?.['9am']?.doctrineLeaderId);

                                                return (
                                                    <motion.div
                                                        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        style={{ padding: '4px 0', width: '100%', position: 'relative' }}
                                                    >
                                                        {isActive && (
                                                            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', right: 10, top: 4, zIndex: 10, background: T.accent, padding: '2px 8px', borderRadius: 4, fontSize: 8, fontWeight: 900, color: '#FFF' }}>
                                                                EN CURSO
                                                            </motion.div>
                                                        )}
                                                        <SlotBox
                                                            label={sched?.slots?.['9am']?.customLabel || sched?.slots?.['9am']?.topic || 'Escuela Dominical'}
                                                            color={isActive ? T.accent : T.secondary}
                                                            leader={{ name: minister.name, avatar: minister.avatar }}
                                                            role="Ministro Local"
                                                            size={100}
                                                            T={T}
                                                            isDark={isDark}
                                                            isToday={isToday}
                                                            border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`}
                                                            useButton={true}
                                                            stacked={true}
                                                            depth={isActive}
                                                        />
                                                        
                                                        {(consL || docL) && (
                                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                                                                {consL?.name && <RoleBadge label={`Cons: ${consL.name.split(' ')[0]}`} T={T} isDark={isDark} />}
                                                                {docL?.name && docL.name !== minister.name && <RoleBadge label={`Clase: ${docL.name.split(' ')[0]}`} T={T} isDark={isDark} />}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            }

                                            return (
                                                <motion.div
                                                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                                                        width: '100%', padding: '12px 0',
                                                        border: isActive ? `2px solid ${T.accent}` : 'none',
                                                        borderRadius: 24,
                                                        background: isActive ? `${T.accent}10` : 'transparent',
                                                        borderBottom: isActive ? `2px solid ${T.accent}` : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                                        marginBottom: 8,
                                                        boxShadow: isActive ? `0 0 20px ${T.accent}20` : 'none'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 86, height: 86, borderRadius: '50%',
                                                        background: isActive ? T.accent : `linear-gradient(135deg, ${T.secondary}, ${T.secondary}dd)`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: isActive ? `0 8px 30px ${T.accent}60` : `0 8px 20px ${T.secondary}40`,
                                                        border: T.avatarStyle.border
                                                    }}>
                                                        <current.icon style={{ width: 32, height: 32, color: '#FFFFFF' }} />
                                                    </div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontSize: 7, fontWeight: 900, color: isActive ? T.accent : T.secondary, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: T.fontInter, marginBottom: 4 }}>
                                                            {sched?.slots?.['9am']?.customLabel || sched?.slots?.['9am']?.topic || getSlotLabel('9am_sunday', settings?.language)}
                                                        </p>
                                                        <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? T.accent : ((isDark || isToday) ? '#FFFFFF' : T.textPrimary), fontFamily: T.fontMontserrat }}>
                                                            {current.label} {isActive && ' (EN CURSO)'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })()
                                    ) : (
                                        <>
                                            {/* 9 AM Regular Header */}
                                            {(() => {
                                                const isActive = isSlotActive(key, '9am');
                                                return (
                                                    <>
                                                        <div style={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            borderTop: `1px solid ${isActive ? T.accent + '60' : (isToday ? T.secondary + '40' : T.textMuted + '20')}`,
                                                            paddingTop: 6, marginTop: 4, marginBottom: 4, position: 'relative'
                                                        }}>
                                                            <TimeBadge time={sched?.slots?.['9am']?.time || "09:00 AM"} T={T} isDark={isDark} />
                                                            {isActive && (
                                                                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', right: 0, top: 4, background: T.accent, padding: '2px 6px', borderRadius: 4, fontSize: 7, fontWeight: 900, color: '#FFF' }}>
                                                                    ESTUDIO
                                                                </motion.div>
                                                            )}
                                                            <p style={{ fontSize: 7, fontWeight: 900, color: isActive ? T.accent : T.secondary, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontInter, textAlign: 'right' }}>
                                                                {sched?.slots?.['9am']?.customLabel || getSlotLabel('9am_regular', settings?.language)}
                                                            </p>
                                                        </div>

                                                        {consec9am && (
                                                            <motion.div
                                                                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                                style={{
                                                                    background: T.surface,
                                                                    borderRadius: 18, padding: '8px 10px',
                                                                    boxShadow: isActive ? `0 0 20px ${T.accent}30, ${neuShadow(T, true, 'sm', isDark)}` : neuShadow(T, true, 'sm', isDark),
                                                                    border: isActive ? `1.5px solid ${T.accent}` : 'none',
                                                                    display: 'flex', flexDirection: 'column', gap: 10,
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                                                    <Avatar src={consec9am?.avatar} size={64} T={T} isDark={isDark} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                                    {doctrine9am?.avatar && (
                                                                        <div style={{ marginLeft: -18 }}>
                                                                            <Avatar src={doctrine9am?.avatar} size={64} T={T} isDark={isDark} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? T.accent : (isDark ? '#FFFFFF' : T.textPrimary), lineHeight: 1.1, fontFamily: T.fontMontserrat, marginBottom: 4 }}>
                                                                        {consec9am?.name === doctrine9am?.name ? (consec9am?.name || 'NO ASIGNADO') : `${consec9am?.name || 'NO ASIGNADO'} | ${doctrine9am?.name || 'NO ASIGNADO'}`}
                                                                    </p>
                                                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', opacity: isActive ? 1 : 0.8 }}>
                                                                        <RoleBadge label="Cons." icon={Sunrise} T={T} isDark={isDark} />
                                                                        <RoleBadge label="Doc." icon={BookOpen} T={T} isDark={isDark} />
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}

                                    {/* 12 PM - Optional Prayer */}
                                    {sched?.slots?.['12pm']?.leaderId && (() => {
                                        const leader12pm = getMember(sched?.slots?.['12pm']?.leaderId);
                                        const isActive = isSlotActive(key, '12pm');
                                        if (!leader12pm) return null;
                                        return (
                                            <div style={{ marginBottom: 20 }}>
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    borderTop: `1px solid ${isActive ? T.accent + '60' : T.textMuted + '20'}`,
                                                    paddingTop: 6, marginTop: 4, marginBottom: 4, position: 'relative'
                                                }}>
                                                    <TimeBadge time={sched?.slots?.['12pm']?.time || "12:00 PM"} T={T} isDark={isDark} />
                                                    {isActive && (
                                                        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', right: 0, top: 4, background: T.accent, padding: '2px 6px', borderRadius: 4, fontSize: 7, fontWeight: 900, color: '#FFF' }}>
                                                            EN CURSO
                                                        </motion.div>
                                                    )}
                                                    <p style={{ fontSize: 7, fontWeight: 900, color: isActive ? T.accent : T.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontInter, textAlign: 'right' }}>
                                                        {sched?.slots?.['12pm']?.customLabel || "Oración/Visitas"}
                                                    </p>
                                                </div>
                                                <motion.div
                                                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{
                                                        padding: '8px 10px',
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        background: T.surface,
                                                        borderRadius: 20,
                                                        boxShadow: isActive ? `0 0 20px ${T.accent}30, ${neuShadow(T, true, 'sm', isDark)}` : neuShadow(T, true, 'sm', isDark),
                                                        border: isActive ? `1.5px solid ${T.accent}` : 'none',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Avatar src={leader12pm.avatar} size={60} T={T} isDark={isDark} relief={true} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 800, color: isActive ? T.accent : (isDark ? '#FFFFFF' : T.textPrimary), fontFamily: T.fontMontserrat, lineHeight: 1.1, marginBottom: 4 }}>
                                                            {leader12pm.name}
                                                        </p>
                                                        <RoleBadge label="Oración" icon={Sun} T={T} isDark={isDark} />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })()}

                                    {evLeaders.length > 0 && (() => {
                                        const isActive = isSlotActive(key, 'evening');
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                {/* Evening Header */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    borderTop: `1px solid ${isActive ? T.accent + '80' : (isToday ? T.accent + '40' : T.textMuted + '20')}`,
                                                    paddingTop: 8, marginTop: 4, marginBottom: 6, position: 'relative'
                                                }}>
                                                    <TimeBadge time={sched?.slots?.['evening']?.time || "07:00 PM"} T={T} isDark={isDark} />
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {sched?.slots?.evening?.language === 'en' && (
                                                            <div style={{ background: T.accent, padding: '2px 4px', borderRadius: 4, fontSize: 7, fontWeight: 900, color: '#FFF' }}>
                                                                EN
                                                            </div>
                                                        )}
                                                        {isActive && (
                                                            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ background: T.accent, padding: '2px 6px', borderRadius: 4, fontSize: 7, fontWeight: 900, color: '#FFF' }}>
                                                                EN CURSO
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <p style={{ fontSize: 7.5, fontWeight: 900, color: isActive ? T.accent : T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: T.fontInter, textAlign: 'right' }}>
                                                        {sched?.slots?.['evening']?.customLabel || (isSun ? 'Servicio Vespertino' : getSlotLabel('evening_regular', settings?.language))}
                                                    </p>
                                                </div>

                                                {/* Evening Content Container */}
                                                <motion.div
                                                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{
                                                        display: 'flex', flexDirection: 'column', gap: 6,
                                                        background: T.surface,
                                                        borderRadius: 18, padding: '8px 10px',
                                                        boxShadow: isActive ? `0 0 20px ${T.accent}30, ${neuShadow(T, true, 'sm', isDark)}` : neuShadow(T, true, 'sm', isDark),
                                                        border: isActive ? `1.5px solid ${T.accent}` : 'none'
                                                    }}
                                                >
                                                    {evLeaders.length === 1 ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2px 0' }}>
                                                            <Avatar src={evLeaders[0]?.avatar} size={60} T={T} isDark={isDark} relief={true} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p style={{ fontSize: 13, fontWeight: 800, color: isActive ? T.accent : (isDark ? '#FFFFFF' : T.textPrimary), fontFamily: T.fontMontserrat, lineHeight: 1.1, marginBottom: 4 }}>
                                                                    {evLeaders[0]?.name}
                                                                </p>
                                                                <RoleBadge
                                                                    label={isSun ? "Director" : "Consagración y Doctrina"}
                                                                    icon={isSun ? User : Sunrise}
                                                                    T={T} isDark={isDark}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                                                <Avatar src={evLeaders[0]?.avatar} size={60} T={T} isDark={isDark} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                                {evLeaders[1]?.avatar && (
                                                                    <div style={{ marginLeft: -18 }}>
                                                                        <Avatar src={evLeaders[1]?.avatar} size={60} T={T} isDark={isDark} border={isActive ? `1.5px solid ${T.accent}` : `1.5px solid ${T.surface}`} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? T.accent : (isDark ? '#FFFFFF' : T.textPrimary), lineHeight: 1.1, fontFamily: T.fontMontserrat, marginBottom: 4 }}>
                                                                    {evLeaders[0]?.name === evLeaders[1]?.name ? (evLeaders[0]?.name || 'NO ASIGNADO') : `${evLeaders[0]?.name || 'NO ASIGNADO'} | ${evLeaders[1]?.name || 'NO ASIGNADO'}`}
                                                                </p>
                                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', opacity: isActive ? 1 : 0.8 }}>
                                                                    <RoleBadge label={isSun ? "Director" : "Cons."} icon={isSun ? User : Sunrise} T={T} isDark={isDark} />
                                                                    <RoleBadge label={isSun ? "Resp." : "Doc."} icon={isSun ? User : BookOpen} T={T} isDark={isDark} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

