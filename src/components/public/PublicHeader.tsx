'use client';

import { useAppStore } from '@/lib/store';
import { Church, ShieldCheck, Monitor, UserCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function PublicHeader() {
  const { settings } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const churchName = settings.mainChurchName || settings.churchCity || 'Rodeo';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <img
              src={settings.churchLogoUrl || '/flama-oficial.svg'}
              alt="LLDM"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-none">
              LLDM <span className="text-orange-400">{churchName}</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">
              La Luz del Mundo
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/70 uppercase tracking-widest">
          <a href="#inicio" className="hover:text-orange-400 transition-colors">Inicio</a>
          <a href="#nosotros" className="hover:text-orange-400 transition-colors">Quiénes Somos</a>
          <a href="#horarios" className="hover:text-orange-400 transition-colors">Horarios</a>
          <a href="#contacto" className="hover:text-orange-400 transition-colors">Ubicación</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/display"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 transition-all hover:text-white"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span>Pantalla TV</span>
          </a>

          <a
            href="/portal"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Portal del Miembro</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
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
            Inicio
          </a>
          <a
            href="#nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            Quiénes Somos
          </a>
          <a
            href="#horarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            Horarios
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white/80 hover:text-orange-400"
          >
            Ubicación
          </a>
          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href="/portal"
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white font-bold text-xs rounded-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portal del Miembro</span>
            </a>
            <a
              href="/display"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 text-white/80 font-bold text-xs rounded-xl"
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <span>Pantalla TV</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
