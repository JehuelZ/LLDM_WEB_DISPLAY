'use client';

import { useAppStore } from '@/lib/store';
import { Calendar, Sun, Clock, BookOpen, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicSchedule() {
  const { settings } = useAppStore();
  const churchCity = settings.churchCity || 'Rodeo';

  const services = [
    {
      time: '5:00 AM',
      title: 'Oración Matutina',
      desc: 'Primera oración del día para consagrar la jornada en gratitud y comunión con Dios.',
      days: 'Lunes a Domingo',
      badge: 'Diario',
      icon: Sun,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
    {
      time: '9:00 AM',
      title: 'Consagración y Estudio Bíblico',
      desc: 'Oración de consagración y estudio de las doctrinas cristianas fundamentales.',
      days: 'Lunes a Domingo',
      badge: 'Mañana',
      icon: BookOpen,
      color: 'from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30',
    },
    {
      time: '6:00 PM',
      title: 'Oración de la Tarde',
      desc: 'Servicio de alabanza, oración y predicación de la palabra de Dios.',
      days: 'Lunes a Domingo (6:00 PM / 7:00 PM)',
      badge: 'Principal',
      icon: Clock,
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <section id="horarios" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Horarios Públicos de Oración</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nuestras Reuniones de Oración en {churchCity}
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Te invitamos cordialmente a acompañarnos en nuestras oraciones diarias y reuniones espirituales. Todas nuestras reuniones están abiertas a las visitas.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white/[0.03] border border-white/8 hover:border-orange-500/30 rounded-3xl p-8 backdrop-blur-xl transition-all hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Top Badge & Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                      {item.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{item.days}</span>
                    </div>
                  </div>

                  {/* Icon & Big Time */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white block tracking-tight">{item.time}</span>
                      <h3 className="text-lg font-bold text-orange-400 leading-tight">{item.title}</h3>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Abierto a Todo Público</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note banner for visitors */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-center max-w-2xl mx-auto backdrop-blur-md">
          <p className="text-xs sm:text-sm text-orange-300 font-medium">
            💡 <span className="font-bold">¿Primera vez que nos visitas?</span> No necesitas reservación previa. Si deseas más detalles sobre nuestras reuniones, puedes hablar con nuestro Ministro o contactarnos directamente.
          </p>
        </div>
      </div>
    </section>
  );
}
