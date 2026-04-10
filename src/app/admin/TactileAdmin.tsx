"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    RefreshCw
} from 'lucide-react'

import { useAppStore, UserProfile, Announcement, WeeklyTheme } from '@/lib/store'
import { compressImage } from '@/lib/utils'

// Components
import { DashboardTab } from './tabs/DashboardTab'
import { AsistenciaTab } from './tabs/AsistenciaTab'
import { HorariosTab } from './tabs/HorariosTab'
import { ContenidoTab } from './tabs/ContenidoTab'
import { AjustesTab } from './tabs/AjustesTab'
import { MiembrosTab } from './tabs/MiembrosTab'
import { CorosTab } from './tabs/CorosTab'
import { PerfilTab } from './tabs/PerfilTab'
import { MensajesTab } from './tabs/MensajesTab'
import { EstilosTab } from './tabs/EstilosTab'

import { ImageEditor } from '@/components/admin/ImageEditor'

interface TactileAdminProps {
    propTab?: string
    isSubpage?: boolean
    children?: React.ReactNode
}

export default function TactileAdmin({ propTab = 'dashboard', isSubpage = false, children }: TactileAdminProps) {
    const {
        members, settings, theme, announcements, attendanceRecords, 
        currentUser, currentDate, messages,
        setCurrentDate, setSettings, setTheme, setCurrentUser,
        loadMembersFromCloud, loadSettingsFromCloud, loadUniformsFromCloud,
        loadRehearsalsFromCloud, loadCloudMessages, subscribeToMessages,
        loadDayScheduleFromCloud, loadAttendanceFromCloud,
        saveSettingsToCloud, saveThemeToCloud, saveAnnouncementToCloud,
        deleteAnnouncementFromCloud, uploadAvatar, showNotification,
        updateProfileInCloud, deleteMemberFromCloud, saveAttendanceToCloud,
        loadMemberAttendanceHistory, loadWeeklyAttendanceStats,
        markMessageAsRead, sendCloudMessage, signOut
    } = useAppStore();

    const [activeTab, setActiveTab] = useState(propTab);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [memberFilter, setMemberFilter] = useState('all');
    const [showAddMember, setShowAddMember] = useState(false);
    const [editingMember, setEditingMember] = useState<UserProfile | null>(null);
    const [imageToEdit, setImageToEdit] = useState<{ source: string, target: 'member' | 'minister' | 'display-bg' | string } | null>(null);
    const [intelligenceRange, setIntelligenceRange] = useState<7 | 15 | 30 | 'month'>(7);

    // Initial load
    useEffect(() => {
        loadMembersFromCloud();
        loadSettingsFromCloud();
        loadUniformsFromCloud();
        loadRehearsalsFromCloud();
        loadCloudMessages();
        
        const unsubSettings = useAppStore.getState().subscribeToSettings();
        const unsubMessages = subscribeToMessages();
        
        return () => {
            unsubSettings();
            unsubMessages();
        };
    }, []);

    // Tab sync with layout
    useEffect(() => {
        if (propTab && propTab !== activeTab) {
            setActiveTab(propTab);
        }
    }, [propTab]);

    // Data sync on date change
    useEffect(() => {
        loadDayScheduleFromCloud(currentDate);
        loadAttendanceFromCloud(currentDate);
    }, [currentDate]);

    // Computed Stats
    const weeklyStats = useMemo(() => {
        // Mocking or computing from attendanceRecords if possible
        return [
            { day: 'Lun', attendance: 45 },
            { day: 'Mar', attendance: 52 },
            { day: 'Mie', attendance: 48 },
            { day: 'Jue', attendance: 61 },
            { day: 'Vie', attendance: 55 },
            { day: 'Sab', attendance: 70 },
            { day: 'Dom', attendance: 95 },
        ];
    }, [attendanceRecords]);

    const attendanceTrend = useMemo(() => ({ value: 12, isPos: true }), []);
    const monthlyIntelligence = useMemo(() => [
        { label: 'Sem 1', value: 85 },
        { label: 'Sem 2', value: 88 },
        { label: 'Sem 3', value: 92 },
        { label: 'Sem 4', value: 90 },
    ], []);

    const dataURLtoFile = (dataurl: string, filename: string) => {
        let arr = dataurl.split(','),
            match = arr[0].match(/:(.*?);/),
            mime = match ? match[1] : 'image/jpeg',
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const handleImageSave = async (dataUrl: string) => {
        if (!imageToEdit) return;
        setIsSaving(true);
        try {
            const file = dataURLtoFile(dataUrl, `edited-${Date.now()}.jpg`);
            const publicUrl = await uploadAvatar(imageToEdit.target, file);
            
            if (publicUrl) {
                if (imageToEdit.target === 'minister') {
                    await saveSettingsToCloud({ ministerAvatar: publicUrl });
                } else if (imageToEdit.target === 'display-bg') {
                    await saveSettingsToCloud({ displayCustomBgUrl: publicUrl });
                } else if (editingMember) {
                    await updateProfileInCloud(editingMember.id, { avatar: publicUrl });
                }
                showNotification('Imagen actualizada exitosamente', 'success');
            }
        } catch (error) {
            showNotification('Error al guardar la imagen', 'error');
        } finally {
            setIsSaving(false);
            setImageToEdit(null);
        }
    }

    const renderTabContent = () => {
        if (isSubpage) return <div className="w-full h-full">{children}</div>;

        switch (activeTab) {
            case 'dashboard':
                return (
                    <DashboardTab 
                        isSaving={isSaving}
                        setIsSaving={setIsSaving}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        intelligenceRange={intelligenceRange}
                        setIntelligenceRange={setIntelligenceRange}
                        attendanceTrend={attendanceTrend}
                        monthlyIntelligence={monthlyIntelligence}
                        weeklyStats={weeklyStats}
                    />
                );
            case 'asistencia':
                return (
                    <AsistenciaTab 
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        members={members}
                        weeklyStats={weeklyStats}
                        setShowAddMember={setShowAddMember}
                    />
                );
            case 'horarios':
                return <HorariosTab key={currentDate} currentDate={currentDate} setCurrentDate={setCurrentDate} />;
            case 'contenido':
            case 'temas':
                return (
                    <ContenidoTab 
                        theme={theme} 
                        setTheme={setTheme} 
                        saveThemeToCloud={saveThemeToCloud}
                        announcements={announcements}
                        saveAnnouncementToCloud={saveAnnouncementToCloud}
                        deleteAnnouncementFromCloud={deleteAnnouncementFromCloud}
                        settings={settings}
                        setSettings={setSettings}
                        showNotification={showNotification}
                        uploadAvatar={uploadAvatar}
                    />
                );
            case 'miembros':
                return (
                    <MiembrosTab 
                        members={members}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        memberFilter={memberFilter}
                        setMemberFilter={setMemberFilter}
                        setShowAddMember={setShowAddMember}
                        setEditingMember={setEditingMember}
                    />
                );
            case 'coros':
                return <CorosTab currentDate={currentDate} setActiveTab={setActiveTab} />;
            case 'perfil':
                return (
                    <PerfilTab 
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        updateProfileInCloud={async (id, data) => { await updateProfileInCloud(id, data); }}
                        uploadAvatar={uploadAvatar}
                        signOut={signOut}
                        showNotification={showNotification}
                    />
                );
            case 'mensajes':
                return (
                    <MensajesTab 
                        messages={messages}
                        currentUser={currentUser}
                        markMessageAsRead={markMessageAsRead}
                        sendCloudMessage={sendCloudMessage}
                        showNotification={showNotification}
                    />
                );
            case 'configuracion':
                const ministerMember = members.find(m => m.name === settings.ministerName);
                return (
                    <AjustesTab 
                        settings={settings}
                        setSettings={setSettings}
                        saveSettingsToCloud={saveSettingsToCloud}
                        calendarStyles={settings.calendarStyles || {}} 
                        setCalendarStyles={(styles: any) => saveSettingsToCloud({ calendarStyles: styles })} 
                        uploadAvatar={uploadAvatar}
                        minister={ministerMember || {}} 
                        setMinister={async (m: any) => { await updateProfileInCloud(m.id, m); }}
                        updateProfileInCloud={async (id, data) => { await updateProfileInCloud(id, data); }}
                        showNotification={showNotification}
                        handleCustomLogoUpload={async (e, slot) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setIsSaving(true);
                                const url = await uploadAvatar(`custom-logo-${slot}`, file);
                                if (url) {
                                    await saveSettingsToCloud({ [`customLogo${slot}`]: url });
                                    showNotification('Logo actualizado', 'success');
                                }
                                setIsSaving(false);
                            }
                        }}
                    />
                );
            case 'estilos':
                return (
                    <EstilosTab 
                        settings={settings}
                        setSettings={setSettings}
                        saveSettingsToCloud={saveSettingsToCloud}
                        calendarStyles={settings.calendarStyles || {}}
                        setCalendarStyles={(styles: any) => saveSettingsToCloud({ calendarStyles: styles })}
                        showNotification={showNotification}
                    />
                );
            default:
                return <DashboardTab 
                    isSaving={isSaving}
                    setIsSaving={setIsSaving}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    intelligenceRange={intelligenceRange}
                    setIntelligenceRange={setIntelligenceRange}
                    attendanceTrend={attendanceTrend}
                    monthlyIntelligence={monthlyIntelligence}
                    weeklyStats={weeklyStats}
                />;
        }
    };

    return (
        <div className="tactile-admin-root relative">
            <div className="base-glow" />
            
            <motion.div 
                className="tactile-scroll"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + (isSubpage ? '-sub' : '')}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Global Modals */}
            <ImageEditor 
                isOpen={!!imageToEdit}
                imageSrc={imageToEdit?.source || ''}
                onClose={() => setImageToEdit(null)}
                onSave={handleImageSave}
            />

            {/* Indicator for saving */}
            <AnimatePresence>
                {isSaving && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className="bg-primary/20 backdrop-blur-xl border border-primary/40 p-4 rounded-md flex items-center gap-3 shadow-2xl">
                            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sincronizando...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
