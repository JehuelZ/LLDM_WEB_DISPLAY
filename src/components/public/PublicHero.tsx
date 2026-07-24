'use client';

import { useAppStore } from '@/lib/store';
import { Sparkles, Calendar, ShieldCheck, ChevronDown, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicHero() {
  const { settings } = useAppStore();

  const title = settings.publicHomeTitle || `La Luz del Mundo — ${settings.churchCity || 'Rodeo, CA'}`;
  const subtitle = settings.publicHomeSubtitle || 'Un lugar de fe, comunión y esperanza para toda la familia. Te invitamos a conocer nuestros principios cristianos y unirte a nuestras reuniones de oración.';
  const bgImage = settings.publicHomeHeroBg || settings.displayBgUrl || '/bg_login.png';
  const ctaText = settings.publicHomeCtaText || 'Conoce Nuestras Reuniones';

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Templo"
          className="w-full h-full object-cover scale-105 filter brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]/80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Floating Official Worldwide Church Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 p-3 backdrop-blur-2xl shadow-[0_0_50px_rgba(249,115,22,0.25)] flex items-center justify-center group"
        >
          <img
            src={settings.churchOfficialLogoUrl || '/flame_logo_premium.png'}
            alt="Logo Oficial La Luz del Mundo"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
          />
        </motion.div>

        {/* Emblem / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-orange-500/30 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold text-orange-300 uppercase tracking-widest">
            Iglesia Cristiana Restauracionista
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 font-normal leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a
            href="#horarios"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4" />
            <span>{ctaText}</span>
          </a>

          <a
            href="/portal"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md text-white font-bold text-sm rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Acceso a Miembros</span>
          </a>
        </motion.div>

        {/* Indicator to scroll down */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="pt-12 flex justify-center"
        >
          <a href="#nosotros" className="text-white/30 hover:text-white/70 transition-colors animate-bounce">
            <ChevronDown className="w-8 h-8" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
