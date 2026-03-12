'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, Lock, ArrowRight } from "lucide-react";
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { signInWithGoogle, authSession } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (authSession) {
            router.push('/dashboard');
        }
    }, [authSession, router]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signInWithGoogle();
        // Redirect happens via Supabase
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-4">
            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-2 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                            <img src="/flama-oficial.svg" className="w-16 h-16 object-contain brightness-110" alt="Logo" />
                        </div>
                    </div>
                </div>

                <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />

                    <CardHeader className="space-y-1 text-center pt-8">
                        <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">
                            LLDM <span className="text-primary not-italic font-black">RODEO</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium">
                            Accede al Tablero Digital de la Congregación
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pb-8">
                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                className="h-14 border-white/10 bg-white/5 hover:bg-white/10 text-foreground text-sm font-bold gap-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0f172a] px-2 text-slate-500 font-black tracking-widest">O</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                variant="ghost"
                                className="w-full h-12 text-slate-400 hover:text-foreground hover:bg-white/5 rounded-xl text-xs font-black tracking-widest gap-2 uppercase"
                                onClick={() => router.push('/')}
                            >
                                <ArrowRight className="w-4 h-4" /> Entrar como Invitado
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-slate-500 font-medium">
                    Al continuar, aceptas los Términos de Servicio y la Política de Privacidad de LLDM RODEO Digital Board.
                </p>
            </motion.div>
        </div>
    );
}
