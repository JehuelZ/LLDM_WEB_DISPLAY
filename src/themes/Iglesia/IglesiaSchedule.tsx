'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Moon, Crown, User, Video, FileText, Zap, Thermometer, Hash, Layout, Clock as ClockIcon, BookOpen, Music, Info } from 'lucide-react';
import { BigAcademicTitle, ChurchHeaderBadge } from './BigAcademicTitle';
import { useAppStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getIglesiaTokens, neuShadow } from './tokens';
import { IglesiaClockInline } from './Clock';
import { getSlideSystemTitle, getSlotLabel, getServiceTypeLabel } from '@/lib/display_labels';

// ──────────────────────────────────────────────────────────────────────────────
// Iglesia — Schedule Slide (Academic Portal Redesign)
// Based EXACTLY on the user-provided Stitch reference
// ──────────────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────────
// ESTÁNDARES DE ESTILO NEUMÓRFICO (Iglesia Theme)
// Estilo "Relieve": Pop out (Sombra externa)
// Estilo "Hundido": Depth/Engraved (Sombra interna invertida)
// ──────────────────────────────────────────────────────────────────────────────

function AcademicButton({ label, icon: Icon, primary = false, variant, T, isDark, isLive = false, isTomorrow = false }: { label: string; icon: any; primary?: boolean; variant?: 'reliefMinimal' | 'reliefAccent' | 'reliefAura'; T: any; isDark: boolean; isLive?: boolean; isTomorrow?: boolean }) {
    const isReliefMinimal = variant === 'reliefMinimal';
    const isReliefAccent = variant === 'reliefAccent';
    const isReliefAura = variant === 'reliefAura';
    const isRelief = isReliefMinimal || isReliefAccent || isReliefAura;

    // Selección de Sombra: SI es primario (Azul Aura), SI es relieve (Pop-out), SI es normal (Hundido)
    let shadow = '';
    if (primary) {
        shadow = `0 10px 25px ${T.secondary}60, ${neuShadow(T, false, 'sm', isDark)}`;
    } else if (isReliefAura) {
        // Relieve con Aura sutil del color secundario
        shadow = isDark
            ? `0 0 20px ${T.secondary}30, 5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 15px rgba(255, 255, 255, 0.04)`
            : `0 0 15px ${T.secondary}20, 4px 4px 10px rgba(0, 0, 0, 0.04), -4px -4px 12px #FFFFFF`;
    } else if (isRelief) {
        // Sombra NEGRA más sutil (0.25 opacity) y BLANCA más dispersa (12px - 15px blur)
        shadow = isDark
            ? `5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 15px rgba(255, 255, 255, 0.04)`
            : `4px 4px 10px rgba(0, 0, 0, 0.04), -4px -4px 12px #FFFFFF`;
    } else {
        shadow = isDark ? neuShadow(T, true, 'md', isDark) : neuShadow(T, false, 'sm', isDark); // Hundido
    }

    // Resplandor si está En Vivo
    if (isLive) {
        shadow = `0 0 25px ${T.accent}70, ${shadow}`;
    }

    // Color de Texto e Icono
    let contentColor = T.textPrimary;
    if (primary) contentColor = '#FFFFFF';
    else if (isReliefMinimal) contentColor = '#94a3b8';
    else if (isTomorrow && isRelief) contentColor = '#94a3b8'; // Solicitud usuario: texto gris en agenda mañana
    else if (isReliefAccent || isReliefAura) contentColor = T.secondary;
    else if (isDark) contentColor = T.secondary;

    return (
        <div style={{
            width: '100%', height: 60, borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: primary ? T.secondary : T.surface,
            boxShadow: shadow,
            border: primary ? 'none' : (isReliefAura ? `1px solid ${T.secondary}15` : 'none'),
            cursor: 'default',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: primary ? 2 : 1
        }}>
            <Icon style={{ width: 18, height: 18, color: contentColor }} />
            <span style={{
                fontSize: 16,
                fontWeight: 700,
                color: contentColor,
                letterSpacing: '0.01em',
                fontFamily: T.fontMontserrat
            }}>
                {label}
            </span>
        </div>
    );
}


