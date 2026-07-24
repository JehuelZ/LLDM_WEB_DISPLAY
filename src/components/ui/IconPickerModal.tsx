'use client';

import React, { useState } from 'react';
import {
  BookOpen, Flame, Sun, Star, Sparkles, Sunrise, Heart, Crown, Shield,
  Users, UserCheck, HeartHandshake, Smile, Home, Megaphone, Bell, Globe,
  MapPin, Compass, Award, BadgeCheck, Target, ShieldCheck, CheckCircle,
  Music, Feather, Lightbulb, X, Search
} from 'lucide-react';
import { ChurchIcon } from './ChurchIcon';

export const MODERN_ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  book: BookOpen,
  flame: Flame,
  sun: Sun,
  star: Star,
  sparkles: Sparkles,
  sunrise: Sunrise,
  heart: Heart,
  church: ChurchIcon,
  crown: Crown,
  shield: Shield,
  users: Users,
  userCheck: UserCheck,
  handshake: HeartHandshake,
  smile: Smile,
  home: Home,
  megaphone: Megaphone,
  bell: Bell,
  globe: Globe,
  mapPin: MapPin,
  compass: Compass,
  award: Award,
  badgeCheck: BadgeCheck,
  target: Target,
  shieldCheck: ShieldCheck,
  checkCircle: CheckCircle,
  music: Music,
  feather: Feather,
  lightbulb: Lightbulb,
};

export function renderModernIconOrImg(
  value: any,
  fallbackIcon: React.ComponentType<{ className?: string }>,
  className = "w-5 h-5"
) {
  if (!value || typeof value !== 'string') {
    const Fallback = fallbackIcon;
    return <Fallback className={className} />;
  }

  const str = value.trim();
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/') || str.startsWith('data:')) {
    return <img src={str} alt="" className="w-full h-full object-contain" />;
  }

  const IconComp = MODERN_ICONS_MAP[str];
  if (IconComp) {
    return <IconComp className={className} />;
  }

  const Fallback = fallbackIcon;
  return <Fallback className={className} />;
}

export const MODERN_ICON_CATEGORIES = [
  {
    name: '✨ Sacros & Fe',
    icons: [
      { id: 'flame', label: 'Flama Sacra', icon: Flame },
      { id: 'church', label: 'Casa de Oración', icon: ChurchIcon },
      { id: 'book', label: 'Doctrina / Biblia', icon: BookOpen },
      { id: 'sun', label: 'Luz / Sol', icon: Sun },
      { id: 'star', label: 'Estrella / Esperanza', icon: Star },
      { id: 'sparkles', label: 'Destello / Gracia', icon: Sparkles },
      { id: 'sunrise', label: 'Amanecer / Fe', icon: Sunrise },
      { id: 'crown', label: 'Corona / Gloria', icon: Crown },
      { id: 'feather', label: 'Pluma / Palabra', icon: Feather },
      { id: 'lightbulb', label: 'Luz / Revelación', icon: Lightbulb },
    ]
  },
  {
    name: '❤️ Comunión & Valores',
    icons: [
      { id: 'heart', label: 'Amor Fraternal', icon: Heart },
      { id: 'handshake', label: 'Unidad & Comunión', icon: HeartHandshake },
      { id: 'users', label: 'Comunidad / Hermanos', icon: Users },
      { id: 'userCheck', label: 'Fidelidad / Miembro', icon: UserCheck },
      { id: 'smile', label: 'Gozo / Paz', icon: Smile },
      { id: 'home', label: 'Familia / Casa', icon: Home },
      { id: 'shield', label: 'Protección / Integridad', icon: Shield },
      { id: 'shieldCheck', label: 'Escudo / Respeto', icon: ShieldCheck },
    ]
  },
  {
    name: '🏆 Excelencia & Testimonio',
    icons: [
      { id: 'award', label: 'Excelencia / Galardón', icon: Award },
      { id: 'badgeCheck', label: 'Reconocimiento', icon: BadgeCheck },
      { id: 'checkCircle', label: 'Cumplimiento', icon: CheckCircle },
      { id: 'target', label: 'Meta / Propósito', icon: Target },
      { id: 'globe', label: 'Universalidad / Mundo', icon: Globe },
      { id: 'mapPin', label: 'Ubicación / Templo', icon: MapPin },
      { id: 'compass', label: 'Guía / Dirección', icon: Compass },
      { id: 'megaphone', label: 'Predicación / Aviso', icon: Megaphone },
      { id: 'bell', label: 'Llamado / Oración', icon: Bell },
      { id: 'music', label: 'Alabanza / Coro', icon: Music },
    ]
  }
];

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconId: string) => void;
  currentIconId?: string;
}

export function IconPickerModal({ isOpen, onClose, onSelectIcon, currentIconId }: IconPickerModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0c0d14] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-orange-500/20">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Galería de Íconos Modernos</span>
            </h3>
            <p className="text-xs text-white/50 mt-0.5">Selecciona un ícono estilizado para personalizar la tarjeta.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/5 bg-black/40">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar ícono por nombre..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {MODERN_ICON_CATEGORIES.map(category => {
            const filteredIcons = category.icons.filter(i =>
              i.label.toLowerCase().includes(search.toLowerCase()) ||
              i.id.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredIcons.length === 0) return null;

            return (
              <div key={category.name} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-400/90">{category.name}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredIcons.map(item => {
                    const IconComp = item.icon;
                    const isSelected = currentIconId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectIcon(item.id);
                          onClose();
                        }}
                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 group ${
                          isSelected
                            ? 'bg-orange-500/20 border-orange-500 text-orange-400 ring-2 ring-orange-500/30'
                            : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.08] hover:border-orange-500/30 text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform text-current">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-center leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
