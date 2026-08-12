'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Save, Check, FileSpreadsheet, Sparkles,
    CheckSquare, Square, Eye, Layers, ShieldCheck,
    PieChart, Table, Lock, AlignJustify, Layout,
    RotateCcw, ArrowRight, ImageIcon, X, SlidersHorizontal,
    ToggleLeft, ToggleRight, Info
} from 'lucide-react';
import { MediaGalleryModal } from '@/components/admin/MediaGalleryModal';
import Link from 'next/link';

export const DEFAULT_REPORT_TEMPLATE_CONFIG = {
    pdf: {
        title: 'INFORME OFICIAL DE ASISTENCIA',
        subtitle: 'La Luz del Mundo — Sede Rodeo, CA',
        logoType: 'official_gold',
        customLogoUrl: '',
        orientation: 'landscape',
        showPage1Stats: true,
        showDonutCharts: true,
        donutGroups: ['varones', 'festivas', 'jovenes', 'ninos'],
        separatePageForTable: true,
        columns: [
            { id: 'member_name', label: 'Nombre del Miembro', visible: true },
            { id: 'group', label: 'Batallón / Grupo', visible: true },
            { id: 'total_attendances', label: 'Asistencias Acumuladas', visible: true },
            { id: 'percentage', label: 'Porcentaje %', visible: true },
            { id: 'status', label: 'Estado / Observaciones', visible: true },
        ],
        showSignatures: true,
        ministerSignatureLabel: 'Ministro a Cargo',
        leaderSignatureLabel: 'Encargado de Asistencia',
        attendanceUnit: 'Oraciones',
    },
    excelCsv: {
        delimiter: ',',
        includeHeaders: true,
        selectedFields: ['name', 'group', 'total_attendance', 'percentage', 'status'],
    }
};

