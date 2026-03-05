'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Slot entry: big name + readable role label
const SlotEntry = ({
    timeLabel,
    timeColor,
    name,
    role,
    nameColor,
    roleColor,
    secondary,
    secondaryRole,
    secondaryColor,
    paired,          // true = show both on same line (married couples)
}: {
    timeLabel: string;
    timeColor: string;
    name: string;
    role: string;
    nameColor: string;
    roleColor: string;
    secondary?: string;
    secondaryRole?: string;
    secondaryColor?: string;
    paired?: boolean;
}) => (
    <div className="flex flex-col gap-0">
        {/* Time badge */}
        <span className={`text-[7px] font-black uppercase tracking-widest ${timeColor} leading-none mb-[2px]`}>
            {timeLabel}
        </span>

        {paired && secondary ? (
            // ── PAIRED MODE: both names on same line separated by & ──
            <>
                <span className={`text-[13px] font-black leading-tight break-words ${nameColor}`}>
                    {name} <span className="text-[#4B5563] font-normal">&</span> {secondary}
                </span>
                <span className={`text-[8px] font-semibold uppercase tracking-wider leading-none ${roleColor} mb-[1px]`}>
                    {role}
                </span>
            </>
        ) : (
            // ── STACKED MODE: primary + optional secondary below ──
            <>
                <span className={`text-[15px] font-black leading-tight break-words ${nameColor}`}>
                    {name}
                </span>
                <span className={`text-[8px] font-semibold uppercase tracking-wider leading-none ${roleColor} mb-[3px]`}>
                    {role}
                </span>
                {secondary && (
                    <>
                        <span className={`text-[14px] font-bold leading-tight break-words ${secondaryColor || nameColor}`}>
                            {secondary}
                        </span>
                        {secondaryRole && (
                            <span className={`text-[8px] font-semibold uppercase tracking-wider leading-none ${roleColor}`}>
                                {secondaryRole}
                            </span>
                        )}
                    </>
                )}
            </>
        )}
    </div>
);

