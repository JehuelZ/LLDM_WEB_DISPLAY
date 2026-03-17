export const GlassmorphismBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
            {/* Dynamic Background Shapes */}
            <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[20%] w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[100px]" />

            {/* Overlays */}
            <div className="absolute inset-0 dots-pattern opacity-20" />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/20" />
        </div>
    );
};
