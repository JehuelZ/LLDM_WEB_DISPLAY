
'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ClipboardCheck, Music, Baby, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CountdownCard } from '@/components/CountdownCard';

export default function DashboardIndex() {
    const dashboards = [
        {
            title: 'Responsable de Asistencia',
            description: 'Control de ingresos y reportes en tiempo real.',
            href: '/dashboard/monitor',
            icon: ClipboardCheck,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Corito de Niños',
            description: 'Vista personalizada para los más pequeños.',
            href: '/dashboard/ninos',
            icon: Baby,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-400/10',
            borderColor: 'border-cyan-400/20'
        },
        {
            title: 'Coro Adulto',
            description: 'Ensayos, cantos y asistencia del coro.',
            href: '/dashboard/coro',
            icon: Music,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            borderColor: 'border-secondary/20'
        },
        {
            title: 'Panel de Responsables',
            description: 'Herramientas para encargados de grupo.',
            href: '/dashboard/responsable',
            icon: ShieldCheck,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/20'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-8 space-y-12">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-4">
                        <LayoutDashboard className="w-12 h-12 text-primary" />
                        Paneles de <span className="text-primary">Control</span>
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight text-lg">Seleccione el acceso correspondiente a su rol o departamento.</p>
                </div>

                <CountdownCard />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {dashboards.map((dash, i) => (
                        <Link key={i} href={dash.href}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`glass-card p-6 h-full flex flex-col border-t-4 border-t-transparent hover:border-t-current transition-all duration-300 group ${dash.color}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${dash.bgColor} flex items-center justify-center border ${dash.borderColor} mb-6 transition-transform group-hover:scale-110`}>
                                    <dash.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-foreground italic uppercase tracking-tight mb-2">{dash.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{dash.description}</p>
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                                    Acceder ahora <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Info Box */}
                <div className="p-8 rounded-[2rem] bg-foreground/[0.02] border border-border/20 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Users className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-foreground uppercase italic">Developer / Admin Access</h4>
                            <p className="text-slate-500">Accede al panel maestro para gestionar toda la iglesia.</p>
                        </div>
                    </div>
                    <Link href="/admin">
                        <Button className="bg-primary hover:bg-primary/90 text-foreground font-black uppercase tracking-widest px-12 h-14 rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
                            Panel de Administración
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
