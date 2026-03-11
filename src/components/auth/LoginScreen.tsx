
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Lock, ArrowRight, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useIsPhone } from '@/hooks/useIsPhone';

// --- Particle Components ---

const BokehLayer = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={`bokeh-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.2, 1],
                    x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                    y: [Math.random() * 100 + '%', Math.random() * 10 + '%'],
                }}
                transition={{
                    duration: 30 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute rounded-full bg-amber-500/20 blur-[100px]"
                style={{
                    width: `${300 + Math.random() * 200}px`,
                    height: `${300 + Math.random() * 200}px`,
                }}
            />
        ))}
    </div>
);

const GoldenDustLayer = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => {
            const size = Math.random() * 3 + 1;
            const duration = 15 + Math.random() * 25;
            const delay = Math.random() * 10;
            return (
                <motion.div
                    key={`dust-${i}`}
                    initial={{
                        opacity: 0,
                        x: Math.random() * 100 + "%",
                        y: "110%"
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        y: "-10%",
                        x: [
                            (Math.random() * 100) + "%",
                            (Math.random() * 100) + "%"
                        ]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "linear"
                    }}
                    className="absolute bg-amber-400 rounded-full blur-[0.5px] shadow-[0_0_5px_rgba(251,191,36,0.6)]"
                    style={{
                        width: size,
                        height: size,
                    }}
                />
            );
        })}
    </div>
);

const LightSweep = () => (
    <motion.div
        animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.5, 0]
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-amber-400/5 to-transparent skew-x-12"
    />
);

export function LoginScreen() {
    const { signInWithGoogle, signInWithEmail } = useAppStore();
    const [isHovered, setIsHovered] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isPhone = useIsPhone();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#02040a] font-sora">
            {/* Cinematic Background Layering */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#02040a]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
                <BokehLayer />
                <GoldenDustLayer />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/50 to-[#02040a]" />
                <div className="absolute inset-0 dots-pattern opacity-10 mix-blend-overlay" />
            </div>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative z-10 w-full transition-all duration-500",
                    isPhone ? "max-w-none px-6 pt-20 pb-12 flex flex-col justify-start min-h-screen" : "max-w-[480px] px-6 py-12"
                )}
            >
                <div
                    className="relative group transition-all duration-700"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Dynamic Outer Glow */}
                    <div className={cn(
                        "absolute -inset-1 bg-amber-500/20 rounded-[3rem] blur-2xl transition-opacity duration-1000",
                        (isHovered && !isPhone) ? "opacity-40" : "opacity-0"
                    )} />

                    {/* Premium Glass Card */}
                    <div className={cn(
                        "relative glass-panel-premium overflow-hidden transition-all duration-500",
                        isPhone ? "rounded-none bg-transparent border-none shadow-none p-0" : "rounded-[2.5rem] border border-white/10 p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    )}>
                        <LightSweep />

                        {/* Logo & Identity */}
                        <div className="flex flex-col items-center text-center mb-12">
                            <motion.div
                                animate={isHovered ? { scale: 1.05, rotate: 2 } : { scale: 1, rotate: 0 }}
                                className="w-24 h-24 mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-amber-500/30 rounded-3xl blur-2xl animate-pulse" />
                                <div className="relative w-full h-full bg-slate-950/80 rounded-3xl border border-amber-500/20 flex items-center justify-center p-5 shadow-inner">
                                    <img
                                        src="/flama-oficial.svg"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(18%) saturate(3040%) hue-rotate(330deg) brightness(103%) contrast(100%)' }}
                                        className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                                        alt="LLDM"
                                    />
                                </div>
                            </motion.div>

                            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
                                LLDM <span className="text-amber-500">RODEO</span>
                            </h1>
                            <div className="flex justify-center">
                                <span className="text-[9px] uppercase font-black tracking-[0.4em] text-amber-500/60">
                                    Digital Experience
                                </span>
                            </div>
                        </div>

                        {/* Login Options Container */}
                        <div className="space-y-8">
                            {/* Google Sign In Area */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={signInWithGoogle}
                                className="w-full group relative h-16 rounded-2xl bg-white border border-transparent flex items-center justify-between px-6 transition-all shadow-xl hover:shadow-amber-500/10"
                            >
                                <div className="flex items-center gap-4">
                                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                                    <span className="text-slate-900 font-extrabold uppercase tracking-widest text-xs">Acceso con Google</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-900/5 group-hover:bg-amber-500 flex items-center justify-center transition-all group-hover:rotate-[-45deg]">
                                    <ArrowRight className="w-4 h-4 text-slate-800 group-hover:text-white" />
                                </div>
                            </motion.button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-white/5"></div>
                                <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">O credenciales</span>
                                <div className="flex-grow border-t border-white/5"></div>
                            </div>

                            {/* Email / Pass Inputs */}
                            <div className="space-y-4">
                                <div className="group/input relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="CORREO"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.05] transition-all font-bold text-[11px] tracking-widest"
                                    />
                                </div>
                                <div className="group/input relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="CONTRASEÑA"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.05] transition-all font-bold text-[11px] tracking-widest"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={async () => {
                                        if (!email || !password) {
                                            alert('Ingrese sus credenciales');
                                            return;
                                        }
                                        await signInWithEmail(email, password);
                                    }}
                                    className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-amber-500/10 transition-colors"
                                >
                                    INGRESAR AL SISTEMA
                                </motion.button>
                            </div>
                        </div>

                        {/* High Fidelity Footer */}
                    </div>
                </div>

                {/* Sub-Card Actions */}
                <div className="mt-10 flex justify-center gap-8 px-4">
                    {['Ayuda', 'Contacto', 'Privacidad'].map((item) => (
                        <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-amber-500 transition-colors">
                            {item}
                        </button>
                    ))}
                </div>
            </motion.div>

            <style jsx>{`
                .glass-panel-premium {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
                    backdrop-filter: blur(40px) saturate(180%);
                    box-shadow: 
                        0 20px 50px -10px rgba(0, 0, 0, 0.5),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
                }
                .dots-pattern {
                    background-image: radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
            `}</style>
        </div>
    );
}

