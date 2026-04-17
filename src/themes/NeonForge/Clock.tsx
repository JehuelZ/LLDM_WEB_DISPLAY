'use client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────
// Clock — NeonForge theme
// Position: Top-left horizontal bar with logo
// Style: Compact lime-accented time pill
// ─────────────────────────────────────────────

export function NeonForgeClock({ now, isMounted, settings }: { now: Date; isMounted: boolean; settings: any }) {
    if (!isMounted) return null;

    const timeStr = format(now, 'HH:mm');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const dateStr = format(now, "EEEE, d 'de' MMMM", { locale: es });
    const logoUrl = settings?.churchLogoUrl || null;
    const icon = settings?.churchIcon || 'cross';

    const secondsPct = (now.getSeconds() / 60) * 100;

    return (
        <div className="absolute top-5 left-6 z-50 flex flex-col items-start gap-4">
            {/* Logo/Icon Area with Vertical Accent */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ 
                        background: 'linear-gradient(135deg, #181818 0%, #0a0a0a 100%)', 
                        border: '1.5px solid #BBFF0030',
                        boxShadow: '0 0 20px #BBFF0010' 
                    }}>
                    <img 
                        src={settings?.churchLogoUrl ?? "/flama-oficial.svg"} 
                        alt="" 
                        className="w-full h-full object-contain p-2" 
                        style={{ filter: !settings?.churchLogoUrl ? 'brightness(0) invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg)' : 'none' }}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        Iglesia Local
                    </span>
                    <div className="h-0.5 w-8 mt-1" style={{ background: '#BBFF00' }} />
                </div>
            </div>

            {/* Time Pillar */}
            <div className="flex flex-col pl-1">
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tighter leading-none" 
                        style={{ color: '#BBFF00', fontFamily: 'var(--font-sora, ui-sans-serif)', textShadow: '0 0 30px #BBFF0040' }}>
                        {timeStr}
                    </span>
                    
                    {/* Compact Seconds Indicator */}
                    <div className="flex flex-col items-center mb-1">
                        <span className="text-[12px] font-black tabular-nums" style={{ color: 'white' }}>
                            {seconds}
                        </span>
                        <div className="w-1 h-4 rounded-full overflow-hidden bg-white/10 mt-1">
                            <motion.div 
                                className="w-full bg-[#BBFF00]"
                                initial={{ height: 0 }}
                                animate={{ height: `${secondsPct}%` }}
                                transition={{ ease: 'linear' }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Date vertical shift */}
                <div className="mt-3 flex items-center gap-3">
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#606060] whitespace-nowrap">
                        {dateStr}
                    </span>
                    <div className="h-px flex-1 min-w-[40px]" style={{ background: 'linear-gradient(to right, #606060, transparent)' }} />
                </div>
            </div>
        </div>
    );
}
