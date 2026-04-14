'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getVariantTokens } from './tokens';

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
            <circle cx="22" cy="22" r="11" fill="#BBFF00" opacity="0.9" />
            <circle cx="22" cy="22" r="11" fill="url(#sunGrad2)" />
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
            <path d="M33 36 L26 48 L31 44 L28 56 L38 40 L32 42 Z" fill="#BBFF00" opacity="0.95" />
        </svg>
    );

    if (code === 0) return { icon: SUN, label: 'Despejado', mini: '☀️' };
    if ([1, 2].includes(code)) return { icon: PARTLY, label: 'Parcial', mini: '⛅' };
    if (code === 3) return { icon: CLOUD, label: 'Nublado', mini: '☁️' };
    if ([45, 48].includes(code)) return { icon: CLOUD, label: 'Neblina', mini: '🌫️' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: RAIN, label: 'Lluvia', mini: '🌧️' };
    if ([95, 96, 99].includes(code)) return { icon: STORM, label: 'Tormenta', mini: '⛈️' };
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

    const LEGACY: Record<string, { lat: number; lon: number; name: string }> = {
        'houston': { lat: 29.7604, lon: -95.3698, name: 'Houston, TX' },
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=${unit}&timezone=auto&forecast_days=6`;

        fetch(url)
            .then(r => r.json())
            .then(d => {
                setCurrent({
                    temp: Math.round(d.current.temperature_2m),
                    feels: Math.round(d.current.apparent_temperature),
                    humidity: Math.round(d.current.relative_humidity_2m),
                    wind: Math.round(d.current.wind_speed_10m),
                    code: d.current.weather_code,
                });
                setForecast(d.daily.time.slice(1, 6).map((t: string, i: number) => ({
                    date: new Date(t + 'T12:00:00'),
                    tempMax: Math.round(d.daily.temperature_2m_max[i + 1]),
                    tempMin: Math.round(d.daily.temperature_2m_min[i + 1]),
                    code: d.daily.weather_code[i + 1],
                })));
            })
            .catch(() => {})
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
                    background: 'rgba(10, 10, 10, 0.8)',
                    backdropFilter: 'blur(40px)',
                    border: `1.5px solid ${A}30`,
                    borderRadius: '28px',
                    boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 40px ${A}10`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* ── TOP SECTION: Main Focus ── */}
                    <div style={{ 
                        padding: '24px 20px 16px', 
                        background: `linear-gradient(180deg, ${A}08 0%, transparent 100%)`,
                        borderBottom: `1px solid ${A}15`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: A }} />
                            <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', opacity: 0.6 }}>
                                {cityData.name}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '64px', height: '64px', margin: '4px 0' }}>
                                {info?.icon}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1, color: A, textShadow: `0 0 30px ${A}50`, fontFamily: 'var(--font-sora, ui-sans-serif)' }}>
                                    {current ? (current.temp > 0 ? `+${current.temp}` : current.temp) : '--'}
                                </span>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: `${A}80`, marginLeft: '4px' }}>°{isCelsius ? 'C' : 'F'}</span>
                            </div>
                            <span style={{ fontSize: '9px', fontWeight: 900, color: A, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                {info?.label}
                            </span>
                        </div>
                    </div>

                    {/* ── VERTICAL FORECAST (THE FOCUS) ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: '6px' }}>
                        <p style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', paddingLeft: '8px' }}>
                            Pronóstico 5 Días
                        </p>
                        {forecast.map((day, i) => {
                            const dayInfo = getWeatherInfo(day.code);
                            const isToday = i === 0;
                            return (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        padding: '8px 12px', 
                                        borderRadius: '16px', 
                                        background: isToday ? `${A}12` : 'rgba(255,255,255,0.03)', 
                                        border: isToday ? `1px solid ${A}30` : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: isToday ? `0 0 20px ${A}10` : 'none'
                                    }}
                                >
                                    <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', width: '32px', color: isToday ? A : 'rgba(255,255,255,0.5)' }}>
                                        {DAYS_ES[day.date.getDay()]}
                                    </p>
                                    <span style={{ fontSize: '16px' }}>{dayInfo.mini}</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', minWidth: '35px', justifyContent: 'flex-end' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 900, color: isToday ? A : '#fff' }}>{day.tempMax}°</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ── MINIMAL FOOTER STATS ── */}
                    {current && (
                        <div style={{ 
                            padding: '12px 16px', 
                            background: 'rgba(0,0,0,0.2)', 
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Droplets style={{ width: '10px', height: '10px', color: '#60A5FA' }} />
                                <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{current.humidity}%</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Wind style={{ width: '10px', height: '10px', color: '#34D399' }} />
                                <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{current.wind} km/h</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
