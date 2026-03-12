'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export const CinematicBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const settings = useAppStore((state) => state.settings);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            opacity: number;

            constructor() {
                if (!canvas) {
                    this.x = 0;
                    this.y = 0;
                } else {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5 - 0.2; // Slow upward drift

                // Color palette based on the cinematic theme (gold, blue, teal)
                const colors = [
                    'rgba(251, 191, 36, ', // gold
                    'rgba(59, 130, 246, ', // blue
                    'rgba(255, 255, 255, ', // white
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                if (!canvas) return;
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.y < 0) this.y = canvas.height;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            {/* Cinematic Base Image */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-40">
                <img
                    src="/flama-oficial.svg"
                    className="w-[80%] h-[80%] object-contain opacity-10 filter brightness-150"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Canvas Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 opacity-40 mix-blend-screen"
            />

            {/* The Flame Centerpiece (Blending with particles) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <motion.div
                    animate={{
                        opacity: [0.1, 0.15, 0.1],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[80%] h-[80%] flex items-center justify-center mix-blend-screen"
                >
                    <img
                        src="/flama-oficial.svg"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(251,191,36,0.5)]"
                        alt="Official Flame Logo"
                    />
                </motion.div>
            </div>

            {/* Atmospheric Glows */}
            <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
        </div>
    );
};
