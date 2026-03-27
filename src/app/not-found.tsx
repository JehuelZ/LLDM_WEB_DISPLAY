'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full text-center relative z-10">
                {/* Visual Icon */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 relative inline-block"
                >
                    <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl mx-auto shadow-2xl relative z-10">
                        <AlertTriangle className="w-12 h-12 text-primary" strokeWidth={1.5} />
                    </div>
                    {/* Pulsing ring */}
                    <motion.div 
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/20 rounded-3xl -z-1"
                    />
                </motion.div>

                {/* Error Text */}
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-black text-white mb-4 tracking-tighter uppercase"
                >
                    Ruta No Encontrada
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed max-w-[80%] mx-auto"
                >
                    Lo sentimos, la sección que buscas no existe o ha sido movida como parte de nuestra actualización de seguridad.
                </motion.p>

                {/* Call to Action */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <Link href="/dashboard">
                        <button className="w-full h-11 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]">
                            <Home className="w-3.5 h-3.5" />
                            Regresar al Tablero
                        </button>
                    </Link>
                    
                    <Link href="/login">
                        <button className="w-full h-11 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all backdrop-blur-md">
                            <ArrowLeft className="w-2.5 h-2.5" />
                            Ir al Inicio de Sesión
                        </button>
                    </Link>
                </motion.div>

                {/* Technical Footnote */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1 }}
                    className="mt-16 text-[8px] font-black uppercase tracking-[0.3em] text-white/50"
                >
                    ER_404_LLDM_RODEO_INFRASTRUCTURE
                </motion.div>
            </div>
        </div>
    );
}
