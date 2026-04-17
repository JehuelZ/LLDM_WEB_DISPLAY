'use client';
import { useAppStore } from '@/lib/store';
import { NeonForgeWeatherWidget } from './NeonForgeWeatherWidget';

export function NeonForgeBackground() {
    const settings = useAppStore((state) => state.settings);
    const isCustom = settings?.displayBgMode === 'custom';

    return (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {isCustom && settings.displayCustomBgUrl ? (
                <div 
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${settings.displayCustomBgUrl})`,
                        mixBlendMode: 'screen',
                        opacity: settings.displayBgStyle === 'dynamic' ? 0.4 : 0.8
                    }}
                />
            ) : (
                <>
                    {/* Cyberpunk Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                            backgroundSize: '100px 100px',
                            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)'
                        }}
                    />

                    {/* Neon Glows */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-md" />
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-md" />

                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
                </>
            )}

            <NeonForgeWeatherWidget />
        </div>
    );
}
