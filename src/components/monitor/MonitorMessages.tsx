'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CheckCircle, Reply, Send } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MonitorMessages() {
    const { messages, markMessageAsRead, sendCloudMessage, currentUser } = useAppStore();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // Filter messages for Responsable de Asistencia
    const myMessages = messages.filter(m => m.targetRole === 'Responsable de Asistencia' || m.receiverId === currentUser?.id);

    const handleSendReply = async (receiverId: string) => {
        if (!replyText.trim() || !currentUser) return;
        await sendCloudMessage({
            senderId: currentUser.id,
            receiverId: receiverId,
            content: replyText,
            isRead: false
        });
        setReplyText('');
        setReplyingTo(null);
        alert('Respuesta enviada correctamente.');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="col-span-1 md:col-span-12">
                <Card className="glass-card border-l-4 border-l-primary/50 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Mail className="w-48 h-48" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">
                            <Mail className="h-8 w-8 text-primary" /> Buzón de Mensajes
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400">
                            Mensajería Segura y Privada para Control de Asistencia
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {myMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                    <Mail className="h-16 w-16 opacity-20 mb-6" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">No tienes mensajes nuevos</p>
                                </div>
                            ) : (
                                myMessages.map(msg => (
                                    <div key={msg.id} className={cn(
                                        "p-5 rounded-3xl border transition-all flex flex-col gap-4 relative group overflow-hidden",
                                        msg.isRead
                                            ? "bg-foreground/[0.02] border-white/5 opacity-80"
                                            : "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-sm font-black uppercase shadow-inner">
                                                    {msg.senderName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white text-base md:text-lg italic flex items-center gap-2">
                                                        {msg.senderName || 'Usuario'}
                                                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{new Date(msg.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!msg.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => markMessageAsRead(msg.id)}
                                                        className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl hover:bg-primary/10"
                                                        title="Marcar como leído"
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                                    className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl hover:bg-primary/10"
                                                    title="Responder"
                                                >
                                                    <Reply className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                                            <p className="text-sm md:text-base text-slate-300 leading-relaxed">{msg.content}</p>
                                        </div>

                                        {replyingTo === msg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 space-y-3 p-5 bg-primary/10 rounded-2xl border border-primary/20"
                                            >
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder={`Escribe aquí tu respuesta para ${msg.senderName}...`}
                                                    className="w-full h-28 bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-medium"
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <Button size="sm" variant="ghost" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white" onClick={() => setReplyingTo(null)}>Cancelar</Button>
                                                    <Button size="sm" className="h-10 bg-primary text-black hover:bg-primary/90 text-[10px] font-black uppercase px-6 rounded-xl shadow-lg shadow-primary/20" onClick={() => handleSendReply(msg.senderId)}>
                                                        <Send className="w-4 h-4 mr-2" /> Enviar Respuesta
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
