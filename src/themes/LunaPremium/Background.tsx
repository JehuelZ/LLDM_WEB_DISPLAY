import React from 'react';
import Sidebar from './Sidebar';

const Background = () => {
    return (
        <>
            <div className="absolute inset-0 w-full h-full overflow-hidden z-[-1] bg-[#0d0d1b] animate-in fade-in duration-1000">
                {/* Base gradient layers for atmospheric depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1b] via-[#121222] to-[#0d0d1b]" />
                
                {/* Kinetic Observatory subtle atmospheric glow */}
                <div className="absolute -top-[25%] -left-[10%] w-[60%] h-[70%] bg-primary/10 rounded-full blur-[160px] animate-pulse pointer-events-none" 
                     style={{ animationDuration: '8s' }} />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[60%] bg-secondary/15 rounded-full blur-[140px] animate-pulse pointer-events-none" 
                     style={{ animationDuration: '10s' }} />
                
                {/* Noise texture for premium technical feel */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
                     style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }} />
            </div>

            {/* Persistent Luna Sidebar (Visible across all slides) */}
            <Sidebar />
        </>
    );
};

export default Background;
