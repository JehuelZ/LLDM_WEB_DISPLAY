import { useAppStore } from '@/lib/store';

export const MidnightGlowBackground = () => {
    const settings = useAppStore((state) => state.settings);
    const isCustom = settings?.displayBgMode === 'custom';

    return (
        <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
            {isCustom && settings.displayCustomBgUrl ? (
                <div 
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${settings.displayCustomBgUrl})`,
                        opacity: settings.displayBgStyle === 'dynamic' ? 0.6 : 1
                    }}
                />
            ) : (
                <>
                    {/* Mesh Gradient Orbs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                </>
            )}

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
};
