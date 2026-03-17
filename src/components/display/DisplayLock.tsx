'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, ChevronRight, Activity, Wifi } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function DisplayLock({ onUnlock }: { onUnlock: () => void }) {
    const { currentUser, authSession, signInWithGoogle, settings } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pinEntry, setPinEntry] = useState('');
    const [error, setError] = useState(false);

    const authorizedEmails = settings.displayAuthorizedEmails || [];
    const validPin = settings.displayPin || '1922';

    // Check authorization
    useEffect(() => {
        if (currentUser) {
            const isAuthorized = currentUser.role === 'Administrador' ||
                authorizedEmails.includes(currentUser.email || '');
            if (isAuthorized) {
                onUnlock();
            }
        }
    }, [currentUser, authorizedEmails, onUnlock]);

    const handlePinClick = (num: string) => {
        setError(false);
        const newPin = (pinEntry + num).slice(0, 4);
        setPinEntry(newPin);

        if (newPin.length === 4) {
            if (newPin === validPin) {
                onUnlock();
            } else {
                setError(true);
                setTimeout(() => setPinEntry(''), 600);
            }
        }
    };

    const handleGoogleLogin = async () => {
        setIsProcessing(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed:", error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center font-sans overflow-hidden">
            {/* 
              CINEMATIC STANDBY BACKGROUND 
              Using the official FLAME EMBLEM
            */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="absolute inset-0 z-0 flex items-center justify-center p-20"
            >
                <img
                    src="/flama-oficial.svg"
                    className="w-[60%] h-[60%] object-contain opacity-20 filter brightness-150"
                    alt="Standby Emblem"
                />
                <div className="absolute inset-0 bg-black/30" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg p-12 flex flex-col items-center gap-12"
            >
                {/* Discrete Trigger Area - Invisible until hover but clickable */}
                <div
                    className="text-center space-y-8 group cursor-pointer"
                    onClick={() => setShowLogin(true)}
                >
                    {/* 
                        The trigger circle: 
                        It aligns with the emblem in the background.
                        Provides a "touch target" without blocking the beautiful art.
                    */}
                    {!showLogin && (
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-56 h-56 rounded-full border border-white/5 flex flex-col items-center justify-center text-white/5 group-hover:text-primary transition-all duration-1000 mx-auto bg-white/[0.02] backdrop-blur-[2px] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                        >
                            <Lock className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {showLogin ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white italic drop-shadow-lg">Acceso Reservado</h2>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Identificación Requerida</p>
                                </div>

                                {/* PIN DISPLAY */}
                                <div className="flex justify-center gap-4 py-4">
                                    {[0, 1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 transition-all duration-300",
                                                pinEntry.length > i
                                                    ? (error ? "bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-primary border-primary shadow-[0_0_15px_rgba(251,191,36,0.5)]")
                                                    : "border-white/20"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* NUMERIC PAD */}
                                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'clear'].map((btn, idx) => (
                                        <button
                                            key={idx}
                                            disabled={btn === ''}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (btn === 'clear') setPinEntry('');
                                                else if (btn !== '') handlePinClick(btn);
                                            }}
                                            className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all active:scale-90",
                                                btn === '' ? "opacity-0" : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/50",
                                                btn === 'clear' && "text-[10px] uppercase tracking-widest text-red-400"
                                            )}
                                        >
                                            {btn === 'clear' ? 'Borrar' : btn}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="flex items-center gap-4 opacity-50">
                                        <div className="h-[1px] flex-1 bg-white/10" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">O entrar con</span>
                                        <div className="h-[1px] flex-1 bg-white/10" />
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoogleLogin();
                                        }}
                                        disabled={isProcessing}
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 group hover:border-primary/50"
                                    >
                                        <LogIn className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Gmail Admin</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowLogin(false);
                                            setPinEntry('');
                                            setError(false);
                                        }}
                                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cerrar Teclado
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400 drop-shadow-md">LLDM Rodeo System</p>
                                <div className="h-[1px] w-8 bg-primary/40 mx-auto" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Technical status (very faint) */}
                <div className="absolute bottom-10 inset-x-0 px-12 flex justify-between items-center opacity-20">
                    <div className="flex items-center gap-3">
                        <Activity className="w-3 h-3 text-primary animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/60">System Ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Wifi className="w-3 h-3 text-emerald-500" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/60">Cloud Linked</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
