'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2, Info, Sparkles, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallModal({
  isOpen,
  onClose,
  initialPlatform = 'android'
}: {
  isOpen: boolean;
  onClose: () => void;
  initialPlatform?: 'android' | 'ios';
}) {
  const [platform, setPlatform] = useState<'android' | 'ios'>(initialPlatform);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setPlatform(initialPlatform);
  }, [initialPlatform]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0e0e15] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white relative overflow-hidden space-y-6"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Branding */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <img src="/flama_amarilla_pwa.svg" alt="LLDM Rodeo" className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(249,115,22,0.5)]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">Instalar App LLDM Rodeo</h3>
              <p className="text-xs text-orange-400/90 font-semibold mt-0.5">Sin tiendas de aplicaciones • Acceso directo</p>
            </div>
          </div>

          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setPlatform('android')}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                platform === 'android'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5516 0 .9997.4483.9997.9993 0 .5511-.4481.9997-.9997.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5516 0 .9997.4483.9997.9993 0 .5511-.4481.9997-.9997.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.3242 13.8533 7.973 12 7.973c-1.8533 0-3.5902.3512-5.1368.9767L4.8409 5.4467a.416.416 0 0 0-.5676-.1521.416.416 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.0028.329 13.9744 0 17.5647h24c-.329-3.5903-2.6889-6.5619-6.1185-8.2433" />
              </svg>
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('ios')}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                platform === 'ios'
                  ? 'bg-gradient-to-r from-slate-100 to-slate-300 text-slate-950 shadow-lg shadow-white/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.02c.67-.82 1.13-1.97.99-3.12-1 .04-2.18.67-2.88 1.49-.62.72-1.15 1.88-.99 3 .1.01 2.24-.55 2.88-1.37z" />
              </svg>
              <span>iPhone (iOS)</span>
            </button>
          </div>

          {/* Platform Instructions Content */}
          {platform === 'android' ? (
            <div className="space-y-4">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mb-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Automáticamente en Android</span>
                </button>
              )}

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 text-xs text-white/80">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-2">
                  <MoreVertical className="w-4 h-4" />
                  Instrucciones Manuales para Android (Chrome):
                </h4>
                <ol className="space-y-2.5 list-decimal list-inside text-white/70">
                  <li>En Google Chrome, toca los <strong className="text-white font-bold">tres puntos (⋮)</strong> arriba a la derecha.</li>
                  <li>Selecciona <strong className="text-white font-bold">"Instalar aplicación"</strong> o <strong className="text-white font-bold">"Agregar a la pantalla principal"</strong>.</li>
                  <li>Toca <strong className="text-emerald-400 font-bold">"Instalar"</strong> y listo. El ícono de la Flama Amarilla aparecerá en tus aplicaciones.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 text-xs text-white/80">
              <h4 className="font-extrabold text-amber-400 flex items-center gap-2">
                <Share className="w-4 h-4" />
                Instrucciones para iPhone / iPad (Safari):
              </h4>
              <ol className="space-y-3 list-decimal list-inside text-white/70">
                <li>Abre esta página en el navegador <strong className="text-white font-bold">Safari</strong> de tu iPhone.</li>
                <li>Toca el botón <strong className="text-white font-bold">Compartir</strong> ⎋ (el cuadrado con la flecha apuntando hacia arriba en el menú inferior).</li>
                <li>Desliza hacia abajo en las opciones y presiona <strong className="text-white font-bold">"Agregar a inicio"</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-orange-400" />).</li>
                <li>Toca <strong className="text-orange-400 font-bold">"Agregar"</strong> arriba a la derecha.</li>
              </ol>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Entendido / Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
