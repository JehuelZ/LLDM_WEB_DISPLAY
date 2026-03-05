
'use client';

import { useState, useEffect, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    ShieldCheck,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Calendar,
    Activity,
    ClipboardCheck,
    Star,
    Music,
    Baby,
    X,
    Save,
    Trash2,
    Edit2,
    Camera
} from "lucide-react";
import { cn } from '@/lib/utils';
import { ImageEditor } from '@/components/ImageEditor';
import { useAppStore } from '@/lib/store';

// --- Components ---

const StatDoughnut = ({
    percent,
    label,
    value,
    total,
    color = "primary",
    size = 120
}: {
    percent: number;
    label: string;
    value: number | string;
    total: number | string;
    color?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'amber' | 'cyan';
    size?: number;
}) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const colorMap = {
        primary: "stroke-blue-500",
        secondary: "stroke-purple-500",
        accent: "stroke-pink-500",
        emerald: "stroke-emerald-500",
        amber: "stroke-amber-500",
        cyan: "stroke-cyan-500"
    };

    const glowMap = {
        primary: "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        secondary: "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
        accent: "drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
        emerald: "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        amber: "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        cyan: "drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
    };

    return (
        <div className="flex flex-col items-center gap-2 group transition-transform duration-300 hover:scale-105">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-foreground/5"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", colorMap[color], glowMap[color])}
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
                    <span className="text-xl font-black text-foreground">{percent}%</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{value}/{total}</span>
                </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {label}
            </span>
        </div>
    );
};

// --- Interfaces ---

interface MemberStats {
    attendance: { attended: number; total: number };
    participation: { led: number; total: number };
    punctuality: number;
}

interface Member {
    id: string;
    name: string;
    role: 'Miembro' | 'Responsable' | 'Administrador';
    gender: 'Varon' | 'Hermana';
    member_group?: 'Casados' | 'Casadas' | 'Solos y Solas' | 'Jovenes' | 'Niños' | 'Niñas' | 'Administración';
    email: string;
    phone: string;
    status: 'Activo' | 'Inactivo';
    lastActive: string;
    stats?: MemberStats;
    avatarUrl?: string;
    privileges: ('monitor' | 'choir' | 'leader' | 'kids_leader' | 'kids_helper')[];
    parentName?: string;
    is_pre_registered?: boolean;
}

const INITIAL_MEMBERS: Member[] = [
    {
        id: '1', name: 'Abraham Diaz', role: 'Responsable', gender: 'Varon', member_group: 'Casados', email: 'abraham.d@lldm.org', phone: '123-456-7890', status: 'Activo', lastActive: 'Hoy',
        stats: { attendance: { attended: 85, total: 90 }, participation: { led: 12, total: 15 }, punctuality: 98 },
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        privileges: ['leader']
    },
    {
        id: '2', name: 'María Garcia', role: 'Miembro', gender: 'Hermana', member_group: 'Casadas', email: 'maria.g@gmail.com', phone: '987-654-3210', status: 'Activo', lastActive: 'Ayer',
        stats: { attendance: { attended: 70, total: 90 }, participation: { led: 2, total: 5 }, punctuality: 92 },
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        privileges: ['monitor']
    },
    {
        id: '3', name: 'Samuel Rojas', role: 'Miembro', gender: 'Varon', member_group: 'Jovenes', email: 'samuel.r@yahoo.com', phone: '555-0199', status: 'Activo', lastActive: 'Hace 3 días',
        stats: { attendance: { attended: 45, total: 90 }, participation: { led: 0, total: 5 }, punctuality: 85 },
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        privileges: ['choir']
    },
    {
        id: '4', name: 'Esther Lopez', role: 'Miembro', gender: 'Hermana', member_group: 'Solos y Solas', email: 'esther.l@gmail.com', phone: '444-555-6666', status: 'Activo', lastActive: 'Hace 2 horas',
        stats: { attendance: { attended: 88, total: 90 }, participation: { led: 8, total: 10 }, punctuality: 95 },
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        privileges: []
    },
    {
        id: '5', name: 'Samuelito Rojas Jr.', role: 'Miembro', gender: 'Varon', member_group: 'Niños', email: 'samuelito.jr@lldm.org', phone: '555-KIDS', status: 'Activo', lastActive: 'Hoy',
        stats: { attendance: { attended: 12, total: 12 }, participation: { led: 4, total: 4 }, punctuality: 100 },
        avatarUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&h=200&fit=crop',
        privileges: [],
        parentName: 'Samuel Rojas'
    },
];

