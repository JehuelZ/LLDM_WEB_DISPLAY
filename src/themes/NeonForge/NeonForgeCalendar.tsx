'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { getVariantTokens } from './tokens';

// THEME: NeonForge — Monthly Calendar Slide
const DAYS_OF_WEEK = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export function NeonForgeCalendar() {
    const settings = useAppStore((state: any) => state.settings);
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule);
    const members = useAppStore((state: any) => state.members);
    const T = getVariantTokens(settings);
    const A = T.accent;

    const today = new Date();
    const currentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });
    const startDay = getDay(currentMonth);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const getMemberDetail = (id: string | null) => {
        if (!id) return { name: '', avatar: null };
        const cleanId = id.trim().toLowerCase();
        const member = members.find((m: any) => m.id?.toString().toLowerCase() === cleanId);
        return {
            name: member ? member.name : (id.length > 20 ? 'HERMANO ASIGNADO' : (id || 'NO ASIGNADO')),
        };
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden" style={{ fontFamily: 'var(--font-sora, ui-sans-serif)' }}>
            
            {/* ── TOP AREA (Same structure as Schedule for consistency) ── */}
            <div className="shrink-0 pt-20 pl-72 pr-14 pb-4">
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                    style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                    Vista General Mensual
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className="text-[52px] font-black tracking-tight leading-none text-center"
                    style={{ color: '#FFFFFF' }}
                >
                    Calendario <span style={{ color: A, textShadow: `0 0 40px ${A}50` }}>{format(today, 'MMMM', { locale: es })}</span>
                </motion.h1>
                
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
                        <CalendarIcon className="w-3 h-3" style={{ color: A }} />
                        <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {format(today, 'yyyy')}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* ── CALENDAR GRID ── */}
            <div className="flex-1 flex flex-col justify-center gap-2 pl-72 pr-16 pb-16 min-h-0">
                
                {/* Days Header */}
                <div className="grid grid-cols-7 gap-4 w-full mb-2">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="text-center">
                            <span className="text-[11px] font-black tracking-[0.4em] text-white/30 uppercase">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-7 gap-3 w-full"
                    style={{ gridAutoRows: '1fr' }}
                >
                    {blanks.map((b) => (
                        <div key={`blank-${b}`} className="aspect-[1.5/1] rounded-2xl bg-white/[0.01]" />
                    ))}

                    {days.map((day, idx) => {
                        const isToday = isSameDay(day, today);
                        const is14th = day.getDate() === 14;
                        const key = format(day, 'yyyy-MM-dd');
                        const sched = monthlySchedule[key];
                        
                        const m5 = getMemberDetail(sched?.slots?.['5am']?.leaderId);
                        const m9c = getMemberDetail(sched?.slots?.['9am']?.consecrationLeaderId);
                        const m9d = getMemberDetail(sched?.slots?.['9am']?.doctrineLeaderId);
                        const mE1 = getMemberDetail(sched?.slots?.evening?.leaderIds?.[0]);

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.01 * idx }}
                                className="relative aspect-[1.5/1] rounded-2xl border flex flex-col overflow-hidden"
                                style={{
                                    background: isToday ? `${A}12` : 'rgba(255,255,255,0.03)',
                                    backdropFilter: 'blur(10px)',
                                    borderColor: isToday ? A : 'rgba(255,255,255,0.06)',
                                    boxShadow: isToday ? `0 0 30px ${A}15` : 'none'
                                }}
                            >
                                {/* Header of Cell */}
                                <div className="flex items-center justify-between px-3 pt-2 pb-1">
                                    <span className={`text-sm font-black ${isToday ? 'text-white' : 'text-white/40'}`}>
                                        {format(day, 'd')}
                                    </span>
                                    {is14th && <Star size={10} className="text-orange-400" fill="currentColor" />}
                                    {isToday && <div className="w-1.5 h-1.5 rounded-full" style={{ background: A, boxShadow: `0 0 8px ${A}` }} />}
                                </div>

                                {/* Summary */}
                                <div className="flex-1 flex flex-col px-3 justify-center gap-0.5 overflow-hidden">
                                     {m5.name && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full" style={{ background: A }} />
                                            <span className="text-[7px] font-bold text-white/70 truncate">{m5.name}</span>
                                        </div>
                                     )}
                                     {(m9c.name || m9d.name) && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-blue-400" />
                                            <span className="text-[7px] font-bold text-white/70 truncate">{m9c.name || m9d.name}</span>
                                        </div>
                                     )}
                                     {mE1.name && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full" style={{ background: T.secondary }} />
                                            <span className="text-[7px] font-bold text-white/70 truncate">{mE1.name}</span>
                                        </div>
                                     )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
