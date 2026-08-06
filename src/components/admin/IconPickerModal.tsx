'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Sparkles, Check, Loader2 } from 'lucide-react';
import { Icon } from '@iconify/react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  currentIcon?: string;
  title?: string;
}

const FEATURED_COLLECTIONS = [
  { id: 'all', name: 'Todas' },
  { id: 'solar', name: 'Solar (Minimal)' },
  { id: 'lucide', name: 'Lucide (Limpio)' },
  { id: 'tabler', name: 'Tabler (UI)' },
  { id: 'ph', name: 'Phosphor' },
  { id: 'ri', name: 'Remix Icon' },
  { id: 'heroicons', name: 'Heroicons' },
];

const POPULAR_PRESETS = [
  'solar:clock-circle-bold-duotone',
  'solar:home-2-bold-duotone',
  'solar:bell-bing-bold-duotone',
  'solar:calendar-date-bold-duotone',
  'solar:user-speak-bold-duotone',
  'solar:heart-bold-duotone',
  'solar:star-bold-duotone',
  'solar:shield-check-bold-duotone',
  'lucide:church',
  'lucide:flame',
  'lucide:book-open',
  'lucide:music',
  'lucide:award',
  'lucide:sparkles',
  'tabler:cross',
  'tabler:users',
  'ph:hands-praying',
  'ph:sun',
  'ri:notification-4-line',
  'ri:map-pin-line'
];

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon = '',
  title = 'Galería de Íconos Minimalistas',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('all');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  const fetchIcons = useCallback(async (query: string, prefix: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=96`;
      if (prefix !== 'all') {
        url += `&prefix=${prefix}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data && Array.isArray(data.icons)) {
        setSearchResults(data.icons);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching icons from Iconify:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchIcons(searchTerm, selectedPrefix);
      } else {
        setSearchResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedPrefix, fetchIcons]);

  useEffect(() => {
    setSelectedIcon(currentIcon);
  }, [currentIcon, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (icon: string) => {
    setSelectedIcon(icon);
  };

  const handleConfirm = () => {
    if (selectedIcon) {
      onSelectIcon(selectedIcon);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
              <p className="text-xs text-slate-400">
                Catálogo global con +200,000 íconos vectoriales minimalistas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador & Filtros */}
        <div className="p-5 border-b border-slate-800 space-y-4 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar íconos (ej: clock, church, bell, star, user, music...)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros de Colección */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FEATURED_COLLECTIONS.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedPrefix(col.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedPrefix === col.id
                    ? 'bg-indigo-600/90 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {col.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Grid */}
        <div className="flex-1 p-5 overflow-y-auto min-h-[300px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm">Buscando íconos en la galería externa...</p>
            </div>
          ) : searchTerm ? (
            searchResults.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {searchResults.map((iconName) => {
                  const isSelected = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      onClick={() => handleSelect(iconName)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all aspect-square relative group ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/50'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                      title={iconName}
                    >
                      <Icon icon={iconName} className="w-7 h-7 transition-transform group-hover:scale-110" />
                      <span className="text-[10px] text-slate-400 truncate w-full text-center group-hover:text-slate-200">
                        {iconName.split(':')[1] || iconName}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                <p className="text-sm font-medium">No se encontraron íconos para &quot;{searchTerm}&quot;</p>
                <p className="text-xs text-slate-500 mt-1">Intenta buscar en inglés (ej: &quot;bell&quot;, &quot;clock&quot;, &quot;pray&quot;, &quot;star&quot;)</p>
              </div>
            )
          ) : (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Íconos Populares Recomendados
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {POPULAR_PRESETS.map((iconName) => {
                  const isSelected = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      onClick={() => handleSelect(iconName)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all aspect-square relative group ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/50'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                      title={iconName}
                    >
                      <Icon icon={iconName} className="w-7 h-7 transition-transform group-hover:scale-110" />
                      <span className="text-[10px] text-slate-400 truncate w-full text-center group-hover:text-slate-200">
                        {iconName.split(':')[1] || iconName}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedIcon ? (
              <div className="flex items-center gap-2.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-white">
                <span>Seleccionado:</span>
                <Icon icon={selectedIcon} className="w-4 h-4 text-indigo-400" />
                <code className="text-[11px] text-indigo-300 font-mono">{selectedIcon}</code>
              </div>
            ) : (
              <span className="text-xs text-slate-500">Ningún ícono seleccionado</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedIcon}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Aplicar Ícono
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
