'use client';

import { useAppStore } from '@/lib/store';
import { ShieldCheck, Monitor } from 'lucide-react';

export function PublicFooter() {
  const { settings } = useAppStore();
  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050508] border-t border-white/10 text-white/50 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center p-1.5">
              <img
                src={settings.churchLogoUrl || '/flama-oficial.svg'}
                alt="LLDM"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-white font-bold text-sm block leading-none">
                La Luz del Mundo — {churchName}
              </span>
              <span className="text-[10px] text-white/40">Sitio Web Oficial · <span className="text-orange-400 font-semibold">FLAMA v1.0 (Beta)</span></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-white/70 text-xs font-medium">
            <a href="#inicio" className="hover:text-orange-400 transition-colors">Inicio</a>
            <a href="#nosotros" className="hover:text-orange-400 transition-colors">Quiénes Somos</a>
            <a href="#horarios" className="hover:text-orange-400 transition-colors">Horarios</a>
            <a href="#contacto" className="hover:text-orange-400 transition-colors">Ubicación</a>
          </div>

          {/* Direct Member & Display Access */}
          <div className="flex items-center gap-3">
            <a
              href="/portal"
              className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Miembros</span>
            </a>
            <span className="text-white/20">•</span>
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Pantallas TV</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-white/30 text-[11px]">
          <p>© {year} La Luz del Mundo — {churchName}. Todos los derechos reservados.</p>
          <p className="italic">"Un lugar de fe, comunión y esperanza"</p>
        </div>
      </div>
    </footer>
  );
}
