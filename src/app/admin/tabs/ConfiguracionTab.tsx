'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const ConfiguracionTab: React.FC = () => {
    return (
        <div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col space-y-6 w-full max-w-6xl mx-auto"
        >
            <div className="flex flex-col border border-indigo-500/20 bg-slate-900/40 p-8 rounded-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Panel de Configuración</h2>
                <p className="text-slate-400 mb-6 font-medium">Configure parámetros del sistema, temas y seguridad.</p>
                
                <div className="flex flex-col space-y-4">
                    {['Ajustes del Sistema', 'Selector de Tema', 'Usuarios y Roles', 'API y Sincronización'].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all cursor-pointer">
                            <span className="text-lg font-semibold text-slate-100">{item}</span>
                            <span className="text-sm text-indigo-400 font-bold uppercase tracking-widest">Gestionar →</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
