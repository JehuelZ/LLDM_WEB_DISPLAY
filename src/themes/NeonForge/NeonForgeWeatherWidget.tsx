'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, Thermometer, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getVariantTokens } from './tokens';

// ──────────────────────────────────────────────────────────────────────────────
// NeonForge Weather Widget — Full Card (Stitch-designed, 4th floating card)
//
// Layout (inspired by reference + Stitch design):
//  ┌─────────────────────────────────────────────────────┐
//  │▬▬▬▬▬▬▬▬▬▬  TOP NEON STRIPE  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │
//  │ ┌─────────────────────┐        ┌───────────────────┐│
//  │ │ CITY NAME           │ +73°F  │   🌤 BIG ICON    ││
//  │ │ Thursday, Mar 1     │  LIME  │  (glassmorphic)  ││
//  │ │─────────────────────│        └───────────────────┘│
//  │ │ 💧 Humidity: 62%   │                              │
//  │ │ 💨 Wind: 10 mph     │                              │
//  │ │ 🌡 Feels: 71°F     │                              │
//  │ └─────────────────────┘                              │
//  │══════════════ DIVIDER LINE ═══════════════════════════│
//  │ FRI 🌤 +75   SAT ⛅ +72   SUN 🌧 +68  MON ☁ +70   │
//  │ TUE 🌤 +71   -- cells: icon + day + temp -- 5 days - │
//  └─────────────────────────────────────────────────────┘
// ──────────────────────────────────────────────────────────────────────────────

// ── Weather code → icon/label ──────────────────────────────────────────────
function getWeatherInfo(code: number) {
    const SUN = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx="32" cy="32" r="14" fill="#BBFF00" opacity="0.95" />
            <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <line key={i} x1="32" y1="32"
                    x2={32 + 22 * Math.cos((deg * Math.PI) / 180)}
                    y2={32 + 22 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#BBFF00" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"
                    transform={`rotate(${deg})`}
                    style={{ transformOrigin: '32px 32px' }}
                />
            ))}
            <defs>
                <radialGradient id="sunGrad" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#BBFF00" stopOpacity="1" />
                </radialGradient>
            </defs>
        </svg>
    );
    const CLOUD = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <ellipse cx="28" cy="38" rx="20" ry="12" fill="url(#cloudGrad)" />
            <ellipse cx="36" cy="34" rx="16" ry="11" fill="url(#cloudGrad)" />
            <ellipse cx="24" cy="36" rx="12" ry="9" fill="url(#cloudGrad)" />
            <defs>
                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="100%" stopColor="rgba(200,210,230,0.85)" />
                </linearGradient>
            </defs>
        </svg>
    );
    const PARTLY = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Sun behind cloud */}
            <circle cx="22" cy="22" r="11" fill="#BBFF00" opacity="0.9" />
            <circle cx="22" cy="22" r="11" fill="url(#sunGrad2)" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <line key={i} x1={22 + 13 * Math.cos((deg * Math.PI) / 180)} y1={22 + 13 * Math.sin((deg * Math.PI) / 180)}
                    x2={22 + 18 * Math.cos((deg * Math.PI) / 180)} y2={22 + 18 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#BBFF00" strokeWidth="2" strokeLinecap="round" opacity="0.6"
                />
            ))}
            {/* Cloud in front */}
            <ellipse cx="36" cy="42" rx="18" ry="11" fill="url(#cloudGrad2)" />
            <ellipse cx="44" cy="38" rx="13" ry="9" fill="url(#cloudGrad2)" />
            <ellipse cx="30" cy="40" rx="10" ry="8" fill="url(#cloudGrad2)" />
            <defs>
                <radialGradient id="sunGrad2" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FFFF80" /><stop offset="100%" stopColor="#BBFF00" />
                </radialGradient>
                <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" /><stop offset="100%" stopColor="rgba(210,220,240,0.88)" />
                </linearGradient>
            </defs>
        </svg>
    );
    const RAIN = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <ellipse cx="30" cy="34" rx="20" ry="12" fill="url(#rainCloudGrad)" />
            <ellipse cx="38" cy="30" rx="15" ry="10" fill="url(#rainCloudGrad)" />
            {[[22, 50], [30, 54], [38, 50], [46, 54]].map(([x, y], i) => (
                <line key={i} x1={x} y1={y - 4} x2={x - 2} y2={y + 4} stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            ))}
            <defs>
                <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(190,210,240,0.9)" /><stop offset="100%" stopColor="rgba(120,150,200,0.85)" />
                </linearGradient>
            </defs>
        </svg>
    );
    const STORM = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <ellipse cx="30" cy="32" rx="20" ry="12" fill="rgba(80,90,120,0.9)" />
            <ellipse cx="38" cy="28" rx="15" ry="10" fill="rgba(90,100,130,0.9)" />
            <path d="M33 36 L26 48 L31 44 L28 56 L38 40 L32 42 Z" fill="#BBFF00" opacity="0.95" />
        </svg>
    );
    const SNOW = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <ellipse cx="30" cy="32" rx="20" ry="12" fill="rgba(220,235,255,0.92)" />
            {[[22, 46], [30, 50], [38, 46], [46, 50]].map(([x, y], i) => (
                <g key={i}>
                    <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                    <line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                </g>
            ))}
        </svg>
    );

    if (code === 0) return { icon: SUN, label: 'Despejado', mini: '☀️' };
    if ([1, 2].includes(code)) return { icon: PARTLY, label: 'Parcial', mini: '⛅' };
    if (code === 3) return { icon: CLOUD, label: 'Nublado', mini: '☁️' };
    if ([45, 48].includes(code)) return { icon: CLOUD, label: 'Neblina', mini: '🌫️' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: RAIN, label: 'Lluvia', mini: '🌧️' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: SNOW, label: 'Nieve', mini: '❄️' };
    if ([95, 96, 99].includes(code)) return { icon: STORM, label: 'Tormenta', mini: '⛈️' };
    return { icon: PARTLY, label: 'Variable', mini: '🌤️' };
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ── Interfaces ──────────────────────────────────────────────────────────────
interface Current {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    code: number;
}