// ─── Premium Toggle Component ─────────────────────────────────────────────────
const PremiumToggle = ({
    checked, onChange, label, description, accentColor = 'emerald'
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
    accentColor?: string;
}) => {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-500',
        orange: 'bg-orange-500',
        amber: 'bg-amber-500',
        purple: 'bg-purple-500',
        primary: 'bg-primary',
    };
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.05] transition-all group"
        >
            <div className="text-left">
                <p className={`text-xs font-bold ${checked ? 'text-white' : 'text-white/50'} transition-colors`}>{label}</p>
                {description && <p className="text-[10px] text-white/30 mt-0.5">{description}</p>}
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-all duration-300 border ${checked ? `${colors[accentColor]} border-transparent` : 'bg-white/10 border-white/10'}`}>
                <motion.div
                    animate={{ x: checked ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                />
            </div>
        </button>
    );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, color }: { icon: any; label: string; color: string }) => (
    <div className={`flex items-center gap-2.5 font-black text-[10px] uppercase tracking-[0.2em] ${color} mb-4`}>
        <div className={`p-1.5 rounded-md bg-current/10`}>
            <Icon className="w-3.5 h-3.5" />
        </div>
        {label}
    </div>
);

// ─── CSV Field Toggle ──────────────────────────────────────────────────────────
const CSV_FIELD_OPTIONS = [
    { id: 'name', label: 'Nombre del Miembro' },
    { id: 'group', label: 'Grupo / Batallón' },
    { id: 'category', label: 'Categoría (Adulto/Niño)' },
    { id: 'total_attendance', label: 'Total Asistencias' },
    { id: 'session_5am', label: 'Oración 5AM' },
    { id: 'session_9am', label: 'Oración 9AM' },
    { id: 'session_evening', label: 'Oración Tarde' },
    { id: 'percentage', label: 'Porcentaje %' },
    { id: 'status', label: 'Estado (Excelente/Regular/Baja)' },
    { id: 'days_attended', label: 'Días con Asistencia' },
];

export function TemplatesTab() {
    const { settings, saveSettingsToCloud, showNotification, currentUser } = useAppStore();
    const [isSaving, setIsSaving] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [config, setConfig] = useState<any>(() => {
        return settings.reportTemplatesConfig || DEFAULT_REPORT_TEMPLATE_CONFIG;
    });

    useEffect(() => {
        if (settings.reportTemplatesConfig) {
            setConfig(settings.reportTemplatesConfig);
            setHasUnsavedChanges(false);
        }
    }, [settings.reportTemplatesConfig]);

    const updateConfig = (updater: (prev: any) => any) => {
        setConfig(updater);
        setHasUnsavedChanges(true);
    };

    const updatePdf = (patch: any) => updateConfig(prev => ({ ...prev, pdf: { ...prev.pdf, ...patch } }));
    const updateCsv = (patch: any) => updateConfig(prev => ({ ...prev, excelCsv: { ...prev.excelCsv, ...patch } }));

    const canAccess = currentUser?.role === 'Administrador' ||
        currentUser?.role === 'Ministro a Cargo' ||
        currentUser?.role === 'Responsable de Asistencia' ||
        currentUser?.privileges?.includes('can_edit_report_templates') ||
        currentUser?.email === 'jairojehuel@gmail.com';

    if (!canAccess) {
        return (
            <div className="min-h-[500px] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/[0.03] border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">Acceso Restringido</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                        Esta sección está reservada para el <strong className="text-orange-400">Administrador</strong>, el <strong className="text-orange-400">Ministro a Cargo</strong> y el <strong className="text-orange-400">Encargado de Asistencia</strong>.
                    </p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSettingsToCloud({ reportTemplatesConfig: config });
            showNotification('Plantilla guardada y sincronizada.', 'success');
            setHasUnsavedChanges(false);
        } catch (error) {
            showNotification('Error al guardar la plantilla.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleColumn = (colId: string) => {
        updateConfig((prev: any) => ({
            ...prev,
            pdf: {
                ...prev.pdf,
                columns: prev.pdf.columns.map((c: any) =>
                    c.id === colId ? { ...c, visible: !c.visible } : c
                )
            }
        }));
    };

    const toggleDonutGroup = (groupId: string) => {
        updateConfig((prev: any) => {
            const current = prev.pdf.donutGroups || [];
            const updated = current.includes(groupId)
                ? current.filter((g: string) => g !== groupId)
                : [...current, groupId];
            return { ...prev, pdf: { ...prev.pdf, donutGroups: updated } };
        });
    };

    const toggleCsvField = (fieldId: string) => {
        updateConfig((prev: any) => {
            const current = prev.excelCsv?.selectedFields || [];
            const updated = current.includes(fieldId)
                ? current.filter((f: string) => f !== fieldId)
                : [...current, fieldId];
            return { ...prev, excelCsv: { ...prev.excelCsv, selectedFields: updated } };
        });
    };

    const logoSrc =
        config.pdf.logoType === 'universal_white' ? '/lldm_logo_universal_white.svg'
        : config.pdf.logoType === 'custom' && config.pdf.customLogoUrl ? config.pdf.customLogoUrl
        : '/icon_1784673063714.webp';

    return (
        <>
            {/* MediaGallery Modal */}
            {showGallery && (
                <MediaGalleryModal
                    isOpen={showGallery}
                    onSelectImage={(url: string) => {
                        updatePdf({ customLogoUrl: url, logoType: 'custom' });
                        setShowGallery(false);
                    }}
                    onClose={() => setShowGallery(false)}
                    title="Elegir Logo Personalizado"
                    mode="select"
                />
            )}

            <div className="space-y-6 pb-20">

                {/* ─── TOP ACTION BAR ──────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/8 rounded-xl p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-white uppercase tracking-tight">Diseñador de Plantillas</h2>
                            <p className="text-[10px] text-orange-400/70 font-bold uppercase tracking-widest">PDF · Excel · CSV</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Unsaved indicator */}
                        <AnimatePresence>
                            {hasUnsavedChanges && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Sin guardar</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Go to Reports shortcut */}
                        <Link
                            href="/admin/reports"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Ver Reportes <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

                {/* ─── MAIN GRID: Controls (left) + Live Preview (right) ──── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ════ PANEL IZQUIERDO: CONFIGURACIÓN ═══════════════════ */}
                    <div className="xl:col-span-5 space-y-4">

                        {/* § 1 — Identidad del Encabezado */}
                        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-4">
                            <SectionHeader icon={Sparkles} label="1. Encabezado e Identidad" color="text-orange-400" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Título del Reporte</label>
                                <input
                                    type="text"
                                    value={config.pdf.title}
                                    onChange={e => updatePdf({ title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Subtítulo / Sede</label>
                                <input
                                    type="text"
                                    value={config.pdf.subtitle}
                                    onChange={e => updatePdf({ subtitle: e.target.value })}
                                    className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                />
                            </div>

                            {/* Logo Options */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Logo del Encabezado</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'official_gold', label: 'Flama Dorada', img: '/icon_1784673063714.webp' },
                                        { id: 'universal_white', label: 'Escudo', img: '/lldm_logo_universal_white.svg' },
                                        { id: 'custom', label: 'Personalizado', img: config.pdf.customLogoUrl || '/flama-oficial.svg' },
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                if (item.id === 'custom') {
                                                    setShowGallery(true);
                                                } else {
                                                    updatePdf({ logoType: item.id });
                                                }
                                            }}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all relative group ${
                                                config.pdf.logoType === item.id
                                                    ? 'bg-orange-500/15 border-orange-500/60 text-white shadow-lg shadow-orange-500/10'
                                                    : 'bg-white/[0.02] border-white/8 text-white/40 hover:border-white/20 hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <div className="w-9 h-9 flex items-center justify-center rounded-lg overflow-hidden bg-black/30">
                                                {item.id === 'custom' && !config.pdf.customLogoUrl ? (
                                                    <ImageIcon className="w-5 h-5 text-white/20" />
                                                ) : (
                                                    <img src={item.img} alt="" className="w-full h-full object-contain p-1" />
                                                )}
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                                            {item.id === 'custom' && (
                                                <span className="text-[7px] text-orange-400/60 font-bold">Click para elegir</span>
                                            )}
                                            {config.pdf.logoType === item.id && (
                                                <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-2 h-2 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Orientation Toggle */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Orientación del PDF</label>
                                <div className="flex items-center gap-2 p-1 bg-black/30 border border-white/8 rounded-xl">
                                    {(['portrait', 'landscape'] as const).map(ori => (
                                        <button
                                            key={ori}
                                            type="button"
                                            onClick={() => updatePdf({ orientation: ori })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                config.pdf.orientation === ori
                                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            <Layout className={`w-3.5 h-3.5 ${ori === 'portrait' ? '' : 'rotate-90'}`} />
                                            {ori === 'portrait' ? 'Vertical' : 'Horizontal'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* § 2 — Estructura & Estadísticas */}
                        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-3">
                            <SectionHeader icon={PieChart} label="2. Estructura y Estadísticas" color="text-amber-400" />

                            <PremiumToggle
                                checked={config.pdf.showPage1Stats}
                                onChange={v => updatePdf({ showPage1Stats: v })}
                                label="Página 1: Resumen y Estadísticas"
                                description="KPIs globales en la primera hoja del PDF"
                                accentColor="amber"
                            />
                            <PremiumToggle
                                checked={config.pdf.separatePageForTable}
                                onChange={v => updatePdf({ separatePageForTable: v })}
                                label="Tabla Nominal en Página Aparte"
                                description="La lista de miembros inicia limpia en Página 2"
                                accentColor="amber"
                            />

                            <div className="space-y-2 pt-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Grupos en Donas</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'varones', label: 'Varones' },
                                        { id: 'festivas', label: 'Hermanas' },
                                        { id: 'jovenes', label: 'Jóvenes' },
                                        { id: 'ninos', label: 'Niños' }
                                    ].map(group => {
                                        const active = (config.pdf.donutGroups || []).includes(group.id);
                                        return (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => toggleDonutGroup(group.id)}
                                                className={`flex items-center gap-2.5 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    active
                                                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                                                        : 'bg-white/[0.02] border-white/8 text-white/30 hover:border-white/20'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${active ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                                                    {active && <Check className="w-2.5 h-2.5 text-black" />}
                                                </div>
                                                {group.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* § 3 — Tabla Nominal */}
                        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-3">
                            <SectionHeader icon={Table} label="3. Columnas de la Tabla" color="text-emerald-400" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Unidad de Asistencia</label>
                                <div className="flex items-center gap-1.5 p-1 bg-black/30 border border-white/8 rounded-xl">
                                    {['Oraciones', 'Cultos', 'Servicios'].map(unit => (
                                        <button
                                            key={unit}
                                            type="button"
                                            onClick={() => updatePdf({ attendanceUnit: unit })}
                                            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                                config.pdf.attendanceUnit === unit
                                                    ? 'bg-emerald-500 text-black'
                                                    : 'text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            {unit}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                {config.pdf.columns.map((col: any) => (
                                    <button
                                        key={col.id}
                                        type="button"
                                        onClick={() => toggleColumn(col.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            col.visible
                                                ? 'bg-emerald-500/8 border-emerald-500/25 hover:bg-emerald-500/12'
                                                : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.04] opacity-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${col.visible ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                                                {col.visible && <Check className="w-2.5 h-2.5 text-black" />}
                                            </div>
                                            <span className={`text-xs font-bold ${col.visible ? 'text-white' : 'text-white/30 line-through'}`}>{col.label}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-white/20 uppercase">{col.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* § 4 — Firmas Oficiales */}
                        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-4">
                            <SectionHeader icon={ShieldCheck} label="4. Firmas Oficiales" color="text-purple-400" />

                            <PremiumToggle
                                checked={config.pdf.showSignatures}
                                onChange={v => updatePdf({ showSignatures: v })}
                                label="Habilitar Bloque de Firmas"
                                description="Líneas para firmas al final del documento"
                                accentColor="purple"
                            />

                            <AnimatePresence>
                                {config.pdf.showSignatures && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-2 gap-3 overflow-hidden"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Título Firmante 1</label>
                                            <input
                                                type="text"
                                                value={config.pdf.ministerSignatureLabel}
                                                onChange={e => updatePdf({ ministerSignatureLabel: e.target.value })}
                                                className="w-full bg-black/40 border border-white/8 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Título Firmante 2</label>
                                            <input
                                                type="text"
                                                value={config.pdf.leaderSignatureLabel}
                                                onChange={e => updatePdf({ leaderSignatureLabel: e.target.value })}
                                                className="w-full bg-black/40 border border-white/8 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* § 5 — Exportación CSV/Excel */}
                        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-3">
                            <SectionHeader icon={FileSpreadsheet} label="5. Campos CSV / Excel" color="text-cyan-400" />

                            <PremiumToggle
                                checked={config.excelCsv?.includeHeaders ?? true}
                                onChange={v => updateCsv({ includeHeaders: v })}
                                label="Incluir Encabezados de Columna"
                                description="Primera fila con nombres de campos"
                                accentColor="primary"
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Separador</label>
                                <div className="flex items-center gap-1.5 p-1 bg-black/30 border border-white/8 rounded-xl">
                                    {[',', ';', '\t'].map(delim => (
                                        <button
                                            key={delim}
                                            type="button"
                                            onClick={() => updateCsv({ delimiter: delim })}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                config.excelCsv?.delimiter === delim
                                                    ? 'bg-cyan-500 text-black'
                                                    : 'text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            {delim === '\t' ? 'Tab' : `"${delim}"`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Campos a Exportar</label>
                                {CSV_FIELD_OPTIONS.map(field => {
                                    const active = (config.excelCsv?.selectedFields || []).includes(field.id);
                                    return (
                                        <button
                                            key={field.id}
                                            type="button"
                                            onClick={() => toggleCsvField(field.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                active
                                                    ? 'bg-cyan-500/8 border-cyan-500/25 hover:bg-cyan-500/12'
                                                    : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.04] opacity-50'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${active ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                                                {active && <Check className="w-2.5 h-2.5 text-black" />}
                                            </div>
                                            <span className={`text-xs font-bold ${active ? 'text-white' : 'text-white/30'}`}>{field.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ════ PANEL DERECHO: VISTA PREVIA EN TIEMPO REAL ══════ */}
                    <div className="xl:col-span-7 space-y-3">

                        {/* Preview Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                                <Eye className="w-4 h-4 text-orange-400" />
                                Vista Previa en Tiempo Real
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                                    <Info className="w-3 h-3 text-orange-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">Solo Diseño · Datos reales al generar</span>
                                </div>
                                <span className={`text-[9px] font-mono px-2.5 py-1.5 rounded-full border uppercase tracking-widest ${
                                    config.pdf.orientation === 'landscape'
                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                        : 'bg-primary/10 border-primary/20 text-primary'
                                }`}>
                                    {config.pdf.orientation === 'landscape' ? '⬦ Horizontal' : '⬥ Vertical'}
                                </span>
                            </div>
                        </div>

                        {/* Simulated Paper */}
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 overflow-y-auto max-h-[900px]">
                            <div className="space-y-4 font-sans">

                                {/* ── Hoja 1 ── */}
                                <div className={`bg-white rounded-xl shadow-2xl p-7 space-y-5 relative text-slate-900 ${config.pdf.orientation === 'landscape' ? 'min-h-[420px]' : 'min-h-[580px]'}`}>
                                    <div className="absolute top-2 right-3 text-[8px] text-slate-300 font-mono">Página 1</div>

                                    {/* Cabecera */}
                                    <div className="flex items-center justify-between border-b-[3px] border-orange-500 pb-4">
                                        <div>
                                            <h1 className="text-sm font-black uppercase leading-tight text-slate-900 tracking-tight">
                                                {config.pdf.title || 'TÍTULO DEL REPORTE'}
                                            </h1>
                                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                                {config.pdf.subtitle || 'Subtítulo de la sede'}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 shrink-0 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                                            <img src={logoSrc} alt="Logo" className="w-8 h-8 object-contain" />
                                        </div>
                                    </div>

                                    {/* Stats Pág 1 */}
                                    {config.pdf.showPage1Stats && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { label: 'Asistencia General', val: '—%' },
                                                    { label: 'Total Miembros', val: '— Hnos' },
                                                    { label: 'Días de Servicio', val: '— días' },
                                                ].map(kpi => (
                                                    <div key={kpi.label} className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-center">
                                                        <span className="text-[8px] uppercase font-bold block text-slate-500">{kpi.label}</span>
                                                        <span className="text-sm font-black text-slate-900 italic">{kpi.val}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Donuts preview */}
                                            {(config.pdf.donutGroups || []).length > 0 && (
                                                <div className="grid grid-cols-4 gap-2 pt-1">
                                                    {(config.pdf.donutGroups || []).slice(0, 4).map((g: string) => (
                                                        <div key={g} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col items-center gap-1.5">
                                                            <div className="w-9 h-9 rounded-full border-[3px] border-orange-500 flex items-center justify-center text-[9px] font-black text-slate-700">—%</div>
                                                            <span className="font-bold capitalize text-[9px] text-slate-600">{g}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!config.pdf.separatePageForTable && (
                                        <p className="text-[9px] italic text-center text-slate-300 border-t border-slate-100 pt-2">
                                            ↓ La tabla nominal continúa debajo
                                        </p>
                                    )}
                                </div>

                                {/* ── Hoja 2 (tabla nominal) ── */}
                                {config.pdf.separatePageForTable && (
                                    <div className={`bg-white rounded-xl shadow-2xl p-7 space-y-4 relative text-slate-900 ${config.pdf.orientation === 'landscape' ? 'min-h-[420px]' : 'min-h-[580px]'}`}>
                                        <div className="absolute top-2 right-3 text-[8px] text-slate-300 font-mono">Página 2</div>

                                        <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Listado Detallado de Asistencia</span>
                                            <span>Hoja de Registro Nominal</span>
                                        </div>

                                        {/* Table Preview */}
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-slate-900">
                                                    {config.pdf.columns.filter((c: any) => c.visible).map((c: any) => (
                                                        <th key={c.id} className="py-1.5 px-2 text-[8px] font-black uppercase tracking-wider text-slate-800">{c.label}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-[9px] text-slate-600">
                                                {[
                                                    { name: 'Hermano Ejemplo 1', group: 'Varones', att: `12 ${config.pdf.attendanceUnit || 'Oraciones'}`, pct: '95%', status: 'Excelente' },
                                                    { name: 'Hermana Ejemplo 2', group: 'Festivas', att: `11 ${config.pdf.attendanceUnit || 'Oraciones'}`, pct: '88%', status: 'Excelente' },
                                                    { name: 'Joven Ejemplo 3', group: 'Jóvenes', att: `7 ${config.pdf.attendanceUnit || 'Oraciones'}`, pct: '58%', status: 'Regular' },
                                                ].map((row, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                        {config.pdf.columns.filter((c: any) => c.visible).map((c: any) => {
                                                            const val =
                                                                c.id === 'member_name' ? row.name
                                                                : c.id === 'group' ? row.group
                                                                : c.id === 'total_attendances' ? row.att
                                                                : c.id === 'percentage' ? row.pct
                                                                : row.status;
                                                            return (
                                                                <td key={c.id} className={`py-1.5 px-2 font-medium ${c.id === 'percentage' ? 'text-emerald-600 font-black' : ''}`}>
                                                                    {val}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={config.pdf.columns.filter((c: any) => c.visible).length} className="py-1.5 px-2 text-[8px] text-slate-300 italic text-center">
                                                        ··· más miembros ···
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Signatures Preview */}
                                        {config.pdf.showSignatures && (
                                            <div className="pt-8 grid grid-cols-2 gap-10 text-center">
                                                {[config.pdf.ministerSignatureLabel, config.pdf.leaderSignatureLabel].map((sig, i) => (
                                                    <div key={i}>
                                                        <div className="border-t border-slate-400 mb-1.5 w-3/4 mx-auto" />
                                                        <p className="text-[9px] font-black uppercase text-slate-800">{sig}</p>
                                                        <p className="text-[8px] text-slate-400">Firma y Sello Oficial</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick-Go to Reports CTA */}
                        <Link
                            href="/admin/reports"
                            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all group"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Usar esta plantilla → Generar Reporte Real</span>
                            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
