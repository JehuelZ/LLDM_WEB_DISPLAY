'use client';

import { useAppStore } from '@/lib/store';
import { ShieldCheck, Monitor, Facebook, Instagram, Youtube } from 'lucide-react';
import { PWAInstallModal } from '@/components/pwa/PWAInstallModal';
import { useState } from 'react';

export function PublicFooter() {
  const { settings, currentUser } = useAppStore();
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [pwaPlatform, setPwaPlatform] = useState<'android' | 'ios'>('android');

  const openPWAInstall = (platform: 'android' | 'ios') => {
    setPwaPlatform(platform);
    setPwaModalOpen(true);
  };
  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';
  const year = new Date().getFullYear();

  const navInicio = settings.publicHomeNavInicio || 'Inicio';
  const navNosotros = settings.publicHomeNavNosotros || 'Quiénes Somos';
  const navHorarios = settings.publicHomeNavHorarios || 'Horarios';
  const navContacto = settings.publicHomeNavContacto || 'Ubicación';
  const footerSubtitle = settings.publicHomeFooterSubtitle || 'Sitio Web Oficial';
  const footerText = settings.publicHomeFooterText || 'La Luz del Mundo. Todos los derechos reservados.';
  const footerQuote = settings.publicHomeFooterQuote || 'Un lugar de fe, comunión y esperanza';
  const navDisplayBtn = settings.publicHomeNavDisplayBtn || 'Pantalla TV';
  const navPortalBtn = settings.publicHomeNavPortalBtn || 'Portal del Miembro';

  return (
    <footer className="bg-[#050508] border-t border-white/10 text-white/50 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand logo */}
          <div className="flex items-center gap-3">
            <img
              src={settings.churchOfficialLogoUrl || '/lldm_logo_universal_white.svg'}
              alt="La Luz del Mundo"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div>
              <span className="text-white font-bold text-sm block leading-none">
                La Luz del Mundo
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-white/70 text-xs font-medium">
            <a href="#inicio" className="hover:text-orange-400 transition-colors">{navInicio}</a>
            <a href="#nosotros" className="hover:text-orange-400 transition-colors">{navNosotros}</a>
            <a href="#horarios" className="hover:text-orange-400 transition-colors">{navHorarios}</a>
            <a href="#contacto" className="hover:text-orange-400 transition-colors">{navContacto}</a>
          </div>

          {/* Direct Member & Display Access & Social Links */}
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            {/* Social Media Buttons */}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:text-[#3b82f6] transition-transform duration-300 hover:scale-125 p-1"
                title="Facebook Oficial"
              >
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E4405F] hover:text-[#f43f5e] transition-transform duration-300 hover:scale-125 p-1"
                title="Instagram Oficial"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0000] hover:text-[#ef4444] transition-transform duration-300 hover:scale-125 p-1"
                title="Canal de YouTube / Transmisiones"
              >
                <Youtube className="w-6 h-6" />
              </a>
            )}

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* PWA App Manual Install Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openPWAInstall('android')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all hover:scale-105"
                title="Instalar App en Android"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5516 0 .9997.4483.9997.9993 0 .5511-.4481.9997-.9997.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5516 0 .9997.4483.9997.9993 0 .5511-.4481.9997-.9997.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.3242 13.8533 7.973 12 7.973c-1.8533 0-3.5902.3512-5.1368.9767L4.8409 5.4467a.416.416 0 0 0-.5676-.1521.416.416 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.0028.329 13.9744 0 17.5647h24c-.329-3.5903-2.6889-6.5619-6.1185-8.2433" />
                </svg>
                <span>App Android</span>
              </button>

              <button
                type="button"
                onClick={() => openPWAInstall('ios')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-xs font-bold transition-all hover:scale-105"
                title="Instalar App en iPhone (iOS)"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.02c.67-.82 1.13-1.97.99-3.12-1 .04-2.18.67-2.88 1.49-.62.72-1.15 1.88-.99 3 .1.01 2.24-.55 2.88-1.37z" />
                </svg>
                <span>App iPhone</span>
              </button>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            <a
              href="/portal"
              className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentUser ? 'Mi Portal' : navPortalBtn}</span>
            </a>

            {currentUser && (
              <>
                <span className="text-white/20">•</span>
                <a
                  href="/display"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{navDisplayBtn}</span>
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-white/40 text-[11px]">
          <p>© {year} {footerText}</p>
          {footerQuote && <p className="italic">"{footerQuote}"</p>}
        </div>
      </div>

      <PWAInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
        initialPlatform={pwaPlatform}
      />
    </footer>
  );
}
