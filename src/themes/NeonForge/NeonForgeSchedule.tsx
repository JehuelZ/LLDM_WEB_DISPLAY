'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Sunrise, Sun, Moon, Church, Settings,
    Radio, Users, Crown, HeartHandshake, Mic, LogIn, ChevronRight, Activity, Wifi, Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getVariantTokens } from './tokens';
import { getSlotLabel, getServiceTypeLabel } from '@/lib/display_labels';

// ──────────────────────────────────────────────────────────────────────────────
// NeonForge — Schedule Slide v4
//
// Layout (portrait of 1080p landscape screen):
//   ┌─────────────────────────────────────────────────────────────────────┐
//   │  [⏰ Clock] [🌤 Weather Widget]          ← overlays from Background │
//   │                                                                     │
//   │          Agenda del Día / de Mañana   (title, centered)            │
//   │                                                                     │
//   │  ┌──────────┐    ┌──────────┐    ┌──────────┐                      │
//   │  │  5 AM    │    │  9 AM    │    │  6:00 PM │                      │
//   │  │  (SQ)    │    │  (SQ)    │    │  (SQ)    │     SQUARE cards     │
//   │  └──────────┘    └──────────┘    └──────────┘                      │
//   │                   Background grid visible                           │
//   └─────────────────────────────────────────────────────────────────────┘
// ──────────────────────────────────────────────────────────────────────────────

const CARD_VARIANTS = {
    hidden: { opacity: 0, y: 36, scale: 0.94 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.13, type: 'spring' as const, stiffness: 75, damping: 15 },
    }),
};

// ── Live pill ─────────────────────────────────────────────────────────────────
const LivePill = ({ T }: { T: any }) => (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: `${T.live}20`, border: `1px solid ${T.live}60` }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.live }} />
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.live }}>En Vivo</span>
    </div>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ src, fallback, accent }: { src?: string | null; fallback: React.ReactNode; accent: string }) => (
    <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
        style={{
            background: `${accent}10`,
            border: `1.5px solid ${accent}35`,
            boxShadow: `0 0 18px ${accent}18`,
        }}>
        {src
            ? <img src={src} alt="" className="w-full h-full object-cover" />
            : <div className="w-7 h-7" style={{ color: accent }}>{fallback}</div>
        }
    </div>
);

// ── Person row (compact / stacked) ──────────────────────────────────────────
const PersonRow = ({ label, name, avatar, icon, accent, stacked }: {
    label: string; name: string; avatar?: string | null; icon: React.ReactNode; accent: string; stacked?: boolean;
}) => (
    <div className={`flex ${stacked ? 'flex-col items-center text-center py-6' : 'items-center'} gap-4 p-4 rounded-2xl`}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Avatar src={avatar} fallback={icon} accent={accent} />
        <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>{label}</p>
            <p className={`${stacked ? 'text-[22px]' : 'text-[17px]'} font-black leading-snug truncate`} style={{ color: '#FFFFFF' }}>{name}</p>
        </div>
    </div>
);

// ── Empty row ─────────────────────────────────────────────────────────────────
const EmptyRow = ({ label, icon, T }: { label: string; icon: React.ReactNode; T: any }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl opacity-20"
        style={{ border: `1px dashed ${T.border}` }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7" style={{ color: T.textMuted }}>{icon}</div>
        </div>
        <div>
            <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: T.textMuted }}>{label}</p>
            <p className="text-[14px] font-semibold" style={{ color: T.textMuted }}>NO ASIGNADO</p>
        </div>
    </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// SQUARE GLASS CARD
