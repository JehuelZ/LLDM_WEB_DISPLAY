'use client';
import { useState, useEffect } from 'react';

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    forecast: {
        date: string;
        temp: number;
        icon: string;
    }[];
}

export function useWeather(lat: number = 24.341, lon: number = -104.28, unit: 'celsius' | 'fahrenheit' = 'celsius') {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWeather = async () => {
        try {
            // Fetch current weather and 3-day forecast using Open-Meteo (Free, no API key)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,weathercode&timezone=auto&temperature_unit=${unit}`;
            const response = await fetch(url);
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

            const mappedWeather: WeatherData = {
                temp: Math.round(data.current_weather.temperature),
                condition: weatherCodeMap[data.current_weather.weathercode] || 'Despejado',
                icon: data.current_weather.weathercode.toString(),
                forecast: data.daily.time.slice(0, 4).map((time: string, i: number) => ({
                    date: time,
                    temp: Math.round(data.daily.temperature_2m_max[i]),
                    icon: data.daily.weathercode[i].toString()
                }))
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
        // Refresh every 30 minutes
        const timer = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(timer);
    }, [lat, lon, unit]);

    return { weather, loading };
}
