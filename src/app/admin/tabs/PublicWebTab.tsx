'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Globe, Image as ImageIcon, Save, ExternalLink, Sparkles, Heart, MapPin, Phone, MessageSquare, Check, ShieldCheck, AlignLeft, AlignCenter, AlignRight, Maximize2 } from 'lucide-react';
import { MediaGalleryModal } from '@/components/admin/MediaGalleryModal';
import { motion } from 'framer-motion';

export default function PublicWebTab() {
  const { settings, saveSettingsToCloud, showNotification } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTargetMode, setGalleryTargetMode] = useState<'heroBg' | 'officialLogo' | 'aboutImage'>('heroBg');

  // Form local state initialized with settings
  const [form, setForm] = useState({
    publicHomeMaintenanceMode: settings.publicHomeMaintenanceMode ?? true,
    publicHomeMaintenanceTitle: settings.publicHomeMaintenanceTitle || 'Sitio Web en Mantenimiento',
    publicHomeMaintenanceMessage: settings.publicHomeMaintenanceMessage || 'Estamos realizando mejoras en nuestro sitio web oficial. Por favor regresa muy pronto.',
    publicHomeTitle: settings.publicHomeTitle || 'La Luz del Mundo — Rodeo, CA',
    publicHomeTitleAlign: settings.publicHomeTitleAlign || 'center',
    publicHomeSubtitle: settings.publicHomeSubtitle || 'Un lugar de fe, comunión y esperanza para toda la familia.',
    publicHomeSubtitleAlign: settings.publicHomeSubtitleAlign || 'center',
    publicHomeHeroBg: settings.publicHomeHeroBg || '',
    churchOfficialLogoUrl: settings.churchOfficialLogoUrl || '',
    churchOfficialLogoAlign: settings.churchOfficialLogoAlign || 'center',
    churchOfficialLogoSize: settings.churchOfficialLogoSize || 'large',
    publicHomeCtaText: settings.publicHomeCtaText || 'Conoce Nuestros Horarios',
    publicHomeCtaAlign: settings.publicHomeCtaAlign || 'center',
    publicHomeAboutTitle: settings.publicHomeAboutTitle || 'Nuestra Fe y Principios',
    publicHomeAboutTitleAlign: settings.publicHomeAboutTitleAlign || 'center',
    publicHomeAboutText: settings.publicHomeAboutText || 'Somos una comunidad cristiana comprometida con los principios y enseñanzas bíblicas, promoviendo el amor fraternal, la fe y la comunión espiritual.',
    publicHomeAboutTextAlign: settings.publicHomeAboutTextAlign || 'center',
    publicHomeMinisterWelcomeTitle: settings.publicHomeMinisterWelcomeTitle || '"Nuestras puertas están abiertas para ti"',
    publicHomeMinisterWelcome: settings.publicHomeMinisterWelcome || 'Les damos una calurosa bienvenida a la Iglesia La Luz del Mundo en Rodeo, California. Nuestra casa de oración está con las puertas abiertas para todos aquellos que buscan la verdad y la paz de Dios.',
    publicHomeAboutImage: settings.publicHomeAboutImage || '',
    publicHomeAboutImageMode: settings.publicHomeAboutImageMode || 'side',
    publicHomeAboutImagePos: settings.publicHomeAboutImagePos || 'left',
    publicHomeAboutBgStyle: settings.publicHomeAboutBgStyle || 'glass',
    publicHomeContactPhone: settings.publicHomeContactPhone || '(510) 000-0000',
    publicHomeAddress: settings.publicHomeAddress || 'Rodeo, CA',
    publicHomeMapsUrl: settings.publicHomeMapsUrl || 'https://maps.google.com/?q=Rodeo,+CA',
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
  });



  const handleChange = (key: string, value: any) => {
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
              <h2 className="text-xl font-black text-white tracking-tight">FLAMA</h2>
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

      {/* ── MODO MANTENIMIENTO ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-6 backdrop-blur-xl border transition-all ${
          form.publicHomeMaintenanceMode
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30'
            : 'bg-white/[0.03] border-white/8'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              form.publicHomeMaintenanceMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Modo Mantenimiento del Sitio Web</h3>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  form.publicHomeMaintenanceMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {form.publicHomeMaintenanceMode ? '🔒 ACTIVADO (Oculto al Público)' : '🌐 DESACTIVADO (Sitio Visible)'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Al estar <strong className="text-white">ACTIVADO</strong>, los visitantes verán una pantalla elegante de mantenimiento mientras realizas cambios. Los miembros y pantallas de la iglesia pueden seguir usando sus accesos normalmente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleChange('publicHomeMaintenanceMode', !form.publicHomeMaintenanceMode)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 shrink-0 ${
              form.publicHomeMaintenanceMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20 hover:scale-105'
                : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/10'
            }`}
          >
            <span>{form.publicHomeMaintenanceMode ? '🔒 Desactivar Mantenimiento' : '🔓 Activar Mantenimiento'}</span>
          </button>
        </div>

        {form.publicHomeMaintenanceMode && (
          <div className="mt-6 pt-6 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-amber-300/80 uppercase tracking-wider mb-1.5">
                Título del Aviso de Mantenimiento
              </label>
              <input
                type="text"
                value={form.publicHomeMaintenanceTitle}
                onChange={e => handleChange('publicHomeMaintenanceTitle', e.target.value)}
                placeholder="Sitio Web en Mantenimiento"
                className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300/80 uppercase tracking-wider mb-1.5">
                Mensaje Informativo para Visitantes
              </label>
              <input
                type="text"
                value={form.publicHomeMaintenanceMessage}
                onChange={e => handleChange('publicHomeMaintenanceMessage', e.target.value)}
                placeholder="Estamos realizando mejoras en nuestro sitio web oficial. Por favor regresa muy pronto."
                className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── SECCIÓN 1: MENÚ SUPERIOR (NAVEGACIÓN) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-xl space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">1. Menú Superior (Navegación y Logo)</h3>
            <p className="text-xs text-white/40">Control de logo oficial universal y estructura de barra de navegación.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-3">
            <label className="block text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Logo Oficial Mundial (Escudo "The Light of the World")
            </label>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-2xl max-w-xl">
              <div className="w-12 h-12 rounded-xl bg-black/50 border border-orange-500/30 p-1.5 shrink-0 flex items-center justify-center">
                <img
                  src={form.churchOfficialLogoUrl || '/flame_logo_premium.png'}
                  alt="Oficial"
                  className="w-full h-full object-contain"
                />
              </div>
              <input
                type="text"
                value={form.churchOfficialLogoUrl}
                onChange={e => handleChange('churchOfficialLogoUrl', e.target.value)}
                placeholder="https://... o selecciona de la galería"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500/50"
              />
              <button
                type="button"
                onClick={() => {
                  setGalleryTargetMode('officialLogo');
                  setShowGallery(true);
                }}
                className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Galería
              </button>
            </div>

            {/* Botones de Alineación por Iconos & Control de Tamaño */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl">
              {/* Alineación (Izquierda, Centro, Derecha) */}
              <div>
                <span className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Disposición del Menú</span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoAlign', 'left')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                      form.churchOfficialLogoAlign === 'left'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    title="Logo a la Izquierda"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoAlign', 'center')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                      form.churchOfficialLogoAlign === 'center'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    title="Logo Centrado (Apilado)"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoAlign', 'right')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                      form.churchOfficialLogoAlign === 'right'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    title="Logo a la Derecha"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tamaño (Mediano, Grande, Extra Grande) */}
              <div>
                <span className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Tamaño Visual</span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoSize', 'medium')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                      form.churchOfficialLogoSize === 'medium'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Med
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoSize', 'large')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                      form.churchOfficialLogoSize === 'large'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Grande
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('churchOfficialLogoSize', 'xlarge')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                      form.churchOfficialLogoSize === 'xlarge'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SECCIÓN 2: PORTADA PRINCIPAL (HERO) ── */}
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
            <h3 className="text-base font-bold text-white">2. Portada Principal (Hero Banner)</h3>
            <p className="text-xs text-white/40">Título de impacto, mensaje de bienvenida y foto de fondo de la iglesia.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Etiqueta / Badge + Alineación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Etiqueta Superior (Badge)
                </label>
                {/* Selector de Alineación */}
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeBadgeAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeBadgeAlign === 'left' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeBadgeAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeBadgeAlign === 'center' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeBadgeAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeBadgeAlign === 'right' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={form.publicHomeBadgeText || ''}
                onChange={e => handleChange('publicHomeBadgeText', e.target.value)}
                placeholder="La Restauración de la Primitiva Iglesia Cristiana"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            {/* Título de la Portada + Alineación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Título de la Portada
                </label>
                {/* Selector de Alineación */}
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeTitleAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeTitleAlign === 'left' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Título a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeTitleAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeTitleAlign === 'center' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar Título"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeTitleAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeTitleAlign === 'right' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Título a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={form.publicHomeTitle}
                onChange={e => handleChange('publicHomeTitle', e.target.value)}
                placeholder="La Luz del Mundo — Rodeo, CA"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            {/* Subtítulo + Alineación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Subtítulo / Lema de Bienvenida
                </label>
                {/* Selector de Alineación */}
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeSubtitleAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeSubtitleAlign === 'left' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Subtítulo a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeSubtitleAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeSubtitleAlign === 'center' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar Subtítulo"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeSubtitleAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeSubtitleAlign === 'right' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Subtítulo a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={form.publicHomeSubtitle}
                onChange={e => handleChange('publicHomeSubtitle', e.target.value)}
                placeholder="Un lugar de fe, comunión y esperanza para toda la familia."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
              />
            </div>

            {/* Texto del Botón + Alineación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Texto del Botón Principal (CTA)
                </label>
                {/* Selector de Alineación */}
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeCtaAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeCtaAlign === 'left' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Botones a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeCtaAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeCtaAlign === 'center' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar Botones"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeCtaAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeCtaAlign === 'right' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear Botones a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
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
                  onClick={() => {
                    setGalleryTargetMode('heroBg');
                    setShowGallery(true);
                  }}
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

            {/* Campo de URL directa */}
            <div>
              <input
                type="text"
                value={form.publicHomeHeroBg}
                onChange={e => handleChange('publicHomeHeroBg', e.target.value)}
                placeholder="https://... o selecciona de la galería"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setGalleryTargetMode('heroBg');
                setShowGallery(true);
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 transition-colors flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-orange-400" />
              <span>Abrir Galería de Medios</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── SECCIÓN 3: MENSAJE MINISTERIAL, QUIÉNES SOMOS & VALORES ── */}
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
            <h3 className="text-base font-bold text-white">3. Mensaje Ministerial, Quiénes Somos & Valores</h3>
            <p className="text-xs text-white/40">Presentación oficial, mensajes editables e imagen de acompañamiento/fondo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda: Mensajes & Títulos Editables */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Invitación Pública
              </label>
              <input
                type="text"
                value={form.publicHomeMinisterWelcomeTitle || ''}
                onChange={e => handleChange('publicHomeMinisterWelcomeTitle', e.target.value)}
                placeholder='"Nuestras puertas están abiertas para ti"'
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Mensaje de Bienvenida del Ministro
              </label>
              <textarea
                rows={4}
                value={form.publicHomeMinisterWelcome || ''}
                onChange={e => handleChange('publicHomeMinisterWelcome', e.target.value)}
                placeholder="Escribe el mensaje de bienvenida para quienes visitan la página por primera vez..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>

            {/* Título de Sección + Alineación */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Título de la Sección Principios
                </label>
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTitleAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTitleAlign === 'left' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTitleAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTitleAlign === 'center' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTitleAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTitleAlign === 'right' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={form.publicHomeAboutTitle || ''}
                onChange={e => handleChange('publicHomeAboutTitle', e.target.value)}
                placeholder="Nuestra Fe y Principios"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Texto de Sección + Alineación */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Descripción de Principios y Fe
                </label>
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTextAlign', 'left')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTextAlign === 'left' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Izquierda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTextAlign', 'center')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTextAlign === 'center' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Centrar"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutTextAlign', 'right')}
                    className={`p-1 rounded transition-all ${form.publicHomeAboutTextAlign === 'right' ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'}`}
                    title="Alinear a la Derecha"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={form.publicHomeAboutText || ''}
                onChange={e => handleChange('publicHomeAboutText', e.target.value)}
                placeholder="Resumen de los valores y comunión espiritual..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>
          </div>

          {/* Columna Derecha: Imagen de Acompañamiento / Fondo, Posición y Estilo de Fondo */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Imagen de Acompañamiento o Fondo de Sección
            </label>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-2xl">
              <div className="w-16 h-16 rounded-xl bg-black/50 border border-amber-500/30 p-1 shrink-0 overflow-hidden">
                {form.publicHomeAboutImage ? (
                  <img src={form.publicHomeAboutImage} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={form.publicHomeAboutImage || ''}
                onChange={e => handleChange('publicHomeAboutImage', e.target.value)}
                placeholder="URL de foto o selecciona de galería..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => {
                  setGalleryTargetMode('aboutImage');
                  setShowGallery(true);
                }}
                className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Galería
              </button>
            </div>

            {/* Modo de Imagen: Al Lado vs Fondo */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Modo de Imagen</span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutImageMode', 'side')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      form.publicHomeAboutImageMode === 'side' || !form.publicHomeAboutImageMode
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Al Lado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('publicHomeAboutImageMode', 'bg')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      form.publicHomeAboutImageMode === 'bg'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Fondo
                  </button>
                </div>
              </div>

              {/* Posición de la Imagen (Izquierda vs Derecha) si Modo === 'side' */}
              {form.publicHomeAboutImageMode !== 'bg' && (
                <div>
                  <span className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Posición de Imagen</span>
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleChange('publicHomeAboutImagePos', 'left')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        form.publicHomeAboutImagePos === 'left' || !form.publicHomeAboutImagePos
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Izquierda
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('publicHomeAboutImagePos', 'right')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        form.publicHomeAboutImagePos === 'right'
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Derecha
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Estilo de Fondo de Sección (Tono Claro / Oscuro / Cristal) */}
            <div>
              <span className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Fondo de Sección</span>
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleChange('publicHomeAboutBgStyle', 'glass')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    form.publicHomeAboutBgStyle === 'glass' || !form.publicHomeAboutBgStyle
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Cristal
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('publicHomeAboutBgStyle', 'light')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    form.publicHomeAboutBgStyle === 'light'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Contraste Claro
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('publicHomeAboutBgStyle', 'dark')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    form.publicHomeAboutBgStyle === 'dark'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Profundo
                </button>
              </div>
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

        {/* Redes Sociales Oficiales */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Enlaces de Redes Sociales (Aparecerán en el Pie de Página)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/60 mb-1">Página de Facebook</label>
              <input
                type="text"
                value={form.facebookUrl}
                onChange={e => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/60 mb-1">Perfil de Instagram</label>
              <input
                type="text"
                value={form.instagramUrl}
                onChange={e => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/60 mb-1">Canal de YouTube / Transmisión</label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={e => handleChange('youtubeUrl', e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
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
          currentUrl={
            galleryTargetMode === 'officialLogo'
              ? form.churchOfficialLogoUrl
              : galleryTargetMode === 'aboutImage'
              ? form.publicHomeAboutImage
              : form.publicHomeHeroBg
          }
          onClose={() => setShowGallery(false)}
          onSelectImage={(url) => {
            if (url) {
              if (galleryTargetMode === 'officialLogo') {
                setForm(prev => ({ ...prev, churchOfficialLogoUrl: url }));
              } else if (galleryTargetMode === 'aboutImage') {
                setForm(prev => ({ ...prev, publicHomeAboutImage: url }));
              } else {
                setForm(prev => ({ ...prev, publicHomeHeroBg: url }));
              }
            }
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}
