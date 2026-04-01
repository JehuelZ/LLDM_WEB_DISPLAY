
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
    Flame,
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
    size = 120,
    gradientId = "blue"
}: {
    percent: number;
    label: string;
    value: number | string;
    total: number | string;
    size?: number;
    gradientId?: 'blue' | 'purple' | 'orange' | 'emerald';
}) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const safePercent = Math.max(0.5, percent); // Ensure a dot is visible at 0%
    const strokeDashoffset = circumference - (safePercent / 100) * circumference;

    const gradients = {
        blue: { start: '#1e3a8a', end: '#60a5fa', glow: 'rgba(59,130,246,0.5)' },
        purple: { start: '#581c87', end: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
        orange: { start: '#92400e', end: '#fbbf24', glow: 'rgba(245,158,11,0.5)' },
        emerald: { start: '#064e3b', end: '#10b981', glow: 'rgba(16,185,129,0.5)' }
    };

    const currentGrad = gradients[gradientId];

    return (
        <div className="flex flex-col items-center gap-2 group transition-transform duration-300 hover:scale-105 font-[family-name:var(--font-poppins)]">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={currentGrad.start} />
                            <stop offset="100%" stopColor={currentGrad.end} />
                        </linearGradient>
                        <filter id={`glow-${gradientId}`} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {/* Background Track - The Official Gray #525568 */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor" 
                        strokeWidth="10"
                        className="text-muted/20"
                    />

                    {/* Physical Housing (Dark Border around color) */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-black/80 dark:text-[#0a0c10] transition-all duration-1000 ease-out"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                    />

                    {/* Progress Circle (Neon Core) */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={`url(#grad-${gradientId})`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        filter={`url(#glow-${gradientId})`}
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Sharp Outer Edge Border */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out opacity-20"
                    />
                    
                    {/* Inner highlight Fillet */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
                    <span className="text-xl font-light text-foreground tracking-tighter">{percent}%</span>
                    {(value !== "" || total !== "") && (
                        <span className="text-[9px] uppercase font-light text-muted-foreground tracking-tighter">{value}/{total}</span>
                    )}
                </div>
            </div>
            {label && (
                <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                    {label.toLowerCase()}
                </span>
            )}
        </div>
    );
};

import { UserProfile as Member } from '@/lib/store';

const INITIAL_MEMBERS: Member[] = [];

export default function MembersPage() {
    const {
        members, loadMembersFromCloud,
        updateProfileInCloud, uploadAvatar,
        addMemberToCloud,
        showNotification,
        settings,
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

    const [activeTab, setActiveTab] = useState<'todos' | 'varones' | 'hermanas' | 'ninos' | 'jovenes' | 'casados' | 'solas'>('todos');

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
        avatar: '',
        category: 'Varon',
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
        if (!(nameMatch || emailMatch)) return false;

        const group = m.member_group?.toLowerCase().trim() || '';
        const isYoung = ['jovenes', 'jóvenes'].some(v => group.includes(v));
        const isMarried = ['casados', 'casadas'].some(v => group.includes(v));
        const isSingle = ['solos y solas', 'solos', 'solas', 'soltero', 'solteros', 'soltera', 'solteras'].some(v => group.includes(v));
        const isKid = m.category === 'Niño' || ['niños', 'niñas', 'ninos', 'ninas'].some(v => group.includes(v));

        if (activeTab === 'todos') return true;
        if (activeTab === 'ninos') return isKid;
        if (activeTab === 'jovenes') return isYoung && !isKid;
        if (activeTab === 'casados') return isMarried && !isKid;
        if (activeTab === 'solas') return isSingle && m.gender === 'Hermana' && !isKid;
        if (activeTab === 'varones') return m.gender === 'Varon' && !isKid && !isYoung && !isMarried && !isSingle;
        if (activeTab === 'hermanas') return m.gender === 'Hermana' && !isKid && !isYoung && !isMarried && !isSingle;
        return true;
    });

    const statsForTabs = {
        total: members.length,
        ninos: members.filter(m => (m.category === 'Niño' || ['niños', 'niñas', 'ninos', 'ninas'].some(v => (m.member_group || '').toLowerCase().includes(v)))).length,
        jovenes: members.filter(m => {
            const group = (m.member_group || '').toLowerCase();
            const isKid = m.category === 'Niño' || ['niños', 'niñas', 'ninos', 'ninas'].some(v => group.includes(v));
            return ['jovenes', 'jóvenes'].some(v => group.includes(v)) && !isKid;
        }).length,
        casados: members.filter(m => {
            const group = (m.member_group || '').toLowerCase();
            const isKid = m.category === 'Niño' || ['niños', 'niñas', 'ninos', 'ninas'].some(v => group.includes(v));
            return ['casados', 'casadas'].some(v => group.includes(v)) && !isKid;
        }).length
    };

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
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase drop-shadow-sm flex items-center gap-4">
                        <Users className="h-10 w-10 text-primary" />
                        gestión de <span className="underline underline-offset-8 decoration-primary/30">miembros</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4 ml-1 opacity-70">administración de la congregación</p>
                </div>
                <Button
                    className={cn(
                        "gap-2 scale-105 transition-all hover:scale-110 active:scale-95 rounded-none font-[family-name:var(--font-poppins)] tracking-widest text-[11px] font-black uppercase",
                        settings.adminTheme === 'primitivo' 
                            ? "bg-primary text-white border-none hover:bg-primary/90" 
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-lg"
                    )}
                    onClick={() => setMemberModal({ mode: 'new', data: { ...BLANK_MEMBER, id: Math.random().toString(36).substr(2, 9) } })}
                >
                    <UserPlus className="h-4 w-4" />
                    nuevo miembro
                </Button>
            </div>

            {/* Admin Overview Stats */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <Card className={cn(
                    "p-6 flex items-center justify-between group overflow-hidden relative rounded-none",
                    settings.adminTheme === 'primitivo' ? "primitivo-card" : "glass-card border-none shadow-2xl"
                )}>
                    <div className="relative z-10">
                        <p className="text-[10px] font-light uppercase tracking-[0.3em] text-muted-foreground mb-1">membresía global</p>
                        <h3 className="text-4xl font-light text-foreground tracking-tighter">{globalAttendance}%</h3>
                        <p className="text-[9px] text-muted-foreground/80 mt-2 flex items-center gap-1 font-light tracking-[0.1em]">
                            <TrendingUp className="h-3 w-3 text-blue-500/50" /> +2% VS MES PASADO
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={globalAttendance} label="" value="" total="" size={80} gradientId="blue" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                </Card>

                <Card className={cn(
                    "p-6 flex items-center justify-between group overflow-hidden relative rounded-none",
                    settings.adminTheme === 'primitivo' ? "primitivo-card" : "glass-card border-none"
                )}>
                    <div className="relative z-10">
                        <p className="text-[10px] font-light uppercase tracking-[0.3em] text-muted-foreground mb-1">participación</p>
                        <h3 className="text-4xl font-light text-foreground tracking-tighter">{globalParticipation}%</h3>
                        <p className="text-[9px] text-muted-foreground/80 mt-2 flex items-center gap-1 font-light tracking-[0.1em] py-0 my-0">
                            responsables de oración
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={globalParticipation} label="" value="" total="" size={80} gradientId="purple" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                </Card>

                <Card className={cn(
                    "p-6 flex items-center justify-between group overflow-hidden relative rounded-none",
                    settings.adminTheme === 'primitivo' ? "primitivo-card" : "glass-card border-none"
                )}>
                    <div className="relative z-10">
                        <p className="text-[10px] font-light uppercase tracking-[0.3em] text-muted-foreground mb-1">crecimiento</p>
                        <h3 className="text-4xl font-light text-foreground tracking-tighter">+{members.length > 5 ? 12 : members.length}</h3>
                        <p className="text-[9px] text-muted-foreground/80 mt-2 flex items-center gap-1 font-light tracking-[0.1em] py-0 my-0">
                            miembros registrados
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut 
                            percent={Math.min(100, Math.round((members.length / 500) * 100))} 
                            label="" 
                            value={members.length} 
                            total={500} 
                            size={80} 
                            gradientId="orange"
                        />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
                </Card>

                <Card className={cn(
                    "p-6 flex items-center justify-between group overflow-hidden relative rounded-none",
                    settings.adminTheme === 'primitivo' ? "primitivo-card" : "glass-card border-none shadow-2xl"
                )}>
                    <div className="relative z-10">
                        <p className="text-[10px] font-light uppercase tracking-[0.3em] text-muted-foreground mb-1">puntualidad</p>
                        <h3 className="text-4xl font-light text-foreground tracking-tighter">94%</h3>
                        <p className="text-[9px] text-muted-foreground/80 mt-2 flex items-center gap-1 font-light tracking-[0.1em] py-0 my-0">
                            promedio general
                        </p>
                    </div>
                    <div className="w-20 h-20 relative z-10">
                        <StatDoughnut percent={94} label="" value="" total="" size={80} gradientId="emerald" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                </Card>
            </div>

            {/* Members Tabs */}
            <div className={cn(
                "flex flex-wrap items-center gap-1 transition-all duration-300",
                settings.adminTheme === 'primitivo' ? "primitivo-nav-bar" : "bg-slate-900/40 border-white/5 admin-member-filters-bar p-1 rounded-none border w-fit backdrop-blur-xl"
            )}>
                {[
                    { id: 'todos', label: 'todos', icon: Users },
                    { id: 'ninos', label: 'niños', icon: Baby },
                    { id: 'jovenes', label: 'jóvenes', icon: Music },
                    { id: 'casados', label: 'casados', icon: Users },
                    { id: 'solas', label: 'solas', icon: Users },
                    { id: 'varones', label: 'varones', icon: Users },
                    { id: 'hermanas', label: 'hermanas', icon: Star },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "transition-all flex items-center gap-3",
                            settings.adminTheme === 'primitivo'
                                ? cn("primitivo-nav-item", activeTab === tab.id && "active")
                                : cn(
                                    "px-6 py-3 rounded-none text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-poppins)]",
                                    activeTab === tab.id
                                        ? "bg-white/10 text-white border-b-2 border-white/50"
                                        : "text-white/30 hover:text-white hover:bg-white/5 font-light"
                                )
                        )}
                    >
                        <tab.icon className="w-3.5 h-3.5" /> {tab.label.toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Members List */}
            <Card className={cn(
                "border-none",
                settings.adminTheme === 'primitivo' ? "primitivo-card" : "glass-card bg-foreground/5 backdrop-blur-xl"
            )}>
                <CardHeader className="border-b border-border/20 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96 group">
                            {/* Outer Glow on Focus */}
                            <div className="absolute -inset-0.5 bg-emerald-500/0 group-focus-within:bg-emerald-500/15 rounded-2xl blur-md transition-all duration-500" />
                            
                            <div className={cn(
                                "relative border rounded-2xl overflow-hidden focus-within:border-emerald-500/60 transition-all duration-300 backdrop-blur-md",
                                settings.adminTheme === 'primitivo' ? "bg-background/80 border-border/40" : "bg-black/60 border-white/30 focus-within:bg-black/80"
                            )}>
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                <Input
                                    placeholder="buscar por nombre o correo..."
                                    className={cn(
                                        "bg-transparent border-none pl-11 h-12 text-[10px] uppercase font-bold tracking-widest focus-visible:ring-0 focus-visible:outline-none w-full",
                                        settings.adminTheme === 'primitivo' ? "text-foreground placeholder:text-slate-500" : "text-white placeholder:text-slate-500"
                                    )}
                                    value={searchTerm || ''}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button 
                                variant="outline" 
                                className="flex-1 md:flex-none gap-2 border-border/40 hover:bg-foreground/5"
                                onClick={() => showNotification('Filtrado avanzado próximamente', 'info')}
                            >
                                <Filter className="h-4 w-4" /> Filtrar
                            </Button>
                            <Button 
                                variant="outline" 
                                className="flex-1 md:flex-none gap-2 border-border/40 hover:bg-foreground/5"
                                onClick={() => showNotification('Ordenamiento personalizado próximamente', 'info')}
                            >
                                <ArrowUpDown className="h-4 w-4" /> Ordenar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/10">
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground w-10"></th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>miembro</span>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>rol</span>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>estado</span>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>asistencia</span>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>actividad</span>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground font-[family-name:var(--font-poppins)]">
                                        <span className={cn("px-3 py-1.5 rounded-md border", settings.adminTheme === 'primitivo' ? "bg-muted border-border/10" : "bg-white/5 border-white/5")}>acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {filteredMembers.map((member: Member, index: number) => (
                                    <Fragment key={member.id}>
                                        <tr
                                            key={member.id}
                                            className={cn(
                                                "member-row group transition-colors cursor-pointer",
                                                index % 2 === 0 ? "row-even" : "row-odd",
                                                expandedMember === member.id && "bg-foreground/[0.03]"
                                            )}
                                            onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                                        >
                                            <td className="px-6 py-4">
                                                {expandedMember === member.id ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-full border-[3px] flex items-center justify-center overflow-hidden bg-emerald-500/5",
                                                            settings.adminTheme === 'primitivo' ? "border-emerald-500/40 shadow-none" : "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                                                        )}>
                                                            {member.avatar ? (
                                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-primary font-bold">{member.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        {member.is_pre_registered && (
                                                            <div className="absolute -top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-[4px] z-50 flex items-center justify-center leading-none tracking-[0.1em]" style={{ backgroundColor: '#EA580C', color: '#FFFFFF' }}>
                                                                PRE.
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-foreground group-hover:text-primary transition-colors text-sm tracking-tight">{member.name}</div>
                                                        <div className="flex gap-2 items-center mt-1">
                                                            <span className="admin-badge-primitivo">
                                                                {member.gender === 'Varon' ? 'VARON' : 'HERMANA'}
                                                            </span>
                                                            <span className="admin-badge-primitivo">{member.member_group}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "transition-all uppercase",
                                                    "text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] ",
                                                    settings.adminTheme === 'primitivo'
                                                        ? (member.role === 'Administrador' || member.role === 'Ministro a Cargo' ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600")
                                                        : (member.role === 'Administrador' || member.role === 'Ministro a Cargo' ? "bg-amber-900 text-amber-500" : "bg-emerald-900 text-emerald-400")
                                                )}>
                                                    {member.role === 'Administrador' ? 'ADMINISTRADOR DEL SISTEMA' : member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {member.status === 'Activo' ? (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse outline outline-2 outline-emerald-500/20" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500/40" />
                                                    )}
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase tracking-[0.5px] font-[family-name:var(--font-poppins)]",
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
                                                            className={cn("h-full bg-primary", settings.adminTheme === 'primitivo' ? "" : "shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]")}
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
                                                                <div className={cn(
                                                                    "w-24 h-24 rounded-2xl overflow-hidden border-2 bg-emerald-500/5",
                                                                    settings.adminTheme === 'primitivo' ? "border-emerald-500/20 shadow-none" : "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                                )}>
                                                                    {member.avatar ? (
                                                                        <img src={member.avatar} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-primary/5">
                                                                            {member.name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button 
                                                                    className={cn(
                                                                        "absolute -bottom-2 -right-2 p-2 bg-primary text-black rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity hover:scale-110 active:scale-95 transition-all",
                                                                        settings.adminTheme === 'primitivo' ? "shadow-none" : "shadow-lg"
                                                                    )}
                                                                    onClick={() => showNotification(`Actividad reciente de ${member.name} sincronizada`, 'success')}
                                                                >
                                                                    <Activity className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="inline-block px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-4">Perfil del Miembro</h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {member.email}</div>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {member.phone}</div>
                                                                    {member.parentName && <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold"><Baby className="h-3 w-3 " /> Hijo de {member.parentName}</div>}
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold text-[10px] tracking-widest mt-4">
                                                                        <span className="admin-badge-primitivo">Puesto:</span> 
                                                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">{member.role}</span>
                                                                    </div>
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
                                                                    gradientId="blue"
                                                                />
                                                                <StatDoughnut
                                                                    percent={Math.round(((member.stats?.participation?.led || 0) / (member.stats?.participation?.total || 1)) * 100)}
                                                                    label="Responsable Oración"
                                                                    value={member.stats?.participation?.led || 0}
                                                                    total={member.stats?.participation?.total || 0}
                                                                    gradientId="purple"
                                                                />
                                                                <StatDoughnut
                                                                    percent={member.stats?.punctuality || 0}
                                                                    label="Puntualidad"
                                                                    value={member.stats?.punctuality || 0}
                                                                    total={100}
                                                                    gradientId="orange"
                                                                />
                                                            </div>

                                                            {/* Privileges Assignment Section */}
                                                            <div className="pt-8 border-t border-border/20">
                                                                <h4 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest mb-6">
                                                                    <Flame className="w-4 h-4 text-emerald-500" />
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
                                                                        { id: 'kids_helper', label: 'Auxiliar / Seguridad Infantil', icon: Flame, color: 'text-rose-400', adultOnly: true },
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
                                                                                        ? "bg-foreground/10 border-white/20"
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
                                <p className="text-slate-500 ">No se encontraron miembros con ese nombre.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Member Modal (New/Edit) */}
            {memberModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-4xl glass-card bg-slate-900 border-white/10 overflow-hidden rounded-none">
                        <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between py-8">
                            <div>
                                <CardTitle className="text-3xl font-light text-white font-[family-name:var(--font-poppins)] tracking-tighter">
                                    {memberModal.mode === 'new' ? 'registrar nuevo miembro' : 'editar perfil del miembro'}
                                </CardTitle>
                                <CardDescription className="text-white/30 font-light tracking-[0.5em] uppercase text-[9px] mt-2">administración lldm rodeo</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-none hover:bg-white/5" onClick={() => setMemberModal(null)}>
                                <X className="h-5 w-5 text-white/50" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Basic Info Column */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-6 mb-8 p-4 bg-foreground/5 rounded-2xl border border-border/40">
                                        <div className="relative group cursor-pointer" onClick={() => (document.getElementById('member-avatar-upload') as HTMLInputElement)?.click()}>
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 bg-card">
                                                {memberModal.data.avatar ? (
                                                    <img src={memberModal.data.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
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
                                                accept="image/*,.svg"
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
                                            <h4 className="text-sm font-black uppercase tracking-widest text-primary ">Imagen de Perfil</h4>
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
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Datos de Identidad</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                                            <Input
                                                value={memberModal.data.name || ''}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, name: e.target.value } })}
                                                className="bg-foreground/5 border-border/40 focus:ring-primary/50"
                                                placeholder="Ej. Juan Perez"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                                            <Input
                                                value={memberModal.data.email || ''}
                                                onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, email: e.target.value } })}
                                                className="bg-foreground/5 border-border/40 focus:ring-primary/50"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Teléfono / WhatsApp</label>
                                            <Input
                                                value={memberModal.data.phone || ''}
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
                                                <option value="Administrador">Administrador</option>
                                                <option value="Ministro a Cargo">Ministro a Cargo</option>
                                                <option value="Dirigente Coro Adultos">Dirigente Coro Adultos</option>
                                                <option value="Dirigente Coro Niños">Dirigente Coro Niños</option>
                                                <option value="Responsable de Asistencia">Responsable de Asistencia</option>
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
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-emerald-500/20 pb-2">Privilegios</h4>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'monitor', label: 'Responsable de Asistencia', icon: ClipboardCheck, adultOnly: true },
                                            { id: 'leader', label: 'Dirigente / Responsable', icon: Star, adultOnly: true },
                                            { id: 'choir', label: 'Miembro de Coro Adulto', icon: Music, adultOnly: true },
                                            { id: 'kids_choir', label: 'Responsable de Coro Niños', icon: Baby, adultOnly: true },
                                            { id: 'married_choir', label: 'Responsable de Coro Casados', icon: Users, adultOnly: true },
                                            { id: 'youth_leader', label: 'Responsable de Jóvenes', icon: Users, adultOnly: true },
                                            { id: 'kids_leader', label: 'Maestro / Dirigente de Niños', icon: Baby, adultOnly: true },
                                            { id: 'kids_helper', label: 'Auxiliar / Seguridad Infantil', icon: Flame, adultOnly: true },
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
                                                        "w-full flex items-center gap-4 p-4 rounded-none border transition-all text-left font-[family-name:var(--font-poppins)]",
                                                        hasPriv
                                                            ? "bg-white/10 border-white/20 text-white"
                                                            : "bg-white/[0.02] border-white/5 text-white/20 hover:border-white/20"
                                                    )}
                                                >
                                                    <priv.icon className={cn("w-4 h-4", hasPriv ? "text-white" : "text-white/20")} />
                                                    <span className="text-[10px] font-light uppercase tracking-[0.3em]">{priv.label.toLowerCase()}</span>
                                                    {hasPriv && <CheckCircle2 className="w-3 h-3 ml-auto text-white/50" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[9px] text-slate-600 uppercase font-medium leading-relaxed ">
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
                                    className={cn(
                                        "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest gap-3 py-7 text-sm border border-emerald-400/30 transition-all duration-300 group/save",
                                        settings.adminTheme === 'primitivo' ? "bg-amber-500 hover:bg-amber-400 text-black border-none shadow-none" : "shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                                    )}
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
                                                avatar: memberModal.data.avatar,
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
                                setMemberModal({ ...memberModal, data: { ...memberModal.data, avatar: publicUrl } });
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
