'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { 
    FileText, Save, Check, FileSpreadsheet, Sparkles, 
    CheckSquare, Square, Eye, AlignLeft, Layers, ShieldCheck, 
    PieChart, ArrowRight, Table, Layout, Lock
} from 'lucide-react';
import { MediaGalleryModal } from '@/components/admin/MediaGalleryModal';

export const DEFAULT_REPORT_TEMPLATE_CONFIG = {
    pdf: {
        title: 'INFORME OFICIAL DE ASISTENCIA',
        subtitle: 'La Luz del Mundo — Sede Rodeo, CA',
        logoType: 'official_gold', // 'official_gold' | 'universal_white' | 'custom'
        customLogoUrl: '',
        orientation: 'landscape', // 'portrait' | 'landscape'
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
    },
    excelCsv: {
        delimiter: ',',
        includeHeaders: true,
        selectedFields: ['id', 'name', 'group', 'total_attendance', 'percentage'],
    }
};

export function TemplatesTab() {
    const { settings, saveSettingsToCloud, showNotification, currentUser } = useAppStore();
    const [isSaving, setIsSaving] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    // Initializing state with existing configuration or fallback defaults
    const [config, setConfig] = useState(() => {
        return settings.reportTemplatesConfig || DEFAULT_REPORT_TEMPLATE_CONFIG;
    });

    useEffect(() => {
        if (settings.reportTemplatesConfig) {
            setConfig(settings.reportTemplatesConfig);
        }
    }, [settings.reportTemplatesConfig]);

    // Check special permission: Admin, Minister or Attendance Responsible
    const canAccess = currentUser?.role === 'Administrador' ||
                      currentUser?.role === 'Ministro a Cargo' ||
                      currentUser?.role === 'Responsable de Asistencia' ||
                      currentUser?.privileges?.includes('can_edit_report_templates') ||
                      currentUser?.email === 'jairojehuel@gmail.com';

    if (!canAccess) {
        return (
            <div className="min-h-[500px] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/[0.03] border border-red-500/20 rounded-3xl p-8 text-center space-y-4 backdrop-blur-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">Acceso Restringido</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                        Esta sección de diseño de plantillas está reservada exclusivamente para el <strong className="text-orange-400">Administrador</strong>, el <strong className="text-orange-400">Ministro a Cargo</strong> y el <strong className="text-orange-400">Encargado de Asistencia</strong>.
                    </p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSettingsToCloud({ reportTemplatesConfig: config });
            showNotification('Plantilla de reportes guardada y sincronizada correctamente.', 'success');
        } catch (error) {
            console.error('Error saving report templates config:', error);
            showNotification('Error al guardar la plantilla de reportes.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleColumnVisibility = (colId: string) => {
        setConfig((prev: any) => ({
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
        setConfig((prev: any) => {
            const currentGroups = prev.pdf.donutGroups || [];
            const updated = currentGroups.includes(groupId)
                ? currentGroups.filter((g: string) => g !== groupId)
                : [...currentGroups, groupId];
            return {
                ...prev,
                pdf: { ...prev.pdf, donutGroups: updated }
            };
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header & Save Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-white">Diseñador de Plantillas de Reportes</h2>
                        <p className="text-xs text-orange-400/90 font-medium">Personalización de archivos PDF, Excel y CSV de Asistencia</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Guardando...' : 'Guardar Plantilla'}</span>
                </button>
            </div>

            {/* Split Screen Layout: Left Controls / Right Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ── PANEL DE CONFIGURACIÓN (IZQUIERDA) ────────────────────────── */}
                <div className="lg:col-span-6 space-y-6">
                    
                    {/* 1. Encabezado e Identidad */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>1. Encabezado e Identidad del PDF</span>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-medium text-white/70">Título del Reporte</label>
                            <input
                                type="text"
                                value={config.pdf.title}
                                onChange={e => setConfig({ ...config, pdf: { ...config.pdf, title: e.target.value } })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-medium text-white/70">Subtítulo / Membrete de Sede</label>
                            <input
                                type="text"
                                value={config.pdf.subtitle}
                                onChange={e => setConfig({ ...config, pdf: { ...config.pdf, subtitle: e.target.value } })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="block text-xs font-medium text-white/70">Logotipo Oficial en Cabecera</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'official_gold', label: 'Flama Dorada', img: '/icon_1784673063714.webp' },
                                    { id: 'universal_white', label: 'Escudo Blanco', img: '/lldm_logo_universal_white.svg' },
                                    { id: 'custom', label: 'Personalizado', img: config.pdf.customLogoUrl || '/flama-oficial.svg' },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setConfig({ ...config, pdf: { ...config.pdf, logoType: item.id } })}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                            config.pdf.logoType === item.id 
                                                ? 'bg-orange-500/20 border-orange-500 text-white' 
                                                : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center p-1">
                                            <img src={item.img} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] font-bold">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Paginación y Gráficas de Dona */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                            <PieChart className="w-4 h-4" />
                            <span>2. Estructura & Donas Estadísticas (Pág. 1)</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-2xl">
                            <div>
                                <p className="text-xs font-bold text-white">Página 1: Resumen y Donas</p>
                                <p className="text-[10px] text-white/40">Mostrar tarjetas y donas en la primera hoja</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.pdf.showPage1Stats}
                                onChange={e => setConfig({ ...config, pdf: { ...config.pdf, showPage1Stats: e.target.checked } })}
                                className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-2xl">
                            <div>
                                <p className="text-xs font-bold text-white">Separar Tabla Nominal a Página 2</p>
                                <p className="text-[10px] text-white/40">La lista completa de miembros inicia limpia en Página 2</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.pdf.separatePageForTable}
                                onChange={e => setConfig({ ...config, pdf: { ...config.pdf, separatePageForTable: e.target.checked } })}
                                className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="block text-xs font-medium text-white/70">Grupos a mostrar en Donas Estadísticas</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'varones', label: 'Varones' },
                                    { id: 'festivas', label: 'Festivas / Hermanas' },
                                    { id: 'jovenes', label: 'Jóvenes' },
                                    { id: 'ninos', label: 'Niños' }
                                ].map(group => {
                                    const active = (config.pdf.donutGroups || []).includes(group.id);
                                    return (
                                        <button
                                            key={group.id}
                                            type="button"
                                            onClick={() => toggleDonutGroup(group.id)}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                                active ? 'bg-amber-500/20 border-amber-500/50 text-white' : 'bg-black/20 border-white/10 text-white/40'
                                            }`}
                                        >
                                            {active ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-white/20" />}
                                            <span>{group.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 3. Columnas de la Tabla Nominal */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                            <Table className="w-4 h-4" />
                            <span>3. Columnas de la Tabla Nominal (PDF)</span>
                        </div>

                        <div className="space-y-2">
                            {config.pdf.columns.map((col: any) => (
                                <div key={col.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleColumnVisibility(col.id)}
                                            className="text-white/60 hover:text-white"
                                        >
                                            {col.visible ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-white/20" />}
                                        </button>
                                        <span className={`text-xs font-bold ${col.visible ? 'text-white' : 'text-white/30 line-through'}`}>{col.label}</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-mono text-white/30">{col.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Pie de Página & Firmas */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            <span>4. Pie de Página & Firmas Oficiales</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-2xl">
                            <div>
                                <p className="text-xs font-bold text-white">Habilitar Bloque de Firmas</p>
                                <p className="text-[10px] text-white/40">Agregar líneas para firmas del Ministro y Encargado</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.pdf.showSignatures}
                                onChange={e => setConfig({ ...config, pdf: { ...config.pdf, showSignatures: e.target.checked } })}
                                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                                <label className="block text-[11px] font-bold text-white/50 mb-1">Título Ministro</label>
                                <input
                                    type="text"
                                    value={config.pdf.ministerSignatureLabel}
                                    onChange={e => setConfig({ ...config, pdf: { ...config.pdf, ministerSignatureLabel: e.target.value } })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-white/50 mb-1">Título Encargado</label>
                                <input
                                    type="text"
                                    value={config.pdf.leaderSignatureLabel}
                                    onChange={e => setConfig({ ...config, pdf: { ...config.pdf, leaderSignatureLabel: e.target.value } })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PANEL DE VISTA PREVIA EN TIEMPO REAL (DERECHA) ────────────────── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-wider">
                            <Eye className="w-4 h-4 text-orange-400" />
                            <span>Vista Previa del PDF en Tiempo Real</span>
                        </div>
                        <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full uppercase">
                            Hoja Carta ({config.pdf.orientation})
                        </span>
                    </div>

                    {/* Contenedor del PDF simulado */}
                    <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[900px] text-slate-900 space-y-6 pdf-preview-canvas">
                        
                        {/* ── HOJA 1 SIMULADA ── */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 min-h-[550px] relative font-sans text-xs pdf-preview-sheet">
                            <div className="absolute top-2 right-4 text-[9px] text-slate-400 font-mono">Página 1</div>
                            
                            {/* Cabecera del PDF */}
                            <div className="flex items-center justify-between border-b-2 border-orange-500 pb-4">
                                <div>
                                    <h1 className="text-base font-black leading-tight uppercase" style={{ color: '#0f172a' }}>{config.pdf.title}</h1>
                                    <p className="text-[11px] font-semibold" style={{ color: '#475569' }}>{config.pdf.subtitle}</p>
                                </div>
                                <div className="w-10 h-10 shrink-0">
                                    <img 
                                        src={
                                            config.pdf.logoType === 'universal_white' 
                                                ? '/lldm_logo_universal_white.svg' 
                                                : '/icon_1784673063714.webp'
                                        } 
                                        alt="Logo" 
                                        className="w-full h-full object-contain" 
                                    />
                                </div>
                            </div>

                            {/* Donas / Estadísticas Pág 1 */}
                            {config.pdf.showPage1Stats && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center">
                                            <span className="text-[10px] uppercase font-bold block" style={{ color: '#64748b' }}>Asistencia General</span>
                                            <span className="text-lg font-black" style={{ color: '#0f172a' }}>89.4%</span>
                                        </div>
                                        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center">
                                            <span className="text-[10px] uppercase font-bold block" style={{ color: '#64748b' }}>Asistentes Promedio</span>
                                            <span className="text-lg font-black" style={{ color: '#0f172a' }}>142 Hnos</span>
                                        </div>
                                    </div>

                                    {/* Donas Simuladas */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        {(config.pdf.donutGroups || []).map((g: string) => (
                                            <div key={g} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border-4 border-orange-500 flex items-center justify-center font-bold text-[10px]" style={{ color: '#1e293b' }}>
                                                    85%
                                                </div>
                                                <span className="font-bold capitalize text-xs" style={{ color: '#334155' }}>{g}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!config.pdf.separatePageForTable && (
                                <p className="text-[10px] italic text-center pt-4" style={{ color: '#94a3b8' }}>--- La tabla nominal continúa aquí abajo ---</p>
                            )}
                        </div>

                        {/* ── HOJA 2 SIMULADA ── */}
                        {config.pdf.separatePageForTable && (
                            <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 min-h-[550px] relative font-sans text-xs pdf-preview-sheet">
                                <div className="absolute top-2 right-4 text-[9px] text-slate-400 font-mono">Página 2</div>
                                
                                <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-[10px] font-bold" style={{ color: '#64748b' }}>
                                    <span>LISTADO DETALLADO DE ASISTENCIA</span>
                                    <span>HOJA DE REGISTRO NOMINAL</span>
                                </div>

                                {/* Tabla Nomminal Simulada */}
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase" style={{ color: '#1e293b' }}>
                                            {config.pdf.columns.filter((c: any) => c.visible).map((c: any) => (
                                                <th key={c.id} className="py-2 px-1">{c.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-[11px]" style={{ color: '#334155' }}>
                                        <tr>
                                            {config.pdf.columns.find((c: any) => c.id === 'member_name' && c.visible) && <td className="py-2 font-bold">Hermano Ejemplo 1</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'group' && c.visible) && <td>Varones</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'total_attendances' && c.visible) && <td>12 Cultos</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'percentage' && c.visible) && <td className="font-bold text-emerald-600">95%</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'status' && c.visible) && <td>Fiel / Regular</td>}
                                        </tr>
                                        <tr>
                                            {config.pdf.columns.find((c: any) => c.id === 'member_name' && c.visible) && <td className="py-2 font-bold">Hermana Ejemplo 2</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'group' && c.visible) && <td>Festivas</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'total_attendances' && c.visible) && <td>11 Cultos</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'percentage' && c.visible) && <td className="font-bold text-emerald-600">90%</td>}
                                            {config.pdf.columns.find((c: any) => c.id === 'status' && c.visible) && <td>Fiel / Regular</td>}
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Bloque de Firmas */}
                                {config.pdf.showSignatures && (
                                    <div className="pt-12 grid grid-cols-2 gap-8 text-center">
                                        <div className="border-t border-slate-400 pt-2">
                                            <p className="text-[10px] font-bold text-slate-800 uppercase">{config.pdf.ministerSignatureLabel}</p>
                                            <p className="text-[9px] text-slate-400">Firma y Sello Sede</p>
                                        </div>
                                        <div className="border-t border-slate-400 pt-2">
                                            <p className="text-[10px] font-bold text-slate-800 uppercase">{config.pdf.leaderSignatureLabel}</p>
                                            <p className="text-[9px] text-slate-400">Firma Responsable</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
