'use client';

import { useAppStore } from '@/lib/store';
import { BookOpen, Heart, Shield, Users, Church, Sparkles, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicAbout() {
  const { settings } = useAppStore();

  const ministerName = settings.ministerName || 'Ministro a Cargo';
  const welcomeText = settings.publicHomeMinisterWelcome || 'Les damos una calurosa bienvenida a nuestra congregación en Rodeo, California. Nuestra iglesia está con las puertas abiertas para todos aquellos que buscan la verdad, la fe y la paz de Dios.';
  const aboutTitle = settings.publicHomeAboutTitle || 'Nuestra Fe y Principios';
  const aboutText = settings.publicHomeAboutText || 'Somos una comunidad cristiana comprometida con los principios y enseñanzas bíblicas de la iglesia primitiva, promoviendo el amor fraternal, la fe y el respeto a la sociedad.';

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
    <section id="nosotros" className="py-24 relative z-10 bg-[#0a0a0f]/60 backdrop-blur-md border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Minister Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-8 sm:p-12 overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-6 right-8 text-orange-500/10 pointer-events-none">
            <Quote className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Minister Avatar / Emblem */}
            <div className="shrink-0 text-center space-y-3">
              <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                {settings.ministerAvatar ? (
                  <img
                    src={settings.ministerAvatar}
                    alt={ministerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#12121a] flex items-center justify-center text-orange-400">
                    <Church className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white font-bold text-base leading-tight">{ministerName}</h4>
                <span className="text-xs text-orange-400/80 font-medium">Ministro a Cargo</span>
              </div>
            </div>

            {/* Welcome Quote Text */}
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Bienvenida Oficial
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                "Nuestras puertas están abiertas para ti"
              </h3>
              <p className="text-white/70 text-base leading-relaxed italic">
                "{welcomeText}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Header: About & Values */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuestros Principios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {aboutTitle}
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
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