// ══════════════════════════════════════════════════════════════════════════════
const SquareCard = ({ children, accent, isLive, index, language }: {
    children: React.ReactNode; accent: string; isLive: boolean; index: number; language?: string;
}) => (
    <motion.div
        custom={index}
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        // aspect-square via CSS below (width set by flex-1, height = width via padding trick)
        className="relative flex flex-col overflow-hidden rounded-[28px]"
        style={{
            flex: '1 1 0',
            // Make it square: aspect ratio 1:1
            aspectRatio: '1 / 1',
            // Glass + neon
            background: 'linear-gradient(150deg, rgba(22,22,22,0.85) 0%, rgba(12,12,12,0.92) 100%)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            border: `1.5px solid ${isLive ? accent : accent + '30'}`,
            boxShadow: isLive
                ? `0 0 0 1px ${accent}20, 0 12px 80px ${accent}22, 0 4px 16px rgba(0,0,0,0.7), inset 0 1px 0 ${accent}18`
                : `0 12px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
    >
        {/* English Badge */}
        {language === 'en' && (
            <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">EN</span>
            </div>
        )}

        {/* Top gradient glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[28px]"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}99, transparent)` }} />

        {/* Corner ambient glow */}
        <div className="absolute -top-20 -left-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${accent}10 0%, transparent 70%)`, filter: 'blur(24px)' }} />

        {children}
    </motion.div>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export function NeonForgeSchedule({ isTomorrow = false }: { isTomorrow?: boolean } = {}) {
    const scheduleMap = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);
    const minister = useAppStore((state: any) => state.minister);
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);

    const now = new Date();
    const baseDate = new Date(now);
    if (isTomorrow) baseDate.setDate(baseDate.getDate() + 1);
    const schedule = scheduleMap[format(baseDate, 'yyyy-MM-dd')];
    const isSunday = baseDate.getDay() === 0;
    const is14th = baseDate.getDate() === 14;

    const getMember = (id?: string | null) => {
        if (!id) return { name: '', avatar: null };
        const m = members.find((x: any) => x.id?.toString().toLowerCase() === id.trim().toLowerCase());
        return { name: m?.name || id, avatar: m?.avatar || m?.avatarUrl || null };
    };

    const isActive = (slotId: '5am' | '9am' | 'evening') => {
        if (isTomorrow) return false;
        const cur = now.getHours() * 60 + now.getMinutes();
        const r = {
            '5am': [5 * 60, 6 * 60 + 15],
            '9am': [(isSunday ? 10 : 9) * 60, (isSunday ? 12 : 10) * 60 + 15],
            'evening': [18 * 60 + 30, 20 * 60 + 30]
        };
        const [s, e] = r[slotId];
        return cur >= s && cur <= e;
    };

    const slot5 = schedule?.slots['5am'];
    const slot9 = schedule?.slots['9am'];
    const slotEve = schedule?.slots['evening'];

    const leader5 = getMember(slot5?.leaderId);
    const cons9 = getMember(slot9?.consecrationLeaderId);
    const doc9 = getMember(slot9?.doctrineLeaderId);
    const leaderIds = (slotEve?.leaderIds || []).slice(0, 2);
    // If we have a specific doctrine leader, inject it as the second person if possible
    if (slotEve?.doctrineLeaderId) {
        if (leaderIds.length === 0) {
            leaderIds.push(''); // dummy for service
            leaderIds.push(slotEve.doctrineLeaderId);
        } else if (leaderIds.length === 1) {
            leaderIds.push(slotEve.doctrineLeaderId);
        } else {
            leaderIds[1] = slotEve.doctrineLeaderId;
        }
    }
    const eveningType = slotEve?.type || 'standard';
    const eveningTime = slotEve?.time || '6:00 PM';
    const [timePart, periodPart] = eveningTime.split(' ');

    const sundayCfg: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        local: { label: 'Escuela Dominical', color: '#F59E0B', icon: <Crown /> },
        exchange: { label: 'Intercambio', color: T.secondary, icon: <HeartHandshake /> },
        broadcast: { label: 'Transmisión', color: '#EF4444', icon: <Radio /> },
        visitors: { label: 'Con Visitas', color: '#10B981', icon: <Users /> },
    };
    const sundayType = slot9?.sundayType || 'local';
    const sundayInfo = sundayCfg[sundayType] || sundayCfg.local;

    const A5 = T.accent;
    const A9 = isSunday ? sundayInfo.color : T.secondary;
    const AEve = T.accent;

    return (
        <div className="h-full w-full flex flex-col overflow-hidden"
            style={{ fontFamily: 'var(--font-sora, ui-sans-serif)' }}>

            {/* ────────────────────────────────────────────────────────────
                TOP AREA
                pt-20 → room for clock + weather widget (both absolute z-50)
                Weather widget is at left:220px top:14px via Background.tsx
            ──────────────────────────────────────────────────────────── */}
            <div className="shrink-0 pt-20 px-14 pb-4">
                {/* Tiny breadcrumb */}
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                    style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                    Información Oficial
                </motion.p>

                {/* Main title — centered under the widgets */}
                <motion.h1
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className="text-[52px] font-black tracking-tight leading-none text-center"
                    style={{ color: '#FFFFFF' }}
                >
                    Agenda{' '}
                    <span style={{
                        color: T.accent,
                        textShadow: `0 0 40px ${T.accent}50`,
                    }}>
                        {isTomorrow ? 'de Mañana' : 'del Día'}
                    </span>
                </motion.h1>

                {/* Date pill — centered */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
                    className="flex justify-center mt-4"
                >
                    <div className="flex items-center gap-2.5 px-5 py-2 rounded-full"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(10px)',
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.accent }} />
                        <span className="text-[12px] font-semibold capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {format(baseDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* ────────────────────────────────────────────────────────────
                THREE SQUARE CARDS — centered, large gap, bg visible around
            ──────────────────────────────────────────────────────────── */}
            <div
                className="flex-1 flex items-center justify-center gap-8 px-12 pb-10 min-h-0"
            >

                {/* ══ CARD 1 — 5 AM ══ */}
                <SquareCard accent={A5} isLive={isActive('5am')} index={0} language={slot5?.language}>
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 shrink-0"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: `${A5}15`, border: `1px solid ${A5}30`, color: A5 }}>
                                <Sunrise className="w-6 h-6" />
                            </div>
                            {isActive('5am') && <LivePill T={T} />}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {slot5?.customLabel || getSlotLabel('5am', settings.language)}
                        </p>
                        <p className="text-[42px] font-black leading-none mt-0.5" style={{ color: A5, textShadow: `0 0 30px ${A5}50` }}>
                            5 AM
                        </p>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-3">
                        {leader5.name
                            ? <PersonRow label="Responsable" name={leader5.name} avatar={leader5.avatar} icon={<Sunrise />} accent={A5} stacked={true} />
                            : <EmptyRow label="Responsable" icon={<Sunrise />} T={T} />
                        }
                    </div>

                    {/* Bottom bar */}
                    <div className="mx-6 mb-5 h-[1px] opacity-15 rounded-full" style={{ background: A5 }} />
                </SquareCard>

                {/* ══ CARD 2 — 9 AM / 10 AM ══ */}
                <SquareCard accent={A9} isLive={isActive('9am')} index={1} language={slot9?.language}>
                    <div className="px-6 pt-6 pb-4 shrink-0"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: `${A9}15`, border: `1px solid ${A9}30`, color: A9 }}>
                                {isSunday
                                    ? <div className="w-6 h-6">{sundayInfo.icon}</div>
                                    : <Sun className="w-6 h-6" />
                                }
                            </div>
                            {isActive('9am') && <LivePill T={T} />}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {isSunday ? (slot9?.customLabel || sundayInfo.label) : (slot9?.customLabel || getSlotLabel('9am_regular', settings.language))}
                        </p>
                        <p className="text-[42px] font-black leading-none mt-0.5"
                            style={{ color: A9, textShadow: `0 0 30px ${A9}50` }}>
                            {isSunday ? '10 AM' : (slot9?.time?.split(' ')[0] || '9 AM')}
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-3">
                        {isSunday ? (
                            <>
                                {sundayType === 'local' && minister?.name ? (
                                    <PersonRow label="Ministro a Cargo" name={minister.name} avatar={minister.avatar}
                                        icon={<Church />} accent={sundayInfo.color} stacked={true} />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 py-6">
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: `${sundayInfo.color}15`, border: `2px solid ${sundayInfo.color}35`, color: sundayInfo.color }}>
                                            <div className="w-10 h-10">{sundayInfo.icon}</div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: sundayInfo.color }}>Tipo</p>
                                            <p className="text-[20px] font-black leading-tight" style={{ color: '#FFF' }}>{sundayInfo.label}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {slot9?.consecrationLeaderId === slot9?.doctrineLeaderId && slot9?.consecrationLeaderId ? (
                                    cons9.name
                                        ? <PersonRow label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} name={cons9.name} avatar={cons9.avatar} icon={<Sun />} accent={A9} stacked={true} />
                                        : <EmptyRow label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} icon={<Sun />} T={T} />
                                ) : (
                                    <>
                                        {cons9.name
                                            ? <PersonRow label="Consagración" name={cons9.name} avatar={cons9.avatar} icon={<Sun />} accent={A9} />
                                            : <EmptyRow label="Consagración" icon={<Sun />} T={T} />
                                        }
                                        {doc9.name
                                            ? <PersonRow label={is14th ? "HISTORIA" : "Doctrina"} name={doc9.name} avatar={doc9.avatar} icon={<Zap />} accent={T.secondary} />
                                            : <EmptyRow label={is14th ? "HISTORIA" : "Doctrina"} icon={<Zap />} T={T} />
                                        }
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mx-6 mb-5 h-[1px] opacity-15 rounded-full" style={{ background: A9 }} />
                </SquareCard>

                {/* ══ CARD 3 — EVENING ══ */}
                <SquareCard accent={AEve} isLive={isActive('evening')} index={2} language={slotEve?.language}>
                    <div className="px-6 pt-6 pb-4 shrink-0 relative"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {/* Principal badge */}
                        <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest"
                            style={{ background: AEve, color: '#0C0C0C' }}>
                            Principal
                        </span>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: `${AEve}15`, border: `1px solid ${AEve}30`, color: AEve }}>
                                <Moon className="w-6 h-6" />
                            </div>
                            {isActive('evening') && <LivePill T={T} />}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {isSunday || baseDate.getDay() === 4 ? 'Servicio Vespertino' : 'Oración Vespertina'}
                        </p>
                        <div className="flex items-end gap-1.5">
                            <p className="text-[42px] font-black leading-none mt-0.5"
                                style={{ color: AEve, textShadow: `0 0 30px ${AEve}50` }}>
                                {timePart}
                            </p>
                            <p className="text-[18px] font-semibold mb-1" style={{ color: `${AEve}55` }}>{periodPart}</p>
                        </div>
                        <span className="inline-flex px-3 py-1 mt-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                            style={{ background: `${AEve}12`, border: `1px solid ${AEve}30`, color: AEve }}>
                            {slotEve?.customLabel || slotEve?.topic || getServiceTypeLabel(slotEve?.type || 'regular', settings.language, is14th)}
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-3">
                        {leaderIds.length === 0 && <EmptyRow label="Consagración y Doctrina" icon={<Church />} T={T} />}

                        {leaderIds.length > 0 && eveningType === 'married' &&
                            leaderIds.slice(0, 2).map((id: string, i: number) => {
                                const m = getMember(id);
                                return m.name
                                    ? <PersonRow key={i} label={i === 0 ? 'Servicio' : (is14th ? 'Historia' : 'Doctrina')} name={m.name} avatar={m.avatar} icon={<Church />} accent={AEve} />
                                    : <EmptyRow key={i} label={i === 0 ? 'Servicio' : (is14th ? 'Historia' : 'Doctrina')} icon={<Church />} T={T} />;
                            })
                        }

                        {leaderIds.length >= 2 && eveningType !== 'married' &&
                            leaderIds.slice(0, 2).map((id: string, i: number) => {
                                const m = getMember(id);
                                const types = eveningType === 'children' ? ['Consagración', 'Doctrina'] : ['Director', 'Asistente'];
                                return m.name
                                    ? <PersonRow key={i} label={is14th && types[i].includes('Doctrina') ? 'Historia' : types[i]} name={m.name} avatar={m.avatar}
                                        icon={i === 0 ? <Church /> : <Settings />}
                                        accent={i === 0 ? AEve : T.secondary} />
                                    : <EmptyRow key={i} label={is14th && types[i].includes('Doctrina') ? 'Historia' : types[i]} icon={<Church />} T={T} />;
                            })
                        }

                        {leaderIds.filter(Boolean).length === 1 && (() => {
                            const m = getMember(leaderIds.filter(Boolean)[0]);
                            return m.name
                                ? <PersonRow label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} name={m.name} avatar={m.avatar} icon={<Church />} accent={AEve} stacked={true} />
                                : <EmptyRow label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} icon={<Church />} T={T} />;
                        })()}
                    </div>

                    <div className="mx-6 mb-5 h-[1px] opacity-15 rounded-full" style={{ background: AEve }} />
                </SquareCard >
            </div >
        </div >
    );
}
