'use client';

import { useAppStore } from '@/lib/store';
import { BookOpen, Heart, Shield, Users, Sparkles, Quote, ImageIcon } from 'lucide-react';
import { ChurchIcon as Church } from '@/components/ui/ChurchIcon';
import { motion } from 'framer-motion';

export function PublicWelcome() {
  const { settings } = useAppStore();

  const welcomeBadge = settings.publicHomeMinisterBadgeText || 'Bienvenida Oficial';
  const welcomeTitle = settings.publicHomeMinisterWelcomeTitle || '"Nuestras puertas están abiertas para ti"';
  const welcomeText = settings.publicHomeMinisterWelcome || 'Les damos una calurosa bienvenida a la Iglesia La Luz del Mundo en Rodeo, California. Nuestra casa de oración está con las puertas abiertas para todos aquellos que buscan la verdad, la fe y la paz de Dios.';

  const image = settings.publicHomeAboutImage || '';
  const imageMode = settings.publicHomeAboutImageMode || 'side';
  const imagePos = settings.publicHomeAboutImagePos || 'left';
  const bgStyle = settings.publicHomeAboutBgStyle || 'glass';

  const bgClasses = bgStyle === 'light'
    ? 'bg-gradient-to-b from-[#0f172a] via-[#1e293b]/90 to-[#0a0a0f] border-y border-white/10'
    : bgStyle === 'dark'
    ? 'bg-[#060810] border-y border-white/5'
    : 'bg-[#0a0a0f]/80 backdrop-blur-xl border-y border-white/10';

  return (
    <section id="nosotros" className={`py-16 relative z-10 overflow-hidden ${bgClasses}`}>
      {/* Background Image Mode */}
      {imageMode === 'bg' && image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt="Fondo Sección" className="w-full h-full object-cover opacity-20 filter brightness-[0.7]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minister Welcome Message + Optional Side Image Companion (Frameless) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative grid grid-cols-1 ${
            imageMode === 'side' && image ? 'lg:grid-cols-12 gap-10 items-center' : ''
          }`}
        >
          <div className="absolute -top-4 right-0 text-orange-500/5 pointer-events-none">
            <Quote className="w-40 h-40" />
          </div>

          {/* Optional Side Image Column */}
          {imageMode === 'side' && image && (
            <div className={`shrink-0 lg:col-span-5 ${imagePos === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative aspect-4/3 lg:aspect-4/3 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src={image}
                  alt="Imagen de Acompañamiento"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}

          {/* Card Text Column */}
          <div className={`relative z-10 ${imageMode === 'side' && image ? 'lg:col-span-7' : 'w-full'}`}>
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{welcomeBadge}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {welcomeTitle}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                "{welcomeText}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PublicPrinciples() {
  const { settings } = useAppStore();

  const principlesBadge = settings.publicHomePrinciplesBadge || 'Nuestros Principios';
  const aboutTitle = settings.publicHomeAboutTitle || 'Nuestra Fe y Principios';
  const aboutText = settings.publicHomeAboutText || 'Somos una comunidad cristiana comprometida con los principios y enseñanzas bíblicas de la iglesia primitiva, promoviendo el amor fraternal, la fe y el respeto a la sociedad.';
  const principlesImage = settings.publicHomePrinciplesImage || '';
  const titleAlign = settings.publicHomeAboutTitleAlign || 'center';
  const textAlign = settings.publicHomeAboutTextAlign || 'center';

  const getAlignClass = (align: string) => {
    if (align === 'left') return 'text-left justify-start items-start mr-auto';
    if (align === 'right') return 'text-right justify-end items-end ml-auto';
    return 'text-center justify-center items-center mx-auto';
  };

  const values = [
    {
      title: settings.publicHomeValue1Title || 'Fe y Doctrina Cristiana',
      desc: settings.publicHomeValue1Desc || 'Fundamentados en las Sagradas Escrituras y el evangelio de Jesucristo.',
      icon: BookOpen,
      color: 'from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30',
    },
    {
      title: settings.publicHomeValue2Title || 'Amor Fraternal y Comunión',
      desc: settings.publicHomeValue2Desc || 'Promovemos la unidad de los creyentes y el apoyo solidario a las familias.',
      icon: Heart,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    },
    {
      title: settings.publicHomeValue3Title || 'Valores Morales y Civiles',
      desc: settings.publicHomeValue3Desc || 'Fomentamos el respeto a las autoridades, la paz y la dignidad humana.',
      icon: Shield,
      color: 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30',
    },
    {
      title: settings.publicHomeValue4Title || 'Comunidad Abierta',
      desc: settings.publicHomeValue4Desc || 'Recibimos cordialmente a todos aquellos que deseen acercarse a Dios.',
      icon: Users,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section id="principios" className="py-20 relative z-10 bg-[#0f172a] border-t border-b border-white/10 shadow-2xl overflow-hidden">
      {/* Background Image for Principles Section */}
      {principlesImage && (
        <div className="absolute inset-0 z-0">
          <img src={principlesImage} alt="Fondo Principios" className="w-full h-full object-cover opacity-15 filter brightness-[0.8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-[#0f172a]" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header: About & Values */}
        <div className={`space-y-4 max-w-3xl flex flex-col ${getAlignClass(titleAlign)}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{principlesBadge}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-white tracking-tight w-full ${titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : 'text-center'}`}>
            {aboutTitle}
          </h2>
          <p className={`text-white/70 text-base leading-relaxed w-full ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}>
            {aboutText}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-900/80 border border-slate-700/50 hover:border-orange-500/30 rounded-2xl p-6 shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PublicAbout() {
  return (
    <>
      <PublicWelcome />
      <PublicPrinciples />
    </>
  );
}
