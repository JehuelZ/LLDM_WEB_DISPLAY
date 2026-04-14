'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Droplets, Sun, CloudRain, CloudSnow, CloudLightning, Cloudy, Eye, Thermometer } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getVariantTokens } from './tokens';

// ─────────────────────────────────────────────
// NeonForge — Weather Slide (full 1080p layout)
// Left 40%: current conditions card (flex-1, fills height)
// Right 60%: 5-day forecast rows (flex-1 each)
// ─────────────────────────────────────────────

interface WeatherData {
    current: { temp: number; feelsLike: number; humidity: number; windSpeed: number; description: string; code: number };
    forecast: Array<{ date: Date; high: number; low: number; code: number; description: string; precipProb: number }>;
    cityName: string;
}

function getWeatherInfo(code: number): { label: string; icon: React.ReactNode; color: string; bg: string } {
    if (code === 0) return { label: 'Despejado', icon: <Sun className="w-full h-full" />, color: '#FFD600', bg: '#FFD60015' };
    if (code <= 3) return { label: 'Parcialmente Nublado', icon: <Cloudy className="w-full h-full" />, color: '#9CA3AF', bg: '#9CA3AF15' };
    if (code <= 49) return { label: 'Neblina', icon: <Cloud className="w-full h-full" />, color: '#78909C', bg: '#78909C15' };
    if (code <= 67) return { label: 'Lluvia', icon: <CloudRain className="w-full h-full" />, color: '#29B6F6', bg: '#29B6F615' };
    if (code <= 77) return { label: 'Nieve', icon: <CloudSnow className="w-full h-full" />, color: '#B3E5FC', bg: '#B3E5FC15' };
    if (code <= 82) return { label: 'Chubascos', icon: <CloudRain className="w-full h-full" />, color: '#42A5F5', bg: '#42A5F515' };
    if (code <= 99) return { label: 'Tormenta', icon: <CloudLightning className="w-full h-full" />, color: '#CE93D8', bg: '#CE93D815' };
    return { label: 'Variable', icon: <Cloud className="w-full h-full" />, color: '#9CA3AF', bg: '#9CA3AF15' };
}

