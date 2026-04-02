
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ZoomIn, X, Check, RotateCw, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * MIRROR AUDIT V20: THE UNIFIED COLOR AUDIT
 * - Entire Modal Base: EXACT #0a0a0a (per "color de todo" and "tarjeta de perfil").
 * - Header Section: EXACT #161616.
 * - Footer Section: EXACT #0a0a0a (Unifying the look).
 * - Viewport: EXACT #0a0a0a.
 * - Aux Buttons: #060a17.
 * - Primary Button: #008e5b.
 */

export function ImageEditor({ image, onSave, onCancel, aspectRatio = 1, loading = false }: {
    image: string;
    onSave: (croppedImage: string) => void;
    onCancel: () => void;
    aspectRatio?: number;
    loading?: boolean;
}) {
    const [zoom, setZoom] = useState(1.2);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleSave = useCallback(() => {
        if (!imageRef.current || !containerRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imageRef.current;
        const container = containerRef.current;

        const exportSize = 640;
        canvas.width = exportSize;
        canvas.height = exportSize / aspectRatio;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const imgAspect = img.naturalWidth / img.naturalHeight;
        let baseScale;
        if (imgAspect > 1) {
            baseScale = containerHeight / img.naturalHeight;
        } else {
            baseScale = containerWidth / img.naturalWidth;
        }

        const finalScale = baseScale * zoom * (exportSize / containerWidth);
        const drawW = img.naturalWidth * finalScale;
        const drawH = img.naturalHeight * finalScale;

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

        onSave(canvas.toDataURL('image/jpeg', 0.9));
    }, [zoom, rotation, x, y, image, onSave, aspectRatio]);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[672px] overflow-hidden rounded-[32px] border border-white/[0.04] relative shadow-none"
                style={{ backgroundColor: '#0a0a0a' }}
            >
                {/* Header Row: Exact Photoshop Color (#161616) */}
                <div 
                    className="p-8 py-[32px] min-h-[116px] flex items-start justify-between border-b border-white/[0.04] rounded-t-[32px] shadow-none"
                    style={{ backgroundColor: '#161616', backgroundImage: 'none' }}
                >
                    <div className="text-left">
                        <h3 
                            className="text-[24px] font-[900] uppercase text-white leading-none mb-1.5"
                            style={{ fontStyle: 'italic', letterSpacing: '-1.2px', textShadow: 'none' }}
                        >
                            <span style={{ fontStyle: 'italic' }}>Ajuste de Fotografía</span>
                        </h3>
                        <p 
                            className="text-[9px] font-black uppercase opacity-70"
                            style={{ color: '#10b981', letterSpacing: '0.2em' }}
                        >
                            DESLICE PARA REENCUADRAR • USE EL ZOOM
                        </p>
                    </div>
                    <button 
                        onClick={onCancel} 
                        className="text-white/20 hover:text-white transition-colors p-1 shadow-none"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="p-12 py-14 space-y-12 shadow-none" style={{ backgroundColor: '#0a0a0a' }}>
                    {/* Viewport: Unified #0a0a0a */}
                    <div
                        ref={containerRef}
                        className="relative w-full aspect-square max-w-[360px] mx-auto overflow-hidden rounded-[40px] border border-white/[0.04] cursor-grab active:cursor-grabbing group shadow-none"
                        style={{ backgroundColor: '#0a0a0a' }}
                    >
                        {/* Grid */}
                        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.08]">
                            <div className="absolute left-1/3 inset-y-0 w-[0.5px] bg-white" />
                            <div className="absolute left-2/3 inset-y-0 w-[0.5px] bg-white" />
                            <div className="absolute top-1/3 inset-x-0 h-[0.5px] bg-white" />
                            <div className="absolute top-2/3 inset-x-0 h-[0.5px] bg-white" />
                        </div>

                        <motion.div
                            style={{ x, y }}
                            drag
                            dragMomentum={false}
                            className="absolute inset-0 flex items-center justify-center shadow-none"
                        >
                            <motion.img
                                ref={imageRef}
                                src={image}
                                animate={{
                                    scale: zoom,
                                    rotate: rotation,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="min-w-full min-h-full w-auto h-auto object-cover select-none pointer-events-none shadow-none"
                            />
                        </motion.div>
                    </div>

                    {/* Controls Styling */}
                    <div className="space-y-10 px-6 shadow-none">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between shadow-none">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                    <ZoomIn className="w-4 h-4" style={{ color: '#10b981' }} /> AMPLIACIÓN
                                </span>
                                <span className="text-white text-[10px] font-black bg-white/[0.04] px-2 py-1 rounded border border-white/[0.08] shadow-none">
                                    {Math.round(zoom * 100)}%
                                </span>
                            </div>
                            <div className="relative group flex items-center h-4">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-0.5 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-[#10b981] hover:bg-white/[0.2] transition-colors shadow-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 shadow-none">
                            <button
                                onClick={() => setRotation(prev => prev + 90)}
                                className="flex-1 border border-white/[0.04] hover:border-[#10b981]/30 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-3 transition-all text-white shadow-none"
                                style={{ backgroundColor: '#060a17', backgroundImage: 'none' }}
                            >
                                <RotateCw className="w-4 h-4" style={{ color: '#10b981' }} /> ROTAR IMAGEN
                            </button>
                            <button
                                onClick={() => {
                                    setZoom(1.2);
                                    setRotation(0);
                                    x.set(0);
                                    y.set(0);
                                }}
                                className="flex-1 border border-white/[0.04] hover:border-[#10b981]/30 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-3 transition-all text-white shadow-none"
                                style={{ backgroundColor: '#060a17', backgroundImage: 'none' }}
                            >
                                <Grid3X3 className="w-4 h-4" style={{ color: '#10b981' }} /> REESTABLECER
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Unified Shadow-Free: EXACT #0a0a0a (per "color de todo") */}
                <div 
                    className="p-10 pt-4 pb-14 border-t border-white/[0.04] flex items-center justify-between shadow-none"
                    style={{ backgroundColor: '#0a0a0a' }}
                >
                    <button 
                        onClick={onCancel}
                        className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors px-4 shadow-none"
                    >
                        CANCELAR
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSave}
                        className="h-16 px-12 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] border-none outline-none min-w-[240px] shadow-none"
                        style={{ 
                            backgroundColor: '#008e5b', 
                            backgroundImage: 'none',
                            color: '#fff', 
                            fontWeight: 900, 
                            fontSize: '11px', 
                            letterSpacing: '1.5px',
                            boxShadow: 'none'
                        }}
                    >
                        {loading ? 'PROCESANDO...' : (
                            <>
                                <Check className="w-5 h-5 text-white stroke-[4.5]" /> GUARDAR PERFIL
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
