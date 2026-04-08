'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
    Search, 
    FileDown, 
    Activity, 
    Shield, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DirectorySectionProps {
    members: any[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isExporting: boolean;
    handleExportDirectoryPDF: () => void;
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    itemsPerPage: number;
    onViewDetails: (member: any) => void;
}

export function DirectorySection({
    members,
    searchTerm,
    setSearchTerm,
    isExporting,
    handleExportDirectoryPDF,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    onViewDetails
}: DirectorySectionProps) {
    const filtered = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (m.member_group || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter out restricted/shared accounts by default unless searching specifically
        if (m.hide_from_membership_count && !searchTerm) return false;
        
        return matchesSearch;
    });
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <motion.div
            key="directory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <Card id="monitor-espiritual" className="glass-card border-none bg-black/40 p-8 md:p-12 mb-12 relative overflow-hidden group/monitor rounded-[3.5rem]">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="absolute top-0 right-0 p-8 flex gap-2 z-10">
                    <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">Modo Directorio Inteligente</div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            Directorio de <span className="text-primary italic">Perfiles</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-3 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" /> Evaluación de Condición Individual
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="BUSCAR NOMBRE O GRUPO..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-14 pl-14 bg-white/5 border-white/10 rounded-full focus:ring-primary/40 font-black tracking-widest text-[10px] uppercase"
                            />
                        </div>
                        <Button 
                            onClick={handleExportDirectoryPDF}
                            disabled={isExporting}
                            className="h-14 px-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-xl shadow-black/40"
                        >
                            {isExporting ? <Activity className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                            <span className="hidden lg:inline">Exportar Directorio</span>
                            <span className="lg:hidden">PDF</span>
                        </Button>
                    </div>
                </div>

                {/* Table for PDF */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <div id="printable-directory" className="p-12 bg-white text-black font-sans min-h-screen" style={{ width: '1100px' }}>
                        <div className="flex justify-between items-center mb-10 border-b-4 border-black pb-8">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">LLDM RODEO • DIRECTORIO MINISTERIAL</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Integral de Gestión Digital • Generado: {format(new Date(), 'eeee, dd MMMM yyyy - HH:mm', { locale: es })}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <div className="bg-black text-white px-4 py-2 text-[10px] font-black tracking-widest uppercase">Documento de Historial</div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Confidencial • Uso Exclusivo Ministro</p>
                            </div>
                        </div>

                        <table className="w-full text-left border-collapse border-2 border-black">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-black text-[9px] font-black uppercase tracking-widest">
                                    <th className="py-4 px-4 border-r border-black w-10 text-center">#</th>
                                    <th className="py-4 px-4 border-r border-black">Nombres y Apellidos</th>
                                    <th className="py-4 px-4 border-r border-black text-center">Grupo</th>
                                    <th className="py-4 px-4 border-r border-black text-center">Categoría</th>
                                    <th className="py-4 px-4 border-r border-black text-center">Teléfono / WhatsApp</th>
                                    <th className="py-4 px-4 text-center">Condición Actual</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px] font-bold uppercase">
                                {filtered.map((m, idx) => (
                                    <tr key={m.id} className={cn("border-b border-gray-300", idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                        <td className="py-3 px-4 border-r border-gray-300 text-center text-gray-400 font-mono">{idx + 1}</td>
                                        <td className="py-3 px-4 border-r border-gray-300 font-black text-black">{m.name}</td>
                                        <td className="py-3 px-4 border-r border-gray-300 text-center">{m.member_group || '—'}</td>
                                        <td className="py-3 px-4 border-r border-gray-300 text-center">{m.category || 'GENERAL'}</td>
                                        <td className="py-3 px-4 border-r border-gray-300 text-center font-mono">{m.phone || 'NO REGISTRADO'}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black border",
                                                m.status === 'Activo' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {m.status || 'INACTIVO'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {paginated.map((member) => {
                        const attendance = member.stats?.attendance && member.stats.attendance.total > 0 
                            ? Math.round((member.stats.attendance.attended/member.stats.attendance.total)*100) 
                            : 0;
                        
                        let condition = { label: 'ESTABLE', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
                        if (attendance < 60) condition = { label: 'CRÍTICO', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
                        else if (attendance < 85) condition = { label: 'PRECAUCIÓN', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };

                        return (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -12, scale: 1.02 }}
                                onClick={() => onViewDetails(member)}
                                className="p-8 bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 rounded-[3rem] flex flex-col gap-6 cursor-pointer transition-all group relative overflow-hidden shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className={cn(
                                    "absolute top-0 right-10 px-5 py-2 rounded-b-2xl border-x border-b shadow-2xl z-20 transition-all duration-500 group-hover:translate-y-1",
                                    condition.label === 'CRÍTICO' ? 'bg-red-600 animate-pulse' : 
                                    condition.label === 'PRECAUCIÓN' ? 'bg-orange-500' : 'bg-emerald-600',
                                    condition.border.replace('/20', '/50')
                                )}>
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.25em] italic leading-none drop-shadow-md">
                                        {condition.label}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white/5 bg-slate-900 group-hover:border-primary/40 transition-colors">
                                            {member.avatar ? (
                                                <img src={member.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/5 italic">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <h4 className="text-[15px] font-black text-foreground truncate group-hover:text-primary transition-all duration-300 italic tracking-tight leading-none mb-2">{member.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                                <span className="text-[8px] font-black tracking-[0.15em] text-muted-foreground uppercase">{member.member_group || 'General'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Asistencia</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-black text-white italic">{attendance}%</span>
                                            <div className="flex-grow bg-white/5 h-1 rounded-full overflow-hidden">
                                                <div className={cn("h-full transition-all duration-1000", attendance < 60 ? "bg-red-500" : attendance < 85 ? "bg-orange-500" : "bg-emerald-500")} style={{ width: `${attendance}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-center">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Privilegios</span>
                                        <span className="text-sm font-black text-white italic">{member.stats?.participation?.led || 0} veces</span>
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Ver Ficha Completa</span>
                                    <ChevronRight className="w-3 h-3 text-primary" />
                                </div>
                            </motion.div>
                        );
                    })}

                    {totalPages > 1 && (
                        <div className="col-span-full mt-16 flex flex-col items-center gap-8 py-10 relative z-10 transition-all">
                            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-5 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(1, prev - 1));
                                        document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="w-14 h-14 rounded-full border border-white/10 hover:bg-emerald-500/10 disabled:opacity-20 transition-all active:scale-90"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </Button>
                                
                                <div className="flex gap-4 px-6 overflow-visible relative z-30">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i + 1);
                                                document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={cn(
                                                "w-12 h-12 min-w-[48px] rounded-full text-[12px] font-black transition-all duration-500 border shrink-0 relative",
                                                currentPage === i + 1 
                                                    ? "bg-emerald-400 text-black border-emerald-300 shadow-[0_0_45px_rgba(52,211,153,0.8)] scale-125 animate-pulse ring-4 ring-emerald-400/20 z-50" 
                                                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:scale-110 z-40"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                        document.getElementById('monitor-espiritual')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="w-14 h-14 rounded-full border border-white/10 hover:bg-emerald-500/10 disabled:opacity-20 transition-all active:scale-90"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
