'use client';
import { motion } from 'framer-motion';

export const GlassmorphismProgress = ({ slides, currentSlide }: { slides: any[], currentSlide: number }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full h-[8px] z-[300] bg-black/20 font-sora">
            <motion.div
                key={`progress-${currentSlide}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 20, ease: "linear" }}
                className="bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.6)] h-full backdrop-blur-3xl"
            />

            {/* Nav Points */}
            <div className="absolute inset-x-0 -top-6 flex items-center justify-center gap-14 pointer-events-none">
                {slides.map((slide, idx) => (
                    <motion.div
                        key={slide.id}
                        initial={false}
                        animate={{
                            scale: currentSlide === idx ? 1.0 : 0.6,
                            opacity: currentSlide === idx ? 1 : 0.1
                        }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/40'}`} />
                        <span className={`text-[10px] font-black tracking-[0.4em] uppercase italic transition-all duration-1000 ${currentSlide === idx ? 'text-white drop-shadow-lg' : 'text-white/20'}`}>
                            {slide.id}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
