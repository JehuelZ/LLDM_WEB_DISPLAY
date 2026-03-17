
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ZoomIn, Move, X, Check, RotateCw, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageEditorProps {
    image: string;
    onSave: (croppedImage: string) => void;
    onCancel: () => void;
    aspectRatio?: number;
    loading?: boolean;
}

export function ImageEditor({ image, onSave, onCancel, aspectRatio = 1, loading = false }: ImageEditorProps) {
    const [zoom, setZoom] = useState(1.2); // Start with a bit of zoom for portraits
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Using motion values for high-performance dragging
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleSave = useCallback(() => {
        if (!imageRef.current || !containerRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imageRef.current;
        const container = containerRef.current;

        // Optimized output size for web/TV
        const exportSize = 640;
        canvas.width = exportSize;
        canvas.height = exportSize / aspectRatio;

        // Background color
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        // Move to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        // Calculate rendering scale
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Match the 'min-w-full min-h-full' object-cover logic
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let baseScale;
        if (imgAspect > 1) { // Landscape
            baseScale = containerHeight / img.naturalHeight;
        } else { // Portrait
            baseScale = containerWidth / img.naturalWidth;
        }

        const finalScale = baseScale * zoom * (exportSize / containerWidth);
        const drawW = img.naturalWidth * finalScale;
        const drawH = img.naturalHeight * finalScale;

        // Map motion values to canvas coordinates
        const canvasScale = exportSize / containerWidth;
        const mappedX = x.get() * canvasScale;
        const mappedY = y.get() * canvasScale;

        ctx.drawImage(
            img,
            -drawW / 2 + mappedX,
            -drawH / 2 + mappedY,
            drawW,
            drawH
        );
        ctx.restore();

        onSave(canvas.toDataURL('image/jpeg', 0.8));
    }, [zoom, rotation, x, y, image, onSave, aspectRatio]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card bg-[#0b1121] border-white/10 w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2rem] sm:rounded-[3rem]"
            >
                <div className="p-5 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black uppercase text-white italic tracking-tighter">Ajuste de Fotografía</h3>
                        <p className="text-[8px] sm:text-[10px] text-primary font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 opacity-70">Deslice para reencuadrar • Use el zoom</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-white/10 h-10 w-10 sm:h-12 sm:w-12 text-slate-500 hover:text-white">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                </div>

                <div className="p-4 sm:p-10 space-y-6 sm:space-y-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                    <div
                        ref={containerRef}
                        className="relative w-full aspect-square max-w-[280px] sm:max-w-[360px] mx-auto overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-[#020617] border-2 border-white/5 shadow-2xl group cursor-grab active:cursor-grabbing"
                    >
                        {/* Interactive UI Overlays */}
                        <div className="absolute inset-x-4 sm:inset-x-8 top-1/3 h-px bg-white/10 z-20 pointer-events-none" />
                        <div className="absolute inset-x-4 sm:inset-x-8 top-2/3 h-px bg-white/10 z-20 pointer-events-none" />
                        <div className="absolute inset-y-4 sm:inset-y-8 left-1/3 w-px bg-white/10 z-20 pointer-events-none" />
                        <div className="absolute inset-y-4 sm:inset-y-8 left-2/3 w-px bg-white/10 z-20 pointer-events-none" />

                        <motion.div
                            style={{ x, y }}
                            drag
                            dragMomentum={false}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <motion.img
                                ref={imageRef}
                                src={image}
                                animate={{
                                    scale: zoom,
                                    rotate: rotation,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="min-w-full min-h-full w-auto h-auto object-cover select-none pointer-events-none"
                            />
                        </motion.div>

                        {/* Decorative Frame */}
                        <div className="absolute inset-0 border-[10px] sm:border-[20px] border-[#0b1121]/40 z-30 pointer-events-none" />
                        <div className="absolute inset-2 sm:inset-4 border border-white/5 rounded-[1.2rem] sm:rounded-[2rem] z-30 pointer-events-none" />
                    </div>

                    <div className="space-y-6 sm:space-y-10 px-2 sm:px-6">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Ampliación
                                </span>
                                <span className="text-white text-[10px] sm:text-xs font-black bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10">
                                    {Math.round(zoom * 100)}%
                                </span>
                            </div>
                            <div className="relative group">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary group-hover:bg-white/10 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl gap-3 transition-all hover:border-primary/30"
                                onClick={() => setRotation(prev => prev + 90)}
                            >
                                <RotateCw className="w-5 h-5 text-primary" /> Rotar Imagen
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl gap-3 transition-all hover:border-primary/30"
                                onClick={() => {
                                    setZoom(1.2);
                                    setRotation(0);
                                    x.set(0);
                                    y.set(0);
                                }}
                            >
                                <Grid3X3 className="w-5 h-5 text-primary" /> Reestablecer
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-10 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-5">
                    <Button variant="ghost" className="order-2 sm:order-1 flex-1 font-black uppercase tracking-[0.2em] text-[10px] h-12 sm:h-16 rounded-xl sm:rounded-2xl hover:bg-white/5 text-slate-500" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button
                        disabled={loading}
                        className="order-1 sm:order-2 flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] h-12 sm:h-16 rounded-xl sm:rounded-2xl gap-2 sm:gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                        onClick={handleSave}
                    >
                        {loading ? (
                            <>
                                <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> Procesando...
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5 sm:w-6 sm:h-6" /> Guardar Perfil
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
