'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const ConfiguracionTab: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-6 w-full max-w-6xl mx-auto"
        >
            <div className="flex flex-col border border-indigo-500/30 bg-white/[0.03] p-8 rounded-md backdrop-blur-3xl shadow-2xl">
                <h2 className="text-3xl font-black text-slate-100 mb-2 uppercase tracking-tighter">Panel de <span className="text-indigo-400">Configuración</span></h2>
                <p className="text-slate-500 mb-8 font-black uppercase text-[10px] tracking-widest">Gestión de parámetros del sistema, temas y seguridad del núcleo</p>
                
                <div className="flex flex-col space-y-4">
                    {['Ajustes del Sistema', 'Selector de Tema', 'Usuarios y Roles', 'API y Sincronización'].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-6 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer group shadow-lg backdrop-blur-md">
                            <span className="text-lg font-black uppercase tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors">{item}</span>
                            <span className="text-xs text-indigo-400 font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Gestionar →</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
