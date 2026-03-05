# Premium Progress Bar Design (Iglesia Theme Refinement)

Este diseño fue creado para el tema Iglesia, buscando un equilibrio entre visibilidad y sutileza premium.

## Reloj Inline (Progreso de Segundos)

```tsx
{/* Subtle premium progress line */}
<div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
    background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
    width: `${(time.getSeconds() / 60) * 100}%`,
    transition: 'width 1s linear',
    boxShadow: `0 0 10px ${T.accent}`,
    opacity: 0.9
}} />
```

## Indicadores de Diapositivas (Dots)

```tsx
<div style={{ display: 'flex', gap: 8, justifyContent: 'center', position: 'absolute', bottom: 30, left: 0, right: 0 }}>
    {[...Array(total)].map((_, i) => (
        <div key={i} style={{
            width: i === currentSlide ? 32 : 12, height: 6, borderRadius: 999,
            background: i === currentSlide 
                ? `linear-gradient(90deg, ${T.accent}, ${T.accent}aa)` 
                : T.textMuted,
            opacity: i === currentSlide ? 1 : 0.2, 
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: i === currentSlide ? `0 4px 12px ${T.accent}33` : 'none'
        }} />
    ))}
</div>
```

## Características
1.  **Grosor**: 1.5px para máxima sutileza.
2.  **Gradiente**: `linear-gradient(90deg, transparent, ${T.accent}, transparent)` para evitar cortes bruscos en los bordes.
3.  **Efecto Glow**: `boxShadow: 0 0 10px ${T.accent}` para darle un toque "neon" elegante.
4.  **Animación**: `cubic-bezier` en los dots para un movimiento orgánico y premium.
