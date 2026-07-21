'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, X, Check, Loader2, Images, Search, Sparkles, LayoutGrid, Filter, Tag } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { compressImage } from '@/lib/utils';

interface MediaGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    currentUrl?: string;
    title?: string;
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
    title = 'Galería de Medios'
}: MediaGalleryModalProps) {
    const fetchMediaGalleryFiles = useAppStore((state: any) => state.fetchMediaGalleryFiles);
    const uploadMediaGalleryFile = useAppStore((state: any) => state.uploadMediaGalleryFile);
    const showNotification = useAppStore((state: any) => state.showNotification);

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

    useEffect(() => {
        if (isOpen) {
            setSelectedUrl(currentUrl);
            loadGallery();
        }
    }, [isOpen, currentUrl]);

    const determineCategory = (filename: string): 'icon' | 'poster' | 'gen' => {
        const lower = filename.toLowerCase();
        if (
            lower.startsWith('icon_') ||
            lower.includes('logo') ||
            lower.includes('icon') ||
            lower.includes('flame') ||
            lower.includes('church') ||
            lower.includes('avatar') ||
            lower.includes('symbol')
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
            const categorizedList: GalleryFile[] = (rawList || []).map((f: any) => ({
                ...f,
                category: determineCategory(f.name)
            }));
            setFiles(categorizedList);
        } catch (error) {
            console.error('Error loading gallery:', error);
        } finally {
            setLoading(false);
        }
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
            // Compress image to WebP (max 800x800, quality 0.85)
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
        onSelectImage(selectedUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-4xl bg-[#0a1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#A3FF57]/10 text-[#A3FF57]">
                                <Images className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
                                <p className="text-xs text-white/50">Clasifica, selecciona o sube imágenes optimizadas (WebP)</p>
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
                    <div className="flex border-b border-white/10 bg-black/20 px-6 pt-3 gap-2">
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

                    {/* Category Filter & Search Bar (Only in Gallery Tab) */}
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
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => setSelectedUrl(file.url)}
                                                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-black/40 flex items-center justify-center ${
                                                        isSelected
                                                            ? 'border-[#A3FF57] ring-4 ring-[#A3FF57]/20 shadow-[0_0_20px_rgba(163,255,87,0.3)] scale-[1.02]'
                                                            : 'border-white/10 hover:border-white/40 hover:scale-[1.01]'
                                                    }`}
                                                >
                                                    <img
                                                        src={file.url}
                                                        alt={file.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />

                                                    {/* Category badge tag */}
                                                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-white/80 border border-white/10 uppercase">
                                                        {file.category === 'icon' ? 'Ícono' : file.category === 'poster' ? 'Afiche' : 'Imagen'}
                                                    </div>

                                                    {/* Selection Overlay */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-[#A3FF57] text-black p-1 rounded-full shadow-lg z-20">
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    {/* Hover details */}
                                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-[10px] text-white/80 truncate font-mono">{file.name}</p>
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
                                    <span className="text-xs text-white/70 font-mono truncate max-w-[200px]">Imagen seleccionada</span>
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
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-6 py-2.5 rounded-xl bg-[#A3FF57] hover:bg-[#8eef40] text-black text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#A3FF57]/20 hover:scale-[1.02]"
                            >
                                Usar esta imagen
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
