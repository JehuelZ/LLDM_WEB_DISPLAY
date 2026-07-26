'use client';

import { useAppStore } from '@/lib/store';
import { ShieldCheck, Monitor, Facebook, Instagram, Youtube } from 'lucide-react';

export function PublicFooter() {
  const { settings, currentUser } = useAppStore();
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
                className="w-9 h-9 rounded-xl bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all hover:scale-110 shadow-lg shadow-blue-500/10"
                title="Facebook Oficial"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-pink-600/10 hover:bg-pink-600/25 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-pink-300 transition-all hover:scale-110 shadow-lg shadow-pink-500/10"
                title="Instagram Oficial"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600/10 hover:bg-red-600/25 border border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all hover:scale-110 shadow-lg shadow-red-500/10"
                title="Canal de YouTube / Transmisiones"
              >
                <Youtube className="w-4.5 h-4.5" />
              </a>
            )}

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
    </footer>
  );
}
