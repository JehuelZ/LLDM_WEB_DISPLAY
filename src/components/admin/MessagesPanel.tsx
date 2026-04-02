'use client';
import React, { useState } from 'react';
import { Mail, X, Send, Reply } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppSettings } from '@/lib/store';

export const MessagesPanel = ({
    messages,
    onMarkRead,
    onReply,
    settings
}: {
    messages: any[],
    onMarkRead: (id: string) => void,
    onReply: (recipientId: string, content: string) => Promise<void>,
    settings: AppSettings
}) => {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleSendReply = async (recipientId: string) => {
        if (!replyText.trim()) return;
        await onReply(recipientId, replyText);
        setReplyText('');
        setReplyingTo(null);
    };

    return (
        <Card className={cn(
            "card border-none relative overflow-hidden group transition-all duration-500",
            settings.adminTheme === 'primitivo' 
                ? "bg-[#101420] rounded-md border border-white/5 shadow-none" 
                : "bg-slate-900/60 rounded-none glass-card shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        )}>
            <div className={cn(
                "absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 pointer-events-none transition-all duration-700",
                settings.adminTheme === 'primitivo' ? "bg-transparent" : "bg-white/5"
            )} />
            <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="relative z-10 flex items-center gap-4 text-2xl font-black uppercase tracking-tighter text-foreground drop-shadow-sm w-full">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 flex items-center justify-center shadow-none transition-all",
                                    settings.adminTheme === 'primitivo' ? "bg-white/5 rounded-md border border-white/10" : "bg-white/5 rounded-none border border-white/10"
                                )}>
                                    <Mail className={cn("h-4 w-4", settings.adminTheme === 'primitivo' ? "text-white/70" : "text-white")} />
                                </div>
                                <span className="whitespace-nowrap text-foreground">inbox de <span className={cn("text-foreground underline underline-offset-8", settings.adminTheme === 'primitivo' ? "decoration-foreground/10" : "decoration-white/30")}>mensajes</span></span>
                            </div>
                            <div className={cn(
                                "flex-1 h-px ml-4",
                                settings.adminTheme === 'primitivo' ? "bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" : "bg-gradient-to-r from-white/20 via-white/5 to-transparent"
                            )} />
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-3 ml-1">comunicaciones de la congregación</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="grid grid-cols-1 gap-5 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-white/20">
                            <div className={cn(
                                "w-20 h-20 flex items-center justify-center mb-8 border transition-all",
                                settings.adminTheme === 'primitivo' ? "bg-white/[0.03] rounded-md border-white/5" : "bg-white/[0.02] border-white/5 rounded-none"
                            )}>
                                <Mail className={cn("h-10 w-10 opacity-5", settings.adminTheme === 'primitivo' ? "text-white" : "")} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">bandeja de entrada vacía</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={cn(
                                "group/msg p-6 border transition-all duration-500 relative overflow-hidden",
                                settings.adminTheme === 'primitivo'
                                    ? "bg-white/[0.02] border-white/5 rounded-md hover:bg-white/[0.04] scroll-m-2"
                                    : "bg-black/20 border-white/5 rounded-none hover:border-emerald-500/20 shadow-inner"
                            )}>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 flex items-center justify-center text-xs font-black",
                                            settings.adminTheme === 'primitivo' ? "bg-white/5 rounded-md text-white/50" : "bg-emerald-500/10 rounded-none text-emerald-500 border border-emerald-500/20"
                                        )}>
                                            {(msg.senderName || msg.sender_name)?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground">{msg.senderName || msg.sender_name}</p>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">
                                                {(() => {
                                                    const dateStr = msg.createdAt || msg.created_at;
                                                    if (!dateStr) return 'RECIENTE';
                                                    const d = new Date(dateStr);
                                                    if (isNaN(d.getTime())) return 'RECIENTE';
                                                    return d.toLocaleString().toUpperCase();
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                    {!(msg.isRead ?? msg.read) && (
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed px-1 relative z-10">{msg.content}</p>

                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5 relative z-10">
                                    <button
                                        onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all shadow-none",
                                            settings.adminTheme === 'primitivo' ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" : "bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10"
                                        )}
                                    >
                                        <Reply className="w-3 h-3" /> Responder
                                    </button>
                                    {!(msg.isRead ?? msg.read) && (
                                        <button
                                            onClick={() => onMarkRead(msg.id)}
                                            className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-500 transition-colors"
                                        >
                                            Marcar leido
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {replyingTo === msg.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                                        >
                                            <textarea
                                                className={cn(
                                                    "w-full h-24 p-4 text-xs bg-black/40 border-none rounded-md focus:ring-1 transition-all placeholder:text-slate-700 resize-none",
                                                    settings.adminTheme === 'primitivo' ? "focus:ring-white/10" : "focus:ring-emerald-500/30"
                                                )}
                                                placeholder="Escribe tu respuesta..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setReplyingTo(null)}
                                                    className="text-[9px] font-black uppercase tracking-widest text-slate-500"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSendReply(msg.senderId || msg.sender_id)}
                                                    className={cn(
                                                        "px-6 py-2 rounded-md text-[9px] font-black uppercase tracking-widest shadow-none",
                                                        settings.adminTheme === 'primitivo' ? "bg-white text-black hover:bg-white/90" : "bg-emerald-600 text-white hover:bg-emerald-500"
                                                    )}
                                                >
                                                    <Send className="w-3 h-3 mr-2" /> Enviar
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
