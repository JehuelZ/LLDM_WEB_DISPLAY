'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Church, Sun, Radio, Users, Crown, HeartHandshake, Mic, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSlotLabel, getServiceTypeLabel } from '@/lib/display_labels';

// ─────────────────────────────────────────────
// THEME: Tech Corporate — inspirado en imagen de referencia
// Paleta: navy #040D21 · card #0D1B3E · neon-green #A3FF57 · blue-bright #4F7FFF
// ─────────────────────────────────────────────

const LiveBadge = ({ rounding = "rounded-b-[2.5rem]" }: { rounding?: string }) => (
    <motion.div
        animate={{
            boxShadow: [
                "0 -10px 30px rgba(220,38,38,0.4)",
                "0 -10px 45px rgba(220,38,38,0.7)",
                "0 -10px 30px rgba(220,38,38,0.4)"
            ]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={`absolute bottom-0 left-0 right-0 h-11 overflow-hidden z-[60] pointer-events-none ${rounding} bg-gradient-to-r from-red-600/95 via-red-500 to-red-600/95 border-t-2 border-white/30 backdrop-blur-md flex items-center justify-center`}
    >
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3"
        >
            <div className="w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_15px_#fff]" />
            <span className="text-[14px] font-black text-white tracking-[0.5em] uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">EN CURSO</span>
        </motion.div>
    </motion.div>
);

export function MidnightGlowSchedule({ isTomorrow = false }: { isTomorrow?: boolean } = {}) {
    const members = useAppStore((state: any) => state.members);
    const minister = useAppStore((state: any) => state.minister);
    const settings = useAppStore((state: any) => state.settings);
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);

    const now = new Date();
    const baseDate = new Date(now);

    if (isTomorrow) {
        baseDate.setDate(baseDate.getDate() + 1);
    }

    const targetDateStr = format(baseDate, 'yyyy-MM-dd');
    const schedule = monthlySchedule[targetDateStr];
    const displayDate = baseDate;
    const is14th = displayDate.getDate() === 14;
    const isSunday = displayDate.getDay() === 0;
    const isThursday = displayDate.getDay() === 4;
    const isServiceDay = isSunday || isThursday;

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = (members || []).find((m: any) => m.id.toString().toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'HERMANO ASIGNADO' : (id || 'NO ASIGNADO')),
            avatar: member?.avatar || (member as any)?.avatarUrl || null,
        };
    };

    const slot5am = schedule?.slots['5am'];
    const slot9am = schedule?.slots['9am'];
    const slot12pm = schedule?.slots['12pm'];
    const slotEveningRaw = schedule?.slots['evening'];
    
    // Process evening slot to include doctrineLeaderId in leaderIds if missing
    const slotEvening = slotEveningRaw ? {
        ...slotEveningRaw,
        leaderIds: (() => {
            const ids = [...(slotEveningRaw.leaderIds || [])].slice(0, 2);
            if (slotEveningRaw.doctrineLeaderId) {
                if (ids.length === 0) {
                    ids.push(''); // dummy
                    ids.push(slotEveningRaw.doctrineLeaderId);
                } else if (ids.length === 1) {
                    ids.push(slotEveningRaw.doctrineLeaderId);
                } else {
                    ids[1] = slotEveningRaw.doctrineLeaderId;
                }
            }
            return ids;
        })()
    } : null;

    // Member row – hexagonal avatar + name
    const renderMember = (id: string | undefined | null, role: string, index = 0, hideAvatar = false) => {
        const leader = getMemberDetail(id || null);
        return (
            <motion.div
                key={id ?? role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 w-full py-2 px-3 rounded-lg border border-[#1E3A6E]/60 bg-[#0A1628]/80 hover:border-[#4F7FFF]/50 hover:bg-[#0D1B3E] transition-all duration-300 group"
            >
                {/* Avatar — solo si hideAvatar es false */}
                {!hideAvatar && leader.avatar ? (
                    <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-[#A3FF57]/30 shadow-[0_0_10px_rgba(163,255,87,0.15)]">
                        <img src={leader.avatar} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040D21]/50 to-transparent" />
                    </div>
                ) : (
                    <div className="w-11 h-11 shrink-0 rounded-lg border border-[#1E3A6E] bg-[#071020] flex items-center justify-center">
                        <Flame className="w-5 h-5 text-[#4F7FFF]/50" />
                    </div>
                )}
                {/* Text */}
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-[0.25em] text-[#A3FF57]/70 uppercase">{role}</span>
                    <span className="text-[15px] font-bold text-white/90 truncate leading-tight group-hover:text-white transition-colors">
                        {leader.name || 'NO ASIGNADO'}
                    </span>
                </div>
                {/* dot indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF57] shadow-[0_0_6px_#A3FF57] shrink-0" />
            </motion.div>
        );
    };

    // Side card (5AM / 9AM)
    const SideCard = ({
        icon, label, hour, period, subtitle, children, delay, accent, accentText, avatarUrl, memberName, roleName, avatarUrl2, memberName2, roleName2, isActive, language,
    }: {
        icon: React.ReactNode; label: string; hour: string; period: string;
        subtitle: string; children: React.ReactNode; delay: number;
        accent: string; accentText: string; avatarUrl?: string | null;
        memberName?: string; roleName?: string; avatarUrl2?: string | null; memberName2?: string; roleName2?: string; isActive?: boolean;
        language?: 'es' | 'en';
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 100 }}
            className="relative flex flex-col w-[450px] rounded-[2.5rem] border-2 border-[#1E3A6E] bg-[#0D1B3E] shadow-[0_30px_90px_rgba(0,0,0,0.7)] mt-16"
        >
            {/* LIVE INDICATOR */}
            {isActive && <LiveBadge rounding="rounded-b-[2.5rem]" />}

            {/* English Side-Tab Badge */}
            {language === 'en' && (
                <div className="absolute left-0 top-52 h-16 w-1 z-[70]">
                    <div className="absolute -left-[2px] top-0 h-full w-11 bg-[#FF6B00] rounded-r-xl shadow-[10px_0_30px_rgba(255,107,0,0.4)] backdrop-blur-md flex items-center justify-center overflow-hidden border-y border-r border-[#FF6B00]/20">
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        <span className="text-[14px] font-black text-white uppercase tracking-tighter shadow-sm">EN</span>
                    </div>
                    {/* Glow pulse */}
                    <div className="absolute -left-1 top-0 h-full w-2 bg-orange-600 blur-md animate-pulse" />
                </div>
            )}

            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-[4px] ${accent} rounded-t-[2.5rem]`} />

            {/* Floating Avatars / Icon bubble */}
            <div className="relative -mt-20 mb-8 z-50 w-full px-6 flex justify-center items-end h-44">
                {/* Profile 1 (Left or Center) */}
                <div className={avatarUrl2 ? "absolute -left-4 bottom-0 flex flex-col items-center" : "flex flex-col items-center"}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-32 h-32 rounded-3xl bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(79,127,255,0.25)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#4F7FFF]/30 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 rounded-3xl border-2 border-[#A3FF57]/40 animate-pulse opacity-50" />
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="transform scale-[2.2]">{icon}</div>
                        )}
                    </motion.div>

                    {memberName && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 px-6 py-1.5 rounded-2xl bg-[#040D21]/95 border-2 border-[#4F7FFF]/50 shadow-2xl backdrop-blur-2xl whitespace-nowrap flex flex-col items-center min-w-[140px]"
                        >
                            {roleName && (
                                <span className="text-[8px] font-black text-[#4F7FFF] uppercase tracking-[0.2em] mb-0.5 opacity-80">{roleName}</span>
                            )}
                            <span className="text-[14px] font-black text-white uppercase tracking-[0.1em]">{memberName}</span>
                        </motion.div>
                    )}
                </div>

                {/* Profile 2 (Right Corner Only) */}
                {avatarUrl2 && (
                    <div className="absolute -right-4 bottom-0 flex flex-col items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-32 h-32 rounded-3xl bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(163,255,87,0.25)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#A3FF57]/30 via-transparent to-transparent opacity-60" />
                            <div className="absolute inset-0 rounded-3xl border-2 border-[#4F7FFF]/40 animate-pulse opacity-50" />
                            {avatarUrl2 ? (
                                <img src={avatarUrl2} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="transform scale-[2.2]">{icon}</div>
                            )}
                        </motion.div>

                        {memberName2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 px-6 py-1.5 rounded-2xl bg-[#040D21]/95 border-2 border-[#A3FF57]/50 shadow-2xl backdrop-blur-2xl whitespace-nowrap flex flex-col items-center min-w-[140px]"
                            >
                                {roleName2 && (
                                    <span className="text-[8px] font-black text-[#A3FF57] uppercase tracking-[0.2em] mb-0.5 opacity-80">{roleName2}</span>
                                )}
                                <span className="text-[14px] font-black text-white uppercase tracking-[0.1em]">{memberName2}</span>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Decorative floating bits */}
                <div className="absolute -top-6 -right-4 w-12 h-12 rounded-full bg-[#A3FF57]/10 border border-[#A3FF57]/20 blur-md animate-pulse pointer-events-none" />
                <div className="absolute -bottom-4 -left-6 w-10 h-10 rounded-full bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 blur-md animate-bounce pointer-events-none" style={{ animationDuration: '3.5s' }} />
            </div>

            {/* Badge */}
            <div className="flex justify-center mt-2">
                <span className={`text-[12px] font-black tracking-[0.4em] uppercase border-2 px-6 py-1.5 rounded-full ${accentText} bg-[#0D1B3E]/90 backdrop-blur-md`}>
                    {label}
                </span>
            </div>

            {/* Time */}
            <div className="flex items-end justify-center gap-2 mt-6 px-6">
                <span className="text-[3.25rem] font-black text-white leading-none tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">{hour}</span>
                <span className="text-xl font-black text-white/30 mb-2">{period}</span>
            </div>
            <p className="text-center text-[12px] tracking-[0.4em] text-white/50 uppercase font-black mb-6 px-4">{subtitle}</p>

            {/* Divider with dot */}
            <div className="mx-10 flex items-center gap-4 mb-6 z-10 opacity-70">
                <div className={`flex-1 h-px bg-gradient-to-r ${accent.replace('from-transparent via-', 'from-transparent to-').replace('to-transparent', '')}`} />
                <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${accentText.split(' ')[0]}`} style={{ backgroundColor: 'currentColor' }} />
                <div className={`flex-1 h-px bg-gradient-to-l ${accent.replace('from-transparent via-', 'from-transparent to-').replace('to-transparent', '')}`} />
            </div>

            {/* Members */}
            <div className="px-8 pb-10 flex flex-col gap-3 flex-1 min-h-[40px]">
                {children}
            </div>

            {/* Bottom corner */}
            {/* Bottom corner watermark removed */}
        </motion.div>
    );

    // Helper to check if prayer is active
    const isSlotActive = (slotId: '5am' | '9am' | '12pm' | 'evening') => {
        if (isTomorrow) return false;

        const slot = schedule?.slots[slotId];
        const now = new Date();
        const curMin = now.getHours() * 60 + now.getMinutes();
        const isSunday = displayDate.getDay() === 0;

        const defaults = {
            '5am': { start: '05:00', end: '06:15' },
            '9am': {
                start: isSunday ? '10:00' : '09:00',
                end: isSunday ? '12:00' : '10:15'
            },
            '12pm': { start: '12:00', end: '13:00' },
            'evening': { start: '18:00', end: '20:30' }

        };

        const parseTimeStr = (t?: string) => {
            if (!t) return null;
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (!match) {
                // Try simple hour
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

    const isActiveEvening = isSlotActive('evening');

    return (
        <div
            className="h-full w-full flex flex-col justify-center items-center overflow-hidden relative"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 30%, #071428 0%, #040D21 60%, #02080F 100%)' }}
        >
            {/* ── Background texture: grid pattern ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #4F7FFF 1px, transparent 1px),
                        linear-gradient(to bottom, #4F7FFF 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #A3FF57 1px, transparent 1px),
                        linear-gradient(to bottom, #A3FF57 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            />
            {/* Diagonal lines texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #4F7FFF 0, #4F7FFF 1px, transparent 0, transparent 50%)',
                    backgroundSize: '24px 24px',
                }}
            />
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-[#4F7FFF]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#A3FF57]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* ── HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center mb-10"
            >
                <p className="text-[10px] tracking-[0.5em] text-[#4F7FFF] uppercase font-bold mb-2">Sistema de Oraciones</p>
                <h1 className="text-3xl font-black text-white tracking-tight">
                    AGENDA <span className="text-[#A3FF57]">{isTomorrow ? 'DE MAÑANA' : 'DEL DÍA'}</span>
                </h1>
                {/* Date pill */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 border border-[#4F7FFF]/40 bg-[#0D1B3E]/80 rounded-full px-6 py-2 shadow-[0_0_20px_rgba(79,127,255,0.15)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF57] animate-pulse" />
                        <span className="text-[13px] font-bold tracking-[0.2em] text-white uppercase">
                            {format(displayDate, 'EEEE, d \'de\' MMMM yyyy', { locale: es })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* ── CARDS ROW ── */}
            <div className="z-10 flex items-end justify-center gap-10 w-full max-w-[1600px] px-10">

                {/* LEFT — 5AM Matutina */}
                <SideCard
                    icon={<Sunrise className="w-8 h-8 text-[#4F7FFF]" />}
                    avatarUrl={getMemberDetail(slot5am?.leaderId || null).avatar}
                    memberName={getMemberDetail(slot5am?.leaderId || null).name}
                    roleName="Consagración"
                    label={slot5am?.customLabel || getSlotLabel('5am', settings.language)}
                    language={slot5am?.language}
                    hour="05:00"
                    period="AM"
                    subtitle="Consagración Matutina"
                    delay={0.1}
                    accent="bg-gradient-to-r from-[#4F7FFF] via-[#4F7FFF]/50 to-transparent"
                    accentText="text-[#4F7FFF] border-[#4F7FFF]/40"
                    isActive={isSlotActive('5am')}
                >
                    <></>
                </SideCard>

                {/* CENTER — 9AM / 10AM Sunday Morning Slot */}
                {(() => {
                    const isSunday = displayDate.getDay() === 0;

                    // IF SUNDAY, WE RENDER THE CUSTOM DOMINICAL CARD
                    if (isSunday) {
                        const type = slot9am?.sundayType || 'local';
                        let accent = "from-transparent via-[#FFB060]/80 to-[#FFB060]"; // Bright Light Orange
                        let accentText = "text-[#FFB060] border-[#FFB060]/50";
                        let Icon = Crown;
                        let bgClass = "bg-gradient-to-b from-[#3A1D04] to-[#120800] border-[#FFB060]/50 shadow-[0_30px_90px_rgba(255,176,96,0.3)]"; // Visible Light Orange Muted

                        if (type === 'exchange') {
                            accent = "from-transparent via-[#9333EA]/50 to-[#9333EA]"; // Purple
                            accentText = "text-[#9333EA] border-[#9333EA]/40";
                            Icon = HeartHandshake;
                            bgClass = "bg-[#140b18] border-[#9333EA]/40 shadow-[0_30px_90px_rgba(147,51,234,0.15)]"; // Dark Purple Tint
                        } else if (type === 'broadcast') {
                            accent = "from-transparent via-[#EF4444]/50 to-[#EF4444]"; // Red
                            accentText = "text-[#EF4444] border-[#EF4444]/40";
                            Icon = Radio;
                            bgClass = "bg-[#1a0a0a] border-[#EF4444]/40 shadow-[0_30px_90px_rgba(239,68,68,0.15)]"; // Dark Red Tint
                        } else if (type === 'visitors') {
                            accent = "from-transparent via-[#10B981]/50 to-[#10B981]"; // Emerald
                            accentText = "text-[#10B981] border-[#10B981]/40";
                            Icon = Users;
                            bgClass = "bg-[#061410] border-[#10B981]/40 shadow-[0_30px_90px_rgba(16,185,129,0.15)]"; // Dark Emerald Tint
                        }

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                                className={`relative flex flex-col w-[450px] rounded-[2.5rem] border-2 ${bgClass} mt-16`}
                            >
                                {isSlotActive('9am') && <LiveBadge rounding="rounded-b-[2.5rem]" />}

                                {slot9am.language === 'en' && (
                                    <div className={`absolute top-8 -left-4 ${type === 'visitors' ? 'bg-[#F97316] text-black border-[#ea580c]' : 'bg-[#1E3A8A] text-white border-[#3B82F6]'} px-4 py-1 rounded-r-xl shadow-lg border-y border-r z-20 overflow-hidden group`}>
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/50" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full animate-shimmer" />
                                        <span className="text-[14px] font-black uppercase tracking-widest flex items-center gap-1 drop-shadow-md">
                                            EN
                                        </span>
                                    </div>
                                )}
                                {/* Top accent line */}
                                <div className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${accent} rounded-t-[2.5rem]`} />

                                {/* Main Icon / Avatar area */}
                                <div className="relative -mt-20 mb-8 z-50 w-full px-6 flex justify-center items-end min-h-[176px]">
                                    {type === 'local' && (
                                        <div className="flex flex-col items-center">
                                            <motion.div whileHover={{ scale: 1.05 }} className="relative w-36 h-36 rounded-3xl bg-[#1A0C00] border-4 border-[#3A1D04] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,176,96,0.35)] overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB060]/40 via-transparent to-transparent opacity-70" />
                                                <div className="absolute inset-0 rounded-3xl border-2 border-[#FFB060]/50 animate-pulse opacity-60" />

                                                {minister?.avatar ? (
                                                    <img src={minister.avatar} alt="Ministro" className="w-full h-full object-cover relative z-10" />
                                                ) : (
                                                    <Flame className="w-16 h-16 text-[#FFB060]/60 relative z-10" />
                                                )}
                                            </motion.div>
                                            <motion.div className={`mt-3 px-6 py-2 rounded-xl bg-[#1A0C00] border border-[#3A1D04] ${accentText} flex flex-col items-center`}>
                                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">{minister?.name || 'Ministro a Cargo'}</span>
                                            </motion.div>
                                            
                                            {/* Additional Assignments */}
                                            {(slot9am?.consecrationLeaderId || slot9am?.doctrineLeaderId) && (
                                                <div className="flex gap-4 mt-6 w-[120%] -mx-[10%] px-4">
                                                    {slot9am?.consecrationLeaderId && (
                                                        <div className="flex-1">
                                                            {renderMember(slot9am.consecrationLeaderId, "Cons.", 0, true)}
                                                        </div>
                                                    )}
                                                    {slot9am?.doctrineLeaderId && (
                                                        <div className="flex-1">
                                                            {renderMember(slot9am.doctrineLeaderId, "Clase", 1, true)}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {type === 'exchange' && (
                                        <div className="flex flex-col items-center">
                                            <motion.div className="relative w-36 h-36 rounded-3xl bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(147,51,234,0.25)] overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#9333EA]/30 via-transparent to-transparent opacity-60" />
                                                <Icon className="w-16 h-16 text-[#9333EA] animate-pulse relative z-10" />
                                            </motion.div>
                                            <motion.div className={`mt-3 px-6 py-2 rounded-xl bg-[#071020] border border-[#1E3A6E] ${accentText}`}>
                                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">Intercambio</span>
                                            </motion.div>
                                        </div>
                                    )}

                                    {type === 'broadcast' && (
                                        <div className="flex flex-col items-center">
                                            <motion.div className="relative w-36 h-36 rounded-full bg-[#071020] border-4 border-[#EF4444] shadow-[0_0_50px_rgba(239,68,68,0.5)] flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#EF4444]/40 to-transparent" />
                                                <div className="absolute inset-0 border-[6px] border-white border-dotted animate-spin-slow opacity-20 rounded-full" />
                                                <Radio className="w-16 h-16 text-white animate-pulse relative z-10" />
                                            </motion.div>
                                            <motion.div className={`mt-3 px-6 py-2 rounded-xl bg-[#071020] border border-[#1E3A6E] ${accentText}`}>
                                                <span className="text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                                                    Señal en Vivo
                                                </span>
                                            </motion.div>
                                        </div>
                                    )}

                                    {type === 'visitors' && (
                                        <div className="flex flex-col items-center">
                                            <motion.div className="relative w-36 h-36 rounded-3xl bg-[#071020] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.25)] overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/30 via-transparent to-transparent opacity-60" />
                                                <Icon className="w-16 h-16 text-[#10B981] relative z-10" />
                                            </motion.div>
                                            <motion.div className={`mt-3 px-6 py-2 rounded-xl bg-[#071020] border border-[#1E3A6E] ${accentText}`}>
                                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">Para Visitas</span>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Titles depending on Type */}
                                <div className="px-6 text-center z-10">
                                    {type === 'local' && (
                                        <>
                                            <h3 className="text-[22px] font-black text-white/90 uppercase tracking-[0.05em] leading-[1.1] drop-shadow-md">
                                                Escuela Dominical
                                            </h3>
                                            <p className={`text-[12px] font-bold mt-2 uppercase tracking-[0.2em] ${accentText.split(' ')[0]}`}>
                                                Iglesia Local
                                            </p>
                                        </>
                                    )}
                                    {type === 'exchange' && (
                                        <>
                                            <h3 className="text-[24px] font-black text-[#d8b4fe] uppercase tracking-[0.05em] leading-[1.1] drop-shadow-[0_2px_10px_rgba(216,180,254,0.3)]">
                                                Intercambio de Ministro
                                            </h3>
                                            {slot9am.churchOrigin && slot9am.churchOrigin !== 'Por Confirmar...' && (
                                                <p className="text-[14px] font-bold mt-2 text-[#a855f7] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                    {slot9am.churchOrigin}
                                                </p>
                                            )}
                                        </>
                                    )}
                                    {type === 'broadcast' && (
                                        <>
                                            <h3 className="text-[24px] font-black text-white uppercase tracking-[0.05em] leading-[1.1] drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
                                                Transmisión
                                            </h3>
                                            <p className={`text-[12px] font-bold mt-2 uppercase tracking-[0.2em] ${accentText.split(' ')[0]}`}>
                                                Internacional
                                            </p>
                                        </>
                                    )}
                                    {type === 'visitors' && (
                                        <>
                                            <h3 className="text-[22px] font-black text-[#6ee7b7] uppercase tracking-[0.05em] leading-[1.1] drop-shadow-[0_2px_10px_rgba(110,231,183,0.3)]">
                                                Dominical de Visitas
                                            </h3>
                                            <p className="text-[14px] font-bold mt-2 text-[#34d399] uppercase tracking-[0.2em]">
                                                {slot9am.language === 'en' ? 'English Service' : 'Puertas Abiertas'}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Timer / Base Info */}
                                <div className="flex items-end justify-center gap-2 mt-8 px-6">
                                    <span className="text-[3rem] font-black text-white leading-none tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">10:00</span>
                                    <span className="text-xl font-black text-white/30 mb-2">AM</span>
                                </div>

                                <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[#1E3A6E] to-transparent mb-6 opacity-60 mt-4" />

                                {/* Espacio vacío abajo (eliminados los cuadros de consagración por petición) */}
                                <div className="px-8 pb-10 flex flex-col gap-3 flex-1">
                                    {/* (Contenido limpio) */}
                                </div>

                                {/* Bottom corner watermark removed */}
                            </motion.div>
                        );
                    }

                    // NORMAL NON-SUNDAY RENDER (SIDE CARD)
                    return (
                        <SideCard
                            icon={<Sun className="w-8 h-8 text-[#A3FF57]" />}
                            avatarUrl={getMemberDetail(slot9am?.consecrationLeaderId || null).avatar}
                            memberName={getMemberDetail(slot9am?.consecrationLeaderId || null).name}
                            roleName={slot9am?.consecrationLeaderId === slot9am?.doctrineLeaderId ? (is14th ? "Historia de la Iglesia" : "Consagración y Doctrina") : "Consagración"}
                            avatarUrl2={slot9am?.consecrationLeaderId !== slot9am?.doctrineLeaderId ? getMemberDetail(slot9am?.doctrineLeaderId || null).avatar : undefined}
                            memberName2={slot9am?.consecrationLeaderId !== slot9am?.doctrineLeaderId ? getMemberDetail(slot9am?.doctrineLeaderId || null).name : undefined}
                            roleName2={slot9am?.consecrationLeaderId !== slot9am?.doctrineLeaderId ? (is14th ? "Historia" : "Doctrina") : undefined}
                            label={slot9am?.customLabel || getSlotLabel('9am_regular', settings.language)}
                            language={slot9am?.language}
                            hour={slot9am?.time ? slot9am.time.split(' ')[0] : "09:00"}
                            period={slot9am?.time ? slot9am.time.split(' ')[1] : "AM"}
                            subtitle="Oración de Intermedia"
                            delay={0.2}
                            accent="bg-gradient-to-r from-transparent via-[#A3FF57]/50 to-[#A3FF57]"
                            accentText="text-[#A3FF57] border-[#A3FF57]/40"
                            isActive={isSlotActive('9am')}
                        >
                            <></>
                        </SideCard>
                    );
                })()}

                {/* FEATURED — Evening Service (Large Card) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="relative flex flex-col w-[600px] rounded-[3.5rem] border-2 border-[#1E3A6E] bg-[#071020] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-20 group min-h-[500px]"
                >
                    {/* LIVE INDICATOR */}
                    {isActiveEvening && <LiveBadge rounding="rounded-b-[3.5rem]" />}

                    {/* English/Married Side-Tab Badge */}
                    {slotEvening?.language === 'en' && (
                        <div className="absolute left-0 top-64 h-24 w-1 z-[70]">
                            <div className="absolute -left-[2px] top-0 h-full w-20 bg-[#FF6B00] rounded-r-2xl shadow-[15px_0_40px_rgba(255,107,0,0.5)] flex items-center justify-center overflow-hidden border-y-2 border-r-2 border-white/20">
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-white/30" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                                <span className="text-[18px] font-black text-white uppercase tracking-tighter shadow-md text-center leading-none">
                                    ENGLISH
                                </span>
                            </div>
                            {/* Glow pulse */}
                            <div className="absolute -left-1 top-0 h-full w-3 bg-orange-600 blur-lg animate-pulse" />
                        </div>
                    )}

                    {/* Top glow accent */}
                    <div className="absolute -top-[2px] left-1/4 right-1/4 h-[4px] bg-gradient-to-r from-transparent via-[#A3FF57] to-transparent blur-sm" />

                    {/* Member Avatars */}
                    <div className="relative -mt-24 mb-6 z-50 w-full px-6 flex justify-center items-end min-h-[220px]">
                        {slotEvening?.leaderIds && slotEvening.leaderIds.length > 0 ? (
                            slotEvening.type === 'married' ? (
                                /* OVERLAPPING MARRIAGE LAYOUT */
                                <div className="flex flex-col items-center">
                                    <div className="flex -space-x-8 z-10 items-end">
                                        {/* Husband Avatar */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative w-44 h-44 rounded-full bg-[#071020] border-4 border-[#A3FF57] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(163,255,87,0.4)] overflow-visible z-20"
                                        >
                                            <div className="absolute inset-0 rounded-full border-[3px] border-[#A3FF57]/30 border-dotted animate-spin-slow" />
                                            {getMemberDetail(slotEvening.leaderIds[0]).avatar ? (
                                                <img src={getMemberDetail(slotEvening.leaderIds[0]).avatar!} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Church className="w-16 h-16 text-[#A3FF57]/50" />
                                            )}
                                        </motion.div>

                                        {/* Wife Avatar */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative w-40 h-40 rounded-full bg-[#071020] border-4 border-[#A3FF57] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(163,255,87,0.2)] overflow-visible z-10"
                                        >
                                            <div className="absolute inset-0 rounded-full border-[3px] border-[#A3FF57]/30 border-dotted animate-spin-reverse" />
                                            {slotEvening.leaderIds[1] && getMemberDetail(slotEvening.leaderIds[1]).avatar ? (
                                                <img src={getMemberDetail(slotEvening.leaderIds[1]).avatar!} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Flame className="w-16 h-16 text-[#A3FF57]/50" />
                                            )}
                                        </motion.div>
                                    </div>
                                    <motion.div className="mt-8 flex justify-center items-center gap-12 w-full z-30 relative px-4">
                                        {/* Leader 1 Details */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black text-[#A3FF57] uppercase tracking-[0.4em] mb-1.5 drop-shadow-[0_0_8px_rgba(163,255,87,0.5)]">Servicio</span>
                                            <span className="text-[22px] font-black text-white uppercase tracking-[0.05em] drop-shadow-md leading-none bg-black/40 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-xl">
                                                {getMemberDetail(slotEvening.leaderIds[0]).name.split(' ')[0]}
                                            </span>
                                        </div>

                                        {/* Elegant Separator */}
                                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#A3FF57]/60 to-transparent shadow-[0_0_10px_rgba(163,255,87,0.4)]" />

                                        {/* Leader 2 Details */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black text-[#A3FF57] uppercase tracking-[0.4em] mb-1.5 drop-shadow-[0_0_8px_rgba(163,255,87,0.5)]">{is14th ? 'Historia' : 'Doctrina'}</span>
                                            <span className="text-[22px] font-black text-white uppercase tracking-[0.05em] drop-shadow-md leading-none bg-black/40 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-xl">
                                                {slotEvening.leaderIds[1]
                                                    ? getMemberDetail(slotEvening.leaderIds[1]).name.split(' ')[0]
                                                    : (is14th ? 'Historia' : 'Esposa')
                                                }
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : slotEvening.leaderIds.length === 2 ? (
                                /* DUAL CORNER LAYOUT (e.g., Youth Service / Special Events) */
                                <>
                                    {/* Leader 1 (Top Left) */}
                                    <div className="absolute -left-6 top-0 flex flex-col items-center">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative w-40 h-40 rounded-full bg-[#0D1B3E] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(79,127,255,0.2)] overflow-visible"
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-[#4F7FFF]/20 border-dashed animate-spin-slow" />
                                            {getMemberDetail(slotEvening.leaderIds[0]).avatar ? (
                                                <img src={getMemberDetail(slotEvening.leaderIds[0]).avatar!} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Flame className="w-16 h-16 text-[#4F7FFF]/50" />
                                            )}
                                        </motion.div>
                                        <motion.div className="mt-4 px-6 py-2 rounded-2xl bg-[#0D1B3E]/95 border-2 border-[#4F7FFF]/50 shadow-xl backdrop-blur-xl flex flex-col items-center min-w-[140px]">
                                            <span className="text-[9px] font-black text-[#4F7FFF] uppercase tracking-[0.2em] mb-0.5 opacity-80">
                                                {slotEvening?.type === 'children' ? (is14th ? 'Historia' : 'Consagración') : 'Director'}
                                            </span>
                                            <span className="text-[18px] font-black text-white uppercase tracking-[0.05em]">{getMemberDetail(slotEvening.leaderIds[0]).name}</span>
                                        </motion.div>
                                    </div>

                                    {/* Leader 2 (Top Right) */}
                                    <div className="absolute -right-6 top-0 flex flex-col items-center">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative w-40 h-40 rounded-full bg-[#0D1B3E] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(163,255,87,0.25)] overflow-visible"
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-[#A3FF57]/20 border-dashed animate-spin-slow" />
                                            {getMemberDetail(slotEvening.leaderIds[1]).avatar ? (
                                                <img src={getMemberDetail(slotEvening.leaderIds[1]).avatar!} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Flame className="w-16 h-16 text-[#A3FF57]/50" />
                                            )}
                                        </motion.div>
                                        <motion.div className="mt-4 px-6 py-2 rounded-2xl bg-[#0D1B3E]/95 border-2 border-[#A3FF57]/50 shadow-xl backdrop-blur-xl flex flex-col items-center min-w-[140px]">
                                            <span className="text-[9px] font-black text-[#A3FF57] uppercase tracking-[0.2em] mb-0.5 opacity-80">
                                                {slotEvening?.type === 'children' ? (is14th ? 'Historia' : 'Doctrina') : (is14th ? 'Historia' : 'Asistente')}
                                            </span>
                                            <span className="text-[18px] font-black text-white uppercase tracking-[0.05em]">{getMemberDetail(slotEvening.leaderIds[1]).name}</span>
                                        </motion.div>
                                    </div>
                                </>
                            ) : (
                                /* CENTER LAYOUT (Normal / Single Leader) */
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative w-44 h-44 rounded-full bg-[#0D1B3E] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(163,255,87,0.2)] overflow-visible"
                                    >
                                        <div className="absolute inset-0 rounded-full border-2 border-[#A3FF57]/20 border-dashed animate-spin-slow" />
                                        {getMemberDetail(slotEvening.leaderIds[0]).avatar ? (
                                            <img src={getMemberDetail(slotEvening.leaderIds[0]).avatar!} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <Flame className="w-16 h-16 text-[#A3FF57]/50" />
                                        )}
                                    </motion.div>
                                    <motion.div className="mt-4 px-8 py-3 rounded-2xl bg-[#0D1B3E]/95 border-2 border-[#A3FF57]/50 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center min-w-[180px]">
                                        <span className="text-[10px] font-black text-[#A3FF57] uppercase tracking-[0.2em] mb-0.5 opacity-80">{is14th ? 'Historia de la Iglesia' : 'Consagración y Doctrina'}</span>
                                        <span className="text-[24px] font-black text-white uppercase tracking-[0.05em]">{getMemberDetail(slotEvening.leaderIds[0]).name}</span>
                                    </motion.div>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="relative w-44 h-44 rounded-full bg-[#0D1B3E] border-4 border-[#1E3A6E] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(163,255,87,0.2)] overflow-visible">
                                    <Flame className="w-16 h-16 text-[#A3FF57]/50" />
                                </div>
                                <div className="mt-4 px-10 py-3 rounded-2xl bg-[#0D1B3E]/95 border-2 border-[#A3FF57]/50 shadow-2xl backdrop-blur-xl">
                                    <span className="text-[22px] font-black text-white uppercase tracking-[0.1em]">NO ASIGNADO</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Badge */}
                    <div className="flex justify-center">
                        <span className="text-[14px] font-black tracking-[0.4em] uppercase border-2 border-[#A3FF57]/50 text-[#A3FF57] px-8 py-2 rounded-full bg-[#0D1B3E]/90">
                            {slotEvening?.customLabel || (slotEvening?.time?.includes('07:00') || slotEvening?.time?.includes('19:00') ? 'Oración de la Tarde' : (slotEvening?.topic || getServiceTypeLabel(slotEvening?.type || 'regular', settings.language, is14th)))}
                        </span>
                    </div>

                    {/* Time — neon green numbers */}
                    <div className="flex items-end justify-center gap-2 mt-8 px-6">
                        <span className="text-[4rem] font-black text-[#A3FF57] leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(163,255,87,0.6)]">
                            {slotEvening?.time ? slotEvening.time.split(' ')[0] : '18:00'}
                        </span>
                        <span className="text-2xl font-black text-[#A3FF57]/40 mb-2">
                            {slotEvening?.time ? slotEvening.time.split(' ')[1] : 'PM'}
                        </span>
                    </div>

                    <p className="text-center text-[14px] tracking-[0.4em] text-white/50 uppercase font-black mb-8 px-4">
                        {isServiceDay ? 'Servicio Vespertino' : 'Oración Vespertina'}
                    </p>

                    {/* Divider with dot */}
                    <div className="mx-10 flex items-center gap-4 mb-12">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#A3FF57]/40" />
                        <div className="w-3 h-3 rounded-full bg-[#A3FF57] shadow-[0_0_15px_#A3FF57]" />
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#A3FF57]/40" />
                    </div>

                    {/* Evening watermark removed */}
                </motion.div>

                {/* OPTIONAL — 12PM Noon Prayer */}
                {
                    slot12pm?.leaderId && (
                        <SideCard
                            icon={<Sun className="w-8 h-8 text-[#00E5FF]" />}
                            avatarUrl={getMemberDetail(slot12pm.leaderId).avatar}
                            memberName={getMemberDetail(slot12pm.leaderId).name}
                            roleName="Consagración"
                            label={slot12pm.customLabel || "Consagración de 12"}
                            language={slot12pm.language}
                            hour={slot12pm.time ? slot12pm.time.split(' ')[0] : "12:00"}
                            period={slot12pm.time ? slot12pm.time.split(' ')[1] : "PM"}
                            subtitle="Consagración del Mediodía"
                            delay={0.4}
                            accent="bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-[#00E5FF]"
                            accentText="text-[#00E5FF] border-[#00E5FF]/40"
                            isActive={isSlotActive('12pm')}
                        >
                            <></>
                        </SideCard>
                    )
                }

            </div >

            {/* ── footer branding ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="z-10 mt-10 text-[9px] tracking-[0.6em] text-white/10 uppercase font-mono select-none"
            >
                {/* Footer branding removed */}
            </motion.p >
        </div >
    );
}
