'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, 
    FileDown, 
    Activity, 
    Shield, 
    Calendar, 
    Settings, 
    LayoutDashboard 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatBarChart, StatDoughnut } from './Charts';

interface MemberDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: any;
    isExporting: boolean;
    onExportIndividualPDF: (member: any) => void;
    onUpdateBio: (memberId: string, bio: string) => Promise<void>;
}

export function MemberDetailModal({ 
    isOpen, 
    onClose, 
    member: selectedMember, 
    isExporting, 
    onExportIndividualPDF,
    onUpdateBio
}: MemberDetailModalProps) {
    if (!selectedMember) return null;

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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0c0c0c] border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12"
                    >
                        <div className="absolute right-8 top-8 flex items-center gap-4">
                            <Button
                                onClick={() => onExportIndividualPDF(selectedMember)}
                                disabled={isExporting}
                                className="h-12 px-8 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/40 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-xl shadow-black/40 transition-all active:scale-95"
                            >
                                {isExporting ? <Activity className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                <span className="hidden sm:inline">Descargar Ficha PDF</span>
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="w-12 h-12 rounded-full hover:bg-white/10"
                            >
                                <ArrowLeft className="w-6 h-6 text-muted-foreground rotate-180" />
                            </Button>
                        </div>

                        {/* --- TEMPLATE OCULTO PARA FICHA INDIVIDUAL (PDF) --- */}
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                            <div id={`printable-card-${selectedMember.id}`} className="w-[850px] p-12 bg-white text-black font-sans" style={{ minHeight: '1100px' }}>
                                {/* Header de la Ficha */}
                                <div className="flex items-center gap-10 mb-12 border-b-[6px] border-black pb-12">
                                    <div className="w-44 h-44 bg-gray-100 border-[6px] border-black rounded-[3rem] overflow-hidden flex items-center justify-center shadow-lg">
                                        {selectedMember.avatar ? (
                                            <img src={selectedMember.avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-7xl font-black text-gray-300 italic">{selectedMember.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Registro de Membresía Rodeo v3.0</div>
                                            <div className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest leading-none">Confidencial</div>
                                        </div>
                                        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">{selectedMember.name}</h1>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="border-2 border-black px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.member_group}</div>
                                            <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-200 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.status}</div>
                                            <div className="bg-gray-100 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">{selectedMember.category}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid de Información Técnica */}
                                <div className="grid grid-cols-2 gap-12 mb-16">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block">Información de Contacto</h3>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 text-[12px]">
                                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">WhatsApp</span>
                                                <span className="font-black font-mono">{selectedMember.phone || 'NO REGISTRADO'}</span>
                                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Género</span>
                                                <span className="font-black uppercase">{selectedMember.gender || '—'}</span>
                                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Categoría</span>
                                                <span className="font-black uppercase">{selectedMember.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block">Métricas de Crecimiento</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col items-center">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Asistencia</span>
                                                    <span className="text-2xl font-black">{selectedMember.stats?.attendance?.attended || 0} / {selectedMember.stats?.attendance?.total || 0}</span>
                                                    <span className="text-[10px] font-bold text-emerald-600 mt-1">{selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}%</span>
                                                </div>
                                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col items-center">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Participación</span>
                                                    <span className="text-2xl font-black">{selectedMember.stats?.participation?.led || 0}</span>
                                                    <span className="text-[10px] font-bold text-primary mt-1">Liderazgo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bitácora Ministerial */}
                                <div className="bg-gray-100/50 border-2 border-dashed border-gray-300 p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Settings className="w-24 h-24 rotate-12" />
                                    </div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Bitácora de Evolución Espiritual (Privada)
                                    </h3>
                                    <div className="text-[12px] font-medium leading-[1.8] text-gray-600 italic whitespace-pre-wrap min-h-[150px]">
                                        {selectedMember.bio || 'Sin anotaciones recientes. Este perfil mantiene su condición activa bajo supervisión ministerial constante para el fortalecimiento de su fe y participación en la obra.'}
                                    </div>
                                </div>

                                {/* Footer de la Ficha */}
                                <div className="mt-auto pt-12 border-t border-gray-200 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black">Propiedad de LLDM Rodeo • California</p>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">Documento verificado digitalmente vía Hash SHA-256</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-1">Certificado de Autenticidad Ministral</div>
                                        <p className="text-[9px] font-black uppercase text-black leading-none italic">Emitido: {format(new Date(), 'eeee, dd MMMM yyyy - HH:mm', { locale: es })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Cabecera Modal */}
                            <div className="lg:col-span-12 flex flex-col md:flex-row items-center gap-8 mb-6">
                                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 bg-slate-900 shadow-2xl">
                                    {selectedMember.avatar ? (
                                        <img src={selectedMember.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/5 italic">
                                            {selectedMember.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                                        <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
                                            {selectedMember.name}
                                        </h3>
                                        <span className={cn(
                                            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                                            selectedMember.status === 'Activo' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                        )}>
                                            {selectedMember.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-primary italic opacity-70">
                                        Ficha Técnica Espiritual • {selectedMember.member_group}
                                    </p>
                                </div>
                            </div>

                            {/* Contenido Modal - Grid Principal */}
                            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Columna Izquierda: Gráficas High-Fidelity */}
                                <div className="lg:col-span-2 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
                                        <StatBarChart
                                            percent={selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}
                                            label="Asistencia Mes"
                                            value={selectedMember.stats?.attendance?.attended || 0}
                                            total={selectedMember.stats?.attendance?.total || 0}
                                            gradientId="blue"
                                        />
                                        <StatDoughnut
                                            percent={selectedMember.stats?.participation && selectedMember.stats.participation.total > 0 ? Math.round((selectedMember.stats.participation.led/selectedMember.stats.participation.total)*100) : 0}
                                            label="Participación"
                                            value={selectedMember.stats?.participation?.led || 0}
                                            total={selectedMember.stats?.participation?.total || 0}
                                            gradientId="purple"
                                        />
                                        <StatDoughnut
                                            percent={selectedMember.stats?.punctuality || 0}
                                            label="Puntualidad"
                                            value={selectedMember.stats?.punctuality || 0}
                                            total={100}
                                            gradientId="orange"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem]">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-purple-400" />
                                                <h4 className="text-purple-400 font-black uppercase tracking-widest text-xs">Agenda Ministerial</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {selectedMember.responsibilities && selectedMember.responsibilities.length > 0 ? (
                                                    selectedMember.responsibilities.map((resp: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-black/20 border border-white/5">
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-bold text-xs">{resp.label}</span>
                                                                <span className="text-slate-500 font-black text-[9px] uppercase tracking-widest leading-none mt-1">{resp.type}</span>
                                                            </div>
                                                            <span className="text-purple-400 font-black text-[10px] tabular-nums">{resp.date}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[10px] text-muted-foreground italic text-center py-6">Sin privilegios próximos asignados.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem]">
                                            <div className="flex items-center gap-3">
                                                <Activity className="w-5 h-5 text-emerald-500" />
                                                <h4 className="text-emerald-500 font-black uppercase tracking-widest text-xs">Historial de Actividad</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400 font-light">Servicios este mes:</span>
                                                    <span className="text-white font-bold">{selectedMember.stats?.attendance?.attended || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400 font-light">Promedio General:</span>
                                                    <span className="text-white font-bold">
                                                        {(selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-black/40 rounded-full h-1.5 mt-2 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500 transition-all duration-1000" 
                                                        style={{ width: `${selectedMember.stats?.attendance && selectedMember.stats.attendance.total > 0 ? Math.round((selectedMember.stats.attendance.attended/selectedMember.stats.attendance.total)*100) : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha Modal: Detalles de Perfil */}
                                <div className="space-y-8 flex flex-col">
                                    <div className="p-8 bg-black/20 border border-white/5 rounded-[2.5rem] flex-grow">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                            <LayoutDashboard className="w-3 h-3" /> Datos del Miembro
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Categoría</span>
                                                <span className="text-xs font-bold text-white uppercase italic">{selectedMember.category}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Género</span>
                                                <span className="text-xs font-bold text-white uppercase italic">{selectedMember.gender}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">WhatsApp / Teléfono</span>
                                                <span className="text-xs font-bold text-white italic">{selectedMember.phone || '—'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">Bitácora Pastoral (Privada)</span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                        <span className="text-[7px] font-bold text-primary/40 uppercase tracking-tighter">Sincronización Ministerial</span>
                                                    </div>
                                                </div>
                                                <textarea 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-foreground font-medium leading-relaxed italic resize-none min-h-[120px] focus:border-primary/40 focus:ring-0 transition-all placeholder:text-muted-foreground/20"
                                                    placeholder="Escriba aquí notas de supervisión, visitas o seguimiento espiritual..."
                                                    defaultValue={selectedMember.bio || ''}
                                                    onBlur={async (e) => {
                                                        const val = e.target.value;
                                                        if (val !== selectedMember.bio) {
                                                            await onUpdateBio(selectedMember.id, val);
                                                        }
                                                    }}
                                                />
                                                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-2 text-right">Las notas se guardan automáticamente al salir del campo</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl text-center">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic mb-1">Perfil Ministerial Protegido</p>
                                        <p className="text-[9px] font-bold text-primary/60 uppercase">Edición técnica restringida al administrador</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
