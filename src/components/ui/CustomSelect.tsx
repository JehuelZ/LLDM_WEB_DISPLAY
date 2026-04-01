'use client';
import React, { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Option {
    value: string;
    label: string;
    isHeader?: boolean;
}

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    searchable?: boolean;
    placeholder?: string;
    className?: string;
}

const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    searchable = true,
    placeholder = 'Seleccionar...',
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable
        ? options.filter(opt => normalizeText(opt.label).includes(normalizeText(searchQuery)))
        : options;

    return (
        <div className={cn("relative w-full", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between gap-3 px-5 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-foreground hover:bg-slate-900/60 transition-all",
                    isOpen && "border-primary/50 ring-1 ring-primary/20",
                    className
                )}
            >
                <span className="truncate">{selectedOption?.label || placeholder}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 shrink-0 opacity-50", isOpen && "rotate-180 opacity-100")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-3 z-[130] bg-[#0f172a] border border-white/10 rounded-[1.5rem] shadow-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {searchable && (
                            <div className="p-3 border-b border-white/5 relative bg-white/[0.02]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    autoFocus
                                    placeholder="BUSCAR..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 bg-black/40 border-none pl-10 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-0"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, i) => (
                                    opt.isHeader ? (
                                        <div key={`header-${i}`} className="px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 mt-3 first:mt-1">
                                            {opt.label}
                                        </div>
                                    ) : (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1",
                                                value === opt.value 
                                                    ? "bg-primary text-black" 
                                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    )
                                ))
                            ) : (
                                <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Sin Resultados</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
