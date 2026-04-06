'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    Shield,
    Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

// Components
import { AttendanceOverview } from '@/components/dashboard/ministro/AttendanceOverview';
import { MemberCard } from '@/components/dashboard/ministro/MemberCard';
import { AgendaSection } from '@/components/dashboard/ministro/AgendaSection';
import { DirectorySection } from '@/components/dashboard/ministro/DirectorySection';
import { MemberDetailModal } from '@/components/dashboard/ministro/MemberDetailModal';

// Types & Libs
import { supabase } from '@/lib/supabaseClient';
import { useAppStore } from '@/lib/store';

const itemsPerPage = 8;
const BUILD_ID = "FINAL_STABILIZATION_v10_APR_06_22_18_MODULAR_v3";

export default function MinistroDashboardPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<'censo' | 'agenda' | 'directory'>('censo');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isExporting, setIsExporting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const { 
        members, 
        loadMembersFromCloud, 
        monthlySchedule, 
        loadAllSchedulesFromCloud, 
        updateProfileInCloud,
        saveRecurringScheduleToCloud,
        showNotification
    } = useAppStore();

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }
            
            await Promise.all([
                loadMembersFromCloud(),
                loadAllSchedulesFromCloud()
            ]);
            setIsLoaded(true);
        };
        init();
    }, []);

    const attendanceData = useMemo(() => {
        if (!members || !members.length) return [0, 0, 0, 0, 0];
        
        const avg = members.reduce((acc, m) => {
            const att = m.stats?.attendance;
            if (att && att.total > 0) return acc + (att.attended / att.total) * 100;
            return acc;
        }, 0) / members.length;
        
        const base = Math.round(avg);
        return [base - 10, base - 5, base + 2, base - 3, base];
    }, [members]);

    const privilegedMembers = useMemo(() => 
        members.filter(m => m.role !== 'Miembro' && m.status === 'Activo'), 
    [members]);

    const monthDays = useMemo(() => 
        eachDayOfInterval({ 
            start: startOfMonth(selectedDate), 
            end: endOfMonth(selectedDate) 
        }), 
    [selectedDate]);

    // Handlers
    const updateDaySlot = async (date: Date, slot: string, data: any) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            const current = (monthlySchedule as any)[dateStr] || { slots: {} };
            const slotData = { ...(current.slots[slot] || {}), ...data };
            
            // Map our memory-optimized format back to DB columns
            const dbUpdate: any = { date: dateStr, updated_at: new Date().toISOString() };
            
            if (slot === '5am') {
                if (slotData.leaderId !== undefined) dbUpdate.five_am_leader_id = slotData.leaderId;
                if (slotData.time !== undefined) dbUpdate.five_am_time = slotData.time;
                if (slotData.language !== undefined) dbUpdate.five_am_language = slotData.language;
            } else if (slot === '9am') {
                if (slotData.consecrationLeaderId !== undefined) dbUpdate.nine_am_consecration_leader_id = slotData.consecrationLeaderId;
                if (slotData.doctrineLeaderId !== undefined) dbUpdate.nine_am_doctrine_leader_id = slotData.doctrineLeaderId;
                if (slotData.sundayType !== undefined) dbUpdate.nine_am_sunday_type = slotData.sundayType;
                if (slotData.topic !== undefined) dbUpdate.nine_am_topic = slotData.topic;
                if (slotData.time !== undefined) dbUpdate.nine_am_time = slotData.time;
                if (slotData.language !== undefined) dbUpdate.nine_am_language = slotData.language;
            } else if (slot === 'evening') {
                if (slotData.leaderIds !== undefined) dbUpdate.evening_leader_ids = slotData.leaderIds;
                if (slotData.doctrineLeaderId !== undefined) dbUpdate.evening_doctrine_leader_id = slotData.doctrineLeaderId;
                if (slotData.topic !== undefined) dbUpdate.evening_topic = slotData.topic;
                if (slotData.type !== undefined) dbUpdate.evening_type = slotData.type;
                if (slotData.time !== undefined) dbUpdate.evening_time = slotData.time;
                if (slotData.language !== undefined) dbUpdate.evening_language = slotData.language;
            }

            const { error } = await supabase
                .from('schedule')
                .upsert(dbUpdate);

            if (error) throw error;
            loadAllSchedulesFromCloud();
            showNotification('Agenda actualizada v3.6.1', 'success');
        } catch (err) {
            showNotification('Error al sincronizar agenda', 'error');
        }
    };


    const handleUpdateBio = async (memberId: string, bio: string) => {
        try {
            await updateProfileInCloud(memberId, { bio } as any);
            showNotification('Bitácora actualizada', 'success');
            loadMembersFromCloud();
        } catch (err) {
            showNotification('Error al guardar notas', 'error');
        }
    };

    const handleExportDirectoryPDF = async () => {
        setIsExporting(true);
        const element = document.getElementById('printable-directory');
        if (!element) return;
        
        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 5,
                filename: `Directorio_Ministro_${format(new Date(), 'yyyy_MM_dd')}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm' as const, format: 'a3' as const, orientation: 'landscape' as const }
            };
            await html2pdf().set(opt).from(element).save();
            showNotification('PDF generado con éxito', 'success');
        } catch (err) {
            showNotification('Error al generar PDF', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportIndividualPDF = async (member: any) => {
        setIsExporting(true);
        const element = document.getElementById(`printable-card-${member.id}`);
        if (!element) return;

        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 0,
                filename: `Ficha_${member.name.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg' as const, quality: 1 },
                html2canvas: { scale: 3, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            await html2pdf().set(opt).from(element).save();
            showNotification('Ficha técnica generada', 'success');
        } catch (err) {
            showNotification('Error al exportar ficha', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="w-28 h-28 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <Shield className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-2">Iniciando Dashboard v3.6.1</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Sincronizando seguridad ministerial...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white selection:bg-primary selection:text-white font-sans overflow-x-hidden">
            <Header />

            <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
               <div className="flex flex-col mb-16">
                    <div className="flex flex-wrap items-baseline gap-4 mb-3">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                            Consola <span className="text-primary drop-shadow-[0_0_35px_rgba(239,68,68,0.5)]">Ministro</span>
                        </h1>
                    </div>
               </div>

                <div className="flex flex-wrap gap-4 mb-16 p-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] w-fit">
                    {[
                        { id: 'censo', label: 'Censo y Distribución', icon: Users, color: 'text-red-500' },
                        { id: 'agenda', label: 'Agenda de la Semana', icon: Calendar, color: 'text-primary' },
                        { id: 'directory', label: 'Directorio Pastoral', icon: Activity, color: 'text-emerald-500' }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group",
                                    active ? "bg-white/10 text-white shadow-2xl scale-105" : "text-muted-foreground hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-125", active ? tab.color : "")} />
                                {tab.label}
                                {active && <motion.div layoutId="activeTab" className="absolute inset-0 border border-white/20 rounded-[2rem]" />}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'censo' && (
                        <motion.div
                            key="censo"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-12"
                        >
                            <AttendanceOverview 
                                members={members} 
                                attendanceData={attendanceData} 
                            />

                            <div className="space-y-10">
                                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Alertas de <span className="text-red-500">Supervisión</span></h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">Integrantes con asistencia inferior al 60%</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest italic">Prioridad de Visita</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {members
                                        .filter(m => {
                                            const att = m.stats?.attendance;
                                            return att && att.total > 0 && (att.attended / att.total) < 0.6;
                                        })
                                        .slice(0, 12)
                                        .map((member, idx) => (
                                            <MemberCard 
                                                key={member.id} 
                                                member={member} 
                                                idx={idx} 
                                                onViewDetails={(m) => {
                                                    setSelectedMember(m);
                                                    setIsMemberModalOpen(true);
                                                }} 
                                            />
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'agenda' && (
                        <AgendaSection 
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            monthlySchedule={monthlySchedule}
                            monthDays={monthDays}
                            privilegedMembers={privilegedMembers}
                            updateDaySlot={updateDaySlot}
                            saveRecurringScheduleToCloud={async (date, slot, leaderId, type) => {
                                // Map simple slots to store's expected complex slots if necessary
                                const mappedSlot = slot === '9am' ? '9am_consecration' : (slot as any);
                                await saveRecurringScheduleToCloud(date, mappedSlot, leaderId, type);
                            }}
                            showNotification={showNotification}
                        />
                    )}

                    {activeTab === 'directory' && (
                        <DirectorySection 
                            members={members}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isExporting={isExporting}
                            handleExportDirectoryPDF={handleExportDirectoryPDF}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onViewDetails={(m) => {
                                setSelectedMember(m);
                                setIsMemberModalOpen(true);
                            }}
                        />
                    )}
                </AnimatePresence>

                <MemberDetailModal 
                    isOpen={isMemberModalOpen}
                    onClose={() => setIsMemberModalOpen(false)}
                    member={selectedMember}
                    isExporting={isExporting}
                    onExportIndividualPDF={handleExportIndividualPDF}
                    onUpdateBio={handleUpdateBio}
                />

                <div className="text-center pt-8 border-t border-white/5 opacity-40">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                        LLDM RODEO DIGITAL • SISTEMA INTEGRAL DE GESTIÓN MINISTERIAL
                    </p>
                </div>
            </main>
        </div>
    );
}
