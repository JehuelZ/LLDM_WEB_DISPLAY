
'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ClipboardCheck, Music, Baby, ArrowRight, User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { CountdownCard } from '@/components/CountdownCard';
import { useState, useEffect } from 'react';

export default function DashboardIndex() {
    const { currentUser } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !currentUser) return <div className="min-h-screen bg-background" />;

    const dashboards = [
        {
            title: 'Mi Perfil',
            description: 'Gestiona tu información personal, biografía y privacidad.',
            href: '/dashboard/profile',
            icon: User,
            color: 'text-violet-400',
            bgColor: 'bg-violet-400/10',
            borderColor: 'border-violet-400/20',
            show: true
        },
        {
            title: 'Mensajes',
            description: 'Bandeja de entrada, avisos y comunicación directa.',
            href: '/dashboard/profile?tab=mensajes',
            icon: Mail,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/20',
            show: true
        },
        {
            title: 'Responsable de Asistencia',
            description: 'Control de ingresos y reportes en tiempo real.',
            href: '/dashboard/monitor',
            icon: ClipboardCheck,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            show: currentUser.role === 'Administrador' || currentUser.role === 'Responsable de Asistencia' || currentUser.privileges?.includes('monitor')
        },
        {
            title: 'Coro Adulto',
            description: 'Ensayos, cantos y asistencia del coro.',
            href: '/dashboard/coro',
            icon: Music,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            borderColor: 'border-secondary/20',
            show: currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges?.includes('choir')
        },
        {
            title: 'Gestión de Jóvenes',
            description: 'Supervisión de actividades y participación juvenil.',
            href: '/dashboard/youth',
            icon: Users,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-400/10',
            borderColor: 'border-indigo-400/20',
            show: currentUser.role === 'Administrador' || currentUser.role === 'Encargado de Jóvenes' || currentUser.privileges?.includes('youth_leader')
        },
        {
            title: 'Consola Ministerial',
            description: 'Supervisión global de la iglesia y programación espiritual.',
            href: '/dashboard/minister',
            icon: LayoutDashboard,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            show: currentUser.role === 'Administrador' || currentUser.role === 'Ministro a Cargo' || currentUser.privileges?.includes('leader')
        }
    ].filter(d => d.show);

    return (
        <div className="min-h-screen text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 md:space-y-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                             <LayoutDashboard className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                Interactive Hub
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Paneles de <span className="text-primary not-italic">CONTROL</span>
                            </h1>
                            <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg mt-2 opacity-80">Seleccione el acceso correspondiente a su rol o departamento operativo.</p>
                        </div>
                    </div>
                </div>

                <div className="px-1 md:px-0">
                    <CountdownCard />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {dashboards.map((dash, i) => (
                        <Link key={i} href={dash.href}>
                            <motion.div 
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="glass-card bg-black/40 border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer h-full flex flex-col justify-between"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${dash.bgColor.replace('/10', '/5')} rounded-full blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity opacity-50`} />
                                
                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl ${dash.bgColor} border ${dash.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                                        <dash.icon className={`h-7 w-7 ${dash.color}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground italic tracking-tighter uppercase mb-3 leading-none group-hover:text-primary transition-colors">{dash.title}</h3>
                                    <p className="text-muted-foreground text-xs font-bold tracking-tight opacity-70 leading-relaxed">{dash.description}</p>
                                </div>

                                <div className="mt-8 flex items-center justify-between relative z-10 w-full pt-6 border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Acceder</span>
                                    <div className={`w-10 h-10 rounded-xl ${dash.bgColor} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}>
                                        <ArrowRight className={`h-4 w-4 ${dash.color}`} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Info Box */}
                {currentUser.role === 'Administrador' && (
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-foreground/[0.02] border border-border/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mt-8 md:mt-12">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl md:text-2xl font-black text-foreground uppercase italic">Developer / Admin Access</h4>
                                <p className="text-sm md:text-base text-muted-foreground font-bold italic opacity-80">Accede al panel maestro para gestionar toda la iglesia.</p>
                            </div>
                        </div>
                        <Link href="/admin" className="w-full md:w-auto">
                            <Button variant="primitivo" className="w-full md:w-auto px-12 h-14">
                                Administración
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
