'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicHero } from '@/components/public/PublicHero';
import { PublicAbout } from '@/components/public/PublicAbout';
import { PublicSchedule } from '@/components/public/PublicSchedule';
import { PublicContact } from '@/components/public/PublicContact';
import { PublicFooter } from '@/components/public/PublicFooter';

export default function HomePage() {
  const { loadSettingsFromCloud } = useAppStore();

  useEffect(() => {
    loadSettingsFromCloud();
  }, [loadSettingsFromCloud]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-orange-500/30 selection:text-orange-300 font-sans antialiased overflow-x-hidden">
      {/* Navigation Bar */}
      <PublicHeader />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <PublicHero />

        {/* About & Minister Welcome Section */}
        <PublicAbout />

        {/* Public Worship Schedule */}
        <PublicSchedule />

        {/* Location & Contact Info */}
        <PublicContact />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
