"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    Users, Activity, ShieldCheck, Flame, Search, Filter, 
    ShieldAlert, User, Mail, Edit2, Power, Trash2, Crown
} from 'lucide-react'
import { useAppStore, UserProfile } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TactileBadge } from '@/components/admin/TactileUI'
import { MemberProfileFicha } from '@/components/admin/MemberProfileFicha'

interface MiembrosTabProps {
    members: UserProfile[]
    searchTerm: string
    setSearchTerm: (val: string) => void
    memberFilter: string
    setMemberFilter: (val: string) => void
    setShowAddMember: (val: boolean) => void
    setEditingMember: (member: UserProfile | null) => void
}

export const MiembrosTab = ({
    members,
    searchTerm,
    setSearchTerm,
    memberFilter,
    setMemberFilter,
    setShowAddMember,
    setEditingMember
}: MiembrosTabProps) => {
    const {
        updateProfileInCloud,
        deleteMemberFromCloud,
        loadMembersFromCloud,
        showNotification
    } = useAppStore()

    const [isSaving, setIsSaving] = useState(false)
    const [selectedFichaMember, setSelectedFichaMember] = useState<UserProfile | null>(null)

    const pendingMembers = members.filter(m => m.status === 'Pendiente');

    return (
        <motion.div
            key="miembros"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Advanced Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        label: 'MEMBRESÍA TOTAL', 
                        value: members.length, 
                        sub: '+12 este mes',
                        icon: Users,
                        color: 'text-primary'
                    },
                    { 
                        label: 'ASISTENCIA PROM.', 
                        value: '88%', 
                        sub: 'Estable',
                        icon: Activity,
                        color: 'text-emerald-500' 
                    },
                    { 
                        label: 'MINISTROS', 
                        value: members.filter(m => m.role === 'Ministro a Cargo').length, 
                        sub: '3 en guardia',
                        icon: ShieldCheck,
                        color: 'text-emerald-500' 
                    },
                    { 
                        label: 'ACTIVIDAD', 
                        value: '94%', 
                        sub: 'Ritmo alto',
                        icon: Flame,
                        color: 'text-orange-500' 
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--tactile-card-bg)] border border-[var(--tactile-border)] p-6 rounded-md relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-md bg-[var(--tactile-item-hover)] border border-[var(--tactile-border)]", stat.color)}>
                                <stat.icon className="w-5 h-5 shadow-inner" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-[var(--tactile-text-sub)] uppercase tracking-widest">{stat.label}</span>
                                <span className="text-[8px] font-bold text-emerald-500 mt-0.5">{stat.sub}</span>
                            </div>
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-[var(--tactile-text)]">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--tactile-inner-bg-alt)]/50 border border-[var(--tactile-border)] rounded-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">DISTRIBUCIÓN DE MEMBRESÍA</h4>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Hermanos Adultos', count: members.filter(m => m.gender === 'Varon' && m.category === 'Varon').length, total: Math.max(1, members.length), color: 'bg-primary' },
                            { label: 'Hermanas Adultas', count: members.filter(m => m.gender === 'Hermana' && m.category === 'Hermana').length, total: Math.max(1, members.length), color: 'bg-pink-500' },
                            { label: 'Niños y Niñas', count: members.filter(m => m.category === 'Niño').length, total: Math.max(1, members.length), color: 'bg-emerald-500' },
                        ].map((bar, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[var(--tactile-text-sub)]">{bar.label}</span>
                                    <span className="text-[var(--tactile-text)]">{bar.count} <span className="text-[var(--tactile-text-sub)]/50">/ {bar.total}</span></span>
                                </div>
                                <div className="h-2 w-full bg-[var(--tactile-inner-bg-alt)] rounded-full overflow-hidden border border-[var(--tactile-border)]">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(bar.count / bar.total) * 100}%` }}
                                        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", bar.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] rounded-md p-8 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">SALUD LOCAL</h4>
                        <p className="text-[9px] font-medium text-[var(--tactile-text-sub)] uppercase tracking-widest leading-relaxed">Índice basado en asistencia y participación.</p>
                    </div>
                    <div className="flex items-baseline gap-2 my-6">
                        <span className="text-6xl font-black tracking-tighter text-[var(--tactile-text)]">A+</span>
                        <span className="text-xs font-black text-emerald-500 uppercase">Óptimo</span>
                    </div>
                    <button className="w-full py-4 bg-[var(--tactile-card-bg)] border border-[var(--tactile-border-strong)] rounded-md text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                        VER REPORTE DETALLADO
                    </button>
                </div>
            </div>

            {/* Pending Approvals */}
            {pendingMembers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--tactile-inner-bg)]/80 border border-emerald-500/20 rounded-md p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-md flex items-center justify-center border border-emerald-500/30">
                                <ShieldAlert className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter text-emerald-500 uppercase">AUDITORÍA DE SEGURIDAD</h3>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 mt-1">PROTOCOLO DE APROBACIÓN</p>
                            </div>
                        </div>
                        <TactileBadge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 px-6 py-2">
                            {pendingMembers.length} SOLICITUDES ACTIVAS
                        </TactileBadge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                        {pendingMembers.map((pending) => (
                            <div key={pending.id} className="bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] p-5 rounded-md space-y-4 hover:border-emerald-500/40 transition-all duration-300 group/audit-card relative overflow-hidden flex flex-col justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-11 shrink-0">
                                        <div className="relative w-full h-full rounded-md overflow-hidden border border-[var(--tactile-border-strong)] bg-[var(--tactile-inner-bg)]">
                                            {pending.avatar ? <img src={pending.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-emerald-500/40" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-foreground truncate uppercase tracking-tight mb-1">{pending.name}</p>
                                        <p className="text-[8px] text-foreground/20 truncate font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="w-2.5 h-2.5" />
                                            {pending.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        className="flex-1 h-9 bg-emerald-600 hover:bg-primary text-foreground text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all"
                                        disabled={isSaving}
                                        onClick={async () => {
                                            setIsSaving(true);
                                            await updateProfileInCloud(pending.id, { ...pending, status: 'Activo' } as any);
                                            await loadMembersFromCloud();
                                            setIsSaving(false);
                                            showNotification('Miembro aprobado', 'success');
                                        }}
                                    >
                                        APROBAR
                                    </button>
                                    <button 
                                        className="px-4 h-9 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-foreground text-[8px] font-black uppercase tracking-widest rounded-md transition-all"
                                        onClick={async () => {
                                            if (confirm(`¿ELIMINAR SOLICITUD DE ${pending.name.toUpperCase()}?`)) {
                                                setIsSaving(true);
                                                await deleteMemberFromCloud(pending.id);
                                                await loadMembersFromCloud();
                                                setIsSaving(false);
                                            }
                                        }}
                                    >
                                        RECHAZAR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Search & Actions Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
                <div className="w-full md:w-auto flex items-center gap-6">
                    <h2 className="text-4xl font-black tracking-tighter shrink-0">MIEMBROS <span className="text-muted-foreground/40">LOCALES</span></h2>
                    <div className="relative w-full max-w-md bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border-strong)] rounded-md p-1 shadow-2xl backdrop-blur-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="BUSCAR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent h-10 pl-12 pr-6 text-[10px] font-black tracking-[0.15em] text-foreground outline-none placeholder:text-foreground/20"
                        />
                    </div>
                </div>
                <button
                    onClick={() => { setEditingMember(null); setShowAddMember(true); }}
                    className="w-full md:w-auto bg-primary text-foreground h-11 px-8 rounded-md text-[10px] font-black tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-black/40"
                >
                    AGREGAR MIEMBRO
                </button>
            </div>

            {/* Filters Bar */}
            <div className="admin-member-filters-bar flex flex-wrap items-center gap-1.5 p-1 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md shadow-2xl overflow-hidden">
                {[
                    { id: 'all', label: 'TODOS LOS MIEMBROS', count: members.length },
                    { id: 'Administración', label: 'SIERVOS DE DIOS', count: members.filter(m => m.role === 'Administrador' || m.member_group === 'Administración').length },
                    { id: 'Casados', label: 'MATRIMONIOS', count: members.filter(m => m.member_group === 'Casados' || m.member_group === 'Casadas').length },
                    { id: 'Solos y Solas', label: 'SOLOS Y SOLAS', count: members.filter(m => m.member_group === 'Solos y Solas').length },
                    { id: 'Jovenes', label: 'JÓVENES', count: members.filter(m => m.member_group === 'Jovenes').length },
                    { id: 'Niños', label: 'NIÑOS / NIÑAS', count: members.filter(m => m.member_group === 'Niños' || m.member_group === 'Niñas').length },
                ].map(group => (
                    <button
                        key={group.id}
                        onClick={() => setMemberFilter(group.id)}
                        className={cn(
                            "px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            memberFilter === group.id 
                                ? "bg-primary text-foreground scale-[1.02]" 
                                : "text-foreground/40 hover:text-foreground hover:bg-[var(--tactile-item-hover)]"
                        )}
                    >
                        {group.label} <span className="opacity-40 text-[8px] ml-1">{group.count}</span>
                    </button>
                ))}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {members
                    .filter(m => {
                        const normalize = (text: string) => (text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        const searchNormalized = normalize(searchTerm);
                        const nameMatch = normalize(m.name).includes(searchNormalized);
                        const emailMatch = normalize(m.email).includes(searchNormalized);
                        const matchesSearch = nameMatch || emailMatch;

                        if (!matchesSearch) return false;

                        if (memberFilter === 'all') return true;
                        if (memberFilter === 'Administración') return m.role === 'Administrador' || m.member_group === 'Administración';
                        if (memberFilter === 'Casados') return m.member_group === 'Casados' || m.member_group === 'Casadas';
                        if (memberFilter === 'Niños') return m.member_group === 'Niños' || m.member_group === 'Niñas';
                        return m.member_group === memberFilter;
                    })
                    .map(member => {
                        const canViewFicha = member.status === 'Activo' && !member.hide_from_attendance && member.role !== 'Administrador';
                        return (
                        <div 
                            key={member.id} 
                            onClick={(e) => {
                                // Prevent triggering if clicking on action buttons
                                if ((e.target as HTMLElement).closest('button')) return;
                                if (canViewFicha) {
                                    setSelectedFichaMember(member);
                                }
                            }}
                            className={cn(
                                "group bg-[var(--tactile-inner-bg-alt)] border border-[var(--tactile-border)] p-6 rounded-md flex items-center gap-6 transition-all duration-500 relative overflow-hidden",
                                canViewFicha ? "cursor-pointer hover:border-emerald-400/30" : "hover:border-white/10"
                            )}
                        >
                            <div className="relative shrink-0 z-10">
                                <div className={cn(
                                    "w-20 h-20 rounded-md border transition-all duration-500 group-hover:scale-105 bg-[var(--tactile-inner-bg)] p-1 overflow-hidden",
                                    member.status === 'Activo' ? "border-emerald-500/30 bg-primary/10" : "border-[var(--tactile-border-strong)]"
                                )}>
                                    <img 
                                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                                        className="w-full h-full object-cover rounded-md" 
                                        alt={member.name} 
                                    />
                                </div>
                                {member.role === 'Administrador' && (
                                    <div className="absolute -top-1 -left-1 w-8 h-8 bg-[#EFB722] rounded-full border-2 border-[#101420] flex items-center justify-center z-20">
                                        <Crown className="w-4 h-4 text-black" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 z-10">
                                <h4 className="text-lg font-black text-foreground truncate uppercase tracking-tight leading-none mb-1">{member.name}</h4>
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <TactileBadge className={cn(
                                        "px-2.5 py-0.5",
                                        (member.role === 'Administrador' || member.role === 'Ministro a Cargo')
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                            : "bg-primary/10 border-emerald-500/30 text-emerald-400"
                                    )}>
                                        {member.role === 'Administrador' ? 'ADMIN' : member.role}
                                    </TactileBadge>
                                    <TactileBadge className="bg-slate-400/10 border-slate-400/20 text-gray-300">
                                        {member.member_group}
                                    </TactileBadge>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button 
                                    onClick={() => { setEditingMember(member); setShowAddMember(true); }}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/40 hover:text-foreground transition-all border border-[var(--tactile-border)]"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={async () => {
                                        setIsSaving(true);
                                        await updateProfileInCloud(member.id, { 
                                            status: member.status === 'Activo' ? 'Inactivo' : 'Activo' 
                                        });
                                        await loadMembersFromCloud();
                                        setIsSaving(false);
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-foreground/40 hover:text-foreground"
                                >
                                    <Power className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm(`¿ELIMINAR A ${member.name.toUpperCase()}?`)) {
                                            setIsSaving(true);
                                            await deleteMemberFromCloud(member.id);
                                            await loadMembersFromCloud();
                                            setIsSaving(false);
                                        }
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-foreground/40 hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )})}
            </div>

            {selectedFichaMember && (
                <MemberProfileFicha 
                    member={selectedFichaMember} 
                    onClose={() => setSelectedFichaMember(null)} 
                />
            )}
        </motion.div>
    )
}