interface DayForecast {
    date: Date;
    tempMax: number;
    tempMin: number;
    code: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN WIDGET — this replaces both the old floating widget and the weather slide
// Mount it in the Background overlay for persistence across all slides
// ══════════════════════════════════════════════════════════════════════════════
export function NeonForgeWeatherWidget() {
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);

    const showWeather = settings?.neonForgeShowWeather !== false;

    // ── City coords — prefer geocoded, fallback to legacy ──────────────────
    const LEGACY: Record<string, { lat: number; lon: number; name: string }> = {
        'houston': { lat: 29.7604, lon: -95.3698, name: 'Houston, TX' },
        'dallas': { lat: 32.7767, lon: -96.7970, name: 'Dallas, TX' },
        'san-antonio': { lat: 29.4241, lon: -98.4936, name: 'San Antonio, TX' },
        'austin': { lat: 30.2672, lon: -97.7431, name: 'Austin, TX' },
        'los-angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Ángeles, CA' },
        'miami': { lat: 25.7617, lon: -80.1918, name: 'Miami, FL' },
        'chicago': { lat: 41.8781, lon: -87.6298, name: 'Chicago, IL' },
        'new-york': { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
        'guadalajara': { lat: 20.6597, lon: -103.3496, name: 'Guadalajara, MX' },
        'mexico-city': { lat: 19.4326, lon: -99.1332, name: 'Ciudad de México' },
        'monterrey': { lat: 25.6866, lon: -100.3161, name: 'Monterrey, MX' },
    };
    const cityKey = settings?.neonForgeCity || 'houston';
    const cityData = settings?.neonForgeCityData
        ? { lat: settings.neonForgeCityData.lat, lon: settings.neonForgeCityData.lon, name: settings.neonForgeCityData.name }
        : (LEGACY[cityKey] || LEGACY['houston']);

    const [current, setCurrent] = useState<Current | null>(null);
    const [forecast, setForecast] = useState<DayForecast[]>([]);
    const [loading, setLoading] = useState(true);

