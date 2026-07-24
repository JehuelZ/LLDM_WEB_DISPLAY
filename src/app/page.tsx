'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicHero } from '@/components/public/PublicHero';
import { PublicAbout } from '@/components/public/PublicAbout';
import { PublicSchedule } from '@/components/public/PublicSchedule';
import { PublicContact } from '@/components/public/PublicContact';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Wrench, ShieldCheck, Monitor, Sparkles, Church, Phone, MapPin, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

function MaintenanceView() {
  const { settings } = useAppStore();
  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';

  const title = settings.publicHomeMaintenanceTitle || 'Sitio Web en Mantenimiento';
  const message = settings.publicHomeMaintenanceMessage || 'Estamos realizando mejoras en nuestro sitio web oficial. Por favor regresa muy pronto.';
  const phone = settings.publicHomeContactPhone || '(510) 000-0000';
  const address = settings.publicHomeAddress || 'Rodeo, CA';

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center p-2">
            <img
              src={settings.churchLogoUrl || '/flama-oficial.svg'}
              alt="LLDM"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-white block leading-none">LLDM {churchName}</span>
            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">La Luz del Mundo</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Mantenimiento Activo
          </span>
        </div>
      </header>

      {/* Center Maintenance Card */}
      <main className="max-w-2xl mx-auto w-full text-center space-y-8 py-12 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-6"
        >
          {/* Flame / Wrench Icon Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              <img
                src={settings.churchLogoUrl || '/flama-oficial.svg'}
                alt="FLAMA"
                className="w-10 h-10 object-contain animate-pulse"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center border-2 border-[#06060a]">
              <Wrench className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              {message}
            </p>
          </div>

          {/* Quick Member Access Buttons */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/portal"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portal del Miembro</span>
            </a>

            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <span>Pantallas TV</span>
            </a>
          </div>

          {/* Contact Details */}
          {(phone || address) && (
            <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-white/40 border-t border-white/5">
              {address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-center sm:text-left text-xs text-white/30 relative z-10 border-t border-white/5">
        <p>© {new Date().getFullYear()} La Luz del Mundo — Congregación {churchName}. Todos los derechos reservados.</p>
        <a
          href="/admin"
          className="text-white/30 hover:text-orange-400 transition-colors flex items-center gap-1 text-[11px]"
        >
          <Lock className="w-3 h-3" />
          <span>Acceso Administración</span>
        </a>
      </footer>
    </div>
  );
}

export default function HomePage() {
  const { settings, loadSettingsFromCloud } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadSettingsFromCloud();
  }, [loadSettingsFromCloud]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-orange-400/40 border-t-orange-400 rounded-full animate-spin" />
      </div>
    );
  }

  // If maintenance mode is active (default true), render maintenance view
  if (settings.publicHomeMaintenanceMode) {
    return <MaintenanceView />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-orange-500/30 selection:text-orange-300 font-sans antialiased overflow-x-hidden">
      {/* Navigation Bar */}
      <PublicHeader />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <PublicHero />

        {/* About & Minister Welcome Section */}
        <PublicAbout />

        {/* Public Worship Schedule */}
        <PublicSchedule />

        {/* Location & Contact Info */}
        <PublicContact />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
