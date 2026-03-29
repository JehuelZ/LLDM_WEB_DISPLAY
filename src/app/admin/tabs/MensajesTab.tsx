"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    MessageSquare, CheckCircle, Reply, CheckCircle2, User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
    TactileGlassCard 
} from '@/components/admin/TactileUI'
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
            key="mensajes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            <div className="col-span-1 md:col-span-12 px-4">
                <h2 className="text-4xl font-black capitalize tracking-tighter mb-8 group">Buzón de <span className="text-primary group-hover:text-muted-foreground transition-colors">Mensajes Admin</span></h2>
            </div>

            <div className="col-span-1 md:col-span-12 space-y-4">
                {adminMessages.length === 0 ? (
                    <TactileGlassCard className="py-20 flex flex-col items-center justify-center opacity-40">
                        <MessageSquare className="w-20 h-20 mb-6" />
                        <p className="text-sm font-black capitalize tracking-[0.3em]">No hay mensajes para el administrador</p>
                    </TactileGlassCard>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {adminMessages.map(msg => (
                            <div key={msg.id} className={cn(
                                "tactile-glass-panel p-6 border-l-4 transition-all",
                                msg.isRead ? "border-l-[var(--tactile-border-strong)] opacity-70" : "border-l-primary bg-primary/5 active:scale-[0.99]"
                            )}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--tactile-item-hover)] border border-[var(--tactile-border-strong)] flex items-center justify-center text-primary text-sm font-black capitalize shadow-inner">
                                            {msg.senderName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-foreground text-lg flex items-center gap-2">
                                                {msg.senderName || 'Usuario'}
                                                {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                            </h4>
                                            <span className="text-[10px] text-muted-foreground capitalize font-bold tracking-widest">{msg.createdAt ? format(parseISO(msg.createdAt), "d MMM, h:mm a") : 'Ahora'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!msg.isRead && (
                                            <button
                                                onClick={() => markMessageAsRead(msg.id)}
                                                className="w-10 h-10 rounded-xl bg-[var(--tactile-item-hover)] border border-[var(--tactile-border-strong)] flex items-center justify-center text-emerald-400 hover:bg-primary/20 transition-all font-black text-xs"
                                                title="Marcar como leído"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                            className="w-10 h-10 rounded-xl bg-[var(--tactile-item-hover)] border border-[var(--tactile-border-strong)] flex items-center justify-center text-primary hover:bg-primary/20 transition-all font-black text-xs"
                                            title="Responder"
                                        >
                                            <Reply className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[var(--tactile-inner-bg)]/60 p-5 rounded-xl border border-[var(--tactile-border)] shadow-inner mb-4">
                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                <AnimatePresence>
                                    {replyingTo === msg.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 space-y-4">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder={`Escribe tu respuesta para ${msg.senderName}...`}
                                                    className="w-full h-32 bg-[var(--tactile-inner-bg-alt)] border border-primary/20 rounded-xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all resize-none shadow-inner text-[var(--tactile-text)]"
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-6 h-12 rounded-xl text-[10px] font-black capitalize tracking-widest text-muted-foreground hover:text-foreground"
                                                    >
                                                        CANCELAR
                                                    </button>
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
                                                            showNotification('Respuesta enviada.', 'success');
                                                        }}
                                                        className="px-8 h-12 bg-amber-500 text-black rounded-xl text-[10px] font-black capitalize tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        ENVIAR RESPUESTA
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
