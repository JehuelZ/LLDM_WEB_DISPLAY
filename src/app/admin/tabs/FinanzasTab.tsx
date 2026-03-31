'use client';
import React from 'react';
import { motion } from 'framer-motion';

const TabShell: React.FC<{title: string, subtitle: string}> = ({title, subtitle}) => (
    <div className="flex flex-col space-y-6 w-full max-w-6xl mx-auto">
        <div className="flex flex-col border border-indigo-500/10 bg-slate-900/40 p-12 rounded-3xl backdrop-blur-3xl items-center justify-center text-center">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
            <h2 className="text-3xl font-bold text-slate-100 mb-2 uppercase tracking-tighter">{title}</h2>
            <p className="text-slate-500 mb-8 max-w-md font-medium">{subtitle}</p>
            <div className="px-8 py-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black rounded-lg uppercase text-xs tracking-widest">
                Próximamente disponible
            </div>
            </motion.div>
        </div>
    </div>
);

export const FinanzasTab: React.FC = () => <TabShell title="Control de Finanzas" subtitle="Gestión transparente de aportaciones, fondos y reportes financieros." />;
