"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    MessageSquare, Reply, CheckCircle2, User, 
    Bell, Zap, Shield, ArrowRight, Trash2,
    Activity, Radio, Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TactileGlassCard } from '@/components/admin/TactileUI'
import { format, parseISO } from 'date-fns'

interface MensajesTabProps {
    messages: any[]
    currentUser: any
    markMessageAsRead: (id: string) => Promise<void>
    sendCloudMessage: (msg: any) => Promise<void>
    showNotification: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void
}

export const MensajesTab = ({
    messages,
    currentUser,
    markMessageAsRead,
    sendCloudMessage,
    showNotification
}: MensajesTabProps) => {
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')

    const adminMessages = messages.filter(m => m.targetRole === 'Administrador' || m.receiverId === currentUser?.id)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto space-y-10"
        >
            {/* INBOX HEADER - INDUSTRIAL MONITOR STYLE */}
            <div className="relative p-6 md:p-8 rounded-2xl md:rounded-[40px] bg-[#0b101e] border-t-4 border-t-[#dca54e] border-x border-b border-[#dca54e]/10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 md:p-6 flex gap-3 items-center">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#dca54e] animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#dca54e]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#dca54e]/20" />
                    </div>
                    <span className="hidden sm:inline text-[8px] font-black uppercase tracking-[0.4em] text-[#dca54e]/60">CONSOLA ACTIVA</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#dca54e]/10 rounded-md">
                                <Radio className="w-4 h-4 text-[#dca54e]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#dca54e]">Canal de Comunicaciones</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white italic tracking-tighter uppercase">
                            Buzón de <span className="text-[#dca54e]">Mensajes</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 p-3 md:p-4 rounded-md border border-white/5 w-full md:w-auto overflow-x-auto">
                        <div className="text-right flex-1 md:flex-none">
                            <p className="text-[7px] md:text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total</p>
                            <p className="text-lg md:text-2xl font-black font-orbitron text-white">{adminMessages.length}</p>
                        </div>
                        <div className="w-px h-8 md:h-10 bg-white/10" />
                        <div className="text-right flex-1 md:flex-none">
                            <p className="text-[7px] md:text-[8px] font-black uppercase text-primary tracking-widest mb-1">Sin Leer</p>
                            <p className="text-lg md:text-2xl font-black font-orbitron text-primary">{adminMessages.filter(m => !m.isRead).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MESSAGES LIST - ROBUST BOXES */}
            <div className="space-y-6">
                {adminMessages.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                            <Terminal size={40} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.5em]">Frecuencia limpia: Sin transmisiones</p>
                    </div>
                ) : (
                    adminMessages.map((msg, index) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative p-4 md:p-8 rounded-2xl md:rounded-[35px] border transition-all duration-500",
                                !msg.isRead 
                                    ? "bg-[#0b101e] border-[#dca54e]/40 shadow-[0_20px_50px_rgba(220,165,78,0.1)]" 
                                    : "bg-black/20 border-white/5 opacity-80"
                            )}
                        >
                            {/* NEW MESSAGE BADGE */}
                            {!msg.isRead && (
                                <div className="absolute top-0 left-6 md:left-12 -translate-y-1/2 bg-[#dca54e] text-black text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-[0_0_15px_rgba(220,165,78,0.4)]">
                                    Nuevo
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Sender Info - Sidebar Style */}
                                <div className="md:w-48 flex flex-row md:flex-col items-center md:items-start gap-4 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#dca54e]/20 to-black border border-[#dca54e]/30 flex items-center justify-center overflow-hidden">
                                            {msg.senderAvatar ? (
                                                <img src={msg.senderAvatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-[#dca54e]" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-[#0b101e] border border-white/10 flex items-center justify-center">
                                            <div className={cn("w-2 h-2 rounded-full", msg.isRead ? "bg-white/20" : "bg-emerald-500")} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[150px]">{msg.senderName || 'Anónimo'}</h4>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                            {msg.createdAt ? format(parseISO(msg.createdAt), "d MMM | h:mm a") : 'Terminal Local'}
                                        </p>
                                    </div>
                                </div>

                                {/* Message Content - Massive Area */}
                                <div className="flex-1 space-y-6">
                                    <div className="relative">
                                        <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic bg-white/5 p-5 md:p-8 rounded-xl md:rounded-[30px] border border-white/5">
                                            "{msg.content}"
                                        </p>
                                    </div>

                                    {/* Action Buttons - Tactile Relieve */}
                                    <div className="flex items-center justify-end gap-3">
                                        {!msg.isRead && (
                                            <button
                                                onClick={() => markMessageAsRead(msg.id)}
                                                className="h-10 px-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle2 size={14} /> Archivar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                            className={cn(
                                                "h-10 px-8 rounded-md text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg",
                                                replyingTo === msg.id 
                                                    ? "bg-white text-black" 
                                                    : "bg-[#dca54e] text-black shadow-[#dca54e]/20"
                                            )}
                                        >
                                            <Reply size={14} /> {replyingTo === msg.id ? 'Cerrar Terminal' : 'Abrir Respuesta'}
                                        </button>
                                    </div>

                                    {/* REPLY TERMINAL */}
                                    <AnimatePresence>
                                        {replyingTo === msg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="mt-6 p-6 rounded-[30px] bg-black border border-[#dca54e]/20 space-y-4"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Terminal size={12} className="text-[#dca54e]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#dca54e]">Terminal de Respuesta</span>
                                                </div>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Escribiendo protocolo de respuesta..."
                                                    className="w-full h-40 bg-white/5 border border-white/5 rounded-md p-6 text-sm font-medium focus:outline-none focus:border-[#dca54e]/50 transition-all resize-none text-white italic"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={async () => {
                                                            if (!replyText.trim()) return;
                                                            await sendCloudMessage({
                                                                senderId: currentUser.id,
                                                                receiverId: msg.senderId,
                                                                content: replyText,
                                                                isRead: false
                                                            });
                                                            setReplyText('');
                                                            setReplyingTo(null);
                                                            showNotification('Respuesta transmitida con éxito.', 'success');
                                                        }}
                                                        className="h-12 px-10 bg-gradient-to-r from-[#dca54e] to-[#b88636] text-black font-black uppercase tracking-widest text-[10px] rounded-md shadow-xl shadow-[#dca54e]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                                    >
                                                        Transmitir Protocolo <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    )
}
