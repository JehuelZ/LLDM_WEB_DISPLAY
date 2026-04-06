'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send, Star } from 'lucide-react';

interface MemberCardProps {
    member: any;
    idx: number;
    onViewDetails: (member: any) => void;
}

export function MemberCard({ member, idx, onViewDetails }: MemberCardProps) {
    return (
        <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-6 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2.5rem] flex flex-col gap-5 cursor-pointer transition-all group relative overflow-hidden shadow-2xl hover:shadow-red-500/10 hover:border-red-500/30"
        >
            <div className="absolute top-2 right-6 p-2">
                <Star className="w-3.5 h-3.5 text-zinc-800 group-hover:text-red-500 transition-colors" fill="currentColor" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-[1.25rem] overflow-hidden border border-white/10 bg-slate-900 group-hover:border-red-500/40 transition-colors">
                    {member.avatar ? (
                        <img src={member.avatar} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black text-white/5 italic">
                            {member.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1 group-hover:text-red-400 transition-colors">{member.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider font-mono">#{idx + 1}</span>
                        <span className="w-1 h-1 rounded-full bg-red-500/30" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase truncate">{member.member_group || 'General'}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex gap-2 relative z-10">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 flex-1 text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl"
                    onClick={() => onViewDetails(member)}
                >
                    Ver Ficha
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 flex-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        const msg = `Hno. ${member.name.split(' ')[0]}, le saludamos con la paz del Señor. Le hemos extrañado en los últimos servicios de oración. ¡Dios le bendiga!`;
                        window.open(`https://wa.me/${member.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                >
                    <Send className="w-3 h-3 mr-1.5" /> Alentar
                </Button>
            </div>
        </motion.div>
    );
}
