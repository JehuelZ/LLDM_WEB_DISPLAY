
'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Mail, MessageSquare, ArrowLeft, Users, Flame, Music, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Directory uses real members from store

export default function DirectoryPage() {
    const { members, loadMembersFromCloud, currentUser, sendCloudMessage, showNotification } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        loadMembersFromCloud();
    }, [loadMembersFromCloud]);

    const filtered = members.filter(m => {
        const mName = m.name || '';
        const mRole = m.role || '';
        const mPrivs = m.privileges || [];

        const matchesSearch = mName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mRole.toLowerCase().includes(searchTerm.toLowerCase());

        // Map roles to tags for filtering
        const roleStr = String(mRole);
        const memberTag = (roleStr === 'Administrador' || roleStr === 'Ministro a Cargo' || roleStr === 'Responsable de Asistencia') ? 'leadership' :
            mPrivs.includes('choir') ? 'choir' : 'all';

        const matchesFilter = activeFilter === 'all' || memberTag === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleMessage = async (member: any) => {
        const content = prompt(`Enviar mensaje a ${member.name}:`);
        if (content) {
            await sendCloudMessage({
                senderId: currentUser.id,
                receiverId: member.id,
                content,
                subject: `Mensaje de ${currentUser.name}`
            });
            showNotification('Mensaje enviado', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-xs font-black uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft className="w-3 h-3" /> Volver al Inicio
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-4">
                            <Users className="w-12 h-12 text-primary" />
                            Directorio <span className="text-primary">Iglesia</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Mantente conectado con el cuerpo de Cristo en LLDM RODEO</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Buscar por nombre o cargo..."
                            className="pl-12 bg-foreground/5 border-border/40 h-14 rounded-2xl text-lg focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: 'Todos', icon: Users },
                        { id: 'leadership', label: 'Liderazgo', icon: Flame },
                        { id: 'choir', label: 'Coro', icon: Music },
                        { id: 'responsible', label: 'Responsables', icon: Star },
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                                activeFilter === filter.id
                                    ? "bg-primary text-black border-primary glow-blue scale-105"
                                    : "bg-foreground/5 text-slate-400 border-border/20 hover:border-white/20 hover:bg-foreground/10"
                            )}
                        >
                            <filter.icon className="w-4 h-4" />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Member Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="glass-card border-none bg-foreground/5 group hover:bg-foreground/10 transition-all duration-500 overflow-hidden h-full">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                                            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md w-fit">
                                                {member.role}
                                            </span>
                                            <div className="flex gap-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border backdrop-blur-md",
                                                    member.gender === 'Varon' ? "bg-blue-500/20 text-blue-400 border-blue-500/20" : "bg-pink-500/20 text-pink-400 border-pink-500/20"
                                                )}>
                                                    {member.gender}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground/70 text-[8px] font-black uppercase tracking-widest border border-border/40 backdrop-blur-md">
                                                    {member.member_group}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter leading-tight">
                                                {member.name}
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-400 hover:text-foreground transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/20">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium">{member.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 hover:text-foreground transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/20">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium truncate">{member.email}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleMessage(member)}
                                                className="flex-1 rounded-xl border-border/40 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 font-black uppercase text-[10px] tracking-widest gap-2"
                                            >
                                                <MessageSquare className="w-3 h-3" /> Mensaje
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-dashed border-border/40">
                        <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No se encontraron miembros</p>
                    </div>
                )}

            </main>
        </div>
    );
}
