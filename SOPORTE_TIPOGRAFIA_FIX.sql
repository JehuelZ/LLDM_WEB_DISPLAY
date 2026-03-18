-- =============================================
-- REPARACIÓN COMPLETA PARA LLDM RODEO v2 (18/MAR/2026)
-- Objetivo: Asegurar todas las columnas para el nuevo selector de fuentes y logos.
-- INSTRUCCIONES: Ejecutar en el Editor SQL de Supabase y darle a RUN.
-- =============================================

ALTER TABLE IF EXISTS app_settings 
ADD COLUMN IF NOT EXISTS display_font_family TEXT DEFAULT 'Outfit',
ADD COLUMN IF NOT EXISTS church_logo_url TEXT DEFAULT '/flama-oficial.svg',
ADD COLUMN IF NOT EXISTS weather_unit TEXT DEFAULT 'fahrenheit';

-- Forzar refresco si ya existía pero daba problemas de caché
COMMENT ON COLUMN app_settings.display_font_family IS 'Fuente global del sistema y proyección (v2.5 Premium Select)';

-- Registro único ID=1
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Habilitar permisos de administrador para lectura/escritura total
DROP POLICY IF EXISTS "Admin full access settings" ON app_settings;
CREATE POLICY "Admin full access settings" ON app_settings FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Admin', 'Administrador'))));

-- Habilitar Realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE app_settings, profiles, announcements, schedule;
