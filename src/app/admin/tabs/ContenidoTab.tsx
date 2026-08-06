"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Sparkles, BookOpen, Calendar, Upload, Save, RefreshCw, 
    Bell, Edit2, Trash2, Plus, Monitor, Sunrise, Radio, 
    XCircle, CheckCircle, Reply, MessageSquare, Database,
    Megaphone, AlertCircle, Users, Heart, Flame, Music, Star, Shield, Smile, Image as ImageIcon, Search
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
    TactileGlassCard, TactileInput, TactileSelect, 
    TactileBadge 
} from '@/components/admin/TactileUI'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { MediaGalleryModal } from '@/components/admin/MediaGalleryModal'
import { IconPickerModal } from '@/components/admin/IconPickerModal'
import DynamicIcon from '@/components/ui/DynamicIcon'


export const AnnouncementIcon = ({ name, className, style, size = 18 }: { name: string; className?: string; style?: any; size?: number }) => {
    const icons: Record<string, any> = {
        bell: Bell,
        megaphone: Megaphone,
        info: BookOpen, // fallback to BookOpen/info
        alert: AlertCircle,
        calendar: Calendar,
        users: Users,
        heart: Heart,
        book: BookOpen,
        flame: Flame,
        music: Music,
        star: Star,
        shield: Shield,
        smile: Smile
    };
    const IconComponent = icons[name] || Bell;
    return <IconComponent className={className} style={style} size={size} />;
};

interface ContenidoTabProps {
    theme: any
    setTheme: (theme: any) => void
    saveThemeToCloud: (theme: any) => Promise<void>
    announcements: any[]
    saveAnnouncementToCloud: (ann: any) => Promise<void>
    deleteAnnouncementFromCloud: (id: string) => Promise<void>
    settings: any
    setSettings: (settings: any) => void
    showNotification: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void
    uploadAvatar: (name: string, file: File) => Promise<string | null>
}

