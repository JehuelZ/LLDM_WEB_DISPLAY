-- =============================================
-- REPARACIÓN: Soporte de Tipografía Personalizada
-- Objetivo: Añadir la columna faltante para guardar fuentes de Google
-- INSTRUCCIONES: Ejecutar en el Editor SQL de Supabase y darle a RUN.
-- =============================================

ALTER TABLE IF EXISTS app_settings 
ADD COLUMN IF NOT EXISTS display_font_family TEXT DEFAULT 'outfit';

-- Forzar refresco si ya existía pero daba problemas de caché
COMMENT ON COLUMN app_settings.display_font_family IS 'Fuente global del sistema y proyección';