const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
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

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function NeonForgeWeather() {
    const settings = useAppStore((state: any) => state.settings);
    const T = getVariantTokens(settings);

    const cityKey = settings?.neonForgeCity || 'houston';
    const cityData = CITY_COORDS[cityKey] || CITY_COORDS['houston'];

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(false);
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=6&temperature_unit=fahrenheit&wind_speed_unit=mph`;
                const res = await fetch(url);
                const data = await res.json();
                const current = data.current;
                const daily = data.daily;
                setWeather({
                    current: {
                        temp: Math.round(current.temperature_2m),
                        feelsLike: Math.round(current.apparent_temperature),
                        humidity: current.relative_humidity_2m,
                        windSpeed: Math.round(current.wind_speed_10m),
                        description: getWeatherInfo(current.weather_code).label,
                        code: current.weather_code,
                    },
                    forecast: daily.time.slice(1).map((dateStr: string, i: number) => ({
                        date: new Date(dateStr + 'T12:00:00'),
                        high: Math.round(daily.temperature_2m_max[i + 1]),
                        low: Math.round(daily.temperature_2m_min[i + 1]),
                        code: daily.weather_code[i + 1],
                        description: getWeatherInfo(daily.weather_code[i + 1]).label,
                        precipProb: daily.precipitation_probability_max[i + 1] || 0,
                    })),
                    cityName: cityData.name,
                });
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [cityKey, cityData.lat, cityData.lon, cityData.name]);

    const currentInfo = weather ? getWeatherInfo(weather.current.code) : null;

    return (
        <div className="h-full w-full flex overflow-hidden relative pt-20 pb-6"
            style={{ background: T.bg, fontFamily: 'var(--font-sora, ui-sans-serif)' }}>

            {/* ── LEFT PANEL — shifted for vertical dashboard compatibility ── */}
            <div className="flex flex-col pl-72 pr-10 gap-5 min-h-0" style={{ width: '50%' }}>

                {/* Header — shrink-0 */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>
                        Condiciones Atmosféricas
                    </p>
                    <h1 className="text-5xl font-black tracking-tight mb-4" style={{ color: T.white }}>
                        El Clima <span style={{ color: T.accent }}>Hoy</span>
                    </h1>
                    <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full"
                        style={{ background: T.card, border: `1px solid ${T.border}` }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.accent }} />
                        <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: T.textSecondary }}>
                            {weather?.cityName || cityData.name}
                        </span>
                    </div>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 animate-spin"
                            style={{ borderColor: T.accentDim, borderTopColor: T.accent }} />
                        <span className="text-sm" style={{ color: T.textMuted }}>Obteniendo datos...</span>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex-1 flex items-center gap-3 opacity-40">
                        <Cloud className="w-8 h-8" style={{ color: T.textMuted }} />
                        <span className="text-sm" style={{ color: T.textMuted }}>Sin conexión meteorológica</span>
                    </div>
                )}

                {/* Current Conditions Card — flex-1 fills remaining vertical space */}
                {weather && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative flex flex-col flex-1 rounded-3xl overflow-hidden p-8 min-h-0"
                        style={{
                            background: T.cardFeatured,
                            border: `1px solid ${T.accent}40`,
                            boxShadow: `0 0 60px ${T.accent}12, 0 8px 40px rgba(0,0,0,0.6)`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[3px]"
                            style={{ background: `linear-gradient(90deg, ${T.secondary}, ${T.accent}, ${T.secondary})` }} />

                        {/* Temp + icon — flex-1 to center vertically */}
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <div className="text-[100px] font-black leading-none" style={{ color: T.accent }}>
                                    {weather.current.temp}°
                                </div>
                                <p className="text-xl font-semibold mt-2" style={{ color: T.textSecondary }}>
                                    {weather.current.description}
                                </p>
                            </div>
                            <div className="w-28 h-28 flex-shrink-0" style={{ color: currentInfo?.color }}>
                                {currentInfo?.icon}
                            </div>
                        </div>

                        {/* Stats — always at bottom */}
                        <div className="grid grid-cols-2 gap-3 shrink-0 mt-4">
                            {[
                                { icon: <Thermometer className="w-4 h-4" />, label: 'Sensación', val: `${weather.current.feelsLike}°F` },
                                { icon: <Droplets className="w-4 h-4" />, label: 'Humedad', val: `${weather.current.humidity}%` },
                                { icon: <Wind className="w-4 h-4" />, label: 'Viento', val: `${weather.current.windSpeed} mph` },
                                { icon: <Eye className="w-4 h-4" />, label: 'Visibilidad', val: 'Exterior' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                                    style={{ background: T.card, border: `1px solid ${T.border}` }}>
                                    <span style={{ color: T.accent }}>{stat.icon}</span>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: T.textMuted }}>{stat.label}</p>
                                        <p className="text-[15px] font-black" style={{ color: T.white }}>{stat.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <p className="text-[9px] shrink-0" style={{ color: T.textMuted }}>
                    Datos: Open-Meteo.com · Actualización cada 30 min · °F
                </p>
            </div>

            {/* Vertical divider */}
            <div className="mx-8 self-stretch w-px shrink-0" style={{ background: T.border }} />

            {/* ── RIGHT PANEL — 5-Day Forecast ── */}
            <div className="flex flex-col flex-1 pr-10 gap-5 min-h-0">
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: T.textMuted }}>Próximos 5 Días</p>
                    <h2 className="text-3xl font-black tracking-tight" style={{ color: T.white }}>
                        Pronóstico <span style={{ color: T.accent }}>Extendido</span>
                    </h2>
                </motion.div>

                {weather && !loading && (
                    <div className="flex flex-col gap-3 flex-1 min-h-0">
                        {weather.forecast.slice(0, 5).map((day, i) => {
                            const info = getWeatherInfo(day.code);
                            const dayLabel = DAY_LABELS[day.date.getDay()];
                            const dateNum = day.date.getDate();
                            const tempFillPct = Math.min(100, Math.round((day.high / 110) * 100));

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.07 }}
                                    className="flex-1 flex items-center gap-5 px-6 rounded-2xl min-h-0"
                                    style={{ background: T.card, border: `1px solid ${T.border}` }}
                                >
                                    <div className="flex flex-col items-center w-12 shrink-0">
                                        <span className="text-[16px] font-black" style={{ color: T.textSecondary }}>{dayLabel}</span>
                                        <span className="text-[11px] font-medium" style={{ color: T.textMuted }}>{dateNum}</span>
                                    </div>

                                    <div className="w-10 h-10 shrink-0 p-1 rounded-xl" style={{ background: info.bg, color: info.color }}>
                                        {info.icon}
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[15px] font-semibold" style={{ color: T.white }}>{info.label}</span>
                                        {day.precipProb > 0 && (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Droplets className="w-3 h-3" style={{ color: '#29B6F6' }} />
                                                <span className="text-[11px] font-semibold" style={{ color: '#29B6F6' }}>
                                                    {day.precipProb}% lluvia
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[13px] font-medium w-9 text-right" style={{ color: T.textMuted }}>
                                            {day.low}°
                                        </span>
                                        <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: T.border }}>
                                            <div className="h-full rounded-full"
                                                style={{ width: `${tempFillPct}%`, background: `linear-gradient(to right, #29B6F6, ${T.accent})` }} />
                                        </div>
                                        <span className="text-[18px] font-black w-10" style={{ color: T.white }}>{day.high}°</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {loading && (
                    <div className="flex-1 flex items-center justify-center opacity-30">
                        <div className="w-8 h-8 rounded-full border-2 animate-spin"
                            style={{ borderColor: T.accentDim, borderTopColor: T.accent }} />
                    </div>
                )}
            </div>
        </div>
    );
}