export function DarkMinimalCalendar() {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfMonth(today) });
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);

    const getMember = (id: string | null): string => {
        if (!id) return '';
        const cleanId = id.trim().toLowerCase();
        const m = members.find((x: any) => x.id.toLowerCase() === cleanId);
        return m ? m.name : (id.length > 20 ? '' : id);
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative" style={{ background: '#0F1117' }}>

            {/* ── HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center pt-4 pb-2 shrink-0"
            >
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563] mb-0.5">
                    Vista General Organizacional
                </p>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Calendario <span className="text-[#3B82F6]">Mensual</span>
                </h1>
                <div className="flex items-center gap-2 border border-[#23242F] bg-[#16171F] rounded-full px-3 py-0.5 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                        {format(today, 'MMMM', { locale: es })} <span className="text-[#4B5563] ml-1">{format(today, 'yyyy')}</span>
                    </span>
                </div>
            </motion.div>

            {/* ── DAY-OF-WEEK HEADER ── */}
            <div className="z-10 grid grid-cols-7 gap-1.5 w-[97%] mx-auto mb-1 shrink-0 px-1">
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="text-center py-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#3B82F6]">{day}</span>
                    </div>
                ))}
            </div>

            {/* ── CALENDAR GRID ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="z-10 flex-1 grid grid-cols-7 gap-1.5 w-[97%] mx-auto pb-3 min-h-0 px-1"
                style={{ gridAutoRows: '1fr' }}
            >
                {/* Blank offset cells */}
                {blanks.map((b) => (
                    <div key={`blank-${b}`} className="rounded-xl bg-[#16171F]/20" />
                ))}

                {/* Day cells */}
                {days.map((day, idx) => {
                    const isToday = isSameDay(day, today);
                    const key = format(day, 'yyyy-MM-dd');
                    const sched = monthlySchedule[key];
                    const isSunday = getDay(day) === 0;
                    const isSaturday = getDay(day) === 6;
                    const isWeekend = isSunday || isSaturday;

                    const name5am = getMember(sched?.slots?.['5am']?.leaderId);
                    const nameCons = getMember(sched?.slots?.['9am']?.consecrationLeaderId);
                    const nameDoc = getMember(sched?.slots?.['9am']?.doctrineLeaderId);
                    const sundayType = sched?.slots?.['9am']?.sundayType;
                    const nameEv1 = getMember(sched?.slots?.evening?.leaderIds?.[0]);
                    const nameEv2 = getMember(sched?.slots?.evening?.leaderIds?.[1]);

                    const sundayLabel = sundayType === 'exchange' ? 'Intercambio'
                        : sundayType === 'broadcast' ? 'Transmisión'
                            : sundayType === 'visitors' ? 'Visitas'
                                : nameCons || 'Escuela Dom.';

                    const has9am = isSunday ? !!sundayLabel : !!(nameCons || nameDoc);
                    const hasData = name5am || has9am || nameEv1;

                    // Labels from admin customLabel, fallback to default
                    const label5am = sched?.slots?.['5am']?.customLabel || 'Consagración';
                    const labelEv = sched?.slots?.evening?.customLabel || 'Oración';

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.006 * idx, duration: 0.2 }}
                            className={`
                                relative flex flex-col rounded-xl overflow-hidden border
                                ${isToday
                                    ? 'border-[#3B82F6] bg-[#1C1E2C]'
                                    : isWeekend
                                        ? 'border-[#1C1D25] bg-[#13141B]/70'
                                        : 'border-[#1E1F28] bg-[#16171F]'
                                }
                            `}
                        >
                            {/* Today top accent */}
                            {isToday && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3B82F6]" />}

                            {/* Day number row */}
                            <div className="flex items-center justify-between px-2 pt-1.5 shrink-0">
                                <span className={`text-[13px] font-bold leading-none tabular-nums ${isToday ? 'text-[#3B82F6]'
                                    : isWeekend ? 'text-[#4B5563]'
                                        : 'text-[#6B7280]'
                                    }`}>
                                    {format(day, 'd')}
                                </span>
                                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />}
                            </div>

                            {/* Schedule block */}
                            <div className="flex-1 flex flex-col px-1.5 pb-1.5 gap-1.5 min-h-0 mt-1">

                                {/* 5 AM */}
                                {name5am && (
                                    <SlotEntry
                                        timeLabel="5 AM"
                                        timeColor="text-[#3B82F6]/80"
                                        name={name5am}
                                        role={label5am}
                                        nameColor={isToday ? 'text-white' : 'text-[#E5E7EB]'}
                                        roleColor="text-[#4B5563]"
                                    />
                                )}

                                {/* Divider */}
                                {name5am && (has9am || nameEv1) && (
                                    <div className="h-px bg-[#23242F]" />
                                )}

                                {/* 9 AM / Sunday */}
                                {isSunday ? (
                                    sundayLabel && (
                                        <SlotEntry
                                            timeLabel="10 AM"
                                            timeColor="text-[#F59E0B]/80"
                                            name={sundayLabel}
                                            role="Escuela Dominical"
                                            nameColor={isToday ? 'text-[#F59E0B]' : 'text-[#D97706]'}
                                            roleColor="text-[#78502A]"
                                        />
                                    )
                                ) : (nameCons || nameDoc) ? (
                                    <SlotEntry
                                        timeLabel="9 AM"
                                        timeColor="text-[#3B82F6]/80"
                                        name={nameCons || nameDoc}
                                        role="Consagración"
                                        nameColor={isToday ? 'text-white' : 'text-[#E5E7EB]'}
                                        roleColor="text-[#4B5563]"
                                        secondary={nameCons && nameDoc ? nameDoc : undefined}
                                        secondaryRole={nameCons && nameDoc ? 'Doctrina' : undefined}
                                        secondaryColor={isToday ? 'text-white/70' : 'text-[#9CA3AF]'}
                                    />
                                ) : null}

                                {/* Divider */}
                                {nameEv1 && (name5am || has9am) && (
                                    <div className="h-px bg-[#23242F]" />
                                )}

                                {/* Evening */}
                                {nameEv1 && (() => {
                                    const evType = sched?.slots?.evening?.language === 'en';
                                    const isMarried = sched?.slots?.evening?.type === 'married';
                                    const pairedLabel = isMarried ? 'Matrimonio — Oración & Doctrina' : labelEv;
                                    return (
                                        <div className="relative">
                                            <SlotEntry
                                                timeLabel="Tard."
                                                timeColor={isToday ? 'text-[#3B82F6]/80' : 'text-[#6B7280]/80'}
                                                name={nameEv1}
                                                role={isMarried ? 'Matrimonio' : labelEv}
                                                nameColor={isToday ? 'text-[#60A5FA]' : 'text-[#E5E7EB]'}
                                                roleColor="text-[#4B5563]"
                                                secondary={nameEv2 || undefined}
                                                secondaryRole={!isMarried && nameEv2 ? 'Doctrina' : undefined}
                                                secondaryColor={isToday ? 'text-[#93C5FD]/70' : 'text-[#9CA3AF]'}
                                                paired={isMarried && !!nameEv2}
                                            />
                                            {sched?.slots?.evening?.language === 'en' && (
                                                <div className="absolute right-0 top-0 bg-[#3B82F6] px-1 py-[0.5px] rounded-[2px] shadow-sm">
                                                    <span className="text-[5px] font-black text-white leading-none">EN</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Dot indicators */}
                            {hasData && (
                                <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                                    {name5am && <div className="w-[5px] h-[2px] rounded-full bg-[#3B82F6]/50" />}
                                    {has9am && <div className="w-[5px] h-[2px] rounded-full bg-[#3B82F6]/35" />}
                                    {nameEv1 && <div className={`w-[5px] h-[2px] rounded-full ${isToday ? 'bg-[#3B82F6]' : 'bg-[#3B82F6]/50'}`} />}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Footer branding */}
            <div className="absolute bottom-1 right-8 text-[7px] tracking-widest text-[#1E1F28] font-mono uppercase select-none">
                LLDM · DM-CAL
            </div>
        </div>
    );
}
