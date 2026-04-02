"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    User, Camera, Mail, Phone, Lock, Save, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    TactileGlassCard, TactileInput 
} from '@/components/admin/TactileUI'

interface PerfilTabProps {
    currentUser: any
    setCurrentUser: (user: any) => void
    updateProfileInCloud: (id: string, profile: any) => Promise<void>
    uploadAvatar: (name: string, file: File) => Promise<string | null>
    signOut: () => Promise<void>
    showNotification: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void
}

export const PerfilTab = ({
    currentUser,
    setCurrentUser,
    updateProfileInCloud,
    uploadAvatar,
    signOut,
    showNotification
}: PerfilTabProps) => {
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        bio: currentUser?.bio || ''
    })

    const handleSaveProfile = async () => {
        if (!currentUser?.id) return
        setIsSaving(true)
        try {
            await updateProfileInCloud(currentUser.id, profileData)
            setCurrentUser({ ...currentUser, ...profileData })
            showNotification('Perfil actualizado correctamente', 'success')
        } catch (err) {
            showNotification('Error al actualizar el perfil', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <motion.div
            key="perfil"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            <div className="col-span-1 md:col-span-12 px-4">
                <h2 className="text-4xl font-black capitalize tracking-tighter mb-8 group">Configuración de <span className="text-primary group-hover:text-muted-foreground transition-colors">Mi Perfil</span></h2>
            </div>

            <div className="col-span-1 md:col-span-5 flex flex-col items-center">
                <TactileGlassCard className="w-full h-full flex flex-col items-center justify-center py-12">
                    <div
                        className="w-48 h-48 rounded-md border-8 border-primary/20 p-2 relative group cursor-pointer overflow-hidden shadow-2xl"
                        onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                    >
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} className="w-full h-full object-cover rounded-md group-hover:scale-110 transition-transform duration-700" alt="Avatar" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-md">
                                <User className="w-20 h-20 text-primary opacity-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-[var(--tactile-bg)]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-10 h-10 text-foreground mb-2" />
                            <span className="text-[10px] font-black capitalize tracking-widest text-foreground">Cambiar Foto</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        id="admin-avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file && currentUser?.id) {
                                setIsSaving(true);
                                const url = await uploadAvatar(`admin-${currentUser.id}`, file);
                                if (url) {
                                    await updateProfileInCloud(currentUser.id, { avatar: url });
                                    setCurrentUser({ ...currentUser, avatar: url });
                                    showNotification('Avatar actualizado', 'success');
                                }
                                setIsSaving(false);
                            }
                        }}
                    />
                    <div className="mt-8 text-center">
                        <h3 className="text-xl font-black capitalize">{currentUser?.name || 'Administrador'}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">{currentUser?.role || 'BOSS'}</p>
                    </div>

                    <button
                        onClick={signOut}
                        className="mt-12 group flex items-center gap-3 px-8 py-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
                    </button>
                </TactileGlassCard>
            </div>

            <div className="col-span-1 md:col-span-7">
                <TactileGlassCard title="DATOS PERSONALES">
                    <div className="space-y-6">
                        <TactileInput
                            label="NOMBRE COMPLETO"
                            value={profileData.name}
                            onChange={(e: any) => setProfileData({ ...profileData, name: e.target.value })}
                            icon={User}
                        />
                        <TactileInput
                            label="CORREO ELECTRÓNICO"
                            value={profileData.email}
                            onChange={(e: any) => setProfileData({ ...profileData, email: e.target.value })}
                            icon={Mail}
                            disabled
                        />
                        <TactileInput
                            label="TELÉFONO"
                            value={profileData.phone}
                            onChange={(e: any) => setProfileData({ ...profileData, phone: e.target.value })}
                            icon={Phone}
                        />
                        <div className="space-y-2">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">BIO / NOTAS</label>
                            <textarea
                                className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md p-4 text-xs font-bold outline-none min-h-[120px] focus:border-primary/50 transition-all text-[var(--tactile-text)]"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Escribe algo sobre ti..."
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className={cn(
                                "w-full h-14 bg-primary text-white rounded-md flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all",
                                isSaving && "opacity-50 cursor-wait"
                            )}
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
