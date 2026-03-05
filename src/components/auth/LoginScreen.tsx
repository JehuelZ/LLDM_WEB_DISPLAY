
'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Shield, Lock, ArrowRight, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LoginScreen() {
    const { signInWithGoogle } = useAppStore();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] font-sora">
            {/* Cinematic Particle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Darker base gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#020617] to-slate-900" />

                {/* Large Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[150px] animate-pulse delay-1000" />

                {/* Animated Digital Motas (Dust/Particles) */}
                {[...Array(30)].map((_, i) => {
                    const size = Math.random() * 8 + 2;
                    const isBlue = Math.random() > 0.6;
                    const isBlurred = Math.random() > 0.5;
                    const duration = Math.random() * 20 + 10;
                    const delay = Math.random() * 10;

                    return (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                                opacity: 0
                            }}
                            animate={{
                                x: [
                                    Math.random() * 100 + "%",
                                    Math.random() * 100 + "%",
                                    Math.random() * 100 + "%"
                                ],
                                y: [
                                    Math.random() * 100 + "%",
                                    Math.random() * 100 + "%",
                                    Math.random() * 100 + "%"
                                ],
                                opacity: [0, Math.random() * 0.5 + 0.2, 0]
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                delay: delay,
                                ease: "easeInOut"
                            }}
                            className={cn(
                                "absolute rounded-full",
                                isBlue ? "bg-blue-400" : "bg-amber-400",
                                isBlurred ? "blur-[6px]" : "blur-[1px]",
                                "shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            )}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    );
                })}

                <div className="absolute inset-0 dots-pattern opacity-10" />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div className="glass-panel p-10 md:p-12 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]">

                    {/* Brand / Logo Section */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-20 h-20 mb-6 relative"
                        >
                            <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl animate-pulse" />
                            <div className="relative w-full h-full bg-slate-900 rounded-3xl border border-white/10 flex items-center justify-center p-4">
                                <img
                                    src="/flama-oficial.svg"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(18%) saturate(3040%) hue-rotate(354deg) brightness(103%) contrast(100%)' }}
                                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                    alt="Logo LLDM"
                                />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            LLDM <span className="text-amber-400">RODEO</span>
                        </h1>
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-10 h-px bg-white/10" />
                            <span className="text-[10px] uppercase font-black tracking-[0.3em]">Tablero Digital</span>
                            <span className="w-10 h-px bg-white/10" />
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-4 mb-10 text-center">
                        <h2 className="text-xl font-bold text-white tracking-tight">Bienvenido de nuevo</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Ingresa con tu cuenta institucional para acceder al sistema de gestión y visualización.
                        </p>
                    </div>

                    {/* Google Login Button (Premium Style) */}
                    <motion.button
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={signInWithGoogle}
                        className="w-full h-16 group relative overflow-hidden rounded-2xl bg-white flex items-center justify-center gap-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:y-0 shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                        <span className="text-slate-900 font-black uppercase tracking-widest text-xs">Entrar con Google</span>

                        <div className="ml-2 w-8 h-8 rounded-full bg-slate-900/5 group-hover:bg-slate-950 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4 text-slate-900 group-hover:text-white transition-colors" />
                        </div>
                    </motion.button>

                    {/* Footer Info */}
                    <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-primary" />
                            Acceso Seguro
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <Globe className="w-3 h-3 text-blue-400" />
                            Global Systems
                        </div>
                    </div>
                </div>

                {/* External Links / Help */}
                <div className="mt-8 flex justify-center gap-6">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Ayuda</button>
                    <span className="w-1 h-1 rounded-full bg-slate-800 self-center" />
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Contacto</button>
                    <span className="w-1 h-1 rounded-full bg-slate-800 self-center" />
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacidad</button>
                </div>
            </motion.div>

            <style jsx>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(25px);
                    box-shadow: 
                        0 4px 24px -1px rgba(0, 0, 0, 0.2), 
                        inset 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
}

