import { useAppStore } from '@/lib/store';
import { getIglesiaTokens } from './tokens';

export function IglesiaBackground() {
    const settings = useAppStore((state) => state.settings);
    const iglesiaVariant = settings.iglesiaVariant || 'light';
    const T = getIglesiaTokens(iglesiaVariant);
    const isCustom = settings?.displayBgMode === 'custom';

    return (
        <div
            className="absolute inset-0 z-0 overflow-hidden transition-colors duration-700"
            style={{ backgroundColor: isCustom ? '#000' : T.bg }}
        >
            {isCustom && settings.displayCustomBgUrl ? (
                <div 
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${settings.displayCustomBgUrl})`,
                        opacity: settings.displayBgStyle === 'dynamic' ? 0.8 : 1
                    }}
                />
            ) : (
                <>
                    {/* Unified aesthetic: No gradients, just a subtle structural frame */}
                    <div
                        className="absolute inset-8 border rounded-[2rem] pointer-events-none transition-colors duration-700"
                        style={{ borderColor: T.border }}
                    />
                </>
            )}
        </div>
    );
}
