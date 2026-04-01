"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Internal components to replicate functionality with tactile style
export const TactileIconBox = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <div className="tactile-icon-box" style={{ backgroundColor: color }}>
        <Icon className="w-6 h-6" />
    </div>
)

export const TactileBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(
        "bg-[var(--tactile-panel-bg)] border border-[var(--tactile-border-strong)] rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest inline-flex items-center justify-center transition-all hover:bg-[var(--tactile-item-hover)] text-[var(--tactile-text-sub)]",
        className
    )}>
        {children}
    </div>
)

export const TactileGlassCard = ({ children, title, className, subtitle, extra }: { children: React.ReactNode, title?: string, className?: string, subtitle?: string, extra?: React.ReactNode }) => (
    <div className={cn("relative group/card bg-[var(--tactile-card-bg)] border border-[var(--tactile-border)] rounded-[3rem] p-8 backdrop-blur-3xl overflow-hidden", className)}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover/card:bg-primary/10 transition-colors duration-700" />
        <div className="relative z-10 text-[var(--tactile-text)]">
            {title && (
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{title}</h3>
                        {subtitle && <p className="text-[9px] font-medium text-[var(--tactile-text-sub)] uppercase tracking-widest mt-1">{subtitle}</p>}
                    </div>
                    {extra}
                </div>
            )}
            {children}
        </div>
    </div>
)

// Tactile Input Components
export const TactileInput = ({ label, value, onChange, placeholder, icon: Icon, type = "text", disabled }: any) => (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
        {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">{label}</label>}
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl h-12 text-sm font-bold px-4 transition-all outline-none focus:border-primary/50 text-[var(--tactile-text)]",
                    Icon && "pl-12"
                )}
            />
        </div>
    </div>
)

