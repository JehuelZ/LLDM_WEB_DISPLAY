'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Filter, MessageSquare, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member {
    id: string;
    name: string;
    status: string;
    last_attendance: string;
    fervor: 'high' | 'medium' | 'low';
}

export default function VigilanceRadar({ members }: { members: Member[] }) {
    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<'all' | 'at_risk' | 'constant'>('all');

    const filtered = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        if (filter === 'at_risk') return matchesSearch && m.fervor === 'low';
        if (filter === 'constant') return matchesSearch && m.fervor === 'high';
        return matchesSearch;
    });

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                        type="text" 
                        placeholder="BUSCAR HERMANA/O EN RADAR..."
                        className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-12 text-xs font-bold tracking-widest placeholder:text-white/10 focus:border-white/20 focus:bg-white/[0.04] transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <button 
                        onClick={() => setFilter('all')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'all' ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        TODOS
                    </button>
                    <button 
                        onClick={() => setFilter('at_risk')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'at_risk' ? "bg-ruby-500/20 text-ruby-400" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        EN RIESGO
                    </button>
                    <button 
                        onClick={() => setFilter('constant')}
                        className={cn(
                            "px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'constant' ? "bg-emerald-500/20 text-emerald-400" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        CONSTANTES
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 no-scrollbar space-y-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((member, idx) => (
                        <motion.div 
                            key={member.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="tactile-card flex items-center justify-between group py-4 px-6 hover:bg-white/[0.03] border-white/5"
                        >
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/5 flex items-center justify-center overflow-hidden">
                                        <User className="w-7 h-7 text-white/20" />
                                    </div>
                                    <div className={cn(
                                        "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black",
                                        member.fervor === 'high' ? "bg-emerald-500" : 
                                        member.fervor === 'medium' ? "bg-gold-500" : "bg-ruby-500"
                                    )} style={{ filter: 'drop-shadow(0 0 5px currentColor)' }} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{member.name}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                                        ÚLTIMA ASISTENCIA: <span className="text-white/40">{member.last_attendance}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all flex items-center justify-center">
                                    <Phone className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
