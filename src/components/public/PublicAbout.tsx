'use client';

import { useAppStore } from '@/lib/store';
import { BookOpen, Heart, Shield, Users, Church, Sparkles, Quote, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicAbout() {
  const { settings } = useAppStore();

  const ministerName = settings.ministerName || 'Ministro a Cargo';
  const welcomeBadge = settings.publicHomeMinisterBadgeText || 'Bienvenida Oficial';
  const welcomeTitle = settings.publicHomeMinisterWelcomeTitle || '"Nuestras puertas están abiertas para ti"';
  const welcomeText = settings.publicHomeMinisterWelcome || 'Les damos una calurosa bienvenida a la Iglesia La Luz del Mundo en Rodeo, California. Nuestra casa de oración está con las puertas abiertas para todos aquellos que buscan la verdad, la fe y la paz de Dios.';
  const aboutTitle = settings.publicHomeAboutTitle || 'Nuestra Fe y Principios';
  const aboutText = settings.publicHomeAboutText || 'Somos una comunidad cristiana comprometida con los principios y enseñanzas bíblicas de la iglesia primitiva, promoviendo el amor fraternal, la fe y el respeto a la sociedad.';

  const image = settings.publicHomeAboutImage || '';
  const imageMode = settings.publicHomeAboutImageMode || 'side';
  const imagePos = settings.publicHomeAboutImagePos || 'left';
  const titleAlign = settings.publicHomeAboutTitleAlign || 'center';
  const textAlign = settings.publicHomeAboutTextAlign || 'center';
  const bgStyle = settings.publicHomeAboutBgStyle || 'glass';

  const getAlignClass = (align: string) => {
    if (align === 'left') return 'text-left justify-start items-start mr-auto';
    if (align === 'right') return 'text-right justify-end items-end ml-auto';
    return 'text-center justify-center items-center mx-auto';
  };

  const bgClasses = bgStyle === 'light'
    ? 'bg-gradient-to-b from-[#0f172a] via-[#1e293b]/90 to-[#0a0a0f] border-y border-white/10'
    : bgStyle === 'dark'
    ? 'bg-[#060810] border-y border-white/5'
    : 'bg-[#0a0a0f]/80 backdrop-blur-xl border-y border-white/10';

  const values = [
    {
      title: 'Fe y Doctrina Cristiana',
      desc: 'Fundamentados en las Sagradas Escrituras y el evangelio de Jesucristo.',
      icon: BookOpen,
      color: 'from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30',
    },
    {
      title: 'Amor Fraternal y Comunión',
      desc: 'Promovemos la unidad de los creyentes y el apoyo solidario a las familias.',
      icon: Heart,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Valores Morales y Civiles',
      desc: 'Fomentamos el respeto a las autoridades, la paz y la dignidad humana.',
      icon: Shield,
      color: 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30',
    },
    {
      title: 'Comunidad Abierta',
      desc: 'Recibimos cordialmente a todos aquellos que deseen acercarse a Dios.',
      icon: Users,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section id="nosotros" className={`py-20 relative z-10 overflow-hidden ${bgClasses}`}>
      {/* Background Image Mode */}
      {imageMode === 'bg' && image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt="Fondo Sección" className="w-full h-full object-cover opacity-20 filter brightness-[0.7]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Minister Welcome Card + Optional Side Image Companion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-8 sm:p-12 overflow-hidden backdrop-blur-xl grid grid-cols-1 ${
            imageMode === 'side' && image ? 'lg:grid-cols-12 gap-8 items-center' : ''
          }`}
        >
          <div className="absolute top-6 right-8 text-orange-500/10 pointer-events-none">
            <Quote className="w-32 h-32" />
          </div>

          {/* Optional Side Image Column */}
          {imageMode === 'side' && image && (
            <div className={`shrink-0 lg:col-span-4 ${imagePos === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-2xl group">
                <img
                  src={image}
                  alt="Imagen de Acompañamiento"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}

          {/* Card Text Column */}
          <div className={`relative z-10 ${imageMode === 'side' && image ? 'lg:col-span-8' : 'w-full'}`}>
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                {welcomeBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {welcomeTitle}
              </h3>
              <p className="text-white/70 text-base leading-relaxed italic">
                "{welcomeText}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Header: About & Values */}
        <div className={`space-y-4 max-w-3xl flex flex-col ${getAlignClass(titleAlign)}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuestros Principios</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-white tracking-tight w-full ${titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : 'text-center'}`}>
            {aboutTitle}
          </h2>
          <p className={`text-white/60 text-base leading-relaxed w-full ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}>
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
                className="bg-white/[0.03] border border-white/8 hover:border-white/20 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
