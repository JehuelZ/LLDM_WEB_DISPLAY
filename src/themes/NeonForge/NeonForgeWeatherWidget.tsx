'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getVariantTokens } from './tokens';

// ── Weather code → icon/label ──────────────────────────────────────────────
function getWeatherInfo(code: number | undefined) {
    const SUN = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx={32} cy={32} r={14} fill="#BBFF00" opacity={0.95} />
            <circle cx={32} cy={32} r={14} fill="url(#sunGrad)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <line key={i} x1={32} y1={32}
                    x2={32 + 22 * Math.cos((deg * Math.PI) / 180)}
                    y2={32 + 22 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#BBFF00" strokeWidth={2.5} strokeLinecap="round" opacity={0.7}
                />
            ))}
            <defs>
                <radialGradient id="sunGrad" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#BBFF00" stopOpacity={1} />
                </radialGradient>
            </defs>
        </svg>
    );
    const CLOUD = (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <ellipse cx={28} cy={38} rx={20} ry={12} fill="url(#cloudGrad)" />
            <ellipse cx={36} cy={34} rx={16} ry={11} fill="url(#cloudGrad)" />
            <ellipse cx={24} cy={36} rx={12} ry={9} fill="url(#cloudGrad)" />
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
            <circle cx={22} cy={22} r={11} fill="#BBFF00" opacity={0.9} />
            <circle cx={22} cy={22} r={11} fill="url(#sunGrad2)" />
            <ellipse cx={36} cy={42} rx={18} ry={11} fill="url(#cloudGrad2)" />
            <ellipse cx={44} cy={38} rx={13} ry={9} fill="url(#cloudGrad2)" />
            <ellipse cx={30} cy={40} rx={10} ry={8} fill="url(#cloudGrad2)" />
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
            <ellipse cx={30} cy={34} rx={20} ry={12} fill="url(#rainCloudGrad)" />
            <ellipse cx={38} cy={30} rx={15} ry={10} fill="url(#rainCloudGrad)" />
            {[[22, 50], [30, 54], [38, 50], [46, 54]].map(([x, y], i) => (
                <line key={i} x1={x} y1={y - 4} x2={x - 2} y2={y + 4} stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
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
            <ellipse cx={30} cy={32} rx={20} ry={12} fill="rgba(80,90,120,0.9)" />
            <path d="M33 36 L26 48 L31 44 L28 56 L38 40 L32 42 Z" fill="#BBFF00" opacity={0.95} />
        </svg>
    );

    if (code === 0) return { icon: SUN, label: 'Despejado', mini: '☀️' };
    if (code === 1 || code === 2) return { icon: PARTLY, label: 'Parcial', mini: '⛅' };
    if (code === 3) return { icon: CLOUD, label: 'Nublado', mini: '☁️' };
    if (code === 45 || code === 48) return { icon: CLOUD, label: 'Neblina', mini: '🌫️' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code ?? -1)) return { icon: RAIN, label: 'Lluvia', mini: '🌧️' };
    if ([95, 96, 99].includes(code ?? -1)) return { icon: STORM, label: 'Tormenta', mini: '⛈️' };
    return { icon: PARTLY, label: 'Variable', mini: '🌤️' };
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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

export function NeonForgeWeatherWidget() {
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);
    const A = T.accent;
    const showWeather = settings?.neonForgeShowWeather !== false;

    // Rodeo, CA coords
    const DEFAULT_CITY = { lat: 38.0313, lon: -122.2619, name: 'Rodeo, CA' };
    
    const cityData = settings?.neonForgeCityData
        ? { lat: settings.neonForgeCityData.lat, lon: settings.neonForgeCityData.lon, name: settings.neonForgeCityData.name }
        : DEFAULT_CITY;

    const [current, setCurrent] = useState<Current | null>(null);
    const [forecast, setForecast] = useState<DayForecast[]>([]);
    const [loading, setLoading] = useState(true);

    const unit = settings?.weatherUnit || 'fahrenheit';
    const isCelsius = unit === 'celsius';

    useEffect(() => {
        if (!showWeather) return;
        setLoading(true);
        const { lat, lon } = cityData;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=${unit}&timezone=auto&forecast_days=7`;

        fetch(url)
            .then(r => r.json())
            .then(d => {
                if (d.current) {
                    setCurrent({
                        temp: Math.round(d.current.temperature_2m),
                        feels: Math.round(d.current.apparent_temperature),
                        humidity: Math.round(d.current.relative_humidity_2m),
                        wind: Math.round(d.current.wind_speed_10m),
                        code: d.current.weather_code,
                    });
                }
                if (d.daily?.time && d.daily?.weather_code) {
                    setForecast(d.daily.time.slice(1, 6).map((t: string, i: number) => ({
                        date: new Date(t + 'T12:00:00'),
                        tempMax: Math.round(d.daily.temperature_2m_max[i + 1]),
                        tempMin: Math.round(d.daily.temperature_2m_min[i + 1]),
                        code: d.daily.weather_code[i + 1],
                    })));
                }
            })
            .catch(err => console.error("Weather fetch failed", err))
            .finally(() => setLoading(false));
    }, [cityData.lat, cityData.lon, showWeather, unit]);

    if (!showWeather) return null;

    const info = current ? getWeatherInfo(current.code) : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute z-50 pointer-events-none select-none"
                style={{ top: '240px', left: '24px' }}
            >
                <div style={{
                    width: '180px',
                    background: 'rgba(5, 5, 5, 0.85)',
                    backdropFilter: 'blur(50px)',
                    border: `1.5px solid ${A}40`,
                    borderRadius: '30px',
                    boxShadow: `0 30px 100px rgba(0,0,0,0.9), 0 0 50px ${A}15`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto'
                }}>
                    {/* ── HEADER ── */}
                    <div style={{ 
                        padding: '24px 20px 12px', 
                        background: `linear-gradient(180deg, ${A}10 0%, transparent 100%)`,
                        borderBottom: `1px solid ${A}20`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: A }} />
                            <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', opacity: 0.8 }}>
                                {cityData.name}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '80px', height: '80px' }}>
                                {info?.icon || <div className="w-full h-full animate-pulse bg-white/5 rounded-full" />}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '8px' }}>
                                <span style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1, color: A, textShadow: `0 0 40px ${A}60` }}>
                                    {current ? (current.temp > 0 ? `+${current.temp}` : current.temp) : '--'}
                                </span>
                                <span style={{ fontSize: '18px', fontWeight: 800, color: `${A}CC`, marginLeft: '4px' }}>°</span>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 900, color: A, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '4px' }}>
                                {info?.label || 'Cargando...'}
                            </span>
                        </div>
                    </div>

                    {/* ── STATS (VERTICAL STACK) ── */}
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: `1px solid ${A}10` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Droplets style={{ width: '16px', height: '16px', color: '#60A5FA' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Humedad</span>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{current ? `${current.humidity}%` : '--'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wind style={{ width: '16px', height: '16px', color: '#34D399' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Viento</span>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{current ? `${current.wind} km/h` : '--'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── FORECAST (VERTICAL LIST) ── */}
                    <div style={{ padding: '20px 14px', background: 'rgba(0,0,0,0.3)' }}>
                        <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: A, marginBottom: '12px', textAlign: 'center' }}>
                            Pronóstico 5 Días
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {forecast.length > 0 ? forecast.map((day, i) => {
                                const dayInfo = getWeatherInfo(day.code);
                                return (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '8px 12px', 
                                            borderRadius: '14px', 
                                            background: 'rgba(255,255,255,0.04)', 
                                            border: '1px solid rgba(255,255,255,0.06)'
                                        }}
                                    >
                                        <span style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.6)', width: '35px' }}>
                                            {DAYS_ES[day.date.getDay()]}
                                        </span>
                                        <span style={{ fontSize: '24px' }}>{dayInfo.mini}</span>
                                        <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff', textAlign: 'right', width: '35px' }}>
                                            {day.tempMax}°
                                        </span>
                                    </motion.div>
                                );
                            }) : (
                                <div className="py-4 flex justify-center">
                                    <div className="w-6 h-6 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
