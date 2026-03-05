'use client';

export const DarkMinimalProgress = ({ slides, currentSlide }: { slides?: any[], currentSlide: number }) => {
    if (!slides || slides.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex gap-2 pointer-events-none">
            {slides.map((_, i) => (
                <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide
                            ? 'w-8 bg-[#3B82F6]'
                            : 'w-2 bg-[#23242F]'
                        }`}
                />
            ))}
        </div>
    );
};
