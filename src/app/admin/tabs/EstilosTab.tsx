"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    Sparkles, Radio, Monitor, Flame, Moon, Edit2, 
    Upload, Plus, Sun, Sunrise, XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    TactileGlassCard, TactileFontSelect 
} from '@/components/admin/TactileUI'

interface EstilosTabProps {
    settings: any
    setSettings: (settings: any) => void
    saveSettingsToCloud: (settings: any) => Promise<void>
    calendarStyles: any
    setCalendarStyles: (styles: any) => void
    handleCustomLogoUpload: (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4) => Promise<void>
}

export const EstilosTab = ({
    settings,
    setSettings,
    saveSettingsToCloud,
    calendarStyles,
    setCalendarStyles,
    handleCustomLogoUpload
}: EstilosTabProps) => {
    return (
        <motion.div
            key="estilos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            <div className="col-span-1 md:col-span-12">
                <h2 className="text-4xl font-black capitalize tracking-tighter mb-8">Temas del <span className="text-muted-foreground">Display</span></h2>
            </div>

            <div className="col-span-1 md:col-span-12">
                <TactileGlassCard title="IDENTIDAD VISUAL" subtitle="Logos e Imagotipos de la Iglesia">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <button
                            onClick={() => saveSettingsToCloud({ churchLogoUrl: '' })}
                            className={cn(
                                "flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300",
                                (settings.churchLogoUrl === '') ? "bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "bg-black/40 border-[var(--tactile-border)] hover:bg-[var(--tactile-item-hover)]"
                            )}
                        >
                            <div className="w-16 h-11 flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <span className={cn("text-[10px] font-black capitalize tracking-widest", (settings.churchLogoUrl === '') ? "text-primary" : "text-muted-foreground")}>
                                Sin Logotipo
                            </span>
                        </button>

                        {[1, 2, 3, 4].map((slotIndex) => {
                            const slotKey = `customLogo${slotIndex}` as any;
                            const slotUrl = (settings as any)[slotKey] as string;
                            const isActive = settings.churchLogoUrl === slotUrl && slotUrl;

                            return (
                                <div key={slotIndex} className="relative group/slot h-full">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            if (slotUrl) {
                                                saveSettingsToCloud({ churchLogoUrl: slotUrl });
                                            } else {
                                                document.getElementById(`tactile-custom-logo-${slotIndex}`)?.click();
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 border-dashed transition-all h-full cursor-pointer",
                                            isActive ? "bg-primary/20 border-primary/40 border-solid shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "bg-black/20 border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        {slotUrl ? (
                                            <>
                                                <div className="w-20 h-20 flex items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                                                    <img src={slotUrl} className="w-full h-full object-contain" alt={`Custom ${slotIndex}`} />
                                                </div>
                                                <span className={cn("text-[10px] font-black capitalize tracking-widest", isActive ? "text-primary" : "text-muted-foreground")}>
                                                    Logo {slotIndex}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        document.getElementById(`tactile-custom-logo-${slotIndex}`)?.click();
                                                    }}
                                                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full opacity-0 group-hover/slot:opacity-100 transition-opacity hover:bg-primary/20"
                                                >
                                                    <Upload className="w-3 h-3 text-foreground" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-3 py-4 h-full">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/slot:border-primary/50 transition-colors">
                                                    <Plus className="w-6 h-6 text-foreground/30 group-hover/slot:text-primary transition-colors" />
                                                </div>
                                                <span className="text-[9px] font-black capitalize text-muted-foreground/40 tracking-widest">Logo {slotIndex}</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id={`tactile-custom-logo-${slotIndex}`}
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.svg,.webp"
                                        onChange={(e) => handleCustomLogoUpload(e, slotIndex as any)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </TactileGlassCard>
            </div>

            <div className="col-span-1 md:col-span-4 space-y-4">
                <h4 className="text-[10px] font-black capitalize tracking-[0.3em] text-muted-foreground mb-4 ml-2">Plantillas Disponibles</h4>
                {[
                    { id: 'cristal', label: 'Cristal Forge', icon: Sparkles, desc: 'Neo-Glassmorphism Premium' },
                    { id: 'neon', label: 'Neon Forge', icon: Radio, desc: 'Retro-Futurista Vibrante' },
                    { id: 'minimal', label: 'Dark Minimal', icon: Monitor, desc: 'Elegancia y Simplicidad' },
                    { id: 'iglesia', label: 'Iglesia', icon: Flame, desc: 'Académico y Tradicional' },
                    { id: 'nocturno', label: 'Midnight Glow', icon: Moon, desc: 'Atmosférico y Profundo' }
                ].map(themeOpt => (
                    <button
                        key={themeOpt.id}
                        onClick={() => {
                            setCalendarStyles({ template: themeOpt.id as any });
                            saveSettingsToCloud({ displayTemplate: themeOpt.id as any });
                        }}
                        className={cn(
                            "w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all border text-left",
                            calendarStyles.template === themeOpt.id ? "bg-primary/20 border-primary/40 text-primary shadow-lg" : "bg-black/20 border-white/5 text-muted-foreground hover:bg-white/5"
                        )}
                    >
                        <themeOpt.icon className="w-6 h-6" />
                        <div>
                            <span className="font-black text-xs capitalize tracking-widest block">{themeOpt.label}</span>
                            <span className="text-[9px] font-bold opacity-50 capitalize tracking-tighter">{themeOpt.desc}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="col-span-1 md:col-span-8 space-y-8">
                <TactileGlassCard title="CONFIGURACIÓN DEL TEMA">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <TactileFontSelect
                                label="TIPOGRAFÍA PRINCIPAL"
                                value={settings.fontMain || calendarStyles.fontFamily || 'Poppins'}
                                onChange={(val: any) => {
                                    setSettings({ ...settings, fontMain: val });
                                    setCalendarStyles({ ...calendarStyles, fontFamily: val });
                                    saveSettingsToCloud({ fontMain: val });
                                }}
                                icon={Edit2}
                            />

                            <div className="space-y-4 pt-2">
                                <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">PESO Y GROSOR</label>
                                <div className="grid grid-cols-5 gap-2">
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
                                                "tactile-btn justify-center text-[8px] font-black py-2",
                                                (settings.fontWeight || '400') === w.weight ? "tactile-btn-primary" : "tactile-btn-orange"
                                            )}
                                        >
                                            {w.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-2">
                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground">TRANSICIONES ANIMADAS</label>
                                    <button
                                        onClick={() => {
                                            const newValue = settings.transitionsEnabled === false;
                                            setSettings({ ...settings, transitionsEnabled: newValue });
                                            saveSettingsToCloud({ transitionsEnabled: newValue });
                                        }}
                                        className={cn(
                                            "w-12 h-6 rounded-full relative transition-colors border",
                                            settings.transitionsEnabled !== false ? "bg-primary/40 border-primary/40" : "bg-black/40 border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 rounded-full transition-all shadow-lg",
                                            settings.transitionsEnabled !== false ? "right-1 bg-white" : "left-1 bg-tactile-text-sub"
                                        )} />
                                    </button>
                                </div>
                                <p className="text-[8px] font-bold text-muted-foreground/40 capitalize tracking-widest ml-2">¿ACTUAR CON EFECTOS DE MOVIMIENTO?</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">TIEMPO DE CADA SLIDE (SEGUNDOS)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[5, 12, 20, 30].map((sec) => {
                                        const themeId = calendarStyles.template || 'nocturno';
                                        const durationKey = `${themeId}SlideDuration`;
                                        const currentDuration = settings[durationKey] || 12;
                                        const isActive = currentDuration === sec;

                                        return (
                                            <button
                                                key={sec}
                                                onClick={() => {
                                                    setSettings({ ...settings, [durationKey]: sec });
                                                    saveSettingsToCloud({ [durationKey]: sec });
                                                }}
                                                className={cn(
                                                    "tactile-btn justify-center font-black ",
                                                    isActive ? "tactile-btn-primary" : "tactile-btn-glass"
                                                )}
                                            >
                                                {sec}s
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[8px] font-bold text-primary/60 capitalize tracking-widest ml-2">GUARDADO POR TEMA: {calendarStyles.template?.toUpperCase()}</p>
                            </div>

                            {calendarStyles.template === 'iglesia' && (
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">ESTILO DE CÁTEDRA</label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setSettings({ ...settings, iglesiaVariant: 'light' })}
                                            className={cn(
                                                "tactile-btn flex-1 justify-center gap-3",
                                                settings.iglesiaVariant === 'light' ? "tactile-btn-primary" : "tactile-btn-glass"
                                            )}
                                        >
                                            <Sun className="w-4 h-4" />
                                            CLARO
                                        </button>
                                        <button
                                            onClick={() => setSettings({ ...settings, iglesiaVariant: 'dark' })}
                                            className={cn(
                                                "tactile-btn flex-1 justify-center gap-3",
                                                settings.iglesiaVariant === 'dark' ? "tactile-btn-primary" : "tactile-btn-glass"
                                            )}
                                        >
                                            <Moon className="w-4 h-4" />
                                            OSCURO
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">TRANSICIÓN DE PANTALLA</label>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { id: 'metro', label: 'ESTILO METRO (LÍNEA CONTINUA)', icon: Radio },
                                        { id: 'breathing', label: 'RESPIRACIÓN (SUAVE)', icon: Sunrise },
                                        { id: 'fade', label: 'FADE CLÁSICO', icon: Monitor }
                                    ].map((anim) => (
                                        <button
                                            key={anim.id}
                                            onClick={() => {
                                                setSettings({ ...settings, animationType: anim.id as any });
                                                saveSettingsToCloud({ animationType: anim.id as any });
                                            }}
                                            className={cn(
                                                "tactile-btn justify-center gap-3",
                                                (settings.animationType === anim.id || (!settings.animationType && anim.id === 'metro')) ? "tactile-btn-primary" : "tactile-btn-glass"
                                            )}
                                        >
                                            <anim.icon className="w-4 h-4" />
                                            {anim.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TactileGlassCard>
            </div>
        </motion.div>
    )
}
