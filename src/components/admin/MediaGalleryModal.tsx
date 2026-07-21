'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, X, Check, Loader2, Images, Search, Sparkles, Tag, Trash2, Link, AlertTriangle, Info, ShieldAlert, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { compressImage } from '@/lib/utils';

interface MediaGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage?: (url: string) => void;
    currentUrl?: string;
    title?: string;
    mode?: 'select' | 'manage';
}

interface GalleryFile {
    name: string;
    url: string;
    createdAt: string;
    bucket: string;
    category: 'icon' | 'poster' | 'gen';
}

export function MediaGalleryModal({
    isOpen,
    onClose,
    onSelectImage,
    currentUrl = '',
    title = 'Galería de Medios',
    mode = 'select'
}: MediaGalleryModalProps) {
    const fetchMediaGalleryFiles = useAppStore((state: any) => state.fetchMediaGalleryFiles);
    const uploadMediaGalleryFile = useAppStore((state: any) => state.uploadMediaGalleryFile);
    const deleteMediaGalleryFile = useAppStore((state: any) => state.deleteMediaGalleryFile);
    const showNotification = useAppStore((state: any) => state.showNotification);

    // State from store to detect image usages
    const members = useAppStore((state: any) => state.members || []);
    const settings = useAppStore((state: any) => state.settings || {});
    const monthlySchedule = useAppStore((state: any) => state.monthlySchedule || {});
    const announcements = useAppStore((state: any) => state.announcements || []);

    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
    const [files, setFiles] = useState<GalleryFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl);
    const [dragActive, setDragActive] = useState(false);

    // Filtering & Categorization State
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'icon' | 'poster' | 'gen'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Upload Category Selector
    const [uploadCategory, setUploadCategory] = useState<'icon' | 'poster' | 'gen'>('icon');

    // Bulk Multi-Selection State
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkSelectedNames, setBulkSelectedNames] = useState<Set<string>>(new Set());

    // Deletion Modal State (Single or Bulk)
    const [filesToDelete, setFilesToDelete] = useState<GalleryFile[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeHoverInfo, setActiveHoverInfo] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedUrl(currentUrl);
            setBulkSelectedNames(new Set());
            setBulkMode(false);
            loadGallery();
        }
    }, [isOpen, currentUrl]);

    const determineCategory = (filename: string, isProfileOrSetting = false): 'icon' | 'poster' | 'gen' => {
        const lower = filename.toLowerCase();
        if (
            isProfileOrSetting ||
            lower.startsWith('icon_') ||
            lower.includes('logo') ||
            lower.includes('icon') ||
            lower.includes('flame') ||
            lower.includes('church') ||
            lower.includes('avatar') ||
            lower.includes('profile') ||
            lower.includes('symbol') ||
            lower.includes('admin')
        ) {
            return 'icon';
        }
        if (
            lower.startsWith('poster_') ||
            lower.includes('poster') ||
            lower.includes('event') ||
            lower.includes('banner') ||
            lower.includes('avivamiento')
        ) {
            return 'poster';
        }
        return 'gen';
    };

    const loadGallery = async () => {
        setLoading(true);
        try {
            const rawList = await fetchMediaGalleryFiles();
            const categorizedList: GalleryFile[] = (rawList || []).map((f: any) => {
                const usages = getFileUsages(f);
                const isProfileOrSetting = usages.some(u => u.startsWith('Perfil:') || u.startsWith('Ajustes:'));
                return {
                    ...f,
                    category: determineCategory(f.name, isProfileOrSetting)
                };
            });
            setFiles(categorizedList);
        } catch (error) {
            console.error('Error loading gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Compute where a given image URL/filename is being used across the app
    const getFileUsages = (file: GalleryFile): string[] => {
        const usages: string[] = [];
        const url = file.url;
        const name = file.name;

        if (!url) return usages;

        // 1. Check Members Avatars
        members.forEach((m: any) => {
            if (m.avatar === url || m.avatarUrl === url || (m.avatar && m.avatar.includes(name))) {
                usages.push(`Perfil: ${m.name || 'Hermano(a)'}`);
            }
        });

        // 2. Check Settings (Logos, Icons, Backgrounds)
        if (settings?.customIconUrl === url || (settings?.customIconUrl && settings.customIconUrl.includes(name))) {
            usages.push('Ajustes: Ícono de la Iglesia');
        }
        if (settings?.customLogoUrl === url || settings?.customLogo1 === url || (settings?.customLogo1 && settings.customLogo1.includes(name))) {
            usages.push('Ajustes: Logo Personalizado #1');
        }
        if (settings?.customLogo2 === url || (settings?.customLogo2 && settings.customLogo2.includes(name))) {
            usages.push('Ajustes: Logo Personalizado #2');
        }
        if (settings?.customLogo3 === url || (settings?.customLogo3 && settings.customLogo3.includes(name))) {
            usages.push('Ajustes: Logo Personalizado #3');
        }
        if (settings?.customLogo4 === url || (settings?.customLogo4 && settings.customLogo4.includes(name))) {
            usages.push('Ajustes: Logo Personalizado #4');
        }
        if (settings?.projectionBackgroundUrl === url || (settings?.projectionBackgroundUrl && settings.projectionBackgroundUrl.includes(name))) {
            usages.push('Ajustes: Fondo de Proyección');
        }

        // 3. Check Monthly Schedule slots
        if (monthlySchedule) {
            Object.entries(monthlySchedule).forEach(([dateStr, daySched]: [string, any]) => {
                if (daySched?.slots) {
                    Object.entries(daySched.slots).forEach(([slotId, slotData]: [string, any]) => {
                        if (slotData?.customIconUrl === url || (slotData?.customIconUrl && slotData.customIconUrl.includes(name))) {
                            usages.push(`Horario: Servicio del ${dateStr}`);
                        }
                    });
                }
            });
        }

        // 4. Check Announcements
        announcements.forEach((ann: any) => {
            if (ann.imageUrl === url || (ann.imageUrl && ann.imageUrl.includes(name))) {
                usages.push(`Aviso: ${ann.title || 'Aviso General'}`);
            }
        });

        return Array.from(new Set(usages)); // unique list
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processAndUploadFile(file);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await processAndUploadFile(file);
        }
    };

    const processAndUploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showNotification?.('Por favor selecciona un archivo de imagen válido', 'error');
            return;
        }

        setUploading(true);
        try {
            const compressed = await compressImage(file, 800, 800, 0.85);
            const publicUrl = await uploadMediaGalleryFile(compressed, uploadCategory);

            if (publicUrl) {
                showNotification?.('Imagen subida y clasificada correctamente', 'success');
                setSelectedUrl(publicUrl);
                await loadGallery();
                setActiveTab('gallery');
                setCategoryFilter(uploadCategory);
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            showNotification?.('Error al procesar la imagen', 'error');
        } finally {
            setUploading(false);
        }
    };

    const toggleBulkSelect = (filename: string) => {
        setBulkSelectedNames(prev => {
            const next = new Set(prev);
            if (next.has(filename)) {
                next.delete(filename);
            } else {
                next.add(filename);
            }
            return next;
        });
    };

    const selectUnusedFiles = () => {
        const unusedNames = filteredFiles
            .filter(f => getFileUsages(f).length === 0)
            .map(f => f.name);
        setBulkSelectedNames(new Set(unusedNames));
        showNotification?.(`Se seleccionaron ${unusedNames.length} imágenes no vinculadas`, 'success');
    };

    const clearBulkSelection = () => {
        setBulkSelectedNames(new Set());
    };

    const initiateBulkDelete = () => {
        const selectedFilesList = files.filter(f => bulkSelectedNames.has(f.name));
        if (selectedFilesList.length === 0) return;
        setFilesToDelete(selectedFilesList);
    };

    const handleDeleteConfirmed = async () => {
        if (filesToDelete.length === 0) return;
        setIsDeleting(true);
        try {
            let successCount = 0;
            for (const f of filesToDelete) {
                const success = await deleteMediaGalleryFile(f.bucket, f.name);
                if (success) {
                    successCount++;
                    if (selectedUrl === f.url) {
                        setSelectedUrl('');
                    }
                }
            }
            showNotification?.(`Se eliminaron ${successCount} imágenes de la galería`, 'success');
            setFilesToDelete([]);
            setBulkSelectedNames(new Set());
            await loadGallery();
        } catch (err) {
            console.error('Error deleting files:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredFiles = useMemo(() => {
        return files.filter(f => {
            const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
            const matchesSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [files, categoryFilter, searchQuery]);

    const counts = useMemo(() => ({
        all: files.length,
        icon: files.filter(f => f.category === 'icon').length,
        poster: files.filter(f => f.category === 'poster').length,
        gen: files.filter(f => f.category === 'gen').length,
    }), [files]);

    const handleConfirm = () => {
        if (onSelectImage) {
            onSelectImage(selectedUrl);
        }
        onClose();
    };

    if (!isOpen) return null;

    // Aggregate usages for all files marked for deletion
    const aggregatedUsages: { file: GalleryFile; usages: string[] }[] = filesToDelete
        .map(f => ({ file: f, usages: getFileUsages(f) }))
        .filter(item => item.usages.length > 0);

    const hasAnyInUseToDelete = aggregatedUsages.length > 0;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-4xl bg-[#0a1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#A3FF57]/10 text-[#A3FF57]">
                                <Images className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
                                <p className="text-xs text-white/50">Administra, clasifica y elimina archivos de forma individual o masiva</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-white/10 bg-black/20 px-6 pt-3 gap-2 justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                                    activeTab === 'gallery'
                                        ? 'bg-[#101e38] text-[#A3FF57] border-[#A3FF57]'
                                        : 'text-white/60 hover:text-white border-transparent hover:bg-white/5'
                                }`}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Galería ({files.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                                    activeTab === 'upload'
                                        ? 'bg-[#101e38] text-[#A3FF57] border-[#A3FF57]'
                                        : 'text-white/60 hover:text-white border-transparent hover:bg-white/5'
                                }`}
                            >
                                <Upload className="w-4 h-4" />
                                Subir Nueva Imagen
                            </button>
                        </div>

                        {/* Bulk Mode Toggle (Only in Gallery tab) */}
                        {activeTab === 'gallery' && (
                            <button
                                onClick={() => {
                                    setBulkMode(!bulkMode);
                                    if (bulkMode) setBulkSelectedNames(new Set());
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                                    bulkMode
                                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <CheckSquare className="w-3.5 h-3.5" />
                                {bulkMode ? 'Modo Selección Múltiple (Activo)' : 'Selección Múltiple'}
                            </button>
                        )}
                    </div>

                    {/* Category Filter, Search Bar & Bulk Actions (Only in Gallery Tab) */}
                    {activeTab === 'gallery' && (
                        <div className="px-6 py-3 border-b border-white/5 bg-black/10 flex flex-wrap items-center justify-between gap-3">
                            {/* Category Filter Chips */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                    onClick={() => setCategoryFilter('all')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        categoryFilter === 'all'
                                            ? 'bg-[#A3FF57] text-black shadow-md'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Todos ({counts.all})
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('icon')}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        categoryFilter === 'icon'
                                            ? 'bg-[#A3FF57] text-black shadow-md'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    Íconos y Logos ({counts.icon})
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('poster')}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        categoryFilter === 'poster'
                                            ? 'bg-[#A3FF57] text-black shadow-md'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                                    Afiches / Eventos ({counts.poster})
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('gen')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        categoryFilter === 'gen'
                                            ? 'bg-[#A3FF57] text-black shadow-md'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    General ({counts.gen})
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-xs">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#A3FF57]"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bulk Selection Bar (When Bulk Mode is enabled) */}
                    {activeTab === 'gallery' && bulkMode && (
                        <div className="px-6 py-2.5 bg-purple-950/40 border-b border-purple-500/30 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-purple-300">
                                    {bulkSelectedNames.size} seleccionadas
                                </span>
                                <button
                                    onClick={selectUnusedFiles}
                                    className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 font-semibold text-[11px]"
                                >
                                    Seleccionar No Vinculadas (Libres)
                                </button>
                                {bulkSelectedNames.size > 0 && (
                                    <button
                                        onClick={clearBulkSelection}
                                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[11px]"
                                    >
                                        Desmarcar Todo
                                    </button>
                                )}
                            </div>

                            {bulkSelectedNames.size > 0 && (
                                <button
                                    onClick={initiateBulkDelete}
                                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30 text-xs uppercase tracking-wider"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Eliminar {bulkSelectedNames.size} seleccionadas
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 min-h-[320px]">
                        {activeTab === 'gallery' && (
                            <div>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/50">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#A3FF57]" />
                                        <span className="text-xs uppercase tracking-wider">Cargando galería...</span>
                                    </div>
                                ) : filteredFiles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/40 border-2 border-dashed border-white/10 rounded-2xl">
                                        <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                                        <p className="text-sm font-semibold">
                                            {searchQuery || categoryFilter !== 'all'
                                                ? 'No hay imágenes que coincidan con el filtro'
                                                : 'No hay imágenes en la galería'}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setCategoryFilter('all');
                                                setActiveTab('upload');
                                            }}
                                            className="px-4 py-2 bg-[#A3FF57]/10 text-[#A3FF57] hover:bg-[#A3FF57]/20 border border-[#A3FF57]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors mt-2"
                                        >
                                            Subir nueva imagen
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {filteredFiles.map((file, idx) => {
                                            const isSelected = selectedUrl === file.url;
                                            const isBulkChecked = bulkSelectedNames.has(file.name);
                                            const usages = getFileUsages(file);
                                            const isUsed = usages.length > 0;

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        if (bulkMode) {
                                                            toggleBulkSelect(file.name);
                                                        } else {
                                                            setSelectedUrl(file.url);
                                                        }
                                                    }}
                                                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-black/40 flex items-center justify-center ${
                                                        isBulkChecked
                                                            ? 'border-purple-400 ring-4 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                                                            : isSelected
                                                            ? 'border-[#A3FF57] ring-4 ring-[#A3FF57]/20 shadow-[0_0_20px_rgba(163,255,87,0.3)] scale-[1.02]'
                                                            : 'border-white/10 hover:border-white/40 hover:scale-[1.01]'
                                                    }`}
                                                >
                                                    <img
                                                        src={file.url}
                                                        alt={file.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />

                                                    {/* Bulk Checkbox Overlay */}
                                                    {bulkMode && (
                                                        <div className="absolute top-2 left-2 z-20">
                                                            <div className={`p-1 rounded-md border transition-all ${
                                                                isBulkChecked
                                                                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                                                                    : 'bg-black/60 border-white/30 text-white/50 hover:bg-black/80'
                                                            }`}>
                                                                <CheckSquare className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Category badge tag (Only when bulkMode is off) */}
                                                    {!bulkMode && (
                                                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold text-white/80 border border-white/10 uppercase">
                                                            {file.category === 'icon' ? 'Ícono' : file.category === 'poster' ? 'Afiche' : 'Imagen'}
                                                        </div>
                                                    )}

                                                    {/* Link Usage Status Badge */}
                                                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                                                        {isUsed ? (
                                                            <div
                                                                onMouseEnter={() => setActiveHoverInfo(file.name)}
                                                                onMouseLeave={() => setActiveHoverInfo(null)}
                                                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[9px] font-bold backdrop-blur-md shadow-lg"
                                                                title={`Vinculado a: ${usages.join(', ')}`}
                                                            >
                                                                <Link className="w-2.5 h-2.5" />
                                                                <span>En Uso</span>
                                                            </div>
                                                        ) : (
                                                            <div className="px-1.5 py-0.5 rounded-full bg-white/10 text-white/40 border border-white/10 text-[9px] font-bold backdrop-blur-md">
                                                                Libre
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Usage Tooltip Hover Overlay */}
                                                    {activeHoverInfo === file.name && isUsed && (
                                                        <div className="absolute inset-x-2 top-8 z-30 bg-black/95 border border-emerald-500/50 rounded-lg p-2 shadow-2xl text-[10px] text-white">
                                                            <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                                                                <Link className="w-3 h-3" /> Vinculado a:
                                                            </p>
                                                            <ul className="list-disc list-inside space-y-0.5 text-white/80 font-mono text-[9px]">
                                                                {usages.map((u, uIdx) => (
                                                                    <li key={uIdx} className="truncate">{u}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Selection Overlay Checkmark */}
                                                    {isSelected && !bulkMode && (
                                                        <div className="absolute bottom-2 left-2 bg-[#A3FF57] text-black p-1 rounded-full shadow-lg z-20">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    {/* Single Delete Button Hover Overlay (When bulkMode is off) */}
                                                    {!bulkMode && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFilesToDelete([file]);
                                                            }}
                                                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            title="Eliminar de la Galería"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Hover details */}
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <p className="text-[9px] text-white/80 truncate font-mono">{file.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="h-full flex flex-col items-center justify-center py-6">
                                {/* Upload Category Choice */}
                                <div className="w-full max-w-lg mb-6 bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                                        ¿Cómo deseas clasificar esta imagen?
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setUploadCategory('icon')}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                uploadCategory === 'icon'
                                                    ? 'bg-[#A3FF57]/20 border-[#A3FF57] text-[#A3FF57]'
                                                    : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <Sparkles className="w-5 h-5 text-amber-300" />
                                            Ícono / Logo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadCategory('poster')}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                uploadCategory === 'poster'
                                                    ? 'bg-[#A3FF57]/20 border-[#A3FF57] text-[#A3FF57]'
                                                    : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <Tag className="w-5 h-5 text-purple-400" />
                                            Afiche / Evento
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadCategory('gen')}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                uploadCategory === 'gen'
                                                    ? 'bg-[#A3FF57]/20 border-[#A3FF57] text-[#A3FF57]'
                                                    : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <ImageIcon className="w-5 h-5 text-cyan-400" />
                                            General
                                        </button>
                                    </div>
                                </div>

                                {/* Drag & Drop Box */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={handleDrop}
                                    className={`w-full max-w-lg p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                                        dragActive
                                            ? 'border-[#A3FF57] bg-[#A3FF57]/10 scale-[1.01]'
                                            : 'border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3 text-[#A3FF57]">
                                            <Loader2 className="w-10 h-10 animate-spin" />
                                            <p className="text-sm font-bold uppercase tracking-wider">Optimizando y subiendo a WebP...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-4 rounded-2xl bg-[#A3FF57]/10 text-[#A3FF57] mb-3">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-base font-bold text-white mb-1">Arrastra una imagen aquí</h4>
                                            <p className="text-xs text-white/50 mb-5 max-w-xs">
                                                JPG, PNG, WebP o SVG. Se guardará etiquetada como <strong className="text-[#A3FF57] uppercase">{uploadCategory === 'icon' ? 'Ícono/Logo' : uploadCategory === 'poster' ? 'Afiche/Evento' : 'General'}</strong>.
                                            </p>
                                            <label className="cursor-pointer px-6 py-3 bg-[#A3FF57] hover:bg-[#8eef40] text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#A3FF57]/20 hover:scale-[1.02]">
                                                Buscar en mi equipo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {selectedUrl && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-6 h-6 rounded overflow-hidden bg-black/50 border border-white/20">
                                        <img src={selectedUrl} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs text-white/70 font-mono truncate max-w-[180px]">Imagen seleccionada</span>
                                    <button
                                        onClick={() => setSelectedUrl('')}
                                        className="text-red-400 hover:text-red-300 ml-1"
                                        title="Quitar selección"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                {mode === 'select' ? 'Cancelar' : 'Cerrar Galería'}
                            </button>
                            {mode === 'select' && (
                                <button
                                    onClick={handleConfirm}
                                    className="px-6 py-2.5 rounded-xl bg-[#A3FF57] hover:bg-[#8eef40] text-black text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#A3FF57]/20 hover:scale-[1.02]"
                                >
                                    Usar esta imagen
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Warning / Confirmation Deletion Modal */}
            {filesToDelete.length > 0 && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg bg-[#0d1629] border border-white/10 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[85vh] overflow-hidden"
                    >
                        <div className="flex items-center gap-3">
                            {hasAnyInUseToDelete ? (
                                <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-base font-bold uppercase tracking-wider">
                                    {hasAnyInUseToDelete
                                        ? `¡Atención! ${aggregatedUsages.length} Imagen(es) en Uso`
                                        : filesToDelete.length === 1
                                        ? '¿Eliminar Imagen?'
                                        : `¿Eliminar ${filesToDelete.length} Imágenes?`}
                                </h4>
                                <p className="text-xs text-white/50">
                                    {filesToDelete.length === 1 ? filesToDelete[0].name : `${filesToDelete.length} archivos seleccionados`}
                                </p>
                            </div>
                        </div>

                        {hasAnyInUseToDelete ? (
                            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs space-y-3 max-h-[40vh] overflow-y-auto">
                                <p className="font-bold text-red-300">
                                    Las siguientes imágenes seleccionadas están actualmente VINCULADAS a secciones activas:
                                </p>
                                <div className="space-y-2">
                                    {aggregatedUsages.map((item, idx) => (
                                        <div key={idx} className="bg-black/40 border border-red-500/20 p-2 rounded-lg">
                                            <p className="font-mono text-red-200 font-bold truncate">{item.file.name}</p>
                                            <ul className="list-disc list-inside text-white/80 text-[11px] pt-1">
                                                {item.usages.map((u, uIdx) => (
                                                    <li key={uIdx}>{u}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-red-400/80 text-[11px] pt-1 italic">
                                    Si las eliminas del servidor, esas secciones dejarán de proyectar la imagen correspondientes.
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-white/70">
                                Ninguna de las {filesToDelete.length} imágenes seleccionadas está en uso. Se eliminarán permanentemente de Supabase Storage.
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                            <button
                                onClick={() => setFilesToDelete([])}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirmed}
                                disabled={isDeleting}
                                className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                                    hasAnyInUseToDelete
                                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                                        : 'bg-red-500 hover:bg-red-400 text-white'
                                }`}
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                {hasAnyInUseToDelete ? 'Eliminar de todos modos' : 'Sí, Eliminar Todo'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
