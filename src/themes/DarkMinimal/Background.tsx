export const DarkMinimalBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-black">
            {/* Very subtle vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

            {/* Minimal dot pattern */}
            <div className="absolute inset-0 opacity-[0.05] dots-pattern" />
        </div>
    );
};