    const unit = settings?.weatherUnit || 'fahrenheit';
    const isCelsius = unit === 'celsius';

    useEffect(() => {
        if (!showWeather) return;
        setLoading(true);
        const { lat, lon } = cityData;
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
            `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
            `&temperature_unit=${unit}&wind_speed_unit=${isCelsius ? 'kmh' : 'mph'}&timezone=auto&forecast_days=6`;

        fetch(url)
            .then(r => r.json())
            .then(d => {
                const c = d.current;
                setCurrent({
                    temp: Math.round(c.temperature_2m),
                    feels: Math.round(c.apparent_temperature),
                    humidity: Math.round(c.relative_humidity_2m),
                    wind: Math.round(c.wind_speed_10m),
                    code: c.weather_code,
                });
                const days: DayForecast[] = d.daily.time.slice(1, 6).map((t: string, i: number) => ({
                    date: new Date(t + 'T12:00:00'),
                    tempMax: Math.round(d.daily.temperature_2m_max[i + 1]),
                    tempMin: Math.round(d.daily.temperature_2m_min[i + 1]),
                    code: d.daily.weather_code[i + 1],
                }));
                setForecast(days);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityData.lat, cityData.lon, showWeather, unit]);

    if (!showWeather) return null;

    const now = new Date();
    const dayStr = format(now, "EEEE, d 'de' MMMM", { locale: es });
    const info = current ? getWeatherInfo(current.code) : null;

    // Accent color from theme variant
    const A = T.accent; // e.g. #BBFF00

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 90, damping: 18 }}
                // Positioned just to the right of the clock (clock is ~200px from left)
                className="absolute z-50 pointer-events-none select-none"
                style={{ top: '14px', left: '220px' }}
            >
                {/* ════════════════════════════════════════════
                    CARD SHELL — glassmorphism + neon border
                ════════════════════════════════════════════ */}
                <div
                    style={{
                        width: '320px',
                        // Use aspect-square via fixed width/height ratio in layout
                        background: 'linear-gradient(150deg, rgba(20,20,20,0.93) 0%, rgba(10,10,10,0.97) 100%)',
                        backdropFilter: 'blur(32px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                        border: `1.5px solid ${A}40`,
                        borderRadius: '20px',
                        boxShadow: `
                            0 0 0 1px rgba(255,255,255,0.04),
                            0 12px 60px rgba(0,0,0,0.7),
                            0 0 40px ${A}10,
                            inset 0 1px 0 ${A}15
                        `,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Top neon stripe */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: `linear-gradient(90deg, transparent 0%, ${A}CC 40%, ${A}CC 60%, transparent 100%)`,
                    }} />

                    {/* Corner glow — bottom left */}
                    <div style={{
                        position: 'absolute', bottom: '-30%', left: '-20%',
                        width: '60%', height: '60%', borderRadius: '50%',
                        background: `radial-gradient(ellipse, ${A}15 0%, transparent 70%)`,
                        filter: 'blur(20px)', pointerEvents: 'none',
                    }} />

                    {/* ── TOP SECTION ── */}
                    <div style={{ padding: '14px 16px 10px', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

                            {/* Left: City + Day + Stats */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* City */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1px' }}>
                                    <MapPin style={{ width: '10px', height: '10px', color: A, flexShrink: 0 }} />
                                    <p style={{
                                        fontSize: '13px', fontWeight: 900, lineHeight: 1.1,
                                        color: '#FFFFFF', overflow: 'hidden',
                                        textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                                        maxWidth: '150px',

                                    }}>{cityData.name}</p>
                                </div>
                                {/* Day */}
                                <p style={{
                                    fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'capitalize', marginBottom: '10px', marginLeft: '15px',
                                }}>{dayStr}</p>

                                {/* Stats column */}
                                {current && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '2px' }}>
                                        {[
                                            { Icon: Droplets, value: `${current.humidity}%`, label: 'Humedad', color: '#60A5FA' },
                                            { Icon: Wind, value: `${current.wind} ${isCelsius ? 'km/h' : 'mph'}`, label: 'Viento', color: '#34D399' },
                                            { Icon: Thermometer, value: `${current.feels}°${isCelsius ? 'C' : 'F'}`, label: 'Sensación', color: A },
                                        ].map(({ Icon, value, label, color }) => (
                                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{
                                                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                                                    background: `${color}15`, display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', border: `1px solid ${color}25`,
                                                }}>
                                                    <Icon style={{ width: '10px', height: '10px', color }} />
                                                </div>
                                                <p style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF' }}>{value}</p>
                                                <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Loading placeholder */}
                                {loading && !current && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={{
                                                height: '20px', borderRadius: '6px', width: `${60 + i * 15}%`,
                                                background: 'rgba(255,255,255,0.06)', animation: 'pulse 2s infinite',
                                            }} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Temperature + Big icon */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                                {/* Temp */}
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '42px', fontWeight: 900, lineHeight: 1,
                                        color: A,
                                        textShadow: `0 0 30px ${A}60, 0 0 60px ${A}30`,
                                        fontFamily: 'var(--font-sora, ui-sans-serif)',
                                        letterSpacing: '-2px',
                                    }}>
                                        {current ? `${current.temp > 0 ? '+' : ''}${current.temp}` : '--'}
                                    </span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: `${A}80`, marginLeft: '2px' }}>°{isCelsius ? 'C' : 'F'}</span>
                                </div>

                                {/* Big weather icon */}
                                <div style={{ width: '64px', height: '64px', flexShrink: 0 }}>
                                    {info ? info.icon : (
                                        <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                                    )}
                                </div>

                                {/* Condition label */}
                                {info && (
                                    <span style={{
                                        fontSize: '9px', fontWeight: 700, color: A,
                                        background: `${A}12`, border: `1px solid ${A}25`,
                                        borderRadius: '20px', padding: '2px 8px',
                                        letterSpacing: '0.05em', textTransform: 'uppercase',
                                    }}>{info.label}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px', margin: '0 14px',
                        background: `linear-gradient(90deg, transparent, ${A}50, transparent)`,
                    }} />

                    {/* ── FORECAST ROW — 5 days ── */}
                    <div style={{
                        display: 'flex', alignItems: 'stretch',
                        padding: '8px 10px 10px',
                        gap: '4px',
                    }}>
                        {forecast.length > 0 ? forecast.map((day, i) => {
                            const dayInfo = getWeatherInfo(day.code);
                            const isToday = i === 0;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        gap: '3px', padding: '6px 2px',
                                        borderRadius: '10px',
                                        background: isToday ? `${A}12` : 'rgba(255,255,255,0.03)',
                                        border: isToday ? `1px solid ${A}35` : '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {/* Day name */}
                                    <p style={{
                                        fontSize: '7px', fontWeight: 900, textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: isToday ? A : 'rgba(255,255,255,0.45)',
                                    }}>
                                        {DAYS_ES[day.date.getDay()]}
                                    </p>

                                    {/* Mini icon (emoji fallback since SVG is too large for small cells) */}
                                    <span style={{ fontSize: '18px', lineHeight: 1 }}>{dayInfo.mini}</span>

                                    {/* Temp max */}
                                    <p style={{
                                        fontSize: '9px', fontWeight: 900,
                                        color: isToday ? A : '#FFFFFF',
                                    }}>+{day.tempMax}°</p>

                                    {/* Temp min */}
                                    <p style={{ fontSize: '7px', fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>
                                        {day.tempMin}°
                                    </p>
                                </div>
                            );
                        }) : (
                            // Loading skeleton
                            [...Array(5)].map((_, i) => (
                                <div key={i} style={{
                                    flex: 1, height: '62px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.04)',
                                    animation: 'pulse 2s infinite',
                                }} />
                            ))
                        )}
                    </div>

                    {/* Bottom neon dot decoration */}
                    <div style={{
                        position: 'absolute', bottom: '8px', right: '10px',
                        display: 'flex', gap: '3px',
                    }}>
                        {[1, 0.5, 0.3].map((o, i) => (
                            <div key={i} style={{
                                width: '4px', height: '4px', borderRadius: '50%',
                                background: A, opacity: o,
                            }} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
