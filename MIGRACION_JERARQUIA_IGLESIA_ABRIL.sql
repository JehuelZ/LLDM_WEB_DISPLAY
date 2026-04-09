-- =============================================
-- LLDM RODEO - MIGRACIÓN: JERARQUÍA DE IGLESIAS Y FILTROS AVANZADOS
-- Objetivo: Actualizar el schema para soportar Misiones (Obras) y ajustes de visibilidad.
-- INSTRUCCIONES: Copia este código, pégalo en el SQL Editor de Supabase y presiona RUN.
-- =============================================

-- 1. ACTUALIZACIÓN DE TABLA: PROFILES (Miembros)
-- Soporte para congregaciones y filtros de visualización
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS assigned_church TEXT DEFAULT 'Principal',
ADD COLUMN IF NOT EXISTS hide_from_attendance BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hide_from_membership_count BOOLEAN DEFAULT FALSE;

-- Comentarios para documentación en Supabase
COMMENT ON COLUMN public.profiles.assigned_church IS 'Nombre de la congregación a la que pertenece (Principal o Misión).';
COMMENT ON COLUMN public.profiles.hide_from_attendance IS 'Si es TRUE, el miembro no aparecerá en las listas de pase de lista.';
COMMENT ON COLUMN public.profiles.hide_from_membership_count IS 'Si es TRUE, el miembro no se contará en las estadísticas totales del dashboard.';

-- 2. ACTUALIZACIÓN DE TABLA: APP_SETTINGS (Configuración Global)
-- Soporte para gestión de la jerarquía de iglesias
ALTER TABLE public.app_settings 
ADD COLUMN IF NOT EXISTS main_church_name TEXT DEFAULT 'Rodeo CA',
ADD COLUMN IF NOT EXISTS main_church_obj JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS missions JSONB DEFAULT '[]';

-- Comentarios para documentación en Supabase
COMMENT ON COLUMN public.app_settings.main_church_name IS 'Nombre legible de la iglesia principal.';
COMMENT ON COLUMN public.app_settings.main_church_obj IS 'Metadatos de la congregación principal (dirección, encargado, etc).';
COMMENT ON COLUMN public.app_settings.missions IS 'Arreglo de objetos o strings con la lista de misiones/obras dependientes.';

-- 3. MIGRACIÓN DE DATOS EXISTENTES
-- Asegurar que todos los miembros actuales tengan una congregación asignada por defecto
UPDATE public.profiles 
SET assigned_church = 'Principal' 
WHERE assigned_church IS NULL;

-- 4. VERIFICACIÓN DE ÉXITO
DO $$ 
BEGIN 
    RAISE NOTICE 'Migración de Jerarquía Eclesiástica completada exitosamente.'; 
END $$;
