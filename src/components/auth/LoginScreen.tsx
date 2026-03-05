
'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Shield, Lock, ArrowRight, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoginScreen() {
    const { signInWithGoogle } = useAppStore();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950 font-sora">
            {/* Animated Particles/Glowing blobs */}
            <div className="absolute top-1/4 -left-20 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

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
                            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
                            <div className="relative w-full h-full bg-slate-900 rounded-3xl border border-white/10 flex items-center justify-center p-4">
                                <img src="/flama-oficial.svg" className="w-full h-full object-contain filter drop-shadow-lg" alt="Logo LLDM" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            LLDM <span className="text-primary">RODEO</span>
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

