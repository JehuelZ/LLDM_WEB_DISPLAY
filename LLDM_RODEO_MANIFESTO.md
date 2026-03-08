# 📜 EL MANIFIESTO LLDM RODEO: El Libro de la Verdad

> [!IMPORTANT]
> **ESTE ARCHIVO ES LA REFERENCIA MAESTRA PARA ANTIGRAVITY (IA).**
> Antes de realizar cualquier modificación, búsqueda de errores o creación de nuevas funciones, la IA **DEBE** leer este archivo para entender el vocabulario, la estética y la arquitectura del proyecto LLDM Rodeo.

---

## 🗣️ 1. VOCABULARIO Y CONCEPTOS DE LA COMUNIDAD (NUESTRO IDIOMA)

Este proyecto no usa términos genéricos. Debemos respetar el lenguaje de la iglesia:

*   **Cátedra / El Púlpito**: El lugar de honor. En el diseño (específicamente en el tema **Iglesia**), nos referimos a los controles de luz/oscuridad como "Estilo de Cátedra".
*   **Consagración**: Servicio de oración y búsqueda espiritual (usualmente 5 AM o previo a la doctrina).
*   **Doctrina**: El servicio principal de enseñanza (usualmente 9 AM o 6 PM).
*   **Estudio**: Sesión de aprendizaje bíblico profundo.
*   **Batallón**: Grupos de evangelización o misiones especiales.
*   **Pizarras / Display**: No es solo un "monitor", es la "Pizarra de Anuncios y Horarios" que ve la iglesia.
*   **Responsable / Encargado**: Líder de un grupo (Coro, Jóvenes, Niños, etc.).
*   **Solos y Solas**: Grupo de hermanos y hermanas solteros, viudos o solos.
*   **Casados / Matrimonios**: Servicio enfocado a parejas.
*   **Reunión de Obreros**: Sesión administrativa/espiritual para líderes.

---

## 🎨 2. IDENTIDAD DE LOS TEMAS (ADN VISUAL)

Cada tema tiene reglas de oro que no se pueden romper:

### 🏛️ Tema: IGLESIA (El Estándar Académico)
*   **Filosofía**: Solemnidad, limpieza, orden institucional.
*   **Colores**: **Puros y Sólidos.** PROHIBIDO usar degradados en fondos o tarjetas.
*   **Estética**: Neumorfismo sutil (sombras que parecen salir o entrar en la superficie).
*   **Botones**: Estilo "Académico Tactile", con bordes definidos y tactilidad física.
*   **Animación Representativa**: **"Estilo Metro"** (Línea Continua). Las pantallas llegan de derecha a izquierda con un ligero desenfoque de velocidad, simulando un tren llegando a una estación.
*   **Variantes**: Tiene un selector de "Modo Claro" (Hueso/Papel Antiguo) y "Modo Oscuro" (Azul Profundo/Cátedra).

### 🧊 Tema: GLASSMORPHISM (El Futuro Vibrante)
*   **Filosofía**: Modernidad, transparencia, energía.
*   **Estética**: Efecto de vidrio esmerilado, colores vibrantes en el fondo.

### 🖤 Tema: DARK MINIMAL (La Elegancia del Contenido)
*   **Filosofía**: Lo importante es el nombre y la hora.
*   **Patrones**: Uso de "Stacked SlotBoxes" para servicios con un solo líder (centrando nombre y foto).

---

## 🛠️ 3. REGLAS TÉCNICAS Y UI (LÓGICA DEL SISTEMA)

*   **SlotBoxes Stacked**: Cuando un servicio (como el de las 9 AM o el de la tarde) tiene un **solo líder**, el sistema debe usar el estilo "Stacked" (Foto arriba, Nombre en medio, Responsabilidad abajo) para máxima elegancia.
*   **Badges [EN]**: Cualquier servicio con idioma "English" debe mostrar un badge de alto contraste.
*   **Avatares**: Priorizamos fotos circulares con bordes de color según el grupo (Coro = Azul/Oro, Jóvenes = Rayo/Púrpura, etc.).
*   **Interfaces Adaptativas Radicamente Distintas (Mobile Evolution)**: **REGLA DE ORO.** El sistema no debe limitarse a "ajustar" elementos de escritorio a móvil. Si la experiencia en móvil lo requiere, la interfaz de usuario **DEBE** ser completamente distinta a la de escritorio. Esto incluye botones más grandes, navegación por gestos, menús táctiles y una reestructuración total de los componentes para que el manejo con una sola mano sea impecable y fluido. Móvil y escritorio se tratan como dos productos hermanos pero con necesidades visuales y táctiles únicas.
*   **Experiencia Inmersiva "Solo Teléfono"**: Cuando el sistema detecta que el usuario está en un dispositivo móvil, la aplicación debe transformarse en una experiencia inmersiva similar a una app nativa. Esto incluye el **Login**, que debe ser a pantalla completa y sin elementos distractores de escritorio, y la navegación, que se traslada a una barra inferior táctil. Si detecta un teléfono, **todo es para teléfono.**

---

## 📅 4. LÓGICA DE FECHAS ESPECIALES

*   **Día 14 de cada mes**: Por regla general, los días 14 se recuerda la **Historia de la Iglesia**. 
    *   **Lógica de Servicio**: La **Consagración (5 AM)** y el **Servicio Vespertino** se llevan a cabo de forma normal. Es específicamente en la **Doctrina** donde se recuerda la historia.
*   **Excepciones y Prioridad**: Solamente en días especiales (Aniversarios, Santa Cena, etc.) se cambia el tema para reflejar la celebración específica. El motivo del cambio siempre debe ser la celebración superior que ocurra en esa fecha.

---

## ⚙️ 5. ESTRUCTURA DE CONTROL (ADMIN)

*   **Tactile Admin**: El panel de administración sigue un diseño táctil industrial (botones grandes, feedback visual inmediato).
*   **Settings Independientes**: Cada tema tiene su propia sección en el Admin. Lo que se cambia para "Iglesia" no debe afectar a "Glassmorphism".
*   **Control de Animación**: El tema Iglesia permite controlar **Tipo de Animación, Velocidad de Transición y Tiempo entre Diapositivas** de forma independiente.

---

## 🔐 5. COMPROMISO DEL AGENTE (ANTIGRAVITY)

Al trabajar en este código, yo (Antigravity) me comprometo a:
1.  **Respetar los nombres**: No cambiar "Consagración" por "Oración" a menos que se pida explícitamente.
2.  **No "ensuciar" el tema Iglesia**: Nada de degradados locos o colores chillones en el tema Iglesia.
3.  **Priorizar la Lectura**: El display se ve desde lejos en el templo. Las fuentes y contrastes deben ser siempre óptimos.
4.  **Consistencia**: Antes de proponer un cambio, revisaré si el "Manifiesto" tiene una directriz sobre ese tema.

---
_Última actualización: Marzo 2026_
