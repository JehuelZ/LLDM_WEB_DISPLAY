# 📜 LLDM RODEO MASTER: Referencia Definitiva (Abril 2026)

> [!IMPORTANT]
> **ESTE ES EL DOCUMENTO DE VERDAD ÚNICA.**
> Sustituye al antiguo "Manifiesto" y consolida más de 10 guías técnicas. Cualquier IA o desarrollador **DEBE** leer este archivo antes de tocar una sola línea de código.

---

## 🏛️ 1. IDENTIDAD Y LENGUAJE SAGRADO

El sistema **LLDM Rodeo Board** es una extensión de la vida espiritual de la iglesia. **Es obligatorio respetar el lenguaje de la comunidad.**

> [!IMPORTANT]
> **VOCABULARIO DE LA COMUNIDAD (NUESTRO IDIOMA)**
> Se ha creado un documento dedicado con la jerarquía, tipos de servicio y palabras prohibidas: [VOCABULARIO_COMUNIDAD.md](file:///Users/hardglobal/Documents/LLDM_RODEO_APP/VOCABULARIO_COMUNIDAD.md).
>
> - **Hermanos**: Término para los miembros.
> - **Visita**: Personas que nos acompañan.
> - **Oraciones**: De 5, de 9 y de la Tarde.
> - **Doctrina**: El estudio principal (Llevar la explicación).
> - **Servicios de Alabanzas**: Cantos individuales (Jueves y Domingos).

### 🎨 Estética "Tactile"
Nuestra UI se basa en la **tactilidad física digital**:

### 🎨 Estética "Tactile"
Nuestra UI se basa en la **tactilidad física digital**:
- **Botones**: Grandes, con feedback visual de hundimiento/brillo.
- **Temas**: 
    - **Iglesia (Cátedra)**: Solemnidad, sombras neumórficas, animaciones de "Tren Metro".
    - **Glassmorphism**: Energía, transparencia, desenfoque de fondo.
    - **Mocha**: Variante Premium en modo claro (Hueso/Café).
    - **Dark Minimal**: Enfoque total en el texto y el líder.

---

## 🛠️ 2. ARQUITECTURA TÉCNICA

### Stack Tecnológico
- **Frontend**: Next.js 15+ (App Router), React 19, Framer Motion (Animaciones).
- **Estilos**: Tailwind CSS v4, CSS Modules para temas específicos.
- **Backend/DB**: Supabase (PostgreSQL + Realtime).
- **Estado**: Zustand (Sincronización fluida).
- **Reportes**: `html2pdf.js` para la generación de la "Ficha Personal".

### Estructura de Directorios Crítica
- `src/app/admin/TactileAdmin.tsx`: Centro de mando del administrador.
- `src/app/admin/tabs/`: Módulos independientes (`Horarios`, `Asistencia`, `Vigilancia`, `Inteligencia`).
- `src/app/dashboard/minister/`: Ecosistema exclusivo para el Ministro.
- `src/themes/`: Lógica de renderizado para las pizarras (displays).
- `src/lib/store.ts`: El corazón del estado y la persistencia en nube.

---

## 🛰️ 3. ECOSISTEMA MINISTERIAL (NUEVO ABRIL 2026)

### 🕵️ Radar de Ausencias (Vigilancia Espiritual)
Ubicado en la **Consola del Ministro**, este algoritmo detecta:
- **Almas en Riesgo**: Hermanos ausentes por **más de 3 servicios seguidos**.
- **Fervor de Oración**: Métrica porcentual basada en la asistencia de la última asamblea.
- **Radar Geográfico**: (En desarrollo) Visualización de miembros por zonas de censo.

### 📨 Buzón de Intercesión
Sistema de mensajería urgente donde los miembros envían peticiones directamente al dashboard del Ministro, con alertas visuales de "Gravedad" (Ruby pulse).

---

## 📊 4. AUTOMATIZACIÓN Y DATOS

### 📅 Programación de Abril 2026
Se implementó un pipeline de extracción de datos desde PDF:
- **Logic**: Normalización de nombres (NFD) y mapeo de alias (ej. "Lucia Zelaya" -> "Lucia Nardone").
- **Script**: `scripts/update_april_2026.js` para sincronización masiva con Supabase.

### 📝 Ficha Personal (PDF Export)
Los perfiles de miembros incluyen ahora un botón de exportación de alta fidelidad que genera un PDF profesional capturando métricas de asistencia y biografía sin elementos de UI del navegador.

---

## ⚙️ 5. OPERACIONES Y DEVOPS

### Comandos de Poder
- `START_SERVER.command`: Inicia el entorno local (Next.js + Turbopack).
- `VER_PROYECTO.command`: Abre la estructura y logs de compilación.

### Reglas de Despliegue
**PRODUCION FIRST**: Todo cambio validado localmente debe ser pusheado inmediatamente a GitHub para su despliegue en `lldmrodeo.org`. No se permiten desincronizaciones entre local y live.

### Optimización de Dispositivos (TV)
La ruta `/tv` es una versión **Ultra-Light** diseñada para Smart TVs y Chromecasts:
- **Auto-Auth**: Sin PIN ni Login manual.
- **No-Cursor**: Oculta el puntero del mouse para una experiencia de display pura.
- **Lower FPS**: Optimiza el renderizado para hardware limitado.

---

## 🔐 6. COMPROMISO DEL DESARROLLADOR / IA

Al trabajar en LLDM Rodeo, te comprometes a:
1. **Consistencia**: No mezcles estilos entre "Iglesia" y "Glassmorphism".
2. **Prioridad Móvil**: La UI móvil debe ser radicalmente distinta si lo requiere la facilidad de uso con una mano.
3. **Respeto Litúrgico**: El sistema debe reflejar la solemnidad de la iglesia en cada transición.

---

## ⚙️ 7. REGLAS DE TIEMPO Y ACCESO (INTEGRIDAD VISUAL)

Sustituido en Abril 2026 para garantizar que la pizarra sea una "ventana" fiel a la iglesia, sin importar la ubicación del hardware:

### 🕒 Sincronización Horaria Geográfica
- **Fuente de Verdad**: La hora mostrada en los displays (pizarras) **NUNCA** debe depender del reloj interno de la computadora o TV.
- **Reloj Maestro**: El sistema debe convertir la hora UTC a la zona horaria definida en `settings.weatherTimezone` (detectada automáticamente por la ubicación del clima).
- **Consistencia de Oración**: Si un servicio está programado a las 5:00 AM, la pizarra debe mostrar las 5:00 AM de la ubicación de la iglesia, aunque el dispositivo físico esté en otra zona horaria.

### 🖥️ Interfaz de Usuario y Accesibilidad Técnica
- **Capa Superior (Z-Index)**: Los controles técnicos críticos (Botón de Pantalla Completa, Triggers Secretos) deben residir en la capa **z-[9999]**.
- **Acceso Previsión**: El botón de pantalla completa debe ser accesible **ANTES** de desbloquear la pantalla con el PIN. Se prohíbe ocultar controles de hardware detrás del `DisplayLock`.
- **Transparencia**: Los triggers de administración deben ser invisibles para la congregación pero detectables al tacto/clic por el personal autorizado.

### 🚫 PROHIBICIÓN DE DATOS INVENTADOS Y LOCALES (REGLA DE ORO)
- **Origen de Datos Único**: ABSOLUTAMENTE TODOS los datos reflejados en pantallas (Display), Dashboard de Miembros, Consola del Ministro, Responsables de Coro y Administrador deben proceder de la base de datos de Supabase o de la configuración del sistema.
- **Prohibido Inventar**: No se permite el uso de datos de "relleno" o placeholders. Si un dato no existe en el sistema, se debe dejar vacío o mostrar un estado de "Pendiente", pero jamás inventar nombres o cifras.
- **Independencia del Dispositivo**: Se prohíbe usar la hora, fecha o configuración regional del dispositivo físico (Laptop, Tablet o TV) como fuente de información. 
    - *Ejemplo*: Las horas de las oraciones en los dashboards de miembros deben calcularse según la zona horaria de la iglesia guardada en el sistema, no según el reloj del teléfono del hermano.
- **Sincronización**: Toda lógica de "tiempo real" debe pasar por el filtro de sincronización geográfica establecido en este documento.

---
_Última actualización: 19 de Abril, 2026_
_Autor: Antigravity (IA) & LLDM Rodeo Team_
