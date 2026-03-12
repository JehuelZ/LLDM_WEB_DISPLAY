'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
    const { currentUser, signOut } = useAppStore();
    const router = useRouter();

    if (!currentUser) return null;

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter italic leading-none">{currentUser.name}</span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-0.5">{currentUser.role}</span>
            </div>
            <div className="relative group">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 cursor-pointer">
                    {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
                
                {/* Simple Dropdown on hover */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                    <div className="w-48 bg-background/95 backdrop-blur-xl border border-border/10 rounded-2xl shadow-2xl p-2 space-y-1">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl h-10"
                            onClick={() => router.push('/')}
                        >
                            <User className="w-4 h-4 text-emerald-500" /> Mi Perfil
                        </Button>
                        {currentUser.role === 'Administrador' && (
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl h-10"
                                onClick={() => router.push('/admin')}
                            >
                                <Settings className="w-4 h-4 text-primary" /> Admin
                            </Button>
                        )}
                        <div className="h-px bg-border/10 my-1" />
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl h-10 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-4 h-4" /> Salir
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
