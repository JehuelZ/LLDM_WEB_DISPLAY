'use client';

import { useAppStore } from '@/lib/store';
import { MapPin, Phone, ExternalLink, Mail, Church, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicContact() {
  const { settings } = useAppStore();

  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';
  const address = settings.publicHomeAddress || `${churchName}, California, EE. UU.`;
  const phone = settings.publicHomeContactPhone || '(510) 000-0000';
  const mapsUrl = settings.publicHomeMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const badge = settings.publicHomeContactBadge || 'Ubicación y Contacto';
  const title = settings.publicHomeContactTitle || `Visítanos en ${churchName}`;
  const subtitle = settings.publicHomeContactSubtitle || 'Estamos ubicados para atenderte y recibirte con los brazos abiertos. A continuación puedes consultar nuestra dirección y canal telefónico de atención.';
  const addressLabel = settings.publicHomeAddressLabel || 'Dirección';
  const phoneLabel = settings.publicHomePhoneLabel || 'Teléfono de Atención';
  const mapsBtnText = settings.publicHomeMapsBtnText || 'Abrir en Google Maps';

  return (
    <section id="contacto" className="py-24 relative z-10 bg-[#0a0a0f]/80 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 backdrop-blur-xl space-y-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Church className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">Iglesia La Luz del Mundo</h3>
                  <span className="text-xs text-white/40 font-medium">{churchName}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{addressLabel}</span>
                    <p className="text-white/90 text-sm font-semibold mt-0.5">{address}</p>
                  </div>
                </div>

                {phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{phoneLabel}</span>
                      <p className="text-white/90 text-sm font-semibold mt-0.5">{phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{mapsBtnText}</span>
              </a>
            </div>
          </motion.div>

          {/* Embed Google Maps or Fallback View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[320px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl"
          >
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[320px] border-0 filter grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
