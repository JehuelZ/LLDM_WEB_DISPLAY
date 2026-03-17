---
description: Inicio rápido y estado del proyecto LLDM Rodeo
---

# LLDM Rodeo Board - Workflow de Continuación

Este proyecto es una pizarra digital para LLDM Rodeo. Sigue estos pasos para estar listo en menos de 1 minuto:

### 1. Entorno de Desarrollo
// turbo
1. Ejecuta el servidor de desarrollo con la ruta correcta de Node:
   `PATH="/Users/hardglobal/pinokio/bin/miniconda/bin:$PATH" npm run dev`

### 2. Rutas Críticas
- **Proyecto (fuente única)**: `/Users/hardglobal/Documents/LLDM_RODEO_APP`
- **Node/NPM Path**: `/Users/hardglobal/pinokio/bin/miniconda/bin`
- **Páginas Principales**: `/admin` (Gestión) y `/display` (Pizarra)
- **URL Local**: `http://localhost:3000`

### 3. Notas Importantes
- El proyecto fue migrado de Google Drive a `/Users/hardglobal/Documents/LLDM_RODEO_APP` (Marzo 2026).
- Node/npm NO está en el PATH del sistema por defecto; siempre usar el prefijo `PATH=...` al ejecutar comandos npm.
- Para evitar errores `env: node: No such file or directory`, SIEMPRE anteponer `PATH="/Users/hardglobal/pinokio/bin/miniconda/bin:$PATH"` a cualquier comando npm.

### 4. Estado Actual (Marzo 2026)
- **Weather Widget**: Selector de ciudad con geocodificación en el panel admin.
- **Temas**: DarkMinimal, NeonForge, TechCorporate activos.
- **Admin**: Agrupación de miembros por categoría (sidebar con filtros).
- **Estándares**: Readability standards establecidos para calendario y vista semanal.

### 5. Próximos Pasos Comunes
- Verificar que el carrusel de la pizarra funcione en `/display`.
- Revisar el weather widget con la ciudad configurada en `/admin`.
