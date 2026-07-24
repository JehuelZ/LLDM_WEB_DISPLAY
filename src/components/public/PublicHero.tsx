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
  const ctaMemberText = settings.publicHomeHeroCtaMember || 'Acceso a Miembros';
  const badgeText = settings.publicHomeBadgeText || 'La Restauración de la Primitiva Iglesia Cristiana';
  const badgeAlign = settings.publicHomeBadgeAlign || 'center';
  const titleAlign = settings.publicHomeTitleAlign || 'center';
  const subtitleAlign = settings.publicHomeSubtitleAlign || 'center';
  const ctaAlign = settings.publicHomeCtaAlign || 'center';
  const ctaColor = settings.publicHomeCtaColor || 'orange';
  const ctaStyle = settings.publicHomeCtaStyle || 'rounded';

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25';
      case 'emerald': return 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-emerald-500/25';
      case 'purple': return 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-purple-500/25';
      case 'ruby': return 'bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white shadow-rose-500/25';
      case 'gold': return 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black shadow-amber-500/25';
      case 'monochrome': return 'bg-white text-slate-950 font-black hover:bg-slate-200 shadow-white/20';
      default: return 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25';
    }
  };

  const getStyleClass = (style: string) => {
    switch (style) {
      case 'pill': return 'rounded-full';
      case 'square': return 'rounded-md';
      case 'glass': return 'rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white';
      default: return 'rounded-2xl';
    }
  };

  const ctaColorClass = getColorClass(ctaColor);
  const ctaShapeClass = getStyleClass(ctaStyle);

  const getAlignClass = (align: string) => {
    if (align === 'left') return 'text-left justify-start items-start';
    if (align === 'right') return 'text-right justify-end items-end';
    return 'text-center justify-center items-center';
  };

  return (
    <section id="inicio" className="relative flex items-center justify-center pt-24 pb-10 sm:pt-28 sm:pb-14 overflow-hidden">
      {/* Background Image & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Templo"
          className="w-full h-full object-cover scale-105 filter brightness-[0.65] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 w-full">
        {/* Emblem / Badge */}
        <div className={`flex ${getAlignClass(badgeAlign)}`}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-orange-500/30 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-orange-300 uppercase tracking-widest">
              {badgeText}
            </span>
          </motion.div>
        </div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] ${getAlignClass(titleAlign)}`}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`max-w-2xl text-base sm:text-lg text-white/70 font-normal leading-relaxed ${subtitleAlign === 'left' ? 'mr-auto text-left' : subtitleAlign === 'right' ? 'ml-auto text-right' : 'mx-auto text-center'}`}
        >
          {subtitle}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`flex flex-col sm:flex-row items-center gap-4 pt-4 ${ctaAlign === 'left' ? 'sm:justify-start' : ctaAlign === 'right' ? 'sm:justify-end' : 'sm:justify-center'}`}
        >
          <a
            href="#horarios"
            className={`w-full sm:w-auto px-8 py-4 ${ctaColorClass} ${ctaShapeClass} font-extrabold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider`}
          >
            <Calendar className="w-4 h-4" />
            <span>{ctaText}</span>
          </a>

          <a
            href="/portal"
            className={`w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md text-white font-bold text-sm ${ctaShapeClass} transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>{ctaMemberText}</span>
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
