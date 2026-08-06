'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { ChurchIcon as Church } from '@/components/ui/ChurchIcon';
import { Flame, Bell, Star, Heart, Calendar, Sun, Sunrise, Radio, Crown, Sparkles, Globe, Zap, Award, Shirt, Users } from 'lucide-react';

interface DynamicIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  fallbackIcon?: string;
}

const FALLBACK_LUCIDE_MAP: Record<string, any> = {
  flame: Flame,
  church: Church,
  bell: Bell,
  star: Star,
  heart: Heart,
  calendar: Calendar,
  sun: Sun,
  sunrise: Sunrise,
  radio: Radio,
  crown: Crown,
  sparkles: Sparkles,
  globe: Globe,
  zap: Zap,
  award: Award,
  shirt: Shirt,
  users: Users,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  className = '',
  style,
  size,
  fallbackIcon = 'flame',
}) => {
  if (!icon) {
    const FallbackComponent = FALLBACK_LUCIDE_MAP[fallbackIcon] || Flame;
    return <FallbackComponent className={className} style={style} size={size} />;
  }

  // If it's a legacy plain keyword like "flame", "church", "bell"
  if (!icon.includes(':')) {
    const LegacyIcon = FALLBACK_LUCIDE_MAP[icon.toLowerCase()];
    if (LegacyIcon) {
      return <LegacyIcon className={className} style={style} size={size} />;
    }
    // Format as lucide icon by default if plain name
    icon = `lucide:${icon}`;
  }

  return (
    <Icon
      icon={icon}
      className={className}
      style={style}
      fontSize={size}
      aria-hidden="true"
    />
  );
};

export default DynamicIcon;