export default function MembersPage() {
    const {
        members, loadMembersFromCloud,
        updateProfileInCloud, uploadAvatar,
        addMemberToCloud,
        isLoading: isStoreLoading
    } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedMember, setExpandedMember] = useState<string | null>(null);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [memberModal, setMemberModal] = useState<{ mode: 'new' | 'edit', data: Member } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadMembersFromCloud();
    }, [loadMembersFromCloud]);

    if (!mounted) return null;

    const dataURLtoFile = (dataurl: string, filename: string) => {
        let arr = dataurl.split(','),
            match = arr[0].match(/:(.*?);/),
            mime = match ? match[1] : 'image/jpeg',
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const BLANK_MEMBER: Member = {
        id: '',
        name: '',
        role: 'Miembro',
        gender: 'Varon',
        member_group: 'Jovenes',
        email: '',
        phone: '',
        status: 'Activo',
        lastActive: 'Nunca',
        stats: { attendance: { attended: 0, total: 0 }, participation: { led: 0, total: 0 }, punctuality: 0 },
        privileges: []
    };

    const filteredMembers = members.filter((m: Member) => {
        const nameMatch = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
    });

    // Global Stats for Admin
    const globalAttendance = members.length > 0 ? Math.round(members.reduce((acc, m) => {
        const total = m.stats?.attendance?.total || 0;
        const attended = m.stats?.attendance?.attended || 0;
        return acc + (total > 0 ? attended / total : 0);
    }, 0) / members.length * 100) : 0;

    const globalParticipation = members.length > 0 ? Math.round(members.reduce((acc, m) => {
        const total = m.stats?.participation?.total || 0;
        const led = m.stats?.participation?.led || 0;
        return acc + (total > 0 ? led / total : 0);
    }, 0) / members.length * 100) : 0;

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        Gestión de Miembros
                    </h2>
                    <p className="text-muted-foreground font-medium">Administre y organice la iglesia de LLDM RODEO</p>
                </div>
                <Button
                    className="neon-button gap-2 scale-105 transition-transform hover:scale-110 active:scale-95"
                    onClick={() => setMemberModal({ mode: 'new', data: { ...BLANK_MEMBER, id: Math.random().toString(36).substr(2, 9) } })}
                >
                    <UserPlus className="h-4 w-4" />
                    Nuevo Miembro
                </Button>
            </div>

            {/* Admin Overview Stats */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <Card className="glass-card bg-primary/5 border-primary/20 p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-1">Asistencia Global</p>
                        <h3 className="text-3xl font-black text-foreground italic">{globalAttendance}%</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp className="h-3 w-3 text-emerald-500" /> +2% VS MES PASADO
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={globalAttendance} label="" value="" total="" size={80} color="primary" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                </Card>

                <Card className="glass-card bg-secondary/5 border-secondary/20 p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary/80 mb-1">Participación</p>
                        <h3 className="text-3xl font-black text-foreground italic">{globalParticipation}%</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-bold lowercase">
                            RESPONSABLES DE ORACIÓN
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={globalParticipation} label="" value="" total="" size={80} color="secondary" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />
                </Card>

                <Card className="glass-card bg-accent/5 border-accent/20 p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent/80 mb-1">Crecimiento</p>
                        <h3 className="text-3xl font-black text-foreground italic">+12</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            MIEMBROS NUEVOS ESTE AÑO
                        </p>
                    </div>
                    <div className="w-20 h-20 flex items-center justify-center relative z-10">
                        <TrendingUp className="h-10 w-10 text-accent drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
                </Card>

                <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Puntualidad</p>
                        <h3 className="text-3xl font-black text-foreground italic">94%</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-bold uppercase">
                            PROMEDIO GENERAL
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={94} label="" value="" total="" size={80} color="emerald" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                </Card>
            </div>

            {/* Members List */}
            <Card className="glass-card border-none bg-foreground/5 backdrop-blur-xl">
                <CardHeader className="border-b border-border/20 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o correo..."
                                className="pl-10 bg-foreground/5 border-border/40 text-foreground focus:ring-primary/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none gap-2 border-border/40 hover:bg-foreground/5">
                                <Filter className="h-4 w-4" /> Filtrar
                            </Button>
                            <Button variant="outline" className="flex-1 md:flex-none gap-2 border-border/40 hover:bg-foreground/5">
                                <ArrowUpDown className="h-4 w-4" /> Ordenar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/20">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground w-10"></th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Miembro</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rol</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Participación</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Última Actividad</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {filteredMembers.map((member: Member) => (
                                    <Fragment key={member.id}>
                                        <tr
                                            key={member.id}
                                            className={cn(
                                                "group hover:bg-foreground/[0.02] transition-colors cursor-pointer",
                                                expandedMember === member.id && "bg-foreground/[0.03]"
                                            )}
                                            onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                                        >
                                            <td className="px-6 py-4">
                                                {expandedMember === member.id ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                                                        {member.avatarUrl ? (
                                                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-primary font-bold">{member.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</div>
                                                            {member.is_pre_registered && (
                                                                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/10 uppercase">Pre-Registrado</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            <span className="text-[10px] text-muted-foreground uppercase font-black">{member.gender}</span>
                                                            <span className="text-[8px] text-muted-foreground/30">•</span>
                                                            <span className="text-[10px] text-primary/70 uppercase font-bold">{member.member_group}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                                    member.role === 'Administrador' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                        member.role === 'Responsable' ? "bg-primary/10 text-primary border-primary/20" :
                                                            "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                                )}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {member.status === 'Activo' ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                    ) : (
                                                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                    <span className={cn(
                                                        "text-xs font-bold uppercase tracking-tight",
                                                        member.status === 'Activo' ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                                    )}>
                                                        {member.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-1 bg-foreground/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                                            style={{ width: `${((member.stats?.attendance?.attended || 0) / (member.stats?.attendance?.total || 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-foreground">{((member.stats?.attendance?.attended || 0) / (member.stats?.attendance?.total || 1) * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {member.lastActive}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('¿Eliminar a este miembro definitivamente?')) {
                                                            const success = await useAppStore.getState().deleteMemberFromCloud(member.id);
                                                            if (success) {
                                                                await loadMembersFromCloud();
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                        {/* Expandable Stats Panel */}
                                        {expandedMember === member.id && (
                                            <tr className="bg-foreground/[0.01] border-b border-border/20">
                                                <td colSpan={7} className="px-12 py-8 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                        <div className="col-span-1 border-r border-border/20 pr-8 space-y-6">
                                                            <div className="relative group/avatar w-24 h-24 mx-auto md:mx-0">
                                                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-card">
                                                                    {member.avatarUrl ? (
                                                                        <img src={member.avatarUrl} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-primary/5">
                                                                            {member.name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-black rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity shadow-lg">
                                                                    <Activity className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">Perfil del Miembro</h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {member.email}</div>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {member.phone}</div>
                                                                    {member.parentName && <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold"><Baby className="h-3 w-3 " /> Hijo de {member.parentName}</div>}
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold text-[10px] tracking-widest mt-4">Puesto: {member.role}</div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full border-primary/20 hover:bg-primary/10 text-xs gap-2"
                                                                    onClick={() => setMemberModal({ mode: 'edit', data: member })}
                                                                >
                                                                    <Edit2 className="w-3 h-3" /> Editar Perfil Completo
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 space-y-8">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                <StatDoughnut
                                                                    percent={Math.round(((member.stats?.attendance?.attended || 0) / (member.stats?.attendance?.total || 1)) * 100)}
                                                                    label="Asistencia Mes"
                                                                    value={member.stats?.attendance?.attended || 0}
                                                                    total={member.stats?.attendance?.total || 0}
                                                                    color="cyan"
                                                                />
                                                                <StatDoughnut
                                                                    percent={Math.round(((member.stats?.participation?.led || 0) / (member.stats?.participation?.total || 1)) * 100)}
                                                                    label="Responsable Oración"
                                                                    value={member.stats?.participation?.led || 0}
                                                                    total={member.stats?.participation?.total || 0}
                                                                    color="secondary"
                                                                />
                                                                <StatDoughnut
                                                                    percent={member.stats?.punctuality || 0}
                                                                    label="Puntualidad"
                                                                    value={member.stats?.punctuality || 0}
                                                                    total={100}
                                                                    color="amber"
                                                                />
                                                            </div>

                                                            {/* Privileges Assignment Section */}
                                                            <div className="pt-8 border-t border-border/20">
                                                                <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2 italic">
                                                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                                                    Asignación de Roles y Privilegios
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {[
                                                                        { id: 'monitor', label: 'Responsable de Asistencia', icon: ClipboardCheck, color: 'text-emerald-500', adultOnly: true },
                                                                        { id: 'leader', label: 'Dirigente / Responsable', icon: Star, color: 'text-primary', adultOnly: true },
                                                                        { id: 'choir', label: 'Miembro de Coro Adulto', icon: Music, color: 'text-secondary', adultOnly: true },
                                                                        { id: 'kids_choir', label: 'Responsable de Coro Niños', icon: Baby, color: 'text-cyan-400', adultOnly: true },
                                                                        { id: 'married_choir', label: 'Responsable de Coro Casados', icon: Users, color: 'text-amber-500', adultOnly: true },
                                                                        { id: 'youth_leader', label: 'Responsable de Jóvenes', icon: Users, color: 'text-indigo-400', adultOnly: true },
                                                                        { id: 'kids_leader', label: 'Maestro / Dirigente de Niños', icon: Baby, color: 'text-cyan-400', adultOnly: true },
                                                                        { id: 'kids_helper', label: 'Auxiliar / Seguridad Infantil', icon: ShieldCheck, color: 'text-rose-400', adultOnly: true },
                                                                    ].filter(priv => {
                                                                        const isChild = member.member_group === 'Niños' || member.member_group === 'Niñas';
                                                                        return isChild ? !priv.adultOnly : true;
                                                                    }).map(priv => {
                                                                        const isActive = member.privileges.includes(priv.id as any);
                                                                        return (
                                                                            <Button
                                                                                key={priv.id}
                                                                                variant="outline"
                                                                                className={cn(
                                                                                    "h-auto py-4 px-6 flex flex-col items-center gap-3 rounded-2xl border transition-all duration-300",
                                                                                    isActive
                                                                                        ? "bg-foreground/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                                                        : "bg-transparent border-border/20 opacity-40 hover:opacity-100 hover:bg-foreground/5"
                                                                                )}
                                                                                onClick={async () => {
                                                                                    const hasPriv = member.privileges.includes(priv.id as any);
                                                                                    const newPrivs = hasPriv
                                                                                        ? member.privileges.filter((p: any) => p !== priv.id)
                                                                                        : [...member.privileges, priv.id as any];

                                                                                    setIsSaving(true);
                                                                                    const success = await updateProfileInCloud(member.id, { privileges: newPrivs });
                                                                                    if (success) {
                                                                                        await loadMembersFromCloud();
                                                                                    }
                                                                                    setIsSaving(false);
                                                                                }}
                                                                            >
                                                                                <priv.icon className={cn("w-8 h-8", isActive ? priv.color : "text-slate-500")} />
                                                                                <div className="text-center">
                                                                                    <p className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-white" : "text-slate-500")}>{priv.label}</p>
                                                                                    <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold">{isActive ? 'Privilegio Activo' : 'Sin Asignar'}</p>
                                                                                </div>
                                                                            </Button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && (
                            <div className="p-12 text-center">
                                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-20" />
                                <p className="text-slate-500 italic">No se encontraron miembros con ese nombre.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Member Modal (New/Edit) */}
            {memberModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-4xl glass-card bg-card border-border/40 overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/20 bg-foreground/5 flex flex-row items-center justify-between py-6">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase text-white italic">
                                    {memberModal.mode === 'new' ? 'Registrar Nuevo Miembro' : 'Editar Perfil del Miembro'}
                                </CardTitle>
                                <CardDescription className="text-primary font-bold tracking-widest uppercase text-[10px]">Administración LLDM RODEO</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/10" onClick={() => setMemberModal(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Basic Info Column */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-6 mb-8 p-4 bg-foreground/5 rounded-2xl border border-border/40">
                                        <div className="relative group cursor-pointer" onClick={() => (document.getElementById('member-avatar-upload') as HTMLInputElement)?.click()}>
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-card">
                                                {memberModal.data.avatarUrl ? (
                                                    <img src={memberModal.data.avatarUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/20">
                                                        {memberModal.data.name.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                            <input
                                                id="member-avatar-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImageToEdit(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">Imagen de Perfil</h4>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Click en la imagen para subir una nueva foto</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 text-[10px] font-black uppercase text-primary border border-primary/20 hover:bg-primary/10"
                                                onClick={() => (document.getElementById('member-avatar-upload') as HTMLInputElement)?.click()}
                                            >
                                                Seleccionar Imagen
                                            </Button>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary italic border-b border-primary/20 pb-2">Datos de Identidad</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                                            <Input
                                                value={memberModal.data.name}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, name: e.target.value } })}
                                                className="bg-foreground/5 border-border/40 focus:ring-primary/50"
                                                placeholder="Ej. Juan Perez"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                                            <Input
                                                value={memberModal.data.email}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, email: e.target.value } })}
                                                className="bg-foreground/5 border-border/40 focus:ring-primary/50"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Teléfono / WhatsApp</label>
                                            <Input
                                                value={memberModal.data.phone}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, phone: e.target.value } })}
                                                className="bg-foreground/5 border-border/40 focus:ring-primary/50"
                                                placeholder="555-0123"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Rol en la App</label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md bg-foreground/5 border border-border/40 text-sm focus:ring-primary/50 text-white"
                                                value={memberModal.data.role}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, role: e.target.value as any } })}
                                            >
                                                <option value="Miembro">Miembro</option>
                                                <option value="Responsable">Responsable (Asistencia/Líder/Coro)</option>
                                                <option value="Administrador">Administrador del Sistema</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Género</label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md bg-foreground/5 border border-border/40 text-sm focus:ring-primary/50 text-white"
                                                value={memberModal.data.gender}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, gender: e.target.value as any } })}
                                            >
                                                <option value="Varon">Varon</option>
                                                <option value="Hermana">Hermana</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Grupo Eclesiástico</label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md bg-foreground/5 border border-border/40 text-sm focus:ring-primary/50 text-white"
                                                value={memberModal.data.member_group}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, member_group: e.target.value as any } })}
                                            >
                                                <option value="Casados">Casados</option>
                                                <option value="Casadas">Casadas</option>
                                                <option value="Solos y Solas">Solos y Solas</option>
                                                <option value="Jovenes">Jovenes</option>
                                                <option value="Niños">Niños / Niñas</option>
                                            </select>
                                        </div>
                                        {(memberModal.data.member_group === 'Niños' || memberModal.data.member_group === 'Niñas') && (
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400 ml-1">Nombre del Padre / Tutor</label>
                                                <Input
                                                    value={memberModal.data.parentName || ''}
                                                    onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, parentName: e.target.value } })}
                                                    placeholder="Ej. Samuel Rojas"
                                                    className="bg-cyan-400/5 border-cyan-400/20 focus:ring-cyan-500/50"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Privileges Section Column */}
                                <div className="space-y-6 border-l border-border/20 pl-8">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic border-b border-emerald-500/20 pb-2">Privilegios</h4>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'monitor', label: 'Responsable de Asistencia', icon: ClipboardCheck, adultOnly: true },
                                            { id: 'leader', label: 'Dirigente / Responsable', icon: Star, adultOnly: true },
                                            { id: 'choir', label: 'Miembro de Coro Adulto', icon: Music, adultOnly: true },
                                            { id: 'kids_choir', label: 'Responsable de Coro Niños', icon: Baby, adultOnly: true },
                                            { id: 'married_choir', label: 'Responsable de Coro Casados', icon: Users, adultOnly: true },
                                            { id: 'youth_leader', label: 'Responsable de Jóvenes', icon: Users, adultOnly: true },
                                            { id: 'kids_leader', label: 'Maestro / Dirigente de Niños', icon: Baby, adultOnly: true },
                                            { id: 'kids_helper', label: 'Auxiliar / Seguridad Infantil', icon: ShieldCheck, adultOnly: true },
                                        ].filter(priv => {
                                            const isChild = memberModal.data.member_group === 'Niños' || memberModal.data.member_group === 'Niñas';
                                            return isChild ? !priv.adultOnly : true;
                                        }).map(priv => {
                                            const hasPriv = memberModal.data.privileges.includes(priv.id as any);
                                            return (
                                                <button
                                                    key={priv.id}
                                                    onClick={() => {
                                                        const newPrivs = hasPriv
                                                            ? memberModal.data.privileges.filter(p => p !== priv.id)
                                                            : [...memberModal.data.privileges, priv.id as any];
                                                        setMemberModal({ ...memberModal, data: { ...memberModal.data, privileges: newPrivs } });
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                                        hasPriv
                                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                            : "bg-foreground/5 border-border/20 text-slate-500 hover:border-white/20"
                                                    )}
                                                >
                                                    <priv.icon className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{priv.label}</span>
                                                    {hasPriv && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[9px] text-slate-600 uppercase font-medium leading-relaxed italic">
                                        Asigne los puestos que el miembro desempeñará en la iglesia.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-10">
                                <Button
                                    variant="ghost"
                                    className="flex-1 hover:bg-foreground/10 text-slate-400 font-bold uppercase tracking-widest text-xs"
                                    onClick={() => setMemberModal(null)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-3 py-7 text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/30 transition-all duration-300 group/save"
                                    disabled={isSaving}
                                    onClick={async () => {
                                        setIsSaving(true);
                                        let success = false;
                                        if (memberModal.mode === 'new') {
                                            // Para nuevos miembros, usar INSERT
                                            success = await addMemberToCloud({
                                                name: memberModal.data.name,
                                                email: memberModal.data.email,
                                                phone: memberModal.data.phone,
                                                role: memberModal.data.role,
                                                gender: memberModal.data.gender,
                                                category: (memberModal.data.member_group === 'Niños' || memberModal.data.member_group === 'Niñas') ? 'Niño' : (memberModal.data.gender === 'Hermana' ? 'Hermana' : 'Varon'),
                                                member_group: memberModal.data.member_group,
                                                avatarUrl: memberModal.data.avatarUrl,
                                                privileges: memberModal.data.privileges
                                            });
                                        } else {
                                            // Para editar, usar UPDATE
                                            success = await updateProfileInCloud(memberModal.data.id, memberModal.data);
                                        }
                                        if (success) {
                                            await loadMembersFromCloud();
                                            setMemberModal(null);
                                        }
                                        setIsSaving(false);
                                    }}
                                >
                                    {isSaving ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5 group-hover/save:scale-125 transition-transform" />
                                    )}
                                    {memberModal.mode === 'new' ? 'Crear Miembro Ahora' : 'Confirmar y Guardar Cambios'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {imageToEdit && (
                <ImageEditor
                    image={imageToEdit}
                    onSave={async (cropped) => {
                        if (memberModal) {
                            setIsSaving(true);
                            const file = dataURLtoFile(cropped, `avatar-${memberModal.data.id}.jpg`);
                            const publicUrl = await uploadAvatar(memberModal.data.id, file);
                            if (publicUrl) {
                                setMemberModal({ ...memberModal, data: { ...memberModal.data, avatarUrl: publicUrl } });
                            }
                            setIsSaving(false);
                        }
                        setImageToEdit(null);
                    }}
                    onCancel={() => setImageToEdit(null)}
                />
            )}
        </div>
    );
}
