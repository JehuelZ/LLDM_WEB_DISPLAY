"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Sun, Type, Monitor, Upload, Save, User, Mail, Phone, Camera, 
    Church, Sparkles, Moon, BookOpen, Sunrise, Flame, Radio, 
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, XCircle, Plus, Trash
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
    TactileGlassCard, TactileSelect, TactileFontSelect, 
    TactileInput 
} from '@/components/admin/TactileUI'
import { CongregationEditModal } from '@/components/admin/CongregationEditModal'
import { CongregationInfo, UserProfile } from '@/lib/store'

interface AjustesTabProps {
    settings: any
    setSettings: (settings: any) => void
    saveSettingsToCloud: (settings: any) => Promise<void>
    calendarStyles: any
    setCalendarStyles: (styles: any) => void
    uploadAvatar: (name: string, file: File) => Promise<string | null>
    minister: any
    setMinister: (minister: any) => void
    updateProfileInCloud: (id: string, profile: any) => Promise<void>
    showNotification: (msg: string, type: 'success' | 'error') => void
    handleCustomLogoUpload: (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4) => Promise<void>
}

export const AjustesTab = ({
    settings,
    setSettings,
    saveSettingsToCloud,
    calendarStyles,
    setCalendarStyles,
    uploadAvatar,
    minister,
    setMinister,
    updateProfileInCloud,
    showNotification,
    handleCustomLogoUpload
}: AjustesTabProps) => {
    const [isSaving, setIsSaving] = useState(false)
    const [imageToEdit, setImageToEdit] = useState<{ source: string, target: string } | null>(null)
    const [editingCongregation, setEditingCongregation] = useState<{ info: CongregationInfo, index?: number } | null>(null)
    
    // Get members from store for picking responsible
    const members = useAppStore(state => state.members)

    return (
        <motion.div
            key="configuracion"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            <div className="col-span-1 md:col-span-12">
                <h2 className="text-4xl font-black capitalize tracking-tighter mb-8 text-[var(--tactile-text)]">Preferencias del <span className="text-primary">Sistema</span></h2>
            </div>

            <div className="col-span-1 md:col-span-6 space-y-8">
                <TactileGlassCard title="APARIENCIA VISUAL">
                    <div className="space-y-6">
                        <TactileSelect
                            label="MODO DE INTERFAZ"
                            value={settings.themeMode}
                            onChange={(val: any) => saveSettingsToCloud({ themeMode: val })}
                            options={[
                                { value: 'light', label: 'Modo Claro' },
                                { value: 'dark', label: 'Modo Oscuro' },
                                { value: 'system', label: 'Sincronizar con Sistema' },
                            ]}
                            icon={Sun}
                        />

                        <div className="space-y-4">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">COLOR PRIMARIO</label>
                            <div className="grid grid-cols-5 gap-3">
                                {['#3b82f6', '#10b981', '#10b981', '#ef4444', '#8b5cf6'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => saveSettingsToCloud({ primaryColor: color })}
                                        className={cn(
                                            "aspect-square rounded-md border-4 transition-all scale-90 hover:scale-100 shadow-lg",
                                            settings.primaryColor === color ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-100" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <TactileFontSelect
                            label="TIPOGRAFÍA DEL SISTEMA"
                            value={settings.fontMain || calendarStyles.fontFamily || 'Poppins'}
                            onChange={(val: any) => {
                                setSettings({ ...settings, fontMain: val });
                                setCalendarStyles({ ...calendarStyles, fontFamily: val });
                                saveSettingsToCloud({ fontMain: val });
                            }}
                            icon={Type}
                        />

                        <TactileSelect
                            label="PANEL DE ADMINISTRACIÓN (TEMA)"
                            value={settings.adminTheme || 'classic'}
                            onChange={(val: any) => saveSettingsToCloud({ adminTheme: val })}
                            options={[
                                { value: 'primitivo', label: 'Plantilla Primitiva (Industrial)' },
                                { value: 'classic', label: 'Plantilla Clásica (Tactile)' },
                                { value: 'luna', label: 'Plantilla Luna (Premium)' },
                            ]}
                            icon={Monitor}
                        />

                        <div className="space-y-4 pt-2">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">PESO Y GROSOR</label>
                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md shadow-2xl overflow-hidden">
                                {[
                                    { label: 'THIN', weight: '300' },
                                    { label: 'NORM', weight: '400' },
                                    { label: 'MED', weight: '500' },
                                    { label: 'BOLD', weight: '700' },
                                    { label: 'MAX', weight: '900' },
                                ].map((w) => (
                                    <button
                                        key={w.weight}
                                        onClick={() => {
                                            setSettings({ ...settings, fontWeight: w.weight });
                                            saveSettingsToCloud({ fontWeight: w.weight });
                                        }}
                                        className={cn(
                                            "flex-1 px-4 py-2.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                            (settings.fontWeight || '400') === w.weight 
                                                ? "bg-primary text-foreground shadow-lg transform scale-[1.02]" 
                                                : "text-foreground/40 hover:text-foreground hover:bg-[var(--tactile-item-hover)]"
                                        )}
                                    >
                                        {w.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="py-4 border-t border-[var(--tactile-border)] space-y-4">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2 flex justify-between">
                                <span>OPTIMIZACIÓN DE TV (OVERSCAN / ESCALA)</span>
                                <span className="text-primary">{Math.round((settings.displayScale || 1.0) * 100)}%</span>
                            </label>
                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md shadow-2xl overflow-hidden">
                                {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((sc) => (
                                    <button
                                        key={sc}
                                        onClick={() => {
                                            setSettings({ ...settings, displayScale: sc });
                                            saveSettingsToCloud({ displayScale: sc });
                                        }}
                                        className={cn(
                                            "flex-1 px-3 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                            (settings.displayScale || 1.0) === sc 
                                                ? "bg-primary text-foreground shadow-lg transform scale-[1.02]" 
                                                : "text-foreground/40 hover:text-foreground hover:bg-[var(--tactile-item-hover)]"
                                        )}
                                    >
                                        {Math.round(sc * 100)}%
                                    </button>
                                ))}
                            </div>
                            <p className="text-[8px] text-muted-foreground ml-2 leading-relaxed">
                                * Si el contenido se ve cortado en los bordes de la TV, baje la escala al 90%, 80% o 70%.
                            </p>
                        </div>

                        <div className="py-4 border-t border-[var(--tactile-border)] space-y-4">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">
                                AJUSTE MANUAL DE POSICIÓN (CENTRAR)
                            </label>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => {
                                        const val = (settings.displayOffsetY || 0) - 20;
                                        setSettings({ ...settings, displayOffsetY: val });
                                        saveSettingsToCloud({ displayOffsetY: val });
                                    }}
                                    className="p-3 bg-[var(--tactile-item-hover)] rounded-md border border-[var(--tactile-border)] hover:bg-primary/20 transition-colors"
                                >
                                    <ChevronUp className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const val = (settings.displayOffsetX || 0) - 20;
                                            setSettings({ ...settings, displayOffsetX: val });
                                            saveSettingsToCloud({ displayOffsetX: val });
                                        }}
                                        className="p-3 bg-[var(--tactile-item-hover)] rounded-md border border-[var(--tactile-border)] hover:bg-primary/20 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSettings({ ...settings, displayOffsetX: 0, displayOffsetY: 0 });
                                            saveSettingsToCloud({ displayOffsetX: 0, displayOffsetY: 0 });
                                        }}
                                        className="px-4 bg-orange-500/20 text-orange-500 rounded-md border border-orange-500/20 hover:bg-orange-500/30 font-bold text-[10px]"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => {
                                            const val = (settings.displayOffsetX || 0) + 20;
                                            setSettings({ ...settings, displayOffsetX: val });
                                            saveSettingsToCloud({ displayOffsetX: val });
                                        }}
                                        className="p-3 bg-[var(--tactile-item-hover)] rounded-md border border-[var(--tactile-border)] hover:bg-primary/20 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        const val = (settings.displayOffsetY || 0) + 20;
                                        setSettings({ ...settings, displayOffsetY: val });
                                        saveSettingsToCloud({ displayOffsetY: val });
                                    }}
                                    className="p-3 bg-[var(--tactile-item-hover)] rounded-md border border-[var(--tactile-border)] hover:bg-primary/20 transition-colors"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="FONDO DE PROYECCIÓN">
                    <div className="space-y-6">
                        <TactileSelect
                            label="MODO DE LOGO / FONDO"
                            value={settings.displayBgMode}
                            onChange={(val: any) => saveSettingsToCloud({ displayBgMode: val })}
                            options={[
                                { value: 'custom', label: 'Personalizado (SVG/Imagen)' },
                                { value: 'none', label: 'Sin Logo de Fondo' },
                            ]}
                            icon={Monitor}
                        />

                        {settings.displayBgMode === 'custom' && (
                            <div className="space-y-4">
                                <div 
                                    onClick={() => document.getElementById('tactile-bg-upload')?.click()}
                                    className="w-full aspect-video rounded-md border-2 border-dashed border-[var(--tactile-border-strong)] hover:border-primary/40 bg-[var(--tactile-inner-bg)] flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden transition-all group"
                                >
                                    {settings.displayCustomBgUrl ? (
                                        <div className="relative w-full h-full">
                                            <img src={settings.displayCustomBgUrl} className="w-full h-full object-cover" alt="Custom background" />
                                            <div className="absolute inset-0 bg-[var(--tactile-bg)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-foreground" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-11 rounded-md bg-[var(--tactile-item-hover)] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Upload className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black capitalize tracking-widest">Subir Fondo Personalizado</p>
                                                <p className="text-[8px] text-muted-foreground mt-2">Formatos aceptados: SVG, JPG, PNG, WEBP</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="tactile-bg-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*,.svg"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setIsSaving(true);
                                            const publicUrl = await uploadAvatar('display-bg', file);
                                            if (publicUrl) {
                                                await saveSettingsToCloud({
                                                    displayCustomBgUrl: publicUrl,
                                                    displayBgMode: 'custom',
                                                    churchLogoUrl: publicUrl,
                                                    churchIcon: 'custom'
                                                });
                                                showNotification('Fondo actualizado exitosamente.', 'success');
                                            }
                                            setIsSaving(false);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        
                        <div className="py-4 border-t border-[var(--tactile-border)] space-y-4">
                            <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">ESTILO DE PUNTOS / ANIMACIÓN</label>
                            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md shadow-2xl overflow-hidden">
                                <button
                                    onClick={() => saveSettingsToCloud({ displayBgStyle: 'static' })}
                                    className={cn(
                                        "flex-1 px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                        settings.displayBgStyle === 'static' 
                                            ? "bg-primary text-foreground shadow-lg transform scale-[1.02]" 
                                            : "text-foreground/40 hover:text-foreground hover:bg-[var(--tactile-item-hover)]"
                                    )}
                                >
                                    ESTÁTICO
                                </button>
                                <button
                                    onClick={() => saveSettingsToCloud({ displayBgStyle: 'dynamic' })}
                                    className={cn(
                                        "flex-1 px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                        settings.displayBgStyle === 'dynamic' 
                                            ? "bg-primary text-foreground shadow-lg transform scale-[1.02]" 
                                            : "text-foreground/40 hover:text-foreground hover:bg-[var(--tactile-item-hover)]"
                                    )}
                                >
                                    DINÁMICO
                                </button>
                            </div>
                        </div>
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="SERVICIOS INTEGRADOS (CLIMA)">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">UBICACIÓN Y COORDENADAS</label>
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <TactileInput
                                    value={settings.weatherCity || ''}
                                    onChange={(e: any) => setSettings({ ...settings, weatherCity: e.target.value })}
                                    placeholder="Ej: Rodeo, CA o 94547"
                                    icon={Sun}
                                />
                            </div>
                            <button
                                onClick={async () => {
                                    if (!settings.weatherCity) return;
                                    setIsSaving(true);
                                    try {
                                        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(settings.weatherCity)}&count=1&language=es&format=json`);
                                        const data = await res.json();
                                        if (data.results && data.results.length > 0) {
                                            const loc = data.results[0];
                                            let adminStr = loc.admin1 ? `, ${loc.admin1}` : '';
                                            if (!loc.admin1 && loc.country) adminStr = `, ${loc.country}`;
                                            const displayName = `${loc.name}${adminStr}`;
                                            
                                            const updates = { 
                                                weatherCity: displayName, 
                                                weatherLat: loc.latitude, 
                                                weatherLng: loc.longitude 
                                            };
                                            
                                            setSettings({ ...settings, ...updates });
                                            await saveSettingsToCloud(updates);
                                            showNotification(`Ubicación de clima actualizada a ${displayName}`, 'success');
                                        } else {
                                            showNotification('No se encontró la ubicación en el mapa. Intenta otro nombre.', 'error');
                                        }
                                    } catch (e) {
                                        showNotification('Error buscando coordenadas geográficas.', 'error');
                                    }
                                    setIsSaving(false);
                                }}
                                className="h-12 px-6 bg-[var(--tactile-inner-bg)] text-[10px] font-black tracking-widest text-primary border border-[var(--tactile-border)] rounded-md hover:bg-primary/20 transition-colors"
                            >
                                UBICAR
                            </button>
                        </div>
                        <p className="text-[8px] text-muted-foreground ml-2 leading-relaxed">
                            * Presiona UBICAR para buscar automáticamente la Latitud y Longitud global. 
                            Actual: Lat {settings.weatherLat !== undefined ? settings.weatherLat : '38.033'}, 
                            Lng {settings.weatherLng !== undefined ? settings.weatherLng : '-122.267'}
                        </p>
                    </div>
                </TactileGlassCard>

                <button
                    onClick={async () => {
                        setIsSaving(true);
                        await saveSettingsToCloud(settings);
                        setIsSaving(false);
                    }}
                    className="w-full h-12 bg-orange-500 text-white rounded-md flex items-center justify-center gap-3 text-sm font-black tracking-widest hover:bg-orange-600 transition-colors shadow-xl"
                >
                    <Save className="w-5 h-5" /> {isSaving ? 'GUARDANDO...' : 'GUARDAR PREFERENCIAS'}
                </button>
            </div>

            <div className="col-span-1 md:col-span-6 space-y-6">
                <TactileGlassCard title="MINISTRO RESPONSABLE">
                    <div className="space-y-6">
                        <div className="flex flex-col items-center py-4">
                            <div
                                className="w-32 h-32 rounded-full border-4 border-primary/30 p-1 relative group cursor-pointer"
                                onClick={() => document.getElementById('minister-avatar-upload')?.click()}
                            >
                                <img src={settings.ministerAvatar || `https://ui-avatars.com/api/?name=${settings.ministerName || 'Ministro'}&background=random`} className="w-full h-full object-cover rounded-full" alt="Ministro" />
                                <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <button
                                onClick={() => document.getElementById('minister-avatar-upload')?.click()}
                                className="text-[10px] font-black capitalize text-primary mt-4 tracking-widest hover:underline"
                            >
                                Cambiar Fotografía
                            </button>
                            <input
                                type="file"
                                id="minister-avatar-upload"
                                className="hidden"
                                accept="image/*,.svg"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setIsSaving(true);
                                        const url = await uploadAvatar(`minister-${Date.now()}`, file);
                                        if (url) {
                                            await saveSettingsToCloud({ ministerAvatar: url });
                                            setMinister({ ...minister, avatar: url });
                                            showNotification("Avatar ministerial actualizado correctamente.", 'success');
                                        }
                                        setIsSaving(false);
                                    }
                                }}
                            />
                        </div>

                        <TactileInput
                            label="NOMBRE DEL MINISTRO"
                            value={settings.ministerName || ''}
                            onChange={(e: any) => setSettings({ ...settings, ministerName: e.target.value })}
                            icon={User}
                        />
                        <TactileInput
                            label="EMAIL DE CONTACTO"
                            value={settings.ministerEmail || ''}
                            onChange={(e: any) => setSettings({ ...settings, ministerEmail: e.target.value })}
                            icon={Mail}
                        />
                        <TactileInput
                            label="TELÉFONO"
                            value={settings.ministerPhone || ''}
                            onChange={(e: any) => setSettings({ ...settings, ministerPhone: e.target.value })}
                            icon={Phone}
                        />

                        <button
                            onClick={async () => {
                                setIsSaving(true);
                                await saveSettingsToCloud({
                                    ministerName: settings.ministerName,
                                    ministerEmail: settings.ministerEmail,
                                    ministerPhone: settings.ministerPhone
                                });
                                setMinister({
                                    ...minister,
                                    name: settings.ministerName,
                                    email: settings.ministerEmail,
                                    phone: settings.ministerPhone
                                });
                                showNotification("Datos del ministro actualizados exitosamente.", 'success');
                                setIsSaving(false);
                            }}
                            className="w-full h-12 bg-orange-500 text-white rounded-md flex items-center justify-center gap-3 font-black capitalize tracking-widest hover:bg-orange-600 transition-colors"
                        >
                            <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Datos'}
                        </button>
                    </div>
                </TactileGlassCard>

                <TactileGlassCard title="JERARQUÍA Y OBRAS (EVANGELIZACIÓN)">
                    <div className="space-y-6">
                        <div className="p-4 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">IGLESIA PRINCIPAL</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-md bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] overflow-hidden flex items-center justify-center shrink-0">
                                    {(settings.mainChurch?.imageUrl || settings.churchLogoUrl) ? (
                                        <img src={settings.mainChurch?.imageUrl || settings.churchLogoUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <Church className="w-8 h-8 text-muted-foreground opacity-20" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black uppercase truncate text-foreground">{settings.mainChurch?.name || settings.mainChurchName || 'Principal'}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 truncate">
                                        {settings.mainChurch?.responsibleName || 'Sin responsable asignado'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setEditingCongregation({ 
                                        info: settings.mainChurch || { id: 'main', name: settings.mainChurchName || 'Principal' } 
                                    })}
                                    className="px-4 h-11 bg-primary/20 text-primary rounded-md border border-primary/30 hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                >
                                    ADMINISTRAR
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--tactile-border)]">
                            <div className="flex items-center justify-between mb-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">IGLESIAS / OBRAS DEPENDIENTES</label>
                                <button 
                                    onClick={() => setEditingCongregation({ 
                                        info: { id: `m-${Math.random().toString(36).substr(2, 9)}`, name: '' },
                                        index: -1 // New mission
                                    })}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                                >
                                    <Plus className="w-3 h-3" /> AGREGAR OBRA
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {(settings.missions || []).map((mission: string | CongregationInfo, idx: number) => {
                                    const m = typeof mission === 'string' 
                                        ? (mission.trim().startsWith('{') ? JSON.parse(mission) : { id: `leg-${idx}`, name: mission }) 
                                        : mission;
                                    return (
                                        <div key={m.id || idx} className="group relative p-4 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md hover:border-primary/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-md bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] overflow-hidden flex items-center justify-center shrink-0">
                                                    {m.imageUrl ? (
                                                        <img src={m.imageUrl} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="text-[10px] font-black text-muted-foreground opacity-20">{m.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[11px] font-black uppercase truncate text-foreground">{m.name}</h4>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 truncate">
                                                        {m.responsibleName || 'Sin responsable'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setEditingCongregation({ info: m, index: idx })}
                                                        className="w-10 h-10 bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                                                    >
                                                        <Save className="w-4 h-4 scale-75" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const filtered = settings.missions.filter((_: any, i: number) => i !== idx);
                                                            setSettings({ ...settings, missions: filtered });
                                                            saveSettingsToCloud({ missions: filtered });
                                                            showNotification('Obra eliminada correctamente.', 'success');
                                                        }}
                                                        className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-md border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {(!settings.missions || settings.missions.length === 0) && (
                                    <div className="py-8 text-center border-2 border-dashed border-[var(--tactile-border)] rounded-md">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground opacity-40">No hay misiones configuradas</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-[8px] text-muted-foreground mt-6 leading-relaxed">
                                * Las obras creadas permiten segmentar la asistencia y organizar la membresía por ubicación geográfica o administrativa.
                            </p>
                        </div>
                    </div>
                </TactileGlassCard>

                {/* MODALS */}
                {editingCongregation && (
                    <CongregationEditModal 
                        isOpen={!!editingCongregation}
                        congregation={editingCongregation.info}
                        onClose={() => setEditingCongregation(null)}
                        members={members}
                        uploadAvatar={uploadAvatar}
                        onSave={async (updated) => {
                            if (updated.id === 'main') {
                                // Save as main church
                                await saveSettingsToCloud({ 
                                    mainChurch: updated,
                                    mainChurchName: updated.name // Sync legacy field
                                });
                                showNotification('Configuración de sede principal actualizada.', 'success');
                            } else {
                                // Save as mission
                                let newMissions = [...(settings.missions || [])];
                                if (editingCongregation.index === -1) {
                                    newMissions.push(updated);
                                } else if (editingCongregation.index !== undefined) {
                                    newMissions[editingCongregation.index] = updated;
                                }
                                await saveSettingsToCloud({ missions: newMissions });
                                showNotification(`Obra "${updated.name}" guardada.`, 'success');
                            }
                        }}
                    />
                )}

                <TactileGlassCard title="SISTEMA VISUAL DEL DISPLAY (PIZARRA)">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'iglesia', label: 'Estilo Institucional', icon: Church, desc: 'Diseño institucional tradicional.' },
                                { id: 'cristal', label: 'Cristal Glass', icon: Sparkles, desc: 'Efectos de vidrio y modernismo.' },
                                { id: 'minimal', label: 'Minimalista', icon: Type, desc: 'Elegancia y colores sólidos.' },
                                { id: 'nocturno', label: 'Midnight Glow', icon: Moon, desc: 'Resplandores suaves nocturnos.' },
                                { id: 'neon', label: 'Neon Forge', icon: Flame, desc: 'Futurista y de alto impacto.' },
                                { id: 'luna', label: 'Luna Premium', icon: Sunrise, desc: 'Diseño industrial robusto.' },
                                { id: 'primitivo', label: 'Primitivo Legacy', icon: BookOpen, desc: 'El diseño clásico original.' },
                            ].map((theme) => {
                                const isActive = (settings.displayTemplate || 'nocturno') === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => saveSettingsToCloud({ displayTemplate: theme.id as any })}
                                        className={cn(
                                            "group relative p-4 rounded-md border transition-all duration-500 text-left overflow-hidden",
                                            isActive 
                                                ? "bg-primary/20 border-primary/50" 
                                                : settings.themeMode === 'light'
                                                    ? "bg-black/[0.03] border-slate-200 hover:bg-black/[0.08]"
                                                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn(
                                                "p-2 rounded-md transition-colors",
                                                isActive ? "bg-primary text-white" : "bg-white/[0.08] text-muted-foreground group-hover:bg-white/20"
                                            )}>
                                                <theme.icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn("text-xs font-black capitalize tracking-widest", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>{theme.label}</span>
                                        </div>
                                        <p className="text-[8px] text-muted-foreground/60 leading-relaxed group-hover:text-muted-foreground/80 transition-colors">{theme.desc}</p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
