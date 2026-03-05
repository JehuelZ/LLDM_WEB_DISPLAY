import { motion } from 'framer-motion';
import { User, Shield, Church, Cross, Star, Heart } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LeaderProfileProps {
    leaderId: string | null;
    responsibility: string;
    colorClass: string;
    size?: "large" | "small" | "tiny";
    members: any[];
    layout?: "vertical" | "horizontal";
    minimal?: boolean;
}

export const LeaderProfile = ({
    leaderId,
    responsibility,
    colorClass,
    size = "large",
    members,
    layout = "vertical",
    minimal = false
}: LeaderProfileProps) => {
    const isMin = size === "small" || size === "tiny";
    const isTiny = size === "tiny";
    const isMinimal = minimal || isTiny;

    const member = useMemo(() => {
        if (!leaderId) return null;
        const cleanId = leaderId.trim().toLowerCase();
        return members.find(m => m.id.toLowerCase() === cleanId);
    }, [leaderId, members]);

    const name = member ? member.name : (leaderId && leaderId.length > 20 ? 'HERMANO ASIGNADO' : (leaderId || '---'));
    const avatar = member?.avatar;

    if (layout === "horizontal") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-10 w-full group/leader px-8 py-4 relative"
            >
                <div className="relative shrink-0">
                    <div className={cn(
                        "absolute -inset-4 rounded-full blur-[40px] opacity-20 animate-pulse transition-colors duration-1000",
                        colorClass
                    )} />
                    <div className={cn(
                        "rounded-[2.5rem] bg-slate-900 flex items-center justify-center border-4 overflow-hidden relative shadow-2xl transition-all duration-700 group-hover/leader:scale-110",
                        isMin ? "w-24 h-24" : "w-32 h-32",
                        colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/50')
                    )}>
                        {avatar ? (
                            <img src={avatar} className="w-full h-full object-cover scale-110" alt={name} />
                        ) : (
                            <User className={cn("opacity-20 text-white", isMin ? "w-10 h-10" : "w-14 h-14")} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "font-black text-white italic tracking-tighter leading-none transition-all duration-700 group-hover/leader:tracking-normal truncate",
                        isMin ? "text-3xl" : "text-5xl"
                    )}>
                        {name}
                    </h3>
                </div>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                        "px-8 py-2 rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] border backdrop-blur-3xl shadow-2xl shrink-0 italic",
                        colorClass.replace('bg-', 'text-').replace('/10', '').replace('/20', ''),
                        colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/60'),
                        colorClass.replace('bg-', 'bg-').replace('/10', '/30').replace('/20', '/40')
                    )}
                >
                    {responsibility}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 group/leader w-full max-w-md"
        >
            <div className="relative">
                <div className={cn(
                    "absolute -inset-8 rounded-full blur-[100px] opacity-30 animate-pulse transition-colors duration-1000",
                    colorClass
                )} />

                <div className={cn(
                    "rounded-[4rem] bg-slate-900 flex items-center justify-center border-[6px] overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)] transition-all duration-1000 group-hover/leader:scale-105 group-hover/leader:rotate-3",
                    isTiny ? "w-40 h-40" : (isMin ? "w-56 h-56" : "w-80 h-80"),
                    colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/50')
                )}>
                    {avatar ? (
                        <img
                            src={avatar}
                            className="w-full h-full object-cover scale-110 group-hover/leader:scale-125 transition-transform duration-[2000ms] ease-out"
                            alt={name}
                        />
                    ) : (
                        <User className={cn("opacity-20 text-white", isTiny ? "w-16 h-16" : (isMin ? "w-24 h-24" : "w-36 h-36"))} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/leader:opacity-100 transition-opacity duration-700" />
                </div>

                <div className={cn(
                    "absolute -inset-4 rounded-[4.5rem] border-2 border-dashed opacity-20 group-hover/leader:rotate-12 transition-transform duration-[3000ms]",
                    colorClass.replace('bg-', 'border-').replace('/10', '').replace('/20', '')
                )} />
            </div>

            <div className="text-center space-y-4 px-6 relative z-10">
                <div
                    className={cn(
                        "inline-flex items-center gap-2 font-black uppercase tracking-[0.4em] italic transition-all duration-500",
                        isMinimal ? (isTiny ? "text-[10px] text-white/40" : "text-xs text-white/60 mb-2") : "px-8 py-2 rounded-2xl border backdrop-blur-2xl shadow-2xl inline-block",
                        !isMinimal && colorClass.replace('bg-', 'text-').replace('/10', '').replace('/20', ''),
                        !isMinimal && colorClass.replace('bg-', 'border-').replace('/10', '/40').replace('/20', '/60'),
                        !isMinimal && colorClass.replace('bg-', 'bg-').replace('/10', '/30').replace('/20', '/40')
                    )}
                >
                    {isMinimal && (
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor]",
                            colorClass.replace('bg-', 'text-').replace('/10', '').replace('/20', '')
                        )} />
                    )}
                    {responsibility}
                </div>

                <h3 className={cn(
                    "font-black text-foreground text-glow uppercase italic tracking-tighter leading-none transition-all duration-700 group-hover/leader:tracking-normal",
                    isTiny ? "text-2xl" : (isMin ? "text-3xl" : "text-5xl")
                )}>
                    {name}
                </h3>
            </div>
        </motion.div>
    );
};
