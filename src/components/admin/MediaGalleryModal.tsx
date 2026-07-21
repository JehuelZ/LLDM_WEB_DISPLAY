'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, X, Check, Loader2, Images } from 'lucide-react';
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

    useEffect(() => {
        if (isOpen) {
            setSelectedUrl(currentUrl);
            loadGallery();
        }
    }, [isOpen, currentUrl]);

    const loadGallery = async () => {
        setLoading(true);
        try {
            const list = await fetchMediaGalleryFiles();
            setFiles(list || []);
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
            const publicUrl = await uploadMediaGalleryFile(compressed);

            if (publicUrl) {
                showNotification?.('Imagen subida y optimizada correctamente', 'success');
                setSelectedUrl(publicUrl);
                await loadGallery();
                setActiveTab('gallery');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            showNotification?.('Error al procesar la imagen', 'error');
        } finally {
            setUploading(false);
        }
    };

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
                    className="relative w-full max-w-4xl bg-[#0a1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#A3FF57]/10 text-[#A3FF57]">
                                <Images className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
                                <p className="text-xs text-white/50">Selecciona o sube una imagen optimizada (WebP)</p>
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

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 min-h-[320px]">
                        {activeTab === 'gallery' && (
                            <div>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/50">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#A3FF57]" />
                                        <span className="text-xs uppercase tracking-wider">Cargando galería...</span>
                                    </div>
                                ) : files.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/40 border-2 border-dashed border-white/10 rounded-2xl">
                                        <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                                        <p className="text-sm font-semibold">No hay imágenes en la galería</p>
                                        <button
                                            onClick={() => setActiveTab('upload')}
                                            className="px-4 py-2 bg-[#A3FF57]/10 text-[#A3FF57] hover:bg-[#A3FF57]/20 border border-[#A3FF57]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors mt-2"
                                        >
                                            Subir primera imagen
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {files.map((file, idx) => {
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

                                                    {/* Selection Overlay */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-[#A3FF57] text-black p-1 rounded-full shadow-lg">
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    {/* Hover details */}
                                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-[10px] text-white/80 truncate">{file.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="h-full flex flex-col items-center justify-center py-8">
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={handleDrop}
                                    className={`w-full max-w-lg p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
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
                                            <div className="p-4 rounded-2xl bg-[#A3FF57]/10 text-[#A3FF57] mb-4">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-base font-bold text-white mb-1">Arrastra una imagen aquí</h4>
                                            <p className="text-xs text-white/50 mb-6 max-w-xs">
                                                Soporta JPG, PNG, WebP o SVG. Se convertirá y comprimirá a WebP liviano automáticamente.
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
