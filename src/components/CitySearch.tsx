'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, X, Loader2, Check } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// CitySearch — Geocoding-powered city searcher for NeonForge weather settings
// Uses Open-Meteo Geocoding API (free, no API key)
// Supports: city name search, country filter, ZIP codes (via name input)
// ──────────────────────────────────────────────────────────────────────────────

interface GeoResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;   // state/province
    admin2?: string;   // county
    population?: number;
}

interface CityData {
    lat: number;
    lon: number;
    name: string;
    country: string;
}

interface CitySearchProps {
    value?: CityData | null;
    onChange: (city: CityData) => void;
    accentColor?: string;
}

export function CitySearch({ value, onChange, accentColor = '#BBFF00' }: CitySearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GeoResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Format display label from geocode result
    const formatLabel = (r: GeoResult) => {
        const parts = [r.name];
        if (r.admin1) parts.push(r.admin1);
        parts.push(r.country);
        return parts.join(', ');
    };

    const formatShort = (r: GeoResult) => {
        const parts = [r.name];
        if (r.admin1) parts.push(r.admin1);
        return parts.join(', ');
    };

    // Geocoding fetch
    const search = useCallback(async (q: string) => {
        if (q.trim().length < 2) { setResults([]); return; }
        setLoading(true);
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q.trim())}&count=8&language=es&format=json`;
            const res = await fetch(url);
            const data = await res.json();
            setResults(data.results || []);
            setHighlightIdx(0);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search on input change
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setQuery(q);
        setOpen(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(q), 350);
    };

    // Select a result
    const selectCity = (r: GeoResult) => {
        const cityData: CityData = {
            lat: r.latitude,
            lon: r.longitude,
            name: formatShort(r),
            country: r.country,
        };
        onChange(cityData);
        setQuery('');
        setResults([]);
        setOpen(false);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!results.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
        if (e.key === 'Enter') { e.preventDefault(); if (results[highlightIdx]) selectCity(results[highlightIdx]); }
        if (e.key === 'Escape') { setOpen(false); setResults([]); }
    };

    // Click outside to close
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const flagEmoji = (code: string) => {
        if (!code) return '🌍';
        const codePoints = [...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Selected city display */}
            {value && !open && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer group"
                    style={{
                        background: `${accentColor}10`,
                        border: `1.5px solid ${accentColor}40`,
                    }}
                    onClick={() => { setOpen(true); setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }}
                >
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black" style={{ color: accentColor }}>Ciudad activa</p>
                        <p className="text-[13px] font-bold truncate" style={{ color: '#FFFFFF' }}>{value.name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {value.country} · {value.lat.toFixed(3)}, {value.lon.toFixed(3)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                        <span className="text-[9px] font-bold" style={{ color: accentColor }}>Cambiar</span>
                    </div>
                </div>
            )}

            {/* Search input */}
            <div className="relative">
                <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query.length >= 2) setOpen(true); }}
                    placeholder="Buscar ciudad o código postal..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-[13px] font-medium outline-none transition-all"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: open && results.length > 0
                            ? `1.5px solid ${accentColor}60`
                            : '1.5px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                    }}
                />
                {loading && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin"
                        style={{ color: accentColor }} />
                )}
                {!loading && query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>

            {/* Dropdown results */}
            {open && results.length > 0 && (
                <div
                    className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-[200] overflow-y-auto max-h-[280px]"
                    style={{
                        background: '#141414',
                        border: `1px solid ${accentColor}35`,
                        boxShadow: `0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)`,
                    }}
                >
                    {results.map((r, i) => (
                        <button
                            key={r.id}
                            onClick={() => selectCity(r)}
                            onMouseEnter={() => setHighlightIdx(i)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                            style={{
                                background: i === highlightIdx ? `${accentColor}15` : 'transparent',
                                borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}
                        >
                            <span className="text-xl shrink-0 leading-none">{flagEmoji(r.country_code)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold truncate" style={{ color: i === highlightIdx ? accentColor : '#FFFFFF' }}>
                                    {r.name}
                                    {r.admin1 && <span className="text-[11px] font-normal ml-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.admin1}</span>}
                                </p>
                                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    {r.country} · {r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}
                                    {r.population ? ` · ${(r.population / 1000).toFixed(0)}k hab.` : ''}
                                </p>
                            </div>
                            {i === highlightIdx && (
                                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* No results */}
            {open && !loading && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl px-4 py-4 text-center z-[200]"
                    style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin resultados para "{query}"</p>
                    <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Prueba con el nombre en inglés o el código postal</p>
                </div>
            )}
        </div>
    );
}
