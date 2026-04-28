# 🕰️ Documentación del Sistema de Tiempo, Clima y Zona Horaria

**Última actualización:** 28 de Abril de 2026
**Objetivo:** Sincronizar de forma global la hora y el clima de la aplicación (Display) basándose en la configuración del Administrador, independientemente del dispositivo (Smart TV, Proyector o Computadora) donde se visualice.

## 1. El Problema Original
Anteriormente, los componentes como `Clock.tsx` y `IglesiaCalendar.tsx` dependían de `new Date()` (la hora del dispositivo local). Esto causaba desajustes graves si la computadora conectada al proyector o la Smart TV tenían mal configurada su hora, provocando que los carteles de "EN CURSO" se activaran a destiempo o el calendario mostrara un día incorrecto.

## 2. La Solución Arquitectónica (`getChurchNow`)
Se implementó la función **`getChurchNow(settings)`** (ubicada en `src/lib/time.ts`).
Esta utilidad lee la propiedad `settings.weatherTimezone` y formatea la hora actual forzándola a la zona horaria del servidor principal de la iglesia (ej. `America/Los_Angeles`).

**Todos los temas visuales deben implementar esta lógica en lugar de `new Date()`**.
Ejemplo de migración en `IglesiaCalendar.tsx` y `Clock.tsx`:
```tsx
// ❌ Incorrecto:
const [time, setTime] = useState(new Date());

// ✅ Correcto:
import { getChurchNow } from '@/lib/time';
const settings = useAppStore(s => s.settings);
const [time, setTime] = useState(() => getChurchNow(settings));

// Y en el useEffect:
const timer = setInterval(() => setTime(getChurchNow(settings)), 1000);
```

## 3. Actualización de Base de Datos (`app_settings`)
Para soportar la geolocalización automática, el formato de hora (12h/24h) y el cálculo de la zona horaria, se añadieron cinco columnas vitales a la tabla `app_settings` en Supabase:
- `weather_city` (TEXT)
- `weather_lat` (NUMERIC)
- `weather_lng` (NUMERIC)
- `weather_timezone` (TEXT)
- `clock_format` (TEXT, con valor predeterminado '12h')

*NOTA PARA EL FUTURO DESARROLLADOR:* Si la base de datos es recreada, asegúrate de correr el script `MEGA_FIX_DATABASE.sql` que incluye la creación de estas columnas.

## 4. Opciones del Administrador (`AjustesTab.tsx`)
En la pestaña de **Ajustes**, bajo la tarjeta **SERVICIOS INTEGRADOS (CLIMA)**, se añadieron los siguientes controles:
1. **Botón de Ubicación Automática:** Al escribir un código postal o ciudad y hacer clic en "Ubicar", la API de Open-Meteo obtiene la Latitud, Longitud y Zona Horaria, guardándolas en Supabase (`weatherLat`, `weatherLng`, `weatherTimezone`).
2. **Toggle de Formato de Hora (12h/24h):** Un interruptor que alterna la variable `clockFormat`. Si está activo (azul), muestra formato militar (24h). Si está apagado, muestra 12 horas con un pequeño indicador de "AM" o "PM".

## 5. Renderizado Dinámico de Formato de Reloj
Dentro del componente `Clock.tsx` del tema Iglesia, la hora se formatea condicionalmente escuchando el estado global de zustand (`settings.clockFormat`):
```tsx
{/* Renderizado de hora */}
{format(time, settings?.clockFormat === '24h' ? 'HH:mm' : 'hh:mm')}

{/* Indicador AM/PM solo visible en 12h */}
{settings?.clockFormat !== '24h' && (
    <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
        {format(time, 'a')}
    </span>
)}
```

## ⚠️ Instrucciones para Próximos Pasos (Para la IA o Programadores)
Si vas a extender esta lógica de tiempo a otros temas visuales (como `LunaPremium` o `MidnightGlow`):
1. **NO** utilices `new Date()` para calcular la hora en la interfaz pública. Reemplázalo con `getChurchNow(settings)`.
2. Al renderizar el formato del reloj grande, incluye el condicional de formato `12h/24h` usando `settings?.clockFormat`.
3. Para la lógica de "En Curso" (como la que se usa en `IglesiaProgress` y `MidnightGlowCalendar`), asegúrate de que el cálculo del minuto del día (`curMin`) utilice la hora derivada de `getChurchNow` y NO del sistema del navegador local. (Revisar la línea 40 de `MidnightGlowCalendar.tsx` como próximo refactor pendiente).
