'use client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
        <div className="absolute top-5 left-6 z-50 flex items-center gap-4">
            {/* Logo/Icon */}
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ background: '#181818', border: '1px solid #252525' }}>
                <img 
                    src={settings?.churchLogoUrl || "/flama-oficial.svg"} 
                    alt="" 
                    className="w-full h-full object-contain p-1" 
                    style={{ filter: !settings?.churchLogoUrl ? 'brightness(0) invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg)' : 'none' }}
                />
            </div>

            {/* Divider */}
            <div className="w-px h-8" style={{ background: '#252525' }} />

            {/* Time */}
            <div className="flex flex-col">
                <div className="flex items-end gap-1.5">
                    <span className="text-3xl font-black tracking-tight leading-none" style={{ color: '#BBFF00', fontFamily: 'var(--font-sora, ui-sans-serif)' }}>
                        {timeStr}
                    </span>
                    {/* Seconds progress arc */}
                    <div className="relative w-8 h-8 mb-0.5 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="12" fill="none" stroke="#1F1F1F" strokeWidth="3" />
                            <circle
                                cx="16" cy="16" r="12" fill="none"
                                stroke="#BBFF00" strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 12}`}
                                strokeDashoffset={`${2 * Math.PI * 12 * (1 - now.getSeconds() / 60)}`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.3s linear' }}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color: '#606060' }}>
                            {seconds}
                        </span>
                    </div>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-widest mt-0.5 capitalize" style={{ color: '#606060' }}>
                    {dateStr}
                </span>
            </div>
        </div>
    );
}
