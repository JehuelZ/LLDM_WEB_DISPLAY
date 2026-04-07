'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, MessageSquare, Phone, LayoutGrid, List, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member {
    id: string;
    name: string;
    status: string;
    last_attendance: string;
    fervor: 'high' | 'medium' | 'low';
    group?: string; // New field for Prayer Group
}

export default function VigilanceRadar({ members }: { members: Member[] }) {
    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<'all' | 'at_risk' | 'constant'>('all');
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

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
                
                {/* View Mode Toggle (Windows 11 Style) */}
                <div className="flex gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl mr-2">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                            viewMode === 'grid' ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
                        )}
                        title="Vista Mosaico"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                            viewMode === 'list' ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
                        )}
                        title="Vista Excel"
                    >
                        <List className="w-4 h-4" />
                    </button>
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

            <div className="flex-1 overflow-y-auto pr-4 no-scrollbar">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-20 bg-white/[0.01] border border-white/5 rounded-[3rem] border-dashed">
                        <Search className="w-16 h-16 mb-6 animate-pulse text-white/40" />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Radar Despejado</h3>
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] mt-4 text-white/60">No se encontraron miembros en este sector de vigilancia</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{member.name}</h4>
                                                {member.group && (
                                                    <span className="text-[7px] font-black bg-white/5 px-2 py-0.5 rounded-full text-white/40 border border-white/5">{member.group}</span>
                                                )}
                                            </div>
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
                ) : (
                    /* --- VISTA EXCEL (TABLA DENSA) --- */
                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/5">
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Miembro / Fervor</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Última Asistencia</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Grupo</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((member, idx) => (
                                        <motion.tr 
                                            key={member.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                                                            <User className="w-4 h-4 text-white/20" />
                                                        </div>
                                                        <div className={cn(
                                                            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black",
                                                            member.fervor === 'high' ? "bg-emerald-500" : 
                                                            member.fervor === 'medium' ? "bg-gold-500" : "bg-ruby-500"
                                                        )} />
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">{member.last_attendance}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-white/20" />
                                                    <span className="text-[10px] font-black uppercase opacity-60">{member.group || 'SIN GRUPO'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
