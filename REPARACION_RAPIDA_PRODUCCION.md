# 🚨 REPARACIÓN Y ACTUALIZACIÓN DE PRODUCCIÓN (MANDATO HD)

Este documento registra la solución definitiva a los problemas de desincronización, errores de base de datos y fallas de renderizado en [lldmrodeo.org](https://lldmrodeo.org).

---

## ⚡ PROTOCOLO DE ACTUALIZACIÓN RÁPIDA (ZERO-DELAY) - 18/MAR/2026

Para que el sitio no se rompa al subir el código, **SIEMPRE EJECUTA EL SQL ANTES QUE EL PUSH**.

### 🛡️ PASO 1: REPARAR BASE DE DATOS (SUPER-VITAL)
Copia y pega este bloque en el **SQL Editor de Supabase** y presiona **RUN**:

```sql
-- REPARACIÓN COMPLETA PARA LLDM RODEO v2
ALTER TABLE IF EXISTS app_settings 
ADD COLUMN IF NOT EXISTS display_font_family TEXT DEFAULT 'Outfit',
ADD COLUMN IF NOT EXISTS church_logo_url TEXT DEFAULT '/flama-oficial.svg',
ADD COLUMN IF NOT EXISTS weather_unit TEXT DEFAULT 'fahrenheit';

-- Asegurar políticas de permisos para Administradores
DROP POLICY IF EXISTS "Admin full access settings" ON app_settings;
CREATE POLICY "Admin full access settings" ON app_settings FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Admin', 'Administrador'))));

-- Habilitar Realtime para cambios instantáneos
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE app_settings, profiles, announcements, schedule;
```

### 🚀 PASO 2: SINCRONIZAR CÓDIGO (PUSH)
Ejecuta esto en tu terminal una vez terminada la reparación de la DB:

```bash
# Entrar y subir todo
cd /Users/hardglobal/Documents/LLDM_RODEO_APP
git add .
git commit -m "feat: Premium Font Selector + Anti-Desynchronization Protocol"
git push origin main
```

### 🔄 PASO 3: LIMPIEZA DE CACHÉ (OBLIGATORIO)
Vercel tarda 1-2 minutos en reflejar el cambio. Para ver la nueva versión sin errores:
1.  Espera que Vercel termine el despliegue.
2.  Presiona **`Cmd + Shift + R`** (en Mac) o **`Ctrl + F5`** (en Windows) tanto en el admin como en el display.

---

## 📌 Historial de Cambios (Marzo 2026)
- **18 de Marzo**: Lanzamiento del **Selector de Fuentes Premium** con preview y flechas de teclado.
- **17 de Marzo**: Solución a la excepción de cliente y sincronización de logos.
- **Protocolo HD**: Las modificaciones se suben inmediatamente tras ser validadas.

---

_Documento de cumplimiento obligatorio para Antigravity y Mantenimiento._
