# 🏗️ LLDM Rodeo Board: Technical Blueprint & Zero-to-Hero Guide

> **Fecha:** Abril 2026
> **Objetivo:** Documentación exhaustiva para reconstruir o continuar el desarrollo del ecosistema LLDM Rodeo Board desde cero.

---

## 🧭 1. Visión General
**LLDM Rodeo Board** no es solo una página web; es un **Sistema de Inteligencia Litúrgica y Gestión Ministerial**. Su propósito es centralizar la programación de servicios, el control de asistencia, la comunicación ministerial y la visualización de información en pantallas de alta fidelidad (Displays) para la comunidad.

### Filosofía de Diseño
- **Tactilidad**: Interfaces que "se sienten" físicas mediante sombras, relieves y feedback táctil.
- **Solemnidad**: Estética académica y respetuosa, evitando diseños genéricos.
- **Real-Time**: Sincronización instantánea entre el Administrador, el Ministro y las Pantallas de la Iglesia.

---

## 🛠️ 2. Stack Tecnológico
Para replicar este proyecto, se han utilizado las siguientes tecnologías de vanguardia:

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) con React 19.
- **Backend/Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime + Storage + Auth).
- **Estado Global**: [Zustand](https://github.com/pmndrs/zustand) con persistencia local y sincronización en la nube.
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) para transiciones suaves y dinámicas.
- **Estilos**: Tailwind CSS v4 para utilidades y CSS Vanilla para componentes de temas.
- **Iconografía**: [Lucide React](https://lucide.dev/).

---

## 📁 3. Estructura del Proyecto
```text
.
├── src/
│   ├── app/                    # Rutas de Next.js
│   │   ├── admin/              # Consola Tactile de Administración
│   │   ├── dashboard/          # Ecosistema del Ministro y Miembro
│   │   ├── display/            # Página principal de pantallas (Slides)
│   │   ├── login/              # Sistema de acceso (Google / PIN)
│   │   └── tv/                 # Vista ligera optimizada para Smart TVs
│   ├── themes/                 # Lógica de los Temas Visuales (Cátedra, Cristal, etc.)
│   │   └── Iglesia/            # Tema Cátedra (Sombras neumórficas, Mega-Box)
│   ├── lib/                    # Lógica central
│   │   ├── store.ts            # El "Cerebro" (Zustand + Supabase Sync)
│   │   ├── supabaseClient.ts   # Conexión con Supabase
│   │   └── types.ts            # Definiciones de TypeScript
│   ├── components/             # Componentes reutilizables (Botones Tactile, Avatares)
│   └── hooks/                  # Lógica de estado compartida
├── supabase/                   # Migraciones y esquemas (SQL)
└── scripts/                    # Utilidades de migración y carga de datos
```

---

## 💾 4. Base de Datos (El Cimiento)
El sistema utiliza Supabase. Lo más crítico es la tabla `profiles` y la lógica de vinculación.

### Tablas Principales
1.  **`profiles`**: Almacena a cada hermano. Soporta **pre-registro** (el admin crea al hermano con su email, y cuando el hermano inicia sesión con Google, su cuenta se vincula automáticamente mediante un `TRIGGER` SQL).
2.  **`schedule`**: Almacena la programación diaria (Líderes de 5 AM, 9 AM, 12 PM y Tarde).
3.  **`announcements`**: Anuncios con prioridad y categorías.
4.  **`attendance_records`**: Registro de entrada/asistencia sincronizado.
5.  **`app_settings`**: Configuración global del sistema (Color primario, tema activo, clima, etc.).

### Lógica de Seguridad (RLS)
El sistema está "endurecido" mediante políticas de Supabase:
- Solo los administradores pueden editar horarios.
- Solo los ministros pueden ver el "Radar de Ausencias".
- Los miembros pueden editar sus propios perfiles (Bio/Avatar).

---

## 🧠 5. El Corazón: `store.ts` (Zustand)
Toda la lógica de la aplicación vive en `src/lib/store.ts`. El `useAppStore` hace tres cosas críticas:
1.  **Persistencia**: Guarda datos en `localStorage` para que la app cargue instantáneamente.
2.  **Nube**: Sincroniza cada cambio con Supabase mediante funciones como `saveSettingsToCloud`.
3.  **Real-Time**: Se suscribe a los cambios en la DB. Si el admin cambia un nombre en su oficina, la TV se actualiza sola en 1 segundo.

---

## ⛪ 6. Sistemas Core

### A. Gestión de Miembros
Ubicado en `src/app/admin/tabs/MiembrosTab.tsx`.
- Soporta búsqueda inteligente, filtrado por categorías (Varones, Hermanas, Niños) y grupos de censo.
- **Ficha Personal**: Botón que genera un PDF profesional con la biografía y métricas del hermano.

### B. Consola del Administrador (Tactile)
Un centro de mando con navegación por pestañas (`admin/TactileAdmin.tsx`):
- **Agenda**: Calendario interactivo para asignar líderes mediante drag-and-drop o selectores táctiles.
- **Inteligencia**: Gráficos de asistencia y métricas comparativas.
- **Configuración**: Control total del look & feel de la iglesia.

### C. Ecosistema del Ministro
Diseñado para la toma de decisiones espirituales:
- **Radar de Ausencias**: Algoritmo que destaca en rojo a quienes no han asistido últimamente.
- **Buzón de Intercesión**: Recepción de peticiones de oración urgentes.

### D. Tema Cátedra (Display System)
La joya de la corona visual (`src/themes/Iglesia/`):
- **Mega Intelligence Box**: Un header unificado que muestra el logo, el clima local (API externa), el tema de la semana y la hora.
- **Layout Horizontal**: Los perfiles de ministros usan un diseño de "Avatar a la derecha, Info a la izquierda" para mayor legibilidad.

---

## 🚀 7. Guía de Configuración (Desde Cero)

### 1. Requisitos Previos
- Node.js 18+ instalado.
- Cuenta en [Supabase](https://supabase.com/).
- Proyecto configurado en [Google Cloud Console](https://console.cloud.google.com/) para el Login (OAuth).

### 2. Instalación
```bash
git clone https://github.com/JehuelZ/LLDM_WEB_DISPLAY
cd LLDM_WEB_DISPLAY
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon_de_supabase
```

### 4. Inicialización de Base de Datos
Copia y ejecuta el contenido de los archivos `.sql` en el editor SQL de Supabase (especialmente `supabase_schema.sql`).

### 5. Despliegue
Conecta el repositorio a **Vercel**. Automáticamente detectará Next.js y desplegará el sistema.

---

## 🛡️ 8. Reglas de Oro para el Futuro
Si deseas continuar este proyecto:
1.  **Nunca rompas la estética Tactile**: Usa los tokens de `src/themes/Iglesia/tokens.ts`.
2.  **Respeto al Vocabulario**: Consulta `VOCABULARIO_COMUNIDAD.md`.
3.  **Producción Primero**: Asegúrate de que los cambios funcionen en pantallas de 1080p y 4K (TVs).

---
*Este documento es la brújula para los que vendrán después. La obra es grande, pero el sistema está listo.*
