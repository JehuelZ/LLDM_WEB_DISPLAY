'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QROverlayProps {
  /** URL base de producción. Si no se pasa, intenta usar window.location.origin */
  baseUrl?: string;
}

export function QROverlay({ baseUrl }: QROverlayProps) {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const displayUrl = `${origin}/display`;
  const activarUrl = `${origin}/activar`;

  return (
    <div
      className="absolute bottom-6 left-12 z-[250] flex gap-3 items-end"
      style={{ pointerEvents: 'none' }}
    >
      {/* QR: Ver pantalla en tu celular */}
      <div className="flex flex-col items-center gap-1.5 group">
        <div
          className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
          style={{ pointerEvents: 'auto' }}
        >
          <QRCodeSVG
            value={displayUrl}
            size={72}
            bgColor="transparent"
            fgColor="#ffffff"
            level="M"
            style={{ display: 'block' }}
          />
        </div>
        <span
          className="text-[9px] font-medium text-white/40 tracking-wide uppercase text-center leading-tight max-w-[80px]"
        >
          Ver pantalla
        </span>
      </div>

      {/* QR: Activar cuenta de miembro */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="bg-black/70 backdrop-blur-xl border border-orange-500/25 rounded-xl p-2.5 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
          style={{ pointerEvents: 'auto' }}
        >
          <QRCodeSVG
            value={activarUrl}
            size={72}
            bgColor="transparent"
            fgColor="#f97316"
            level="M"
            style={{ display: 'block' }}
          />
        </div>
        <span
          className="text-[9px] font-medium text-orange-400/60 tracking-wide uppercase text-center leading-tight max-w-[80px]"
        >
          Mi portal
        </span>
      </div>
    </div>
  );
}