export const ContenidoTab = ({
    theme,
    setTheme,
    saveThemeToCloud,
    announcements,
    saveAnnouncementToCloud,
    deleteAnnouncementFromCloud,
    settings,
    setSettings,
    showNotification,
    uploadAvatar
}: ContenidoTabProps) => {
    const [isSaving, setIsSaving] = useState(false)
    const [editingAnnId, setEditingAnnId] = useState<string | null>(null)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
    const [newAnn, setNewAnn] = useState<any>({ title: '', content: '', category: 'general', imageUrl: '' })

    const handleSaveAnnouncement = async () => {
        if (!newAnn.title || !newAnn.content) {
            showNotification('Título y contenido son requeridos', 'warning')
            return
        }
        setIsSaving(true)
        try {
            await saveAnnouncementToCloud({
                ...newAnn,
                id: editingAnnId || undefined,
            })
            setNewAnn({ title: '', content: '', category: 'general', imageUrl: '' })
            setEditingAnnId(null)
            showNotification(editingAnnId ? 'Aviso actualizado' : 'Aviso creado', 'success')
        } catch (err) {
            showNotification('Error al guardar aviso', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="col-span-1 md:col-span-6 space-y-6">
                <TactileGlassCard title="TEMA SEMANAL">
                    <div className="space-y-6">
                        <TactileInput
                            label="TÍTULO DEL TEMA"
                            value={theme?.title || ''}
                            onChange={(e: any) => setTheme({ ...(theme || {}), title: e.target.value })}
                            icon={Sparkles}
                        />
                        <TactileSelect
                            label="CATEGORÍA / TIPO DE TEMA"
                            value={theme?.type || 'orthodoxy'}
                            onChange={(val: any) => setTheme({ ...(theme || {}), type: val })}
                            options={[
                                { value: 'apostolic_presentation', label: 'Presentación Apostólica' },
                                { value: 'apostolic_letter', label: 'Carta Apostólica' },
                                { value: 'orthodoxy', label: 'Ortodoxia' },
                                { value: 'exchange', label: 'Intercambio de Ministro' },
                                { value: 'free', label: 'Tema Libre / Ministerial' }
                            ]}
                            icon={BookOpen}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TactileInput
                                label="FECHA INICIO"
                                type="date"
                                value={theme?.startDate || ''}
                                onChange={(e: any) => setTheme({ ...(theme || {}), startDate: e.target.value })}
                                icon={Calendar}
                            />
                            <TactileInput
                                label="FECHA FIN"
                                type="date"
                                value={theme?.endDate || ''}
                                onChange={(e: any) => setTheme({ ...(theme || {}), endDate: e.target.value })}
                                icon={Calendar}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">RESUMEN / DESCRIPCIÓN</label>
                            <textarea
                                className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md p-4 text-xs font-bold outline-none min-h-[100px] focus:border-primary/50 transition-all text-[var(--tactile-text)]"
                                value={theme?.description || ''}
                                onChange={(e) => setTheme({ ...(theme || {}), description: e.target.value })}
                                placeholder="Breve resumen del tema..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">CONTENIDO VISUAL (URL)</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-black/40 border border-[var(--tactile-border)] rounded-md h-12 px-4 text-xs font-bold outline-none"
                                    value={theme?.fileUrl || ''}
                                    onChange={(e) => setTheme({ ...(theme || {}), fileUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                                <button
                                    onClick={async () => {
                                        const fileInput = document.createElement('input');
                                        fileInput.type = 'file';
                                        fileInput.accept = 'image/*';
                                        fileInput.onchange = async (e: any) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setIsSaving(true);
                                                const url = await uploadAvatar(`theme-${Date.now()}`, file);
                                                if (url) {
                                                    setTheme({ ...(theme || {}), fileUrl: url });
                                                    showNotification('Imagen subida. No olvides guardar.', 'info');
                                                }
                                                setIsSaving(false);
                                            }
                                        };
                                        fileInput.click();
                                    }}
                                    className="tactile-btn tactile-btn-glass p-0 w-12 justify-center"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={async () => {
                                    setIsSaving(true);
                                    try {
                                        await saveThemeToCloud(theme || {});
                                        showNotification('Tema guardado en la nube.', 'success');
                                    } catch (err) {
                                        showNotification('Error al guardar el tema', 'error');
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={isSaving}
                                className={cn(
                                    "tactile-btn tactile-btn-orange px-6 h-10 rounded-xl justify-center font-bold text-[11px] tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {isSaving ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                                ) : (
                                    <Save className="w-3.5 h-3.5 mr-2" />
                                )}
                                {isSaving ? 'GUARDANDO...' : 'GUARDAR TEMA'}
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="EVENTO MEMORABLE (COUNTDOWN)">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-md">
                        <div className="space-y-1">
                            <h4 className="font-bold text-sm">Contador Regresivo</h4>
                            <p className="text-[10px] text-muted-foreground capitalize tracking-widest font-black">Activar en el Display</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, showCountdown: !settings?.showCountdown })}
                            className={cn("w-14 h-8 rounded-full p-1 transition-colors", settings?.showCountdown ? "bg-primary" : "bg-[var(--tactile-item-hover)]")}
                        >
                            <div className={cn("w-6 h-6 bg-foreground rounded-full shadow-lg transition-transform", settings?.showCountdown && "translate-x-6")} />
                        </button>
                    </div>
                </TactileGlassCard>
            </div>

            <div className="col-span-1 md:col-span-6 space-y-6">
                <TactileGlassCard title="NUEVO AVISO / COMUNICADO">
                    <div className="space-y-4">
                        <TactileInput
                            label="TÍTULO DEL AVISO"
                            value={newAnn.title}
                            onChange={(e: any) => setNewAnn({ ...newAnn, title: e.target.value })}
                            placeholder="Ej: Reunión Extraordinaria..."
                            icon={Bell}
                        />
                        <div className="space-y-2">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">CONTENIDO DEL MENSAJE</label>
                            <textarea
                                className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md p-4 text-xs font-bold outline-none min-h-[120px] focus:border-primary/50 transition-all text-[var(--tactile-text)]"
                                value={newAnn.content}
                                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                placeholder="Escribe el mensaje completo aquí..."
                            />
                        </div>
                        <TactileSelect
                            label="CATEGORÍA"
                            value={newAnn.category}
                            onChange={(val: any) => setNewAnn({ ...newAnn, category: val })}
                            options={[
                                { value: 'general', label: 'General / Todos' },
                                { value: 'choir', label: 'Coro' },
                                { value: 'youth', label: 'Jóvenes' },
                                { value: 'married', label: 'Casados' },
                                { value: 'urgent', label: 'URGENTE / IMPORTANTE' }
                            ]}
                            icon={Plus}
                        />

                        <div className="space-y-3">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">ILUSTRACIÓN DEL AVISO</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewAnn({ ...newAnn, imageUrl: '' })}
                                    className={cn(
                                        "p-2.5 rounded-lg border text-[11px] font-bold transition-all uppercase tracking-wider",
                                        !newAnn.imageUrl 
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : "bg-black/30 border-[var(--tactile-border)] text-muted-foreground hover:text-white"
                                    )}
                                >
                                    Sin Ilustración
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className={cn(
                                        "p-2.5 rounded-lg border text-[11px] font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
                                        newAnn.imageUrl && !newAnn.imageUrl.startsWith('icon:')
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : "bg-black/30 border-[var(--tactile-border)] text-muted-foreground hover:text-white"
                                    )}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Galería
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewAnn({ ...newAnn, imageUrl: 'icon:bell' })}
                                    className={cn(
                                        "p-2.5 rounded-lg border text-[11px] font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
                                        newAnn.imageUrl && newAnn.imageUrl.startsWith('icon:')
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : "bg-black/30 border-[var(--tactile-border)] text-muted-foreground hover:text-white"
                                    )}
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Ícono
                                </button>
                            </div>

                            {newAnn.imageUrl && !newAnn.imageUrl.startsWith('icon:') && (
                                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-md border border-[var(--tactile-border)]">
                                    <div className="w-12 h-12 rounded overflow-hidden bg-black/50 border border-[var(--tactile-border)] flex-shrink-0">
                                        <img src={newAnn.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Imagen seleccionada</p>
                                        <p className="text-[11px] text-white font-mono truncate">{newAnn.imageUrl}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNewAnn({ ...newAnn, imageUrl: '' })}
                                        className="tactile-btn p-0 w-8 h-8 justify-center text-red-500 hover:text-red-400 bg-red-500/10 border border-red-500/20"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {newAnn.imageUrl && newAnn.imageUrl.startsWith('icon:') && (
                                <div className="p-4 bg-black/20 rounded-md border border-[var(--tactile-border)] space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Ícono seleccionado:</p>
                                        <button
                                            type="button"
                                            onClick={() => setIsIconPickerOpen(true)}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1.5"
                                        >
                                            <Search className="w-3.5 h-3.5" />
                                            Explorar Galería (+200k íconos)
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-[var(--tactile-border)]">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                            <DynamicIcon icon={newAnn.imageUrl.replace('icon:', '')} className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-mono text-indigo-300 truncate">{newAnn.imageUrl.replace('icon:', '')}</p>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground mb-2">Accesos rápidos populares:</p>
                                        <div className="grid grid-cols-6 gap-2">
                                            {[
                                                { id: 'solar:bell-bing-bold-duotone', label: 'Campana' },
                                                { id: 'solar:megaphone-bold-duotone', label: 'Megáfono' },
                                                { id: 'solar:info-circle-bold-duotone', label: 'Info' },
                                                { id: 'solar:danger-triangle-bold-duotone', label: 'Alerta' },
                                                { id: 'solar:calendar-date-bold-duotone', label: 'Fecha' },
                                                { id: 'solar:users-group-two-rounded-bold-duotone', label: 'Grupo' },
                                                { id: 'solar:heart-bold-duotone', label: 'Amor' },
                                                { id: 'solar:book-bookmark-bold-duotone', label: 'Doctrina' },
                                                { id: 'solar:flame-bold-duotone', label: 'Fuego' },
                                                { id: 'solar:music-note-bold-duotone', label: 'Canto' },
                                                { id: 'solar:star-bold-duotone', label: 'Estrella' },
                                                { id: 'solar:shield-check-bold-duotone', label: 'Escudo' }
                                            ].map((item) => {
                                                const isSelected = newAnn.imageUrl === `icon:${item.id}`;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        title={item.label}
                                                        onClick={() => setNewAnn({ ...newAnn, imageUrl: `icon:${item.id}` })}
                                                        className={cn(
                                                            "p-2.5 rounded-lg border flex items-center justify-center transition-all",
                                                            isSelected 
                                                                ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50" 
                                                                : "bg-black/30 border-transparent text-muted-foreground hover:text-white"
                                                        )}
                                                    >
                                                        <DynamicIcon icon={item.id} className="w-5 h-5" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            {editingAnnId && (
                                <button
                                    onClick={() => {
                                        setEditingAnnId(null)
                                        setNewAnn({ title: '', content: '', category: 'general', imageUrl: '' })
                                    }}
                                    className="tactile-btn tactile-btn-glass px-5 h-10 rounded-xl justify-center font-bold text-[11px]"
                                >
                                    CANCELAR
                                </button>
                            )}
                            <button
                                onClick={handleSaveAnnouncement}
                                disabled={isSaving}
                                className="tactile-btn tactile-btn-orange px-6 h-10 rounded-xl justify-center font-bold text-[11px] tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Save className="w-3.5 h-3.5 mr-2" /> {editingAnnId ? 'ACTUALIZAR' : 'PUBLICAR'} AVISO
                            </button>
                        </div>
                    </div>
                </TactileGlassCard>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black capitalize tracking-[0.3em] text-muted-foreground ml-2">Avisos Recientes</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {(announcements || []).map(ann => (
                            <div key={ann.id} className="tactile-glass-panel p-6 flex flex-col gap-4 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-md flex items-center justify-center border overflow-hidden",
                                            ann.category === 'urgent' ? "bg-red-500/20 border-red-500/20 text-red-500" : "bg-primary/20 border-primary/20 text-primary"
                                        )}>
                                            {ann.imageUrl ? (
                                                ann.imageUrl.startsWith('icon:') ? (
                                                    <DynamicIcon icon={ann.imageUrl.replace('icon:', '')} className="w-5 h-5" fallbackIcon="bell" />
                                                ) : (
                                                    <img src={ann.imageUrl} className="w-full h-full object-cover" alt="" />
                                                )
                                            ) : (
                                                <Bell className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm capitalize">{ann.title}</h4>
                                            <TactileBadge className="mt-1">{ann.category}</TactileBadge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingAnnId(ann.id)
                                                setNewAnn({ ...ann })
                                            }}
                                            className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteAnnouncementFromCloud(ann.id)}
                                            className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MediaGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                title="Seleccionar Imagen para el Aviso"
                mode="select"
                onSelectImage={(url) => {
                    setNewAnn({ ...newAnn, imageUrl: url });
                    setIsGalleryOpen(false);
                }}
            />

            <IconPickerModal
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                currentIcon={newAnn.imageUrl?.startsWith('icon:') ? newAnn.imageUrl.replace('icon:', '') : ''}
                onSelectIcon={(iconName) => {
                    setNewAnn({ ...newAnn, imageUrl: `icon:${iconName}` });
                }}
            />
        </div>
    )
}
