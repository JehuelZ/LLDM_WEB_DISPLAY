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
      className="absolute bottom-6 left-12 z-[250] flex flex-col gap-2 items-start"
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-[8px] font-black tracking-[0.25em] text-white/60 bg-black/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 shadow-lg flex items-center gap-1.5 ml-1 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
        ¡ESCANEAME!
      </div>

      <div className="flex gap-3 items-end">
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
    </div>
  );
}