export const normalizeText = (text: string) => {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export const TactileSelect = ({ label, value, onChange, options, icon: Icon, disabled, searchable = true }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedOption = options.find((opt: any) => opt.value === value);

    const filteredOptions = searchable
        ? options.filter((opt: any) => opt.isHeader || normalizeText(opt.label).includes(normalizeText(searchQuery)))
        : options;

    return (
        <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
            {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">{label}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl h-12 text-sm font-bold px-4 flex items-center justify-between group-focus-within:border-primary/50 transition-all text-left",
                        isOpen && "border-primary/50 bg-[var(--tactile-inner-bg-alt)]",
                        Icon && "pl-12"
                    )}
                >
                    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                    <span className="truncate flex-1">
                        {selectedOption ? selectedOption.label : 'Seleccionar...'}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100]" 
                                onClick={() => { setIsOpen(false); setSearchQuery(''); }} 
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-[var(--tactile-dropdown-bg)] backdrop-blur-2xl border border-[var(--tactile-border-strong)] rounded-xl shadow-2xl z-[110] overflow-hidden flex flex-col max-h-[350px]"
                            >
                                {searchable && (
                                    <div className="p-2 border-b border-[var(--tactile-border)] sticky top-0 bg-transparent z-10">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Buscar..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="overflow-y-auto custom-scrollbar p-1">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt: any, i: number) => (
                                            opt.isHeader ? (
                                                <div 
                                                    key={`header-${i}`} 
                                                    className="px-4 py-2 text-[8px] font-black capitalize tracking-[0.2em] text-primary/60 border-t border-[var(--tactile-border)] first:border-0 mt-3 first:mt-1 bg-[var(--tactile-item-hover)] rounded-lg mb-1"
                                                >
                                                    {opt.label}
                                                </div>
                                            ) : (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    className={cn(
                                                        "w-full px-4 py-2.5 text-xs font-bold text-left rounded-xl transition-all flex items-center gap-3 group/opt",
                                                        value === opt.value ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-[var(--tactile-item-hover)] hover:text-foreground"
                                                    )}
                                                    onClick={() => {
                                                        onChange(opt.value);
                                                        setIsOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {opt.avatar ? (
                                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--tactile-border-strong)] shrink-0">
                                                                <img src={opt.avatar} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ) : (
                                                            !opt.isHeader && <div className="w-6 h-6 rounded-full bg-[var(--tactile-item-hover)] border border-[var(--tactile-border)] shrink-0 flex items-center justify-center text-[8px] text-foreground/40">{opt.label?.charAt(0)}</div>
                                                        )}
                                                        <span className="truncate">{opt.label}</span>
                                                    </div>
                                                    {value === opt.value && <Check className="w-3.5 h-3.5" />}
                                                </button>
                                            )
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-[10px] font-black capitalize tracking-widest text-muted-foreground ">
                                            Sin resultados
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const GOOGLE_FONTS_COLLECTION = [
    { isHeader: true, label: 'Modern Sans (Limpias)' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Sora', label: 'Sora' },
    { value: 'Lexend', label: 'Lexend' },
    { value: 'Urbanist', label: 'Urbanist' },
    { value: 'Rubik', label: 'Rubik' },
    { value: 'Work Sans', label: 'Work Sans' },
    { value: 'Manrope', label: 'Manrope' },
    { value: 'Jost', label: 'Jost' },
    { isHeader: true, label: 'Elegant Serif (Distinción)' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Lora', label: 'Lora' },
    { value: 'EB Garamond', label: 'EB Garamond' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
    { value: 'Cinzel', label: 'Cinzel' },
    { value: 'Frank Ruhl Libre', label: 'Frank Ruhl Libre' },
    { isHeader: true, label: 'Visual Display (Alto Impacto)' },
    { value: 'Orbitron', label: 'Orbitron' },
    { value: 'Black Ops One', label: 'Black Ops One' },
    { value: 'Syne', label: 'Syne' },
    { value: 'Righteous', label: 'Righteous' },
    { value: 'Unbounded', label: 'Unbounded' },
    { value: 'Bungee', label: 'Bungee' },
    { value: 'Passion One', label: 'Passion One' },
    { value: 'Syncopate', label: 'Syncopate' },
    { value: 'Chakra Petch', label: 'Chakra Petch' },
    { value: 'Space Grotesk', label: 'Space Grotesk' },
    { value: 'Bruno Ace', label: 'Bruno Ace' },
    { value: 'Michroma', label: 'Michroma' },
];

export const TactileFontSelect = ({ label, value, onChange, icon: Icon, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const options = GOOGLE_FONTS_COLLECTION;
    const selectedOption = options.find((opt: any) => opt.value === value);

    const filteredOptions = options.filter((opt: any) => 
        opt.isHeader || normalizeText(opt.label).includes(normalizeText(searchQuery))
    );

    const loadFont = (fontName: string) => {
        const id = `font-preview-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;
            document.head.appendChild(link);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(-1);
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => {
                    let next = prev + 1;
                    while (next < filteredOptions.length && filteredOptions[next].isHeader) next++;
                    return next < filteredOptions.length ? next : prev;
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => {
                    let next = prev - 1;
                    while (next >= 0 && filteredOptions[next].isHeader) next--;
                    return next >= 0 ? next : prev;
                });
            } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                const opt = filteredOptions[activeIndex];
                if (!opt.isHeader) {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchQuery('');
                }
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, filteredOptions, onChange]);

    useEffect(() => {
        if (isOpen) {
            if (selectedOption?.value) loadFont(selectedOption.value);
            filteredOptions.slice(0, 15).forEach(opt => {
                if (!opt.isHeader && opt.value) loadFont(opt.value);
            });
        }
    }, [isOpen, filteredOptions, selectedOption]);

    return (
        <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
            {label && <label className="text-[9px] font-black capitalize tracking-[0.2em] text-muted-foreground ml-2">{label}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-xl h-11 text-sm font-bold px-4 flex items-center justify-between group-focus-within:border-primary/50 transition-all text-left",
                        isOpen && "border-primary/50 bg-[var(--tactile-inner-bg-alt)]",
                        Icon && "pl-12"
                    )}
                >
                    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                    <div className="flex flex-col flex-1 truncate">
                        <span className="text-[8px] opacity-40 capitalize tracking-widest font-black mb-0.5">Tipografía Activa</span>
                        <span className="truncate text-xl lg:text-2xl leading-tight" style={{ fontFamily: selectedOption?.value || 'inherit' }}>
                            {selectedOption ? selectedOption.label : 'Seleccionar Fuente...'}
                        </span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100]" 
                                onClick={() => { setIsOpen(false); setSearchQuery(''); }} 
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-[var(--tactile-dropdown-bg)] backdrop-blur-2xl border border-[var(--tactile-border-strong)] rounded-xl shadow-2xl z-[110] overflow-hidden flex flex-col max-h-[450px]"
                            >
                                <div className="p-3 border-b border-[var(--tactile-border-strong)] sticky top-0 bg-transparent z-10 backdrop-blur-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Buscar fuente... (↑ ↓ Enter)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border-strong)] rounded-xl pl-9 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-y-auto custom-scrollbar p-1">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt: any, i: number) => (
                                            opt.isHeader ? (
                                                <div 
                                                    key={`header-${i}`} 
                                                    className="px-4 py-2 text-[8px] font-black capitalize tracking-[0.2em] text-primary/60 border-t border-[var(--tactile-border)] first:border-0 mt-3 first:mt-1 bg-[var(--tactile-item-hover)] rounded-lg mb-1"
                                                >
                                                    {opt.label}
                                                </div>
                                            ) : (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onMouseEnter={() => {
                                                        loadFont(opt.value);
                                                        setActiveIndex(i);
                                                    }}
                                                    className={cn(
                                                        "w-full px-4 py-4 text-left rounded-xl transition-all flex items-center justify-between group/opt",
                                                        (value === opt.value || activeIndex === i) ? "bg-primary/20 text-foreground" : "text-foreground/60 hover:bg-[var(--tactile-item-hover)] hover:text-foreground"
                                                    )}
                                                    onClick={() => {
                                                        onChange(opt.value);
                                                        setIsOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="text-[10px] opacity-40 font-mono tracking-tighter mb-1">Muestra Técnica</span>
                                                        <span style={{ fontFamily: opt.value }} className="text-2xl leading-none truncate pr-4">
                                                            {opt.label}
                                                        </span>
                                                    </div>
                                                    {(value === opt.value) && (
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-muted-foreground font-black capitalize tracking-widest text-[10px]">
                                            Sin resultados
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- RESTORED GRAPHIC COMPONENTS ---
export const TactileBarChart = ({ data, color = "#dca54e" }: any) => (
    <div className="flex items-end gap-1.5 h-full w-full px-2 pb-4">
        {data && data.length > 0 ? data.map((item: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar h-full justify-end">
                <div className="relative w-full flex-1 flex items-end">
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / Math.max(...data.map((d: any) => d.value || 1))) * 100}%` }}
                        className="w-full rounded-t-lg bg-opacity-20 group-hover/bar:bg-opacity-40 transition-all relative overflow-hidden"
                        style={{ backgroundColor: color }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                    </motion.div>
                </div>
                <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground">{item.label}</span>
            </div>
        )) : null}
    </div>
);

export const TactileAreaChart = ({ data, color = "#dca54e" }: any) => (
    <div className="relative w-full h-40 bg-black/20 rounded-2xl border border-white/5 overflow-hidden p-2">
        <div className="absolute inset-0 dots-pattern opacity-10" />
        <div className="relative z-10 w-full h-full flex items-end gap-0.5">
            {data && data.length > 0 ? data.map((item: any, i: number) => (
                <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${item.value || 0}%` }}
                    className="flex-1"
                    style={{ 
                        backgroundColor: color, 
                        opacity: 0.1 + ((item.value || 0) / 100),
                        boxShadow: `0 0 10px ${color}11`
                    }}
                />
            )) : null}
        </div>
    </div>
);
