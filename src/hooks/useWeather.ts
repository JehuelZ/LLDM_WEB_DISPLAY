'use client';
import { useState, useEffect } from 'react';

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    humidity?: number;
    forecast: {
        date: string;
        temp: number;
        icon: string;
    }[];
    timezone?: string;
}

export function useWeather(lat: number = 24.341, lon: number = -104.28, unit: 'celsius' | 'fahrenheit' = 'celsius') {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWeather = async () => {
        try {
            // Fetch current weather and 3-day forecast using Open-Meteo (Free, no API key)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&current_weather=true&daily=temperature_2m_max,weather_code&timezone=auto&temperature_unit=${unit}`;
            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();

            const weatherCodeMap: Record<number, string> = {
                0: 'Despejado',
                1: 'Principalmente despejado',
                2: 'Parcialmente nublado',
                3: 'Nublado',
                45: 'Niebla', 48: 'Niebla depositando escarcha',
                51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna densa',
                61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia fuerte',
                71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve fuerte',
                80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos violentos',
                95: 'Tormenta eléctrica',
            };

            // Enhanced mapping for reliability
            const currentObj = data.current || data.current_weather || {};
            const code = currentObj.weather_code ?? currentObj.weathercode ?? 0;
            const temp = Math.round(currentObj.temperature_2m ?? currentObj.temperature ?? 0);
            const humidity = data.current?.relative_humidity_2m;

            const mappedWeather: WeatherData = {
                temp,
                condition: weatherCodeMap[code] || 'Despejado',
                icon: code.toString(),
                humidity,
                forecast: (data.daily?.time || []).slice(0, 5).map((time: string, i: number) => ({
                    date: time,
                    temp: Math.round(data.daily.temperature_2m_max[i]),
                    icon: (data.daily.weather_code?.[i] ?? data.daily.weathercode?.[i] ?? 0).toString()
                })),
                timezone: data.timezone
            };

            setWeather(mappedWeather);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        // Refresh every 10 minutes (Improved responsiveness for live display)
        const timer = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(timer);
    }, [lat, lon, unit]);

    return { weather, loading };
}
