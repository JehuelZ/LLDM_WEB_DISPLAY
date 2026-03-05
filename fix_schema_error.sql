-- =============================================
-- FIX: Renombrar columna 'group' a 'member_group'
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Intentar renombrar la columna si existe bajo el nombre antiguo
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'group') THEN
    ALTER TABLE profiles RENAME COLUMN "group" TO member_group;
  END IF;
END $$;

-- 2. Asegurarse de que la columna existe (si no existía ninguna)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_group TEXT;

-- 3. Refrescar el caché de PostgREST (esto sucede automáticamente en Supabase al hacer cambios de schema, 
-- pero por si acaso, el error que ves indica que el cache no conoce la columna aún)
