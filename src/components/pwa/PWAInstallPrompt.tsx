'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA standalone
    const isStandaloneApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneApp);

    if (isStandaloneApp) return;

    // Check if user dismissed prompt recently (in last 7 days)
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show prompt for iOS after 3 seconds
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[999]"
      >
        <div className="bg-[#0f0f17]/95 border border-orange-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <img src="/flame_logo_premium.png" alt="LLDM Rodeo" className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]" />
            </div>

            <div className="space-y-1 pr-6">
              <h4 className="text-sm font-extrabold text-white leading-tight">Instala la App de LLDM Rodeo</h4>
              <p className="text-xs text-white/60 leading-relaxed">Accede más rápido desde la pantalla de inicio de tu teléfono sin tiendas de aplicaciones.</p>
            </div>
          </div>

          {/* iOS Instructions Modal/Expand */}
          {showIOSInstructions ? (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs text-white/80 bg-black/40 p-3.5 rounded-2xl">
              <p className="font-bold text-orange-400 flex items-center gap-1.5">
                <Share className="w-4 h-4" />
                Pasos para iPhone / Safari:
              </p>
              <ol className="space-y-2 list-decimal list-inside text-white/70">
                <li>Toca el botón <strong className="text-white">Compartir</strong> ⎋ abajo en Safari.</li>
                <li>Desliza hacia abajo y selecciona <strong className="text-white font-bold">"Agregar a inicio"</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-orange-400" />).</li>
                <li>Toca <strong className="text-orange-400 font-bold">"Agregar"</strong> arriba a la derecha.</li>
              </ol>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Instalar en Teléfono</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="py-3 px-3 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-xs rounded-2xl transition-colors"
              >
                Ahora No
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
