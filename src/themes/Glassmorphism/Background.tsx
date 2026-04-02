import { useAppStore } from '@/lib/store';

export const GlassmorphismBackground = () => {
    const settings = useAppStore((state) => state.settings);
    const isCustom = settings?.displayBgMode === 'custom';

    return (
        <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
            {isCustom && settings.displayCustomBgUrl ? (
                <div 
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${settings.displayCustomBgUrl})`,
                        opacity: settings.displayBgStyle === 'dynamic' ? 0.7 : 1
                    }}
                />
            ) : (
                <>
                    {/* Dynamic Background Shapes */}
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[35%] h-[35%] bg-emerald-500/5 rounded-full blur-[100px]" />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 dots-pattern opacity-20" />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/20" />
                </>
            )}
        </div>
    );
};
