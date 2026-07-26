'use client';

import { useAppStore } from '@/lib/store';
import { MapPin, Phone, Mail, ExternalLink, Compass, PhoneCall, Sparkles, Navigation, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublicContact() {
  const { settings } = useAppStore();

  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';
  const address = settings.publicHomeAddress || `${churchName}, California, EE. UU.`;
  const phone = settings.publicHomeContactPhone;
  const email = settings.publicHomeContactEmail;
  const emailLabel = settings.publicHomeEmailLabel || 'Correo Electrónico';
  const mapsUrl = settings.publicHomeMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const badge = settings.publicHomeContactBadge || 'Ubicación y Contacto';
  const title = settings.publicHomeContactTitle || `Visítanos en ${churchName}`;
  const subtitle = settings.publicHomeContactSubtitle || 'Estamos ubicados para atenderte y recibirte con los brazos abiertos. A continuación puedes consultar nuestra dirección y canal telefónico de atención.';
  const headerName = settings.publicHomeContactHeaderName || 'La Luz del Mundo';
  const headerSub = settings.publicHomeContactHeaderSub || settings.mainChurchName || settings.churchCity || 'Principal (Rodeo CA)';
  const addressLabel = settings.publicHomeAddressLabel || 'Dirección';
  const phoneLabel = settings.publicHomePhoneLabel || 'Teléfono de Atención';
  const mapsBtnText = settings.publicHomeMapsBtnText || 'Abrir Dirección en Google Maps';
  const logoUrl = settings.churchOfficialLogoUrl || settings.churchLogoUrl || '/flame_logo_premium.png';

  return (
    <section id="contacto" className="py-24 relative z-10 bg-[#07070b] border-t border-white/5 overflow-hidden">
      {/* Subtle Glow Overlays */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Compass className="w-4 h-4 text-orange-400" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Contact Info & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white/[0.03] border border-white/10 hover:border-orange-500/30 rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 shadow-2xl flex flex-col justify-between group"
          >
            <div className="space-y-8">
              {/* Header Card Branding */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 p-2.5 shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
                  <img src={logoUrl} alt="La Luz del Mundo" className="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white leading-tight">{headerName}</h3>
                  <p className="text-xs font-semibold text-orange-400/90 tracking-wide uppercase mt-0.5">{headerSub}</p>
                </div>
              </div>

              {/* Info Items */}
              <div className="space-y-6">
                {/* Address Item */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{addressLabel}</span>
                    <p className="text-white text-sm sm:text-base font-bold leading-snug">{address}</p>
                  </div>
                </div>

                {/* Phone Item */}
                {phone && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{phoneLabel}</span>
                      <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-emerald-400 hover:text-emerald-300 text-sm sm:text-base font-bold leading-snug transition-colors flex items-center gap-1.5">
                        <span>{phone}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Email Item (Only rendered if configured by admin) */}
                {email && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{emailLabel}</span>
                      <a href={`mailto:${email}`} className="text-cyan-400 hover:text-cyan-300 text-sm sm:text-base font-bold leading-snug transition-colors flex items-center gap-1.5 break-all">
                        <span>{email}</span>
                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 space-y-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <Navigation className="w-4 h-4" />
                <span>{mapsBtnText}</span>
              </a>

              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-white/80 hover:text-white"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Llamar por Teléfono</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Embedded Map Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl group flex flex-col justify-end"
          >
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full border-0 filter grayscale contrast-125 brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
              loading="lazy"
            />

            {/* Map Overlay Badge */}
            <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-[#07070b] via-[#07070b]/80 to-transparent pointer-events-none">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl text-white text-xs font-bold shadow-xl pointer-events-auto">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate">{address}</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all shrink-0 flex items-center gap-1"
                >
                  <span>Abrir GPS</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
