'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Church, Sun, ShieldCheck, Globe, Radio, Users, Crown, HeartHandshake, Mic, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSlotLabel, getServiceTypeLabel } from '@/lib/display_labels';

// ─────────────────────────────────────────────
// THEME: Dark Minimal — inspired by SaaS dark pricing UI
// Palette: bg #0F1117 · card #16171F · blue #3B82F6 · text #FFFFFF/9CA3AF
// ─────────────────────────────────────────────

// ─── SHARED TOKEN SYSTEM ────────────────────
const T = {
    bg: '#0F1117',
    card: '#16171F',
    cardFeatured: '#1C1E2C',
    border: '#23242F',
    borderActive: '#3B82F6',
    blue: '#3B82F6',
    blueLight: '#60A5FA',
    white: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#4B5563',
};

// Live badge
const LiveBadge = () => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30">
        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#EF4444]">En curso</span>
    </div>
);

// Language badge
const LangBadge = ({ lang }: { lang?: 'es' | 'en' }) => {
    if (lang !== 'en') return null;
    return (
        <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] text-[9px] font-semibold uppercase tracking-widest">
            EN
        </span>
    );
};

export function DarkMinimalSchedule({ isTomorrow = false }: { isTomorrow?: boolean } = {}) {
    const { monthlySchedule: scheduleMap, members, minister, settings } = useAppStore((state: any) => state);

    const now = new Date();
    const baseDate = new Date(now);
    if (isTomorrow) baseDate.setDate(baseDate.getDate() + 1);
    const targetDateStr = format(baseDate, 'yyyy-MM-dd');
    const todayStr = format(now, 'yyyy-MM-dd');
    const schedule = scheduleMap[targetDateStr] || scheduleMap[todayStr];
    const displayDate = baseDate;
    const is14th = displayDate.getDate() === 14;

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id.toString().toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'Asignado' : id),
            avatar: member?.avatar || (member as any)?.avatarUrl || null,
        };
    };

    const slot5am = schedule?.slots['5am'];
    const slot9am = schedule?.slots['9am'];
    const slot12pm = schedule?.slots['12pm'];
    const slotEvening = schedule?.slots['evening'];

    const isSlotActive = (slotId: '5am' | '9am' | '12pm' | 'evening') => {
        if (isTomorrow) return false;
        const slot = schedule?.slots[slotId];
        const curMin = now.getHours() * 60 + now.getMinutes();
        const isSunday = displayDate.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunday ? '10:00' : '09:00', end: isSunday ? '12:00' : '10:15' },
            '12pm': { start: '12:00', end: '13:00' },
            'evening': { start: '18:30', end: '20:30' },
        };

        const parseTimeStr = (t?: string) => {
            if (!t) return null;
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (!match) {
                const simpleMatch = t.match(/(\d+)\s*(AM|PM)?/i);
                if (!simpleMatch) return null;
                let h = parseInt(simpleMatch[1], 10);
                const period = simpleMatch[2];
                if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
                if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
                return h * 60;
            }
            let [_, hStr, mStr, period] = match;
            let h = parseInt(hStr, 10);
            let m = parseInt(mStr, 10);
            if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
            if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        const start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        const end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;
        return curMin >= start && curMin <= end;
    };

    const isSunday = displayDate.getDay() === 0;

    // ── SIDE CARD (5am, 9am weekday, 12pm) ──────────────────────────────────
    const SideCard = ({
        label, hour, period, subtitle, avatarUrl, memberName, roleName,
        avatarUrl2, memberName2, roleName2, isActive, language, delay, icon,
    }: {
        label: string; hour: string; period: string; subtitle: string;
        avatarUrl?: string | null; memberName?: string; roleName?: string;
        avatarUrl2?: string | null; memberName2?: string; roleName2?: string;
        isActive?: boolean; language?: 'es' | 'en'; delay: number;
        icon: React.ReactNode;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 80 }}
            className={`relative flex flex-col w-[380px] rounded-2xl overflow-hidden
                bg-[#16171F] border
                ${isActive ? 'border-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_32px_rgba(0,0,0,0.5)]' : 'border-[#23242F] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'}
            `}
        >
            {/* Top accent bar */}
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3B82F6]" />
            )}

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4B5563]">{subtitle}</span>
                    <div className="flex items-center gap-2">
                        <LangBadge lang={language} />
                        {isActive && <LiveBadge />}
                    </div>
                </div>
                <div className="flex items-end gap-1 mt-3">
                    <span className="text-[5rem] font-bold leading-none text-white tracking-tight">{hour}</span>
                    <span className="text-2xl font-semibold text-[#4B5563] mb-2">{period}</span>
                </div>
                <span className="inline-block mt-2 px-3 py-1 rounded-full border border-[#23242F] bg-[#0F1117] text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                    {label}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#23242F] mx-6" />

            {/* Leader area */}
            <div className="px-6 py-5 flex flex-col gap-3">
                {/* Single Leader Stacked Mode */}
                {!memberName2 && (avatarUrl || memberName) ? (
                    <div className="flex flex-col items-center text-center gap-4 py-3">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#3B82F6]/30 bg-[#0F1117] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                            {avatarUrl
                                ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                                : <div className="text-[#4B5563] scale-150">{icon}</div>
                            }
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3B82F6] mb-1">{roleName}</span>
                            <span className="text-[22px] font-bold text-white leading-tight">{memberName || 'Por Asignar'}</span>
                        </div>
                        {isActive && <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                            <Check className="w-3 h-3 text-[#3B82F6]" />
                            <span className="text-[9px] font-bold text-[#3B82F6] uppercase tracking-widest">Confirmado</span>
                        </div>}
                    </div>
                ) : (
                    <>
                        {/* Leader 1 */}
                        {(avatarUrl || memberName) && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#23242F] flex-shrink-0 bg-[#0F1117] flex items-center justify-center">
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                                        : <div className="text-[#4B5563]">{icon}</div>
                                    }
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563]">{roleName}</span>
                                    <span className="text-[15px] font-semibold text-white truncate">{memberName || 'Por Asignar'}</span>
                                </div>
                                {isActive && <Check className="w-4 h-4 text-[#3B82F6] ml-auto flex-shrink-0" />}
                            </div>
                        )}
                        {/* Leader 2 if provided */}
                        {(avatarUrl2 || memberName2) && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#23242F] flex-shrink-0 bg-[#0F1117] flex items-center justify-center">
                                    {avatarUrl2
                                        ? <img src={avatarUrl2} alt="" className="w-full h-full object-cover" />
                                        : <div className="text-[#4B5563]">{icon}</div>
                                    }
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563]">{roleName2}</span>
                                    <span className="text-[15px] font-semibold text-white truncate">{memberName2 || 'Por Asignar'}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {!memberName && !memberName2 && (
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="w-10 h-10 rounded-xl border border-[#23242F] bg-[#0F1117] flex items-center justify-center">
                            {icon}
                        </div>
                        <span className="text-[14px] font-medium text-[#4B5563]">Por Asignar</span>
                    </div>
                )}
            </div>

            {/* Footer branding */}
            <div className="absolute bottom-3 right-4 text-[9px] tracking-widest text-[#23242F] font-mono uppercase">
                LLDM
            </div>
        </motion.div>
    );

    // ── FEATURED EVENING CARD ─────────────────────────────────────────────────
    const FeaturedCard = () => {
        const isActive = isSlotActive('evening');
        const leaderIds = slotEvening?.leaderIds || [];
        const type = slotEvening?.type || 'standard';
        const timeDisplay = slotEvening?.time ? slotEvening.time.split(' ')[0] : '18:00';
        const periodDisplay = slotEvening?.time ? slotEvening.time.split(' ')[1] : 'PM';
        const label = slotEvening?.customLabel || slotEvening?.topic || getServiceTypeLabel(slotEvening?.type || 'regular', settings.language, is14th);

        return (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
                className={`relative flex flex-col w-[460px] rounded-2xl overflow-hidden
                    bg-[#1C1E2C] border-2 border-[#3B82F6]
                    shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_16px_48px_rgba(0,0,0,0.6)]
                `}
            >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6]" />

                {/* Popular badge equivalent */}
                <div className="absolute top-5 right-5">
                    <span className="px-3 py-1 rounded-full bg-[#3B82F6] text-white text-[10px] font-semibold uppercase tracking-widest">
                        Principal
                    </span>
                </div>

                {/* Header */}
                <div className="px-7 pt-7 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#60A5FA]">Servicio Vespertino</span>
                        {isActive && <LiveBadge />}
                        <LangBadge lang={slotEvening?.language} />
                    </div>
                    <div className="flex items-end gap-1 mt-3">
                        <span className="text-[6rem] font-bold leading-none text-[#3B82F6] tracking-tight">{timeDisplay}</span>
                        <span className="text-3xl font-semibold text-[#3B82F6]/40 mb-3">{periodDisplay}</span>
                    </div>
                    <span className="inline-block mt-2 px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[10px] font-semibold text-[#60A5FA] uppercase tracking-widest">
                        {label}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#3B82F6]/20 mx-7" />

                {/* Leaders */}
                <div className="px-7 py-6 flex flex-col gap-4">
                    {leaderIds.length === 0 && (
                        <div className="flex items-center gap-3 opacity-40">
                            <div className="w-14 h-14 rounded-xl border border-[#23242F] bg-[#0F1117] flex items-center justify-center">
                                <Church className="w-6 h-6 text-[#4B5563]" />
                            </div>
                            <span className="text-[16px] font-medium text-[#4B5563]">Por Asignar</span>
                        </div>
                    )}
                    {leaderIds.length > 0 && type === 'married' ? (
                        // Married: two leaders side by side
                        <div className="flex gap-4">
                            {[0, 1].map((i) => {
                                const detail = getMemberDetail(leaderIds[i] || null);
                                return (
                                    <div key={i} className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-[#0F1117] border border-[#23242F]">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#3B82F6]/30 flex-shrink-0 bg-[#16171F] flex items-center justify-center">
                                            {detail.avatar
                                                ? <img src={detail.avatar} alt="" className="w-full h-full object-cover" />
                                                : <Church className="w-5 h-5 text-[#4B5563]" />
                                            }
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#60A5FA]">
                                                {i === 0 ? 'Servicio' : 'Doctrina'}
                                            </span>
                                            <span className="text-[14px] font-semibold text-white truncate">
                                                {detail.name || (i === 0 ? 'Por Asignar' : 'Esposa')}
                                            </span>
                                        </div>
                                        {isActive && i === 0 && <Check className="w-4 h-4 text-[#3B82F6] ml-auto flex-shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>
                    ) : leaderIds.length >= 2 ? (
                        // Dual leaders (non-married)
                        <div className="flex gap-3">
                            {[0, 1].map((i) => {
                                const detail = getMemberDetail(leaderIds[i] || null);
                                const roles = type === 'children'
                                    ? ['Consagración', 'Doctrina']
                                    : ['Director', 'Asistente'];
                                return (
                                    <div key={i} className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-[#0F1117] border border-[#23242F]">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#3B82F6]/30 flex-shrink-0 bg-[#16171F] flex items-center justify-center">
                                            {detail.avatar
                                                ? <img src={detail.avatar} alt="" className="w-full h-full object-cover" />
                                                : <ShieldCheck className="w-5 h-5 text-[#4B5563]" />
                                            }
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#60A5FA]">{roles[i]}</span>
                                            <span className="text-[14px] font-semibold text-white truncate">{detail.name || 'Por Asignar'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : leaderIds.filter(Boolean).length === 1 ? (
                        // Single leader — stacked and prominent
                        <div className="flex flex-col items-center text-center gap-5 py-6 px-4 rounded-xl bg-[#0F1117] border border-[#3B82F6]/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#3B82F6]/40 flex-shrink-0 bg-[#16171F] flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                                {getMemberDetail(leaderIds.filter(Boolean)[0]).avatar
                                    ? <img src={getMemberDetail(leaderIds.filter(Boolean)[0]).avatar!} alt="" className="w-full h-full object-cover" />
                                    : <Church className="w-10 h-10 text-[#3B82F6]/40" />
                                }
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#60A5FA] mb-2">Consagración y Doctrina</span>
                                <span className="text-[28px] font-black text-white leading-tight">{getMemberDetail(leaderIds.filter(Boolean)[0]).name || 'Por Asignar'}</span>
                            </div>
                            {isActive && (
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white">
                                    <Check className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Servicio Activo</span>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer branding */}
                <div className="absolute bottom-3 right-5 text-[9px] tracking-widest text-[#1E2030] font-mono uppercase">
                    LLDM · DM
                </div>
            </motion.div>
        );
    };

    // ── SUNDAY CENTER CARD ────────────────────────────────────────────────────
    const SundayCard = () => {
        const type = slot9am?.sundayType || 'local';
        const isActive = isSlotActive('9am');

        const typeConfig: Record<string, { label: string; accent: string; icon: typeof Crown }> = {
            local: { label: 'Escuela Dominical', accent: '#F59E0B', icon: Crown },
            exchange: { label: 'Intercambio de Ministro', accent: '#8B5CF6', icon: HeartHandshake },
            broadcast: { label: 'Transmisión Internacional', accent: '#EF4444', icon: Radio },
            visitors: { label: 'Dominical de Visitas', accent: '#10B981', icon: Users },
        };
        const cfg = typeConfig[type] || typeConfig.local;
        const Icon = cfg.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 80 }}
                className={`relative flex flex-col w-[380px] rounded-2xl overflow-hidden
                    bg-[#16171F] border border-[#23242F] shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    ${isActive ? 'border-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.2)]' : ''}
                `}
            >
                {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3B82F6]" />}

                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4B5563]">10:00 AM · Dominical</span>
                        <div className="flex gap-2">
                            <LangBadge lang={slot9am?.language} />
                            {isActive && <LiveBadge />}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}40` }}
                        >
                            <Icon className="w-6 h-6" style={{ color: cfg.accent }} />
                        </div>
                        <div>
                            <p className="text-[16px] font-semibold text-white leading-tight">{cfg.label}</p>
                            {slot9am?.churchOrigin && type === 'exchange' && (
                                <p className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {slot9am.churchOrigin}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#23242F] mx-6" />

                {/* Minister / Leader display */}
                <div className="px-6 py-8">
                    {type === 'local' ? (
                        <div className="flex flex-col items-center text-center gap-5">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#F59E0B]/40 flex-shrink-0 flex items-center justify-center bg-[#0F1117] shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                                {minister?.avatar
                                    ? <img src={minister.avatar} alt="Ministro" className="w-full h-full object-cover" />
                                    : <Church className="w-10 h-10 text-[#4B5563]" />
                                }
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F59E0B] mb-2">Ministro Local</span>
                                <p className="text-[26px] font-black text-white leading-tight">{minister?.name || 'Por Asignar'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                                style={{ background: `${cfg.accent}15`, border: `2px solid ${cfg.accent}40` }}
                            >
                                <Icon className="w-10 h-10" style={{ color: cfg.accent }} />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: cfg.accent }}>
                                    {type === 'broadcast' ? 'Internacional' : type === 'exchange' ? 'Intercambio' : 'Abierto'}
                                </span>
                                <p className="text-[22px] font-bold text-white leading-tight">
                                    {type === 'broadcast' ? 'Señal en Vivo' : type === 'exchange' ? 'Ministro Invitante' : 'Puertas Abiertas'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3 right-4 text-[9px] tracking-widest text-[#23242F] font-mono uppercase">LLDM</div>
            </motion.div>
        );
    };

    return (
        <div
            className="h-full w-full flex flex-col justify-center items-center overflow-hidden relative"
            style={{ background: T.bg, fontFamily: 'var(--font-inter, ui-sans-serif)' }}
        >
            {/* ── HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center mb-10"
            >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4B5563] mb-2">
                    Sistema de Oraciones
                </p>
                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Agenda <span className="text-[#3B82F6]">{isTomorrow ? 'de Mañana' : 'del Día'}</span>
                </h1>
                {/* Date pill */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 border border-[#23242F] bg-[#16171F] rounded-full px-5 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                        <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                            {format(displayDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* ── CARDS ROW ── */}
            <div className="z-10 flex items-center justify-center gap-6 w-full max-w-[1600px] px-10">

                {/* 5AM */}
                <SideCard
                    icon={<Sunrise className="w-5 h-5 text-[#4B5563]" />}
                    avatarUrl={getMemberDetail(slot5am?.leaderId || null).avatar}
                    memberName={getMemberDetail(slot5am?.leaderId || null).name}
                    roleName="Consagración"
                    label={slot5am?.customLabel || getSlotLabel('5am', settings.language)}
                    language={slot5am?.language}
                    hour="05:00"
                    period="AM"
                    subtitle="Consagración Matutina"
                    delay={0.1}
                    isActive={isSlotActive('5am')}
                />

                {/* 9AM – Sunday switches to SundayCard */}
                {isSunday
                    ? <SundayCard />
                    : (
                        <SideCard
                            icon={<Sun className="w-5 h-5 text-[#4B5563]" />}
                            avatarUrl={getMemberDetail(slot9am?.consecrationLeaderId || null).avatar}
                            memberName={getMemberDetail(slot9am?.consecrationLeaderId || null).name}
                            roleName={slot9am?.consecrationLeaderId === slot9am?.doctrineLeaderId ? "Consagración y Doctrina" : "Consagración"}
                            avatarUrl2={slot9am?.consecrationLeaderId !== slot9am?.doctrineLeaderId ? getMemberDetail(slot9am?.doctrineLeaderId || null).avatar : null}
                            memberName2={slot9am?.consecrationLeaderId !== slot9am?.doctrineLeaderId ? getMemberDetail(slot9am?.doctrineLeaderId || null).name : null}
                            roleName2="Doctrina"
                            label={slot9am?.customLabel || getSlotLabel('9am_regular', settings.language)}
                            language={slot9am?.language}
                            hour={slot9am?.time ? slot9am.time.split(' ')[0] : '09:00'}
                            period={slot9am?.time ? slot9am.time.split(' ')[1] : 'AM'}
                            subtitle="Oración Intermedia"
                            delay={0.15}
                            isActive={isSlotActive('9am')}
                        />
                    )
                }

                {/* Evening (Featured) */}
                <FeaturedCard />

                {/* 12PM — optional */}
                {slot12pm?.leaderId && (
                    <SideCard
                        icon={<Sun className="w-5 h-5 text-[#4B5563]" />}
                        avatarUrl={getMemberDetail(slot12pm.leaderId).avatar}
                        memberName={getMemberDetail(slot12pm.leaderId).name}
                        roleName="Consagración"
                        label={slot12pm.customLabel || 'Consagración de 12'}
                        language={slot12pm.language}
                        hour={slot12pm.time ? slot12pm.time.split(' ')[0] : '12:00'}
                        period={slot12pm.time ? slot12pm.time.split(' ')[1] : 'PM'}
                        subtitle="Consagración del Mediodía"
                        delay={0.3}
                        isActive={isSlotActive('12pm')}
                    />
                )}
            </div>

            {/* ── FOOTER BRANDING ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium uppercase tracking-widest text-[#23242F] select-none"
            >
                LLDM Rodeo · Dark Minimal
            </motion.p>
        </div>
    );
}
