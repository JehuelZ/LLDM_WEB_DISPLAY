# 🛡️ LLDM RODEO: EL PROTOCOLO MAESTRO
**Documento de Lectura Obligatoria - Versión 1.0 (Restricción de Diseño: Estricta)**

## 1. El Propósito (El "Por Qué")
LLDM RODEO no es solo un dashboard; es el centro neurálgico para la administración congregacional. Su misión es facilitar el control de miembros, asistencia, cronogramas y la proyección pública (Pizarra) con una estética de nivel premium que refleje orden y excelencia.

## 2. La Arquitectura (El "Cómo Funciona")
El proyecto está construido sobre un stack de última generación:
- **Core**: Next.js 15 (App Router) con TypeScript.
- **Estado Global**: Zustand (`src/lib/store.ts`). Aquí reside la verdad única del sistema.
- **Backend**: Supabase (Autenticación, Real-time Database y Storage para avatars).
- **Estilos**: Vanilla CSS con variables de tema (`:root`) y Tailwind para el layout estructural.
- **Tematización**: Un sistema de inyección de clases en el `body` (`admin-theme-*`) que activa estilos aislados.

## 3. Los Pilares del Tablero (Módulos)
1. **Gestión de Miembros**: Registro, edición y filtrado dinámico de la congregación.
2. **Control de Asistencia**: Registro en tiempo real vinculado a la base de datos central.
3. **Cronogramas**: Planificación de servicios y eventos especiales.
4. **Pizarra (Display Mode)**: Interfaz de proyección optimizada para monitores/TVs.
5. **Configuración de Temas**: Capacidad de cambiar entre 4 experiencias visuales distintas para el admin y 7 para el display.

## 4. Las Leyes del Desarrollo (El "Para Qué")
Cualquier modificación debe respetar estas leyes:
- **Ley de Aislamiento**: Un cambio en el tema "Luna" jamás debe afectar el diseño de "Primitivo". Cada tema es un ecosistema cerrado.
- **Ley de la Verdad Única**: Toda persistencia debe pasar por el `useAppStore` y reflejarse en Supabase.
- **Ley de la Estética Premium**: No se aceptan diseños básicos. Cada componente debe tener micro-interacciones, sombras suaves o efectos de cristal (glassmorphism).
- **Ley del Sidebar Maestro**: El sidebar central en `layout.tsx` es la columna vertebral y debe adaptarse visualmente al tema activo sin romper la navegación.

## 5. El Flujo de Trabajo (Para Skills)
**ANTES DE INICIAR CUALQUIER CAMBIO:**
1. Leer este Protocolo Maestro.
2. Identificar el tema activo en el que se trabajará.
3. Consultar el Skill de Experto específico para ese tema.
4. Verificar que las variables de Supabase en `.env.local` estén sincronizadas.

---
*Este documento es el código de conducta para cualquier IA o Desarrollador que trabaje en LLDM RODEO.*