function StatusBadge({ label, active = false, isLive = false, T, isDark, language, settings }: { label?: string; active: boolean; isLive: boolean; T: any; isDark: boolean; language?: string; settings: any }) {
    return (
        <div style={{
            position: 'absolute',
            top: isLive ? -3 : 0,
            right: isLive ? -3 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 30,
        }}>
            <div style={{
                padding: '10px 24px', borderRadius: isLive ? '0 32px 0 24px' : '0 0 0 16px',
                background: isLive ? T.accent : (active ? T.secondary : T.surface),
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: 'none',
                border: 'none',
                outline: 'none',
                userSelect: 'none'
            }}>
                {isLive && (
                    <motion.div
                        animate={settings.lowPerformanceMode ? { opacity: 1, scale: 1 } : { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                        transition={settings.lowPerformanceMode ? {} : { repeat: Infinity, duration: 1.5 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFF' }}
                    />
                )}
                <span style={{ fontSize: 11, fontWeight: 900, color: (isLive || active) ? '#FFFFFF' : T.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: T.fontMontserrat }}>
                    {label || (isLive ? 'En Curso' : '')}
                    {isLive && label && !label.includes('EN CURSO') && ' - EN CURSO'}
                </span>
            </div>
            {language === 'en' && (
                <div style={{
                    marginTop: 8,
                    marginRight: 10,
                    padding: '4px 10px',
                    borderRadius: 12,
                    background: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: T.fontMontserrat }}>
                        EN
                    </span>
                </div>
            )}
        </div>
    );
}

// OBJETO: "EtiquetaHorario" con Estilo "Hundido"
function TimeBadge({ time, T, isDark }: { time: string; T: any; isDark: boolean }) {
    return (
        <div style={{
            padding: '10px 20px', borderRadius: 24,
            background: T.surface, // Mismo color que el fondo
            display: 'flex', alignItems: 'center', gap: 10,
            // Sombra invertida para dar sensación de grabado/profundidad
            boxShadow: isDark ? `inset 4px 4px 8px rgba(0,0,0,0.6), inset -2px -2px 4px rgba(255,255,255,0.04)` : 'none',
            border: 'none'
        }}>
            <ClockIcon style={{ width: 14, height: 14, color: T.textMuted }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, letterSpacing: '0.05em', fontFamily: T.fontMono }}>
                {time}
            </span>
        </div>
    );
}

// OBJETO: "RoleBadge" (Etiqueta de Cargo) con Estilo "Hundido"
// Se utiliza para mostrar cargos como "DOCTRINA" o "CONSAGRACIÓN"
function RoleBadge({ label, icon: Icon, T, isDark }: { label: string; icon?: any; T: any; isDark: boolean }) {
    return (
        <div style={{
            padding: '8px 16px', borderRadius: 20,
            background: T.surface,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: isDark ? `inset 3px 3px 6px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)` : 'inset 2px 2px 4px rgba(0,0,0,0.05)',
            border: 'none'
        }}>
            {Icon && <Icon style={{ width: 12, height: 12, color: T.accent }} />}
            <span style={{
                fontSize: 10,
                fontWeight: 800,
                color: T.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: T.fontInter
            }}>
                {label}
            </span>
        </div>
    );
}

function Avatar({ src, size, T, isDark }: { src?: string | null; size: number; T: any; isDark: boolean }) {
    return (
        <div style={{
            width: size, height: size, flexShrink: 0,
            borderRadius: '50%', overflow: 'hidden',
            // Usamos el Estilo Guardado: "Estilo Hundido Pronunciado"
            background: T.avatarStyle.background,
            boxShadow: T.avatarStyle.boxShadow,
            border: T.avatarStyle.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            padding: T.avatarStyle.padding
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

export function IglesiaSchedule({ isTomorrow = false }: { isTomorrow?: boolean }) {
    const { monthlySchedule, members, settings, minister, theme } = useAppStore((s: any) => s);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const language = settings?.language || 'es';
    const iglesiaVariant = settings?.iglesiaVariant || 'light';
    const isDark = iglesiaVariant === 'dark';
    const T = getIglesiaTokens(iglesiaVariant);

    const themeTypeLabels: Record<string, string> = {
        orthodoxy: 'Estudio de Ortodoxia',
        apostolic_letter: 'Carta Apostólica',
        history: 'Relato Histórico',
        free: 'Tema de Edificación'
    };
    const themeLabel = themeTypeLabels[theme?.type] || 'Estudio Semanal';

    const displayDate = isTomorrow ? addDays(currentTime, 1) : currentTime;
    const is14th = displayDate.getDate() === 14;
    const dateKey = format(displayDate, 'yyyy-MM-dd');
    const schedule = monthlySchedule?.[dateKey];
    const isSun = displayDate.getDay() === 0;

    const isSlotActive = (slotId: '5am' | '9am' | 'evening') => {
        const todayKey = format(currentTime, 'yyyy-MM-dd');
        if (dateKey !== todayKey) return false;

        const curMin = currentTime.getHours() * 60 + currentTime.getMinutes();
        const sched = monthlySchedule?.[dateKey];
        const isSunToday = currentTime.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': { start: isSunToday ? '09:00' : '09:00', end: isSunToday ? '12:30' : '10:15' },
            'evening': { start: '18:15', end: '20:45' },
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

        const slot = (sched?.slots as any)?.[slotId];
        let start = parseTimeStr(slot?.time) ?? parseTimeStr(defaults[slotId].start)!;
        let end = parseTimeStr(slot?.endTime) ?? parseTimeStr(defaults[slotId].end)!;

        // Special handling for Sunday Dominical (the 9am slot is used for the morning service)
        if (slotId === '9am' && isSunToday) {
            // Expansion: Dominical usually starts between 9 and 10 AM and ends by 12:30 PM
            if (slot?.time?.includes('09:00') || !slot?.time) start = Math.min(start, 540); // 9:00 AM
            if (slot?.endTime?.includes('12:00') || !slot?.endTime) end = 765; // 12:45 PM
        }

        return curMin >= start && curMin <= end;
    };

    const getMember = (id?: string) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();

        // Search by ID or Name (ignoring common prefixes for better matching)
        const m = members?.find((x: any) => {
            const memberId = x.id?.toString().toLowerCase();
            const memberName = x.name?.toLowerCase();
            const searchBase = cleanId
                .replace(/^bro\.\s*/, '')
                .replace(/^sis\.\s*/, '')
                .replace(/^hno\.\s*/, '')
                .replace(/^hna\.\s*/, '');

            return memberId === cleanId || memberName?.includes(searchBase);
        });

        return {
            name: m?.name || (id.length > 20 ? 'HERMANO ASIGNADO' : (id || 'NO ASIGNADO')),
            avatar: m?.avatar || m?.avatarUrl || null
        };
    };

    const slot5am = schedule?.slots?.['5am'];
    const slot9am = schedule?.slots?.['9am'];
    const slot12pm = schedule?.slots?.['12pm'];
    const slotEvening = schedule?.slots?.['evening'];

    const leader5am = getMember(slot5am?.leaderId);
    const cons9am = getMember(slot9am?.consecrationLeaderId);
    const doc9am = getMember(slot9am?.doctrineLeaderId);

    // Robust evening leader detection (fallback to leaderId if leaderIds is empty)
    let evIds = [...((slotEvening?.leaderIds && slotEvening.leaderIds.length > 0)
        ? slotEvening.leaderIds
        : (slotEvening?.leaderId ? [slotEvening.leaderId] : []))].slice(0, 2);

    if (slotEvening?.doctrineLeaderId) {
        if (evIds.length === 0) {
            evIds = ['', slotEvening.doctrineLeaderId];
        } else if (evIds.length === 1) {
            evIds.push(slotEvening.doctrineLeaderId);
        } else {
            evIds[1] = slotEvening.doctrineLeaderId;
        }
    }

    const evLeaders = evIds.map((id: string) => getMember(id));

    const isPraise = slotEvening?.type === 'praise' ||
        slotEvening?.customLabel?.toLowerCase().includes('alabanza');

    const isLive5am = isSlotActive('5am');
    const isLive9am = isSlotActive('9am');
    const isLiveEvening = isSlotActive('evening');

    const renderCard = (slotKey: '5am' | '9am' | 'evening', title: string, content: React.ReactNode, buttons: any[], isSync: boolean = false) => {
        const isLive = isSlotActive(slotKey);
        const sched = monthlySchedule?.[dateKey];
        const slot = (sched?.slots as any)?.[slotKey];
        const timeRange = slot?.time || (slotKey === '5am' ? '05:00 AM' : (slotKey === '9am' ? (isSun ? '10:00 AM' : '09:00 AM') : '07:00 PM'));
        const language = slot?.language;

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isLive ? (settings.lowPerformanceMode ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: [1, 1.02, 1] }) : { opacity: 1, y: 0, scale: 1 }}
                transition={isLive ? (settings.lowPerformanceMode ? { duration: 0.5 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }) : { duration: 1, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    flex: '0 1 540px', height: 'fit-content', borderRadius: 40, background: T.surface,
                    boxShadow: isLive
                        ? `0 0 70px ${T.accent}50, ${neuShadow(T, false, 'lg', isDark)}`
                        : (isSync && isDark ? `0 0 50px rgba(58,134,255,0.12), ${neuShadow(T, false, 'lg', isDark)}` : neuShadow(T, false, 'lg', isDark)),
                    display: 'flex', flexDirection: 'column',
                    overflow: 'visible',
                    border: isLive ? `4px solid ${T.accent}` : (isDark ? 'none' : (isSync ? `1px solid #339AF050` : `1px solid ${T.border}`)),
                    position: 'relative',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxSizing: 'border-box'
                }}
            >
                <StatusBadge label={isLive ? (isTomorrow ? '' : 'EN CURSO') : title} active={isSync} isLive={isLive} T={T} isDark={isDark} language={language} settings={settings} />

                <div style={{ padding: '35px 25px', display: 'flex', flexDirection: 'column', gap: 30, overflow: 'hidden', borderRadius: 40 }}>
                    {/* Time Center */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <TimeBadge time={timeRange.split('-')[0].trim()} T={T} isDark={isDark} />
                    </div>

                    {/* Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
                        {content}
                    </div>

                    {/* Stacked Buttons — Only render if any exist */}
                    {buttons && buttons.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {buttons.map((btn, i) => (
                                <AcademicButton key={i} {...btn} isLive={isLive} T={T} isDark={isDark} isTomorrow={isTomorrow} />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const title5am = slot5am?.customLabel || getSlotLabel('5am', settings?.language);
    const title9am = slot9am?.customLabel || (isSun ? getSlotLabel('9am_sunday', settings?.language) : getSlotLabel('9am_regular', settings?.language));
    const eveningTitle = slotEvening?.customLabel || getServiceTypeLabel(slotEvening?.type || 'regular', settings?.language, is14th);

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '30px 40px 180px 40px', gap: 20, fontFamily: T.fontFamily }}>


            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>


                {/* Centered Heading Layout with NEW Big Relief Title Style */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                    <div style={{ width: 'fit-content', minWidth: 600 }}>
                        <BigAcademicTitle
                            label={getSlideSystemTitle(isTomorrow ? 'schedule_tomorrow' : 'schedule', settings?.language)}
                            icon={Layout}
                            T={T}
                            isDark={isDark}
                            small={true}
                        />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 400, color: T.textMuted, textTransform: 'capitalize', fontFamily: T.fontInter }}>
                        {format(displayDate, "EEEE, d 'de' MMMM", { locale: es })} • {isSun ? 'Día del Señor' : `Día de Oración`} • {format(displayDate, 'yyyy')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {renderCard('5am', title5am, (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <Avatar src={leader5am.avatar} size={240} T={T} isDark={isDark} />
                            <AcademicButton
                                label={leader5am.name || 'NO ASIGNADO'}
                                icon={User}
                                variant="reliefAura"
                                T={T}
                                isDark={isDark}
                                isLive={isLive5am}
                                isTomorrow={isTomorrow}
                            />
                            <RoleBadge label="Consagración" icon={Sunrise} T={T} isDark={isDark} />
                        </div>
                    ), [], false)}

                    {/* 9 AM — Two People or Dominical Style */}
                    {renderCard('9am', title9am, (
                        isSun ? (() => {
                            const types: Record<string, { label: string; icon: any }> = {
                                local: { label: 'Dominical Local', icon: Crown },
                                exchange: { label: 'Intercambio Ministerial', icon: Zap },
                                broadcast: { label: 'Transmisión Dominical', icon: Video },
                                visitors: { label: 'Dominical de Visitas', icon: User }
                            };
                            const type = slot9am?.sundayType || (schedule?.topic?.startsWith('dominical:') ? schedule.topic.replace('dominical:', '') : 'local');
                            const current = types[type] || types.local;
                            const Icon = current.icon;

                            if (type === 'local' && minister?.name) {
                                // Add check for assigned leaders in local School
                                const consL = getMember(slot9am?.consecrationLeaderId);
                                const docL = getMember(slot9am?.doctrineLeaderId);

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                                        <Avatar src={minister.avatar} size={240} T={T} isDark={isDark} />
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                            <AcademicButton label={minister.name} icon={User} variant="reliefAura" T={T} isDark={isDark} isLive={isLive9am} isTomorrow={isTomorrow} />
                                            {slot9am?.topic && (
                                                <div style={{ 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    padding: '10px 20px', 
                                                    borderRadius: 15, 
                                                    color: T.secondary,
                                                    fontSize: 22,
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    border: `1px solid ${T.secondary}20`,
                                                    textAlign: 'center',
                                                    marginTop: 5
                                                }}>
                                                    {slot9am.topic}
                                                </div>
                                            )}
                                            <RoleBadge label="Ministro a Cargo" icon={Crown} T={T} isDark={isDark} />
                                            
                                            {/* Extra Assignments for Sunday School */}
                                            {(consL.name || docL.name) && (
                                                <div style={{ display: 'flex', gap: 12, marginTop: 10, width: '100%' }}>
                                                    {consL.name && (
                                                        <div style={{ flex: 1 }}>
                                                            <AcademicButton label={consL.name} icon={User} variant="reliefMinimal" T={T} isDark={isDark} />
                                                            <div style={{ marginTop: -8, display: 'flex', justifyContent: 'center' }}>
                                                                <RoleBadge label="Cons." T={T} isDark={isDark} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {docL.name && docL.name !== minister.name && (
                                                        <div style={{ flex: 1 }}>
                                                            <AcademicButton label={docL.name} icon={User} variant="reliefMinimal" T={T} isDark={isDark} />
                                                            <div style={{ marginTop: -8, display: 'flex', justifyContent: 'center' }}>
                                                                <RoleBadge label="Clase" T={T} isDark={isDark} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                                    <div style={{
                                        width: 140, height: 140, borderRadius: '50%',
                                        background: `${T.secondary}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: `4px solid ${T.surface}`,
                                        boxShadow: '0 8px 25px rgba(58,134,255,0.15)'
                                    }}>
                                        <Icon style={{ width: 70, height: 70, color: T.secondary }} />
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                        <AcademicButton label={current.label} icon={Icon} variant="reliefAura" T={T} isDark={isDark} isLive={isLive9am} isTomorrow={isTomorrow} />
                                        {slot9am?.topic && (
                                            <div style={{ 
                                                background: 'rgba(255,255,255,0.05)', 
                                                padding: '10px 20px', 
                                                borderRadius: 15, 
                                                color: T.secondary,
                                                fontSize: 22,
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                border: `1px solid ${T.secondary}20`,
                                                textAlign: 'center',
                                                marginTop: 5
                                            }}>
                                                {slot9am.topic}
                                            </div>
                                        )}
                                        <RoleBadge label="Escuela Dominical" icon={Crown} T={T} isDark={isDark} />
                                    </div>
                                </div>
                            );
                        })() : (
                            (() => {
                                if (!isSun && slot9am?.consecrationLeaderId === slot9am?.doctrineLeaderId && slot9am?.consecrationLeaderId) {
                                    // Unified view for single leader at 9 AM
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                                            <Avatar src={cons9am.avatar} size={240} T={T} isDark={isDark} />
                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                                <AcademicButton label={cons9am.name || 'NO ASIGNADO'} icon={User} variant="reliefAura" T={T} isDark={isDark} isLive={isLive9am} isTomorrow={isTomorrow} />
                                                <RoleBadge label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} icon={Sunrise} T={T} isDark={isDark} />
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, width: '100%' }}>
                                        <div style={{ display: 'flex', gap: -30, justifyContent: 'center', marginBottom: 5 }}>
                                            <Avatar src={cons9am.avatar} size={190} T={T} isDark={isDark} />
                                            {doc9am.avatar && (
                                                <div style={{ marginLeft: -60 }}>
                                                    <Avatar src={doc9am.avatar} size={190} T={T} isDark={isDark} />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                            <AcademicButton
                                                label={cons9am.name === doc9am.name ? (cons9am.name || 'NO ASIGNADO') : `${cons9am.name || 'NO ASIGNADO'} | ${doc9am.name || 'NO ASIGNADO'}`}
                                                icon={User} variant="reliefAura" T={T} isDark={isDark} isLive={isLive9am} isTomorrow={isTomorrow}
                                            />
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <RoleBadge label="Consagración" icon={Sunrise} T={T} isDark={isDark} />
                                                <RoleBadge label={is14th ? "HISTORIA" : "Doctrina"} icon={BookOpen} T={T} isDark={isDark} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        )
                    ), isSun ? [
                        {
                            label: (() => {
                                const types: any = { local: 'Dominical Local', exchange: 'Intercambio Ministerial', broadcast: 'Transmisión Dominical', visitors: 'Dominical de Visitas' };
                                return types[slot9am?.sundayType || 'local'] || types.local;
                            })(), icon: Info, variant: 'reliefMinimal'
                        },
                        { label: slot9am?.sundayType === 'exchange' ? 'Intercambio Ministerial' : 'Escuela Dominical', icon: Crown, primary: true }
                    ] : [], true)}


                    {/* 12 PM — Optional Prayer */}
                    {slot12pm?.leaderId && renderCard('12pm' as any, "Oración de 12", (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <Avatar src={getMember(slot12pm.leaderId).avatar} size={240} T={T} isDark={isDark} />
                            <AcademicButton
                                label={getMember(slot12pm.leaderId).name || 'NO ASIGNADO'}
                                icon={User}
                                variant="reliefAura"
                                T={T}
                                isDark={isDark}
                                isTomorrow={isTomorrow}
                            />
                            <RoleBadge label="Consagración" icon={Sun} T={T} isDark={isDark} />
                        </div>
                    ), [], false)}


                    {/* Evening — Regular: 1 person (Consagración + Doctrina) | Special: 2 columns */}
                    {(() => {
                        const isSpecialService = isSun || isPraise ||
                            ['married', 'youth', 'children', 'youth_english', 'special'].includes(slotEvening?.type || '');
                        const cardTitle = isPraise ? 'Servicio de Alabanzas' : (isSun ? 'Servicio de Adoración' : eveningTitle);

                        if (isSpecialService) {
                            return renderCard('evening', cardTitle, (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                                        <Avatar src={evLeaders[0]?.avatar} size={210} T={T} isDark={isDark} />
                                        {evLeaders[1]?.avatar && (
                                            <div style={{ marginLeft: -60 }}>
                                                <Avatar src={evLeaders[1]?.avatar} size={210} T={T} isDark={isDark} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                        <AcademicButton
                                            label={evLeaders[0]?.name === evLeaders[1]?.name ? (evLeaders[0]?.name || 'NO ASIGNADO') : `${evLeaders[0]?.name || 'NO ASIGNADO'} | ${evLeaders[1]?.name || 'NO ASIGNADO'}`}
                                            icon={User} variant="reliefAura" T={T} isDark={isDark} isLive={isLiveEvening} isTomorrow={isTomorrow}
                                        />
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <RoleBadge label="Servicio" icon={Sunrise} T={T} isDark={isDark} />
                                            <RoleBadge label={is14th ? "HISTORIA" : "Doctrina"} icon={BookOpen} T={T} isDark={isDark} />
                                        </div>
                                    </div>
                                </div>
                            ), [], false);
                        } else {
                            // REGULAR PRAYER — 1 person carries both Consagración + Doctrina
                            return renderCard('evening', cardTitle, (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                                    <Avatar src={evLeaders[0]?.avatar} size={240} T={T} isDark={isDark} />
                                    <AcademicButton label={evLeaders[0]?.name || 'NO ASIGNADO'} icon={User} variant="reliefAura" T={T} isDark={isDark} isLive={isLiveEvening} isTomorrow={isTomorrow} />
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <RoleBadge label={is14th ? "HISTORIA DE LA IGLESIA" : "Consagración y Doctrina"} icon={Sunrise} T={T} isDark={isDark} />
                                    </div>
                                </div>
                            ), [], false);
                        }
                    })()}
                </div>
            </div>
        </div >
    );
}

