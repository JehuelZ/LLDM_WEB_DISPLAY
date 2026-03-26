
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
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                             <Users className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                Church Network
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Directorio <span className="text-primary lg:not-italic">IGLESIA</span>
                            </h1>
                            <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg mt-2 opacity-80">Conectando con el cuerpo de Cristo en LLDM RODEO.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-[28rem]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="BUSCAR POR NOMBRE O CARGO..."
                            className="pl-14 bg-black/40 border-white/10 h-16 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase focus:ring-primary/50 shadow-2xl transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { id: 'all', label: 'Todos', icon: Users },
                        { id: 'leadership', label: 'Liderazgo', icon: Flame },
                        { id: 'choir', label: 'Coros', icon: Music },
                        { id: 'responsible', label: 'Responsables', icon: Star },
                    ].map(filter => (
                        <Button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            variant={activeFilter === filter.id ? "primitivo" : "outline"}
                            className={cn(
                                "h-14 px-8",
                                activeFilter !== filter.id && "opacity-50 hover:opacity-100"
                            )}
                        >
                            <filter.icon className="w-4 h-4 mr-2" />
                            {filter.label}
                        </Button>
                    ))}
                </div>

                {/* Member Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="glass-card border-none bg-black/40 group hover:bg-black/60 transition-all duration-700 overflow-hidden h-full rounded-[2.5rem] shadow-2xl relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={member.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop'}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-2">
                                                     <span className="px-3 py-1 rounded-xl bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
                                                        {member.role === 'Administrador' ? 'ADMIN' : (member.role || 'MIEMBRO')}
                                                    </span>
                                                    {member.gender && (
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-xl",
                                                            member.gender === 'Varon' ? "bg-blue-500/20 text-blue-400 border-blue-500/20" : "bg-pink-500/20 text-pink-400 border-pink-500/20"
                                                        )}>
                                                            {member.gender}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                                                    {member.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group/link cursor-pointer">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:border-primary/50 transition-colors">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest">{member.phone || 'SIN CONTACTO'}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group/link cursor-pointer">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:border-primary/50 transition-colors">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest truncate">{member.email || 'SIN CORREO'}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <Button
                                                onClick={() => handleMessage(member)}
                                                variant="primitivo"
                                                className="w-full h-14 gap-3 group/btn"
                                            >
                                                <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> ENVIAR COMUNICADO
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
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground font-bold uppercase tracking-widest">No se encontraron miembros</p>
                    </div>
                )}

            </main>
        </div>
    );
}
