'use client';

import { useAppStore } from '@/lib/store';
import { Church, ShieldCheck, Monitor, UserCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function PublicHeader() {
  const { settings } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';
  const logoAlign = settings.churchOfficialLogoAlign || 'center';
  const logoSize = settings.churchOfficialLogoSize || 'large';

  const navInicio = settings.publicHomeNavInicio || 'Inicio';
  const navNosotros = settings.publicHomeNavNosotros || 'Quiénes Somos';
  const navHorarios = settings.publicHomeNavHorarios || 'Horarios';
  const navContacto = settings.publicHomeNavContacto || 'Ubicación';
  const navDisplayBtn = settings.publicHomeNavDisplayBtn || 'Pantalla TV';
  const navPortalBtn = settings.publicHomeNavPortalBtn || 'Portal del Miembro';

  const logoSizeClass = logoSize === 'medium'
    ? 'h-16 sm:h-20'
    : logoSize === 'xlarge'
    ? 'h-32 sm:h-40 md:h-48'
    : 'h-24 sm:h-32'; // large

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 transition-all ${
        logoAlign === 'center'
          ? 'flex flex-col items-center gap-3'
          : logoAlign === 'right'
          ? 'flex flex-row-reverse items-center justify-between gap-6 min-h-[80px]'
          : 'flex flex-row items-center justify-between gap-6 min-h-[80px]'
      }`}>
        {/* Brand / Logo */}
        <a href="/" className="flex items-center gap-4 group shrink-0">
          <img
            src={settings.churchOfficialLogoUrl || settings.churchLogoUrl || '/flame_logo_premium.png'}
            alt="La Luz del Mundo"
            className={`${logoSizeClass} w-auto object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]`}
          />
        </a>

        {/* Desktop Navigation Links & Action Buttons */}
        <div className={`hidden md:flex items-center gap-8 ${
          logoAlign === 'center'
            ? 'w-full justify-center border-t border-white/5 pt-2'
            : logoAlign === 'right'
            ? 'flex-row-reverse'
            : ''
        }`}>
          <nav className="flex items-center gap-8 text-xs font-semibold text-white/70 uppercase tracking-widest">
            <a href="#inicio" className="hover:text-orange-400 transition-colors">{navInicio}</a>
            <a href="#nosotros" className="hover:text-orange-400 transition-colors">{navNosotros}</a>
            <a href="#horarios" className="hover:text-orange-400 transition-colors">{navHorarios}</a>
            <a href="#contacto" className="hover:text-orange-400 transition-colors">{navContacto}</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 transition-all hover:text-white"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <span>{navDisplayBtn}</span>
            </a>

            <a
              href="/portal"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{navPortalBtn}</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white absolute right-4 top-5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-b border-white/10 px-4 py-6 space-y-4">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            {navInicio}
          </a>
          <a
            href="#nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            {navNosotros}
          </a>
          <a
            href="#horarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            {navHorarios}
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            {navContacto}
          </a>
          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href="/portal"
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white font-bold text-xs rounded-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{navPortalBtn}</span>
            </a>
            <a
              href="/display"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 text-white/80 font-bold text-xs rounded-xl"
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <span>{navDisplayBtn}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
