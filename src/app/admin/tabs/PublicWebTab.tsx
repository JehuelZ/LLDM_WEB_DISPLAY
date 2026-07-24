'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Globe, Image as ImageIcon, Save, ExternalLink, Sparkles, Heart, MapPin, Phone, MessageSquare, Check, ShieldCheck } from 'lucide-react';
import { MediaGalleryModal } from '@/components/admin/MediaGalleryModal';
import { motion } from 'framer-motion';

export default function PublicWebTab() {
  const { settings, saveSettingsToCloud, showNotification } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Form local state initialized with settings
  const [form, setForm] = useState({
    publicHomeTitle: settings.publicHomeTitle || 'La Luz del Mundo — Rodeo, CA',
    publicHomeSubtitle: settings.publicHomeSubtitle || 'Un lugar de fe, comunión y esperanza para toda la familia.',
    publicHomeHeroBg: settings.publicHomeHeroBg || '',
    publicHomeCtaText: settings.publicHomeCtaText || 'Conoce Nuestros Horarios',
    publicHomeAboutTitle: settings.publicHomeAboutTitle || 'Nuestra Fe y Principios',
    publicHomeAboutText: settings.publicHomeAboutText || 'Somos una comunidad cristiana comprometida con los principios y enseñanzas bíblicas, promoviendo el amor fraternal, la fe y la comunión espiritual.',
    publicHomeMinisterWelcome: settings.publicHomeMinisterWelcome || 'Les damos una calurosa bienvenida a nuestra congregación en Rodeo, California. Nuestra iglesia está con las puertas abiertas para todos aquellos que buscan la verdad y la paz de Dios.',
    publicHomeContactPhone: settings.publicHomeContactPhone || '(510) 000-0000',
    publicHomeAddress: settings.publicHomeAddress || 'Rodeo, CA',
    publicHomeMapsUrl: settings.publicHomeMapsUrl || 'https://maps.google.com/?q=Rodeo,+CA',
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettingsToCloud(form);
      showNotification('Sitio Web Público actualizado correctamente', 'success');
    } catch (err: any) {
      showNotification(`Error al guardar: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">FLAMA CMS</h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 tracking-wider">
                v1.0 Beta
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Gestor de Contenidos <span className="text-orange-400 font-semibold">FLAMA</span> para <span className="text-white font-mono">lldmrodeo.org</span>. Edición dinámica sin código.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
          >
            <span>Ver Web Pública</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar en la Nube'}</span>
          </button>
        </div>
      </div>

      {/* ── SECCIÓN 1: PORTADA PRINCIPAL (HERO) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-xl space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">1. Portada Principal (Hero Banner)</h3>
            <p className="text-xs text-white/40">Título de impacto, mensaje de bienvenida y foto de fondo de la iglesia.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Título de la Portada
              </label>
              <input
                type="text"
                value={form.publicHomeTitle}
                onChange={e => handleChange('publicHomeTitle', e.target.value)}
                placeholder="La Luz del Mundo — Rodeo, CA"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Subtítulo / Lema de Bienvenida
              </label>
              <textarea
                rows={3}
                value={form.publicHomeSubtitle}
                onChange={e => handleChange('publicHomeSubtitle', e.target.value)}
                placeholder="Un lugar de fe, comunión y esperanza para toda la familia."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Texto del Botón Principal (CTA)
              </label>
              <input
                type="text"
                value={form.publicHomeCtaText}
                onChange={e => handleChange('publicHomeCtaText', e.target.value)}
                placeholder="Conoce Nuestros Horarios"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Imagen de Fondo de Portada */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Imagen de Fondo de Portada
            </label>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
              {form.publicHomeHeroBg ? (
                <img
                  src={form.publicHomeHeroBg}
                  alt="Portada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <ImageIcon className="w-10 h-10 text-white/20 mb-2" />
                  <p className="text-xs text-white/40">Sin foto seleccionada (Se usará el fondo predeterminado)</p>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center gap-3 transition-opacity">
                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Elegir de Galería
                </button>
                {form.publicHomeHeroBg && (
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeHeroBg', '')}
                    className="px-3 py-2 bg-rose-500/80 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-colors"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 transition-colors flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-orange-400" />
              <span>Abrir Galería de Medios</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── SECCIÓN 2: QUIÉNES SOMOS & BIENVENIDA MINISTERIAL ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-xl space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">2. Mensaje Ministerial & Valores</h3>
            <p className="text-xs text-white/40">Presentación oficial para visitantes y simpatizantes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Mensaje de Bienvenida del Ministro
            </label>
            <textarea
              rows={6}
              value={form.publicHomeMinisterWelcome}
              onChange={e => handleChange('publicHomeMinisterWelcome', e.target.value)}
              placeholder="Escribe el mensaje de bienvenida para quienes visitan la página por primera vez..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Título de la Sección de Valores
              </label>
              <input
                type="text"
                value={form.publicHomeAboutTitle}
                onChange={e => handleChange('publicHomeAboutTitle', e.target.value)}
                placeholder="Nuestra Fe y Principios"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Descripción de Principios y Fe
              </label>
              <textarea
                rows={3}
                value={form.publicHomeAboutText}
                onChange={e => handleChange('publicHomeAboutText', e.target.value)}
                placeholder="Resumen de los valores y comunión espiritual..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SECCIÓN 3: CONTACTO & UBICACIÓN ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-xl space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">3. Contacto & Ubicación</h3>
            <p className="text-xs text-white/40">Dirección, teléfono de atención y enlace a Google Maps.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Dirección del Templo
            </label>
            <input
              type="text"
              value={form.publicHomeAddress}
              onChange={e => handleChange('publicHomeAddress', e.target.value)}
              placeholder="Rodeo, CA"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Teléfono de Atención
            </label>
            <input
              type="text"
              value={form.publicHomeContactPhone}
              onChange={e => handleChange('publicHomeContactPhone', e.target.value)}
              placeholder="(510) 000-0000"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Enlace de Google Maps
            </label>
            <input
              type="text"
              value={form.publicHomeMapsUrl}
              onChange={e => handleChange('publicHomeMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=Rodeo,+CA"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono text-xs"
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Save Action */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'Guardando Cambios...' : 'Guardar Todo en la Nube'}</span>
        </button>
      </div>

      {/* Media Gallery Modal Integration */}
      {showGallery && (
        <MediaGalleryModal
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
          onSelect={(url) => {
            handleChange('publicHomeHeroBg', url);
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}
