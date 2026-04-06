'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Shield, Clock, Send, Search, Filter, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntercessionRequest {
    id: string;
    memberName: string;
    memberAvatar?: string;
    group: string;
    content: string;
    status: 'urgent' | 'regular' | 'answered';
    category: 'Salud' | 'Fortaleza' | 'Acción de Gracias' | 'Familiar';
    createdAt: string;
}

export default function SoulIntercession({ requests }: { requests: IntercessionRequest[] }) {
    const [filter, setFilter] = React.useState<'all' | 'urgent' | 'answered'>('all');

    const filtered = requests.filter(r => {
        if (filter === 'urgent') return r.status === 'urgent';
        if (filter === 'answered') return r.status === 'answered';
        return true;
    });

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* --- HEADER CONTROLS --- */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-white/60">Buzón de Intercesión</h3>
                <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <button 
                        onClick={() => setFilter('all')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'all' ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        Todas
                    </button>
                    <button 
                        onClick={() => setFilter('urgent')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'urgent' ? "bg-ruby-500/20 text-ruby-400" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        Urgentes
                    </button>
                    <button 
                        onClick={() => setFilter('answered')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'answered' ? "bg-emerald-500/20 text-emerald-400" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        Atendidas
                    </button>
                </div>
            </div>

            {/* --- REQUESTS WALL --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-4 no-scrollbar">
                <AnimatePresence mode="popLayout">
                    {filtered.map((req, idx) => (
                        <motion.div
                            key={req.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className={cn(
                                "tactile-card p-6 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all",
                                req.status === 'urgent' ? "border-ruby-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]" : "border-white/5"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/5 flex items-center justify-center overflow-hidden">
                                        <Heart className={cn("w-5 h-5", req.status === 'urgent' ? "text-ruby-500" : "text-blue-400")} />
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] font-black uppercase italic tracking-tighter text-white">{req.memberName}</h5>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-2.5 h-2.5 text-white/20" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{req.group}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border",
                                    req.status === 'urgent' ? "bg-ruby-500/10 text-ruby-400 border-ruby-500/20" : 
                                    req.status === 'answered' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                    "bg-white/5 text-white/40 border-white/10"
                                )}>
                                    {req.status === 'urgent' ? '● Crítico' : req.status === 'answered' ? 'Atendida' : 'En Oración'}
                                </div>
                            </div>

                            <div className="disjointed-line" />

                            <div className="flex-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold leading-relaxed text-white/80 italic">"{req.content}"</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-white/20" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{req.createdAt}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="h-8 px-4 rounded-xl bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20 transition-all">
                                        Llevar al Altar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- QUICK ACTION BAR --- */}
            <div className="mt-auto pt-6">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="NOTA RÁPIDA DE INTERCESIÓN..."
                        className="w-full h-14 bg-white/[0.04] border border-white/5 rounded-3xl px-8 pr-16 text-[10px] font-black tracking-widest placeholder:text-white/10 outline-none focus:border-emerald-500/20 transition-all italic"
                    />
                    <button className="absolute right-2 top-2 w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
