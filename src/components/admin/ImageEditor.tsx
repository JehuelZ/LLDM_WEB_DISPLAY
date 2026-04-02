"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RotateCw, ZoomIn, ZoomOut, Check, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageEditorProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    onSave: (editedImageDataUrl: string) => void
    aspectRatio?: number
}

export const ImageEditor = ({ isOpen, onClose, imageSrc, onSave, aspectRatio = 1 }: ImageEditorProps) => {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        if (isOpen && imageSrc) {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = imageSrc
            img.onload = () => {
                imageRef.current = img
                resetEditor()
            }
        }
    }, [isOpen, imageSrc])

    const resetEditor = () => {
        setZoom(1)
        setRotation(0)
        setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleSave = () => {
        if (!canvasRef.current || !imageRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = 600
        canvas.width = size
        canvas.height = size / aspectRatio

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(zoom, zoom)
        
        // Calculate drawing position based on manual position and zoom
        // This is a simplified version, ideally we'd match the UI preview perfectly
        const drawW = size
        const drawH = size * (imageRef.current.height / imageRef.current.width)
        
        ctx.drawImage(
            imageRef.current, 
            -drawW / 2 + (position.x / zoom), 
            -drawH / 2 + (position.y / zoom), 
            drawW, 
            drawH
        )
        
        ctx.restore()

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        onSave(dataUrl)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black tracking-tighter text-white">EDITOR DE IMAGEN</h3>
                                <p className="text-[10px] font-bold text-white/30 tracking-widest mt-1 uppercase">AJUSTE DE ENCUADRE Y ESCALA</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div 
                                ref={containerRef}
                                className="relative aspect-square w-full max-w-[400px] mx-auto bg-black rounded-md overflow-hidden border border-white/10 cursor-move group"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <div 
                                    className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
                                    style={{
                                        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation} eccentricity) scale(${zoom})`
                                    }}
                                >
                                    {imageSrc && (
                                        <img 
                                            src={imageSrc} 
                                            className="max-w-none h-full object-contain pointer-events-none"
                                            alt="To edit"
                                        />
                                    )}
                                </div>
                                
                                {/* Overlay crop guides */}
                                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/60">
                                    <div className="w-full h-full border border-white/20 relative">
                                        <div className="absolute top-1/3 w-full h-px bg-white/10" />
                                        <div className="absolute top-2/3 w-full h-px bg-white/10" />
                                        <div className="absolute left-1/3 h-full w-px bg-white/10" />
                                        <div className="absolute left-2/3 h-full w-px bg-white/10" />
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[8px] font-black text-white/60 tracking-widest">ARRASTRAR PARA MOVER</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-center gap-6">
                                    <ZoomOut className="w-4 h-4 text-white/20" />
                                    <input 
                                        type="range" 
                                        min="0.5" 
                                        max="3" 
                                        step="0.01" 
                                        value={zoom} 
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <ZoomIn className="w-4 h-4 text-white/20" />
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => setRotation(prev => prev - 90)}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 transition-colors group"
                                    >
                                        <RotateCw className="w-5 h-5 text-white/60 group-hover:text-white rotate-180" />
                                    </button>
                                    <button 
                                        onClick={() => setRotation(prev => prev + 90)}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 transition-colors group"
                                    >
                                        <RotateCw className="w-5 h-5 text-white/60 group-hover:text-white" />
                                    </button>
                                    <button 
                                        onClick={resetEditor}
                                        className="px-6 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 text-[10px] font-black tracking-widest text-white/60 transition-colors"
                                    >
                                        RESETEAR
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 h-14 rounded-md border border-white/10 text-[10px] font-black tracking-[0.2em] text-white/40 hover:bg-white/5 transition-colors"
                            >
                                CANCELAR
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 h-14 rounded-md bg-primary text-black text-[10px] font-black tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
                            >
                                APLICAR CAMBIOS
                            </button>
                        </div>
                    </motion.div>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}
        </AnimatePresence>
    )
}
